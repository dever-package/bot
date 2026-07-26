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
	StoryboardTransitionFade      = "fade"
	StoryboardTransitionCrossfade = "crossfade"
	StoryboardTransitionFadeBlack = "fadeblack"
	StoryboardTransitionFadeWhite = "fadewhite"
	StoryboardTransitionWipeLeft  = "wipeleft"
	StoryboardTransitionWipeRight = "wiperight"
)

var storyboardTransitionTypeValues = []string{
	StoryboardTransitionNone,
	StoryboardTransitionFade,
	StoryboardTransitionCrossfade,
	StoryboardTransitionFadeBlack,
	StoryboardTransitionFadeWhite,
	StoryboardTransitionWipeLeft,
	StoryboardTransitionWipeRight,
}

var storyboardTransitionTypes = map[string]struct{}{
	StoryboardTransitionNone:      {},
	StoryboardTransitionFade:      {},
	StoryboardTransitionCrossfade: {},
	StoryboardTransitionFadeBlack: {},
	StoryboardTransitionFadeWhite: {},
	StoryboardTransitionWipeLeft:  {},
	StoryboardTransitionWipeRight: {},
}

var storyboardTransitionTypeAliases = map[string]string{
	"cut":       StoryboardTransitionNone,
	"hardcut":   StoryboardTransitionNone,
	"directcut": StoryboardTransitionNone,
	"jumpcut":   StoryboardTransitionNone,
	"matchcut":  StoryboardTransitionNone,
	"硬切":        StoryboardTransitionNone,
	"直接切":       StoryboardTransitionNone,
	"直接切换":      StoryboardTransitionNone,
	"无转场":       StoryboardTransitionNone,

	"dissolve":      StoryboardTransitionCrossfade,
	"crossdissolve": StoryboardTransitionCrossfade,
	"交叉溶解":          StoryboardTransitionCrossfade,
	"交叉淡化":          StoryboardTransitionCrossfade,
	"叠化":            StoryboardTransitionCrossfade,

	"fadein":  StoryboardTransitionFade,
	"fadeout": StoryboardTransitionFade,
	"淡入":      StoryboardTransitionFade,
	"淡出":      StoryboardTransitionFade,
	"淡化":      StoryboardTransitionFade,

	"fadetoblack": StoryboardTransitionFadeBlack,
	"黑场":          StoryboardTransitionFadeBlack,
	"黑场淡化":        StoryboardTransitionFadeBlack,
	"淡出到黑":        StoryboardTransitionFadeBlack,

	"fadetowhite": StoryboardTransitionFadeWhite,
	"白场":          StoryboardTransitionFadeWhite,
	"白场淡化":        StoryboardTransitionFadeWhite,
	"淡出到白":        StoryboardTransitionFadeWhite,

	"leftwipe": StoryboardTransitionWipeLeft,
	"向左擦除":     StoryboardTransitionWipeLeft,
	"左擦除":      StoryboardTransitionWipeLeft,

	"rightwipe": StoryboardTransitionWipeRight,
	"向右擦除":      StoryboardTransitionWipeRight,
	"右擦除":       StoryboardTransitionWipeRight,
}

var storyboardTransitionTypeNormalizer = strings.NewReplacer(
	"_", "",
	"-", "",
	" ", "",
)

var storyboardStylizedVisualHints = []string{
	"stylized", "anime", "animation", "animated", "cartoon", "comic", "manga",
	"illustration", "illustrated", "watercolor", "pixel art", "clay", "stop motion",
	"风格化", "非写实", "动画", "动漫", "二次元", "卡通", "漫画", "插画", "绘本",
	"手绘", "水彩", "像素", "黏土", "定格", "国漫", "日漫",
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

func NormalizeOrInferStoryboardVisualMode(value string, hints ...string) string {
	normalized := NormalizeStoryboardVisualMode(value)
	if IsStoryboardVisualMode(normalized) {
		return normalized
	}
	content := strings.ToLower(strings.Join(hints, "\n"))
	for _, hint := range storyboardStylizedVisualHints {
		if strings.Contains(content, hint) {
			return StoryboardVisualModeStylized
		}
	}
	return StoryboardVisualModePhotoreal
}

func DefaultStoryboardStylePrompt(visualMode string, followsReference bool) string {
	if followsReference {
		if NormalizeStoryboardVisualMode(visualMode) == StoryboardVisualModeStylized {
			return "严格遵循视觉风格参考，统一角色造型、线条、色彩、光线与材质语言"
		}
		return "严格遵循视觉风格参考，保持真实自然的人物比例、光线、色彩与材质"
	}
	if NormalizeStoryboardVisualMode(visualMode) == StoryboardVisualModeStylized {
		return "统一的风格化影像，角色造型、线条、色彩、光线与材质语言保持一致"
	}
	return "统一的写实影像，人物比例、光线、色彩与材质保持真实自然"
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

func StoryboardTransitionTypeValues() []string {
	return append([]string(nil), storyboardTransitionTypeValues...)
}

func NormalizeStoryboardTransitionType(value string) string {
	normalized := strings.ToLower(strings.TrimSpace(value))
	normalized = storyboardTransitionTypeNormalizer.Replace(normalized)
	if normalized == "" {
		return StoryboardTransitionNone
	}
	if transitionType, ok := storyboardTransitionTypeAliases[normalized]; ok {
		return transitionType
	}
	return normalized
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
