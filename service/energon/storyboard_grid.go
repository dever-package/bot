package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/uuid"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	storyboardGridVersion        = 1
	storyboardGridSubmitToolName = "submit_storyboard_grid"
)

type storyboardGridPlan struct {
	Version int                   `json:"version"`
	Title   string                `json:"title"`
	Summary string                `json:"summary"`
	Frames  []storyboardGridFrame `json:"frames"`
}

type storyboardGridFrame struct {
	ID          string `json:"id"`
	Order       int    `json:"order"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Prompt      string `json:"prompt"`
	Status      string `json:"status,omitempty"`
	Image       string `json:"image,omitempty"`
	Error       string `json:"error,omitempty"`
}

type storyboardGridProgress func(message string)

func (s GatewayService) callNormalizeStoryboardGrid(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	return s.executeStoryboardGrid(ctx, req, selected, nil)
}

func (s GatewayService) callStreamStoryboardGrid(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	progress := func(message string) {
		_ = s.writeStreamStatus(ctx, req.RequestID, message)
	}
	result, err := s.executeStoryboardGrid(ctx, req, selected, progress)
	if err != nil {
		return result, err
	}
	output := botprotocol.ExtractOutput(result.Data)
	if err := s.writeStreamOutput(ctx, req.RequestID, output); err != nil {
		return result, err
	}
	if err := s.writeStreamOutput(ctx, req.RequestID, botprotocol.Output{"event": "end"}); err != nil {
		return result, err
	}
	if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildSuccessResponse(req.RequestID, output)); err != nil {
		return result, err
	}
	return result, nil
}

func (s GatewayService) executeStoryboardGrid(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	progress storyboardGridProgress,
) (callResult, error) {
	if progress != nil {
		progress("正在规划宫格画面")
	}
	plan, err := s.planStoryboardGrid(ctx, req)
	if err != nil {
		return callResult{}, err
	}

	result := callResult{ServiceAPI: selected.ServiceAPI}
	batchSize := storyboardGridBatchSize(selected.Service)
	for start := 0; start < len(plan.Frames); start += batchSize {
		if err := ctx.Err(); err != nil {
			return result, err
		}
		end := min(start+batchSize, len(plan.Frames))
		batch := plan.Frames[start:end]
		if progress != nil {
			progress(fmt.Sprintf("正在生成第 %d～%d 张，共 %d 张", start+1, end, len(plan.Frames)))
		}

		childReq := cloneStoryboardGridRequest(req, storyboardGridBatchPrompt(plan, batch), start, end)
		childResult, callErr := s.callNormalizeTarget(ctx, childReq, selected)
		result.Attempts = appendCallResultAttempts(result.Attempts, childResult)
		if childResult.Log.ID > 0 {
			result.Log = childResult.Log
			result.Attempt = childResult.Attempt
		}
		if childResult.NativeRequest.URL != "" {
			result.NativeRequest = childResult.NativeRequest
			result.Response = childResult.Response
			result.ServiceAPI = childResult.ServiceAPI
		}
		if callErr != nil {
			markStoryboardGridBatchFailed(plan.Frames[start:end], callErr)
			continue
		}

		images := botprotocol.NormalizeStringList(botprotocol.ExtractOutput(childResult.Data)["images"])
		assignStoryboardGridImages(plan.Frames[start:end], images)
	}

	output, successCount := storyboardGridOutput(plan)
	result.Data = output
	if successCount == 0 {
		return result, fmt.Errorf("宫格图片生成失败: 所有画面均未生成")
	}
	if progress != nil {
		progress(fmt.Sprintf("宫格图片已生成 %d/%d 张", successCount, len(plan.Frames)))
	}
	return result, nil
}

func (s GatewayService) planStoryboardGrid(ctx context.Context, req *botprotocol.ShemicRequest) (storyboardGridPlan, error) {
	power, err := ResolveGeneralTextPower(ctx, botmodel.DefaultLLMPowerID)
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("规划宫格失败: %w", err)
	}
	source := storyboardGridPlanningSource(req)
	response := s.Request(ctx, GatewayRequest{
		RequestID: uuid.NewString(),
		Billing:   req.Billing,
		Body: map[string]any{
			"power": power.Key,
			"set": map[string]any{
				"role": storyboardGridPlannerPrompt(),
			},
			"input": PromptInput(source),
			"options": map[string]any{
				"stream":              false,
				"temperature":         0,
				"tools":               []any{botprotocol.FunctionToolDefinition(storyboardGridSubmitToolName, "提交有序宫格画面规划。", storyboardGridPlannerSchema(), false)},
				"tool_choice":         botprotocol.ForcedFunctionToolChoice(storyboardGridSubmitToolName),
				"parallel_tool_calls": false,
			},
		},
	})
	if response.Status == botprotocol.ResponseStatusFail {
		message := strings.TrimSpace(response.Msg)
		if message == "" {
			message = "文本能力调用失败"
		}
		return storyboardGridPlan{}, fmt.Errorf("规划宫格失败: %s", message)
	}

	call, err := storyboardGridToolCall(botprotocol.ParseToolCalls(botprotocol.ExtractOutput(response.Payload())["tool_calls"]))
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("规划宫格失败: %w", err)
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("规划宫格失败: %w", err)
	}
	raw, err := json.Marshal(arguments)
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("规划宫格失败: %w", err)
	}
	plan := storyboardGridPlan{}
	if err := json.Unmarshal(raw, &plan); err != nil {
		return storyboardGridPlan{}, fmt.Errorf("规划宫格失败: 返回结构无效: %w", err)
	}
	return normalizeStoryboardGridPlan(plan)
}

func storyboardGridPlanningSource(req *botprotocol.ShemicRequest) string {
	if req == nil {
		return "请规划一组内容连贯、可分别生成的宫格图片。"
	}
	content := botprotocol.BuildPromptContent(req.Input, botprotocol.PromptOptions{TextTitle: "创作要求"})
	parts := make([]string, 0, 2)
	if text := strings.TrimSpace(content.Text); text != "" {
		parts = append(parts, text)
	}
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
	if len(media) > 0 {
		parts = append(parts, "用户还提供了"+strings.Join(media, "、")+"；这些素材会在生成阶段传给图片模型。")
	}
	if len(parts) == 0 {
		parts = append(parts, "请规划一组内容连贯、可分别生成的宫格图片。")
	}
	return strings.Join(parts, "\n\n")
}

func storyboardGridPlannerPrompt() string {
	return fmt.Sprintf(`你是宫格图片导演。根据用户创作要求，判断真正需要的画面数量，并规划一组有明确顺序、视觉统一、各自可独立生成的图片。

规则：
- 画面数量必须为 %d～%d 张，不要固定使用最大数量；以完整表达用户意图所需的最少张数为准。
- 每张只表达一个清晰画面，不把多张画面拼进同一张图片。
- 相邻画面在主体身份、服装、场景、光线和画风上保持连续；同时避免重复构图。
- prompt 必须是可以直接交给图片模型的完整提示词，写清主体、动作、环境、构图和必要的一致性要求。
- description 简要说明该画面在整组中的作用；title 使用简短、可区分的中文名称。
- 只能调用 %s 提交结果，不输出其他文字。`, botmodel.StoryboardGridMinImages, botmodel.StoryboardGridMaxImages, storyboardGridSubmitToolName)
}

func storyboardGridPlannerSchema() map[string]any {
	frame := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"title":       map[string]any{"type": "string", "minLength": 1},
			"description": map[string]any{"type": "string", "minLength": 1},
			"prompt":      map[string]any{"type": "string", "minLength": 1},
		},
		"required":             []any{"title", "description", "prompt"},
		"additionalProperties": false,
	}
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"version": map[string]any{"type": "integer", "enum": []any{storyboardGridVersion}},
			"title":   map[string]any{"type": "string", "minLength": 1},
			"summary": map[string]any{"type": "string", "minLength": 1},
			"frames": map[string]any{
				"type":     "array",
				"minItems": botmodel.StoryboardGridMinImages,
				"maxItems": botmodel.StoryboardGridMaxImages,
				"items":    frame,
			},
		},
		"required":             []any{"version", "title", "summary", "frames"},
		"additionalProperties": false,
	}
}

func storyboardGridToolCall(calls []botprotocol.ToolCall) (botprotocol.ToolCall, error) {
	var selected botprotocol.ToolCall
	count := 0
	for _, call := range calls {
		if !strings.EqualFold(strings.TrimSpace(call.Name), storyboardGridSubmitToolName) {
			continue
		}
		selected = call
		count++
	}
	if count == 0 {
		return botprotocol.ToolCall{}, fmt.Errorf("模型未调用 %s", storyboardGridSubmitToolName)
	}
	if count > 1 {
		return botprotocol.ToolCall{}, fmt.Errorf("模型重复调用 %s", storyboardGridSubmitToolName)
	}
	return selected, nil
}

func normalizeStoryboardGridPlan(plan storyboardGridPlan) (storyboardGridPlan, error) {
	if len(plan.Frames) < botmodel.StoryboardGridMinImages || len(plan.Frames) > botmodel.StoryboardGridMaxImages {
		return storyboardGridPlan{}, fmt.Errorf("画面数量必须为 %d～%d 张", botmodel.StoryboardGridMinImages, botmodel.StoryboardGridMaxImages)
	}
	plan.Version = storyboardGridVersion
	plan.Title = strings.TrimSpace(plan.Title)
	if plan.Title == "" {
		plan.Title = "宫格图片"
	}
	plan.Summary = strings.TrimSpace(plan.Summary)
	if plan.Summary == "" {
		plan.Summary = plan.Title
	}
	for index := range plan.Frames {
		frame := &plan.Frames[index]
		frame.ID = fmt.Sprintf("frame-%02d", index+1)
		frame.Order = index + 1
		frame.Title = strings.TrimSpace(frame.Title)
		if frame.Title == "" {
			frame.Title = fmt.Sprintf("画面 %02d", index+1)
		}
		frame.Description = strings.TrimSpace(frame.Description)
		frame.Prompt = strings.TrimSpace(frame.Prompt)
		if frame.Prompt == "" {
			return storyboardGridPlan{}, fmt.Errorf("第 %d 张画面缺少生成提示词", index+1)
		}
		if frame.Description == "" {
			frame.Description = frame.Prompt
		}
	}
	return plan, nil
}

func storyboardGridBatchSize(service botmodel.Service) int {
	if !strings.EqualFold(strings.TrimSpace(service.ImageOutputMode), botmodel.ImageOutputModeGroup) {
		return 1
	}
	limit := service.MaxImagesPerRequest
	if limit <= 0 || limit > botmodel.StoryboardGridMaxImages {
		return botmodel.StoryboardGridMaxImages
	}
	return max(limit, botmodel.StoryboardGridMinImages)
}

func storyboardGridBatchPrompt(plan storyboardGridPlan, frames []storyboardGridFrame) string {
	parts := []string{
		fmt.Sprintf("为《%s》生成一组有序宫格图片。整组目标：%s", plan.Title, plan.Summary),
		fmt.Sprintf("本次必须返回 %d 张彼此独立的图片文件，顺序必须与下列编号一致，不得拼成一张大图。", len(frames)),
	}
	for _, frame := range frames {
		parts = append(parts, fmt.Sprintf("%02d｜%s\n%s", frame.Order, frame.Title, frame.Prompt))
	}
	parts = append(parts, "所有图片保持统一人物身份、服装、场景设定、色彩和画风；每张只呈现对应编号的画面。")
	return strings.Join(parts, "\n\n")
}

func cloneStoryboardGridRequest(req *botprotocol.ShemicRequest, prompt string, start int, end int) *botprotocol.ShemicRequest {
	next := *req
	next.RequestID = storyboardGridChildRequestID(req.RequestID, start, end)
	next.Set = cloneAnyMap(req.Set)
	next.Input = cloneAnyMap(req.Input)
	if next.Input == nil {
		next.Input = map[string]any{}
	}
	next.Input["prompt"] = strings.TrimSpace(prompt)
	next.History = append([]any(nil), req.History...)
	next.Options = cloneAnyMap(req.Options)
	next.Raw = req.Raw
	next.Raw.Body = cloneAnyMap(req.Raw.Body)
	if next.Raw.Body == nil {
		next.Raw.Body = map[string]any{}
	}
	next.Raw.Body["input"] = cloneAnyMap(next.Input)
	next.Raw.Body["set"] = cloneAnyMap(next.Set)
	next.Raw.Body["options"] = cloneAnyMap(next.Options)
	next.Raw.Body["request_id"] = next.RequestID
	return &next
}

func storyboardGridChildRequestID(parent string, start int, end int) string {
	const suffixLength = len("-grid-00-00")
	parent = strings.TrimSpace(parent)
	if parent == "" {
		parent = uuid.NewString()
	}
	if len(parent) > 64-suffixLength {
		parent = parent[:64-suffixLength]
	}
	return fmt.Sprintf("%s-grid-%02d-%02d", parent, start+1, end)
}

func markStoryboardGridBatchFailed(frames []storyboardGridFrame, err error) {
	message := "图片生成失败"
	if err != nil && strings.TrimSpace(err.Error()) != "" {
		message = strings.TrimSpace(err.Error())
	}
	for index := range frames {
		frames[index].Status = StatusFail
		frames[index].Error = message
	}
}

func assignStoryboardGridImages(frames []storyboardGridFrame, images []string) {
	for index := range frames {
		if index < len(images) && strings.TrimSpace(images[index]) != "" {
			frames[index].Status = StatusSuccess
			frames[index].Image = strings.TrimSpace(images[index])
			frames[index].Error = ""
			continue
		}
		frames[index].Status = StatusFail
		frames[index].Error = "来源返回的图片数量不足"
	}
}

func storyboardGridOutput(plan storyboardGridPlan) (botprotocol.Output, int) {
	images := make([]string, 0, len(plan.Frames))
	frames := make([]any, 0, len(plan.Frames))
	for _, frame := range plan.Frames {
		if frame.Status == StatusSuccess && strings.TrimSpace(frame.Image) != "" {
			images = append(images, strings.TrimSpace(frame.Image))
		}
		frames = append(frames, map[string]any{
			"id":          frame.ID,
			"order":       frame.Order,
			"title":       frame.Title,
			"description": frame.Description,
			"prompt":      frame.Prompt,
			"status":      frame.Status,
			"image":       frame.Image,
			"error":       frame.Error,
		})
	}
	grid := map[string]any{
		"type":    botmodel.OutputTypeStoryboardGrid,
		"version": storyboardGridVersion,
		"title":   plan.Title,
		"summary": plan.Summary,
		"frames":  frames,
	}
	output := botprotocol.Output{
		"event":  "final",
		"title":  plan.Title,
		"images": images,
		"json":   grid,
		"meta": map[string]any{
			"output_type":     botmodel.OutputTypeStoryboardGrid,
			"view_mode":       botmodel.OutputTypeStoryboardGrid,
			"requested_count": len(plan.Frames),
			"generated_count": len(images),
			"partial":         len(images) != len(plan.Frames),
		},
	}
	if len(images) > 0 {
		output["image"] = images[0]
	}
	return output, len(images)
}
