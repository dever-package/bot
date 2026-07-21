package processor

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

const (
	ffmpegCompositionVersion       = 2
	ffmpegCompositionMaxClips      = 50
	ffmpegCompositionVideoPadFloor = 1.0
	ffmpegCompositionVideoPadRatio = 0.1
	ffmpegDefaultResolution        = "1920x1080"
)

type ffmpegComposition struct {
	Version  int                       `json:"version"`
	Clips    []ffmpegCompositionClip   `json:"clips"`
	Settings ffmpegCompositionSettings `json:"settings"`
}

type ffmpegCompositionClip struct {
	ID               string                      `json:"id"`
	Title            string                      `json:"title"`
	VisualVideo      string                      `json:"visual_video"`
	OriginalAudio    string                      `json:"original_audio_source"`
	Duration         float64                     `json:"duration"`
	Subtitle         string                      `json:"subtitle"`
	OriginalVolume   float64                     `json:"original_volume"`
	SpeechTracks     []ffmpegCompositionSpeech   `json:"speech_tracks"`
	TransitionToNext ffmpegCompositionTransition `json:"transition_to_next"`
}

type ffmpegCompositionSpeech struct {
	ID          string  `json:"id"`
	Audio       string  `json:"audio"`
	StartTime   float64 `json:"start_time"`
	Kind        string  `json:"kind"`
	CharacterID string  `json:"character_id"`
	Text        string  `json:"text"`
	Volume      float64 `json:"volume"`
}

type ffmpegCompositionTransition struct {
	Type       string `json:"type"`
	DurationMS int    `json:"duration_ms"`
}

type ffmpegCompositionSettings struct {
	Resolution string `json:"resolution"`
	FPS        int    `json:"fps"`
}

type ffmpegMediaProbe struct {
	Duration float64
	HasVideo bool
	HasAudio bool
}

type ffmpegPreparedClip struct {
	Clip                    ffmpegCompositionClip
	VisualVideoInputIndex   int
	OriginalAudioInputIndex int
	Duration                float64
	VideoPadDuration        float64
	HasOriginalAudio        bool
	SpeechTracks            []ffmpegPreparedSpeech
}

type ffmpegPreparedSpeech struct {
	Track      ffmpegCompositionSpeech
	InputIndex int
	Duration   float64
}

func parseFFmpegComposition(value any) (ffmpegComposition, bool, error) {
	if value == nil {
		return ffmpegComposition{}, false, nil
	}
	if text, ok := value.(string); ok && strings.TrimSpace(text) == "" {
		return ffmpegComposition{}, false, nil
	}
	payload, err := json.Marshal(value)
	if err != nil {
		return ffmpegComposition{}, false, fmt.Errorf("视频合成清单格式错误")
	}
	if text, ok := value.(string); ok {
		payload = []byte(text)
	}
	composition := ffmpegComposition{}
	if err := json.Unmarshal(payload, &composition); err != nil {
		return ffmpegComposition{}, false, fmt.Errorf("视频合成清单格式错误: %w", err)
	}
	if composition.Version != ffmpegCompositionVersion {
		return ffmpegComposition{}, false, fmt.Errorf("视频合成清单版本无效")
	}
	if len(composition.Clips) == 0 {
		return ffmpegComposition{}, false, fmt.Errorf("视频合成至少需要一个镜头")
	}
	if len(composition.Clips) > ffmpegCompositionMaxClips {
		return ffmpegComposition{}, false, fmt.Errorf("单次视频合成最多支持 %d 个镜头", ffmpegCompositionMaxClips)
	}
	return composition, true, nil
}

