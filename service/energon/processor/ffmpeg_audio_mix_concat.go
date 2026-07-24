package processor

import (
	"fmt"
	"math"
	"strconv"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func buildFFmpegCopyVideoMixAudioArgs(
	workspace string,
	outputPath string,
	inputArgs []string,
	concatInputIndex int,
	clips []ffmpegPreparedClip,
	resolution string,
	fps int,
) ([]string, bool, error) {
	if !canFFmpegCopyVideoMixAudio(clips, resolution, fps) {
		return nil, false, nil
	}
	paths := make([]string, 0, len(clips))
	for _, clip := range clips {
		paths = append(paths, clip.VisualVideoPath)
	}
	concatPath, err := writeFFmpegConcatList(workspace, "composition-video-only.txt", paths)
	if err != nil {
		return nil, false, err
	}
	filters, audioLabel, totalDuration, err := buildFFmpegCompositionMixedAudioFilters(clips)
	if err != nil {
		return nil, false, err
	}
	args := append([]string(nil), inputArgs...)
	args = append(args,
		"-fflags", "+genpts",
		"-f", "concat",
		"-safe", "0",
		"-i", concatPath,
		"-filter_complex", strings.Join(filters, ";"),
		"-map", strconv.Itoa(concatInputIndex)+":v:0",
		"-map", "["+audioLabel+"]",
		"-t", formatFFmpegSeconds(totalDuration),
		"-c:v", "copy",
		"-c:a", "aac",
		"-avoid_negative_ts", "make_zero",
		"-movflags", "+faststart",
		"-y", outputPath,
	)
	return args, true, nil
}

func canFFmpegCopyVideoMixAudio(clips []ffmpegPreparedClip, resolution string, fps int) bool {
	if len(clips) == 0 || !supportsFFmpegVideoCopy(clips[0].VisualProbe) {
		return false
	}
	first := clips[0].VisualProbe
	if resolution != fmt.Sprintf("%dx%d", first.Width, first.Height) {
		return false
	}
	if fps > 0 && math.Abs(first.VideoFrameRate-float64(fps)) > 0.05 {
		return false
	}
	for index, clip := range clips {
		if len(clip.Clip.SubtitleTracks) > 0 || clip.VideoPadDuration > 0 {
			return false
		}
		if math.Abs(clip.Duration-clip.VisualProbe.Duration) > ffmpegFastConcatTimeTolerance {
			return false
		}
		if index < len(clips)-1 && clip.Clip.TransitionToNext.Type != botprotocol.VideoTransitionNone {
			return false
		}
		if !sameFFmpegVideoCopyStreams(first, clip.VisualProbe) {
			return false
		}
		if !sameFFmpegConcatAudioStreams(first, clip.VisualProbe) {
			return false
		}
	}
	return true
}

func buildFFmpegCompositionMixedAudioFilters(
	clips []ffmpegPreparedClip,
) ([]string, string, float64, error) {
	filters := make([]string, 0, len(clips)*3)
	for index, clip := range clips {
		filters = appendFFmpegCompositionClipAudioFilters(filters, clip, index)
	}
	audioLabel := "a0"
	totalDuration := clips[0].Duration
	for index := 1; index < len(clips); index++ {
		nextAudioLabel := fmt.Sprintf("amixjoin%d", index)
		filters = append(filters, fmt.Sprintf(
			"[%s][a%d]concat=n=2:v=0:a=1[%s]",
			audioLabel,
			index,
			nextAudioLabel,
		))
		audioLabel = nextAudioLabel
		totalDuration += clips[index].Duration
	}
	if err := validateFFmpegCompositionSpeechTimeline(clips, make([]float64, len(clips))); err != nil {
		return nil, "", 0, err
	}
	return filters, audioLabel, totalDuration, nil
}
