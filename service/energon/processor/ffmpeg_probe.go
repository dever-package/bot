package processor

import (
	"context"
	"encoding/json"
	"os/exec"
	"strconv"
	"strings"
)

type ffmpegMediaProbe struct {
	Duration           float64
	HasVideo           bool
	HasAudio           bool
	VideoStreams       int
	VideoCodec         string
	VideoProfile       string
	VideoLevel         int
	VideoCodecTag      string
	VideoPixelFormat   string
	VideoFrameRate     float64
	VideoTimeBase      string
	VideoExtradata     string
	AudioStreams       int
	AudioCodec         string
	AudioCodecTag      string
	AudioSampleRate    int
	AudioChannels      int
	AudioChannelLayout string
	AudioSampleFormat  string
	AudioTimeBase      string
	AudioExtradata     string
	Width              int
	Height             int
}

func probeFFmpegMedia(ctx context.Context, ffprobePath string, path string) (ffmpegMediaProbe, error) {
	command := exec.CommandContext(
		ctx,
		ffprobePath,
		"-v", "error",
		"-show_data",
		"-show_entries", "format=duration:stream=codec_type,codec_name,profile,level,codec_tag_string,duration,width,height,pix_fmt,avg_frame_rate,time_base,sample_rate,channels,channel_layout,sample_fmt,extradata",
		"-of", "json",
		path,
	)
	payload, err := command.Output()
	if err != nil {
		return ffmpegMediaProbe{}, err
	}
	result := struct {
		Streams []struct {
			CodecType     string `json:"codec_type"`
			CodecName     string `json:"codec_name"`
			Profile       string `json:"profile"`
			Level         int    `json:"level"`
			CodecTag      string `json:"codec_tag_string"`
			Duration      string `json:"duration"`
			Width         int    `json:"width"`
			Height        int    `json:"height"`
			PixelFormat   string `json:"pix_fmt"`
			FrameRate     string `json:"avg_frame_rate"`
			TimeBase      string `json:"time_base"`
			SampleRate    string `json:"sample_rate"`
			Channels      int    `json:"channels"`
			ChannelLayout string `json:"channel_layout"`
			SampleFormat  string `json:"sample_fmt"`
			Extradata     string `json:"extradata"`
		} `json:"streams"`
		Format struct {
			Duration string `json:"duration"`
		} `json:"format"`
	}{}
	if err := json.Unmarshal(payload, &result); err != nil {
		return ffmpegMediaProbe{}, err
	}
	probe := ffmpegMediaProbe{}
	probe.Duration, _ = strconv.ParseFloat(strings.TrimSpace(result.Format.Duration), 64)
	for _, stream := range result.Streams {
		streamDuration, _ := strconv.ParseFloat(strings.TrimSpace(stream.Duration), 64)
		if streamDuration > probe.Duration {
			probe.Duration = streamDuration
		}
		switch strings.ToLower(strings.TrimSpace(stream.CodecType)) {
		case "video":
			probe.HasVideo = true
			probe.VideoStreams++
			if probe.VideoStreams == 1 {
				probe.VideoCodec = strings.ToLower(strings.TrimSpace(stream.CodecName))
				probe.VideoProfile = strings.TrimSpace(stream.Profile)
				probe.VideoLevel = stream.Level
				probe.VideoCodecTag = strings.ToLower(strings.TrimSpace(stream.CodecTag))
				probe.VideoPixelFormat = strings.ToLower(strings.TrimSpace(stream.PixelFormat))
				probe.VideoFrameRate = parseFFmpegRate(stream.FrameRate)
				probe.VideoTimeBase = strings.TrimSpace(stream.TimeBase)
				probe.VideoExtradata = strings.TrimSpace(stream.Extradata)
				probe.Width = stream.Width
				probe.Height = stream.Height
			}
		case "audio":
			probe.HasAudio = true
			probe.AudioStreams++
			if probe.AudioStreams == 1 {
				probe.AudioCodec = strings.ToLower(strings.TrimSpace(stream.CodecName))
				probe.AudioCodecTag = strings.ToLower(strings.TrimSpace(stream.CodecTag))
				probe.AudioSampleRate, _ = strconv.Atoi(strings.TrimSpace(stream.SampleRate))
				probe.AudioChannels = stream.Channels
				probe.AudioChannelLayout = strings.ToLower(strings.TrimSpace(stream.ChannelLayout))
				probe.AudioSampleFormat = strings.ToLower(strings.TrimSpace(stream.SampleFormat))
				probe.AudioTimeBase = strings.TrimSpace(stream.TimeBase)
				probe.AudioExtradata = strings.TrimSpace(stream.Extradata)
			}
		}
	}
	return probe, nil
}

func parseFFmpegRate(value string) float64 {
	value = strings.TrimSpace(value)
	numeratorText, denominatorText, found := strings.Cut(value, "/")
	if !found {
		rate, _ := strconv.ParseFloat(value, 64)
		return rate
	}
	numerator, _ := strconv.ParseFloat(strings.TrimSpace(numeratorText), 64)
	denominator, _ := strconv.ParseFloat(strings.TrimSpace(denominatorText), 64)
	if denominator == 0 {
		return 0
	}
	return numerator / denominator
}
