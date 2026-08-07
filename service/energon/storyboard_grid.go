package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/uuid"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	storyboardGridVersion          = 1
	storyboardGridSubmitToolName   = "submit_storyboard_grid"
	storyboardGridFrameMaxAttempts = 2
	storyboardGridStatusPending    = "pending"
	storyboardGridStatusRunning    = "running"
	imageSequenceAspectRatioKey    = "aspectRatio"
)

type storyboardGridPlan struct {
	Version     int                   `json:"version"`
	Title       string                `json:"title"`
	Summary     string                `json:"summary"`
	VisualBible string                `json:"visual_bible"`
	AspectRatio string                `json:"aspect_ratio,omitempty"`
	Frames      []storyboardGridFrame `json:"frames"`
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

type imageSequenceOutputProgress func(output botprotocol.Output)

type imageSequenceProgress func(plan storyboardGridPlan, message string)

type imageSequencePlannerOptions struct {
	ErrorLabel      string
	ToolDescription string
	RolePrompt      string
	DefaultTitle    string
	MinImages       int
	MaxImages       int
	AspectRatio     imageSequenceAspectRatioSettings
}

type imageSequenceAspectRatioSettings struct {
	Value   string
	Options []string
}

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
	progress := func(output botprotocol.Output) {
		_ = s.writeStreamOutput(ctx, req.RequestID, output)
	}
	result, err := s.executeStoryboardGrid(ctx, req, selected, progress)
	if err != nil {
		return result, err
	}
	if err := s.writePlannedImageStreamResult(ctx, req.RequestID, result.Data); err != nil {
		return result, err
	}
	return result, nil
}

func (s GatewayService) executeStoryboardGrid(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	progress imageSequenceOutputProgress,
) (callResult, error) {
	if progress != nil {
		progress(botprotocol.Output{
			"event": "status",
			"text":  "正在规划宫格画面",
		})
	}
	aspectRatio := s.imageSequenceAspectRatioSettings(ctx, req, selected)
	plan, err := s.planStoryboardGrid(ctx, req, aspectRatio)
	if err != nil {
		return callResult{}, err
	}

	if progress != nil {
		progress(storyboardGridProgressOutput(plan, fmt.Sprintf("已规划 %d 张宫格画面", len(plan.Frames))))
	}
	sequenceProgress := func(current storyboardGridPlan, message string) {
		if progress != nil {
			progress(storyboardGridProgressOutput(current, message))
		}
	}
	result, err := s.generateImageSequence(ctx, req, selected, &plan, sequenceProgress)
	if err != nil {
		return result, err
	}

	output, successCount := storyboardGridOutput(plan, "final")
	result.Data = output
	if successCount == 0 {
		return result, fmt.Errorf("宫格图片生成失败: 所有画面均未生成")
	}
	return result, nil
}

func (s GatewayService) generateImageSequence(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	plan *storyboardGridPlan,
	progress imageSequenceProgress,
) (callResult, error) {
	result := callResult{ServiceAPI: selected.ServiceAPI}
	if plan == nil {
		return result, fmt.Errorf("图片生成计划不能为空")
	}
	consistencyReference := ""
	for index := range plan.Frames {
		if err := ctx.Err(); err != nil {
			return result, err
		}
		frame := &plan.Frames[index]
		frame.Status = storyboardGridStatusRunning
		frame.Error = ""
		if progress != nil {
			progress(*plan, fmt.Sprintf("正在生成第 %d/%d 张：%s", index+1, len(plan.Frames), frame.Title))
		}

		image, generateErr := s.generateStoryboardGridFrame(
			ctx,
			req,
			selected,
			*plan,
			*frame,
			consistencyReference,
			&result,
		)
		if generateErr != nil {
			frame.Status = StatusFail
			frame.Error = storyboardGridErrorMessage(generateErr)
		} else {
			frame.Status = StatusSuccess
			frame.Image = image
			frame.Error = ""
			if consistencyReference == "" {
				consistencyReference = image
			}
		}
		if progress != nil {
			progress(*plan, storyboardGridFrameProgressMessage(*plan, *frame))
		}
	}
	return result, nil
}