func buildFFmpegCompositionArgs(
	ctx context.Context,
	workspace string,
	outputPath string,
	composition ffmpegComposition,
) ([]string, error) {
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return nil, fmt.Errorf("当前服务器未安装 ffprobe，无法读取镜头信息")
	}
	resolution, err := normalizeFFmpegResolution(composition.Settings.Resolution)
	if err != nil {
		return nil, err
	}
	if resolution == "" {
		resolution = ffmpegDefaultResolution
	}
	fps, err := normalizeFFmpegFPS(composition.Settings.FPS)
	if err != nil {
		return nil, err
	}
	args := []string{"-hide_banner", "-loglevel", "error", "-progress", "pipe:1", "-nostats"}
	prepared := make([]ffmpegPreparedClip, 0, len(composition.Clips))
	nextInputIndex := 0
	for index, clip := range composition.Clips {
		current, currentArgs, nextIndex, prepareErr := prepareFFmpegCompositionClip(
			ctx,
			ffprobePath,
			index,
			clip,
			nextInputIndex,
		)
		if prepareErr != nil {
			return nil, prepareErr
		}
		args = append(args, currentArgs...)
		prepared = append(prepared, current)
		nextInputIndex = nextIndex
	}

	filters, videoLabel, audioLabel, totalDuration, err := buildFFmpegCompositionFilters(
		workspace,
		prepared,
		resolution,
		fps,
	)
	if err != nil {
		return nil, err
	}
	args = append(args,
		"-filter_complex", strings.Join(filters, ";"),
		"-map", "["+videoLabel+"]",
		"-map", "["+audioLabel+"]",
		"-t", formatFFmpegSeconds(totalDuration),
		"-r", strconv.Itoa(fps),
		"-c:v", "libx264",
		"-pix_fmt", "yuv420p",
		"-c:a", "aac",
		"-movflags", "+faststart",
		"-y", outputPath,
	)
	return args, nil
}

func prepareFFmpegCompositionClip(
	ctx context.Context,
	ffprobePath string,
	index int,
	clip ffmpegCompositionClip,
	inputIndex int,
) (ffmpegPreparedClip, []string, int, error) {
	label := fmt.Sprintf("第 %d 个镜头", index+1)
	videoPath, err := resolveLocalMediaPath(clip.VisualVideo)
	if err != nil {
		return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("读取%s画面失败: %w", label, err)
	}
	probe, err := probeFFmpegMedia(ctx, ffprobePath, videoPath)
	if err != nil {
		return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("读取%s画面信息失败: %w", label, err)
	}
	if !probe.HasVideo || probe.Duration <= 0 {
		return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("%s画面不是有效视频", label)
	}
	duration := clip.Duration
	videoPadDuration := 0.0
	if duration <= 0 {
		duration = probe.Duration
	} else if duration > probe.Duration {
		videoPadDuration = duration - probe.Duration
		maxPadDuration := math.Max(
			ffmpegCompositionVideoPadFloor,
			duration*ffmpegCompositionVideoPadRatio,
		)
		if videoPadDuration > maxPadDuration+0.01 {
			return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf(
				"%s画面只有 %.2f 秒，明显短于脚本要求的 %.2f 秒，请重新生成该镜头",
				label,
				probe.Duration,
				duration,
			)
		}
	}
	if duration < 0.1 {
		return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("%s时长过短", label)
	}
	if err := validateFFmpegCompositionVolume(label+"原声", clip.OriginalVolume); err != nil {
		return ffmpegPreparedClip{}, nil, inputIndex, err
	}
	transitionType := strings.ToLower(strings.TrimSpace(clip.TransitionToNext.Type))
	if transitionType == "" {
		transitionType = "none"
	}
	if transitionType != "none" && transitionType != "fade" && transitionType != "crossfade" {
		return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("%s使用了不支持的转场", label)
	}
	clip.TransitionToNext.Type = transitionType

	prepared := ffmpegPreparedClip{
		Clip:                    clip,
		VisualVideoInputIndex:   inputIndex,
		OriginalAudioInputIndex: -1,
		Duration:                duration,
		VideoPadDuration:        videoPadDuration,
	}
	args := []string{"-i", videoPath}
	nextInputIndex := inputIndex + 1
	if strings.TrimSpace(clip.OriginalAudio) != "" {
		originalPath, resolveErr := resolveLocalMediaPath(clip.OriginalAudio)
		if resolveErr != nil {
			return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("读取%s原声失败: %w", label, resolveErr)
		}
		if originalPath == videoPath {
			if probe.HasAudio {
				prepared.OriginalAudioInputIndex = inputIndex
				prepared.HasOriginalAudio = true
			}
		} else {
			originalProbe, probeErr := probeFFmpegMedia(ctx, ffprobePath, originalPath)
			if probeErr != nil {
				return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("读取%s原声信息失败: %w", label, probeErr)
			}
			if !originalProbe.HasAudio {
				return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("%s原声来源不包含音频", label)
			}
			prepared.OriginalAudioInputIndex = nextInputIndex
			prepared.HasOriginalAudio = true
			nextInputIndex++
			args = append(args, "-i", originalPath)
		}
	}

	for speechIndex, track := range clip.SpeechTracks {
		preparedTrack, audioPath, prepareErr := prepareFFmpegCompositionSpeech(
			ctx,
			ffprobePath,
			label,
			speechIndex,
			track,
			duration,
			nextInputIndex,
		)
		if prepareErr != nil {
			return ffmpegPreparedClip{}, nil, inputIndex, prepareErr
		}
		prepared.SpeechTracks = append(prepared.SpeechTracks, preparedTrack)
		args = append(args, "-i", audioPath)
		nextInputIndex++
	}
	if err := validateFFmpegSpeechTimeline(label, prepared.SpeechTracks); err != nil {
		return ffmpegPreparedClip{}, nil, inputIndex, err
	}
	return prepared, args, nextInputIndex, nil
}

