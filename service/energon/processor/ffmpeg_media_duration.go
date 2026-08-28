package processor

import (
	"context"
	"fmt"
	"math"
	"os"
	"os/exec"
)

func ProbeMediaDurationMS(ctx context.Context, mediaURL string) (int64, error) {
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return 0, fmt.Errorf("当前服务器未安装 ffprobe，无法读取主音轨时长")
	}
	workspace, err := os.MkdirTemp("", "energon-media-duration-")
	if err != nil {
		return 0, fmt.Errorf("创建音轨检测临时目录失败: %w", err)
	}
	defer os.RemoveAll(workspace)

	mediaPath, err := newFFmpegMediaResolver(ctx, workspace).Resolve(mediaURL)
	if err != nil {
		return 0, fmt.Errorf("读取主音轨失败: %w", err)
	}
	probe, err := probeFFmpegMedia(ctx, ffprobePath, mediaPath)
	if err != nil {
		return 0, fmt.Errorf("检测主音轨时长失败: %w", err)
	}
	if !probe.HasAudio || probe.Duration <= 0 {
		return 0, fmt.Errorf("主音轨没有可用的音频时长")
	}
	return int64(math.Round(probe.Duration * 1000)), nil
}
