package agent

import (
	"encoding/json"
	"strings"
)

type LoadedSkillRef struct {
	Key         string `json:"key"`
	ContentHash string `json:"content_hash,omitempty"`
}

func (reference *LoadedSkillRef) UnmarshalJSON(raw []byte) error {
	var key string
	if json.Unmarshal(raw, &key) == nil {
		reference.Key = key
		reference.ContentHash = ""
		return nil
	}
	type loadedSkillRef LoadedSkillRef
	var value loadedSkillRef
	if err := json.Unmarshal(raw, &value); err != nil {
		return err
	}
	*reference = LoadedSkillRef(value)
	return nil
}

func NormalizeLoadedSkillRefs(values []LoadedSkillRef) []LoadedSkillRef {
	result := make([]LoadedSkillRef, 0, len(values))
	indexByKey := make(map[string]int, len(values))
	for _, value := range values {
		value.Key = strings.TrimSpace(value.Key)
		value.ContentHash = strings.TrimSpace(value.ContentHash)
		if value.Key == "" {
			continue
		}
		identity := strings.ToLower(value.Key)
		if index, exists := indexByKey[identity]; exists {
			result[index] = value
			continue
		}
		indexByKey[identity] = len(result)
		result = append(result, value)
	}
	return result
}

func DecodeLoadedSkillRefs(raw string) []LoadedSkillRef {
	var values []LoadedSkillRef
	if json.Unmarshal([]byte(strings.TrimSpace(raw)), &values) != nil {
		return nil
	}
	return NormalizeLoadedSkillRefs(values)
}
