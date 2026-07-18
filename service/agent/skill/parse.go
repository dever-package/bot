package skill

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

func ParseFile(path string) (ParsedFile, error) {
	maxBytes := DefaultLimits().SkillFileMaxBytes
	raw, truncated, err := readLimitedFile(path, maxBytes)
	if err != nil {
		return ParsedFile{}, err
	}
	if truncated {
		return ParsedFile{}, fmt.Errorf("%s 超过 %d 字节限制", EntryFile, maxBytes)
	}
	content := string(raw)
	metadata, body := SplitFrontMatter(content)
	entry, err := parseMetadata(metadata)
	if err != nil {
		return ParsedFile{}, fmt.Errorf("解析 SKILL.md frontmatter 失败: %w", err)
	}
	if entry.Key == "" {
		entry.Key = NormalizeKey(entry.Name)
	}
	if entry.Key == "" {
		entry.Key = NormalizeKey(filepath.Base(filepath.Dir(path)))
	}
	if entry.Name == "" {
		entry.Name = entry.Key
	}
	manifest := map[string]any{
		"key":         entry.Key,
		"name":        entry.Name,
		"description": entry.Description,
		"triggers":    entry.Triggers,
	}
	manifest, manifestRaw, err := mergeManifestFile(filepath.Dir(path), manifest)
	if err != nil {
		return ParsedFile{}, err
	}
	// SKILL.md owns identity fields; manifest.json only declares runtime capabilities.
	manifest["key"] = entry.Key
	manifest["name"] = entry.Name
	manifest["description"] = entry.Description
	manifest["triggers"] = entry.Triggers
	hasher := sha256.New()
	_, _ = hasher.Write(raw)
	_, _ = hasher.Write(manifestRaw)
	return ParsedFile{
		Key:         entry.Key,
		Name:        entry.Name,
		Description: entry.Description,
		Triggers:    entry.Triggers,
		Content:     strings.TrimSpace(body),
		Manifest:    manifest,
		Hash:        hex.EncodeToString(hasher.Sum(nil)),
	}, nil
}

func SplitFrontMatter(content string) (string, string) {
	trimmed := strings.TrimLeft(content, "\ufeff\r\n\t ")
	normalized := strings.ReplaceAll(trimmed, "\r\n", "\n")
	lines := strings.Split(normalized, "\n")
	if len(lines) == 0 || strings.TrimSpace(lines[0]) != "---" {
		return "", strings.TrimSpace(content)
	}
	for index := 1; index < len(lines); index++ {
		marker := strings.TrimSpace(lines[index])
		if marker != "---" && marker != "..." {
			continue
		}
		metadata := strings.TrimSpace(strings.Join(lines[1:index], "\n"))
		body := strings.TrimSpace(strings.Join(lines[index+1:], "\n"))
		return metadata, body
	}
	return "", strings.TrimSpace(content)
}

func ParseMetadata(metadata string) Entry {
	entry, _ := parseMetadata(metadata)
	return entry
}

func parseMetadata(metadata string) (Entry, error) {
	entry := Entry{}
	metadata = strings.TrimSpace(metadata)
	if metadata == "" {
		return entry, nil
	}
	payload := map[string]any{}
	if err := yaml.Unmarshal([]byte(metadata), &payload); err != nil {
		return entry, err
	}
	entry.Key = NormalizeKey(metadataText(payload["key"]))
	entry.Name = metadataText(payload["name"])
	entry.Description = metadataText(payload["description"])
	entry.Triggers = metadataStringList(payload["triggers"])
	return entry, nil
}

func ManifestTriggers(manifest string) []string {
	manifest = strings.TrimSpace(manifest)
	if manifest == "" {
		return nil
	}
	payload := map[string]any{}
	if err := json.Unmarshal([]byte(manifest), &payload); err != nil {
		return nil
	}
	return metadataStringList(payload["triggers"])
}

func metadataText(value any) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprint(value))
}

func metadataStringList(value any) []string {
	result := make([]string, 0)
	appendText := func(item any) {
		if text := metadataText(item); text != "" {
			result = append(result, text)
		}
	}
	switch current := value.(type) {
	case []any:
		for _, item := range current {
			appendText(item)
		}
	case []string:
		for _, item := range current {
			appendText(item)
		}
	case string:
		for _, item := range strings.FieldsFunc(current, func(char rune) bool {
			return char == ',' || char == '，' || char == '、'
		}) {
			appendText(item)
		}
	}
	return result
}
