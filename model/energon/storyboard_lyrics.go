package energon

import (
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"unicode"
)

const (
	StoryboardLyricsInputKey             = "storyboard_lyrics"
	storyboardLyricsFullTrackToleranceMS = 999
)

var (
	storyboardLyricTimestampPattern = regexp.MustCompile(`^\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]\s*`)
	storyboardLyricSectionPattern   = regexp.MustCompile(`(?i)^\s*\[\s*(verse|pre[\s-]*chorus|chorus|bridge|hook|refrain|intro|outro|interlude|instrumental|solo|rap|主歌|前副歌|预副歌|副歌|桥段|桥接|引子|前奏|尾奏|尾声|间奏|器乐|独奏|说唱)(\s*\d+)?(\s*[:：-].*)?\s*\]\s*$`)
	storyboardBracketedTextPattern  = regexp.MustCompile(`^\s*\[[^\[\]\r\n]+\]\s*$`)
)

type storyboardLyricToken struct {
	Text                  string
	PromptText            string
	Position              int
	Section               bool
	TimestampCentiseconds int
	HasTimestamp          bool
}

type StoryboardLyricShotPlan struct {
	Duration             int
	TransitionDurationMS int
	LineIndexes          []int
}

// NormalizeStoryboardLyrics converts plain text or LRC-like input into stable,
// one-based lyric lines used by storyboard shot mappings.
func NormalizeStoryboardLyrics(value string) []string {
	lines := make([]string, 0)
	for _, token := range parseStoryboardLyricTokens(value) {
		if !token.Section {
			lines = append(lines, token.Text)
		}
	}
	return lines
}

// SelectStoryboardLyricsForTimeline keeps the whole lyric for a full-track
// storyboard and proportionally selects lines for a partial track. Precise
// word-level audio alignment remains a separate capability.
func SelectStoryboardLyricsForTimeline(value string, timeline StoryboardTimelineRange) string {
	tokens := parseStoryboardLyricTokens(value)
	lineCount := storyboardLyricTokenLineCount(tokens)
	if lineCount == 0 || timeline.SoundtrackDurationMS <= 0 {
		return ""
	}
	fullTrackEnd := timeline.EndMS >= timeline.SoundtrackDurationMS ||
		timeline.SoundtrackDurationMS-timeline.EndMS <= storyboardLyricsFullTrackToleranceMS
	if timeline.StartMS <= 0 && fullTrackEnd {
		return renderStoryboardLyricTokens(tokens, 0, lineCount, true)
	}
	startIndex := int(int64(lineCount) * timeline.StartMS / timeline.SoundtrackDurationMS)
	endIndex := int((int64(lineCount)*timeline.EndMS + timeline.SoundtrackDurationMS - 1) / timeline.SoundtrackDurationMS)
	if startIndex < 0 {
		startIndex = 0
	}
	if endIndex > lineCount {
		endIndex = lineCount
	}
	if endIndex <= startIndex {
		endIndex = min(lineCount, startIndex+1)
	}
	return renderStoryboardLyricTokens(tokens, startIndex, endIndex, false)
}

// CompleteStoryboardLyricShotPlans validates explicit mappings and assigns
// omitted lyric lines by timeline position without crossing existing anchors.
func CompleteStoryboardLyricShotPlans(lineCount int, shots []StoryboardLyricShotPlan) ([]StoryboardLyricShotPlan, error) {
	if lineCount <= 0 {
		return nil, fmt.Errorf("MV 歌词至少需要一行")
	}
	if len(shots) == 0 {
		return nil, fmt.Errorf("MV 歌词缺少镜头映射")
	}

	completed := make([]StoryboardLyricShotPlan, len(shots))
	covered := make([]bool, lineCount+1)
	lastIndex := 0
	for shotIndex, shot := range shots {
		if shot.Duration <= 0 {
			return nil, fmt.Errorf("镜头 %d 时长无效", shotIndex+1)
		}
		indexes := append([]int(nil), shot.LineIndexes...)
		sort.Ints(indexes)
		for index := 1; index < len(indexes); index++ {
			if indexes[index] == indexes[index-1] {
				return nil, fmt.Errorf("镜头 %d 存在重复歌词行", shotIndex+1)
			}
		}
		for _, lineIndex := range indexes {
			if lineIndex < 1 || lineIndex > lineCount {
				return nil, fmt.Errorf("镜头 %d 的歌词行 %d 超出范围", shotIndex+1, lineIndex)
			}
			if lineIndex < lastIndex {
				return nil, fmt.Errorf("镜头 %d 的歌词顺序倒退", shotIndex+1)
			}
			covered[lineIndex] = true
			lastIndex = lineIndex
		}
		completed[shotIndex] = StoryboardLyricShotPlan{
			Duration:             shot.Duration,
			TransitionDurationMS: max(0, shot.TransitionDurationMS),
			LineIndexes:          indexes,
		}
	}

	for lineIndex := 1; lineIndex <= lineCount; lineIndex++ {
		if covered[lineIndex] {
			continue
		}

		lowerShotIndex := 0
		upperShotIndex := len(completed) - 1
		for shotIndex, shot := range completed {
			for _, mappedLineIndex := range shot.LineIndexes {
				if mappedLineIndex < lineIndex && shotIndex > lowerShotIndex {
					lowerShotIndex = shotIndex
				}
				if mappedLineIndex > lineIndex && shotIndex < upperShotIndex {
					upperShotIndex = shotIndex
				}
			}
		}
		if lowerShotIndex > upperShotIndex {
			return nil, fmt.Errorf("第 %d 行歌词无法按顺序分配镜头", lineIndex)
		}

		targetShotIndex := storyboardLyricTimelineShotIndex(completed, lineIndex, lineCount)
		if targetShotIndex < lowerShotIndex {
			targetShotIndex = lowerShotIndex
		} else if targetShotIndex > upperShotIndex {
			targetShotIndex = upperShotIndex
		}
		completed[targetShotIndex].LineIndexes = append(completed[targetShotIndex].LineIndexes, lineIndex)
		sort.Ints(completed[targetShotIndex].LineIndexes)
		covered[lineIndex] = true
	}
	return completed, nil
}

