package project

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

type persistedCanvas struct {
	AssetCateID uint64
	NextNodeNo  int
	Nodes       []any
	Edges       []any
	Viewport    map[string]any
}

var allowedCanvasNodeTypes = map[string]bool{
	"asset":    true,
	"power":    true,
	"agent":    true,
	"flow":     true,
	"function": true,
	"group":    true,
}

var allowedCanvasRootFields = stringSet(
	"asset_cate_id", "next_node_no", "nodes", "edges", "viewport",
)

var allowedCanvasNodeFields = stringSet(
	"id", "node_no", "type", "title", "title_mode", "subtitle", "description",
	"x", "y", "width", "height", "group_id", "group", "storyboard_item",
	"storyboard_materialized_signature", "asset_cate_id", "kind", "output_type",
	"cardinality", "count", "flow", "role", "asset", "power", "function_option",
	"composer_draft", "result_ref", "result_output", "result_view", "run_error", "local",
)

var allowedCanvasEdgeFields = stringSet(
	"id", "from", "to", "logical_from", "logical_to", "purpose", "execution_mode", "media_usage",
)

const (
	canvasEdgePurposeMedia      = "media"
	canvasEdgePurposeStructure  = "structure"
	canvasEdgePurposeDependency = "dependency"
)

var allowedCanvasEdgePurposes = stringSet(
	canvasEdgePurposeMedia,
	canvasEdgePurposeStructure,
	canvasEdgePurposeDependency,
)

var allowedCanvasViewportFields = stringSet("x", "y", "zoom")

var allowedCanvasGroupFields = stringSet(
	"origin", "source_node_id", "sync_key", "layout_key",
)

var allowedCanvasStoryboardFields = stringSet(
	"source_node_id", "item_type", "item_id", "generated_prompt",
	"dependency_node_ids", "reference_node_ids", "external_reference_asset_ids",
	"shot_id", "speech_id", "speech_ids", "character_id", "speech_kind",
	"speaker_mode", "start_time", "shot_duration", "continuity_anchor", "optional",
	"source_signature", "result_source_signature", "stale",
)

var allowedCanvasFlowFields = stringSet("id", "key", "name", "goal")

var allowedCanvasRoleFields = stringSet(
	"id", "name", "role_type", "agent_id",
)

var allowedCanvasAssetFields = stringSet(
	"id", "name", "kind", "role", "asset_cate_id", "version_id",
)

var allowedCanvasPowerFields = stringSet(
	"id", "key", "name", "kind", "icon", "output_type", "output",
)

var allowedCanvasOutputFields = stringSet(
	"key", "name", "allowed_kinds", "view_mode", "default_width", "default_height",
	"structured", "sort",
)

var allowedCanvasFunctionFields = stringSet("key", "label", "description")

var allowedCanvasComposerFields = stringSet(
	"prompt", "prompt_content", "param_values", "selected_target_id",
	"video_composition", "storyboard_references", "storyboard_grid_layout",
	"multi_image_mode",
)

var allowedCanvasResultRefFields = stringSet(
	"run_id", "request_id", "flow_run_id", "node_run_id", "asset_id", "version_id",
	"release_id", "role", "status", "updated_at",
)

var allowedCanvasResultViewFields = stringSet(
	"width", "height", "offset_x", "offset_y",
)

func sanitizeCanvasPayload(assetCateID uint64, canvas map[string]any) (persistedCanvas, error) {
	if canvas == nil {
		return persistedCanvas{}, fmt.Errorf("画布不能为空")
	}
	if err := validateCanvasFields(canvas, allowedCanvasRootFields, "画布"); err != nil {
		return persistedCanvas{}, err
	}
	canvasAssetCateID := uint64FromAny(canvas["asset_cate_id"])
	if canvasAssetCateID > 0 && assetCateID > 0 && canvasAssetCateID != assetCateID {
		return persistedCanvas{}, fmt.Errorf("画布资产分类不一致")
	}
	if assetCateID == 0 {
		assetCateID = canvasAssetCateID
	}
	nodes, err := sanitizeCanvasNodes(canvas["nodes"])
	if err != nil {
		return persistedCanvas{}, err
	}
	edges, err := sanitizeCanvasEdges(canvas["edges"])
	if err != nil {
		return persistedCanvas{}, err
	}
	viewport, err := sanitizeCanvasViewport(canvas["viewport"])
	if err != nil {
		return persistedCanvas{}, err
	}
	return persistedCanvas{
		AssetCateID: assetCateID,
		NextNodeNo:  nextCanvasNodeNo(canvas, nodes),
		Nodes:       nodes,
		Edges:       edges,
		Viewport:    viewport,
	}, nil
}

func nextCanvasNodeNo(canvas map[string]any, nodes []any) int {
	next := int(uint64FromAny(canvas["next_node_no"]))
	if next < 1 {
		next = 1
	}
	for _, raw := range nodes {
		row, _ := raw.(map[string]any)
		candidate := int(uint64FromAny(row["node_no"])) + 1
		if candidate > next {
			next = candidate
		}
	}
	return next
}

