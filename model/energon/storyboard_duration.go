package energon

import (
	"fmt"
	"strconv"
	"strings"
)

const (
	StoryboardMinShotDurationKey       = "min_shot_duration"
	StoryboardAbsoluteMinShotDuration  = 2
	StoryboardDefaultMinShotDuration   = 4
	StoryboardMaxGeneratedShotDuration = 5

	// StoryboardMinShotDuration is kept for existing document validators.
	StoryboardMinShotDuration = StoryboardAbsoluteMinShotDuration
)

type StoryboardShotDurationSpec struct {
	Seconds int    `json:"seconds"`
	Name    string `json:"name"`
	Sort    int    `json:"sort"`
}

var storyboardShotDurationSpecs = []StoryboardShotDurationSpec{
	{Seconds: 2, Name: "2秒", Sort: 10},
	{Seconds: 3, Name: "3秒", Sort: 20},
	{Seconds: 4, Name: "4秒", Sort: 30},
	{Seconds: 5, Name: "5秒", Sort: 40},
}

func StoryboardShotDurationSpecs() []StoryboardShotDurationSpec {
	return append([]StoryboardShotDurationSpec(nil), storyboardShotDurationSpecs...)
}

func NormalizeStoryboardMinShotDuration(value any) (int, error) {
	if value == nil {
		return StoryboardDefaultMinShotDuration, nil
	}
	raw := strings.TrimSpace(fmt.Sprint(value))
	if raw == "" {
		return StoryboardDefaultMinShotDuration, nil
	}
	seconds, err := strconv.Atoi(raw)
	if err != nil || seconds < StoryboardAbsoluteMinShotDuration || seconds > StoryboardMaxGeneratedShotDuration {
		return 0, fmt.Errorf("最短镜头时长必须是 %d 到 %d 秒", StoryboardAbsoluteMinShotDuration, StoryboardMaxGeneratedShotDuration)
	}
	return seconds, nil
}
