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

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	ffmpegCompositionVersion       = 3
	ffmpegCompositionMaxClips      = 50
	ffmpegCompositionVideoPadFloor = 1.0
	ffmpegCompositionVideoPadRatio = 0.1

	ffmpegCompositionModeTranscode         = "transcode"
	ffmpegCompositionModeStreamCopy        = "stream_copy"
	ffmpegCompositionModeCopyVideoMixAudio = "copy_video_mix_audio"
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
	OriginalVolume   float64                     `json:"original_volume"`
	SpeechTracks     []ffmpegCompositionSpeech   `json:"speech_tracks"`
	SubtitleTracks   []ffmpegCompositionSubtitle `json:"subtitle_tracks"`
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

type ffmpegCompositionSubtitle struct {
	ID        string  `json:"id"`
	Text      string  `json:"text"`
	StartTime float64 `json:"start_time"`
	EndTime   float64 `json:"end_time"`
	SpeechID  string  `json:"speech_id"`
	Source    string  `json:"source"`
}

type ffmpegCompositionTransition struct {
	Type       string `json:"type"`
	DurationMS int    `json:"duration_ms"`
}

type ffmpegCompositionSettings struct {
	Resolution string `json:"resolution"`
	FPS        int    `json:"fps"`
}

type ffmpegPreparedClip struct {
	Clip                    ffmpegCompositionClip
	VisualVideoInputIndex   int
	OriginalAudioInputIndex int
	Duration                float64
	VideoPadDuration        float64
	VisualVideoPath         string
	VisualProbe             ffmpegMediaProbe
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
) ([]string, string, error) {
	ffprobePath, err := exec.LookPath("ffprobe")
	if err != nil {
		return nil, "", fmt.Errorf("当前服务器未安装 ffprobe，无法读取镜头信息")
	}
	probeCache := newFFmpegProbeCache(ffprobePath)
	if err := probeCache.Preload(ctx, ffmpegCompositionProbePaths(composition)); err != nil {
		return nil, "", err
	}
	resolution, err := normalizeFFmpegResolution(composition.Settings.Resolution)
	if err != nil {
		return nil, "", err
	}
	fps, err := normalizeFFmpegFPS(composition.Settings.FPS)
	if err != nil {
		return nil, "", err
	}
	inputArgs := ffmpegCommandArgs()
	prepared := make([]ffmpegPreparedClip, 0, len(composition.Clips))
	nextInputIndex := 0
	for index, clip := range composition.Clips {
		current, currentArgs, nextIndex, prepareErr := prepareFFmpegCompositionClip(
			ctx,
			probeCache,
			index,
			clip,
			nextInputIndex,
		)
		if prepareErr != nil {
			return nil, "", prepareErr
		}
		inputArgs = append(inputArgs, currentArgs...)
		prepared = append(prepared, current)
		nextInputIndex = nextIndex
	}
	if resolution == "" {
		resolution, err = ffmpegCompositionAutoResolution(prepared[0])
		if err != nil {
			return nil, "", err
		}
	}
	fastArgs, fastConcat, err := buildFFmpegFastConcatArgs(
		workspace,
		outputPath,
		prepared,
		resolution,
		fps,
	)
	if err != nil || fastConcat {
		return fastArgs, ffmpegCompositionModeStreamCopy, err
	}
	mixedAudioArgs, copyVideoMixAudio, err := buildFFmpegCopyVideoMixAudioArgs(
		workspace,
		outputPath,
		inputArgs,
		nextInputIndex,
		prepared,
		resolution,
		fps,
	)
	if err != nil || copyVideoMixAudio {
		return mixedAudioArgs, ffmpegCompositionModeCopyVideoMixAudio, err
	}
	if fps == 0 {
		fps, err = ffmpegCompositionAutoFPS(prepared[0])
		if err != nil {
			return nil, "", err
		}
	}

	filters, videoLabel, audioLabel, totalDuration, err := buildFFmpegCompositionFilters(
		workspace,
		prepared,
		resolution,
		fps,
	)
	if err != nil {
		return nil, "", err
	}
	args := append(inputArgs,
		"-filter_complex", strings.Join(filters, ";"),
		"-map", "["+videoLabel+"]",
		"-map", "["+audioLabel+"]",
		"-t", formatFFmpegSeconds(totalDuration),
		"-r", strconv.Itoa(fps),
	)
	args = appendFFmpegVideoEncodingArgs(args)
	args = append(args,
		"-c:a", "aac",
		"-movflags", "+faststart",
		"-y", outputPath,
	)
	return args, ffmpegCompositionModeTranscode, nil
}

