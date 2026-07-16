package skill

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const manifestFile = "manifest.json"

var manifestFileFields = []string{
	"config",
	"scripts",
	"source_refs",
	"mcp",
	"dependencies",
	"targets",
	"domains",
	"builtin_methods",
	"source",
}

func mergeManifestFile(directory string, manifest map[string]any) (map[string]any, []byte, error) {
	result := CloneMap(manifest)
	path := filepath.Join(strings.TrimSpace(directory), manifestFile)
	raw, truncated, err := readLimitedFile(path, 64*1024)
	if os.IsNotExist(err) {
		return result, nil, nil
	}
	if err != nil {
		return nil, nil, err
	}
	if truncated {
		return nil, nil, fmt.Errorf("%s 超过 64KB 限制", manifestFile)
	}

	sidecar := map[string]any{}
	if err := json.Unmarshal(raw, &sidecar); err != nil {
		return nil, nil, fmt.Errorf("解析 %s 失败: %w", manifestFile, err)
	}
	for _, key := range manifestFileFields {
		if value, exists := sidecar[key]; exists {
			result[key] = value
		}
	}
	return result, raw, nil
}

// ResolveEntryManifest overlays the optional installed manifest file on the
// database snapshot. It is intentionally safe to call after metadata caching:
// installed skill files may change without changing the agent mount key.
func ResolveEntryManifest(entry Entry) Entry {
	manifest := ParseManifestMap(entry.Manifest)
	directory := strings.TrimSpace(entry.InstallPath)
	if directory == "" && strings.TrimSpace(entry.Key) != "" {
		candidate := filepath.Join(Root, NormalizeKey(entry.Key))
		if info, err := os.Stat(candidate); err == nil && info.IsDir() {
			directory = candidate
			entry.InstallPath = candidate
		}
	}
	if directory == "" {
		entry.Manifest = JSONText(manifest)
		return entry
	}
	merged, _, err := mergeManifestFile(directory, manifest)
	if err != nil {
		entry.Manifest = JSONText(manifest)
		return entry
	}
	entry.Manifest = JSONText(merged)
	entry.Triggers = ManifestTriggers(entry.Manifest)
	entry.Domains = ManifestDomains(entry.Manifest)
	entry.Targets = ManifestTargets(entry.Manifest)
	return entry
}
