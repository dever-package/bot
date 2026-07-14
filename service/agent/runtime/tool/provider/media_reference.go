package provider

import (
	"fmt"
	"strings"
	"sync"

	energonservice "github.com/dever-package/bot/service/energon"
)

const MediaReferencesArgument = "__runtime_references"
const MaxRuntimeMediaReferences = 32

type MediaReference struct {
	ReferenceType string
	ReferenceID   uint64
	ArtifactID    uint64
	FileID        uint64
	SeriesID      uint64
	Kind          string
	Name          string
	Label         string
	URL           string
	ParameterKey  string
}

type mediaReferenceStore struct {
	mutex sync.RWMutex
	items []MediaReference
}

func newMediaReferenceStore(references []MediaReference) *mediaReferenceStore {
	store := &mediaReferenceStore{}
	store.Add(references)
	return store
}

func (store *mediaReferenceStore) Snapshot() []MediaReference {
	if store == nil {
		return nil
	}
	store.mutex.RLock()
	defer store.mutex.RUnlock()
	return append([]MediaReference(nil), store.items...)
}

func (store *mediaReferenceStore) Add(references []MediaReference) {
	if store == nil || len(references) == 0 {
		return
	}
	store.mutex.Lock()
	defer store.mutex.Unlock()
	seen := make(map[string]struct{}, len(store.items))
	for _, current := range store.items {
		seen[mediaReferenceKey(current.ReferenceType, current.ReferenceID)] = struct{}{}
	}
	for _, current := range references {
		if len(store.items) >= MaxRuntimeMediaReferences {
			break
		}
		key := mediaReferenceKey(current.ReferenceType, current.ReferenceID)
		if current.ReferenceID == 0 || strings.TrimSpace(current.URL) == "" {
			continue
		}
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		store.items = append(store.items, current)
	}
}

func supportedMediaReferences(references []MediaReference, params []energonservice.PowerParam) []MediaReference {
	result := make([]MediaReference, 0, len(references))
	for _, current := range references {
		if len(mediaReferenceParams(params, current.Kind)) > 0 {
			result = append(result, current)
		}
	}
	return result
}

func MediaReferencesParameters(parameters map[string]any, references []MediaReference, params []energonservice.PowerParam) map[string]any {
	parameterKeys, parameterDescription := mediaReferenceParameterOptions(params, references)
	if len(references) == 0 || len(parameterKeys) == 0 {
		return parameters
	}
	result := clonePowerParameters(parameters)
	properties, _ := result["properties"].(map[string]any)
	properties[MediaReferencesArgument] = map[string]any{
		"type":        "array",
		"description": "当前运行允许使用的素材。仅可填写工具说明中列出的 ref_type 和 ref_id；需要使用素材时必须传入，并通过 param_key 明确选择能力当前配置的素材参数，禁止猜测其他ID。",
		"items": map[string]any{
			"type": "object",
			"properties": map[string]any{
				"ref_type": map[string]any{"type": "string", "enum": []any{"artifact", "upload_file"}},
				"ref_id":   map[string]any{"type": "integer", "minimum": 1},
				"param_key": map[string]any{
					"type":        "string",
					"enum":        parameterKeys,
					"description": parameterDescription,
				},
			},
			"required":             []any{"ref_type", "ref_id", "param_key"},
			"additionalProperties": false,
		},
	}
	result["properties"] = properties
	return result
}

func ApplyMediaReferences(arguments map[string]any, params []energonservice.PowerParam, available []MediaReference) (map[string]any, []MediaReference, error) {
	selected, err := SelectedMediaReferences(arguments, available)
	if err != nil || len(selected) == 0 {
		return arguments, selected, err
	}
	result := cloneArguments(arguments)
	grouped := map[string][]MediaReference{}
	paramMap := map[string]energonservice.PowerParam{}
	for _, current := range selected {
		param, exists := mediaReferenceParam(params, current.Kind, current.ParameterKey)
		if !exists {
			return nil, nil, fmt.Errorf("当前能力参数 %s 不支持引用%s素材", current.ParameterKey, mediaReferenceKindLabel(current.Kind))
		}
		grouped[param.Key] = append(grouped[param.Key], current)
		paramMap[param.Key] = param
	}
	for key, references := range grouped {
		param := paramMap[key]
		if param.MaxFiles == 1 && len(references) > 1 {
			return nil, nil, fmt.Errorf("当前能力的%s参数一次只能使用一个素材，请明确选择", param.Name)
		}
		urls := make([]string, 0, len(references))
		for _, current := range references {
			if strings.TrimSpace(current.URL) != "" {
				urls = append(urls, strings.TrimSpace(current.URL))
			}
		}
		if len(urls) == 0 {
			continue
		}
		if param.MaxFiles == 1 || (!strings.EqualFold(param.Type, "files") && len(urls) == 1) {
			result[key] = urls[0]
		} else {
			result[key] = urls
		}
	}
	return result, selected, nil
}