func ffmpegCompositionProbePaths(composition ffmpegComposition) []string {
	values := make([]string, 0, len(composition.Clips)*2)
	appendPath := func(value string) {
		if path, err := resolveLocalMediaPath(value); err == nil {
			values = append(values, path)
		}
	}
	for _, clip := range composition.Clips {
		appendPath(clip.VisualVideo)
		if strings.TrimSpace(clip.OriginalAudio) != "" {
			appendPath(clip.OriginalAudio)
		}
		for _, speech := range clip.SpeechTracks {
			appendPath(speech.Audio)
		}
	}
	return values
}

func ffmpegCompositionAutoResolution(clip ffmpegPreparedClip) (string, error) {
	width := clip.VisualProbe.Width - clip.VisualProbe.Width%2
	height := clip.VisualProbe.Height - clip.VisualProbe.Height%2
	if width < 2 || height < 2 {
		return "", fmt.Errorf("无法读取首个镜头的画面尺寸，请手动选择输出分辨率")
	}
	if width > ffmpegMaxDimension || height > ffmpegMaxDimension || width*height > ffmpegMaxPixels {
		return "", fmt.Errorf("首个镜头分辨率超过 4K 像素规模，请手动选择较低的输出分辨率")
	}
	return fmt.Sprintf("%dx%d", width, height), nil
}

func ffmpegCompositionAutoFPS(clip ffmpegPreparedClip) (int, error) {
	fps := int(math.Round(clip.VisualProbe.VideoFrameRate))
	if fps < 1 || fps > 120 {
		return 0, fmt.Errorf("无法读取首个镜头的帧率，请手动选择输出帧率")
	}
	return fps, nil
}

