package action

import (
	botprotocol "my/package/bot/service/energon/protocol"
)

var agentArtifactKeys = []string{"images", "videos", "audios", "files"}

type ArtifactAccumulator struct {
	values map[string][]string
}

func NewArtifactAccumulator() ArtifactAccumulator {
	return ArtifactAccumulator{values: map[string][]string{}}
}

func (a *ArtifactAccumulator) Add(output map[string]any) {
	if len(output) == 0 {
		return
	}
	for _, key := range agentArtifactKeys {
		values := botprotocol.NormalizeStringList(output[key])
		if len(values) == 0 {
			continue
		}
		a.values[key] = appendUniqueStrings(a.values[key], values...)
	}
}

func (a ArtifactAccumulator) MergeInto(output map[string]any) map[string]any {
	next := cloneMap(output)
	for _, key := range agentArtifactKeys {
		if len(botprotocol.NormalizeStringList(next[key])) > 0 {
			continue
		}
		if values := a.values[key]; len(values) > 0 {
			next[key] = append([]string{}, values...)
		}
	}
	return next
}

func (a ArtifactAccumulator) HasAny() bool {
	for _, key := range agentArtifactKeys {
		if len(a.values[key]) > 0 {
			return true
		}
	}
	return false
}

func appendUniqueStrings(base []string, values ...string) []string {
	seen := make(map[string]struct{}, len(base)+len(values))
	result := make([]string, 0, len(base)+len(values))
	for _, value := range base {
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	for _, value := range values {
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