func sanitizeCanvasNodes(value any) ([]any, error) {
	if value == nil {
		return []any{}, nil
	}
	items, ok := value.([]any)
	if !ok {
		return nil, fmt.Errorf("画布节点格式错误")
	}
	result := make([]any, 0, len(items))
	for _, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("画布节点格式错误")
		}
		nodeType := strings.TrimSpace(fmt.Sprint(row["type"]))
		if !allowedCanvasNodeTypes[nodeType] {
			return nil, fmt.Errorf("节点类型无效")
		}
		if strings.TrimSpace(fmt.Sprint(row["id"])) == "" {
			return nil, fmt.Errorf("节点缺少 id")
		}
		if err := validateCanvasNode(row); err != nil {
			return nil, err
		}
		result = append(result, cloneCanvasObject(row))
	}
	return result, nil
}

func sanitizeCanvasEdges(value any) ([]any, error) {
	if value == nil {
		return []any{}, nil
	}
	items, ok := value.([]any)
	if !ok {
		return nil, fmt.Errorf("画布连线格式错误")
	}
	result := make([]any, 0, len(items))
	for _, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("画布连线格式错误")
		}
		if strings.TrimSpace(fmt.Sprint(row["id"])) == "" {
			return nil, fmt.Errorf("连线缺少 id")
		}
		if err := validateCanvasFields(row, allowedCanvasEdgeFields, "画布连线"); err != nil {
			return nil, err
		}
		purpose := canvasEdgePurposeValue(row)
		if !allowedCanvasEdgePurposes[purpose] {
			return nil, fmt.Errorf("画布连线用途无效")
		}
		clean := cloneCanvasObject(row)
		clean["purpose"] = purpose
		result = append(result, clean)
	}
	return result, nil
}

func canvasEdgePurposeValue(edge map[string]any) string {
	if purpose := strings.ToLower(strings.TrimSpace(textValue(edge["purpose"]))); purpose != "" {
		return purpose
	}
	id := strings.TrimSpace(textValue(edge["id"]))
	switch {
	case strings.HasPrefix(id, "script-item-edge-"), strings.HasPrefix(id, "script-compose-edge-"):
		return canvasEdgePurposeDependency
	case strings.HasPrefix(id, "script-edge-"):
		return canvasEdgePurposeStructure
	default:
		return canvasEdgePurposeMedia
	}
}

func validateCanvasNode(row map[string]any) error {
	if err := validateCanvasFields(row, allowedCanvasNodeFields, "画布节点"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["group"], allowedCanvasGroupFields, "节点分组"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["storyboard_item"], allowedCanvasStoryboardFields, "分镜节点"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["flow"], allowedCanvasFlowFields, "流程节点"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["role"], allowedCanvasRoleFields, "智能体节点"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["asset"], allowedCanvasAssetFields, "资产节点"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["function_option"], allowedCanvasFunctionFields, "功能节点"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["composer_draft"], allowedCanvasComposerFields, "节点输入"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["result_ref"], allowedCanvasResultRefFields, "节点结果引用"); err != nil {
		return err
	}
	if err := validateNestedCanvasFields(row["result_view"], allowedCanvasResultViewFields, "节点结果视图"); err != nil {
		return err
	}
	powerValue := row["power"]
	if powerValue == nil {
		return nil
	}
	power, ok := powerValue.(map[string]any)
	if !ok {
		return fmt.Errorf("能力节点格式错误")
	}
	if err := validateCanvasFields(power, allowedCanvasPowerFields, "能力节点"); err != nil {
		return err
	}
	return validateNestedCanvasFields(power["output"], allowedCanvasOutputFields, "能力输出")
}

func validateNestedCanvasFields(value any, allowed map[string]bool, label string) error {
	if value == nil {
		return nil
	}
	row, _ := value.(map[string]any)
	if row == nil {
		return fmt.Errorf("%s格式错误", label)
	}
	return validateCanvasFields(row, allowed, label)
}

func validateCanvasFields(row map[string]any, allowed map[string]bool, label string) error {
	for field := range row {
		if !allowed[field] {
			return fmt.Errorf("%s不支持字段 %s", label, field)
		}
	}
	return nil
}

func stringSet(values ...string) map[string]bool {
	result := make(map[string]bool, len(values))
	for _, value := range values {
		result[value] = true
	}
	return result
}

func sanitizeCanvasViewport(value any) (map[string]any, error) {
	if value == nil {
		return map[string]any{}, nil
	}
	row, ok := value.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("画布视图格式错误")
	}
	if err := validateCanvasFields(row, allowedCanvasViewportFields, "画布视图"); err != nil {
		return nil, err
	}
	return map[string]any{
		"x":    row["x"],
		"y":    row["y"],
		"zoom": row["zoom"],
	}, nil
}

func cloneCanvasObject(row map[string]any) map[string]any {
	clean := make(map[string]any, len(row))
	for key, value := range row {
		clean[key] = value
	}
	return clean
}

func jsonText(value any, fallback string) string {
	content, err := json.Marshal(value)
	if err != nil {
		return fallback
	}
	return string(content)
}

func jsonValue(raw string, fallback any) any {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fallback
	}
	var value any
	if err := json.Unmarshal([]byte(raw), &value); err != nil {
		return fallback
	}
	return value
}

func uint64FromAny(value any) uint64 {
	switch typed := value.(type) {
	case uint64:
		return typed
	case uint:
		return uint64(typed)
	case uint32:
		return uint64(typed)
	case int:
		if typed > 0 {
			return uint64(typed)
		}
	case int64:
		if typed > 0 {
			return uint64(typed)
		}
	case float64:
		if typed > 0 {
			return uint64(typed)
		}
	case string:
		parsed, _ := strconv.ParseUint(strings.TrimSpace(typed), 10, 64)
		return parsed
	}
	return 0
}
