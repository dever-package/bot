package processor

import (
	"context"

	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
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
	return botruntimeconfig.Load().FFmpegTranscodes
}
