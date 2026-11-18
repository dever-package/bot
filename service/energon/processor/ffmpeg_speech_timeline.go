package processor

import (
	"context"
	"fmt"
	"math"
	"slices"
	"sort"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type ffmpegSpeechInterval struct {
	ID        string
	StartTime float64
	Duration  float64
}

func validateFFmpegSpeechIntervals(label string, intervals []ffmpegSpeechInterval) error {
	ordered := append([]ffmpegSpeechInterval(nil), intervals...)
	sort.SliceStable(ordered, func(left, right int) bool {
		return ordered[left].StartTime < ordered[right].StartTime
	})
	for index := 1; index < len(ordered); index++ {
		previous := ordered[index-1]
		current := ordered[index]
		if current.StartTime < previous.StartTime+previous.Duration-0.01 {
			return fmt.Errorf(
				"%s语音“%s”与“%s”时间重叠",
				label,
				previous.ID,
				current.ID,
			)
		}
	}
	return nil
}

// Fit generated recordings to the storyboard after probing the real media.
// Dialogue stays with its shot; narration lives on the whole film timeline.
func planFFmpegStoryboardSpeech(ctx context.Context, cache *ffmpegProbeCache, composition *ffmpegComposition) error {
	voiceEnd := make([]float64, len(composition.Clips))
	voiceStart := make([]float64, len(composition.Clips))
	for i := range composition.Clips {
		clip := &composition.Clips[i]
		if len(clip.SpeechTracks) == 0 {
			continue
		}
		if clip.Duration <= 0 {
			probe, err := cache.Probe(ctx, clip.VisualVideo)
			if err != nil {
				return err
			}
			clip.Duration = probe.Duration
		}
		originalDuration := clip.Duration
		sort.SliceStable(clip.SpeechTracks, func(a, b int) bool { return clip.SpeechTracks[a].StartTime < clip.SpeechTracks[b].StartTime })
		for j := range clip.SpeechTracks {
			track := &clip.SpeechTracks[j]
			duration, err := ffmpegStoryboardVoiceLength(ctx, cache, track.Audio, track.ID, track.SourceStart)
			if err != nil {
				return err
			}
			if track.Fit != "strict" {
				duration = min(duration, max(0, originalDuration-track.StartTime))
			}
			track.StartTime = max(track.StartTime, voiceEnd[i])
			voiceEnd[i] = track.StartTime + duration
			if j == 0 {
				voiceStart[i] = track.StartTime
			}
		}
		clip.Duration = max(clip.Duration, voiceEnd[i])
		clip.SpeechHold = clip.Duration - originalDuration
	}

	hasNarration := false
	for _, track := range composition.AudioTracks {
		if track.Kind == "narration" && track.Fit == "strict" && !track.Loop {
			hasNarration = true
		}
	}
	if !hasNarration && !slices.ContainsFunc(voiceEnd, func(end float64) bool { return end > 0 }) {
		return nil
	}

	// Shorten an overlapping transition only as far as needed for two voices.
	// Hard cuts remain available when there is under 100 ms of room.
	cursor := 0.0
	var dialogue []ffmpegSpeechInterval
	dialogueEnd := 0.0
	clipStarts := make(map[string]float64, len(composition.Clips))
	for i := range composition.Clips {
		clip := &composition.Clips[i]
		clipStarts[clip.ID] = cursor
		if clip.Duration <= 0 {
			probe, err := cache.Probe(ctx, clip.VisualVideo)
			if err != nil {
				return err
			}
			clip.Duration = probe.Duration
		}
		if voiceEnd[i] > 0 {
			dialogueEnd = cursor + voiceEnd[i]
			dialogue = append(dialogue, ffmpegSpeechInterval{StartTime: cursor + voiceStart[i], Duration: voiceEnd[i] - voiceStart[i]})
		}
		cursor += clip.Duration
		transition := &clip.TransitionToNext
		if i+1 < len(composition.Clips) && transition.Type != botprotocol.VideoTransitionNone && transition.Type != "" {
			if dialogueEnd > 0 && voiceEnd[i+1] > 0 {
				room := cursor + voiceStart[i+1] - dialogueEnd
				transition.DurationMS = min(transition.DurationMS, int(math.Floor(room*1000)))
				if transition.DurationMS < 100 {
					*transition = ffmpegCompositionTransition{Type: botprotocol.VideoTransitionNone}
				}
			}
			cursor -= float64(transition.DurationMS) / 1000
		}
	}

	// Preserve the authored order and any usable pauses without truncating a cue.
	var narration []*ffmpegCompositionGlobalAudio
	for i := range composition.AudioTracks {
		track := &composition.AudioTracks[i]
		if track.Kind == "narration" && track.Fit == "strict" && !track.Loop {
			if start, ok := clipStarts[track.ShotID]; ok {
				track.StartTime = start + track.ShotStart
			}
			narration = append(narration, track)
		}
	}
	sort.SliceStable(narration, func(i, j int) bool { return narration[i].StartTime < narration[j].StartTime })
	end := 0.0
	for _, track := range narration {
		duration, err := ffmpegStoryboardVoiceLength(ctx, cache, track.Audio, track.ID, track.SourceStart)
		if err != nil {
			return err
		}
		start := max(track.StartTime, end)
		for _, occupied := range dialogue {
			if start+duration <= occupied.StartTime {
				break
			}
			start = max(start, occupied.StartTime+occupied.Duration)
		}
		track.StartTime = start
		end = start + duration
	}
	if end > cursor {
		last := &composition.Clips[len(composition.Clips)-1]
		last.Duration += end - cursor
		last.SpeechHold += end - cursor
	}
	return nil
}

func ffmpegStoryboardVoiceLength(ctx context.Context, cache *ffmpegProbeCache, path, id string, sourceStart float64) (float64, error) {
	probe, err := cache.Probe(ctx, path)
	if err != nil {
		return 0, fmt.Errorf("读取分镜配音 %s 失败: %w", id, err)
	}
	if !probe.HasAudio || sourceStart < 0 || probe.Duration-sourceStart <= 0.02 {
		return 0, fmt.Errorf("分镜配音 %s 没有可用的音频", id)
	}
	return probe.Duration - sourceStart, nil
}
