package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const contextImageMinImages = 1

var imageSequenceOptionKeys = []string{
	botprotocol.OptionImageSequenceMode,
	botprotocol.OptionImageSequenceMinImages,
	botprotocol.OptionImageSequenceMaxImages,
	botprotocol.OptionImageSequenceFrames,
	botprotocol.OptionImageSequenceMediaReferences,
}

var contextImageIgnoredKeys = map[string]bool{
	"id": true, "key": true, "type": true, "kind": true, "event": true, "status": true,
	"order": true, "version": true, "title": true, "name": true, "mime": true, "size": true,
	"hash": true, "created_at": true, "updated_at": true, "request_id": true, "run_id": true,
	"node_id": true, "node_run_id": true, "asset_id": true, "version_id": true, "meta": true,
	"image": true, "images": true, "image_url": true, "imageUrl": true, "imageUrls": true,
	"video": true, "videos": true, "video_url": true, "videoUrl": true, "videoUrls": true,
	"audio": true, "audios": true, "audio_url": true, "audioUrl": true, "audioUrls": true,
	"file": true, "files": true, "file_url": true, "fileUrl": true, "fileUrls": true,
	"url": true, "src": true, "thumbnail": true, "media_files": true,
}

func shouldPlanContextImages(req *botprotocol.ShemicRequest, power botmodel.Power) bool {
	if req == nil || !botmodel.IsGeneralImagePower(power) {
		return false
	}
	mode := strings.ToLower(strings.TrimSpace(
		botprotocol.AsText(req.Options[botprotocol.OptionImageSequenceMode]),
	))
	switch mode {
	case botprotocol.ImageSequenceModeSingle:
		return false
	case botprotocol.ImageSequenceModeAuto,
		botprotocol.ImageSequenceModeFrames,
		botprotocol.ImageSequenceModeReferences:
		return true
	}
	_, exists := contextImagePreviousOutput(req)
	return exists
}

func withoutImageSequenceOptions(req *botprotocol.ShemicRequest) *botprotocol.ShemicRequest {
	if req == nil {
		return nil
	}
	rawOptions := botprotocol.NormalizeMap(req.Raw.Body["options"])
	hasOption := hasImageSequenceOption(req.Options) || hasImageSequenceOption(rawOptions)
	if !hasOption {
		return req
	}

	next := *req
	next.Options = cloneAnyMap(req.Options)
	deleteImageSequenceOptions(next.Options)
	next.Raw = req.Raw
	next.Raw.Body = cloneAnyMap(req.Raw.Body)
	if rawOptions != nil {
		nextRawOptions := cloneAnyMap(rawOptions)
		deleteImageSequenceOptions(nextRawOptions)
		next.Raw.Body["options"] = nextRawOptions
	}
	return &next
}

func hasImageSequenceOption(options map[string]any) bool {
	for _, key := range imageSequenceOptionKeys {
		if _, exists := options[key]; exists {
			return true
		}
	}
	return false
}

func deleteImageSequenceOptions(options map[string]any) {
	for _, key := range imageSequenceOptionKeys {
		delete(options, key)
	}
}

func (s GatewayService) callNormalizeContextImages(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	return s.executeContextImages(ctx, req, selected, nil)
}

func (s GatewayService) callStreamContextImages(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	progress := func(output botprotocol.Output) {
		_ = s.writeStreamOutput(ctx, req.RequestID, output)
	}
	result, err := s.executeContextImages(ctx, req, selected, progress)
	if err != nil {
		return result, err
	}
	if err := s.writePlannedImageStreamResult(ctx, req.RequestID, result.Data); err != nil {
		return result, err
	}
	return result, nil
}

