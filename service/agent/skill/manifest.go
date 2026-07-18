package skill

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type ScriptSpec struct {
	Key       string
	Path      string
	TargetKey string
}

const (
	CapabilityFiles   = "files"
	CapabilityTemp    = "temp"
	CapabilityScript  = "script"
	CapabilityHTTP    = "http"
	CapabilityMCP     = "mcp"
	CapabilityNetwork = "network"
)

var capabilityOrder = []string{
	CapabilityFiles,
	CapabilityTemp,
	CapabilityScript,
	CapabilityHTTP,
	CapabilityMCP,
	CapabilityNetwork,
}

type CapabilitySet map[string]struct{}

func (set CapabilitySet) Has(capability string) bool {
	_, exists := set[strings.ToLower(strings.TrimSpace(capability))]
	return exists
}

func ManifestCapabilities(entry Entry) CapabilitySet {
	if entry.SourceType == agentmodel.SkillSourceTypeBuiltin {
		return CapabilitySet{}
	}
	payload, valid := parseCapabilityManifest(entry.Manifest)
	if !valid {
		return CapabilitySet{}
	}
	NormalizeManifestCapabilities(payload)
	return parseCapabilitySet(payload["capabilities"])
}

func parseCapabilityManifest(raw string) (map[string]any, bool) {
	payload := map[string]any{}
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return payload, true
	}
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return map[string]any{}, false
	}
	return payload, true
}

func NormalizeManifestCapabilities(manifest map[string]any) {
	if manifest == nil {
		return
	}
	raw, explicit := manifest["capabilities"]
	set := parseCapabilitySet(raw)
	if !explicit {
		set = CapabilitySet{CapabilityFiles: {}, CapabilityTemp: {}}
		if manifestValuePresent(manifest["scripts"]) {
			set[CapabilityScript] = struct{}{}
			set[CapabilityNetwork] = struct{}{}
		}
		if manifestValuePresent(manifest["mcp"]) {
			set[CapabilityMCP] = struct{}{}
			set[CapabilityNetwork] = struct{}{}
		}
	}
	values := make([]any, 0, len(set))
	for _, capability := range capabilityOrder {
		if set.Has(capability) {
			values = append(values, capability)
		}
	}
	manifest["capabilities"] = values
}

func parseCapabilitySet(value any) CapabilitySet {
	set := CapabilitySet{}
	appendValue := func(raw any) {
		name := strings.ToLower(strings.TrimSpace(fmt.Sprint(raw)))
		for _, allowed := range capabilityOrder {
			if name == allowed {
				set[name] = struct{}{}
				return
			}
		}
	}
	switch current := value.(type) {
	case []any:
		for _, item := range current {
			appendValue(item)
		}
	case []string:
		for _, item := range current {
			appendValue(item)
		}
	case string:
		for _, item := range strings.Split(current, ",") {
			appendValue(item)
		}
	}
	return set
}

func manifestValuePresent(value any) bool {
	switch current := value.(type) {
	case nil:
		return false
	case string:
		return strings.TrimSpace(current) != ""
	case []any:
		return len(current) > 0
	case map[string]any:
		return len(current) > 0
	default:
		return true
	}
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
		path := FirstText(FirstPresent(mapped, "path", "file"))
		if path == "" {
			continue
		}
		scripts = append(scripts, ScriptSpec{
			Key:       FirstText(FirstPresent(mapped, "key", "name")),
			Path:      strings.TrimPrefix(strings.TrimSpace(path), "/"),
			TargetKey: FirstText(FirstPresent(mapped, "target_key", "targetKey", "target")),
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
	rows := SkillConfigRowsForTarget(ctx, skillID, targetKey, true)
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
		key := ConfigEnvName(FirstText(mapped["key"]))
		if key == "" {
			continue
		}
		itemTarget := FirstText(FirstPresent(mapped, "target_key", "targetKey", "target"))
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
