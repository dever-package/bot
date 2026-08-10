package energon

import (
	"fmt"
	"strings"
)

const (
	StoryboardReferenceMediaImage = "image"
	StoryboardReferenceMediaVideo = "video"
	StoryboardReferenceMediaAudio = "audio"
)

const (
	StoryboardReferenceScopeGlobal      = "global"
	StoryboardReferenceScopeMaterial    = "material"
	StoryboardReferenceScopeShot        = "shot"
	StoryboardReferenceScopeComposition = "composition"
	StoryboardReferenceScopeContext     = "context"
)

const (
	StoryboardReferencePurposeVisualStyle = "visual_style"
	StoryboardReferencePurposeMotionStyle = "motion_style"
	StoryboardReferencePurposeCharacter   = "character"
	StoryboardReferencePurposeScene       = "scene"
	StoryboardReferencePurposeProp        = "prop"
	StoryboardReferencePurposeShot        = "shot"
	StoryboardReferencePurposeSoundtrack  = "soundtrack"
	StoryboardReferencePurposePerformance = "performance"
	StoryboardReferencePurposeProduct     = "product"
	StoryboardReferencePurposeBrandStyle  = "brand_style"
	StoryboardReferencePurposeBrandLogo   = "brand_logo"
)

type StoryboardReferencePurposeSpec struct {
	Key               string   `json:"key"`
	Name              string   `json:"name"`
	MediaKinds        []string `json:"media_kinds"`
	WorkTypes         []string `json:"work_types"`
	Scope             string   `json:"scope"`
	MaterialType      string   `json:"material_type"`
	DefaultMediaKinds []string `json:"default_media_kinds"`
	MaxCount          int      `json:"max_count"`
	Sort              int      `json:"sort"`
}

var storyboardReferencePurposeSpecs = []StoryboardReferencePurposeSpec{
	{
		Key:               StoryboardReferencePurposeVisualStyle,
		Name:              "视觉风格",
		MediaKinds:        []string{StoryboardReferenceMediaImage, StoryboardReferenceMediaVideo},
		Scope:             StoryboardReferenceScopeGlobal,
		DefaultMediaKinds: []string{StoryboardReferenceMediaImage},
		Sort:              10,
	},
	{
		Key:               StoryboardReferencePurposeMotionStyle,
		Name:              "动态风格",
		MediaKinds:        []string{StoryboardReferenceMediaVideo},
		Scope:             StoryboardReferenceScopeGlobal,
		DefaultMediaKinds: []string{StoryboardReferenceMediaVideo},
		Sort:              20,
	},
	{
		Key:          StoryboardReferencePurposeCharacter,
		Name:         "角色参考",
		MediaKinds:   []string{StoryboardReferenceMediaImage},
		Scope:        StoryboardReferenceScopeMaterial,
		MaterialType: StoryboardReferencePurposeCharacter,
		Sort:         30,
	},
	{
		Key:          StoryboardReferencePurposeScene,
		Name:         "场景参考",
		MediaKinds:   []string{StoryboardReferenceMediaImage},
		Scope:        StoryboardReferenceScopeMaterial,
		MaterialType: StoryboardReferencePurposeScene,
		Sort:         40,
	},
	{
		Key:          StoryboardReferencePurposeProp,
		Name:         "道具参考",
		MediaKinds:   []string{StoryboardReferenceMediaImage},
		Scope:        StoryboardReferenceScopeMaterial,
		MaterialType: StoryboardReferencePurposeProp,
		Sort:         50,
	},
	{
		Key:        StoryboardReferencePurposeShot,
		Name:       "镜头参考",
		MediaKinds: []string{StoryboardReferenceMediaImage, StoryboardReferenceMediaVideo},
		Scope:      StoryboardReferenceScopeShot,
		Sort:       60,
	},
	{
		Key:               StoryboardReferencePurposeSoundtrack,
		Name:              "主音轨",
		MediaKinds:        []string{StoryboardReferenceMediaAudio},
		Scope:             StoryboardReferenceScopeComposition,
		DefaultMediaKinds: []string{StoryboardReferenceMediaAudio},
		MaxCount:          1,
		Sort:              70,
	},
	{
		Key:        StoryboardReferencePurposePerformance,
		Name:       "表演参考",
		MediaKinds: []string{StoryboardReferenceMediaVideo},
		WorkTypes:  []string{StoryboardWorkTypeMV},
		Scope:      StoryboardReferenceScopeGlobal,
		Sort:       80,
	},
	{
		Key:          StoryboardReferencePurposeProduct,
		Name:         "商品参考",
		MediaKinds:   []string{StoryboardReferenceMediaImage},
		WorkTypes:    []string{StoryboardWorkTypeAd},
		Scope:        StoryboardReferenceScopeMaterial,
		MaterialType: StoryboardReferencePurposeProp,
		Sort:         90,
	},
	{
		Key:        StoryboardReferencePurposeBrandStyle,
		Name:       "品牌风格",
		MediaKinds: []string{StoryboardReferenceMediaImage, StoryboardReferenceMediaVideo},
		WorkTypes:  []string{StoryboardWorkTypeAd},
		Scope:      StoryboardReferenceScopeGlobal,
		Sort:       100,
	},
	{
		Key:        StoryboardReferencePurposeBrandLogo,
		Name:       "品牌 Logo",
		MediaKinds: []string{StoryboardReferenceMediaImage},
		WorkTypes:  []string{StoryboardWorkTypeAd},
		Scope:      StoryboardReferenceScopeContext,
		MaxCount:   1,
		Sort:       110,
	},
}

