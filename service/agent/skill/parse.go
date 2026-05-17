package skill

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func ParseFile(path string) (ParsedFile, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return ParsedFile{}, err
	}
	content := string(raw)
	metadata, body := SplitFrontMatter(content)
	entry := ParseMetadata(metadata)
	if entry.Key == "" {
		entry.Key = NormalizeKey(filepath.Base(filepath.Dir(path)))
	}
	if entry.Name == "" {
		entry.Name = entry.Key
	}
	hash := sha256.Sum256(raw)
	manifest := map[string]any{
		"key":         entry.Key,
		"name":        entry.Name,
		"description": entry.Description,
		"triggers":    entry.Triggers,
	}
	return ParsedFile{
		Key:         entry.Key,
		Name:        entry.Name,
		Description: entry.Description,
		Triggers:    entry.Triggers,
		Content:     strings.TrimSpace(body),
		Manifest:    manifest,
		Hash:        hex.EncodeToString(hash[:]),
	}, nil
}

func SplitFrontMatter(content string) (string, string) {
	trimmed := strings.TrimLeft(content, "\ufeff\r\n\t ")
	if !strings.HasPrefix(trimmed, "---") {
		return "", strings.TrimSpace(content)
	}
	rest := strings.TrimPrefix(trimmed, "---")
	rest = strings.TrimLeft(rest, "\r\n")
	marker := "\n---"
	index := strings.Index(rest, marker)
	if index < 0 {
		return "", strings.TrimSpace(content)
	}
	metadata := strings.TrimSpace(rest[:index])
	body := strings.TrimLeft(rest[index+len(marker):], "\r\n")
	return metadata, strings.TrimSpace(body)
}

func ParseMetadata(metadata string) Entry {
	entry := Entry{}
	currentKey := ""
	for _, rawLine := range strings.Split(metadata, "\n") {
		line := strings.TrimSpace(rawLine)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if strings.HasPrefix(line, "- ") && currentKey == "triggers" {
			entry.Triggers = append(entry.Triggers, trimYAMLValue(strings.TrimPrefix(line, "- ")))
			continue
		}
		key, value, ok := strings.Cut(line, ":")
		if !ok {
			continue
		}
		currentKey = strings.ToLower(strings.TrimSpace(key))
		value = trimYAMLValue(value)
		switch currentKey {
		case "key":
			entry.Key = NormalizeKey(value)
		case "name":
			entry.Name = value
		case "description":
			entry.Description = value
		case "triggers":
			entry.Triggers = append(entry.Triggers, splitTriggerList(value)...)
		}
	}
	return entry
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
	raw, ok := payload["triggers"].([]any)
	if !ok {
		return nil
	}
	triggers := make([]string, 0, len(raw))
	for _, item := range raw {
		if text := strings.TrimSpace(fmt.Sprint(item)); text != "" {
			triggers = append(triggers, text)
		}
	}
	return triggers
}

func trimYAMLValue(value string) string {
	value = strings.TrimSpace(value)
	value = strings.Trim(value, `"'`)
	return strings.TrimSpace(value)
}

func splitTriggerList(value string) []string {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil
	}
	value = strings.TrimPrefix(strings.TrimSuffix(value, "]"), "[")
	parts := strings.FieldsFunc(value, func(char rune) bool {
		return char == ',' || char == '，' || char == '、'
	})
	triggers := make([]string, 0, len(parts))
	for _, part := range parts {
		if trigger := trimYAMLValue(part); trigger != "" {
			triggers = append(triggers, trigger)
		}
	}
	return triggers
}
