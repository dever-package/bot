package energon

import (
	"fmt"
	"strings"
)

// Storyboard continuity decides how consecutive shots of one storyboard join.
// Relay keeps a scene in one unbroken take: every later shot starts from the
// previous video's real last frame. Free leaves cut decisions to the script.
const (
	StoryboardContinuityInputKey = "storyboard_continuity"
	StoryboardContinuityRelay    = "relay"
	StoryboardContinuityFree     = "free"

	StoryboardRelaySceneTransition           = StoryboardTransitionCrossfade
	StoryboardRelaySceneTransitionDurationMS = 500
)

func NormalizeStoryboardContinuity(value string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", StoryboardContinuityRelay:
		return StoryboardContinuityRelay, nil
	case StoryboardContinuityFree:
		return StoryboardContinuityFree, nil
	default:
		return "", fmt.Errorf("镜头衔接方式无效")
	}
}

// StoryboardRelayContinues reports whether a relay shot can start from the
// previous shot's last frame: it stays in the same scene and shows no character
// that was absent from that frame. Characters may leave the frame.
func StoryboardRelayContinues(previous map[string]struct{}, current map[string]struct{}, materialTypes map[string]string) bool {
	sameScene := false
	for id := range current {
		_, shared := previous[id]
		switch materialTypes[id] {
		case "scene":
			if !shared {
				return false
			}
			sameScene = true
		case "character":
			if !shared {
				return false
			}
		}
	}
	return sameScene
}

// StoryboardStableMaterialIDs returns the character and scene IDs used to
// validate continuity from the previous video's tail frame.
func StoryboardStableMaterialIDs(
	materialIDs map[string]struct{},
	materialTypes map[string]string,
) map[string]struct{} {
	result := make(map[string]struct{}, len(materialIDs))
	for id := range materialIDs {
		if materialTypes[id] == "character" || materialTypes[id] == "scene" {
			result[id] = struct{}{}
		}
	}
	return result
}

// SameStoryboardMaterialIDSet reports whether two material ID sets are equal.
func SameStoryboardMaterialIDSet(left map[string]struct{}, right map[string]struct{}) bool {
	if len(left) != len(right) {
		return false
	}
	for id := range left {
		if _, exists := right[id]; !exists {
			return false
		}
	}
	return true
}
