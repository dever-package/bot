package processor

import (
	"context"
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontupload "github.com/dever-package/front/service/upload"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

type SpeechTimelineTrack struct {
	ID        string
	Audio     string
	StartTime float64
	Mix       bool
}

type SpeechTimelineInput struct {
	RequestID string
	Duration  float64
	Tracks    []SpeechTimelineTrack
}

type SpeechTimelineResult struct {
	URL      string
	Duration float64
}

type ffmpegSpeechInterval struct {
	ID        string
	StartTime float64
	Duration  float64
}

type preparedSpeechTimelineTrack struct {
	Track    SpeechTimelineTrack
	Path     string
	Duration float64
}

// BuildSpeechTimelineAudio creates one full-shot audio track while validating
// every supplied speech interval. Tracks with Mix=false participate only in
// validation, which lets lip-sync consume visible dialogue without overlooking
// narration or off-screen speech conflicts.
func BuildSpeechTimelineAudio(ctx context.Context, input SpeechTimelineInput) (SpeechTimelineResult, error) {
	if input.Duration < 0.1 || math.IsNaN(input.Duration) || math.IsInf(input.Duration, 0) {
		return SpeechTimelineResult{}, fmt.Errorf("镜头时长无效")
	}
	if len(input.Tracks) == 0 {
		return SpeechTimelineResult{}, fmt.Errorf("口型同步缺少配音")
	}
	ffmpegPath, err := exec.LookPath("ffmpeg")
	if err != nil {
		return SpeechTimelineResult{}, fmt.Errorf("当前服务器未安装 FFmpeg，无法生成口型驱动音轨")
	}
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return SpeechTimelineResult{}, fmt.Errorf("当前服务器未安装 ffprobe，无法校验配音时长")
	}

	prepared, err := prepareSpeechTimelineTracks(ctx, ffprobePath, input)
	if err != nil {
		return SpeechTimelineResult{}, err
	}
	workspace, err := os.MkdirTemp("", "energon-speech-timeline-")
	if err != nil {
		return SpeechTimelineResult{}, fmt.Errorf("创建口型驱动音轨临时目录失败: %w", err)
	}
	defer os.RemoveAll(workspace)

	outputPath := filepath.Join(workspace, "timeline.m4a")
	args, err := buildSpeechTimelineArgs(outputPath, input.Duration, prepared)
	if err != nil {
		return SpeechTimelineResult{}, err
	}
	if err := runFFmpegCommand(ctx, ffmpegPath, args, nil); err != nil {
		return SpeechTimelineResult{}, fmt.Errorf("生成口型驱动音轨失败: %w", err)
	}

	file, err := frontupload.ImportFile(ctx, frontupload.ImportFileInput{
		RuleID:    ffmpegAudioRuleID,
		Kind:      botprotocol.MediaTypeAudio,
		Name:      speechTimelineOutputName(input.RequestID),
		Mime:      "audio/mp4",
		LocalPath: outputPath,
		BizKey:    "energon",
		BizName:   "口型驱动音轨",
	})
	if err != nil {
		return SpeechTimelineResult{}, fmt.Errorf("保存口型驱动音轨失败: %w", err)
	}
	payload := uploadrepo.BuildUploadFilePayload(file)
	fileURL := strings.TrimSpace(botprotocol.AsText(payload["url"]))
	if fileURL == "" {
		return SpeechTimelineResult{}, fmt.Errorf("保存口型驱动音轨后未返回文件地址")
	}
	return SpeechTimelineResult{URL: fileURL, Duration: input.Duration}, nil
}

