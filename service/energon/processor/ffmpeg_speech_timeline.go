package processor

import (
	"fmt"
	"sort"
)

type ffmpegSpeechInterval struct {
	ID        string
	StartTime float64
	Duration  float64
}

func validateFFmpegSpeechIntervals(label string, intervals []ffmpegSpeechInterval) error {
	ordered := append([]ffmpegSpeechInterval(nil), intervals...)
	sort.SliceStable(ordered, func(left, right int) bool {
		return ordered[left].StartTime < ordered[right].StartTime
	})
	for index := 1; index < len(ordered); index++ {
		previous := ordered[index-1]
		current := ordered[index]
		if current.StartTime < previous.StartTime+previous.Duration-0.01 {
			return fmt.Errorf(
				"%s语音“%s”与“%s”时间重叠",
				label,
				previous.ID,
				current.ID,
			)
		}
	}
	return nil
}