func prepareFFmpegCompositionSpeech(
	ctx context.Context,
	ffprobePath string,
	clipLabel string,
	index int,
	track ffmpegCompositionSpeech,
	clipDuration float64,
	inputIndex int,
) (ffmpegPreparedSpeech, string, error) {
	label := fmt.Sprintf("%s第 %d 条语音", clipLabel, index+1)
	if strings.TrimSpace(track.ID) == "" || strings.TrimSpace(track.Audio) == "" {
		return ffmpegPreparedSpeech{}, "", fmt.Errorf("%s配置不完整", label)
	}
	if track.StartTime < 0 || track.StartTime >= clipDuration {
		return ffmpegPreparedSpeech{}, "", fmt.Errorf("%s开始时间超出镜头范围", label)
	}
	if err := validateFFmpegCompositionVolume(label, track.Volume); err != nil {
		return ffmpegPreparedSpeech{}, "", err
	}
	audioPath, err := resolveLocalMediaPath(track.Audio)
	if err != nil {
		return ffmpegPreparedSpeech{}, "", fmt.Errorf("读取%s失败: %w", label, err)
	}
	probe, err := probeFFmpegMedia(ctx, ffprobePath, audioPath)
	if err != nil {
		return ffmpegPreparedSpeech{}, "", fmt.Errorf("读取%s信息失败: %w", label, err)
	}
	if !probe.HasAudio || probe.Duration <= 0 {
		return ffmpegPreparedSpeech{}, "", fmt.Errorf("%s不是有效音频", label)
	}
	if track.StartTime+probe.Duration > clipDuration+0.02 {
		return ffmpegPreparedSpeech{}, "", fmt.Errorf(
			"%s在 %.2f 秒结束，超过镜头 %.2f 秒时长",
			label,
			track.StartTime+probe.Duration,
			clipDuration,
		)
	}
	return ffmpegPreparedSpeech{
		Track:      track,
		InputIndex: inputIndex,
		Duration:   probe.Duration,
	}, audioPath, nil
}

func validateFFmpegSpeechTimeline(label string, tracks []ffmpegPreparedSpeech) error {
	intervals := make([]ffmpegSpeechInterval, 0, len(tracks))
	for _, track := range tracks {
		intervals = append(intervals, ffmpegSpeechInterval{
			ID:        track.Track.ID,
			StartTime: track.Track.StartTime,
			Duration:  track.Duration,
		})
	}
	return validateFFmpegSpeechIntervals(label, intervals)
}