func prepareFFmpegCompositionClip(
	ctx context.Context,
	probeCache *ffmpegProbeCache,
	index int,
	clip ffmpegCompositionClip,
	inputIndex int,
) (ffmpegPreparedClip, []string, int, error) {
	label := fmt.Sprintf("第 %d 个镜头", index+1)
	videoPath, err := resolveLocalMediaPath(clip.VisualVideo)
	if err != nil {
		return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("读取%s画面失败: %w", label, err)
	}
	probe, err := probeCache.Probe(ctx, videoPath)
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
	transitionType, ok := botprotocol.NormalizeVideoTransitionType(clip.TransitionToNext.Type)
	if !ok {
		return ffmpegPreparedClip{}, nil, inputIndex, fmt.Errorf("%s使用了不支持的转场", label)
	}
	clip.TransitionToNext.Type = transitionType

	prepared := ffmpegPreparedClip{
		Clip:                    clip,
		VisualVideoInputIndex:   inputIndex,
		OriginalAudioInputIndex: -1,
		Duration:                duration,
		VideoPadDuration:        videoPadDuration,
		VisualVideoPath:         videoPath,
		VisualProbe:             probe,
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
			originalProbe, probeErr := probeCache.Probe(ctx, originalPath)
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
			probeCache,
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
	probeCache *ffmpegProbeCache,
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
	probe, err := probeCache.Probe(ctx, audioPath)
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
			"[%d:v:0]%strim=duration=%s,setpts=PTS-STARTPTS,%s[v%d]",
			clip.VisualVideoInputIndex,
			videoPadFilter,
			formatFFmpegSeconds(clip.Duration),
			ffmpegCompositionVideoNormalizeFilter(clip.VisualProbe, resolution, fps),
			index,
		))
		filters = appendFFmpegCompositionClipAudioFilters(filters, clip, index)
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
			xfadeType, ok := botprotocol.FFmpegVideoTransitionName(previous.Clip.TransitionToNext.Type)
			if !ok || xfadeType == "" {
				return nil, "", "", 0, fmt.Errorf("镜头“%s”的转场配置无效", previous.Clip.Title)
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
	if err := validateFFmpegCompositionSpeechTimeline(clips, transitionDurations); err != nil {
		return nil, "", "", 0, err
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

func ffmpegCompositionVideoNormalizeFilter(
	probe ffmpegMediaProbe,
	resolution string,
	fps int,
) string {
	filters := make([]string, 0, 4)
	if resolution != fmt.Sprintf("%dx%d", probe.Width, probe.Height) {
		filters = append(filters, ffmpegScalePadFilter(resolution))
	}
	filters = append(filters, "setsar=1")
	if math.Abs(probe.VideoFrameRate-float64(fps)) > 0.001 {
		filters = append(filters, "fps="+strconv.Itoa(fps))
	}
	filters = append(filters, "settb=AVTB")
	if probe.VideoPixelFormat != "yuv420p" {
		filters = append(filters, "format=yuv420p")
	}
	return strings.Join(filters, ",")
}

func appendFFmpegCompositionClipAudioFilters(
	filters []string,
	clip ffmpegPreparedClip,
	index int,
) []string {
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
		return filters
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
	return append(filters, fmt.Sprintf(
		"%samix=inputs=%d:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.95,atrim=duration=%s[%s]",
		strings.Join(mixInputs, ""),
		len(mixInputs),
		formatFFmpegSeconds(clip.Duration),
		finalLabel,
	))
}

func validateFFmpegCompositionSpeechTimeline(
	clips []ffmpegPreparedClip,
	transitionDurations []float64,
) error {
	intervals := make([]ffmpegSpeechInterval, 0)
	clipStart := 0.0
	for index, clip := range clips {
		for _, speech := range clip.SpeechTracks {
			intervals = append(intervals, ffmpegSpeechInterval{
				ID:        clip.Clip.ID + ":" + speech.Track.ID,
				StartTime: clipStart + speech.Track.StartTime,
				Duration:  speech.Duration,
			})
		}
		clipStart += clip.Duration
		if index < len(transitionDurations) {
			clipStart -= transitionDurations[index]
		}
	}
	return validateFFmpegSpeechIntervals("整部视频", intervals)
}

func normalizeFFmpegTransitionDuration(previous ffmpegPreparedClip, next ffmpegPreparedClip) (float64, error) {
	transition := previous.Clip.TransitionToNext
	if transition.Type == botprotocol.VideoTransitionNone {
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
		orderedSubtitles := append([]ffmpegCompositionSubtitle(nil), clip.Clip.SubtitleTracks...)
		sort.SliceStable(orderedSubtitles, func(left, right int) bool {
			return orderedSubtitles[left].StartTime < orderedSubtitles[right].StartTime
		})
		for _, subtitle := range orderedSubtitles {
			text := strings.TrimSpace(strings.ReplaceAll(subtitle.Text, "\r", ""))
			if text == "" {
				return "", fmt.Errorf("镜头“%s”的字幕文本不能为空", clip.Clip.Title)
			}
			startTime := subtitle.StartTime
			endTime := subtitle.EndTime
			if strings.TrimSpace(subtitle.SpeechID) != "" {
				matched := false
				for _, speech := range clip.SpeechTracks {
					if speech.Track.ID != subtitle.SpeechID {
						continue
					}
					startTime = speech.Track.StartTime
					endTime = startTime + speech.Duration
					matched = true
					break
				}
				if !matched {
					return "", fmt.Errorf("镜头“%s”的字幕未找到对应语音 %s", clip.Clip.Title, subtitle.SpeechID)
				}
			}
			if startTime < 0 || endTime <= startTime || endTime > clip.Duration+0.02 {
				return "", fmt.Errorf("镜头“%s”的字幕时间范围无效", clip.Clip.Title)
			}
			sequence++
			writeFFmpegSRTEntry(
				&content,
				sequence,
				start+startTime,
				start+endTime,
				text,
			)
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
