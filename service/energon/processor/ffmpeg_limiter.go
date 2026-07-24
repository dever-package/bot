package processor

import (
	"context"
	"os"
	"strconv"
	"strings"
)

const (
	ffmpegMaxTranscodesEnv     = "BOT_FFMPEG_MAX_TRANSCODES"
	ffmpegDefaultTranscodes    = 1
	ffmpegMaxTranscodeCapacity = 8
)

var ffmpegTranscodeSlots = make(chan struct{}, ffmpegTranscodeConcurrency())

func acquireFFmpegTranscodeSlot(
	ctx context.Context,
	onWait func() error,
) (func(), error) {
	select {
	case ffmpegTranscodeSlots <- struct{}{}:
		return releaseFFmpegTranscodeSlot, nil
	default:
	}
	if onWait != nil {
		if err := onWait(); err != nil {
			return nil, err
		}
	}
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case ffmpegTranscodeSlots <- struct{}{}:
		return releaseFFmpegTranscodeSlot, nil
	}
}

func releaseFFmpegTranscodeSlot() {
	<-ffmpegTranscodeSlots
}

func ffmpegTranscodeConcurrency() int {
	if configured, err := strconv.Atoi(strings.TrimSpace(os.Getenv(ffmpegMaxTranscodesEnv))); err == nil && configured > 0 {
		if configured > ffmpegMaxTranscodeCapacity {
			return ffmpegMaxTranscodeCapacity
		}
		return configured
	}
	return ffmpegDefaultTranscodes
}