func buildFFmpegCompositionFilters(
	workspace string,
	clips []ffmpegPreparedClip,
	resolution string,
	fps int,
) ([]string, string, string, float64, error) {
	width, height, _ := strings.Cut(resolution, "x")
	filters := make([]string, 0, len(clips)*4+8)
	for index, clip := range clips {
		videoPadFilter := ""
		if clip.VideoPadDuration > 0 {
			videoPadFilter = fmt.Sprintf(
				"tpad=stop_mode=clone:stop_duration=%s,",
				formatFFmpegSeconds(clip.VideoPadDuration),
			)
		}
		filters = append(filters, fmt.Sprintf(
			"[%d:v:0]%strim=duration=%s,setpts=PTS-STARTPTS,scale=%s:%s:force_original_aspect_ratio=decrease,pad=%s:%s:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=%d,settb=AVTB,format=yuv420p[v%d]",
			clip.VisualVideoInputIndex,
			videoPadFilter,
			formatFFmpegSeconds(clip.Duration),
			width,
			height,
			width,
			height,
			fps,
			index,
		))
		baseLabel := fmt.Sprintf("abase%d", index)
		finalLabel := fmt.Sprintf("a%d", index)
		if len(clip.SpeechTracks) == 0 {
			baseLabel = finalLabel
		}
		baseFilter := fmt.Sprintf(
			"anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=%s,asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[%s]",
			formatFFmpegSeconds(clip.Duration),
			baseLabel,
		)
		if clip.OriginalAudioInputIndex >= 0 && clip.HasOriginalAudio {
			baseFilter = fmt.Sprintf(
				"[%d:a:0]atrim=duration=%s,asetpts=PTS-STARTPTS,aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=%s,apad,atrim=duration=%s[%s]",
				clip.OriginalAudioInputIndex,
				formatFFmpegSeconds(clip.Duration),
				formatFFmpegVolume(clip.Clip.OriginalVolume),
				formatFFmpegSeconds(clip.Duration),
				baseLabel,
			)
		}
		filters = append(filters, baseFilter)
		if len(clip.SpeechTracks) == 0 {
			continue
		}
		mixInputs := []string{"[" + baseLabel + "]"}
		for speechIndex, speech := range clip.SpeechTracks {
			speechLabel := fmt.Sprintf("speech%d_%d", index, speechIndex)
			delayMS := int64(math.Round(speech.Track.StartTime * 1000))
			filters = append(filters, fmt.Sprintf(
				"[%d:a:0]atrim=duration=%s,asetpts=PTS-STARTPTS,aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=%s,adelay=%d|%d,apad,atrim=duration=%s[%s]",
				speech.InputIndex,
				formatFFmpegSeconds(speech.Duration),
				formatFFmpegVolume(speech.Track.Volume),
				delayMS,
				delayMS,
				formatFFmpegSeconds(clip.Duration),
				speechLabel,
			))
			mixInputs = append(mixInputs, "["+speechLabel+"]")
		}
		filters = append(filters, fmt.Sprintf(
			"%samix=inputs=%d:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.95,atrim=duration=%s[%s]",
			strings.Join(mixInputs, ""),
			len(mixInputs),
			formatFFmpegSeconds(clip.Duration),
			finalLabel,
		))
	}

	videoLabel := "v0"
	audioLabel := "a0"
	totalDuration := clips[0].Duration
	transitionDurations := make([]float64, len(clips))
	for index := 1; index < len(clips); index++ {
		previous := clips[index-1]
		transitionDuration, err := normalizeFFmpegTransitionDuration(previous, clips[index])
		if err != nil {
			return nil, "", "", 0, err
		}
		transitionDurations[index-1] = transitionDuration
		nextVideoLabel := fmt.Sprintf("vjoin%d", index)
		nextAudioLabel := fmt.Sprintf("ajoin%d", index)
		if transitionDuration <= 0 {
			filters = append(filters, fmt.Sprintf(
				"[%s][%s][v%d][a%d]concat=n=2:v=1:a=1[%s][%s]",
				videoLabel,
				audioLabel,
				index,
				index,
				nextVideoLabel,
				nextAudioLabel,
			))
			totalDuration += clips[index].Duration
		} else {
			xfadeType := "fade"
			if previous.Clip.TransitionToNext.Type == "crossfade" {
				xfadeType = "dissolve"
			}
			filters = append(filters,
				fmt.Sprintf(
					"[%s][v%d]xfade=transition=%s:duration=%s:offset=%s[%s]",
					videoLabel,
					index,
					xfadeType,
					formatFFmpegSeconds(transitionDuration),
					formatFFmpegSeconds(totalDuration-transitionDuration),
					nextVideoLabel,
				),
				fmt.Sprintf(
					"[%s][a%d]acrossfade=d=%s:c1=tri:c2=tri[%s]",
					audioLabel,
					index,
					formatFFmpegSeconds(transitionDuration),
					nextAudioLabel,
				),
			)
			totalDuration += clips[index].Duration - transitionDuration
		}
		videoLabel = nextVideoLabel
		audioLabel = nextAudioLabel
	}

	subtitlePath, err := writeFFmpegCompositionSubtitles(workspace, clips, transitionDurations)
	if err != nil {
		return nil, "", "", 0, err
	}
	if subtitlePath != "" {
		outputVideoLabel := "vsubtitle"
		filters = append(filters, fmt.Sprintf(
			"[%s]subtitles='%s':charenc=UTF-8[%s]",
			videoLabel,
			escapeFFmpegFilterPath(subtitlePath),
			outputVideoLabel,
		))
		videoLabel = outputVideoLabel
	}
	return filters, videoLabel, audioLabel, totalDuration, nil
}

