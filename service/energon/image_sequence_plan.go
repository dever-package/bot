package energon

import (
	"bytes"
	"encoding/json"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// 仅完整图片计划可以省略语义规划；当前创作要求及其它业务上下文仍交给规划器。
func reusableContextImageSequencePlan(
	req *botprotocol.ShemicRequest,
	sequenceRange botprotocol.ImageSequenceRange,
	aspectRatio imageSequenceAspectRatioSettings,
	params []botinput.PowerParam,
) (storyboardGridPlan, bool) {
	previous, exists := contextImagePreviousOutput(req)
	if !exists || hasContextImagePlanRequirements(req.Input, params) {
		return storyboardGridPlan{}, false
	}
	previous = imageSequencePlanSource(previous)
	row := botprotocol.NormalizeMap(previous)
	if row == nil {
		return storyboardGridPlan{}, false
	}
	meta := botprotocol.NormalizeMap(row["meta"])
	switch botprotocol.AsText(meta["output_type"]) {
	case botmodel.OutputTypeStoryboardGrid:
		row = botprotocol.NormalizeMap(row["json"])
	case botmodel.OutputTypeGeneral:
		if meta["semantic_planning"] != true {
			return storyboardGridPlan{}, false
		}
		row = map[string]any{
			"title": meta["title"], "summary": meta["summary"],
			"visual_bible": meta["visual_bible"], "aspect_ratio": meta["aspect_ratio"],
			"frames": meta["items"],
		}
	}
	if row == nil || strings.TrimSpace(botprotocol.AsText(row["visual_bible"])) == "" {
		return storyboardGridPlan{}, false
	}
	row = cloneAnyMap(row)
	if kind, exists := row["type"]; exists {
		if kind != botmodel.OutputTypeStoryboardGrid {
			return storyboardGridPlan{}, false
		}
		delete(row, "type")
	}
	raw, err := json.Marshal(row)
	if err != nil {
		return storyboardGridPlan{}, false
	}
	var plan storyboardGridPlan
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if decoder.Decode(&plan) != nil || (plan.Version != 0 && plan.Version != storyboardGridVersion) {
		return storyboardGridPlan{}, false
	}
	if count, exists := meta["requested_count"]; exists {
		requested, err := strconv.Atoi(botprotocol.AsText(count))
		if err != nil || requested != len(plan.Frames) {
			return storyboardGridPlan{}, false
		}
	}
	for index, frame := range plan.Frames {
		if frame.Order != 0 && frame.Order != index+1 {
			return storyboardGridPlan{}, false
		}
	}
	plan, err = normalizeImageSequencePlan(plan, sequenceRange.MinImages, sequenceRange.MaxImages, "系列图片")
	if err != nil {
		return storyboardGridPlan{}, false
	}
	// 自动画幅沿用完整计划的选择，但必须受当前来源支持；显式选择优先。
	if aspectRatio.Value != "" || len(aspectRatio.Options) > 0 {
		plan.AspectRatio, err = resolveImageSequenceAspectRatio(plan.AspectRatio, aspectRatio)
		if err != nil {
			return storyboardGridPlan{}, false
		}
	}
	return plan, true
}

func hasContextImagePlanRequirements(input map[string]any, params []botinput.PowerParam) bool {
	current := cloneAnyMap(input)
	delete(current, "previous_output")
	for _, param := range params {
		controlType := botinput.NormalizeParamControlType(param.Type)
		if !botinput.IsFileParamType(param.Type) && !botinput.IsOptionParamType(param.Type) &&
			controlType != "switch" && botinput.NormalizeParamValueType(param.ValueType) != "number" {
			continue
		}
		delete(current, param.Key)
		delete(current, param.ParamKey)
	}
	return strings.TrimSpace(botprotocol.BuildPromptContent(current, botprotocol.PromptOptions{}).Text) != ""
}

// 解包实际画布来源，禁止把任意业务对象的 output 字段当作完整计划。
func imageSequencePlanSource(value any) any {
	for depth := 0; depth < 16; depth++ {
		if output, ok := value.(botprotocol.Output); ok {
			value = map[string]any(output)
		}
		if text, ok := value.(string); ok {
			var decoded any
			if json.Unmarshal([]byte(text), &decoded) != nil {
				return value
			}
			value = decoded
			continue
		}
		if values, ok := value.([]any); ok {
			if len(values) != 1 {
				return value
			}
			value = values[0]
			continue
		}
		row := botprotocol.NormalizeMap(value)
		if row == nil {
			return value
		}
		if output, exists := row["output"]; exists && (row["node_id"] != nil || row["nodeId"] != nil) {
			if !imageSequenceWrapperHasOnlyIdentity(row, "output") {
				return nil
			}
			value = output
			continue
		}
		sources := botprotocol.NormalizeAnyList(row["sources"])
		if len(sources) == 1 {
			source := botprotocol.NormalizeMap(sources[0])
			if source != nil && (source["node_id"] != nil || source["nodeId"] != nil || source["type"] == "group_output") {
				if !imageSequenceWrapperHasOnlyIdentity(row, "sources") {
					return nil
				}
				value = sources[0]
				continue
			}
		}
		return value
	}
	return nil
}

// 来源包装只能提供身份及展示信息；选中部分内容或附加要求必须重新规划。
func imageSequenceWrapperHasOnlyIdentity(row map[string]any, payloadKey string) bool {
	for key, value := range row {
		if value == nil || key == payloadKey {
			continue
		}
		switch key {
		case "type", "node_id", "nodeId", "title", "kind", "output_type", "asset_id", "version_id", "group_id", "ref_type", "ref_id", "preview":
			continue
		default:
			return false
		}
	}
	return true
}
