package provider

import (
	"fmt"
	"strings"
	"sync"

	energonservice "github.com/dever-package/bot/service/energon"
)

const mediaReferencesArgument = "references"
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
	Role          string
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
		if _, exists := mediaReferenceParam(params, current.Kind, ""); exists {
			result = append(result, current)
		}
	}
	return result
}

func MediaReferencesParameters(parameters map[string]any, references []MediaReference) map[string]any {
	if len(references) == 0 {
		return parameters
	}
	result := clonePowerParameters(parameters)
	properties, _ := result["properties"].(map[string]any)
	properties[mediaReferencesArgument] = map[string]any{
		"type":        "array",
		"description": "当前运行允许使用的素材。仅可填写工具说明中列出的 ref_type 和 ref_id；需要使用素材时必须传入，禁止猜测其他ID。",
		"items": map[string]any{
			"type": "object",
			"properties": map[string]any{
				"ref_type": map[string]any{"type": "string", "enum": []any{"artifact", "upload_file"}},
				"ref_id":   map[string]any{"type": "integer", "minimum": 1},
				"role": map[string]any{
					"type":        "string",
					"enum":        []any{"reference", "subject", "style", "first_frame", "last_frame"},
					"description": "素材用途。能力有多个同类型素材参数时必须填写，例如首帧用 first_frame、尾帧用 last_frame。",
				},
			},
			"required":             []any{"ref_type", "ref_id"},
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
		param, exists := mediaReferenceParam(params, current.Kind, current.Role)
		if !exists {
			if current.Role != "" {
				return nil, nil, fmt.Errorf("当前能力没有与用途 %s 匹配的%s参数", current.Role, mediaReferenceKindLabel(current.Kind))
			}
			return nil, nil, fmt.Errorf("当前能力不支持引用%s素材", mediaReferenceKindLabel(current.Kind))
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
	requested := mapListArgument(arguments[mediaReferencesArgument])
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
		current.Role = normalizeMediaReferenceRole(textValue(item["role"]))
		selectionKey := key + ":" + current.Role
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

func mediaReferenceParam(params []energonservice.PowerParam, kind string, role string) (energonservice.PowerParam, bool) {
	ruleID := mediaReferenceRuleID(kind)
	aliases := mediaReferenceRoleAliases(role)
	if len(aliases) > 0 {
		for _, param := range params {
			if ruleID > 0 && param.UploadRuleID != ruleID {
				continue
			}
			name := strings.ToLower(strings.TrimSpace(param.Name + " " + param.Key))
			if containsAny(name, aliases) {
				return param, true
			}
		}
	}
	if normalizeMediaReferenceRole(role) == "first_frame" || normalizeMediaReferenceRole(role) == "last_frame" {
		candidates := mediaReferenceParamsByRule(params, ruleID)
		if len(candidates) == 1 {
			return candidates[0], true
		}
		return energonservice.PowerParam{}, false
	}
	for _, param := range params {
		if ruleID > 0 && param.UploadRuleID == ruleID {
			return param, true
		}
	}
	for _, param := range params {
		name := strings.ToLower(strings.TrimSpace(param.Name + " " + param.Key))
		if strings.Contains(name, mediaReferenceKindLabel(kind)) || strings.Contains(name, englishMediaKind(kind)) {
			return param, true
		}
	}
	return energonservice.PowerParam{}, false
}

func mediaReferenceParamsByRule(params []energonservice.PowerParam, ruleID uint64) []energonservice.PowerParam {
	if ruleID == 0 {
		return nil
	}
	result := make([]energonservice.PowerParam, 0)
	for _, param := range params {
		if param.UploadRuleID == ruleID {
			result = append(result, param)
		}
	}
	return result
}

func normalizeMediaReferenceRole(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "reference", "subject", "style", "first_frame", "last_frame":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return ""
	}
}

func mediaReferenceRoleAliases(role string) []string {
	switch normalizeMediaReferenceRole(role) {
	case "first_frame":
		return []string{"first_frame", "firstframe", "first", "start", "首帧", "起始"}
	case "last_frame":
		return []string{"last_frame", "lastframe", "last", "end", "尾帧", "结束"}
	case "subject":
		return []string{"subject", "character", "主体", "人物", "角色"}
	case "style":
		return []string{"style", "风格"}
	case "reference":
		return []string{"reference", "refer", "参考"}
	default:
		return nil
	}
}

func containsAny(value string, aliases []string) bool {
	for _, alias := range aliases {
		if strings.Contains(value, alias) {
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

func englishMediaKind(kind string) string {
	value := strings.ToLower(strings.TrimSpace(kind))
	if value == "file" {
		return "upload"
	}
	return value
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
