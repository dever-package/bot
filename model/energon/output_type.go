package energon

import (
	"math"
	"strings"
	"unicode"
)

const (
	OutputTypeGeneral      = "general"
	OutputTypeStoryboard   = "storyboard"
	OutputTypeSpeech       = "speech"
	OutputTypeLipSync      = "lip_sync"
	OutputTypeVideoCompose = "video_compose"
)

const (
	StoryboardVersion             = 8
	StoryboardMinShotDuration     = 4
	StoryboardMaxShots            = 50
	StoryboardVisualModePhotoreal = "photoreal"
	StoryboardVisualModeStylized  = "stylized"
	StoryboardTransitionNone      = "none"
)

var storyboardTransitionTypes = map[string]struct{}{
	StoryboardTransitionNone: {},
	"fade":                   {},
	"crossfade":              {},
	"fadeblack":              {},
	"fadewhite":              {},
	"wipeleft":               {},
	"wiperight":              {},
}

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
	{
		Key:           OutputTypeSpeech,
		Name:          "语音合成",
		AllowedKinds:  []string{"audio"},
		ViewMode:      "content",
		DefaultWidth:  420,
		DefaultHeight: 300,
		Sort:          30,
	},
	{
		Key:           OutputTypeLipSync,
		Name:          "口型同步",
		AllowedKinds:  []string{"video"},
		ViewMode:      "content",
		DefaultWidth:  520,
		DefaultHeight: 360,
		Sort:          40,
	},
	{
		Key:           OutputTypeVideoCompose,
		Name:          "视频合成",
		AllowedKinds:  []string{"video"},
		ViewMode:      "video_compose",
		DefaultWidth:  680,
		DefaultHeight: 440,
		Sort:          50,
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

func NormalizeStoryboardVisualMode(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func IsStoryboardVisualMode(value string) bool {
	switch NormalizeStoryboardVisualMode(value) {
	case StoryboardVisualModePhotoreal, StoryboardVisualModeStylized:
		return true
	default:
		return false
	}
}

func StoryboardSummaryFromStoryline(setup string, development string, payoff string) string {
	parts := make([]string, 0, 3)
	seen := make(map[string]struct{}, 3)
	for _, value := range []string{setup, development, payoff} {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		parts = append(parts, value)
	}
	return strings.Join(parts, "；")
}

func IsStoryboardShotDurationValid(value float64) bool {
	return !math.IsNaN(value) &&
		!math.IsInf(value, 0) &&
		value >= StoryboardMinShotDuration &&
		math.Trunc(value) == value
}

func NormalizeStoryboardTransitionType(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	if value == "" {
		return StoryboardTransitionNone
	}
	return value
}

func IsStoryboardTransitionType(value string) bool {
	_, ok := storyboardTransitionTypes[NormalizeStoryboardTransitionType(value)]
	return ok
}

func EstimateStoryboardSpeechDuration(text string) float64 {
	characters := 0
	for _, character := range text {
		if !unicode.IsSpace(character) {
			characters++
		}
	}
	return math.Max(0.6, float64(characters)/3.5)
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

func IsVideoComposePower(power Power) bool {
	return NormalizePowerKind(power.Kind) == "video" &&
		NormalizeOutputType(power.OutputType) == OutputTypeVideoCompose
}

func IsSpeechPower(power Power) bool {
	return NormalizePowerKind(power.Kind) == "audio" &&
		NormalizeOutputType(power.OutputType) == OutputTypeSpeech
}

func IsLipSyncPower(power Power) bool {
	return NormalizePowerKind(power.Kind) == "video" &&
		NormalizeOutputType(power.OutputType) == OutputTypeLipSync
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
