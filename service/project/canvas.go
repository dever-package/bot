package project

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

type persistedCanvas struct {
	AssetCateID uint64
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
}

var forbiddenCanvasDataFields = map[string]bool{
	"result":            true,
	"generatedOutput":   true,
	"generated_output":  true,
	"generatedPreview":  true,
	"generated_preview": true,
	"running":           true,
}

func sanitizeCanvasPayload(assetCateID uint64, canvas map[string]any) (persistedCanvas, error) {
	if canvas == nil {
		return persistedCanvas{}, fmt.Errorf("画布不能为空")
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
		Nodes:       nodes,
		Edges:       edges,
		Viewport:    viewport,
	}, nil
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
		clean := cloneCanvasObject(row)
		if data, ok := clean["data"].(map[string]any); ok {
			clean["data"] = sanitizeCanvasData(data)
		}
		result = append(result, clean)
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
		result = append(result, cloneCanvasObject(row))
	}
	return result, nil
}

func sanitizeCanvasViewport(value any) (map[string]any, error) {
	if value == nil {
		return map[string]any{}, nil
	}
	row, ok := value.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("画布视图格式错误")
	}
	return map[string]any{
		"x":    row["x"],
		"y":    row["y"],
		"zoom": row["zoom"],
	}, nil
}

func sanitizeCanvasData(data map[string]any) map[string]any {
	clean := make(map[string]any, len(data))
	for key, value := range data {
		if forbiddenCanvasDataFields[key] {
			continue
		}
		clean[key] = value
	}
	return clean
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
