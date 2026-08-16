package energon

// StoryboardStableMaterialIDs returns the character and scene IDs that must
// remain unchanged while a shot continues from the previous video's tail frame.
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
