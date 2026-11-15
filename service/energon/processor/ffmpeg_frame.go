package processor

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontupload "github.com/dever-package/front/service/upload"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

type VideoTailFrameInput struct {
	VideoURL  string
	RequestID string
	EndTime   float64 // End of the displayed clip; zero uses the source end.
}

type VideoTailFrame struct {
	URL string
}

// ExtractVideoTailFrame creates an internal image reference for a continuous shot.
func ExtractVideoTailFrame(ctx context.Context, input VideoTailFrameInput) (VideoTailFrame, error) {
	ffmpegPath, err := exec.LookPath("ffmpeg")
	if err != nil {
		return VideoTailFrame{}, fmt.Errorf("当前服务器未安装 FFmpeg，无法提取上一镜头尾帧")
	}
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return VideoTailFrame{}, fmt.Errorf("当前服务器未安装 ffprobe，无法读取上一镜头信息")
	}
	workspace, err := os.MkdirTemp("", "energon-tail-frame-")
	if err != nil {
		return VideoTailFrame{}, fmt.Errorf("创建尾帧临时目录失败: %w", err)
	}
	defer os.RemoveAll(workspace)

	videoPath, err := newFFmpegMediaResolver(ctx, workspace).Resolve(input.VideoURL)
	if err != nil {
		return VideoTailFrame{}, fmt.Errorf("读取上一镜头视频失败: %w", err)
	}
	probe, err := probeFFmpegMedia(ctx, ffprobePath, videoPath)
	if err != nil {
		return VideoTailFrame{}, fmt.Errorf("读取上一镜头视频信息失败: %w", err)
	}
	if !probe.HasVideo || probe.Duration <= 0 {
		return VideoTailFrame{}, fmt.Errorf("上一镜头不是有效视频")
	}

	end := probe.Duration
	if input.EndTime > 0 && input.EndTime < end {
		end = input.EndTime
	}
	outputPath := filepath.Join(workspace, "tail.jpg")
	if err := writeFFmpegTailFrame(ctx, ffmpegPath, videoPath, outputPath, end); err != nil {
		return VideoTailFrame{}, err
	}

	file, err := frontupload.ImportFile(ctx, frontupload.ImportFileInput{
		RuleID:    ffmpegImageRuleID,
		Kind:      botprotocol.MediaTypeImage,
		Name:      ffmpegTailFrameName(input.RequestID),
		Mime:      "image/jpeg",
		LocalPath: outputPath,
		BizKey:    "energon",
		BizName:   "镜头连续性",
	})
	if err != nil {
		return VideoTailFrame{}, fmt.Errorf("保存上一镜头尾帧失败: %w", err)
	}
	payload := uploadrepo.BuildUploadFilePayload(file)
	fileURL := strings.TrimSpace(botprotocol.AsText(payload["url"]))
	if fileURL == "" {
		return VideoTailFrame{}, fmt.Errorf("保存上一镜头尾帧后未返回文件地址")
	}
	return VideoTailFrame{URL: fileURL}, nil
}

func writeFFmpegTailFrame(ctx context.Context, ffmpegPath, videoPath, outputPath string, end float64) error {
	// Decode at most the final second. Reversing that small window selects the
	// last real frame, including when container/audio padding follows the video.
	seek := end - 1
	if seek < 0 {
		seek = 0
	}
	command := exec.CommandContext(
		ctx,
		ffmpegPath,
		"-hide_banner",
		"-loglevel", "error",
		"-ss", formatFFmpegSeconds(seek),
		"-t", formatFFmpegSeconds(end-seek),
		"-i", videoPath,
		"-vf", "reverse",
		"-frames:v", "1",
		"-q:v", "2",
		"-y", outputPath,
	)
	if output, commandErr := command.CombinedOutput(); commandErr != nil {
		message := strings.TrimSpace(string(output))
		if message == "" {
			message = commandErr.Error()
		}
		return fmt.Errorf("提取上一镜头尾帧失败: %s", message)
	}
	return nil
}

func ffmpegTailFrameName(requestID string) string {
	name := strings.TrimSuffix(ffmpegOutputName(requestID), ".mp4")
	return name + "-tail.jpg"
}
