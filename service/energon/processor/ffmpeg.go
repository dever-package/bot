package processor

import (
	"bufio"
	"bytes"
	"context"
	"errors"
	"fmt"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontupload "github.com/dever-package/front/service/upload"
	uploadprovider "github.com/dever-package/front/service/upload/provider"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const (
	ffmpegProcessorKey     = "ffmpeg"
	ffmpegComposeOperation = "compose"
	ffmpegVideoRuleID      = uint64(2)
	ffmpegAudioRuleID      = uint64(3)
	ffmpegMaxDimension     = 8192
	ffmpegMaxPixels        = 3840 * 2160
	ffmpegVideoEncoder     = "libx264"
	ffmpegVideoPreset      = "veryfast"
	ffmpegVideoCRF         = "22"
)

var ffmpegResolutionPattern = regexp.MustCompile(`^\d{2,5}x\d{2,5}$`)

type FFmpegProcessor struct{}

func NewFFmpegProcessor() FFmpegProcessor {
	return FFmpegProcessor{}
}

func (FFmpegProcessor) Manifest() Manifest {
	return Manifest{
		Key:  ffmpegProcessorKey,
		Name: "FFmpeg",
		ParamDefinitions: []ParamDefinition{
			{
				Key:          "videos",
				Name:         "视频片段",
				Type:         "files",
				Usage:        1,
				ValueType:    "string",
				UploadRuleID: ffmpegVideoRuleID,
				MaxFiles:     50,
				Sort:         110,
			},
			{
				Key:          "subtitles",
				Name:         "字幕文件",
				Type:         "file",
				Usage:        2,
				ValueType:    "string",
				UploadRuleID: 6,
				MaxFiles:     1,
				Sort:         120,
			},
			{
				Key:          "fps",
				Name:         "帧率",
				Type:         "option",
				Usage:        2,
				ValueType:    "number",
				DefaultValue: "25",
				Sort:         130,
				Options: []ParamOptionDefinition{
					{Name: "24 帧/秒", Value: "24", Sort: 1},
					{Name: "25 帧/秒", Value: "25", Sort: 2},
					{Name: "30 帧/秒", Value: "30", Sort: 3},
					{Name: "50 帧/秒", Value: "50", Sort: 4},
					{Name: "60 帧/秒", Value: "60", Sort: 5},
				},
			},
		},
		Services: []ServiceSpec{
			{
				Key:  ffmpegComposeOperation,
				Name: "FFmpeg 视频合成",
				Kind: botprotocol.MediaTypeVideo,
				Sort: 10,
				Operations: []OperationSpec{
					{
						Key:  ffmpegComposeOperation,
						Name: "合成视频",
						Sort: 10,
						Params: []ParamSpec{
							{ParamKey: "videos", NativeKey: "videos", Name: "视频片段", Sort: 10},
							{ParamKey: "audio", NativeKey: "audio", Name: "背景音频", Sort: 20},
							{ParamKey: "subtitles", NativeKey: "subtitles", Name: "字幕文件", Sort: 30},
							{ParamKey: "resolution", NativeKey: "resolution", Name: "输出分辨率", Sort: 40},
							{ParamKey: "fps", NativeKey: "fps", Name: "输出帧率", Sort: 50},
						},
					},
				},
			},
		},
	}
}

func (FFmpegProcessor) Execute(ctx context.Context, request ExecuteRequest) (any, error) {
	if normalizeKey(request.Operation) != ffmpegComposeOperation {
		return nil, fmt.Errorf("FFmpeg 不支持操作“%s”", strings.TrimSpace(request.Operation))
	}
	ffmpegPath, err := exec.LookPath("ffmpeg")
	if err != nil {
		return nil, fmt.Errorf("当前服务器未安装 FFmpeg，无法执行视频合成")
	}

	workspace, err := os.MkdirTemp("", "energon-ffmpeg-")
	if err != nil {
		return nil, fmt.Errorf("创建视频合成临时目录失败: %w", err)
	}
	defer os.RemoveAll(workspace)

	outputPath := filepath.Join(workspace, "output.mp4")
	prepareStartedAt := time.Now()
	composition, hasComposition, err := parseFFmpegComposition(request.Input["composition"])
	if err != nil {
		return nil, err
	}
	var args []string
	compositionMode := ffmpegCompositionModeTranscode
	statusText := "正在合成视频"
	if hasComposition {
		args, compositionMode, err = buildFFmpegCompositionArgs(ctx, workspace, outputPath, composition)
		switch compositionMode {
		case ffmpegCompositionModeStreamCopy:
			statusText = "正在快速拼接视频"
		case ffmpegCompositionModeCopyVideoMixAudio:
			statusText = "正在拼接画面并混合音频"
		default:
			statusText = "正在按镜头清单合成视频"
		}
	} else {
		args, err = buildSimpleFFmpegComposeArgs(workspace, outputPath, request.Input)
	}
	if err != nil {
		return nil, err
	}
	prepareDuration := time.Since(prepareStartedAt)
	queueStartedAt := time.Now()
	releaseTranscodeSlot := func() {}
	transcodeSlotHeld := false
	if compositionMode == ffmpegCompositionModeTranscode {
		releaseTranscodeSlot, err = acquireFFmpegTranscodeSlot(ctx, func() error {
			return notifyProcessorOutput(request.Write, botprotocol.Output{
				"event": "status",
				"text":  "正在等待视频合成资源",
			})
		})
		if err != nil {
			return nil, err
		}
		transcodeSlotHeld = true
		defer func() {
			if transcodeSlotHeld {
				releaseTranscodeSlot()
			}
		}()
	}
	queueDuration := time.Since(queueStartedAt)
	if err := notifyProcessorOutput(request.Write, botprotocol.Output{
		"event": "status",
		"text":  statusText,
	}); err != nil {
		return nil, err
	}
	ffmpegStartedAt := time.Now()
	ffmpegErr := runFFmpegCommand(ctx, ffmpegPath, args, request.Write)
	if transcodeSlotHeld {
		releaseTranscodeSlot()
		transcodeSlotHeld = false
	}
	ffmpegDuration := time.Since(ffmpegStartedAt)
	if ffmpegErr != nil {
		return nil, ffmpegErr
	}

	storeStartedAt := time.Now()
	file, err := frontupload.ImportFile(ctx, frontupload.ImportFileInput{
		RuleID:    ffmpegVideoRuleID,
		Kind:      botprotocol.MediaTypeVideo,
		Name:      ffmpegOutputName(request.RequestID),
		Mime:      "video/mp4",
		LocalPath: outputPath,
		BizKey:    "energon",
		BizName:   "本地合成",
		Progress: func(text string, progress int) {
			_ = notifyProcessorOutput(request.Write, botprotocol.Output{
				"event":    "progress",
				"text":     text,
				"progress": progress,
			})
		},
	})
	if err != nil {
		return nil, fmt.Errorf("保存合成视频失败: %w", err)
	}
	storeDuration := time.Since(storeStartedAt)
	payload := uploadrepo.BuildUploadFilePayload(file)
	fileURL := strings.TrimSpace(botprotocol.AsText(payload["url"]))
	if fileURL == "" {
		return nil, fmt.Errorf("保存合成视频后未返回文件地址")
	}
	mediaFile := make(map[string]any, len(payload)+2)
	for key, value := range payload {
		mediaFile[key] = value
	}
	mediaFile["file_id"] = payload["id"]
	mediaFile["kind"] = botprotocol.MediaTypeVideo
	output := botprotocol.Output{
		"event":       "lifecycle",
		"feature":     "power",
		"videos":      []string{fileURL},
		"media_files": []map[string]any{mediaFile},
		"meta": map[string]any{
			"stored":           true,
			"upload_rule_id":   ffmpegVideoRuleID,
			"processor":        ffmpegProcessorKey,
			"operation":        ffmpegComposeOperation,
			"composition":      hasComposition,
			"composition_mode": compositionMode,
			"fast_concat":      compositionMode == ffmpegCompositionModeStreamCopy,
			"prepare_ms":       prepareDuration.Milliseconds(),
			"queue_ms":         queueDuration.Milliseconds(),
			"ffmpeg_ms":        ffmpegDuration.Milliseconds(),
			"store_ms":         storeDuration.Milliseconds(),
			"total_ms":         time.Since(prepareStartedAt).Milliseconds(),
		},
	}
	if err := notifyProcessorOutput(request.Write, output); err != nil {
		return nil, err
	}
	return output, nil
}

func buildSimpleFFmpegComposeArgs(workspace string, outputPath string, input map[string]any) ([]string, error) {
	videoPaths, err := resolveLocalMediaPaths(input["videos"])
	if err != nil {
		return nil, fmt.Errorf("读取视频片段失败: %w", err)
	}
	if len(videoPaths) == 0 {
		return nil, fmt.Errorf("视频合成至少需要一个视频片段")
	}
	if len(videoPaths) > 50 {
		return nil, fmt.Errorf("单次视频合成最多支持 50 个视频片段")
	}
	audioPath, err := resolveOptionalLocalMediaPath(input["audio"])
	if err != nil {
		return nil, fmt.Errorf("读取背景音频失败: %w", err)
	}
	subtitlePath, err := resolveOptionalLocalMediaPath(input["subtitles"])
	if err != nil {
		return nil, fmt.Errorf("读取字幕文件失败: %w", err)
	}
	resolution, err := normalizeFFmpegResolution(input["resolution"])
	if err != nil {
		return nil, err
	}
	fps, err := normalizeFFmpegFPS(input["fps"])
	if err != nil {
		return nil, err
	}
	concatPath, err := writeFFmpegConcatList(workspace, "videos.txt", videoPaths)
	if err != nil {
		return nil, err
	}
	return buildFFmpegComposeArgs(concatPath, outputPath, audioPath, subtitlePath, resolution, fps), nil
}

func resolveLocalMediaPaths(value any) ([]string, error) {
	values := processorStringList(value)
	paths := make([]string, 0, len(values))
	for _, current := range values {
		localPath, err := resolveLocalMediaPath(current)
		if err != nil {
			return nil, err
		}
		paths = append(paths, localPath)
	}
	return paths, nil
}

func resolveOptionalLocalMediaPath(value any) (string, error) {
	values := processorStringList(value)
	if len(values) == 0 {
		return "", nil
	}
	return resolveLocalMediaPath(values[0])
}

func resolveLocalMediaPath(value string) (string, error) {
	parsed, err := url.Parse(strings.TrimSpace(value))
	if err != nil {
		return "", fmt.Errorf("资源地址格式错误")
	}
	publicPath := strings.TrimSpace(parsed.Path)
	if parsed.Scheme == "" {
		publicPath = strings.TrimSpace(value)
	}
	if !strings.HasPrefix(publicPath, "/upload/") {
		return "", fmt.Errorf("本地处理器只允许读取系统本地上传资源")
	}
	localPath, err := uploadprovider.ResolveLocalPublicFilePath(strings.TrimPrefix(publicPath, "/upload/"))
	if err != nil {
		return "", err
	}
	info, err := os.Stat(localPath)
	if err != nil {
		return "", fmt.Errorf("资源文件不存在")
	}
	if !info.Mode().IsRegular() {
		return "", fmt.Errorf("资源不是普通文件")
	}
	return localPath, nil
}

func processorStringList(value any) []string {
	result := []string{}
	appendValue := func(current any) {
		text := strings.TrimSpace(botprotocol.AsText(current))
		if text != "" {
			result = append(result, text)
		}
	}
	switch current := value.(type) {
	case []any:
		for _, item := range current {
			appendValue(item)
		}
	case []string:
		for _, item := range current {
			appendValue(item)
		}
	default:
		appendValue(current)
	}
	return result
}

func normalizeFFmpegResolution(value any) (string, error) {
	text := strings.ToLower(strings.TrimSpace(botprotocol.AsText(value)))
	switch text {
	case "", "auto":
		return "", nil
	case "1k":
		return "1280x720", nil
	case "2k":
		return "1920x1080", nil
	case "4k":
		return "3840x2160", nil
	default:
		if !ffmpegResolutionPattern.MatchString(text) {
			return "", fmt.Errorf("输出分辨率必须是自动、1k、2k、4k 或 宽x高")
		}
		widthText, heightText, _ := strings.Cut(text, "x")
		width, _ := strconv.Atoi(widthText)
		height, _ := strconv.Atoi(heightText)
		if width%2 != 0 || height%2 != 0 {
			return "", fmt.Errorf("输出分辨率的宽和高必须是偶数")
		}
		if width > ffmpegMaxDimension || height > ffmpegMaxDimension || width*height > ffmpegMaxPixels {
			return "", fmt.Errorf("输出分辨率不能超过 4K 像素规模")
		}
		return text, nil
	}
}

func normalizeFFmpegFPS(value any) (int, error) {
	text := strings.TrimSpace(botprotocol.AsText(value))
	if text == "" {
		return 25, nil
	}
	if strings.EqualFold(text, "auto") || text == "0" {
		return 0, nil
	}
	number, err := strconv.Atoi(text)
	if err != nil || number < 1 || number > 120 {
		return 0, fmt.Errorf("输出帧率必须是自动或 1 到 120 之间的整数")
	}
	return number, nil
}

func ffmpegConcatList(paths []string) string {
	var result strings.Builder
	for _, current := range paths {
		result.WriteString("file '")
		result.WriteString(strings.ReplaceAll(current, "'", "'\\''"))
		result.WriteString("'\n")
	}
	return result.String()
}

func writeFFmpegConcatList(workspace string, name string, paths []string) (string, error) {
	concatPath := filepath.Join(workspace, name)
	if err := os.WriteFile(concatPath, []byte(ffmpegConcatList(paths)), 0600); err != nil {
		return "", fmt.Errorf("写入视频合成清单失败: %w", err)
	}
	return concatPath, nil
}

func ffmpegCommandArgs() []string {
	return []string{"-hide_banner", "-loglevel", "error", "-progress", "pipe:1", "-nostats"}
}

func buildFFmpegComposeArgs(
	concatPath string,
	outputPath string,
	audioPath string,
	subtitlePath string,
	resolution string,
	fps int,
) []string {
	args := append(ffmpegCommandArgs(),
		"-f", "concat",
		"-safe", "0",
		"-i", concatPath,
	)
	if audioPath != "" {
		args = append(args, "-stream_loop", "-1", "-i", audioPath)
	}
	filters := []string{}
	if resolution != "" {
		filters = append(filters, ffmpegScalePadFilter(resolution))
	}
	if subtitlePath != "" {
		filters = append(filters, "subtitles='"+escapeFFmpegFilterPath(subtitlePath)+"'")
	}
	if len(filters) > 0 {
		args = append(args, "-vf", strings.Join(filters, ","))
	}
	args = append(args, "-map", "0:v:0")
	if audioPath != "" {
		args = append(args, "-map", "1:a:0", "-shortest")
	} else {
		args = append(args, "-map", "0:a?")
	}
	if fps > 0 {
		args = append(args, "-r", strconv.Itoa(fps))
	}
	args = appendFFmpegVideoEncodingArgs(args)
	args = append(args,
		"-c:a", "aac",
		"-movflags", "+faststart",
		"-y", outputPath,
	)
	return args
}

func appendFFmpegVideoEncodingArgs(args []string) []string {
	return append(args,
		"-c:v", ffmpegVideoEncoder,
		"-preset", ffmpegVideoPreset,
		"-crf", ffmpegVideoCRF,
		"-pix_fmt", "yuv420p",
	)
}

func ffmpegScalePadFilter(resolution string) string {
	width, height, _ := strings.Cut(resolution, "x")
	return fmt.Sprintf(
		"scale=%s:%s:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=%s:%s:(ow-iw)/2:(oh-ih)/2",
		width,
		height,
		width,
		height,
	)
}

func escapeFFmpegFilterPath(value string) string {
	return strings.NewReplacer(
		"\\", "\\\\",
		":", "\\:",
		"'", "\\'",
		",", "\\,",
		"[", "\\[",
		"]", "\\]",
	).Replace(value)
}

func runFFmpegCommand(
	ctx context.Context,
	ffmpegPath string,
	args []string,
	write func(botprotocol.Output) error,
) error {
	command := exec.CommandContext(ctx, ffmpegPath, args...)
	stdout, err := command.StdoutPipe()
	if err != nil {
		return fmt.Errorf("读取 FFmpeg 进度失败: %w", err)
	}
	var stderr bytes.Buffer
	command.Stderr = &stderr
	if err := command.Start(); err != nil {
		return fmt.Errorf("启动 FFmpeg 失败: %w", err)
	}

	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		key, value, found := strings.Cut(scanner.Text(), "=")
		if !found || key != "out_time_ms" {
			continue
		}
		microseconds, _ := strconv.ParseInt(value, 10, 64)
		if microseconds <= 0 {
			continue
		}
		if err := notifyProcessorOutput(write, botprotocol.Output{
			"event": "status",
			"text":  fmt.Sprintf("已合成 %.1f 秒", float64(microseconds)/1_000_000),
		}); err != nil {
			_ = command.Process.Kill()
			_ = command.Wait()
			return err
		}
	}
	if scanErr := scanner.Err(); scanErr != nil {
		_ = command.Process.Kill()
		_ = command.Wait()
		return fmt.Errorf("读取 FFmpeg 进度失败: %w", scanErr)
	}
	if err := command.Wait(); err != nil {
		if errors.Is(ctx.Err(), context.Canceled) || errors.Is(ctx.Err(), context.DeadlineExceeded) {
			return ctx.Err()
		}
		message := strings.TrimSpace(stderr.String())
		if message == "" {
			message = err.Error()
		}
		return fmt.Errorf("FFmpeg 合成失败: %s", message)
	}
	return nil
}

func ffmpegOutputName(requestID string) string {
	requestID = strings.ReplaceAll(strings.TrimSpace(requestID), "-", "")
	if len(requestID) > 12 {
		requestID = requestID[:12]
	}
	if requestID == "" {
		requestID = "local"
	}
	return "ffmpeg-" + requestID + ".mp4"
}

func notifyProcessorOutput(write func(botprotocol.Output) error, output botprotocol.Output) error {
	if write == nil || len(output) == 0 {
		return nil
	}
	return write(output)
}
