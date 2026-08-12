package protocol

import (
	"encoding/json"
	"regexp"
	"sort"
	"strings"
)

const maxLyricsNestingDepth = 16

var lyricPayloadKeys = []string{
	"lyrics",
	"lyric",
	"lrc",
	"song_lyrics",
	"songLyrics",
	"text",
	"content",
	"line",
	"lines",
	"segments",
	"words",
	"value",
}

var (
	taggedLyricsSectionPattern = regexp.MustCompile(`(?i)^\s*\[\s*(verse|pre[\s-]*chorus|chorus|bridge|hook|refrain|intro|outro|interlude|instrumental|solo|rap|主歌|前副歌|预副歌|副歌|桥段|桥接|引子|前奏|尾奏|尾声|间奏|器乐|独奏|说唱)(\s*\d+)?(\s*[:：-].*)?\s*\]\s*$`)
	bracketedTextPattern       = regexp.MustCompile(`^\s*\[[^\[\]\r\n]+\]\s*$`)
)

// ExtractLyrics prefers explicit lyric fields. As a legacy fallback, it also
// accepts ordinary text only when that text contains a labelled song section.
func ExtractLyrics(value any) string {
	blocks := make([]string, 0)
	collectExplicitLyrics(value, 0, &blocks)
	if len(blocks) > 0 {
		return strings.Join(blocks, "\n\n")
	}
	collectTaggedLyrics(value, 0, &blocks)
	return strings.Join(blocks, "\n\n")
}

func collectExplicitLyrics(value any, depth int, blocks *[]string) {
	if value == nil || depth > maxLyricsNestingDepth {
		return
	}
	switch current := value.(type) {
	case Output:
		collectExplicitLyrics(map[string]any(current), depth, blocks)
	case map[string]any:
		keys := sortedLyricsMapKeys(current)
		for _, key := range keys {
			item := current[key]
			if isExplicitLyricsKey(key) {
				appendUniqueLyricsBlock(blocks, normalizeLyricsValue(item, depth+1))
				continue
			}
			collectExplicitLyrics(item, depth+1, blocks)
		}
	case []any:
		for _, item := range current {
			collectExplicitLyrics(item, depth+1, blocks)
		}
	case []map[string]any:
		for _, item := range current {
			collectExplicitLyrics(item, depth+1, blocks)
		}
	case string:
		if decoded, ok := decodeLyricsJSON(current); ok {
			collectExplicitLyrics(decoded, depth+1, blocks)
		}
	}
}

func collectTaggedLyrics(value any, depth int, blocks *[]string) {
	if value == nil || depth > maxLyricsNestingDepth {
		return
	}
	switch current := value.(type) {
	case Output:
		collectTaggedLyrics(map[string]any(current), depth, blocks)
	case map[string]any:
		for _, key := range sortedLyricsMapKeys(current) {
			collectTaggedLyrics(current[key], depth+1, blocks)
		}
	case []any:
		for _, item := range current {
			collectTaggedLyrics(item, depth+1, blocks)
		}
	case []map[string]any:
		for _, item := range current {
			collectTaggedLyrics(item, depth+1, blocks)
		}
	case []string:
		for _, item := range current {
			collectTaggedLyrics(item, depth+1, blocks)
		}
	case string:
		if decoded, ok := decodeLyricsJSON(current); ok {
			collectTaggedLyrics(decoded, depth+1, blocks)
			return
		}
		appendUniqueLyricsBlock(blocks, taggedLyricsText(current))
	}
}

func taggedLyricsText(value string) string {
	lines := strings.Split(normalizeLyricsText(value), "\n")
	start := -1
	hasContent := false
	for index, line := range lines {
		line = strings.TrimSpace(line)
		if start < 0 {
			if taggedLyricsSectionPattern.MatchString(line) {
				start = index
			}
			continue
		}
		if line != "" && !bracketedTextPattern.MatchString(line) {
			hasContent = true
		}
	}
	if start < 0 || !hasContent {
		return ""
	}
	return strings.TrimSpace(strings.Join(lines[start:], "\n"))
}

