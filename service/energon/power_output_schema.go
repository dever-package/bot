package energon

import (
	"bytes"
	"encoding/json"
)

// 严格输出按 required 的叙事顺序排列属性，避免 Go map 的字母序改变模型生成顺序。
// 原 schema 仍是普通 map，校验器和非严格工具不受序列化顺序影响。
type orderedOutputSchema map[string]any

func (schema orderedOutputSchema) MarshalJSON() ([]byte, error) {
	encoded := make(map[string]any, len(schema))
	for key, value := range schema {
		if child, ok := value.(map[string]any); ok {
			value = orderedOutputSchema(child)
		}
		encoded[key] = value
	}
	if properties, ok := schema["properties"].(map[string]any); ok {
		keys := make([]string, 0, len(properties))
		switch required := schema["required"].(type) {
		case []string:
			keys = append(keys, required...)
		case []any:
			for _, key := range required {
				keys = append(keys, key.(string))
			}
		}
		var ordered bytes.Buffer
		ordered.WriteByte('{')
		for index, key := range keys {
			if index != 0 {
				ordered.WriteByte(',')
			}
			name, _ := json.Marshal(key)
			ordered.Write(name)
			ordered.WriteByte(':')
			value := properties[key]
			if child, ok := value.(map[string]any); ok {
				value = orderedOutputSchema(child)
			}
			raw, err := json.Marshal(value)
			if err != nil {
				return nil, err
			}
			ordered.Write(raw)
		}
		ordered.WriteByte('}')
		encoded["properties"] = json.RawMessage(ordered.Bytes())
	}
	return json.Marshal(encoded)
}