func normalizeFFmpegTransitionDuration(previous ffmpegPreparedClip, next ffmpegPreparedClip) (float64, error) {
	transition := previous.Clip.TransitionToNext
	if transition.Type == "none" {
		return 0, nil
	}
	duration := float64(transition.DurationMS) / 1000
	if duration < 0.1 || duration > 5 {
		return 0, fmt.Errorf("镜头“%s”的转场时长必须在 0.1 到 5 秒之间", previous.Clip.Title)
	}
	maxDuration := math.Min(previous.Duration, next.Duration) - 0.05
	if maxDuration < 0.1 || duration > maxDuration {
		return 0, fmt.Errorf("镜头“%s”的转场时长不能超过相邻镜头时长", previous.Clip.Title)
	}
	return duration, nil
}

func writeFFmpegCompositionSubtitles(
	workspace string,
	clips []ffmpegPreparedClip,
	transitionDurations []float64,
) (string, error) {
	var content strings.Builder
	sequence := 0
	start := 0.0
	for index, clip := range clips {
		hasSpeechSubtitle := false
		orderedSpeech := append([]ffmpegPreparedSpeech(nil), clip.SpeechTracks...)
		sort.SliceStable(orderedSpeech, func(left, right int) bool {
			return orderedSpeech[left].Track.StartTime < orderedSpeech[right].Track.StartTime
		})
		for _, speech := range orderedSpeech {
			text := strings.TrimSpace(strings.ReplaceAll(speech.Track.Text, "\r", ""))
			if text == "" {
				continue
			}
			hasSpeechSubtitle = true
			sequence++
			writeFFmpegSRTEntry(
				&content,
				sequence,
				start+speech.Track.StartTime,
				start+speech.Track.StartTime+speech.Duration,
				text,
			)
		}
		if !hasSpeechSubtitle {
			subtitle := strings.TrimSpace(strings.ReplaceAll(clip.Clip.Subtitle, "\r", ""))
			if subtitle != "" {
				sequence++
				writeFFmpegSRTEntry(
					&content,
					sequence,
					start,
					start+clip.Duration,
					subtitle,
				)
			}
		}
		start += clip.Duration
		if index < len(transitionDurations) {
			start -= transitionDurations[index]
		}
	}
	if sequence == 0 {
		return "", nil
	}
	path := filepath.Join(workspace, "composition.srt")
	if err := os.WriteFile(path, []byte(content.String()), 0600); err != nil {
		return "", fmt.Errorf("写入合成字幕失败: %w", err)
	}
	return path, nil
}

func writeFFmpegSRTEntry(
	content *strings.Builder,
	sequence int,
	start float64,
	end float64,
	text string,
) {
	content.WriteString(strconv.Itoa(sequence))
	content.WriteByte('\n')
	content.WriteString(formatFFmpegSRTTime(start))
	content.WriteString(" --> ")
	content.WriteString(formatFFmpegSRTTime(end))
	content.WriteByte('\n')
	content.WriteString(text)
	content.WriteString("\n\n")
}

func probeFFmpegMedia(ctx context.Context, ffprobePath string, path string) (ffmpegMediaProbe, error) {
	command := exec.CommandContext(
		ctx,
		ffprobePath,
		"-v", "error",
		"-show_entries", "format=duration:stream=codec_type,duration",
		"-of", "json",
		path,
	)
	payload, err := command.Output()
	if err != nil {
		return ffmpegMediaProbe{}, err
	}
	result := struct {
		Streams []struct {
			CodecType string `json:"codec_type"`
			Duration  string `json:"duration"`
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
		case "audio":
			probe.HasAudio = true
		}
	}
	return probe, nil
}

func validateFFmpegCompositionVolume(label string, value float64) error {
	if math.IsNaN(value) || math.IsInf(value, 0) || value < 0 || value > 1 {
		return fmt.Errorf("%s音量必须在 0 到 1 之间", label)
	}
	return nil
}

func formatFFmpegSeconds(value float64) string {
	return strconv.FormatFloat(value, 'f', 3, 64)
}

func formatFFmpegVolume(value float64) string {
	return strconv.FormatFloat(value, 'f', 3, 64)
}

func formatFFmpegSRTTime(value float64) string {
	if value < 0 {
		value = 0
	}
	milliseconds := int64(math.Round(value * 1000))
	hours := milliseconds / 3_600_000
	milliseconds %= 3_600_000
	minutes := milliseconds / 60_000
	milliseconds %= 60_000
	seconds := milliseconds / 1000
	milliseconds %= 1000
	return fmt.Sprintf("%02d:%02d:%02d,%03d", hours, minutes, seconds, milliseconds)
}
