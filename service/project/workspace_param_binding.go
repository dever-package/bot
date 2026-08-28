package project

import (
	"context"
	"fmt"
	"sort"
	"strings"

	energoninput "github.com/dever-package/bot/service/energon/input"
)

const canvasParamBindingPrimaryText = "primary_text"

type canvasParamBinding struct {
	SourceNodeID string
	SourceOutput string
}

func parseCanvasParamBindings(value any) (map[string]canvasParamBinding, error) {
	if value == nil {
		return map[string]canvasParamBinding{}, nil
	}
	rows, ok := value.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("参数绑定格式错误")
	}
	bindings := make(map[string]canvasParamBinding, len(rows))
	for rawTargetKey, rawBinding := range rows {
		targetKey := strings.TrimSpace(rawTargetKey)
		if targetKey == "" || unsafeCanvasParamBindingKey(targetKey) {
			return nil, fmt.Errorf("目标参数标识无效")
		}
		row, ok := rawBinding.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("参数“%s”的绑定格式错误", targetKey)
		}
		sourceNodeID := firstText(row["source_node_id"], row["sourceNodeId"])
		if sourceNodeID == "" {
			return nil, fmt.Errorf("参数“%s”的来源节点不能为空", targetKey)
		}
		sourceOutput := strings.ToLower(firstText(
			row["source_output"],
			row["sourceOutput"],
			canvasParamBindingPrimaryText,
		))
		if sourceOutput != canvasParamBindingPrimaryText {
			return nil, fmt.Errorf("参数“%s”的来源输出不支持", targetKey)
		}
		bindings[targetKey] = canvasParamBinding{
			SourceNodeID: sourceNodeID,
			SourceOutput: sourceOutput,
		}
	}
	return bindings, nil
}

func validateCanvasTextParamConnections(nodes map[string]canvasRunNode, edges []canvasRunEdge) error {
	for _, edge := range edges {
		if edge.Purpose != canvasEdgePurposeMedia {
			continue
		}
		sourceNodeID := firstText(edge.LogicalFrom, edge.From)
		targetNodeID := firstText(edge.LogicalTo, edge.To)
		source, sourceExists := nodes[sourceNodeID]
		target, targetExists := nodes[targetNodeID]
		if !sourceExists || !targetExists || target.Type != "power" || !canvasRunNodeProvidesPrimaryText(source) {
			continue
		}

		bindingCount := 0
		for _, binding := range target.ParamBindings {
			if binding.SourceNodeID == sourceNodeID {
				bindingCount++
			}
		}
		if target.StoryboardWorkType == "mv" && target.StoryboardLyricsSourceID == sourceNodeID {
			if bindingCount > 0 {
				return fmt.Errorf(
					"节点“%s”的歌词来源“%s”不能同时绑定普通文本参数",
					canvasRunNodeTitle(target),
					canvasRunNodeTitle(source),
				)
			}
			continue
		}
		switch bindingCount {
		case 0:
			return fmt.Errorf(
				"节点“%s”来自“%s”的文本连接待绑定目标参数",
				canvasRunNodeTitle(target),
				canvasRunNodeTitle(source),
			)
		case 1:
			continue
		default:
			return fmt.Errorf(
				"节点“%s”来自“%s”的文本连接只能绑定一个目标参数",
				canvasRunNodeTitle(target),
				canvasRunNodeTitle(source),
			)
		}
	}
	return nil
}

func unsafeCanvasParamBindingKey(key string) bool {
	switch key {
	case "__proto__", "constructor", "prototype":
		return true
	default:
		return false
	}
}

func (s WorkspaceService) applyCanvasPowerParamBindings(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	node canvasRunNode,
	previousOutput any,
	results []canvasNodeResult,
	params map[string]any,
) error {
	if len(node.ParamBindings) == 0 {
		return nil
	}
	configuredParams, err := s.project.CanvasRuntimePowerParams(
		ctx,
		projectID,
		node.FlowID,
		node.PowerID,
		node.PowerKey,
		node.SelectedTarget,
	)
	if err != nil {
		return fmt.Errorf("读取能力参数失败：%w", err)
	}
	return applyCanvasParamBindingValues(
		node,
		params,
		configuredParams,
		req.Canvas,
		func(sourceNodeID string) any {
			return canvasReferencedNodeOutput(
				ctx,
				projectID,
				sourceNodeID,
				previousOutput,
				results,
				req.Canvas,
			)
		},
	)
}