func prepareSpeechTimelineTracks(
	ctx context.Context,
	ffprobePath string,
	input SpeechTimelineInput,
) ([]preparedSpeechTimelineTrack, error) {
	prepared := make([]preparedSpeechTimelineTrack, 0, len(input.Tracks))
	intervals := make([]ffmpegSpeechInterval, 0, len(input.Tracks))
	usedIDs := map[string]bool{}
	mixed := 0
	for index, track := range input.Tracks {
		track.ID = strings.TrimSpace(track.ID)
		if track.ID == "" || usedIDs[track.ID] {
			return nil, fmt.Errorf("第 %d 条配音标识无效", index+1)
		}
		usedIDs[track.ID] = true
		if track.StartTime < 0 || track.StartTime >= input.Duration {
			return nil, fmt.Errorf("配音“%s”开始时间超出镜头范围", track.ID)
		}
		audioPath, err := resolveLocalMediaPath(track.Audio)
		if err != nil {
			return nil, fmt.Errorf("读取配音“%s”失败: %w", track.ID, err)
		}
		probe, err := probeFFmpegMedia(ctx, ffprobePath, audioPath)
		if err != nil {
			return nil, fmt.Errorf("读取配音“%s”信息失败: %w", track.ID, err)
		}
		if !probe.HasAudio || probe.Duration <= 0 {
			return nil, fmt.Errorf("配音“%s”不是有效音频", track.ID)
		}
		if track.StartTime+probe.Duration > input.Duration+0.02 {
			return nil, fmt.Errorf(
				"配音“%s”在 %.2f 秒结束，超过镜头 %.2f 秒时长",
				track.ID,
				track.StartTime+probe.Duration,
				input.Duration,
			)
		}
		prepared = append(prepared, preparedSpeechTimelineTrack{
			Track:    track,
			Path:     audioPath,
			Duration: probe.Duration,
		})
		intervals = append(intervals, ffmpegSpeechInterval{
			ID:        track.ID,
			StartTime: track.StartTime,
			Duration:  probe.Duration,
		})
		if track.Mix {
			mixed++
		}
	}
	if err := validateFFmpegSpeechIntervals("当前镜头", intervals); err != nil {
		return nil, err
	}
	if mixed == 0 {
		return nil, fmt.Errorf("当前镜头没有需要同步口型的可见对白")
	}
	return prepared, nil
}

func buildSpeechTimelineArgs(
	outputPath string,
	duration float64,
	tracks []preparedSpeechTimelineTrack,
) ([]string, error) {
	args := []string{"-hide_banner", "-loglevel", "error", "-progress", "pipe:1", "-nostats"}
	filters := []string{
		fmt.Sprintf(
			"anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=%s,asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[base]",
			formatFFmpegSeconds(duration),
		),
	}
	mixInputs := []string{"[base]"}
	inputIndex := 0
	for _, prepared := range tracks {
		if !prepared.Track.Mix {
			continue
		}
		args = append(args, "-i", prepared.Path)
		label := fmt.Sprintf("speech%d", inputIndex)
		delayMS := int64(math.Round(prepared.Track.StartTime * 1000))
		filters = append(filters, fmt.Sprintf(
			"[%d:a:0]atrim=duration=%s,asetpts=PTS-STARTPTS,aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,adelay=%d|%d,apad,atrim=duration=%s[%s]",
			inputIndex,
			formatFFmpegSeconds(prepared.Duration),
			delayMS,
			delayMS,
			formatFFmpegSeconds(duration),
			label,
		))
		mixInputs = append(mixInputs, "["+label+"]")
		inputIndex++
	}
	if inputIndex == 0 {
		return nil, fmt.Errorf("当前镜头没有需要同步口型的可见对白")
	}
	filters = append(filters, fmt.Sprintf(
		"%samix=inputs=%d:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.95,atrim=duration=%s[out]",
		strings.Join(mixInputs, ""),
		len(mixInputs),
		formatFFmpegSeconds(duration),
	))
	args = append(args,
		"-filter_complex", strings.Join(filters, ";"),
		"-map", "[out]",
		"-c:a", "aac",
		"-b:a", "192k",
		"-movflags", "+faststart",
		"-y", outputPath,
	)
	return args, nil
}

func validateFFmpegSpeechIntervals(label string, intervals []ffmpegSpeechInterval) error {
	ordered := append([]ffmpegSpeechInterval(nil), intervals...)
	sort.SliceStable(ordered, func(left, right int) bool {
		return ordered[left].StartTime < ordered[right].StartTime
	})
	for index := 1; index < len(ordered); index++ {
		previous := ordered[index-1]
		current := ordered[index]
		if current.StartTime < previous.StartTime+previous.Duration-0.01 {
			return fmt.Errorf(
				"%s语音“%s”与“%s”时间重叠",
				label,
				previous.ID,
				current.ID,
			)
		}
	}
	return nil
}

func speechTimelineOutputName(requestID string) string {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		requestID = strconv.Itoa(os.Getpid())
	}
	return "lip-sync-timeline-" + requestID + ".m4a"
}
