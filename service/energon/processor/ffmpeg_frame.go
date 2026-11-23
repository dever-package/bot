package processor

import (
	"context"
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontupload "github.com/dever-package/front/service/upload"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const videoReviewSheetDuration = 5.5

type VideoReviewSheet struct {
	URL         string
	SampleTimes []float64
}

type VideoReviewEdge struct {
	Sheet    VideoReviewSheet
	SafeCuts []int
}

type VideoReviewEdges struct {
	Head     VideoReviewEdge
	Tail     VideoReviewEdge
	Duration float64
}

type ffmpegVideoReviewMedia struct {
	ffmpegPath string
	workspace  string
	videoPath  string
	probe      ffmpegMediaProbe
	duration   float64
}

func openFFmpegVideoReviewMedia(ctx context.Context, videoURL string) (media ffmpegVideoReviewMedia, err error) {
	media.ffmpegPath, err = exec.LookPath("ffmpeg")
	if err != nil {
		return media, err
	}
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return media, err
	}
	media.workspace, err = os.MkdirTemp("", "energon-video-review-")
	if err != nil {
		return media, err
	}
	defer func() {
		if err != nil {
			os.RemoveAll(media.workspace)
		}
	}()
	media.videoPath, err = newFFmpegMediaResolver(ctx, media.workspace).Resolve(videoURL)
	if err != nil {
		return media, err
	}
	media.probe, err = probeFFmpegMedia(ctx, ffprobePath, media.videoPath)
	if err != nil {
		return media, err
	}
	media.duration = media.probe.VideoDuration
	if media.duration <= 0 {
		media.duration = media.probe.Duration
	}
	if !media.probe.HasVideo || media.duration <= 0 {
		return media, fmt.Errorf("无法从无效视频提取核验画面")
	}
	return media, nil
}

func ExtractVideoReviewSheets(ctx context.Context, videoURL, requestID string, requireSpeech bool) ([]VideoReviewSheet, error) {
	media, err := openFFmpegVideoReviewMedia(ctx, videoURL)
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(media.workspace)
	if requireSpeech {
		if _, err := media.reviewOriginalSound(ctx, true); err != nil {
			return nil, err
		}
	}
	duration := media.duration
	count := int(math.Ceil(duration / videoReviewSheetDuration))
	sheets := make([]VideoReviewSheet, 0, count)
	for index := range count {
		start := duration * float64(index) / float64(count)
		end := duration * float64(index+1) / float64(count)
		times := videoReviewSampleTimes(start, end)
		name := fmt.Sprintf("%s-review-%d.jpg", strings.TrimSuffix(ffmpegOutputName(requestID), ".mp4"), len(sheets)+1)
		sheet, err := media.reviewSheet(ctx, name, times)
		if err != nil {
			return nil, err
		}
		sheets = append(sheets, sheet)
	}
	return sheets, nil
}

func (media ffmpegVideoReviewMedia) reviewSheet(ctx context.Context, name string, times []float64) (VideoReviewSheet, error) {
	output := filepath.Join(media.workspace, name)
	if err := writeFFmpegVideoReviewSheet(ctx, media.ffmpegPath, media.videoPath, output, times); err != nil {
		return VideoReviewSheet{}, err
	}
	url, err := importFFmpegVideoFrame(ctx, output, name, "视频核验")
	if err != nil {
		return VideoReviewSheet{}, err
	}
	return VideoReviewSheet{URL: url, SampleTimes: times}, nil
}

func ExtractVideoLastFrame(ctx context.Context, videoURL, requestID string) (string, error) {
	media, err := openFFmpegVideoReviewMedia(ctx, videoURL)
	if err != nil {
		return "", err
	}
	defer os.RemoveAll(media.workspace)
	name := strings.TrimSuffix(ffmpegOutputName(requestID), ".mp4") + "-last-frame.jpg"
	output := filepath.Join(media.workspace, name)
	if err := writeFFmpegVideoLastFrame(ctx, media.ffmpegPath, media.videoPath, output); err != nil {
		return "", err
	}
	return importFFmpegVideoFrame(ctx, output, name, "镜头续接尾帧")
}

func writeFFmpegVideoLastFrame(ctx context.Context, ffmpegPath, videoPath, output string) error {
	command := exec.CommandContext(ctx, ffmpegPath, "-hide_banner", "-loglevel", "error", "-nostdin", "-i", videoPath, "-map", "0:v:0", "-fps_mode", "passthrough", "-q:v", "2", "-update", "1", "-y", output)
	if raw, err := command.CombinedOutput(); err != nil {
		return fmt.Errorf("提取视频最后一帧失败：%w: %s", err, strings.TrimSpace(string(raw)))
	}
	return nil
}

func importFFmpegVideoFrame(ctx context.Context, output, name, purpose string) (string, error) {
	file, err := frontupload.ImportFile(ctx, frontupload.ImportFileInput{RuleID: ffmpegImageRuleID, Kind: botprotocol.MediaTypeImage, Name: name, Mime: "image/jpeg", LocalPath: output, BizKey: "energon", BizName: purpose})
	if err != nil {
		return "", err
	}
	url := strings.TrimSpace(botprotocol.AsText(uploadrepo.BuildUploadFilePayload(file)["url"]))
	if url == "" {
		return "", fmt.Errorf("保存%s后未返回文件地址", purpose)
	}
	return url, nil
}

