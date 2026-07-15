package energon

import "strings"

const (
	OutputTypeGeneral    = "general"
	OutputTypeStoryboard = "storyboard"
)

type OutputTypeSpec struct {
	Key           string   `json:"key"`
	Name          string   `json:"name"`
	AllowedKinds  []string `json:"allowed_kinds"`
	ViewMode      string   `json:"view_mode"`
	DefaultWidth  int      `json:"default_width"`
	DefaultHeight int      `json:"default_height"`
	Structured    bool     `json:"structured"`
	Sort          int      `json:"sort"`
}

var outputTypeSpecs = []OutputTypeSpec{
	{
		Key:           OutputTypeGeneral,
		Name:          "通用",
		AllowedKinds:  []string{"text", "image", "video", "audio", "file", "role", "multi", "embeddings", "workflow"},
		ViewMode:      "content",
		DefaultWidth:  180,
		DefaultHeight: 180,
		Sort:          10,
	},
	{
		Key:           OutputTypeStoryboard,
		Name:          "分镜脚本",
		AllowedKinds:  []string{"text"},
		ViewMode:      "storyboard",
		DefaultWidth:  620,
		DefaultHeight: 360,
		Structured:    true,
		Sort:          20,
	},
}

func OutputTypeSpecs() []OutputTypeSpec {
	result := make([]OutputTypeSpec, 0, len(outputTypeSpecs))
	for _, spec := range outputTypeSpecs {
		result = append(result, cloneOutputTypeSpec(spec))
	}
	return result
}

func OutputTypeOptions() []map[string]any {
	options := make([]map[string]any, 0, len(outputTypeSpecs))
	for _, spec := range outputTypeSpecs {
		options = append(options, map[string]any{
			"id":             spec.Key,
			"value":          spec.Name,
			"allowed_kinds":  append([]string(nil), spec.AllowedKinds...),
			"view_mode":      spec.ViewMode,
			"default_width":  spec.DefaultWidth,
			"default_height": spec.DefaultHeight,
			"structured":     spec.Structured,
			"sort":           spec.Sort,
		})
	}
	return options
}

func FindOutputTypeSpec(value string) (OutputTypeSpec, bool) {
	key := strings.ToLower(strings.TrimSpace(value))
	for _, spec := range outputTypeSpecs {
		if spec.Key == key {
			return cloneOutputTypeSpec(spec), true
		}
	}
	return OutputTypeSpec{}, false
}

func NormalizeOutputType(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	if value == "" {
		return OutputTypeGeneral
	}
	return value
}

func NormalizePowerKind(kind string) string {
	return strings.ToLower(strings.TrimSpace(kind))
}

func IsOutputKindAllowed(outputType string, kind string) bool {
	spec, ok := FindOutputTypeSpec(outputType)
	if !ok {
		return false
	}
	kind = strings.ToLower(strings.TrimSpace(kind))
	for _, allowed := range spec.AllowedKinds {
		if allowed == kind {
			return true
		}
	}
	return false
}

func IsGeneralTextPower(power Power) bool {
	return NormalizePowerKind(power.Kind) == "text" &&
		NormalizeOutputType(power.OutputType) == OutputTypeGeneral
}

func IsStoryboardPower(power Power) bool {
	return NormalizeOutputType(power.OutputType) == OutputTypeStoryboard
}

func RequiresStructuredOutput(power Power) bool {
	spec, ok := FindOutputTypeSpec(NormalizeOutputType(power.OutputType))
	return ok && spec.Structured
}

func cloneOutputTypeSpec(spec OutputTypeSpec) OutputTypeSpec {
	next := spec
	next.AllowedKinds = append([]string(nil), spec.AllowedKinds...)
	return next
}
