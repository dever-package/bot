package team

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
)

// 块是模型的私有交付格式；正文始终原样拼接为既有 Markdown，证据取实际块文本。
func resolveWritingBodyContinuity(body string, candidate map[string]any) (writingResolvedContinuity, error) {
	if err := validateWritingBodyContinuityFields(candidate); err != nil {
		return writingResolvedContinuity{}, err
	}
	result := writingResolvedContinuity{Facts: []writingEvidence{}, CharacterChanges: []writingCharacterState{}, Threads: []writingThread{}, Findings: []writingFinding{}}
	var selected struct {
		Blocks []struct {
			Text  string `json:"text"`
			Facts []struct {
				Text string `json:"text"`
			} `json:"facts"`
			Characters []struct {
				CharacterID string `json:"character_id"`
				Aspect      string `json:"aspect"`
				Key         string `json:"key"`
				Value       string `json:"value"`
			} `json:"character_changes"`
			Threads []struct {
				ID     string `json:"id"`
				Status string `json:"status"`
				Text   string `json:"text"`
			} `json:"threads"`
			Findings []struct {
				Code    string `json:"code"`
				Message string `json:"message"`
			} `json:"findings"`
		} `json:"blocks"`
		Complete bool   `json:"body_complete"`
		Synopsis string `json:"synopsis"`
		EndState string `json:"end_state"`
	}
	raw, err := json.Marshal(candidate)
	if err != nil {
		return result, err
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err = decoder.Decode(&selected); err != nil {
		return result, fmt.Errorf("衔接块字段无效: %w", err)
	}
	if len(candidate) != 4 || !selected.Complete || len(selected.Blocks) == 0 || strings.TrimSpace(selected.Synopsis) == "" || strings.TrimSpace(selected.EndState) == "" {
		return result, fmt.Errorf("正文衔接的 blocks/body_complete/synopsis/end_state 不完整")
	}
	var actual strings.Builder
	statePositions := map[string]int{}
	threadPositions := map[string]int{}
	for index, block := range selected.Blocks {
		if strings.TrimSpace(block.Text) == "" || block.Facts == nil || block.Characters == nil || block.Threads == nil || block.Findings == nil {
			return result, fmt.Errorf("blocks[%d] 的正文及四类衔接列表必须完整", index)
		}
		actual.WriteString(block.Text)
		for _, fact := range block.Facts {
			result.Facts = append(result.Facts, writingEvidence{Text: fact.Text, Quote: block.Text})
		}
		seenStates := map[string]bool{}
		for row, state := range block.Characters {
			key := state.CharacterID + "\x00" + state.Aspect + "\x00" + state.Key
			if strings.TrimSpace(state.CharacterID) == "" || (state.Aspect != "state" && state.Aspect != "knowledge") || strings.TrimSpace(state.Key) == "" || strings.TrimSpace(state.Value) == "" || seenStates[key] {
				return result, fmt.Errorf("blocks[%d].character_changes[%d] 的人物/aspect/key/value无效或同块重复", index, row)
			}
			seenStates[key] = true
			change := writingCharacterState{CharacterID: state.CharacterID, Aspect: state.Aspect, Key: state.Key, Value: state.Value, Quote: block.Text}
			if position, exists := statePositions[key]; exists {
				result.CharacterChanges[position] = change
			} else {
				statePositions[key] = len(result.CharacterChanges)
				result.CharacterChanges = append(result.CharacterChanges, change)
			}
		}
		seenThreads := map[string]bool{}
		for row, thread := range block.Threads {
			if (thread.Status != "open" && thread.Status != "resolved") || strings.TrimSpace(thread.Text) == "" || (thread.ID != "" && seenThreads[thread.ID]) || (thread.ID == "" && thread.Status == "resolved") {
				return result, fmt.Errorf("blocks[%d].threads[%d] 的线索id/status/text无效或同块重复", index, row)
			}
			seenThreads[thread.ID] = true
			change := writingThread{ID: thread.ID, Status: thread.Status, Text: thread.Text, Quote: block.Text}
			if position, exists := threadPositions[thread.ID]; thread.ID != "" && exists {
				result.Threads[position] = change
			} else {
				if thread.ID != "" {
					threadPositions[thread.ID] = len(result.Threads)
				}
				result.Threads = append(result.Threads, change)
			}
		}
		for _, finding := range block.Findings {
			result.Findings = append(result.Findings, writingFinding{Code: finding.Code, Message: finding.Message, Evidence: block.Text})
		}
	}
	if actual.String() != body {
		return result, fmt.Errorf("衔接块原文不属于当前固定正文")
	}
	result.Synopsis, result.EndState = selected.Synopsis, selected.EndState
	return result, nil
}

func writingCharacterIDs(work WritingDocument) []string {
	ids := make([]string, 0, len(work.Outline.Characters))
	for _, person := range work.Outline.Characters {
		ids = append(ids, person.ID)
	}
	return ids
}
func writingThreadIDs(history writingActualHistory) []string {
	ids := make([]string, 0, len(history.OpenThreads)+len(history.ResolvedThreads))
	for _, group := range [][]writingThread{history.OpenThreads, history.ResolvedThreads} {
		for _, thread := range group {
			ids = append(ids, thread.ID)
		}
	}
	return ids
}

// typed decode 会把遗漏的字符串变成零值；必须先验证完整字段，尤其新线索的空 id。
func validateWritingBodyContinuityFields(candidate map[string]any) error {
	required := func(object map[string]any, path string, fields ...string) error {
		if len(object) != len(fields) {
			return fmt.Errorf("%s 字段不完整或包含未知字段", path)
		}
		for _, field := range fields {
			if value, exists := object[field]; !exists || value == nil {
				return fmt.Errorf("%s.%s 为必填字段", path, field)
			}
		}
		return nil
	}
	if err := required(candidate, "continuity", "blocks", "body_complete", "synopsis", "end_state"); err != nil {
		return err
	}
	blocks, ok := candidate["blocks"].([]any)
	if !ok || len(blocks) == 0 {
		return fmt.Errorf("continuity.blocks 必须为非空列表")
	}
	groups := []struct {
		name   string
		fields []string
	}{
		{"facts", []string{"text"}},
		{"character_changes", []string{"character_id", "aspect", "key", "value"}},
		{"threads", []string{"id", "status", "text"}},
		{"findings", []string{"code", "message"}},
	}
	for index, value := range blocks {
		block, ok := value.(map[string]any)
		path := fmt.Sprintf("blocks[%d]", index)
		if !ok {
			return fmt.Errorf("%s 必须为对象", path)
		}
		if err := required(block, path, "text", "facts", "character_changes", "threads", "findings"); err != nil {
			return err
		}
		for _, group := range groups {
			rows, ok := block[group.name].([]any)
			if !ok {
				return fmt.Errorf("%s.%s 必须为列表", path, group.name)
			}
			for rowIndex, value := range rows {
				row, ok := value.(map[string]any)
				rowPath := fmt.Sprintf("%s.%s[%d]", path, group.name, rowIndex)
				if !ok {
					return fmt.Errorf("%s 必须为对象", rowPath)
				}
				if err := required(row, rowPath, group.fields...); err != nil {
					return err
				}
			}
		}
	}
	return nil
}