func applyCanvasParamBindingValues(
	node canvasRunNode,
	params map[string]any,
	configuredParams []energoninput.PowerParam,
	canvas map[string]any,
	sourceOutput func(sourceNodeID string) any,
) error {
	if len(node.ParamBindings) == 0 {
		return nil
	}
	activeParams := energoninput.FilterActivePowerParams(configuredParams, params)
	textParams := make(map[string]energoninput.PowerParam, len(activeParams))
	for _, param := range activeParams {
		key := strings.TrimSpace(param.Key)
		if key != "" && canvasParamAcceptsTextBinding(param) {
			textParams[key] = param
		}
	}
	upstreamNodeIDs := map[string]bool{}
	for _, edge := range logicalUpstreamCanvasEdges(node.ID, canvas) {
		upstreamNodeIDs[edge.From] = true
	}
	targetKeys := make([]string, 0, len(node.ParamBindings))
	for targetKey := range node.ParamBindings {
		targetKeys = append(targetKeys, targetKey)
	}
	sort.Strings(targetKeys)
	for _, targetKey := range targetKeys {
		binding := node.ParamBindings[targetKey]
		param, exists := textParams[targetKey]
		if !exists {
			return fmt.Errorf("参数“%s”不是可写文本参数或当前未生效", targetKey)
		}
		if !upstreamNodeIDs[binding.SourceNodeID] {
			return fmt.Errorf(
				"参数“%s”的来源节点“%s”不是当前节点的直接上游",
				canvasParamBindingLabel(param),
				binding.SourceNodeID,
			)
		}
		if !canvasNodeProvidesPrimaryText(
			canvasNodeByID(binding.SourceNodeID, canvas),
		) {
			return fmt.Errorf(
				"参数“%s”的来源节点“%s”不提供文本输出",
				canvasParamBindingLabel(param),
				binding.SourceNodeID,
			)
		}
		text := strings.TrimSpace(canvasContextText(sourceOutput(binding.SourceNodeID)))
		if text == "" {
			return fmt.Errorf(
				"参数“%s”的上游节点“%s”暂无文本输出",
				canvasParamBindingLabel(param),
				binding.SourceNodeID,
			)
		}
		if energoninput.IsPromptParamType(param.Type) {
			params[targetKey] = mergeCanvasBoundPrompt(
				text,
				textValue(params[targetKey]),
			)
			continue
		}
		params[targetKey] = text
	}
	return nil
}

func mergeCanvasBoundPrompt(boundPrompt string, localPrompt string) string {
	boundPrompt = strings.TrimSpace(boundPrompt)
	localPrompt = strings.TrimSpace(localPrompt)
	if localPrompt == "" || localPrompt == boundPrompt {
		return boundPrompt
	}
	if boundPrompt == "" {
		return localPrompt
	}
	return boundPrompt + "\n\n当前节点补充要求：\n" + localPrompt
}

func canvasNodeProvidesPrimaryText(node map[string]any) bool {
	if node == nil {
		return false
	}
	nodeType := strings.ToLower(textValue(node["type"]))
	kind := firstText(node["kind"], node["output_type"], node["outputType"])
	switch nodeType {
	case "power":
		kind = firstText(
			valueAtPath(node, "power", "kind"),
			kind,
		)
	case "asset":
		kind = firstText(
			valueAtPath(node, "asset", "kind"),
			kind,
		)
	}
	return canvasDeclaredNodeProvidesPrimaryText(nodeType, kind)
}

func canvasRunNodeProvidesPrimaryText(node canvasRunNode) bool {
	nodeType := strings.ToLower(strings.TrimSpace(node.Type))
	kind := firstText(node.Kind, node.OutputType)
	switch nodeType {
	case "power":
		kind = firstText(node.PowerKind, kind)
	case "asset":
		kind = firstText(node.Asset["kind"], kind)
	}
	return canvasDeclaredNodeProvidesPrimaryText(nodeType, kind)
}

func canvasDeclaredNodeProvidesPrimaryText(nodeType string, kind string) bool {
	return nodeType == "agent" || canvasTextOutputKind(kind)
}

func canvasTextOutputKind(kind string) bool {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "text", "llm", "rich", "richtext", "document":
		return true
	default:
		return false
	}
}

func canvasParamAcceptsTextBinding(param energoninput.PowerParam) bool {
	switch energoninput.NormalizeParamControlType(param.Type) {
	case "prompt", "textarea", "input":
		return energoninput.NormalizeParamValueType(param.ValueType) != "number"
	default:
		return false
	}
}

func canvasParamBindingLabel(param energoninput.PowerParam) string {
	if name := strings.TrimSpace(param.Name); name != "" {
		return name
	}
	return strings.TrimSpace(param.Key)
}
