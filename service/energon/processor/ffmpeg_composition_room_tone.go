package processor

import (
	"context"
	"encoding/binary"
	"fmt"
	"math"
	"os/exec"
	"slices"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type ffmpegPreparedRoomTone struct {
	sourceIndex    int
	start          float64
	sampleDuration float64
	duration       float64
	offset         float64
	phase          float64
}

const ambientEdgeSeconds = 0.20

func readAmbientEdge(ctx context.Context, clip ffmpegPreparedClip, start float64) (level float64, stable, quiet, tonal bool, err error) {
	cmd := exec.CommandContext(ctx, "ffmpeg", "-v", "error", "-ss", formatFFmpegSeconds(start), "-i", clip.VisualVideoPath, "-map", "0:a:0", "-t", formatFFmpegSeconds(ambientEdgeSeconds), "-ac", "1", "-ar", "8000", "-f", "s16le", "pipe:1")
	raw, err := cmd.Output()
	if err != nil {
		return 0, false, false, false, fmt.Errorf("测量镜头 %s 原声接点：%w", clip.Clip.ID, err)
	}
	const blockSamples = 320
	var levels [5]float64
	if len(raw) < len(levels)*blockSamples*2 {
		return 0, false, false, false, nil
	}
	quiet = true
	for block := range levels {
		var power, peak float64
		var samples [blockSamples]float64
		for sample := 0; sample < blockSamples; sample++ {
			offset := (block*blockSamples + sample) * 2
			value := float64(int16(binary.LittleEndian.Uint16(raw[offset:]))) / 32768
			samples[sample] = value
			power += value * value
			peak = max(peak, math.Abs(value))
		}
		rms := math.Sqrt(power/blockSamples) * clip.Clip.OriginalVolume
		if rms > 0.22 || peak*clip.Clip.OriginalVolume > 6*rms {
			return 0, false, false, false, nil
		}
		quiet = quiet && rms < 0.014 && peak*clip.Clip.OriginalVolume < 0.05
		if !tonal && rms >= 0.006 {
			for lag := 16; lag <= 100; lag++ {
				var dot, left, right float64
				for index := lag; index < len(samples); index++ {
					current, prior := samples[index], samples[index-lag]
					dot += current * prior
					left += current * current
					right += prior * prior
				}
				if dot > 0.82*math.Sqrt(left*right) {
					tonal = true
					break
				}
			}
		}
		levels[block] = 20 * math.Log10(max(1e-6, rms))
	}
	slices.Sort(levels[:])
	return levels[2], levels[0] >= -45 && levels[4]-levels[0] <= 6, quiet, tonal, nil
}

func prepareFFmpegCompositionRoomTone(ctx context.Context, clips []ffmpegPreparedClip) error {
	silenceByClip := make(map[int][]ffmpegReviewSilence)
	readSilence := func(index int) ([]ffmpegReviewSilence, error) {
		if intervals, loaded := silenceByClip[index]; loaded {
			return intervals, nil
		}
		intervals, err := detectFFmpegAudioSilenceAt(ctx, "ffmpeg", clips[index].VisualVideoPath, "-46dB")
		if err != nil {
			return nil, err
		}
		silenceByClip[index] = intervals
		return intervals, nil
	}
	var sceneSample ffmpegPreparedRoomTone
	for index := 1; index < len(clips); index++ {
		previous, next := &clips[index-1], &clips[index]
		transition := previous.Clip.TransitionToNext
		fromNext := transition.RoomToneFromNextMS >= 100 && transition.RoomToneFromNextMS <= 900
		fromPrevious := transition.CarryRoomTone && transition.SoundLeadMS >= 100 && transition.SoundLeadMS <= 900
		if (!fromNext && !transition.CarryRoomTone) || transition.Type != botprotocol.VideoTransitionNone ||
			previous.Clip.SourceStart != 0 || next.Clip.SourceStart != 0 ||
			previous.OriginalAudioInputIndex != previous.VisualVideoInputIndex || next.OriginalAudioInputIndex != next.VisualVideoInputIndex ||
			!previous.HasOriginalAudio || !next.HasOriginalAudio || previous.Clip.OriginalVolume <= 0 || next.Clip.OriginalVolume <= 0 {
			sceneSample = ffmpegPreparedRoomTone{}
			continue
		}
		if transition.MatchAmbientLevel && !fromNext && !fromPrevious && previous.Duration >= 2*ambientEdgeSeconds && next.Duration >= 2*ambientEdgeSeconds && len(previous.SpeechTracks) == 0 && len(next.SpeechTracks) == 0 {
			end := min(previous.Duration, previous.VisualProbe.AudioDuration)
			if end >= previous.Duration-0.04 {
				tail, stable, _, tonal, err := readAmbientEdge(ctx, *previous, end-ambientEdgeSeconds)
				if err != nil {
					return err
				}
				if stable {
					head, stable, quiet, _, err := readAmbientEdge(ctx, *next, 0)
					if err != nil {
						return err
					}
					if quiet && !tonal && tail-head >= 12 {
						next.RoomTone = ffmpegPreparedRoomTone{sourceIndex: index - 1, start: end - ambientEdgeSeconds, duration: ambientEdgeSeconds, sampleDuration: ambientEdgeSeconds}
						sceneSample = ffmpegPreparedRoomTone{}
						continue
					}
					if stable && math.Abs(tail-head) >= 3 {
						previous.TailAttenuationDB = min(6, max(0, tail-head))
						next.HeadAttenuationDB = min(6, max(0, head-tail))
					}
				}
			}
		}
		if !fromPrevious && !fromNext && sceneSample.sampleDuration == 0 {
			continue
		}
		outgoing, err := readSilence(index - 1)
		if err != nil {
			return err
		}
		incoming, err := readSilence(index)
		if err != nil {
			return err
		}
		tailStart := ffmpegCompositionQuietTail(*previous, outgoing)
		var headDuration float64
		if len(incoming) > 0 && incoming[0].start <= 0.01 && incoming[0].end >= 0.15 {
			headDuration = min(next.Duration, incoming[0].end)
		}
		if fromPrevious {
			if sample := ffmpegCompositionRoomToneSample(index-1, *previous, transition.SoundLeadMS, tailStart); sample.sampleDuration > 0 {
				sceneSample = sample
			}
		}
		if fromNext && sceneSample.sampleDuration == 0 {
			sample := ffmpegCompositionRoomToneSample(index, *next, transition.RoomToneFromNextMS, ffmpegCompositionQuietTail(*next, incoming))
			if sample.start > headDuration {
				sceneSample = sample
			}
		}
		if sceneSample.sampleDuration == 0 {
			continue
		}
		tailDuration := min(0.9, previous.Duration-tailStart)
		if tailDuration >= 0.08 {
			previous.TailRoomTone = sceneSample
			previous.TailRoomTone.duration = tailDuration
			previous.TailRoomTone.offset = previous.Duration - tailDuration
		}
		if headDuration > 0 {
			next.RoomTone = sceneSample
			next.RoomTone.duration = headDuration
			next.RoomTone.phase = previous.TailRoomTone.duration
		}
	}
	return nil
}

func ffmpegCompositionQuietTail(clip ffmpegPreparedClip, intervals []ffmpegReviewSilence) float64 {
	end := clip.Duration
	if clip.VisualProbe.AudioDuration > 0 {
		end = min(end, clip.VisualProbe.AudioDuration)
	}
	if len(intervals) > 0 {
		last := intervals[len(intervals)-1]
		if last.end >= end-0.015 {
			return min(end, last.start)
		}
	}
	return end
}

func ffmpegCompositionRoomToneSample(index int, clip ffmpegPreparedClip, sampleMS int, end float64) ffmpegPreparedRoomTone {
	start := max(0, clip.Duration-float64(sampleMS)/1000)
	if end-start < 0.08 || len(clip.SpeechTracks) > 0 {
		return ffmpegPreparedRoomTone{}
	}
	return ffmpegPreparedRoomTone{sourceIndex: index, start: start, sampleDuration: end - start}
}

func appendFFmpegCompositionRoomToneFilters(filters []string, source ffmpegPreparedClip, roomTone ffmpegPreparedRoomTone, key, input, output string) []string {
	forward := "abedforward" + key
	reverseSource := "abedsource" + key
	reverse := "abedreverse" + key
	bed := "abed" + key
	fade := min(0.12, roomTone.duration/2)
	loopSamples := int(math.Round(roomTone.sampleDuration*48000)) * 2
	envelope := fmt.Sprintf("afade=t=out:st=%s:d=%s", formatFFmpegSeconds(roomTone.duration-fade), formatFFmpegSeconds(fade))
	if roomTone.offset > 0 {
		envelope = fmt.Sprintf("afade=t=in:d=%s,adelay=%dS:all=1", formatFFmpegSeconds(fade), int(math.Round(roomTone.offset*48000)))
	}
	return append(filters,
		fmt.Sprintf("[%d:a:0]atrim=start=%s:duration=%s,aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asetpts=N/SR/TB,volume=%s,asplit=2[%s][%s]",
			source.OriginalAudioInputIndex, formatFFmpegSeconds(roomTone.start), formatFFmpegSeconds(roomTone.sampleDuration),
			formatFFmpegVolume(source.Clip.OriginalVolume), forward, reverseSource),
		fmt.Sprintf("[%s]areverse,asetpts=N/SR/TB[%s]", reverseSource, reverse),
		fmt.Sprintf("[%s][%s]concat=n=2:v=0:a=1,aloop=loop=-1:size=%d,atrim=start=%s:duration=%s,asetpts=N/SR/TB,%s[%s]",
			reverse, forward, loopSamples, formatFFmpegSeconds(roomTone.phase), formatFFmpegSeconds(roomTone.duration), envelope, bed),
		fmt.Sprintf("[%s][%s]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[%s]", input, bed, output),
	)
}
