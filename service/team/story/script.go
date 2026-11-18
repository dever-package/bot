package story

import (
	"encoding/json"
	"fmt"
	"sort"
	"strconv"
	"strings"
)

// SourcePassage identifies an exact, unmodified range of the manuscript.
type SourcePassage struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

func SourcePassages(body string) []SourcePassage {
	passages := []SourcePassage{}
	for _, paragraph := range strings.SplitAfter(body, "\n\n") {
		runes := []rune(paragraph)
		for len(runes) > 0 {
			end := min(len(runes), 500)
			passages = append(passages, SourcePassage{ID: strconv.Itoa(len(passages) + 1), Text: string(runes[:end])})
			runes = runes[end:]
		}
	}
	return passages
}

// ScriptScene contains adaptation and continuity only; media belongs to the canvas.
type ScriptScene struct {
	Title          string `json:"title"`
	Description    string `json:"description"`
	SourceStart    int    `json:"source_start"`
	SourceEnd      int    `json:"source_end"`
	TargetDuration int    `json:"target_duration"`
	Connection     string `json:"connection"`
	Scene          Scene  `json:"scene"`
	EntryState     State  `json:"entry_state"`
	ExitState      State  `json:"exit_state"`
}

func DecodeScreenplay(raw []byte, passages []SourcePassage) ([]ScriptScene, error) {
	var plan struct {
		Parts []ScriptScene `json:"parts"`
	}
	if err := json.Unmarshal(raw, &plan); err != nil {
		return nil, fmt.Errorf("剧情拆分格式无效：%w", err)
	}
	if len(plan.Parts) == 0 {
		return nil, fmt.Errorf("剧情片段数量无效")
	}
	for i, p := range plan.Parts {
		if p.SourceStart < 1 || p.SourceEnd < p.SourceStart || p.SourceEnd > len(passages) {
			return nil, fmt.Errorf("片段%d引用的原文范围%d—%d不存在，共%d段", i+1, p.SourceStart, p.SourceEnd, len(passages))
		}
		if (p.Connection != "reset" && p.Connection != "match" && p.Connection != "continue") || strings.TrimSpace(p.Description) == "" || p.TargetDuration < 1 || p.TargetDuration > 300 {
			return nil, fmt.Errorf("片段%d须包含剧情、有效衔接方式及1—300秒建议时长", i+1)
		}
	}
	return plan.Parts, nil
}

func ValidateScriptStates(parts []ScriptScene, materials map[string]string, hasPrevious bool) error {
	for i, part := range parts {
		if i == 0 && !hasPrevious && part.Connection != "reset" {
			parts[i].Connection = "reset"
		}
		for stateIndex, state := range []State{part.EntryState, part.ExitState} {
			seen := map[string]bool{}
			for _, c := range state.Characters {
				if materials[c.CharacterID] != "character" || seen[c.CharacterID] {
					return fmt.Errorf("场次%d人物身份或状态无效", i+1)
				}
				seen[c.CharacterID] = true
			}
			for _, p := range state.Props {
				if materials[p.PropID] != "prop" || seen[p.PropID] || (p.OwnerID != "" && materials[p.OwnerID] != "character") {
					return fmt.Errorf("场次%d的%s道具状态无效（道具%q，持有人%q，位置%q，接触%q）", i+1, []string{"起始", "结束"}[stateIndex], p.PropID, p.OwnerID, p.Position, p.Contact)
				}
				seen[p.PropID] = true
			}
		}
	}
	return nil
}

func ScreenplaySchema(materials map[string]string) map[string]any {
	characters, props := []string{}, []string{}
	for id, kind := range materials {
		switch kind {
		case "character":
			characters = append(characters, id)
		case "prop":
			props = append(props, id)
		}
	}
	sort.Strings(characters)
	sort.Strings(props)
	text := map[string]any{"type": "string"}
	requiredText := map[string]any{"type": "string", "minLength": 1}
	object := func(properties map[string]any) map[string]any {
		required := make([]string, 0, len(properties))
		for key := range properties {
			required = append(required, key)
		}
		return map[string]any{"type": "object", "properties": properties, "required": required, "additionalProperties": false}
	}
	array := func(item any) map[string]any { return map[string]any{"type": "array", "items": item} }
	id := func(ids []string) map[string]any {
		schema := map[string]any{"type": "string"}
		if len(ids) > 0 {
			schema["enum"] = ids
		}
		return schema
	}
	characterStates := array(object(map[string]any{"character_id": id(characters), "position": text, "pose": text, "facing": text, "look_at": text}))
	propStates := array(object(map[string]any{"prop_id": id(props), "owner_id": id(append([]string{""}, characters...)), "hand": text, "position": text, "contact": text}))
	if len(characters) == 0 {
		characterStates["maxItems"] = 0
	}
	if len(props) == 0 {
		propStates["maxItems"] = 0
	}
	state := object(map[string]any{"characters": characterStates, "props": propStates})
	return object(map[string]any{"parts": map[string]any{"type": "array", "minItems": 1, "items": object(map[string]any{
		"title": requiredText, "description": requiredText, "source_start": map[string]any{"type": "integer", "minimum": 1}, "source_end": map[string]any{"type": "integer", "minimum": 1},
		"target_duration": map[string]any{"type": "integer", "minimum": 1, "maximum": 300},
		"connection":      map[string]any{"type": "string", "enum": []string{"reset", "match", "continue"}},
		"scene":           object(map[string]any{"layout": text, "axis": text, "lighting": text}), "entry_state": state, "exit_state": state,
	})}})
}
