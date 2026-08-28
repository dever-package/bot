package energon

import (
	"fmt"
	"strings"
)

const (
	StoryboardWorkTypeShort     = "short"
	StoryboardWorkTypeMV        = "mv"
	StoryboardWorkTypeAd        = "ad"
	StoryboardWorkTypeNarrative = "narrative"
)

type StoryboardWorkTypeSpec struct {
	Key                       string   `json:"key"`
	Name                      string   `json:"name"`
	Sort                      int      `json:"sort"`
	RequiredReferencePurposes []string `json:"required_reference_purposes"`
}

type StoryboardSoundPolicy struct {
	GeneratedSpeech   bool
	GeneratedCaptions bool
}

var storyboardWorkTypeSpecs = []StoryboardWorkTypeSpec{
	{Key: StoryboardWorkTypeShort, Name: "短片", Sort: 10},
	{
		Key:                       StoryboardWorkTypeMV,
		Name:                      "MV",
		Sort:                      20,
		RequiredReferencePurposes: []string{StoryboardReferencePurposeSoundtrack},
	},
	{Key: StoryboardWorkTypeAd, Name: "广告片", Sort: 30},
	{Key: StoryboardWorkTypeNarrative, Name: "剧情片", Sort: 40},
}

func StoryboardWorkTypeSpecs() []StoryboardWorkTypeSpec {
	result := make([]StoryboardWorkTypeSpec, 0, len(storyboardWorkTypeSpecs))
	for _, spec := range storyboardWorkTypeSpecs {
		result = append(result, cloneStoryboardWorkTypeSpec(spec))
	}
	return result
}

func FindStoryboardWorkTypeSpec(value string) (StoryboardWorkTypeSpec, bool) {
	key := strings.ToLower(strings.TrimSpace(value))
	for _, spec := range storyboardWorkTypeSpecs {
		if spec.Key == key {
			return cloneStoryboardWorkTypeSpec(spec), true
		}
	}
	return StoryboardWorkTypeSpec{}, false
}

func NormalizeStoryboardWorkType(value string) (string, error) {
	key := strings.ToLower(strings.TrimSpace(value))
	if key == "" {
		return StoryboardWorkTypeShort, nil
	}
	if _, exists := FindStoryboardWorkTypeSpec(key); !exists {
		return "", fmt.Errorf("作品类型无效")
	}
	return key, nil
}

func StoryboardSoundPolicyForWorkType(value string) StoryboardSoundPolicy {
	generated := !strings.EqualFold(strings.TrimSpace(value), StoryboardWorkTypeMV)
	return StoryboardSoundPolicy{
		GeneratedSpeech:   generated,
		GeneratedCaptions: generated,
	}
}

func cloneStoryboardWorkTypeSpec(spec StoryboardWorkTypeSpec) StoryboardWorkTypeSpec {
	next := spec
	next.RequiredReferencePurposes = cloneStoryboardStringValues(spec.RequiredReferencePurposes)
	return next
}
