package energon

import (
	"math"
	"strings"
	"unicode"
)

const (
	OutputTypeGeneral        = "general"
	OutputTypeStoryboard     = "storyboard"
	OutputTypeStoryboardGrid = "storyboard_grid"
	OutputTypeSpeech         = "speech"
	OutputTypeLipSync        = "lip_sync"
	OutputTypeVideoCompose   = "video_compose"
)

const (
	StoryboardGridMinImages           = 2
	StoryboardGridMaxImages           = 50
	StoryboardShotFramePairImages     = 2
	StoryboardShotReferencesMinImages = 1
	StoryboardShotReferencesMaxImages = 4
)

const (
	StoryboardVersion             = 9
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
	StoryboardShotImageFirstFrame = "first_frame"
	StoryboardShotImageLastFrame  = "last_frame"
	StoryboardShotImageFirstLast  = "first_last"
	StoryboardShotImageReferences = "references"
	StoryboardShotImageNone       = "none"
)

var storyboardShotImageModeValues = []string{
	StoryboardShotImageFirstFrame,
	StoryboardShotImageLastFrame,
	StoryboardShotImageFirstLast,
	StoryboardShotImageReferences,
	StoryboardShotImageNone,
}

var storyboardShotImageModes = map[string]struct{}{
	StoryboardShotImageFirstFrame: {},
	StoryboardShotImageLastFrame:  {},
	StoryboardShotImageFirstLast:  {},
	StoryboardShotImageReferences: {},
	StoryboardShotImageNone:       {},
}

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
		Key:           OutputTypeStoryboardGrid,
		Name:          "宫格",
		AllowedKinds:  []string{"image"},
		ViewMode:      "storyboard_grid",
		DefaultWidth:  520,
		DefaultHeight: 420,
		Sort:          25,
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

func StoryboardShotImageModeValues() []string {
	return append([]string(nil), storyboardShotImageModeValues...)
}

func NormalizeStoryboardShotImageMode(value string) string {
	mode := strings.ToLower(strings.TrimSpace(value))
	if _, ok := storyboardShotImageModes[mode]; !ok {
		return StoryboardShotImageFirstFrame
	}
	return mode
}

func NormalizeStoryboardShotImageModeForShot(value string, matchesPrevious bool, continuesPrevious bool) string {
	mode := NormalizeStoryboardShotImageMode(value)
	if continuesPrevious && mode == StoryboardShotImageFirstLast {
		return StoryboardShotImageLastFrame
	}
	if mode == StoryboardShotImageLastFrame && !continuesPrevious {
		return StoryboardShotImageFirstFrame
	}
	if continuesPrevious && (mode == StoryboardShotImageReferences || mode == StoryboardShotImageNone) {
		return StoryboardShotImageFirstFrame
	}
	if matchesPrevious && mode == StoryboardShotImageNone {
		return StoryboardShotImageFirstFrame
	}
	return mode
}

type StoryboardShotImageModeContext struct {
	Mode              string
	MatchesPrevious   bool
	ContinuesPrevious bool
	EntryState        string
	ExitState         string
	StartFraming      string
	EndFraming        string
	CameraInstruction string
}

func NormalizeStoryboardShotImageModesForSequence(contexts []StoryboardShotImageModeContext) []string {
	modes := make([]string, len(contexts))
	for index, context := range contexts {
		modes[index] = NormalizeStoryboardShotImageModeForShot(
			context.Mode,
			context.MatchesPrevious,
			context.ContinuesPrevious,
		)
		if !StoryboardShotHasVisibleEndChange(context) &&
			(modes[index] == StoryboardShotImageFirstLast || modes[index] == StoryboardShotImageLastFrame) {
			modes[index] = StoryboardShotImageFirstFrame
		}
	}
	for index := len(contexts) - 1; index > 0; index-- {
		context := contexts[index]
		requiresPreviousEndFrame := context.MatchesPrevious ||
			(context.ContinuesPrevious && modes[index] == StoryboardShotImageLastFrame)
		if !requiresPreviousEndFrame {
			continue
		}
		ensureStoryboardPreviousContinuityFrame(contexts, modes, index-1)
	}
	return modes
}

func StoryboardShotHasVisibleEndChange(context StoryboardShotImageModeContext) bool {
	entryState := strings.TrimSpace(context.EntryState)
	exitState := strings.TrimSpace(context.ExitState)
	startFraming := strings.TrimSpace(context.StartFraming)
	endFraming := strings.TrimSpace(context.EndFraming)
	return (entryState != "" && exitState != "" && entryState != exitState) ||
		(startFraming != "" && endFraming != "" && startFraming != endFraming) ||
		storyboardCameraInstructionChangesFrame(context.CameraInstruction)
}

func ensureStoryboardPreviousContinuityFrame(
	contexts []StoryboardShotImageModeContext,
	modes []string,
	startIndex int,
) {
	for index := startIndex; index >= 0; index-- {
		if storyboardShotImageModeHasEndFrame(modes[index]) {
			return
		}
		context := contexts[index]
		hasVisibleEndChange := StoryboardShotHasVisibleEndChange(context)
		if modes[index] == StoryboardShotImageFirstFrame && !context.ContinuesPrevious && !hasVisibleEndChange {
			return
		}
		if context.ContinuesPrevious && !hasVisibleEndChange {
			continue
		}
		if hasVisibleEndChange {
			if context.ContinuesPrevious {
				modes[index] = StoryboardShotImageLastFrame
			} else {
				modes[index] = StoryboardShotImageFirstLast
			}
			return
		}
		modes[index] = StoryboardShotImageFirstFrame
		return
	}
}

func storyboardShotImageModeHasEndFrame(mode string) bool {
	return mode == StoryboardShotImageLastFrame || mode == StoryboardShotImageFirstLast
}

func storyboardCameraInstructionChangesFrame(value string) bool {
	normalized := strings.ToLower(strings.Join(strings.Fields(value), ""))
	for _, marker := range []string{
		"推近", "推进", "推远", "拉近", "拉远", "横移", "纵移", "平移",
		"跟拍", "跟随", "摇镜", "摇摄", "环绕", "变焦", "升起", "上升",
		"下降", "上移", "下移", "旋转", "甩镜", "手持晃动", "向前移动", "向后移动",
		"dolly", "pushin", "pullout", "pan", "tilt", "zoom", "tracking", "orbit", "crane",
	} {
		if strings.Contains(normalized, marker) {
			return true
		}
	}
	return false
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

func IsGeneralImagePower(power Power) bool {
	return NormalizePowerKind(power.Kind) == "image" &&
		NormalizeOutputType(power.OutputType) == OutputTypeGeneral
}

func IsStoryboardPower(power Power) bool {
	return NormalizeOutputType(power.OutputType) == OutputTypeStoryboard
}

func IsVideoComposePower(power Power) bool {
	return NormalizePowerKind(power.Kind) == "video" &&
		NormalizeOutputType(power.OutputType) == OutputTypeVideoCompose
}

func IsStoryboardGridPower(power Power) bool {
	return NormalizePowerKind(power.Kind) == "image" &&
		NormalizeOutputType(power.OutputType) == OutputTypeStoryboardGrid
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
