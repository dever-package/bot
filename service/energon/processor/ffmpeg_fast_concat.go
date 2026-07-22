package processor

import (
	"fmt"
	"math"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const ffmpegFastConcatTimeTolerance = 0.1

func buildFFmpegFastConcatArgs(
	workspace string,
	outputPath string,
	clips []ffmpegPreparedClip,
	resolution string,
	fps int,
) ([]string, bool, error) {
	if !canFFmpegFastConcat(clips, resolution, fps) {
		return nil, false, nil
	}
	paths := make([]string, 0, len(clips))
	for _, clip := range clips {
		paths = append(paths, clip.VisualVideoPath)
	}
	concatPath, err := writeFFmpegConcatList(workspace, "composition-videos.txt", paths)
	if err != nil {
		return nil, false, err
	}
	args := append(ffmpegCommandArgs(),
		"-fflags", "+genpts",
		"-f", "concat",
		"-safe", "0",
		"-i", concatPath,
		"-map", "0:v:0",
		"-map", "0:a:0",
		"-c", "copy",
		"-avoid_negative_ts", "make_zero",
		"-movflags", "+faststart",
		"-y", outputPath,
	)
	return args, true, nil
}

func canFFmpegFastConcat(clips []ffmpegPreparedClip, resolution string, fps int) bool {
	if len(clips) == 0 || !supportsFFmpegFastConcat(clips[0].VisualProbe) {
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
		if len(clip.SpeechTracks) > 0 || len(clip.Clip.SubtitleTracks) > 0 {
			return false
		}
		if math.Abs(clip.Clip.OriginalVolume-1) > 0.001 {
			return false
		}
		if !clip.HasOriginalAudio || clip.OriginalAudioInputIndex != clip.VisualVideoInputIndex {
			return false
		}
		if math.Abs(clip.Duration-clip.VisualProbe.Duration) > ffmpegFastConcatTimeTolerance {
			return false
		}
		if index < len(clips)-1 && clip.Clip.TransitionToNext.Type != botprotocol.VideoTransitionNone {
			return false
		}
		if !sameFFmpegFastConcatStreams(first, clip.VisualProbe) {
			return false
		}
	}
	return true
}

func supportsFFmpegFastConcat(probe ffmpegMediaProbe) bool {
	return probe.VideoStreams == 1 &&
		probe.AudioStreams == 1 &&
		probe.VideoCodec == "h264" &&
		probe.VideoPixelFormat == "yuv420p" &&
		probe.AudioCodec == "aac" &&
		probe.VideoFrameRate > 0 &&
		probe.VideoTimeBase != "" &&
		probe.VideoExtradata != "" &&
		probe.AudioSampleRate > 0 &&
		probe.AudioChannels > 0 &&
		probe.AudioTimeBase != "" &&
		probe.AudioExtradata != "" &&
		probe.Width > 0 &&
		probe.Height > 0
}

func sameFFmpegFastConcatStreams(left ffmpegMediaProbe, right ffmpegMediaProbe) bool {
	return supportsFFmpegFastConcat(right) &&
		left.VideoCodec == right.VideoCodec &&
		left.VideoProfile == right.VideoProfile &&
		left.VideoLevel == right.VideoLevel &&
		left.VideoCodecTag == right.VideoCodecTag &&
		left.VideoPixelFormat == right.VideoPixelFormat &&
		math.Abs(left.VideoFrameRate-right.VideoFrameRate) < 0.001 &&
		left.VideoTimeBase == right.VideoTimeBase &&
		left.VideoExtradata == right.VideoExtradata &&
		left.Width == right.Width &&
		left.Height == right.Height &&
		left.AudioCodec == right.AudioCodec &&
		left.AudioCodecTag == right.AudioCodecTag &&
		left.AudioSampleRate == right.AudioSampleRate &&
		left.AudioChannels == right.AudioChannels &&
		left.AudioChannelLayout == right.AudioChannelLayout &&
		left.AudioSampleFormat == right.AudioSampleFormat &&
		left.AudioTimeBase == right.AudioTimeBase &&
		left.AudioExtradata == right.AudioExtradata
}