func StoryboardReferencePurposeSpecs() []StoryboardReferencePurposeSpec {
	result := make([]StoryboardReferencePurposeSpec, 0, len(storyboardReferencePurposeSpecs))
	for _, spec := range storyboardReferencePurposeSpecs {
		result = append(result, cloneStoryboardReferencePurposeSpec(spec))
	}
	return result
}

func FindStoryboardReferencePurposeSpec(value string) (StoryboardReferencePurposeSpec, bool) {
	key := strings.ToLower(strings.TrimSpace(value))
	for _, spec := range storyboardReferencePurposeSpecs {
		if spec.Key == key {
			return cloneStoryboardReferencePurposeSpec(spec), true
		}
	}
	return StoryboardReferencePurposeSpec{}, false
}

func ValidateStoryboardReferencePurpose(workType string, mediaKind string, purpose string) error {
	normalizedWorkType, err := NormalizeStoryboardWorkType(workType)
	if err != nil {
		return err
	}
	spec, exists := FindStoryboardReferencePurposeSpec(purpose)
	if !exists {
		return fmt.Errorf("参考素材用途无效")
	}
	if !containsStoryboardReferenceValue(spec.MediaKinds, mediaKind) {
		return fmt.Errorf("参考素材类型不支持用途“%s”", spec.Name)
	}
	if len(spec.WorkTypes) > 0 && !containsStoryboardReferenceValue(spec.WorkTypes, normalizedWorkType) {
		return fmt.Errorf("当前作品类型不支持用途“%s”", spec.Name)
	}
	return nil
}

func DefaultStoryboardReferencePurpose(workType string, mediaKind string) string {
	normalizedWorkType, err := NormalizeStoryboardWorkType(workType)
	if err != nil {
		return ""
	}
	for _, spec := range storyboardReferencePurposeSpecs {
		if !containsStoryboardReferenceValue(spec.DefaultMediaKinds, mediaKind) {
			continue
		}
		if len(spec.WorkTypes) == 0 || containsStoryboardReferenceValue(spec.WorkTypes, normalizedWorkType) {
			return spec.Key
		}
	}
	return ""
}

func cloneStoryboardReferencePurposeSpec(spec StoryboardReferencePurposeSpec) StoryboardReferencePurposeSpec {
	next := spec
	next.MediaKinds = cloneStoryboardStringValues(spec.MediaKinds)
	next.WorkTypes = cloneStoryboardStringValues(spec.WorkTypes)
	next.DefaultMediaKinds = cloneStoryboardStringValues(spec.DefaultMediaKinds)
	return next
}

func cloneStoryboardStringValues(values []string) []string {
	return append([]string{}, values...)
}

func containsStoryboardReferenceValue(values []string, value string) bool {
	value = strings.ToLower(strings.TrimSpace(value))
	for _, candidate := range values {
		if candidate == value {
			return true
		}
	}
	return false
}
