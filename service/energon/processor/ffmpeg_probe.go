package processor

import (
	"context"
	"encoding/json"
	"os/exec"
	"strconv"
	"strings"
	"sync"
)

const ffmpegProbePreloadWorkers = 4

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

type ffmpegProbeResult struct {
	probe ffmpegMediaProbe
	err   error
}

type ffmpegProbeCache struct {
	ffprobePath string
	mu          sync.Mutex
	results     map[string]ffmpegProbeResult
}

func newFFmpegProbeCache(ffprobePath string) *ffmpegProbeCache {
	return &ffmpegProbeCache{
		ffprobePath: ffprobePath,
		results:     map[string]ffmpegProbeResult{},
	}
}

func (cache *ffmpegProbeCache) Probe(ctx context.Context, path string) (ffmpegMediaProbe, error) {
	cache.mu.Lock()
	cached, exists := cache.results[path]
	cache.mu.Unlock()
	if exists {
		return cached.probe, cached.err
	}
	probe, err := probeFFmpegMedia(ctx, cache.ffprobePath, path)
	cache.mu.Lock()
	if cached, exists = cache.results[path]; exists {
		cache.mu.Unlock()
		return cached.probe, cached.err
	}
	cache.results[path] = ffmpegProbeResult{probe: probe, err: err}
	cache.mu.Unlock()
	return probe, err
}

func (cache *ffmpegProbeCache) Preload(ctx context.Context, paths []string) error {
	uniquePaths := distinctFFmpegProbePaths(paths)
	if len(uniquePaths) == 0 {
		return nil
	}
	workerCount := ffmpegProbePreloadWorkers
	if len(uniquePaths) < workerCount {
		workerCount = len(uniquePaths)
	}
	jobs := make(chan string)
	var workers sync.WaitGroup
	workers.Add(workerCount)
	for index := 0; index < workerCount; index++ {
		go func() {
			defer workers.Done()
			for path := range jobs {
				_, _ = cache.Probe(ctx, path)
			}
		}()
	}
	for _, path := range uniquePaths {
		select {
		case <-ctx.Done():
			close(jobs)
			workers.Wait()
			return ctx.Err()
		case jobs <- path:
		}
	}
	close(jobs)
	workers.Wait()
	return ctx.Err()
}

func distinctFFmpegProbePaths(paths []string) []string {
	result := make([]string, 0, len(paths))
	seen := make(map[string]struct{}, len(paths))
	for _, path := range paths {
		path = strings.TrimSpace(path)
		if path == "" {
			continue
		}
		if _, exists := seen[path]; exists {
			continue
		}
		seen[path] = struct{}{}
		result = append(result, path)
	}
	return result
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
