package skill

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
)

type ScriptSpec struct {
	Key       string
	Path      string
	TargetKey string
}

func ManifestDomains(manifest string) []string {
	return manifestStringSlice(manifest, "domains")
}

func ManifestTargets(manifest string) []string {
	return manifestStringSlice(manifest, "targets")
}

func ManifestScripts(manifest string) []ScriptSpec {
	payload := ParseManifestMap(manifest)
	raw, ok := payload["scripts"].([]any)
	if !ok {
		return nil
	}
	scripts := make([]ScriptSpec, 0, len(raw))
	for _, item := range raw {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		path := strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "path", "file")))
		if path == "" || path == "<nil>" {
			continue
		}
		scripts = append(scripts, ScriptSpec{
			Key:       strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "key", "name"))),
			Path:      strings.TrimPrefix(strings.TrimSpace(path), "/"),
			TargetKey: strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "target_key", "targetKey", "target"))),
		})
	}
	return scripts
}

func MissingRequiredConfig(ctx context.Context, skillID uint64, manifest string, targetKey string) []string {
	payload := ParseManifestMap(manifest)
	raw, ok := payload["config"].([]any)
	if !ok || len(raw) == 0 {
		return nil
	}
	rows := SkillConfigRows(ctx, skillID, true)
	configured := map[string]struct{}{}
	for _, row := range rows {
		if row == nil || strings.TrimSpace(row.ValueEncrypted) == "" {
			continue
		}
		if key := ConfigEnvName(row.Key); key != "" {
			configured[key] = struct{}{}
		}
	}
	missing := make([]string, 0)
	for _, item := range raw {
		mapped, ok := item.(map[string]any)
		if !ok || !Truthy(mapped["required"]) {
			continue
		}
		key := ConfigEnvName(fmt.Sprint(mapped["key"]))
		if key == "" {
			continue
		}
		itemTarget := strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "target_key", "targetKey", "target")))
		if !manifestTargetMatches(itemTarget, targetKey) {
			continue
		}
		if _, exists := configured[key]; exists {
			continue
		}
		missing = append(missing, key)
	}
	return missing
}

func ParseManifestMap(raw string) map[string]any {
	result := map[string]any{}
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return result
	}
	_ = json.Unmarshal([]byte(raw), &result)
	return result
}

func manifestStringSlice(manifest string, key string) []string {
	payload := ParseManifestMap(manifest)
	raw, ok := payload[key].([]any)
	if !ok {
		return nil
	}
	result := make([]string, 0, len(raw))
	for _, item := range raw {
		if text := strings.TrimSpace(fmt.Sprint(item)); text != "" && text != "<nil>" {
			result = append(result, text)
		}
	}
	return result
}

func manifestTargetMatches(rowTarget string, requestTarget string) bool {
	rowTarget = strings.TrimSpace(rowTarget)
	requestTarget = strings.TrimSpace(requestTarget)
	return rowTarget == "" || (requestTarget != "" && rowTarget == requestTarget)
}

func configKey(targetKey string, key string) string {
	return strings.TrimSpace(targetKey) + "\x00" + ConfigEnvName(key)
}