func normalizeLyricsValues(values ...any) string {
	blocks := make([]string, 0, len(values))
	for _, value := range values {
		appendUniqueLyricsBlock(&blocks, normalizeLyricsValue(value, 0))
	}
	return strings.Join(blocks, "\n\n")
}

func normalizeLyricsValue(value any, depth int) string {
	if value == nil || depth > maxLyricsNestingDepth {
		return ""
	}
	switch current := value.(type) {
	case string:
		current = normalizeLyricsText(current)
		if decoded, ok := decodeLyricsJSON(current); ok {
			return normalizeLyricsValue(decoded, depth+1)
		}
		return current
	case []string:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			appendLyricsPart(&parts, normalizeLyricsValue(item, depth+1))
		}
		return strings.Join(parts, "\n")
	case []any:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			appendLyricsPart(&parts, normalizeLyricsValue(item, depth+1))
		}
		return strings.Join(parts, "\n")
	case []map[string]any:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			appendLyricsPart(&parts, normalizeLyricsValue(item, depth+1))
		}
		return strings.Join(parts, "\n")
	case Output:
		return normalizeLyricsValue(map[string]any(current), depth+1)
	case map[string]any:
		parts := make([]string, 0)
		for _, key := range lyricPayloadKeys {
			if item, exists := current[key]; exists {
				appendUniqueLyricsBlock(&parts, normalizeLyricsValue(item, depth+1))
			}
		}
		if len(parts) > 0 {
			return strings.Join(parts, "\n")
		}
		for _, key := range sortedLyricsMapKeys(current) {
			if isLyricsMetadataKey(key) {
				continue
			}
			appendLyricsPart(&parts, normalizeLyricsValue(current[key], depth+1))
		}
		return strings.Join(parts, "\n")
	default:
		return ""
	}
}

func appendOutputLyrics(output Output, values ...any) string {
	lyrics := normalizeLyricsValues(values...)
	if lyrics == "" {
		return ""
	}
	output["lyrics"] = normalizeLyricsValues(output["lyrics"], lyrics)
	return lyrics
}

func appendUniqueLyricsBlock(blocks *[]string, value string) {
	value = normalizeLyricsText(value)
	if value == "" {
		return
	}
	for _, current := range *blocks {
		if current == value {
			return
		}
	}
	*blocks = append(*blocks, value)
}

func appendLyricsPart(parts *[]string, value string) {
	value = normalizeLyricsText(value)
	if value != "" {
		*parts = append(*parts, value)
	}
}

func normalizeLyricsText(value string) string {
	value = strings.ReplaceAll(value, "\r\n", "\n")
	value = strings.ReplaceAll(value, "\r", "\n")
	return strings.TrimSpace(value)
}

func decodeLyricsJSON(value string) (any, bool) {
	value = strings.TrimSpace(value)
	if value == "" || (!strings.HasPrefix(value, "{") && !strings.HasPrefix(value, "[") && !strings.HasPrefix(value, `"`)) {
		return nil, false
	}
	var decoded any
	if err := json.Unmarshal([]byte(value), &decoded); err != nil {
		return nil, false
	}
	return decoded, true
}

func isExplicitLyricsKey(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "lyrics", "lyric", "lrc", "song_lyrics", "songlyrics":
		return true
	default:
		return false
	}
}

func isLyricsMetadataKey(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "id", "index", "title", "language", "lang", "start", "end", "start_time", "end_time", "timestamp", "time", "duration", "status", "code", "error", "message", "type", "kind", "event", "model":
		return true
	default:
		return false
	}
}

func sortedLyricsMapKeys(value map[string]any) []string {
	keys := make([]string, 0, len(value))
	for key := range value {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}
