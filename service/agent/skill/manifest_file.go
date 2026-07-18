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
	"capabilities",
	"config",
	"scripts",
	"source_refs",
	"mcp",
	"dependencies",
	"targets",
	"domains",
	"source",
}

func mergeManifestFile(directory string, manifest map[string]any) (map[string]any, []byte, error) {
	result := CloneMap(manifest)
	path, _, err := ResolveRelativePath(strings.TrimSpace(directory), manifestFile)
	if os.IsNotExist(err) {
		return result, nil, nil
	}
	if err != nil {
		return nil, nil, err
	}
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

// ResolveEntryManifest normalizes the persisted manifest. manifest.json is
// imported only during installation or publishing so runtime permissions have
// one authoritative database snapshot.
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
	entry.Manifest = JSONText(manifest)
	entry.Triggers = ManifestTriggers(entry.Manifest)
	entry.Domains = ManifestDomains(entry.Manifest)
	entry.Targets = ManifestTargets(entry.Manifest)
	return entry
}
