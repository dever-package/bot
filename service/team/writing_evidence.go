package team

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

const writingEvidencePassageRunes = 500

type writingSourcePassage struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

// 编号只在本次固定正文内有效；提交边界校验版本，账本出处由程序绑定。
// 切分不改写标点、空白或 Unicode，输入与结果复用同一规则。
func writingSourcePassages(body string) []writingSourcePassage {
	passages := []writingSourcePassage{}
	for _, paragraph := range strings.SplitAfter(body, "\n\n") {
		runes := []rune(paragraph)
		for len(runes) > 0 {
			end := min(len(runes), writingEvidencePassageRunes)
			passages = append(passages, writingSourcePassage{ID: strconv.Itoa(len(passages) + 1), Text: string(runes[:end])})
			runes = runes[end:]
		}
	}
	return passages
}

type writingEvidenceSelection struct {
	SourceID string `json:"source_id"`
}

func writingEvidenceResolver(body string) func(writingEvidenceSelection) (string, error) {
	sources := map[string]string{}
	for _, passage := range writingSourcePassages(body) {
		sources[passage.ID] = passage.Text
	}
	return func(selection writingEvidenceSelection) (string, error) {
		text, exists := sources[selection.SourceID]
		if !exists || strings.TrimSpace(text) == "" {
			return "", fmt.Errorf("正文证据来源选择无效：请选择当前固定正文中的段落编号")
		}
		return text, nil
	}
}

// 内部模型候选与持久化账本隔离，禁止旧 quote/evidence 或模型伪造的出处进入存储。
type writingResolvedContinuity struct {
	Synopsis         string
	EndState         string
	Facts            []writingEvidence
	CharacterChanges []writingCharacterState
	Threads          []writingThread
	Findings         []writingFinding
}

func resolveWritingContinuityEvidence(body string, candidate map[string]any) (writingResolvedContinuity, error) {
	resolved := writingResolvedContinuity{Facts: []writingEvidence{}, CharacterChanges: []writingCharacterState{}, Threads: []writingThread{}, Findings: []writingFinding{}}
	var selected struct {
		Synopsis string `json:"synopsis"`
		EndState string `json:"end_state"`
		Facts    []struct {
			Text string `json:"text"`
			writingEvidenceSelection
		} `json:"facts"`
		CharacterChanges []struct {
			CharacterID string `json:"character_id"`
			Aspect      string `json:"aspect"`
			Key         string `json:"key"`
			Value       string `json:"value"`
			writingEvidenceSelection
		} `json:"character_changes"`
		Threads []struct {
			ID     string `json:"id"`
			Status string `json:"status"`
			Text   string `json:"text"`
			writingEvidenceSelection
		} `json:"threads"`
		Findings []struct {
			Code    string `json:"code"`
			Message string `json:"message"`
			writingEvidenceSelection
		} `json:"findings"`
	}
	raw, err := json.Marshal(candidate)
	if err != nil {
		return resolved, err
	}
	if len(candidate) != 6 {
		return resolved, fmt.Errorf("实际衔接字段不匹配")
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err = decoder.Decode(&selected); err != nil {
		return resolved, err
	}
	if strings.TrimSpace(selected.Synopsis) == "" || strings.TrimSpace(selected.EndState) == "" || selected.Facts == nil || selected.CharacterChanges == nil || selected.Threads == nil || selected.Findings == nil {
		return resolved, fmt.Errorf("实际衔接内容不完整")
	}
	resolveEvidence := writingEvidenceResolver(body)
	for _, fact := range selected.Facts {
		quote, err := resolveEvidence(fact.writingEvidenceSelection)
		if err != nil {
			return resolved, err
		}
		resolved.Facts = append(resolved.Facts, writingEvidence{Text: fact.Text, Quote: quote})
	}
	for _, state := range selected.CharacterChanges {
		quote, err := resolveEvidence(state.writingEvidenceSelection)
		if err != nil {
			return resolved, err
		}
		resolved.CharacterChanges = append(resolved.CharacterChanges, writingCharacterState{CharacterID: state.CharacterID, Aspect: state.Aspect, Key: state.Key, Value: state.Value, Quote: quote})
	}
	for _, thread := range selected.Threads {
		quote, err := resolveEvidence(thread.writingEvidenceSelection)
		if err != nil {
			return resolved, err
		}
		resolved.Threads = append(resolved.Threads, writingThread{ID: thread.ID, Status: thread.Status, Text: thread.Text, Quote: quote})
	}
	for _, finding := range selected.Findings {
		quote, err := resolveEvidence(finding.writingEvidenceSelection)
		if err != nil {
			return resolved, err
		}
		resolved.Findings = append(resolved.Findings, writingFinding{Code: finding.Code, Message: finding.Message, Evidence: quote})
	}

	resolved.Synopsis, resolved.EndState = selected.Synopsis, selected.EndState
	return resolved, nil
}