func (s GatewayService) executeContextImages(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	progress imageSequenceOutputProgress,
) (callResult, error) {
	source, exists := contextImagePlanningSource(req)
	if !exists {
		return s.callNormalizeTarget(ctx, req, selected)
	}
	if progress != nil {
		progress(botprotocol.Output{
			"event": "status",
			"text":  "正在理解内容并规划图片",
		})
	}

	sequenceRange, err := botprotocol.NormalizeImageSequenceRange(
		req.Options,
		contextImageMinImages,
		botmodel.StoryboardGridMaxImages,
	)
	if err != nil {
		return callResult{}, err
	}
	aspectRatio := s.imageSequenceAspectRatioSettings(ctx, req, selected)
	plan, direct, err := directContextImageSequencePlan(req, sequenceRange, aspectRatio)
	if err != nil {
		return callResult{}, err
	}
	if !direct {
		plan, err = s.planImageSequence(ctx, req, source, imageSequencePlannerOptions{
			ErrorLabel:      "规划图片失败",
			ToolDescription: "提交按语义拆分后的有序图片生成计划。",
			RolePrompt:      contextImagePlannerPrompt(sequenceRange),
			DefaultTitle:    "系列图片",
			MinImages:       sequenceRange.MinImages,
			MaxImages:       sequenceRange.MaxImages,
			AspectRatio:     aspectRatio,
		})
		if err != nil {
			return callResult{}, err
		}
	}
	if progress != nil {
		progress(contextImageProgressOutput(plan, fmt.Sprintf("已识别 %d 个独立画面", len(plan.Frames))))
	}
	sequenceProgress := func(current storyboardGridPlan, message string) {
		if progress != nil {
			progress(contextImageProgressOutput(current, message))
		}
	}
	result, err := s.generateImageSequence(ctx, req, selected, &plan, sequenceProgress)
	if err != nil {
		return result, err
	}

	output, successCount := contextImageOutput(plan, "final")
	result.Data = output
	if successCount != len(plan.Frames) {
		return result, fmt.Errorf("图片生成未完成: 已生成 %d/%d 张", successCount, len(plan.Frames))
	}
	return result, nil
}

func directContextImageSequencePlan(
	req *botprotocol.ShemicRequest,
	sequenceRange botprotocol.ImageSequenceRange,
	aspectRatio imageSequenceAspectRatioSettings,
) (storyboardGridPlan, bool, error) {
	if imageSequenceMode(req) != botprotocol.ImageSequenceModeFrames {
		return storyboardGridPlan{}, false, nil
	}
	values := botprotocol.NormalizeAnyList(req.Options[botprotocol.OptionImageSequenceFrames])
	frames := make([]storyboardGridFrame, 0, len(values))
	for _, value := range values {
		row := botprotocol.NormalizeMap(value)
		frames = append(frames, storyboardGridFrame{
			Title:       botprotocol.AsText(row["title"]),
			Description: botprotocol.AsText(row["description"]),
			Prompt:      botprotocol.AsText(row["prompt"]),
		})
	}
	plan, err := normalizeImageSequencePlan(storyboardGridPlan{
		Title:       "镜头首尾帧",
		Summary:     "严格按既定首帧和尾帧任务生成",
		VisualBible: "保持输入参考素材中的人物身份、服装、场景、道具、光线与画风一致",
		AspectRatio: aspectRatio.Value,
		Frames:      frames,
	}, sequenceRange.MinImages, sequenceRange.MaxImages, "镜头首尾帧")
	if err != nil {
		return storyboardGridPlan{}, true, fmt.Errorf("固定首尾帧计划无效: %w", err)
	}
	return plan, true, nil
}

func imageSequenceMode(req *botprotocol.ShemicRequest) string {
	if req == nil {
		return ""
	}
	return strings.ToLower(strings.TrimSpace(
		botprotocol.AsText(req.Options[botprotocol.OptionImageSequenceMode]),
	))
}

