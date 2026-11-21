package processor

import (
	"context"
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontupload "github.com/dever-package/front/service/upload"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const VideoReviewSheetDuration = 5.5 // At most twelve samples, no more than 0.5s apart.

type VideoTailFrameInput struct {
	StartTime float64
	VideoURL  string
	RequestID string
	EndTime   float64 // End of the displayed clip; zero uses the source end.
}

// ExtractVideoReviewSheet preserves real video samples, including its actual
// displayed tail. No generated keyframe can stand in for these observations.
func ExtractVideoReviewSheet(ctx context.Context, input VideoTailFrameInput) (map[string]any, error) {
	ffmpegPath, err := exec.LookPath("ffmpeg")
	if err != nil {
		return nil, err
	}
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return nil, err
	}
	workspace, err := os.MkdirTemp("", "energon-video-review-")
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(workspace)
	videoPath, err := newFFmpegMediaResolver(ctx, workspace).Resolve(input.VideoURL)
	if err != nil {
		return nil, err
	}
	probe, err := probeFFmpegMedia(ctx, ffprobePath, videoPath)
	if err != nil {
		return nil, err
	}
	if !probe.HasVideo || probe.Duration <= 0 {
		return nil, fmt.Errorf("无法从无效视频提取核验画面")
	}
	end := probe.Duration
	if input.EndTime > 0 && input.EndTime < end {
		end = input.EndTime
	}
	if input.StartTime < 0 || input.StartTime >= end || end-input.StartTime > VideoReviewSheetDuration {
		return nil, fmt.Errorf("视频核验采样范围无效")
	}
	output := filepath.Join(workspace, "review.jpg")
	if err := writeFFmpegVideoReviewSheet(ctx, ffmpegPath, videoPath, output, input.StartTime, end); err != nil {
		return nil, err
	}
	file, err := frontupload.ImportFile(ctx, frontupload.ImportFileInput{RuleID: ffmpegImageRuleID, Kind: botprotocol.MediaTypeImage, Name: strings.TrimSuffix(ffmpegOutputName(input.RequestID), ".mp4") + "-review.jpg", Mime: "image/jpeg", LocalPath: output, BizKey: "energon", BizName: "视频核验"})
	if err != nil {
		return nil, err
	}
	payload := uploadrepo.BuildUploadFilePayload(file)
	url := strings.TrimSpace(botprotocol.AsText(payload["url"]))
	if url == "" {
		return nil, fmt.Errorf("保存视频核验画面后未返回文件地址")
	}
	return map[string]any{"images": []string{url}, "meta": map[string]any{"source_video": input.VideoURL, "start_time": input.StartTime, "end_time": end, "columns": 3, "sample_times": VideoReviewSampleTimes(input.StartTime, end)}}, nil
}

// Nominal sample times are shared by extraction, review labels and coverage checks.
func VideoReviewSampleTimes(start, end float64) []float64 {
	samples := int(math.Ceil((end-start)*2)) + 1
	times := make([]float64, samples)
	for i := range times {
		times[i] = start + (end-start)*float64(i)/float64(samples-1)
	}
	return times
}

func writeFFmpegVideoReviewSheet(ctx context.Context, ffmpegPath, videoPath, output string, start, end float64) error {
	times := VideoReviewSampleTimes(start, end)
	samples := len(times)
	// Keep each page readable and replace its last cell with the real interval
	// tail. Sampling uses an absolute cadence, avoiding accumulated frame rounding.
	filter := fmt.Sprintf("[0:v]trim=start=%s:end=%s,setpts=PTS-STARTPTS,split=2[body][tail];[body]select='gte(t,selected_n*%s)',trim=end_frame=%d,scale=640:-2,tile=3x%d[grid];[tail]trim=start=%s,reverse,trim=end_frame=1,setpts=PTS-STARTPTS,scale=640:-2[exit];[grid][exit]overlay=x=%d:y=%d*overlay_h:shortest=1[out]", formatFFmpegSeconds(start), formatFFmpegSeconds(end), formatFFmpegSeconds(times[1]-start), samples-1, (samples+2)/3, formatFFmpegSeconds(math.Max(0, end-start-1)), ((samples-1)%3)*640, (samples-1)/3)
	command := exec.CommandContext(ctx, ffmpegPath, "-hide_banner", "-loglevel", "error", "-i", videoPath, "-filter_complex", filter, "-map", "[out]", "-frames:v", "1", "-q:v", "2", "-y", output)
	if raw, err := command.CombinedOutput(); err != nil {
		return fmt.Errorf("提取视频核验画面失败：%w: %s", err, strings.TrimSpace(string(raw)))
	}
	return nil
}
