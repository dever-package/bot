package processor

import (
	"context"
	"errors"
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

const (
	referenceAudioDurationTolerance = 0.02
	referenceAudioFadeDuration      = 0.08
)

type ReferenceAudioPreparationInput struct {
	URL       string
	Duration  float64
	RequestID string
}

type ReferenceAudioPreparationResult struct {
	URL      string
	Prepared bool
	Trimmed  bool
}

// PrepareReferenceAudio normalizes system-uploaded reference audio to an MP3 accepted by
// video providers and trims it when it exceeds the requested video duration.
// External URLs retain their provider-side behavior because this processor
// cannot safely own their lifecycle.
func PrepareReferenceAudio(ctx context.Context, input ReferenceAudioPreparationInput) (ReferenceAudioPreparationResult, error) {
	input.URL = strings.TrimSpace(input.URL)
	result := ReferenceAudioPreparationResult{URL: input.URL}
	if input.URL == "" {
		return result, nil
	}
	if input.Duration < 0 || math.IsNaN(input.Duration) || math.IsInf(input.Duration, 0) ||
		(input.Duration > 0 && input.Duration < 0.1) {
		return result, fmt.Errorf("视频参考音频的目标时长无效")
	}

	workspace, err := os.MkdirTemp("", "energon-reference-audio-")
	if err != nil {
		return result, fmt.Errorf("创建视频参考音频临时目录失败: %w", err)
	}
	defer os.RemoveAll(workspace)

	audioPath, err := newFFmpegMediaResolver(ctx, workspace).Resolve(input.URL)
	if errors.Is(err, errFFmpegMediaNotSystemUpload) {
		return result, nil
	}
	if err != nil {
		return result, fmt.Errorf("读取视频参考音频失败: %w", err)
	}
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return result, fmt.Errorf("当前服务器未安装 ffprobe，无法读取视频参考音频时长")
	}
	ffmpegPath, err := exec.LookPath("ffmpeg")
	if err != nil {
		return result, fmt.Errorf("当前服务器未安装 FFmpeg，无法处理视频参考音频")
	}
	probe, err := probeFFmpegMedia(ctx, ffprobePath, audioPath)
	if err != nil {
		return result, fmt.Errorf("读取视频参考音频信息失败: %w", err)
	}
	if !probe.HasAudio || probe.Duration <= 0 {
		return result, fmt.Errorf("视频参考音频不是有效音频")
	}
	trimmed := input.Duration > 0 && probe.Duration > input.Duration+referenceAudioDurationTolerance

	outputPath := filepath.Join(workspace, "reference.mp3")
	filter := "asetpts=PTS-STARTPTS"
	if trimmed {
		fadeDuration := math.Min(referenceAudioFadeDuration, input.Duration/2)
		fadeStart := math.Max(0, input.Duration-fadeDuration)
		filter = fmt.Sprintf(
			"atrim=start=0:end=%s,asetpts=PTS-STARTPTS,afade=t=out:st=%s:d=%s",
			formatFFmpegSeconds(input.Duration),
			formatFFmpegSeconds(fadeStart),
			formatFFmpegSeconds(fadeDuration),
		)
	}
	args := []string{
		"-hide_banner", "-loglevel", "error", "-progress", "pipe:1", "-nostats",
		"-i", audioPath,
		"-map", "0:a:0",
		"-af", filter,
		"-c:a", "libmp3lame",
		"-b:a", "192k",
		"-ar", "44100",
		"-ac", "2",
		"-y", outputPath,
	}
	if err := runFFmpegCommand(ctx, ffmpegPath, args, nil); err != nil {
		return result, fmt.Errorf("转换视频参考音频失败: %w", err)
	}

	file, err := frontupload.ImportFile(ctx, frontupload.ImportFileInput{
		RuleID:    ffmpegAudioRuleID,
		Kind:      botprotocol.MediaTypeAudio,
		Name:      referenceAudioOutputName(input.RequestID),
		Mime:      "audio/mpeg",
		LocalPath: outputPath,
		BizKey:    "energon",
		BizName:   "视频参考音频",
	})
	if err != nil {
		return result, fmt.Errorf("保存处理后的视频参考音频失败: %w", err)
	}
	payload := uploadrepo.BuildUploadFilePayload(file)
	fileURL := strings.TrimSpace(botprotocol.AsText(payload["url"]))
	if fileURL == "" {
		return result, fmt.Errorf("保存处理后的视频参考音频未返回文件地址")
	}
	result.URL = fileURL
	result.Prepared = true
	result.Trimmed = trimmed
	return result, nil
}

func referenceAudioOutputName(requestID string) string {
	name := strings.TrimSuffix(ffmpegOutputName(requestID), ".mp4")
	return name + "-reference-audio.mp3"
}
