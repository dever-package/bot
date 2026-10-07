package protocol

import (
	"encoding/json"
	"fmt"
	"io"
	"slices"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

func ValidateServiceEndpointType(providerProtocol, interfaceType string) error {
	interfaceType = botmodel.NormalizeServiceEndpointType(interfaceType)
	isComfyUI := strings.EqualFold(strings.TrimSpace(providerProtocol), botmodel.ProtocolComfyUI)
	switch interfaceType {
	case botmodel.ServiceEndpointTypeModel:
		if isComfyUI {
			return fmt.Errorf("ComfyUI 服务接口请选择“工作流 JSON”类型。")
		}
	case botmodel.ServiceEndpointTypeWorkflowJSON:
		if !isComfyUI {
			return fmt.Errorf("工作流 JSON 接口仅支持 ComfyUI 来源。")
		}
	default:
		return fmt.Errorf("服务接口类型无效。")
	}
	return nil
}

func ParseComfyWorkflow(raw string) (map[string]any, error) {
	if strings.TrimSpace(raw) == "" {
		return nil, fmt.Errorf("ComfyUI 服务接口必须填写工作流 JSON。")
	}
	decoder := json.NewDecoder(strings.NewReader(raw))
	decoder.UseNumber()
	var workflow map[string]any
	if err := decoder.Decode(&workflow); err != nil {
		return nil, fmt.Errorf("工作流 JSON 格式不正确，请粘贴 API 格式节点对象：%w", err)
	}
	var trailing any
	if err := decoder.Decode(&trailing); err != io.EOF {
		return nil, fmt.Errorf("工作流必须只包含一个 JSON 节点对象。")
	}
	if len(workflow) == 0 {
		return nil, fmt.Errorf("工作流必须是非空的 API 格式节点对象。")
	}
	nodeIDs := make([]string, 0, len(workflow))
	for nodeID := range workflow {
		nodeIDs = append(nodeIDs, nodeID)
	}
	slices.Sort(nodeIDs)
	for _, nodeID := range nodeIDs {
		node, valid := workflow[nodeID].(map[string]any)
		classType, _ := node["class_type"].(string)
		inputs, inputsValid := node["inputs"].(map[string]any)
		if !valid || strings.TrimSpace(nodeID) == "" || strings.TrimSpace(classType) == "" || !inputsValid || inputs == nil {
			return nil, fmt.Errorf("节点 %q 必须包含 class_type 和 inputs 对象；请使用 ComfyUI 导出的 API 格式工作流，不是画布 JSON 或含 prompt 的请求体。", nodeID)
		}
	}
	return workflow, nil
}

func ComfyWorkflowInput(workflow map[string]any, key string) (map[string]any, string, error) {
	nodeID, inputName, found := strings.Cut(strings.TrimSpace(key), ".")
	nodeID, inputName = strings.TrimSpace(nodeID), strings.TrimSpace(inputName)
	if !found || nodeID == "" || inputName == "" {
		return nil, "", fmt.Errorf("ComfyUI 字段标识 %q 必须使用 节点ID.输入名，例如 10.text", key)
	}
	node, exists := workflow[nodeID].(map[string]any)
	if !exists {
		return nil, "", fmt.Errorf("ComfyUI 工作流不存在节点 %q", nodeID)
	}
	inputs, _ := node["inputs"].(map[string]any)
	if _, exists := inputs[inputName]; !exists {
		return nil, "", fmt.Errorf("ComfyUI 节点 %q 不存在输入 %q", nodeID, inputName)
	}
	return inputs, inputName, nil
}