func (s GatewayService) generateStoryboardGridFrame(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	plan storyboardGridPlan,
	frame storyboardGridFrame,
	consistencyReference string,
	result *callResult,
) (string, error) {
	var lastErr error
	for attempt := 1; attempt <= storyboardGridFrameMaxAttempts; attempt++ {
		if err := ctx.Err(); err != nil {
			return "", err
		}
		childReq := cloneStoryboardGridRequest(
			req,
			storyboardGridFramePrompt(plan, frame),
			plan.AspectRatio,
			frame.Order,
			attempt,
		)
		s.bindStoryboardGridConsistencyReference(ctx, childReq, selected, consistencyReference)
		childResult, callErr := s.callNormalizeTarget(ctx, childReq, selected)
		mergeStoryboardGridCallResult(result, childResult)
		if callErr != nil {
			lastErr = callErr
			continue
		}
		images := botprotocol.NormalizeMediaList(childResult.Data, botprotocol.MediaTypeImage)
		for _, image := range images {
			if image = strings.TrimSpace(image); image != "" {
				return image, nil
			}
		}
		lastErr = fmt.Errorf("来源未返回第 %d 张画面", frame.Order)
	}
	return "", lastErr
}

func (s GatewayService) bindStoryboardGridConsistencyReference(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	image string,
) {
	image = strings.TrimSpace(image)
	if req == nil || image == "" {
		return
	}
	params := botinput.BuildPowerParams(ctx, s.repo, selected.Power.ID, selected.Service.ID)
	if len(botinput.MediaParamsForKind(params, botprotocol.MediaTypeImage)) != 1 {
		return
	}
	bound, err := botinput.BindMediaReferences(req.Input, params, []botinput.MediaReference{{
		ReferenceType: "storyboard_grid",
		ReferenceID:   1,
		Label:         "首张宫格一致性参考",
		Kind:          botprotocol.MediaTypeImage,
		URL:           image,
	}})
	if err != nil || len(bound.Bound) == 0 {
		return
	}
	req.Input = bound.Values
	req.Raw.Body["input"] = cloneAnyMap(req.Input)
}

func mergeStoryboardGridCallResult(result *callResult, child callResult) {
	if result == nil {
		return
	}
	result.Attempts = appendCallResultAttempts(result.Attempts, child)
	if child.Log.ID > 0 {
		result.Log = child.Log
		result.Attempt = child.Attempt
	}
	if child.NativeRequest.URL != "" {
		result.NativeRequest = child.NativeRequest
		result.Response = child.Response
		result.ServiceAPI = child.ServiceAPI
	}
}

func (s GatewayService) planStoryboardGrid(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	aspectRatio imageSequenceAspectRatioSettings,
) (storyboardGridPlan, error) {
	return s.planImageSequence(ctx, req, storyboardGridPlanningSource(req), imageSequencePlannerOptions{
		ErrorLabel:      "规划宫格失败",
		ToolDescription: "提交有序宫格画面规划。",
		RolePrompt:      storyboardGridPlannerPrompt(),
		DefaultTitle:    "宫格图片",
		MinImages:       botmodel.StoryboardGridMinImages,
		MaxImages:       botmodel.StoryboardGridMaxImages,
		AspectRatio:     aspectRatio,
	})
}

func (s GatewayService) planImageSequence(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	source string,
	options imageSequencePlannerOptions,
) (storyboardGridPlan, error) {
	power, err := ResolveGeneralTextPower(ctx, botmodel.DefaultLLMPowerID)
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("%s: %w", options.ErrorLabel, err)
	}
	response := s.Request(ctx, GatewayRequest{
		RequestID: uuid.NewString(),
		Billing:   req.Billing,
		Body: map[string]any{
			"power": power.Key,
			"set": map[string]any{
				"role": imageSequencePlannerRolePrompt(options.RolePrompt, options.AspectRatio),
			},
			"input": PromptInput(source),
			"options": map[string]any{
				"stream":              false,
				"temperature":         0,
				"tools":               []any{botprotocol.FunctionToolDefinition(storyboardGridSubmitToolName, options.ToolDescription, imageSequencePlannerSchema(options.MinImages, options.MaxImages, options.AspectRatio.Options), false)},
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
		return storyboardGridPlan{}, fmt.Errorf("%s: %s", options.ErrorLabel, message)
	}

	call, err := storyboardGridToolCall(botprotocol.ParseToolCalls(botprotocol.ExtractOutput(response.Payload())["tool_calls"]))
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("%s: %w", options.ErrorLabel, err)
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("%s: %w", options.ErrorLabel, err)
	}
	raw, err := json.Marshal(arguments)
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("%s: %w", options.ErrorLabel, err)
	}
	plan := storyboardGridPlan{}
	if err := json.Unmarshal(raw, &plan); err != nil {
		return storyboardGridPlan{}, fmt.Errorf("%s: 返回结构无效: %w", options.ErrorLabel, err)
	}
	plan, err = normalizeImageSequencePlan(plan, options.MinImages, options.MaxImages, options.DefaultTitle)
	if err != nil {
		return storyboardGridPlan{}, err
	}
	plan.AspectRatio, err = resolveImageSequenceAspectRatio(plan.AspectRatio, options.AspectRatio)
	if err != nil {
		return storyboardGridPlan{}, fmt.Errorf("%s: %w", options.ErrorLabel, err)
	}
	return plan, nil
}

