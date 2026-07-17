package sessionstate

import (
	"encoding/json"
	"strings"
)

const (
	Version          = 1
	maxSummaryRunes  = 8000
	maxSummaryItems  = 24
	maxArtifactItems = 24
)

type Summary struct {
	Version     int         `json:"version"`
	Goal        string      `json:"goal"`
	Constraints []string    `json:"constraints"`
	Confirmed   []string    `json:"confirmed"`
	Completed   []string    `json:"completed"`
	Pending     []string    `json:"pending"`
	Artifacts   []Artifact  `json:"artifacts"`
	Interaction Interaction `json:"interaction"`
}

type Artifact struct {
	Type   string `json:"type"`
	ID     string `json:"id"`
	Status string `json:"status"`
}

type Interaction struct {
	Status   string `json:"status"`
	Question string `json:"question"`
}

func Normalize(value string) string {
	summary, ok := Decode(value)
	if !ok {
		return ""
	}
	return Encode(summary)
}

func Decode(value string) (Summary, bool) {
	var summary Summary
	if err := json.Unmarshal([]byte(trimJSONFence(value)), &summary); err != nil {
		return Summary{}, false
	}
	if summary.Version != Version {
		return Summary{}, false
	}
	return summary, true
}

func Encode(summary Summary) string {
	summary.Version = Version
	summary.Goal = limitRunes(summary.Goal, 800)
	summary.Constraints = normalizeList(summary.Constraints, 20, 400)
	summary.Confirmed = normalizeList(summary.Confirmed, maxSummaryItems, 400)
	summary.Completed = normalizeList(summary.Completed, maxSummaryItems, 400)
	summary.Pending = normalizeList(summary.Pending, maxSummaryItems, 400)
	summary.Artifacts = normalizeArtifacts(summary.Artifacts)
	summary.Interaction.Status = normalizeInteractionStatus(summary.Interaction.Status)
	summary.Interaction.Question = limitRunes(summary.Interaction.Question, 500)
	for {
		encoded, err := json.Marshal(summary)
		if err != nil {
			return ""
		}
		if len([]rune(string(encoded))) <= maxSummaryRunes {
			return string(encoded)
		}
		switch {
		case len(summary.Completed) > 1:
			summary.Completed = summary.Completed[1:]
		case len(summary.Confirmed) > 1:
			summary.Confirmed = summary.Confirmed[1:]
		case len(summary.Artifacts) > 1:
			summary.Artifacts = summary.Artifacts[1:]
		case len(summary.Constraints) > 1:
			summary.Constraints = summary.Constraints[1:]
		case len(summary.Pending) > 1:
			summary.Pending = summary.Pending[1:]
		default:
			summary.Goal = limitRunes(summary.Goal, 300)
			summary.Interaction.Question = limitRunes(summary.Interaction.Question, 240)
			encoded, err = json.Marshal(summary)
			if err != nil {
				return ""
			}
			return string(encoded)
		}
	}
}

func Render(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	summary, ok := Decode(value)
	if !ok || summary.Version <= 0 {
		return limitRunes(value, maxSummaryRunes)
	}
	parts := make([]string, 0, 7)
	parts = appendText(parts, "当前目标", summary.Goal)
	parts = appendList(parts, "约束", summary.Constraints)
	parts = appendList(parts, "已确认", summary.Confirmed)
	parts = appendList(parts, "已完成", summary.Completed)
	parts = appendList(parts, "待完成", summary.Pending)
	if len(summary.Artifacts) > 0 {
		rows := make([]string, 0, len(summary.Artifacts))
		for _, artifact := range summary.Artifacts {
			row := strings.TrimSpace(strings.Join([]string{artifact.Type, artifact.ID, artifact.Status}, " / "))
			if row != "" {
				rows = append(rows, row)
			}
		}
		parts = appendList(parts, "产物", rows)
	}
	if summary.Interaction.Status != "none" || summary.Interaction.Question != "" {
		parts = appendText(parts, "交互状态", strings.TrimSpace(summary.Interaction.Status+" "+summary.Interaction.Question))
	}
	return strings.Join(parts, "\n")
}

func normalizeList(values []string, maximum int, itemLimit int) []string {
	seen := map[string]struct{}{}
	result := make([]string, 0, len(values))
	for _, value := range values {
		value = limitRunes(value, itemLimit)
		if value == "" {
			continue
		}
		key := strings.ToLower(value)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, value)
		if len(result) >= maximum {
			break
		}
	}
	return result
}

func normalizeArtifacts(values []Artifact) []Artifact {
	seen := map[string]struct{}{}
	result := make([]Artifact, 0, len(values))
	for _, value := range values {
		value.Type = limitRunes(value.Type, 48)
		value.ID = limitRunes(value.ID, 160)
		value.Status = limitRunes(value.Status, 48)
		if value.ID == "" {
			continue
		}
		key := value.Type + ":" + value.ID
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, value)
		if len(result) >= maxArtifactItems {
			break
		}
	}
	return result
}

func normalizeInteractionStatus(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "waiting", "answered":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return "none"
	}
}

func trimJSONFence(value string) string {
	value = strings.TrimSpace(value)
	if !strings.HasPrefix(value, "```") {
		return value
	}
	lines := strings.Split(value, "\n")
	if len(lines) < 3 {
		return value
	}
	return strings.TrimSpace(strings.Join(lines[1:len(lines)-1], "\n"))
}

func appendText(parts []string, title string, value string) []string {
	value = strings.TrimSpace(value)
	if value == "" {
		return parts
	}
	return append(parts, title+"："+value)
}

func appendList(parts []string, title string, values []string) []string {
	values = normalizeList(values, maxSummaryItems, 400)
	if len(values) == 0 {
		return parts
	}
	return append(parts, title+"：\n- "+strings.Join(values, "\n- "))
}

func limitRunes(value string, maximum int) string {
	value = strings.TrimSpace(value)
	if value == "" || maximum <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) <= maximum {
		return value
	}
	return strings.TrimSpace(string(runes[:maximum]))
}