func SelectedMediaReferences(arguments map[string]any, available []MediaReference) ([]MediaReference, error) {
	requested := mapListArgument(arguments[MediaReferencesArgument])
	if len(requested) == 0 {
		return nil, nil
	}
	if len(available) == 0 {
		return nil, fmt.Errorf("本轮没有可用的引用素材")
	}
	index := make(map[string]MediaReference, len(available))
	for _, current := range available {
		index[mediaReferenceKey(current.ReferenceType, current.ReferenceID)] = current
	}
	result := make([]MediaReference, 0, len(requested))
	seen := map[string]struct{}{}
	for _, item := range requested {
		refType := strings.ToLower(strings.TrimSpace(textValue(item["ref_type"])))
		refID := ArgumentUint64(item, "ref_id")
		key := mediaReferenceKey(refType, refID)
		current, exists := index[key]
		if !exists {
			return nil, fmt.Errorf("引用素材 %s 不在用户本轮选择范围内", key)
		}
		current.ParameterKey = strings.TrimSpace(textValue(item["param_key"]))
		if current.ParameterKey == "" {
			return nil, fmt.Errorf("引用素材 %s 缺少能力参数 param_key", key)
		}
		selectionKey := key + ":" + current.ParameterKey
		if _, duplicate := seen[selectionKey]; duplicate {
			continue
		}
		seen[selectionKey] = struct{}{}
		result = append(result, current)
	}
	return result, nil
}

func MediaReferencesDescription(references []MediaReference) string {
	if len(references) == 0 {
		return ""
	}
	rows := make([]string, 0, len(references))
	for _, current := range references {
		rows = append(rows, fmt.Sprintf("[%s:%d] %s（%s）", current.ReferenceType, current.ReferenceID, current.Label, current.Kind))
	}
	return "。本轮允许工具使用的素材：" + strings.Join(rows, "；") + "。标记为“当前系列主素材”的项，只在用户明确要求继续、修改或保持上一版一致时使用；用户显式引用的素材优先。"
}

func mediaReferenceParam(params []energonservice.PowerParam, kind string, key string) (energonservice.PowerParam, bool) {
	key = strings.TrimSpace(key)
	for _, param := range params {
		if strings.TrimSpace(param.Key) == key && mediaReferenceParamSupports(param, kind) {
			return param, true
		}
	}
	return energonservice.PowerParam{}, false
}

func mediaReferenceParams(params []energonservice.PowerParam, kind string) []energonservice.PowerParam {
	result := make([]energonservice.PowerParam, 0)
	for _, param := range params {
		if mediaReferenceParamSupports(param, kind) {
			result = append(result, param)
		}
	}
	return result
}

func mediaReferenceParamSupports(param energonservice.PowerParam, kind string) bool {
	ruleID := mediaReferenceRuleID(kind)
	return ruleID > 0 && param.UploadRuleID == ruleID
}

func mediaReferenceParameterOptions(params []energonservice.PowerParam, references []MediaReference) ([]any, string) {
	keys := make([]any, 0)
	labels := make([]string, 0)
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" || !mediaReferenceParameterAvailable(param, references) {
			continue
		}
		keys = append(keys, key)
		name := strings.TrimSpace(param.Name)
		if name == "" {
			name = key
		}
		labels = append(labels, key+"（"+name+"）")
	}
	return keys, "选择要接收该素材的能力参数。可选参数：" + strings.Join(labels, "、")
}

func mediaReferenceParameterAvailable(param energonservice.PowerParam, references []MediaReference) bool {
	for _, reference := range references {
		if mediaReferenceParamSupports(param, reference.Kind) {
			return true
		}
	}
	return false
}

func mediaReferenceRuleID(kind string) uint64 {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image":
		return 1
	case "video":
		return 2
	case "audio":
		return 3
	case "file":
		return 4
	default:
		return 0
	}
}

func mediaReferenceKindLabel(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image":
		return "图片"
	case "video":
		return "视频"
	case "audio":
		return "音频"
	default:
		return "文件"
	}
}

func mediaReferenceKey(refType string, refID uint64) string {
	return fmt.Sprintf("%s:%d", strings.ToLower(strings.TrimSpace(refType)), refID)
}

func cloneArguments(source map[string]any) map[string]any {
	result := make(map[string]any, len(source))
	for key, value := range source {
		result[key] = value
	}
	return result
}

func mapListArgument(value any) []map[string]any {
	items, ok := value.([]any)
	if !ok {
		if typed, currentOK := value.([]map[string]any); currentOK {
			return typed
		}
		return nil
	}
	result := make([]map[string]any, 0, len(items))
	for _, item := range items {
		if current, currentOK := item.(map[string]any); currentOK {
			result = append(result, current)
		}
	}
	return result
}

func textValue(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}