// BuildStoryboardLyricsLRC completes the shot-to-line mapping and derives
// deterministic planned timestamps from the storyboard timeline.
func BuildStoryboardLyricsLRC(lines []string, shots []StoryboardLyricShotPlan) (string, error) {
	if len(lines) == 0 {
		return "", nil
	}
	completed, err := CompleteStoryboardLyricShotPlans(len(lines), shots)
	if err != nil {
		return "", err
	}

	lineTimestamps := make(map[int]int, len(lines))
	covered := make([]bool, len(lines)+1)
	shotStartMS := 0
	for shotIndex, shot := range completed {
		newIndexes := make([]int, 0, len(shot.LineIndexes))
		for _, lineIndex := range shot.LineIndexes {
			if !covered[lineIndex] {
				newIndexes = append(newIndexes, lineIndex)
				covered[lineIndex] = true
			}
		}
		shotDurationMS := storyboardLyricShotAdvanceMS(completed, shotIndex)
		totalWeight := 0
		for _, lineIndex := range newIndexes {
			totalWeight += storyboardLyricLineWeight(lines[lineIndex-1])
		}
		elapsedWeight := 0
		for _, lineIndex := range newIndexes {
			lineTimestamps[lineIndex] = shotStartMS
			if totalWeight > 0 {
				lineTimestamps[lineIndex] += shotDurationMS * elapsedWeight / totalWeight
			}
			elapsedWeight += storyboardLyricLineWeight(lines[lineIndex-1])
		}
		shotStartMS += shotDurationMS
	}

	entries := make([]string, 0, len(lines))
	for lineIndex, line := range lines {
		oneBasedIndex := lineIndex + 1
		entries = append(entries, formatStoryboardLRCTimestampMS(lineTimestamps[oneBasedIndex])+line)
	}
	return strings.Join(entries, "\n"), nil
}

// BuildStoryboardLyricsLRCFromInput preserves a complete, monotonic LRC input.
// Plain or partially timestamped lyrics continue through the planned estimator.
func BuildStoryboardLyricsLRCFromInput(value string, shots []StoryboardLyricShotPlan) (string, error) {
	lines := NormalizeStoryboardLyrics(value)
	if len(lines) == 0 {
		return "", nil
	}
	if _, err := CompleteStoryboardLyricShotPlans(len(lines), shots); err != nil {
		return "", err
	}
	if lrc, ok := normalizeProvidedStoryboardLyricsLRC(value); ok {
		return lrc, nil
	}
	return BuildStoryboardLyricsLRC(lines, shots)
}

func storyboardLyricTimelineShotIndex(shots []StoryboardLyricShotPlan, lineIndex, lineCount int) int {
	totalDurationMS := 0
	for shotIndex := range shots {
		totalDurationMS += storyboardLyricShotAdvanceMS(shots, shotIndex)
	}
	if totalDurationMS <= 0 {
		return 0
	}
	position := totalDurationMS * (lineIndex - 1)
	elapsed := 0
	for shotIndex := range shots {
		elapsed += storyboardLyricShotAdvanceMS(shots, shotIndex)
		if elapsed*lineCount > position {
			return shotIndex
		}
	}
	return len(shots) - 1
}

func formatStoryboardLRCTimestampMS(milliseconds int) string {
	centiseconds := max(0, milliseconds) / 10
	minutes := centiseconds / 6000
	seconds := centiseconds / 100 % 60
	fraction := centiseconds % 100
	return fmt.Sprintf("[%02d:%02d.%02d]", minutes, seconds, fraction)
}

