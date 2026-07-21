package provider

import (
	"fmt"
	"strings"
	"sync"

	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
)

const (
	MediaReferencesArgument   = "__runtime_references"
	MediaSeriesModeArgument   = "__runtime_series_mode"
	MediaSeriesModeContinue   = "continue"
	MediaSeriesModeNew        = "new"
	MaxRuntimeMediaReferences = 32
)

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
	ActiveSeries  bool
	SeriesProfile map[string]any
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
		if len(energoninput.MediaParamsForKind(params, current.Kind)) > 0 {
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
		"description": "本轮使用的素材及接收参数",
		"items": map[string]any{
			"type": "object",
			"properties": map[string]any{
				"ref_type": map[string]any{"type": "string", "enum": []any{"artifact", "upload_file", "asset"}},
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
	requested := mapListArgument(arguments[MediaReferencesArgument])
	selected, err := SelectedMediaReferences(arguments, available)
	if err != nil {
		return arguments, nil, err
	}
	strictUsage := len(requested) > 0
	if !strictUsage {
		selected = append([]MediaReference(nil), available...)
	}
	references := make([]energoninput.MediaReference, 0, len(selected))
	for _, current := range selected {
		references = append(references, energoninput.MediaReference{
			ReferenceType: current.ReferenceType,
			ReferenceID:   current.ReferenceID,
			Kind:          current.Kind,
			URL:           current.URL,
			Usage:         current.ParameterKey,
			StrictUsage:   strictUsage,
		})
	}
	bound, err := energoninput.BindMediaReferences(arguments, params, references)
	if err != nil {
		return nil, nil, err
	}
	boundReferences := boundMediaReferences(selected, bound.Bound)
	if !strictUsage && len(boundReferences) > 0 {
		arguments[MediaReferencesArgument] = mediaReferenceSelections(boundReferences)
	}
	return bound.Values, boundReferences, nil
}

func mediaReferenceSelections(references []MediaReference) []map[string]any {
	result := make([]map[string]any, 0, len(references))
	for _, current := range references {
		result = append(result, map[string]any{
			"ref_type":  current.ReferenceType,
			"ref_id":    current.ReferenceID,
			"param_key": current.ParameterKey,
		})
	}
	return result
}

func boundMediaReferences(selected []MediaReference, bindings []energoninput.MediaReferenceBinding) []MediaReference {
	result := make([]MediaReference, 0, len(bindings))
	used := map[string]struct{}{}
	for _, binding := range bindings {
		for _, current := range selected {
			if !sameInputMediaReference(current, binding.Reference) {
				continue
			}
			current.ParameterKey = binding.ParamKey
			key := mediaReferenceKey(current.ReferenceType, current.ReferenceID) + ":" + binding.ParamKey
			if _, exists := used[key]; exists {
				break
			}
			used[key] = struct{}{}
			result = append(result, current)
			break
		}
	}
	return result
}

func sameInputMediaReference(current MediaReference, reference energoninput.MediaReference) bool {
	return strings.EqualFold(strings.TrimSpace(current.ReferenceType), strings.TrimSpace(reference.ReferenceType)) &&
		current.ReferenceID == reference.ReferenceID &&
		strings.TrimSpace(current.URL) == strings.TrimSpace(reference.URL)
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

func ArtifactReferences(arguments map[string]any, available []MediaReference) ([]MediaReference, error) {
	selected, err := SelectedMediaReferences(arguments, available)
	if err != nil || mediaSeriesMode(arguments) != MediaSeriesModeContinue {
		return selected, err
	}
	current, exists := activeSeriesReference(available)
	if !exists {
		return nil, fmt.Errorf("当前会话没有可延续的图片系列")
	}
	result := []MediaReference{current}
	for _, reference := range selected {
		if sameMediaReference(reference, current) {
			continue
		}
		result = append(result, reference)
	}
	return result, nil
}

func activeSeriesReference(references []MediaReference) (MediaReference, bool) {
	for _, current := range references {
		if current.ActiveSeries && current.SeriesID > 0 && current.ArtifactID > 0 {
			return current, true
		}
	}
	return MediaReference{}, false
}

func mediaSeriesMode(arguments map[string]any) string {
	return strings.ToLower(strings.TrimSpace(textValue(arguments[MediaSeriesModeArgument])))
}

func sameMediaReference(left MediaReference, right MediaReference) bool {
	return strings.EqualFold(strings.TrimSpace(left.ReferenceType), strings.TrimSpace(right.ReferenceType)) &&
		left.ReferenceID > 0 && left.ReferenceID == right.ReferenceID
}

func MediaReferencesDescription(references []MediaReference) string {
	if len(references) == 0 {
		return ""
	}
	rows := make([]string, 0, len(references))
	for _, current := range references {
		rows = append(rows, fmt.Sprintf("[%s:%d] %s（%s）", current.ReferenceType, current.ReferenceID, current.Label, current.Kind))
	}
	return "。可用素材：" + strings.Join(rows, "；") + "。用户指定的素材优先；仅在用户要求延续或修改上一版时使用“当前系列主素材”。"
}

func mediaReferenceParams(params []energonservice.PowerParam, kind string) []energonservice.PowerParam {
	return energoninput.MediaParamsForKind(params, kind)
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
	return keys, "接收素材的参数：" + strings.Join(labels, "、")
}

func mediaReferenceParameterAvailable(param energonservice.PowerParam, references []MediaReference) bool {
	for _, reference := range references {
		if energoninput.MediaParamSupports(param, reference.Kind) {
			return true
		}
	}
	return false
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
