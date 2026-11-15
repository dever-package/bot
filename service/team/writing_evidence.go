package team

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/dever-package/bot/service/team/story"
	"strconv"
	"strings"
)

type writingSourcePassage = story.SourcePassage

func writingSourcePassages(body string) []writingSourcePassage {
	return story.SourcePassages(body)
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
	statePositions, stateSources := map[string]int{}, map[string]int{}
	seenStates := map[string]bool{}
	for index, state := range selected.CharacterChanges {
		quote, err := resolveEvidence(state.writingEvidenceSelection)
		if err != nil {
			return resolved, err
		}
		key := state.CharacterID + "\x00" + state.Aspect + "\x00" + state.Key
		if strings.TrimSpace(state.CharacterID) == "" || (state.Aspect != "state" && state.Aspect != "knowledge") || strings.TrimSpace(state.Key) == "" || strings.TrimSpace(state.Value) == "" || seenStates[key+"\x00"+state.SourceID] {
			return resolved, fmt.Errorf("character_changes[%d] 的人物/aspect/key/value无效或同段重复，请保留该段结束状态", index)
		}
		seenStates[key+"\x00"+state.SourceID] = true
		source, _ := strconv.Atoi(state.SourceID) // 已由当前正文的来源枚举验证。
		change := writingCharacterState{CharacterID: state.CharacterID, Aspect: state.Aspect, Key: state.Key, Value: state.Value, Quote: quote}
		if position, exists := statePositions[key]; exists {
			if source > stateSources[key] {
				resolved.CharacterChanges[position], stateSources[key] = change, source
			}
		} else {
			statePositions[key], stateSources[key] = len(resolved.CharacterChanges), source
			resolved.CharacterChanges = append(resolved.CharacterChanges, change)
		}
	}
	threadPositions, threadSources := map[string]int{}, map[string]int{}
	seenThreads := map[string]bool{}
	for index, thread := range selected.Threads {
		quote, err := resolveEvidence(thread.writingEvidenceSelection)
		if err != nil {
			return resolved, err
		}
		if (thread.Status != "open" && thread.Status != "resolved") || strings.TrimSpace(thread.Text) == "" || (thread.ID == "" && thread.Status == "resolved") || (thread.ID != "" && seenThreads[thread.ID+"\x00"+thread.SourceID]) {
			return resolved, fmt.Errorf("threads[%d] 的线索id/status/text无效或同段重复", index)
		}
		seenThreads[thread.ID+"\x00"+thread.SourceID] = true
		source, _ := strconv.Atoi(thread.SourceID)
		change := writingThread{ID: thread.ID, Status: thread.Status, Text: thread.Text, Quote: quote}
		if position, exists := threadPositions[thread.ID]; thread.ID != "" && exists {
			if source > threadSources[thread.ID] {
				resolved.Threads[position], threadSources[thread.ID] = change, source
			}
		} else {
			if thread.ID != "" {
				threadPositions[thread.ID], threadSources[thread.ID] = len(resolved.Threads), source
			}
			resolved.Threads = append(resolved.Threads, change)
		}
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