func ExtractVideoReviewEdges(ctx context.Context, videoURL, requestID string, head, tail, protectDialogue bool) (VideoReviewEdges, error) {
	media, err := openFFmpegVideoReviewMedia(ctx, videoURL)
	if err != nil {
		return VideoReviewEdges{}, err
	}
	defer os.RemoveAll(media.workspace)
	var silence []ffmpegReviewSilence
	if protectDialogue || head || tail {
		silence, err = media.reviewOriginalSound(ctx, protectDialogue)
		if err != nil {
			return VideoReviewEdges{}, err
		}
	}
	window := min(0.8, media.duration*0.16)
	name := strings.TrimSuffix(ffmpegOutputName(requestID), ".mp4")
	result := VideoReviewEdges{Duration: media.duration}
	for _, isHead := range []bool{true, false} {
		if (isHead && !head) || (!isHead && !tail) {
			continue
		}
		start, label := media.duration-window, "tail"
		if isHead {
			start, label = 0, "head"
		}
		times := make([]float64, 5)
		for index := range times {
			times[index] = start + window*float64(index)/4
		}
		sheet, err := media.reviewSheet(ctx, name+"-"+label+".jpg", times)
		if err != nil {
			return VideoReviewEdges{}, err
		}
		edge := VideoReviewEdge{Sheet: sheet}
		for index, seconds := range times {
			from, to := seconds, media.duration
			if isHead {
				from, to = 0, seconds
			}
			if to-from < 0.001 || (!protectDialogue && reviewRangeSilent(silence, from, to)) {
				edge.SafeCuts = append(edge.SafeCuts, index+1)
			}
		}
		if isHead {
			result.Head = edge
		} else {
			result.Tail = edge
		}
	}
	return result, nil
}

type ffmpegReviewSilence struct{ start, end float64 }

var ffmpegReviewSilenceEvent = regexp.MustCompile(`silence_(start|end): ([-+0-9.eE]+)`)

func (media ffmpegVideoReviewMedia) reviewOriginalSound(ctx context.Context, requireSpeech bool) ([]ffmpegReviewSilence, error) {
	if !media.probe.HasAudio {
		if requireSpeech {
			return nil, fmt.Errorf("镜头有计划对白，但视频没有原声音轨")
		}
		return nil, nil
	}
	silence, err := media.reviewSilence(ctx)
	if err != nil {
		return nil, err
	}
	audioEnd := media.duration
	if media.probe.AudioDuration > 0 {
		audioEnd = min(audioEnd, media.probe.AudioDuration)
	}
	if requireSpeech && reviewRangeSilent(silence, 0, audioEnd) {
		return nil, fmt.Errorf("镜头有计划对白，但原声音轨全段静音")
	}
	return silence, nil
}

func (media ffmpegVideoReviewMedia) reviewSilence(ctx context.Context) ([]ffmpegReviewSilence, error) {
	command := exec.CommandContext(ctx, media.ffmpegPath, "-hide_banner", "-loglevel", "info", "-nostats", "-i", media.videoPath, "-map", "0:a:0", "-af", "silencedetect=n=-60dB:d=0.08", "-f", "null", "-")
	raw, err := command.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("检测镜头原声静音区间失败：%w: %s", err, strings.TrimSpace(string(raw)))
	}
	var intervals []ffmpegReviewSilence
	var start float64
	started := false
	for _, event := range ffmpegReviewSilenceEvent.FindAllStringSubmatch(string(raw), -1) {
		seconds, err := strconv.ParseFloat(event[2], 64)
		if err != nil {
			return nil, fmt.Errorf("镜头原声静音时间无效：%w", err)
		}
		if event[1] == "start" {
			start, started = seconds, true
		} else if started {
			intervals = append(intervals, ffmpegReviewSilence{start, seconds})
			started = false
		}
	}
	return intervals, nil
}

func reviewRangeSilent(silence []ffmpegReviewSilence, start, end float64) bool {
	for _, interval := range silence {
		if interval.start <= start+0.001 && interval.end >= end-0.001 {
			return true
		}
	}
	return false
}

func videoReviewSampleTimes(start, end float64) []float64 {
	samples := int(math.Ceil((end-start)*2)) + 1
	times := make([]float64, samples)
	for index := range times {
		times[index] = start + (end-start)*float64(index)/float64(samples-1)
	}
	return times
}

func writeFFmpegVideoReviewSheet(ctx context.Context, ffmpegPath, videoPath, output string, times []float64) error {
	samples := len(times)
	start, end := times[0], times[samples-1]
	filter := fmt.Sprintf("[0:v]trim=start=%s:end=%s,setpts=PTS-STARTPTS,scale=640:-2,setsar=1,split=2[body][tail];[body]fps=fps=%d/%s:start_time=0:round=up,trim=end_frame=%d,tile=3x%d:nb_frames=%d[grid];[tail]reverse,trim=end_frame=1,setpts=PTS-STARTPTS[exit];[grid][exit]overlay=x=%d:y=%d*overlay_h:shortest=1[out]", formatFFmpegSeconds(start), formatFFmpegSeconds(end), samples-1, formatFFmpegSeconds(end-start), samples-1, (samples+2)/3, samples-1, ((samples-1)%3)*640, (samples-1)/3)
	command := exec.CommandContext(ctx, ffmpegPath, "-hide_banner", "-loglevel", "error", "-i", videoPath, "-filter_complex", filter, "-map", "[out]", "-frames:v", "1", "-q:v", "2", "-y", output)
	if raw, err := command.CombinedOutput(); err != nil {
		return fmt.Errorf("提取视频核验画面失败：%w: %s", err, strings.TrimSpace(string(raw)))
	}
	return nil
}
