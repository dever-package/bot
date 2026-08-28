package energon

import (
	"fmt"
	"strconv"
	"strings"
)

const (
	StoryboardRangeStartMSKey         = "storyboard_range_start_ms"
	StoryboardRangeEndMSKey           = "storyboard_range_end_ms"
	StoryboardSoundtrackDurationMSKey = "storyboard_soundtrack_duration_ms"
	StoryboardTimelineDurationMSKey   = "timeline_duration_ms"
)

type StoryboardTimelineRange struct {
	StartMS              int64
	EndMS                int64
	SoundtrackDurationMS int64
}

func NormalizeStoryboardTimelineInput(input map[string]any) (StoryboardTimelineRange, bool, error) {
	if input == nil {
		return StoryboardTimelineRange{}, false, nil
	}
	durationValue := input[StoryboardSoundtrackDurationMSKey]
	if durationValue == nil || strings.TrimSpace(fmt.Sprint(durationValue)) == "" {
		return StoryboardTimelineRange{}, false, nil
	}
	durationMS, err := storyboardTimelineMillis(durationValue, 0)
	if err != nil {
		return StoryboardTimelineRange{}, true, fmt.Errorf("主音轨时长必须是整数毫秒")
	}
	timeline, err := NormalizeStoryboardTimelineRange(
		durationMS,
		input[StoryboardRangeStartMSKey],
		input[StoryboardRangeEndMSKey],
	)
	return timeline, true, err
}

func NormalizeStoryboardTimelineRange(
	soundtrackDurationMS int64,
	startValue any,
	endValue any,
) (StoryboardTimelineRange, error) {
	if soundtrackDurationMS <= 0 {
		return StoryboardTimelineRange{}, fmt.Errorf("主音轨时长无效")
	}
	startMS, err := storyboardTimelineMillis(startValue, 0)
	if err != nil || startMS < 0 {
		return StoryboardTimelineRange{}, fmt.Errorf("制作范围开始时间必须是不小于 0 的整数毫秒")
	}
	endMS, err := storyboardTimelineMillis(endValue, soundtrackDurationMS)
	if err != nil || endMS <= 0 {
		return StoryboardTimelineRange{}, fmt.Errorf("制作范围结束时间必须是大于 0 的整数毫秒")
	}
	if startMS >= endMS {
		return StoryboardTimelineRange{}, fmt.Errorf("制作范围结束时间必须晚于开始时间")
	}
	if endMS > soundtrackDurationMS {
		return StoryboardTimelineRange{}, fmt.Errorf(
			"制作范围结束时间不能超过主音轨时长 %.3f 秒",
			float64(soundtrackDurationMS)/1000,
		)
	}
	return StoryboardTimelineRange{
		StartMS:              startMS,
		EndMS:                endMS,
		SoundtrackDurationMS: soundtrackDurationMS,
	}, nil
}

func (timeline StoryboardTimelineRange) DurationMS() int64 {
	return timeline.EndMS - timeline.StartMS
}

func (timeline StoryboardTimelineRange) TargetDurationSeconds() int {
	durationMS := timeline.DurationMS()
	if durationMS <= 0 {
		return 0
	}
	return int((durationMS + 999) / 1000)
}

func StoryboardShotCountRange(targetDuration, minShotDuration, maxShotDuration int) (int, int, error) {
	if targetDuration <= 0 {
		return 0, 0, fmt.Errorf("分镜目标时长必须大于 0 秒")
	}
	if minShotDuration <= 0 || maxShotDuration < minShotDuration {
		return 0, 0, fmt.Errorf("分镜单镜时长范围无效")
	}
	minShots := (targetDuration + maxShotDuration - 1) / maxShotDuration
	maxShots := targetDuration / minShotDuration
	if maxShots > StoryboardMaxShots {
		maxShots = StoryboardMaxShots
	}
	if minShots < 1 || minShots > StoryboardMaxShots || minShots > maxShots {
		return 0, 0, fmt.Errorf(
			"%d 秒无法由 %d 到 %d 秒的镜头在最多 %d 镜内完整覆盖",
			targetDuration,
			minShotDuration,
			maxShotDuration,
			StoryboardMaxShots,
		)
	}
	return minShots, maxShots, nil
}

func RebalanceStoryboardShotDurations(
	durations []int,
	targetDuration int,
	minShotDuration int,
	maxShotDuration int,
) ([]int, error) {
	if len(durations) == 0 {
		return nil, fmt.Errorf("分镜至少需要一个镜头")
	}
	minimumTotal := len(durations) * minShotDuration
	maximumTotal := len(durations) * maxShotDuration
	if targetDuration < minimumTotal || targetDuration > maximumTotal {
		return nil, fmt.Errorf(
			"%d 个镜头无法在 %d 到 %d 秒范围内覆盖 %d 秒",
			len(durations),
			minShotDuration,
			maxShotDuration,
			targetDuration,
		)
	}

	result := append([]int(nil), durations...)
	total := 0
	for index, duration := range result {
		if duration < minShotDuration || duration > maxShotDuration {
			return nil, fmt.Errorf("镜头 %d 时长超出 %d 到 %d 秒范围", index+1, minShotDuration, maxShotDuration)
		}
		total += duration
	}
	for total < targetDuration {
		changed := false
		for index := range result {
			if total == targetDuration {
				break
			}
			if result[index] >= maxShotDuration {
				continue
			}
			result[index]++
			total++
			changed = true
		}
		if !changed {
			return nil, fmt.Errorf("分镜时长无法补足到 %d 秒", targetDuration)
		}
	}
	for total > targetDuration {
		changed := false
		for index := len(result) - 1; index >= 0; index-- {
			if total == targetDuration {
				break
			}
			if result[index] <= minShotDuration {
				continue
			}
			result[index]--
			total--
			changed = true
		}
		if !changed {
			return nil, fmt.Errorf("分镜时长无法缩短到 %d 秒", targetDuration)
		}
	}
	return result, nil
}

func storyboardTimelineMillis(value any, defaultValue int64) (int64, error) {
	if value == nil {
		return defaultValue, nil
	}
	raw := strings.TrimSpace(fmt.Sprint(value))
	if raw == "" {
		return defaultValue, nil
	}
	return strconv.ParseInt(raw, 10, 64)
}