// Resolve "auto" once for the parent sequence; resolving it in every child
// request allows the provider to choose a different shape for each image.
func (s GatewayService) imageSequenceAspectRatioSettings(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) imageSequenceAspectRatioSettings {
	params := botinput.BuildPowerParams(ctx, s.repo, selected.Power.ID, selected.Service.ID)
	values := map[string]any{}
	if req != nil {
		values = botinput.NormalizePowerParamInput(req.Input, params)
	}
	values = botinput.ApplyPowerParamDefaults(values, params)
	for _, param := range params {
		if !strings.EqualFold(strings.TrimSpace(param.ParamKey), imageSequenceAspectRatioKey) &&
			!strings.EqualFold(strings.TrimSpace(param.Key), imageSequenceAspectRatioKey) {
			continue
		}
		selectedValue := strings.TrimSpace(botprotocol.AsText(values[param.Key]))
		options := explicitImageSequenceAspectRatios(param.Options)
		if selectedValue != "" && !isAutomaticImageSequenceAspectRatio(selectedValue) {
			return imageSequenceAspectRatioSettings{Value: canonicalImageSequenceAspectRatio(selectedValue, options)}
		}
		if len(options) == 1 {
			return imageSequenceAspectRatioSettings{Value: options[0]}
		}
		return imageSequenceAspectRatioSettings{Options: options}
	}
	return imageSequenceAspectRatioSettings{}
}

func explicitImageSequenceAspectRatios(options []botinput.PowerParamOption) []string {
	result := make([]string, 0, len(options))
	seen := map[string]bool{}
	for _, option := range options {
		value := strings.TrimSpace(option.NativeValue)
		key := strings.ToLower(value)
		if value == "" || isAutomaticImageSequenceAspectRatio(value) || seen[key] {
			continue
		}
		seen[key] = true
		result = append(result, value)
	}
	return result
}

func isAutomaticImageSequenceAspectRatio(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "auto", "automatic", "adaptive", "自动", "自适应":
		return true
	default:
		return false
	}
}

func canonicalImageSequenceAspectRatio(value string, options []string) string {
	value = strings.TrimSpace(value)
	for _, option := range options {
		if strings.EqualFold(value, option) {
			return option
		}
	}
	return value
}

func imageSequencePlannerRolePrompt(rolePrompt string, aspectRatio imageSequenceAspectRatioSettings) string {
	rolePrompt = strings.TrimSpace(rolePrompt)
	if aspectRatio.Value != "" {
		return fmt.Sprintf("%s\n- 本组所有图片固定使用 %s 画幅，构图必须适应该统一画幅。", rolePrompt, aspectRatio.Value)
	}
	if len(aspectRatio.Options) == 0 {
		return rolePrompt
	}
	return fmt.Sprintf(
		"%s\n- 根据整组内容从 [%s] 中选择一个最合适的统一画幅，写入 aspect_ratio；本组所有图片禁止使用不同画幅。",
		rolePrompt,
		strings.Join(aspectRatio.Options, ", "),
	)
}