func parseStoryboardLyricTokens(value string) []storyboardLyricToken {
	value = strings.ReplaceAll(value, "\r\n", "\n")
	value = strings.ReplaceAll(value, "\r", "\n")
	tokens := make([]storyboardLyricToken, 0)
	position := 0
	for _, raw := range strings.Split(value, "\n") {
		line := strings.TrimSpace(raw)
		if line == "" {
			continue
		}
		if storyboardLyricSectionPattern.MatchString(line) {
			tokens = append(tokens, storyboardLyricToken{
				PromptText: line,
				Position:   position,
				Section:    true,
			})
			continue
		}

		timestamp := storyboardLyricTimestampPattern.FindStringSubmatch(line)
		text := strings.TrimSpace(storyboardLyricTimestampPattern.ReplaceAllString(line, ""))
		if storyboardLyricSectionPattern.MatchString(text) {
			tokens = append(tokens, storyboardLyricToken{
				PromptText: text,
				Position:   position,
				Section:    true,
			})
			continue
		}
		if text == "" || storyboardBracketedTextPattern.MatchString(text) {
			continue
		}
		centiseconds, hasTimestamp := parseStoryboardLyricTimestamp(timestamp)
		tokens = append(tokens, storyboardLyricToken{
			Text:                  text,
			PromptText:            line,
			Position:              position,
			TimestampCentiseconds: centiseconds,
			HasTimestamp:          hasTimestamp,
		})
		position++
	}
	return tokens
}

func storyboardLyricTokenLineCount(tokens []storyboardLyricToken) int {
	lineCount := 0
	for _, token := range tokens {
		if !token.Section {
			lineCount++
		}
	}
	return lineCount
}

func renderStoryboardLyricTokens(tokens []storyboardLyricToken, startIndex, endIndex int, preserveTimestamps bool) string {
	lines := make([]string, 0, endIndex-startIndex)
	leadingSection := ""
	if startIndex > 0 {
		for _, token := range tokens {
			if token.Section && token.Position < startIndex {
				leadingSection = token.PromptText
			}
		}
		if leadingSection != "" {
			lines = append(lines, leadingSection)
		}
	}
	for _, token := range tokens {
		if token.Section {
			if preserveTimestamps || (token.Position >= startIndex && token.Position < endIndex) {
				lines = append(lines, token.PromptText)
			}
			continue
		}
		if token.Position < startIndex || token.Position >= endIndex {
			continue
		}
		if preserveTimestamps {
			lines = append(lines, token.PromptText)
		} else {
			lines = append(lines, token.Text)
		}
	}
	return strings.Join(lines, "\n")
}

func normalizeProvidedStoryboardLyricsLRC(value string) (string, bool) {
	tokens := parseStoryboardLyricTokens(value)
	lines := make([]string, 0)
	lastTimestamp := -1
	for _, token := range tokens {
		if token.Section {
			continue
		}
		if !token.HasTimestamp || token.TimestampCentiseconds < lastTimestamp {
			return "", false
		}
		lastTimestamp = token.TimestampCentiseconds
		lines = append(lines, token.PromptText)
	}
	return strings.Join(lines, "\n"), len(lines) > 0
}

func parseStoryboardLyricTimestamp(match []string) (int, bool) {
	if len(match) != 4 {
		return 0, false
	}
	minutes, minutesErr := strconv.Atoi(match[1])
	seconds, secondsErr := strconv.Atoi(match[2])
	if minutesErr != nil || secondsErr != nil || seconds >= 60 {
		return 0, false
	}
	fraction := 0
	if match[3] != "" {
		value, err := strconv.Atoi(match[3])
		if err != nil {
			return 0, false
		}
		switch len(match[3]) {
		case 1:
			fraction = value * 10
		case 2:
			fraction = value
		case 3:
			fraction = value / 10
		default:
			return 0, false
		}
	}
	return (minutes*60+seconds)*100 + fraction, true
}

func storyboardLyricShotAdvanceMS(shots []StoryboardLyricShotPlan, shotIndex int) int {
	advanceMS := shots[shotIndex].Duration * 1000
	if shotIndex+1 >= len(shots) {
		return advanceMS
	}
	overlapMS := max(0, shots[shotIndex+1].TransitionDurationMS)
	return max(0, advanceMS-overlapMS)
}

func storyboardLyricLineWeight(value string) int {
	weight := 0
	for _, current := range value {
		switch {
		case unicode.IsSpace(current):
		case strings.ContainsRune("，,、；;：:", current):
			weight += 2
		case strings.ContainsRune("。.!！?？…", current):
			weight += 4
		case unicode.IsPunct(current):
			weight++
		default:
			weight++
		}
	}
	return max(1, weight)
}
