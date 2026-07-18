package processor

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

const (
	ffmpegCompositionVersion  = 1
	ffmpegCompositionMaxClips = 50
	ffmpegDefaultResolution   = "1920x1080"
)

type ffmpegComposition struct {
	Version  int                       `json:"version"`
	Clips    []ffmpegCompositionClip   `json:"clips"`
	Settings ffmpegCompositionSettings `json:"settings"`
}

type ffmpegCompositionClip struct {
	ID               string                      `json:"id"`
	Title            string                      `json:"title"`
	Video            string                      `json:"video"`
	Duration         float64                     `json:"duration"`
	Subtitle         string                      `json:"subtitle"`
	Sound            ffmpegCompositionSound      `json:"sound"`
	TransitionToNext ffmpegCompositionTransition `json:"transition_to_next"`
}

type ffmpegCompositionSound struct {
	KeepOriginal   bool    `json:"keep_original"`
	OriginalVolume float64 `json:"original_volume"`
	Voice          string  `json:"voice"`
	VoiceVolume    float64 `json:"voice_volume"`
}

type ffmpegCompositionTransition struct {
	Type       string `json:"type"`
	DurationMS int    `json:"duration_ms"`
}

type ffmpegCompositionSettings struct {
	Resolution            string  `json:"resolution"`
	FPS                   int     `json:"fps"`
	BackgroundMusic       string  `json:"background_music"`
	BackgroundMusicVolume float64 `json:"background_music_volume"`
}

type ffmpegMediaProbe struct {
	Duration float64
	HasVideo bool
	HasAudio bool
}

