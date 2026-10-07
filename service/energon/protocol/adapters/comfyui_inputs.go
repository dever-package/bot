package adapters

import (
	"encoding/json"
	"fmt"
	"strings"

	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func comfyMappedParams(params []botprotocol.MappedParam) []botprotocol.MappedParam {
	lastIndex := make(map[string]int, len(params))
	for index, param := range params {
		lastIndex[strings.TrimSpace(param.NativeKey)] = index
	}
	result := make([]botprotocol.MappedParam, 0, len(lastIndex))
	for index, param := range params {
		if lastIndex[strings.TrimSpace(param.NativeKey)] == index {
			result = append(result, param)
		}
	}
	return result
}

func comfyInputValue(param botprotocol.MappedParam, original any) (any, error) {
	if param.ParamType == "file" || param.ParamType == "files" {
		return comfySingleFile(param.Value, param.NativeKey)
	}
	value := param.Value
	switch original.(type) {
	case json.Number:
		number, err := botinput.ExactNumber(value)
		if err != nil {
			return nil, fmt.Errorf("ComfyUI 输入 %q：%w", param.NativeKey, err)
		}
		return number, nil
	case bool:
		if text, ok := value.(string); ok {
			switch strings.ToLower(strings.TrimSpace(text)) {
			case "true":
				return true, nil
			case "false":
				return false, nil
			}
		}
		if _, ok := value.(bool); !ok {
			return nil, fmt.Errorf("ComfyUI 输入 %q 需要布尔值", param.NativeKey)
		}
	case string:
		if _, ok := value.(string); !ok {
			return nil, fmt.Errorf("ComfyUI 输入 %q 需要文本，列表请分别映射到对应输入节点", param.NativeKey)
		}
	}
	return value, nil
}

func comfySingleFile(value any, key string) (string, error) {
	switch current := value.(type) {
	case string:
		if source := strings.TrimSpace(current); source != "" {
			return source, nil
		}
	case []string:
		if len(current) == 1 {
			return comfySingleFile(current[0], key)
		}
	case []any:
		if len(current) == 1 {
			return comfySingleFile(current[0], key)
		}
	}
	return "", fmt.Errorf("ComfyUI 文件输入 %q 必须映射一张图片；多图请使用文件索引分别映射到各输入节点", key)
}
