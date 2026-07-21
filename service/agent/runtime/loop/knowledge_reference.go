package loop

import (
	"encoding/json"
	"sort"
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func recoverUnknownKnowledgeNodeReference(
	state *runState,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
) (toolStepResult, bool) {
	nodeID, guarded := guardedKnowledgeNodeID(call)
	if !guarded || nodeID == 0 || state.knowledgeNodeReferenceKnown(nodeID) {
		return toolStepResult{}, false
	}
	arguments, _ := botprotocol.ToolCallArguments(call)
	content := map[string]any{
		"resolved":          false,
		"knowledge_base_id": runtimeprovider.ArgumentUint64(arguments, "knowledge_base_id"),
		"node_id":           nodeID,
		"next_tools": []string{
			runtimeprovider.KnowledgeNodeSearchToolName,
			runtimeprovider.KnowledgeTreeToolName,
			"read_knowledge_file",
		},
		"instruction": "node_id 必须来自当前上下文中的知识节点搜索或知识树结果；请先搜索或浏览知识树，已知文件路径时直接读取文件。",
	}
	result := runtimeprovider.Result{
		Text:        "已跳过无效知识节点引用，请先搜索知识节点或直接读取文件",
		Content:     content,
		ModelResult: content,
	}
	return buildToolStepResult(state.execution.registry, call, definition, result, nil), true
}

func guardedKnowledgeNodeID(call botprotocol.ToolCall) (uint64, bool) {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return 0, false
	}
	switch strings.ToLower(strings.TrimSpace(call.Name)) {
	case runtimeprovider.KnowledgeTreeToolName:
		nodeID := runtimeprovider.ArgumentUint64(arguments, "parent_id")
		return nodeID, nodeID > 0
	case runtimeprovider.KnowledgeNodeOpenToolName,
		runtimeprovider.KnowledgeNodeExpandToolName,
		runtimeprovider.KnowledgeNodeRelatedToolName:
		return runtimeprovider.ArgumentUint64(arguments, "node_id"), true
	default:
		return 0, false
	}
}

func (state *runState) knowledgeNodeReferenceKnown(nodeID uint64) bool {
	if state == nil || nodeID == 0 {
		return false
	}
	_, exists := state.knowledgeNodeIDs[nodeID]
	return exists
}

func knowledgeNodeReferenceSource(name string) bool {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case runtimeprovider.KnowledgeTreeToolName,
		runtimeprovider.KnowledgeNodeSearchToolName,
		runtimeprovider.KnowledgeNodeOpenToolName,
		runtimeprovider.KnowledgeNodeExpandToolName,
		runtimeprovider.KnowledgeNodeRelatedToolName:
		return true
	default:
		return false
	}
}

func (state *runState) addKnowledgeNodeReferences(toolName string, content any) {
	if state == nil || content == nil || !knowledgeNodeReferenceSource(toolName) {
		return
	}
	raw, err := json.Marshal(content)
	if err != nil {
		return
	}
	var payload any
	if json.Unmarshal(raw, &payload) != nil {
		return
	}
	if state.knowledgeNodeIDs == nil {
		state.knowledgeNodeIDs = map[uint64]struct{}{}
	}
	collectKnowledgeNodeIDs(payload, state.knowledgeNodeIDs)
}

func collectKnowledgeNodeIDs(value any, result map[uint64]struct{}) {
	switch current := value.(type) {
	case map[string]any:
		if nodeID := runtimeprovider.ArgumentUint64(current, "node_id"); nodeID > 0 {
			result[nodeID] = struct{}{}
		}
		for _, item := range current {
			collectKnowledgeNodeIDs(item, result)
		}
	case []any:
		for _, item := range current {
			collectKnowledgeNodeIDs(item, result)
		}
	}
}

func knowledgeNodeIDSet(values []uint64) map[uint64]struct{} {
	result := make(map[uint64]struct{}, len(values))
	for _, value := range values {
		if value > 0 {
			result[value] = struct{}{}
		}
	}
	return result
}

func sortedKnowledgeNodeIDs(values map[uint64]struct{}) []uint64 {
	result := make([]uint64, 0, len(values))
	for value := range values {
		if value > 0 {
			result = append(result, value)
		}
	}
	sort.Slice(result, func(left int, right int) bool { return result[left] < result[right] })
	return result
}

func knowledgeResultCountsAsUsed(result runtimeprovider.Result) bool {
	content, ok := result.Content.(map[string]any)
	if !ok {
		return true
	}
	resolved, exists := content["resolved"].(bool)
	return !exists || resolved
}
