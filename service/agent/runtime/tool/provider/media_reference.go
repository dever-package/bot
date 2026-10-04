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
	promptExpansionHeading    = "本次扩写要求（仅用于细化上述提示词，不得替换其主题）："
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
	Historical    bool
	SeriesProfile map[string]any
}

type MediaToolInputError struct {
	cause error
}

func (err *MediaToolInputError) Error() string {
	return err.cause.Error()
}

func (err *MediaToolInputError) Unwrap() error {
	return err.cause
}

type ReferenceScope struct {
	keys        map[string]struct{}
	promptTexts []string
}

func ReferenceScopeFromInput(input map[string]any) ReferenceScope {
	scope := ReferenceScope{keys: map[string]struct{}{}}
	seenPrompts := map[string]struct{}{}
	for _, reference := range mapListArgument(input["references"]) {
		referenceType := strings.ToLower(strings.TrimSpace(textValue(reference["ref_type"])))
		referenceID := ArgumentUint64(reference, "ref_id")
		if referenceType != "" && referenceID > 0 {
			scope.keys[mediaReferenceKey(referenceType, referenceID)] = struct{}{}
		}
		prompt := strings.TrimSpace(textValue(reference["prompt"]))
		if prompt == "" {
			continue
		}
		if _, exists := seenPrompts[prompt]; exists {
			continue
		}
		seenPrompts[prompt] = struct{}{}
		scope.promptTexts = append(scope.promptTexts, prompt)
	}
	return scope
}

// ApplyPromptReferences keeps user-selected prompt materials as the primary
// prompt while allowing the model to add concrete generation requirements.
func ApplyPromptReferences(arguments map[string]any, promptKey string, scope ReferenceScope) map[string]any {
	promptKey = strings.TrimSpace(promptKey)
	if promptKey == "" || len(scope.promptTexts) == 0 {
		return arguments
	}
	primaryPrompt := strings.Join(scope.promptTexts, "\n\n")
	expansion := strings.TrimSpace(textValue(arguments[promptKey]))
	composed := primaryPrompt
	if expansion != "" && expansion != primaryPrompt {
		composed += "\n\n" + promptExpansionHeading + "\n" + expansion
	}
	if strings.TrimSpace(textValue(arguments[promptKey])) == composed {
		return arguments
	}
	result := cloneArguments(arguments)
	result[promptKey] = composed
	return result
}

// NormalizeMediaReferenceSelections removes context-only references from media
// arguments while leaving unknown identities intact for the permission check.
func NormalizeMediaReferenceSelections(
	arguments map[string]any,
	resolvedMedia []MediaReference,
	scope ReferenceScope,
) map[string]any {
	requested := mapListArgument(arguments[MediaReferencesArgument])
	if len(requested) == 0 || len(scope.keys) == 0 {
		return arguments
	}
	mediaKeys := make(map[string]struct{}, len(resolvedMedia))
	for _, reference := range resolvedMedia {
		mediaKeys[mediaReferenceKey(reference.ReferenceType, reference.ReferenceID)] = struct{}{}
	}
	filtered := make([]map[string]any, 0, len(requested))
	removed := false
	for _, reference := range requested {
		key := mediaReferenceKey(
			textValue(reference["ref_type"]),
			ArgumentUint64(reference, "ref_id"),
		)
		_, hasResolvedMedia := mediaKeys[key]
		_, selectedByUser := scope.keys[key]
		if selectedByUser && !hasResolvedMedia {
			removed = true
			continue
		}
		filtered = append(filtered, reference)
	}
	if !removed {
		return arguments
	}
	result := cloneArguments(arguments)
	if len(filtered) == 0 {
		delete(result, MediaReferencesArgument)
	} else {
		result[MediaReferencesArgument] = filtered
	}
	return result
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
		seen[mediaReferenceItemKey(current)] = struct{}{}
	}
	for _, current := range references {
		if len(store.items) >= MaxRuntimeMediaReferences {
			break
		}
		key := mediaReferenceItemKey(current)
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
			StrictUsage:   strictUsage || current.ParameterKey != "",
		})
	}
	bound, err := energoninput.BindMediaReferences(arguments, params, references)
	if err != nil {
		return nil, nil, err
	}
	boundReferences := boundMediaReferences(selected, bound.Bound)
	bound.Values[MediaReferencesArgument] = mediaReferenceSelections(boundReferences)
	return bound.Values, boundReferences, nil
}