type ffmpegPreparedClip struct {
	Clip             ffmpegCompositionClip
	VideoInputIndex  int
	VoiceInputIndex  int
	Duration         float64
	HasOriginalAudio bool
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
	if err := validateFFmpegCompositionVolume("背景音乐", composition.Settings.BackgroundMusicVolume); err != nil {
		return nil, err
	}

	args := []string{"-hide_banner", "-loglevel", "error", "-progress", "pipe:1", "-nostats"}
	prepared := make([]ffmpegPreparedClip, 0, len(composition.Clips))
	for index, clip := range composition.Clips {
		current, currentArgs, prepareErr := prepareFFmpegCompositionClip(
			ctx,
			ffprobePath,
			index,
			clip,
			ffmpegCompositionInputCount(prepared),
		)
		if prepareErr != nil {
			return nil, prepareErr
		}
		args = append(args, currentArgs...)
		prepared = append(prepared, current)
	}

	backgroundInputIndex := -1
	if strings.TrimSpace(composition.Settings.BackgroundMusic) != "" {
		backgroundPath, resolveErr := resolveLocalMediaPath(composition.Settings.BackgroundMusic)
		if resolveErr != nil {
			return nil, fmt.Errorf("读取背景音乐失败: %w", resolveErr)
		}
		probe, probeErr := probeFFmpegMedia(ctx, ffprobePath, backgroundPath)
		if probeErr != nil {
			return nil, fmt.Errorf("读取背景音乐信息失败: %w", probeErr)
		}
		if !probe.HasAudio {
			return nil, fmt.Errorf("背景音乐不是有效音频")
		}
		backgroundInputIndex = ffmpegCompositionInputCount(prepared)
		args = append(args, "-stream_loop", "-1", "-i", backgroundPath)
	}

	filters, videoLabel, audioLabel, totalDuration, err := buildFFmpegCompositionFilters(
		workspace,
		prepared,
		resolution,
		fps,
		backgroundInputIndex,
		composition.Settings.BackgroundMusicVolume,
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
	videoInputIndex int,
) (ffmpegPreparedClip, []string, error) {
	label := fmt.Sprintf("第 %d 个镜头", index+1)
	videoPath, err := resolveLocalMediaPath(clip.Video)
	if err != nil {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("读取%s失败: %w", label, err)
	}
	probe, err := probeFFmpegMedia(ctx, ffprobePath, videoPath)
	if err != nil {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("读取%s信息失败: %w", label, err)
	}
	if !probe.HasVideo || probe.Duration <= 0 {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("%s不是有效视频", label)
	}
	duration := clip.Duration
	if duration <= 0 || duration > probe.Duration {
		duration = probe.Duration
	}
	if duration < 0.1 {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("%s时长过短", label)
	}
	if err := validateFFmpegCompositionVolume(label+"原声", clip.Sound.OriginalVolume); err != nil {
		return ffmpegPreparedClip{}, nil, err
	}
	if err := validateFFmpegCompositionVolume(label+"配音", clip.Sound.VoiceVolume); err != nil {
		return ffmpegPreparedClip{}, nil, err
	}
	transitionType := strings.ToLower(strings.TrimSpace(clip.TransitionToNext.Type))
	if transitionType == "" {
		transitionType = "none"
	}
	if transitionType != "none" && transitionType != "fade" && transitionType != "crossfade" {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("%s使用了不支持的转场", label)
	}
	clip.TransitionToNext.Type = transitionType

	prepared := ffmpegPreparedClip{
		Clip:             clip,
		VideoInputIndex:  videoInputIndex,
		VoiceInputIndex:  -1,
		Duration:         duration,
		HasOriginalAudio: probe.HasAudio,
	}
	args := []string{"-i", videoPath}
	if strings.TrimSpace(clip.Sound.Voice) == "" {
		return prepared, args, nil
	}
	voicePath, err := resolveLocalMediaPath(clip.Sound.Voice)
	if err != nil {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("读取%s配音失败: %w", label, err)
	}
	voiceProbe, err := probeFFmpegMedia(ctx, ffprobePath, voicePath)
	if err != nil {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("读取%s配音信息失败: %w", label, err)
	}
	if !voiceProbe.HasAudio {
		return ffmpegPreparedClip{}, nil, fmt.Errorf("%s配音不是有效音频", label)
	}
	prepared.VoiceInputIndex = videoInputIndex + 1
	args = append(args, "-i", voicePath)
	return prepared, args, nil
}

func ffmpegCompositionInputCount(clips []ffmpegPreparedClip) int {
	count := len(clips)
	for _, clip := range clips {
		if clip.VoiceInputIndex >= 0 {
			count++
		}
	}
	return count
}

func buildFFmpegCompositionFilters(
	workspace string,
	clips []ffmpegPreparedClip,
	resolution string,
	fps int,
	backgroundInputIndex int,
	backgroundVolume float64,
) ([]string, string, string, float64, error) {
	width, height, _ := strings.Cut(resolution, "x")
	filters := make([]string, 0, len(clips)*4+8)
	for index, clip := range clips {
		filters = append(filters, fmt.Sprintf(
			"[%d:v:0]trim=duration=%s,setpts=PTS-STARTPTS,scale=%s:%s:force_original_aspect_ratio=decrease,pad=%s:%s:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=%d,settb=AVTB,format=yuv420p[v%d]",
			clip.VideoInputIndex,
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
		if clip.VoiceInputIndex < 0 {
			baseLabel = finalLabel
		}
		baseFilter := fmt.Sprintf(
			"anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=%s,asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[%s]",
			formatFFmpegSeconds(clip.Duration),
			baseLabel,
		)
		if clip.Clip.Sound.KeepOriginal && clip.HasOriginalAudio {
			baseFilter = fmt.Sprintf(
				"[%d:a:0]atrim=duration=%s,asetpts=PTS-STARTPTS,aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=%s,apad,atrim=duration=%s[%s]",
				clip.VideoInputIndex,
				formatFFmpegSeconds(clip.Duration),
				formatFFmpegVolume(clip.Clip.Sound.OriginalVolume),
				formatFFmpegSeconds(clip.Duration),
				baseLabel,
			)
		}
		filters = append(filters, baseFilter)
		if clip.VoiceInputIndex < 0 {
			continue
		}
		voiceLabel := fmt.Sprintf("voice%d", index)
		filters = append(filters, fmt.Sprintf(
			"[%d:a:0]atrim=duration=%s,asetpts=PTS-STARTPTS,aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=%s,apad,atrim=duration=%s[%s]",
			clip.VoiceInputIndex,
			formatFFmpegSeconds(clip.Duration),
			formatFFmpegVolume(clip.Clip.Sound.VoiceVolume),
			formatFFmpegSeconds(clip.Duration),
			voiceLabel,
		))
		filters = append(filters, fmt.Sprintf(
			"[%s][%s]amix=inputs=2:duration=longest:dropout_transition=0,atrim=duration=%s[%s]",
			baseLabel,
			voiceLabel,
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
	if backgroundInputIndex >= 0 {
		backgroundLabel := "background"
		outputAudioLabel := "aout"
		filters = append(filters,
			fmt.Sprintf(
				"[%d:a:0]atrim=duration=%s,asetpts=PTS-STARTPTS,aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=%s,apad,atrim=duration=%s[%s]",
				backgroundInputIndex,
				formatFFmpegSeconds(totalDuration),
				formatFFmpegVolume(backgroundVolume),
				formatFFmpegSeconds(totalDuration),
				backgroundLabel,
			),
			fmt.Sprintf(
				"[%s][%s]amix=inputs=2:duration=first:dropout_transition=0[%s]",
				audioLabel,
				backgroundLabel,
				outputAudioLabel,
			),
		)
		audioLabel = outputAudioLabel
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
		subtitle := strings.TrimSpace(strings.ReplaceAll(clip.Clip.Subtitle, "\r", ""))
		if subtitle != "" {
			sequence++
			content.WriteString(strconv.Itoa(sequence))
			content.WriteByte('\n')
			content.WriteString(formatFFmpegSRTTime(start))
			content.WriteString(" --> ")
			content.WriteString(formatFFmpegSRTTime(start + clip.Duration))
			content.WriteByte('\n')
			content.WriteString(subtitle)
			content.WriteString("\n\n")
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