func resolveImageSequenceAspectRatio(
	planned string,
	settings imageSequenceAspectRatioSettings,
) (string, error) {
	if settings.Value != "" {
		return settings.Value, nil
	}
	if len(settings.Options) == 0 {
		return "", nil
	}
	planned = strings.TrimSpace(planned)
	for _, option := range settings.Options {
		if strings.EqualFold(planned, option) {
			return option, nil
		}
	}
	if planned == "" {
		return "", fmt.Errorf("未返回整组图片的统一比例")
	}
	return "", fmt.Errorf("整组图片比例“%s”不受当前来源支持", planned)
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
	media := imagePlanningMediaLabels(content)
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
- 用户明确指定数量、编号或镜头清单时，必须严格保持原数量与原顺序，不得合并、遗漏、调换或新增镜头。
- 每张只表达一个清晰画面，不把多张画面拼进同一张图片。
- visual_bible 是整组共用的视觉基线，必须具体写明固定主体身份与外貌、服装、关键道具、主场景、光线、色彩和画风，不写单个镜头动作。
- 相邻画面在主体身份、服装、关键道具、场景、光线和画风上严格服从 visual_bible；只改变当前镜头需要的动作、景别和构图。
- prompt 必须是可以直接交给图片模型的完整提示词，写清主体、动作、环境、构图和必要的一致性要求。
- description 简要说明该画面在整组中的作用；title 使用简短、可区分的中文名称。
- 只能调用 %s 提交结果，不输出其他文字。`, botmodel.StoryboardGridMinImages, botmodel.StoryboardGridMaxImages, storyboardGridSubmitToolName)
}

func storyboardGridPlannerSchema() map[string]any {
	return imageSequencePlannerSchema(botmodel.StoryboardGridMinImages, botmodel.StoryboardGridMaxImages, nil)
}

func imageSequencePlannerSchema(minImages int, maxImages int, aspectRatios []string) map[string]any {
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
	properties := map[string]any{
		"version":      map[string]any{"type": "integer", "enum": []any{storyboardGridVersion}},
		"title":        map[string]any{"type": "string", "minLength": 1},
		"summary":      map[string]any{"type": "string", "minLength": 1},
		"visual_bible": map[string]any{"type": "string", "minLength": 1},
		"frames": map[string]any{
			"type":     "array",
			"minItems": minImages,
			"maxItems": maxImages,
			"items":    frame,
		},
	}
	required := []any{"version", "title", "summary", "visual_bible", "frames"}
	if len(aspectRatios) > 0 {
		enum := make([]any, 0, len(aspectRatios))
		for _, aspectRatio := range aspectRatios {
			enum = append(enum, aspectRatio)
		}
		properties["aspect_ratio"] = map[string]any{"type": "string", "enum": enum}
		required = append(required, "aspect_ratio")
	}
	return map[string]any{
		"type":                 "object",
		"properties":           properties,
		"required":             required,
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
	return normalizeImageSequencePlan(plan, botmodel.StoryboardGridMinImages, botmodel.StoryboardGridMaxImages, "宫格图片")
}

func normalizeImageSequencePlan(plan storyboardGridPlan, minImages int, maxImages int, defaultTitle string) (storyboardGridPlan, error) {
	if len(plan.Frames) < minImages || len(plan.Frames) > maxImages {
		return storyboardGridPlan{}, fmt.Errorf("画面数量必须为 %d～%d 张", minImages, maxImages)
	}
	plan.Version = storyboardGridVersion
	plan.Title = strings.TrimSpace(plan.Title)
	if plan.Title == "" {
		plan.Title = strings.TrimSpace(defaultTitle)
		if plan.Title == "" {
			plan.Title = "系列图片"
		}
	}
	plan.Summary = strings.TrimSpace(plan.Summary)
	if plan.Summary == "" {
		plan.Summary = plan.Title
	}
	plan.VisualBible = strings.TrimSpace(plan.VisualBible)
	if plan.VisualBible == "" {
		plan.VisualBible = plan.Summary
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
		frame.Status = storyboardGridStatusPending
		frame.Image = ""
		frame.Error = ""
	}
	return plan, nil
}

func storyboardGridFramePrompt(plan storyboardGridPlan, frame storyboardGridFrame) string {
	parts := []string{
		fmt.Sprintf("为《%s》生成第 %d/%d 张独立画面：%s。", plan.Title, frame.Order, len(plan.Frames), frame.Title),
		"整组视觉基线（本组所有镜头必须完全一致）：\n" + plan.VisualBible,
	}
	if plan.AspectRatio != "" {
		parts = append(parts, fmt.Sprintf("整组固定画幅：%s。当前画面也必须使用这一画幅，不得改成其他横竖比例。", plan.AspectRatio))
	}
	parts = append(parts,
		"当前画面：\n"+frame.Prompt,
		"只生成当前编号的一张独立图片，不要拼图，不要画框，不要编号文字，不要标题，不要水印。必须严格复用输入中的参考素材，并保持同一人物身份、脸部特征、发型、服装、关键道具、场景设定、光线、色彩和画风；只按当前镜头改变动作、景别和构图。",
	)
	return strings.Join(parts, "\n\n")
}

func cloneStoryboardGridRequest(
	req *botprotocol.ShemicRequest,
	prompt string,
	aspectRatio string,
	frameOrder int,
	attempt int,
) *botprotocol.ShemicRequest {
	next := *req
	next.RequestID = storyboardGridChildRequestID(req.RequestID, frameOrder, attempt)
	next.Set = cloneAnyMap(req.Set)
	next.Input = cloneAnyMap(req.Input)
	if next.Input == nil {
		next.Input = map[string]any{}
	}
	next.Input["prompt"] = strings.TrimSpace(prompt)
	if aspectRatio = strings.TrimSpace(aspectRatio); aspectRatio != "" {
		next.Input[imageSequenceAspectRatioKey] = aspectRatio
	}
	next.History = append([]any(nil), req.History...)
	next.Options = cloneAnyMap(req.Options)
	delete(next.Options, botprotocol.OptionImageSequenceMode)
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

func storyboardGridChildRequestID(parent string, frameOrder int, attempt int) string {
	const suffixLength = len("-grid-00-a0")
	parent = strings.TrimSpace(parent)
	if parent == "" {
		parent = uuid.NewString()
	}
	if len(parent) > 64-suffixLength {
		parent = parent[:64-suffixLength]
	}
	return fmt.Sprintf("%s-grid-%02d-a%d", parent, frameOrder, attempt)
}

func storyboardGridErrorMessage(err error) string {
	message := "图片生成失败"
	if err != nil && strings.TrimSpace(err.Error()) != "" {
		message = strings.TrimSpace(err.Error())
	}
	return message
}

func storyboardGridFrameProgressMessage(plan storyboardGridPlan, frame storyboardGridFrame) string {
	generatedCount := 0
	for _, candidate := range plan.Frames {
		if candidate.Status == StatusSuccess && strings.TrimSpace(candidate.Image) != "" {
			generatedCount++
		}
	}
	if frame.Status == StatusSuccess {
		return fmt.Sprintf("第 %d/%d 张已生成，当前完成 %d 张", frame.Order, len(plan.Frames), generatedCount)
	}
	return fmt.Sprintf("第 %d/%d 张生成失败，当前完成 %d 张", frame.Order, len(plan.Frames), generatedCount)
}

func storyboardGridProgressOutput(plan storyboardGridPlan, message string) botprotocol.Output {
	output, _ := storyboardGridOutput(plan, "status")
	output["text"] = strings.TrimSpace(message)
	return output
}

func storyboardGridOutput(plan storyboardGridPlan, event string) (botprotocol.Output, int) {
	images, frames := imageSequenceOutputValues(plan)
	grid := map[string]any{
		"type":         botmodel.OutputTypeStoryboardGrid,
		"version":      storyboardGridVersion,
		"title":        plan.Title,
		"summary":      plan.Summary,
		"visual_bible": plan.VisualBible,
		"frames":       frames,
	}
	meta := map[string]any{
		"output_type":     botmodel.OutputTypeStoryboardGrid,
		"view_mode":       botmodel.OutputTypeStoryboardGrid,
		"requested_count": len(plan.Frames),
		"generated_count": len(images),
		"partial":         len(images) != len(plan.Frames),
	}
	if plan.AspectRatio != "" {
		grid["aspect_ratio"] = plan.AspectRatio
		meta["aspect_ratio"] = plan.AspectRatio
	}
	output := botprotocol.Output{
		"event":  event,
		"title":  plan.Title,
		"images": images,
		"json":   grid,
		"meta":   meta,
	}
	if plan.AspectRatio != "" {
		output["aspect_ratio"] = plan.AspectRatio
	}
	if len(images) > 0 {
		output["image"] = images[0]
	}
	return output, len(images)
}

func imageSequenceOutputValues(plan storyboardGridPlan) ([]string, []any) {
	images := make([]string, 0, len(plan.Frames))
	items := make([]any, 0, len(plan.Frames))
	for _, frame := range plan.Frames {
		if frame.Status == StatusSuccess && strings.TrimSpace(frame.Image) != "" {
			images = append(images, strings.TrimSpace(frame.Image))
		}
		items = append(items, map[string]any{
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
	return images, items
}
