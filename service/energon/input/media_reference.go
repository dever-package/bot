package input

import (
	"fmt"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type MediaReference struct {
	ReferenceType string
	ReferenceID   uint64
	Label         string
	Kind          string
	URL           string
	Usage         string
	StrictUsage   bool
	Required      bool
}

type MediaReferenceBinding struct {
	Reference MediaReference
	ParamKey  string
}

type MediaReferenceBindResult struct {
	Values  map[string]any
	Bound   []MediaReferenceBinding
	Unbound []MediaReference
}

func MediaReferenceFromContent(
	referenceType string,
	referenceID uint64,
	kind string,
	content any,
	usage string,
) (MediaReference, bool) {
	references := MediaReferencesFromContent(referenceType, referenceID, kind, content, usage)
	if len(references) == 0 {
		return MediaReference{}, false
	}
	return references[0], true
}

// MediaReferencesFromContent resolves every media URL stored by one logical
// reference. The URL order is preserved so configured media parameters can
// apply their own cardinality and ordering rules.
func MediaReferencesFromContent(
	referenceType string,
	referenceID uint64,
	kind string,
	content any,
	usage string,
) []MediaReference {
	kind = normalizeMediaKind(kind)
	media := botprotocol.ExtractMediaOutput(content, kind)
	urls := botprotocol.NormalizeMediaList(media[kind+"s"], kind)
	if referenceID == 0 || kind == "" || len(urls) == 0 {
		return nil
	}
	referenceType = strings.TrimSpace(referenceType)
	usage = strings.TrimSpace(usage)
	result := make([]MediaReference, 0, len(urls))
	for _, url := range urls {
		result = append(result, MediaReference{
			ReferenceType: referenceType,
			ReferenceID:   referenceID,
			Kind:          kind,
			URL:           url,
			Usage:         usage,
			StrictUsage:   usage != "",
		})
	}
	return result
}

// BindMediaReferences projects resolved media URLs into configured capability
// parameters. It never infers provider-native fields; service mappings retain
// ownership of the final request body.
func BindMediaReferences(
	values map[string]any,
	params []PowerParam,
	references []MediaReference,
) (MediaReferenceBindResult, error) {
	result := MediaReferenceBindResult{
		Values:  cloneMediaReferenceValues(values),
		Bound:   make([]MediaReferenceBinding, 0, len(references)),
		Unbound: make([]MediaReference, 0),
	}
	if len(references) == 0 {
		return result, nil
	}

	paramByKey := make(map[string]PowerParam, len(params))
	for _, param := range params {
		if key := normalizeMediaParamKey(param.Key); key != "" {
			paramByKey[key] = param
		}
	}

	for _, reference := range references {
		reference.Kind = normalizeMediaKind(reference.Kind)
		reference.URL = strings.TrimSpace(reference.URL)
		reference.Usage = strings.TrimSpace(reference.Usage)
		if reference.Kind == "" || reference.URL == "" {
			if reference.Required {
				return MediaReferenceBindResult{}, fmt.Errorf("必需的媒体引用无效")
			}
			result.Unbound = append(result.Unbound, reference)
			continue
		}

		param, explicit, matched := mediaReferenceTarget(paramByKey, params, reference)
		if !matched {
			if reference.StrictUsage {
				return MediaReferenceBindResult{}, fmt.Errorf(
					"当前能力参数 %s 不支持引用%s素材",
					reference.Usage,
					mediaKindLabel(reference.Kind),
				)
			}
			if reference.Required {
				candidates := MediaParamsForKind(params, reference.Kind)
				if len(candidates) > 1 {
					return MediaReferenceBindResult{}, fmt.Errorf(
						"%s素材未指定用途，请选择对应的能力参数",
						mediaKindLabel(reference.Kind),
					)
				}
				return MediaReferenceBindResult{}, fmt.Errorf(
					"当前能力未配置可接收%s素材的参数",
					mediaKindLabel(reference.Kind),
				)
			}
			result.Unbound = append(result.Unbound, reference)
			continue
		}

		key := strings.TrimSpace(param.Key)
		current := uniqueMediaURLs(StringList(result.Values[key]))
		if containsMediaURL(current, reference.URL) {
			result.Bound = append(result.Bound, MediaReferenceBinding{
				Reference: reference,
				ParamKey:  key,
			})
			continue
		}
		if capacity := mediaParamCapacity(param); capacity > 0 && len(current) >= capacity {
			// One asset may contain multiple media files. Once that logical
			// reference has been bound, optional extra files may remain prompt
			// context. Required references must never be silently discarded.
			if !reference.Required && mediaReferenceAlreadyBound(result.Bound, reference, key) {
				result.Unbound = append(result.Unbound, reference)
				continue
			}
			if explicit || reference.StrictUsage || reference.Required {
				return MediaReferenceBindResult{}, fmt.Errorf(
					"当前能力的%s参数一次最多使用 %d 个素材",
					mediaParamLabel(param),
					capacity,
				)
			}
			result.Unbound = append(result.Unbound, reference)
			continue
		}

		current = append(current, reference.URL)
		if mediaParamCapacity(param) == 1 {
			result.Values[key] = current[0]
		} else {
			result.Values[key] = current
		}
		result.Bound = append(result.Bound, MediaReferenceBinding{
			Reference: reference,
			ParamKey:  key,
		})
	}
	return result, nil
}

func MediaParamSupports(param PowerParam, kind string) bool {
	if !IsFileParamType(param.Type) {
		return false
	}
	kind = normalizeMediaKind(kind)
	for _, accepted := range param.AcceptedKinds {
		if normalizeMediaKind(accepted) == kind {
			return true
		}
	}
	return false
}

func MediaParamsForKind(params []PowerParam, kind string) []PowerParam {
	result := make([]PowerParam, 0)
	for _, param := range params {
		if MediaParamSupports(param, kind) {
			result = append(result, param)
		}
	}
	return result
}

func mediaReferenceTarget(
	paramByKey map[string]PowerParam,
	params []PowerParam,
	reference MediaReference,
) (PowerParam, bool, bool) {
	if reference.Usage != "" {
		if param, exists := paramByKey[normalizeMediaParamKey(reference.Usage)]; exists &&
			MediaParamSupports(param, reference.Kind) {
			return param, true, true
		}
		if reference.StrictUsage {
			return PowerParam{}, true, false
		}
	}
	candidates := MediaParamsForKind(params, reference.Kind)
	if len(candidates) == 1 {
		return candidates[0], false, true
	}
	return PowerParam{}, false, false
}

func normalizeMediaUsageRole(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	return strings.NewReplacer("_", "", "-", "", " ", "").Replace(value)
}

func mediaParamCapacity(param PowerParam) int {
	if NormalizeParamControlType(param.Type) != "files" {
		return 1
	}
	if param.MaxFiles > 0 {
		return param.MaxFiles
	}
	return 0
}

func normalizeMediaParamKey(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func normalizeMediaKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "image", "video", "audio", "file":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return ""
	}
}

func mediaKindLabel(kind string) string {
	switch normalizeMediaKind(kind) {
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

func mediaParamLabel(param PowerParam) string {
	if name := strings.TrimSpace(param.Name); name != "" {
		return name
	}
	return strings.TrimSpace(param.Key)
}

func cloneMediaReferenceValues(values map[string]any) map[string]any {
	result := make(map[string]any, len(values)+4)
	for key, value := range values {
		result[key] = value
	}
	return result
}

func uniqueMediaURLs(values []string) []string {
	result := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func containsMediaURL(values []string, target string) bool {
	target = strings.TrimSpace(target)
	for _, value := range values {
		if strings.TrimSpace(value) == target {
			return true
		}
	}
	return false
}

func mediaReferenceAlreadyBound(
	bindings []MediaReferenceBinding,
	reference MediaReference,
	paramKey string,
) bool {
	if reference.ReferenceID == 0 {
		return false
	}
	for _, binding := range bindings {
		if binding.ParamKey == paramKey &&
			binding.Reference.ReferenceID == reference.ReferenceID &&
			binding.Reference.ReferenceType == reference.ReferenceType {
			return true
		}
	}
	return false
}