func contextImagePlanningSource(req *botprotocol.ShemicRequest) (string, bool) {
	if req == nil {
		return "", false
	}
	parts := make([]string, 0, 3)
	previousOutput, hasPreviousOutput := contextImagePreviousOutput(req)
	if hasPreviousOutput {
		parts = append(parts,
			"上游完整上下文（据此语义判断需要生成几张独立图片，并保持原有顺序）：\n"+formatContextImageValue(previousOutput),
		)
	}

	currentInput := cloneAnyMap(req.Input)
	delete(currentInput, "previous_output")
	if prompt := strings.TrimSpace(botprotocol.AsText(currentInput["prompt"])); hasPreviousOutput && prompt != "" && contextImageContainsText(previousOutput, prompt) {
		delete(currentInput, "prompt")
	}
	content := botprotocol.BuildPromptContent(currentInput, botprotocol.PromptOptions{TextTitle: "当前图片节点要求"})
	if text := strings.TrimSpace(content.Text); text != "" {
		parts = append(parts, text)
	}
	if media := contextImageMediaSummary(content); media != "" {
		parts = append(parts, media)
	}
	if len(parts) == 0 {
		return "", false
	}
	return strings.Join(parts, "\n\n"), true
}

func contextImagePreviousOutput(req *botprotocol.ShemicRequest) (any, bool) {
	if req == nil || req.Input == nil {
		return nil, false
	}
	value, exists := req.Input["previous_output"]
	if !exists || value == nil {
		return nil, false
	}
	normalized, ok := normalizeContextImageValue(value)
	if !ok || !hasContextImageSemantics(normalized, 0) {
		return nil, false
	}
	return value, true
}

func normalizeContextImageValue(value any) (any, bool) {
	raw, err := json.Marshal(value)
	if err != nil {
		return nil, false
	}
	var normalized any
	if err := json.Unmarshal(raw, &normalized); err != nil {
		return nil, false
	}
	return normalized, true
}

func hasContextImageSemantics(value any, depth int) bool {
	if value == nil || depth > 16 {
		return false
	}
	switch current := value.(type) {
	case string:
		text := strings.TrimSpace(current)
		if text == "" || isContextImageMediaReference(text) {
			return false
		}
		if (strings.HasPrefix(text, "{") || strings.HasPrefix(text, "[")) && json.Unmarshal([]byte(text), &value) == nil {
			return hasContextImageSemantics(value, depth+1)
		}
		return true
	case []any:
		for _, item := range current {
			if hasContextImageSemantics(item, depth+1) {
				return true
			}
		}
	case map[string]any:
		for key, candidate := range current {
			if contextImageIgnoredKeys[key] || strings.HasPrefix(key, "_") {
				continue
			}
			if hasContextImageSemantics(candidate, depth+1) {
				return true
			}
		}
	}
	return false
}

func isContextImageMediaReference(value string) bool {
	value = strings.TrimSpace(value)
	if value == "" || strings.ContainsAny(value, "\n\r\t ") {
		return false
	}
	lower := strings.ToLower(value)
	return strings.HasPrefix(lower, "http://") ||
		strings.HasPrefix(lower, "https://") ||
		strings.HasPrefix(lower, "data:") ||
		strings.HasPrefix(lower, "blob:") ||
		strings.HasPrefix(lower, "/")
}

func formatContextImageValue(value any) string {
	if text, ok := value.(string); ok {
		return strings.TrimSpace(text)
	}
	raw, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return strings.TrimSpace(botprotocol.AsText(value))
	}
	return string(raw)
}

func contextImageContainsText(value any, expected string) bool {
	expected = strings.TrimSpace(expected)
	if expected == "" {
		return false
	}
	normalized, ok := normalizeContextImageValue(value)
	if !ok {
		return false
	}
	return contextImageValueContainsText(normalized, expected, 0)
}

func contextImageValueContainsText(value any, expected string, depth int) bool {
	if value == nil || depth > 16 {
		return false
	}
	switch current := value.(type) {
	case string:
		return strings.TrimSpace(current) == expected
	case []any:
		for _, item := range current {
			if contextImageValueContainsText(item, expected, depth+1) {
				return true
			}
		}
	case map[string]any:
		for _, item := range current {
			if contextImageValueContainsText(item, expected, depth+1) {
				return true
			}
		}
	}
	return false
}

func contextImageMediaSummary(content botprotocol.PromptContent) string {
	media := imagePlanningMediaLabels(content)
	if len(media) == 0 {
		return ""
	}
	return "生成阶段还会把" + strings.Join(media, "、") + "传给所选图片模型。"
}