func mediaReferenceSelections(references []MediaReference) []map[string]any {
	result := make([]map[string]any, 0, len(references))
	seen := make(map[string]struct{}, len(references))
	for _, current := range references {
		key := mediaReferenceKey(current.ReferenceType, current.ReferenceID) + ":" + strings.TrimSpace(current.ParameterKey)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
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
			key := mediaReferenceItemKey(current) + ":" + binding.ParamKey
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
		return nil, &MediaToolInputError{cause: fmt.Errorf("本轮没有可用的引用素材，请重新添加所需素材")}
	}
	index := make(map[string][]MediaReference, len(available))
	for _, current := range available {
		key := mediaReferenceKey(current.ReferenceType, current.ReferenceID)
		index[key] = append(index[key], current)
	}
	result := make([]MediaReference, 0, len(requested))
	seen := map[string]struct{}{}
	for _, item := range requested {
		refType := strings.ToLower(strings.TrimSpace(textValue(item["ref_type"])))
		refID := ArgumentUint64(item, "ref_id")
		key := mediaReferenceKey(refType, refID)
		matches, exists := index[key]
		if !exists {
			return nil, &MediaToolInputError{cause: fmt.Errorf("当前引用素材已不可用，请重新添加所需素材")}
		}
		parameterKey := strings.TrimSpace(textValue(item["param_key"]))
		if parameterKey == "" {
			return nil, &MediaToolInputError{cause: fmt.Errorf("引用素材未指定用途，请在工具表单中重新添加素材")}
		}
		for _, current := range matches {
			current.ParameterKey = parameterKey
			selectionKey := mediaReferenceItemKey(current) + ":" + parameterKey
			if _, duplicate := seen[selectionKey]; duplicate {
				continue
			}
			seen[selectionKey] = struct{}{}
			result = append(result, current)
		}
	}
	return result, nil
}

func ArtifactReferences(arguments map[string]any) ([]MediaReference, error) {
	return preparedMediaReferences(arguments)
}

func uniqueLogicalMediaReferences(references []MediaReference) []MediaReference {
	result := make([]MediaReference, 0, len(references))
	seen := make(map[string]struct{}, len(references))
	for _, current := range references {
		key := mediaReferenceKey(current.ReferenceType, current.ReferenceID)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, current)
	}
	return result
}

func activeSeriesReference(references []MediaReference) (MediaReference, bool) {
	for index := len(references) - 1; index >= 0; index-- {
		current := references[index]
		if current.ActiveSeries && current.SeriesID > 0 && current.ArtifactID > 0 {
			return current, true
		}
	}
	return MediaReference{}, false
}

func mediaSeriesMode(arguments map[string]any) string {
	return strings.ToLower(strings.TrimSpace(textValue(arguments[MediaSeriesModeArgument])))
}

func mediaReferenceParams(params []energonservice.PowerParam, kind string) []energonservice.PowerParam {
	return energoninput.MediaParamsForKind(params, kind)
}

func mediaReferenceKey(refType string, refID uint64) string {
	return fmt.Sprintf("%s:%d", strings.ToLower(strings.TrimSpace(refType)), refID)
}

func mediaReferenceItemKey(reference MediaReference) string {
	return mediaReferenceKey(reference.ReferenceType, reference.ReferenceID) + ":" + strings.TrimSpace(reference.URL)
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