func imagePlanningMediaLabels(content botprotocol.PromptContent) []string {
	media := make([]string, 0, 4)
	if len(content.Images) > 0 {
		media = append(media, fmt.Sprintf("参考图片 %d 张", len(content.Images)))
	}
	if len(content.Videos) > 0 {
		media = append(media, fmt.Sprintf("参考视频 %d 个", len(content.Videos)))
	}
	if len(content.Audios) > 0 {
		media = append(media, fmt.Sprintf("参考音频 %d 个", len(content.Audios)))
	}
	if len(content.Files) > 0 {
		media = append(media, fmt.Sprintf("参考文件 %d 个", len(content.Files)))
	}
	return media
}

func contextImagePlannerPrompt(sequenceRange botprotocol.ImageSequenceRange) string {
	return fmt.Sprintf(`你是图片生成任务规划器。请理解输入上下文与当前图片节点要求，判断最终需要生成一张图片，还是一组按原顺序排列的独立图片，并为每张图片生成可直接使用的提示词。

规则：
- 必须从内容含义和叙事结构判断，不依赖某个固定字段名、固定编号格式或外部数量参数。
- 用户明确指定系统允许范围内的图片或镜头数量时，必须严格按该数量规划，不得合并或改写成拼图。
- 如果上下文表达了多个需要分别呈现的镜头、画面、场景、步骤或条目，必须一项对应一张图片，严格保留原数量和原顺序，不得合并、遗漏、调换或擅自新增。
- 如果上下文只表达一个完整画面，即使描述很长，也只规划一张图片。
- 最终数量必须为 %d～%d 张。
- 每张图片只呈现一个独立画面，不生成拼图、宫格、分栏、编号文字、标题或水印。
- visual_bible 写整组固定的主体身份与外貌、服装、关键道具、主场景、光线、色彩和画风；只有一张时也要给出适用的视觉基线。
- prompt 必须能脱离上下文直接交给图片模型，完整写明主体、动作、环境、景别、构图和必要的一致性要求。
- description 简要说明该画面的内容或作用；title 使用简短、可区分的中文名称。
- 只能调用 %s 提交结果，不输出其他文字。`, sequenceRange.MinImages, sequenceRange.MaxImages, storyboardGridSubmitToolName)
}

func contextImageProgressOutput(plan storyboardGridPlan, message string) botprotocol.Output {
	output, _ := contextImageOutput(plan, "status")
	output["text"] = strings.TrimSpace(message)
	return output
}

func contextImageOutput(plan storyboardGridPlan, event string) (botprotocol.Output, int) {
	images, items := imageSequenceOutputValues(plan)
	meta := map[string]any{
		"output_type":       botmodel.OutputTypeGeneral,
		"view_mode":         "content",
		"semantic_planning": true,
		"requested_count":   len(plan.Frames),
		"generated_count":   len(images),
		"partial":           len(images) != len(plan.Frames),
		"items":             items,
	}
	if plan.AspectRatio != "" {
		meta["aspect_ratio"] = plan.AspectRatio
	}
	output := botprotocol.Output{
		"event":  event,
		"images": images,
		"meta":   meta,
	}
	if plan.AspectRatio != "" {
		output["aspect_ratio"] = plan.AspectRatio
	}
	if len(images) > 0 {
		output["image"] = images[0]
	}
	if event == "final" && len(images) > 0 && len(images) != len(plan.Frames) {
		output["text"] = fmt.Sprintf("已生成 %d/%d 张图片，其余图片生成失败。", len(images), len(plan.Frames))
	}
	return output, len(images)
}

func (s GatewayService) writePlannedImageStreamResult(ctx context.Context, requestID string, value any) error {
	output := botprotocol.ExtractOutput(value)
	if err := s.writeStreamOutput(ctx, requestID, output); err != nil {
		return err
	}
	if err := s.writeStreamOutput(ctx, requestID, botprotocol.Output{"event": "end"}); err != nil {
		return err
	}
	return s.writeStream(ctx, requestID, botprotocol.BuildSuccessResponse(requestID, output))
}
