package team

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"unicode"

	"github.com/google/uuid"
)

const writingContinuityCheckpointInterval = 20
const writingRecallChapterLimit = 12

type writingFinding struct {
	Code     string `json:"code"`
	Message  string `json:"message"`
	Evidence string `json:"evidence"`
}
type writingEvidence struct {
	Text  string `json:"text"`
	Quote string `json:"quote"`
}
type writingActualSource struct {
	UnitID        string `json:"unit_id"`
	BodyVersionID uint64 `json:"body_version_id"`
	BodyHash      string `json:"body_hash"`
}
type writingCharacterState struct {
	CharacterID string              `json:"character_id"`
	Aspect      string              `json:"aspect"`
	Key         string              `json:"key"`
	Value       string              `json:"value"`
	Quote       string              `json:"quote"`
	Source      writingActualSource `json:"source"`
}
type writingThread struct {
	ID     string              `json:"id"`
	Status string              `json:"status"`
	Text   string              `json:"text"`
	Quote  string              `json:"quote"`
	Source writingActualSource `json:"source"`
}
type writingHistoryCheckpoint struct {
	ThroughUnitID   string                  `json:"through_unit_id"`
	ChainHash       string                  `json:"chain_hash"`
	Characters      []writingCharacterState `json:"characters"`
	OpenThreads     []writingThread         `json:"open_threads"`
	ResolvedThreads []writingThread         `json:"resolved_threads"`
}
type writingContinuity struct {
	Source           writingActualSource       `json:"source"`
	PlanHash         string                    `json:"plan_hash"`
	PriorChain       string                    `json:"prior_chain"`
	ChainHash        string                    `json:"chain_hash"`
	Facts            []writingEvidence         `json:"facts"`
	CharacterChanges []writingCharacterState   `json:"character_changes"`
	Threads          []writingThread           `json:"threads"`
	Findings         []writingFinding          `json:"findings"`
	Checkpoint       *writingHistoryCheckpoint `json:"checkpoint,omitempty"`
}
type writingContinuityIndex struct {
	SourceVersionID uint64 `json:"source_version_id"`
	VersionID       uint64 `json:"version_id"`
	BodyHash        string `json:"body_hash"`
	PlanHash        string `json:"plan_hash"`
	ChainHash       string `json:"chain_hash"`
	Terms           string `json:"terms"`
	Checkpoint      bool   `json:"checkpoint"`
}
type writingActualHistory struct {
	Through          int                     `json:"through"`
	Characters       []writingCharacterState `json:"characters"`
	OpenThreads      []writingThread         `json:"open_threads"`
	ResolvedThreads  []writingThread         `json:"resolved_threads"`
	Recalled         []map[string]any        `json:"recalled"`
	RecallCandidates int                     `json:"recall_candidates"`
	RecallOmitted    int                     `json:"recall_omitted"`
}

func writingHash(value string) string {
	sum := sha256.Sum256([]byte(value))
	return hex.EncodeToString(sum[:])
}
func writingPlanHash(ref WritingUnitEntry) string { return writingHash(ref.Title + "\x00" + ref.Plan) }
func writingChainHash(prior, body, plan string) string {
	return writingHash(prior + "\x00" + body + "\x00" + plan)
}

// 只检查目标之前的实际版本链；未来正文及规划不能进入历史事实。
func writingFirstInvalidContinuity(work WritingDocument, before int) int {
	chain := ""
	for index := 0; index < before; index++ {
		ref := work.Units[index]
		if !ref.HasBody {
			return index
		}
		saved := ref.ContinuityIndex
		if !ref.ContinuityValid || ref.DependencyStale || saved == nil || saved.VersionID != ref.VersionID || saved.PlanHash != writingPlanHash(ref) || saved.ChainHash != writingChainHash(chain, saved.BodyHash, saved.PlanHash) {
			return index
		}
		chain = saved.ChainHash
	}
	return -1
}

func applyWritingActualDelta(history *writingActualHistory, delta writingContinuity) {
	states := map[string]writingCharacterState{}
	for _, state := range history.Characters {
		states[state.CharacterID+"\x00"+state.Aspect+"\x00"+state.Key] = state
	}
	for _, state := range delta.CharacterChanges {
		states[state.CharacterID+"\x00"+state.Aspect+"\x00"+state.Key] = state
	}
	history.Characters = []writingCharacterState{}
	keys := make([]string, 0, len(states))
	for key := range states {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		history.Characters = append(history.Characters, states[key])
	}
	threads := map[string]writingThread{}
	for _, thread := range history.OpenThreads {
		threads[thread.ID] = thread
	}
	resolved := map[string]writingThread{}
	for _, thread := range history.ResolvedThreads {
		resolved[thread.ID] = thread
	}
	for _, thread := range delta.Threads {
		if thread.Status == "resolved" {
			delete(threads, thread.ID)
			resolved[thread.ID] = thread
		} else {
			threads[thread.ID] = thread
			delete(resolved, thread.ID)
		}
	}
	history.ResolvedThreads = []writingThread{}
	resolvedKeys := make([]string, 0, len(resolved))
	for key := range resolved {
		resolvedKeys = append(resolvedKeys, key)
	}
	sort.Strings(resolvedKeys)
	for _, key := range resolvedKeys {
		history.ResolvedThreads = append(history.ResolvedThreads, resolved[key])
	}

	history.OpenThreads = []writingThread{}
	keys = keys[:0]
	for key := range threads {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		history.OpenThreads = append(history.OpenThreads, threads[key])
	}
}

func (s Service) loadWritingContinuity(ctx context.Context, snapshot writingSnapshot, index int) (WritingUnit, error) {
	unit, err := s.loadWritingUnit(ctx, snapshot, index)
	if err != nil {
		return unit, err
	}
	ref := snapshot.Work.Units[index]
	ledger := unit.Continuity
	saved := ref.ContinuityIndex
	if ledger == nil || saved == nil || saved.VersionID != ref.VersionID || ledger.Source.UnitID != ref.ID || ledger.Source.BodyVersionID == 0 || ledger.Source.BodyHash != writingHash(unit.Body) || ledger.Source.BodyHash != saved.BodyHash || ledger.PlanHash != saved.PlanHash || ledger.ChainHash != saved.ChainHash {
		return unit, fmt.Errorf("第%d章衔接来源与固定正文版本不符，请重新整理", index+1)
	}
	sourceRef := ref
	sourceRef.VersionID = ledger.Source.BodyVersionID
	sourceUnit, sourceErr := decodeWritingUnitReference(snapshot.Work.Type, sourceRef, s.asset.FindVersion(ctx, sourceRef.VersionID))
	if sourceErr != nil || writingHash(sourceUnit.Body) != ledger.Source.BodyHash || saved.SourceVersionID != ledger.Source.BodyVersionID {
		return unit, fmt.Errorf("实际衔接原文证据版本无效")
	}
	return unit, nil
}

// 状态从最近的固定版本快照恢复，只读取最多一个快照与19个增量。
func (s Service) writingHistoryBefore(ctx context.Context, snapshot writingSnapshot, before int, query string) (writingActualHistory, error) {
	history := writingActualHistory{Through: before, Characters: []writingCharacterState{}, OpenThreads: []writingThread{}, Recalled: []map[string]any{}}
	if invalid := writingFirstInvalidContinuity(snapshot.Work, before); invalid >= 0 {
		return history, fmt.Errorf("第%d章实际衔接待整理", invalid+1)
	}
	start := 0
	loaded := map[int]WritingUnit{}
	for index := before - 1; index >= 0; index-- {
		if snapshot.Work.Units[index].ContinuityIndex.Checkpoint {
			unit, err := s.loadWritingContinuity(ctx, snapshot, index)
			if err != nil {
				return history, err
			}
			point := unit.Continuity.Checkpoint
			if point == nil || point.ThroughUnitID != snapshot.Work.Units[index].ID || point.ChainHash != unit.Continuity.ChainHash {
				return history, fmt.Errorf("衔接快照与章节边界不符")
			}
			sources := map[string]WritingUnitEntry{}
			for _, ref := range snapshot.Work.Units[:index+1] {
				sources[ref.ID] = ref
			}
			validSource := func(source writingActualSource) bool {
				ref, ok := sources[source.UnitID]
				return ok && ref.ContinuityIndex != nil && ref.ContinuityIndex.BodyHash == source.BodyHash && ref.ContinuityIndex.SourceVersionID == source.BodyVersionID
			}
			for _, state := range point.Characters {
				if !validSource(state.Source) {
					return history, fmt.Errorf("人物状态快照来源不属于此前正文")
				}
			}
			for _, thread := range point.OpenThreads {
				if !validSource(thread.Source) {
					return history, fmt.Errorf("线索快照来源不属于此前正文")
				}
			}
			for _, thread := range point.ResolvedThreads {
				if !validSource(thread.Source) {
					return history, fmt.Errorf("已解线索快照来源不属于此前正文")
				}
			}
			history.ResolvedThreads = append(history.ResolvedThreads, point.ResolvedThreads...)
			history.Characters = append(history.Characters, point.Characters...)
			history.OpenThreads = append(history.OpenThreads, point.OpenThreads...)
			loaded[index] = unit
			start = index + 1
			break
		}
	}
	for index := start; index < before; index++ {
		unit, err := s.loadWritingContinuity(ctx, snapshot, index)
		if err != nil {
			return history, err
		}
		applyWritingActualDelta(&history, *unit.Continuity)
		loaded[index] = unit
	}
	// 检索索引只用于挑选原章证据，不能代替证据本身。当前状态与所有未解线索不裁剪。
	terms := writingRecallTerms(query)
	type match struct{ index, score int }
	matches := []match{}
	for index := 0; index < before; index++ {
		score := 0
		text := snapshot.Work.Units[index].ContinuityIndex.Terms
		for _, term := range terms {
			if strings.Contains(text, term) {
				score++
			}
		}
		if index >= before-2 {
			score += 1000
		}
		if score > 0 {
			matches = append(matches, match{index, score})
		}
	}
	sort.SliceStable(matches, func(i, j int) bool {
		if matches[i].score == matches[j].score {
			return matches[i].index > matches[j].index
		}
		return matches[i].score > matches[j].score
	})
	history.RecallCandidates = len(matches)
	if len(matches) > writingRecallChapterLimit {
		history.RecallOmitted = len(matches) - writingRecallChapterLimit
		matches = matches[:writingRecallChapterLimit]
	}
	sort.Slice(matches, func(i, j int) bool { return matches[i].index < matches[j].index })
	for _, match := range matches {
		unit, ok := loaded[match.index]
		if !ok {
			var err error
			unit, err = s.loadWritingContinuity(ctx, snapshot, match.index)
			if err != nil {
				return history, err
			}
		}
		history.Recalled = append(history.Recalled, map[string]any{"source": unit.Continuity.Source, "ordinal": match.index + 1, "synopsis": unit.Synopsis, "facts": unit.Continuity.Facts, "thread_changes": unit.Continuity.Threads, "findings": unit.Continuity.Findings})
	}
	return history, nil
}

func writingRecallTerms(text string) []string {
	seen := map[string]bool{}
	words := strings.FieldsFunc(strings.ToLower(text), func(r rune) bool { return !unicode.IsLetter(r) && !unicode.IsNumber(r) })
	for _, word := range words {
		runes := []rune(word)
		if len(runes) < 2 {
			continue
		}
		if len(runes) <= 4 {
			seen[word] = true
		}
		for i := 0; i+1 < len(runes); i++ {
			seen[string(runes[i:i+2])] = true
		}
	}
	terms := make([]string, 0, len(seen))
	for term := range seen {
		terms = append(terms, term)
	}
	sort.Strings(terms)
	return terms
}

func writingContinuityResult(snapshot writingSnapshot, index int, unit WritingUnit, candidate map[string]any, history writingActualHistory) (WritingUnit, error) {
	var result struct {
		Synopsis         string                  `json:"synopsis"`
		EndState         string                  `json:"end_state"`
		Facts            []writingEvidence       `json:"facts"`
		CharacterChanges []writingCharacterState `json:"character_changes"`
		Threads          []writingThread         `json:"threads"`
		Findings         []writingFinding        `json:"findings"`
	}
	raw, err := json.Marshal(candidate)
	if err != nil {
		return unit, err
	}
	if len(candidate) != 6 {
		return unit, fmt.Errorf("实际衔接字段不匹配")
	}
	if err = json.Unmarshal(raw, &result); err != nil {
		return unit, err
	}
	if strings.TrimSpace(result.Synopsis) == "" || strings.TrimSpace(result.EndState) == "" || result.Facts == nil || result.CharacterChanges == nil || result.Threads == nil || result.Findings == nil {
		return unit, fmt.Errorf("实际衔接内容不完整")
	}
	ref := snapshot.Work.Units[index]
	source := writingActualSource{UnitID: ref.ID, BodyVersionID: ref.VersionID, BodyHash: writingHash(unit.Body)}
	prior := ""
	if index > 0 {
		prior = snapshot.Work.Units[index-1].ContinuityIndex.ChainHash
	}
	ledger := writingContinuity{Source: source, PlanHash: writingPlanHash(ref), PriorChain: prior, Facts: result.Facts, CharacterChanges: result.CharacterChanges, Threads: result.Threads, Findings: result.Findings}
	ledger.ChainHash = writingChainHash(prior, source.BodyHash, ledger.PlanHash)
	quoteValid := func(quote string) bool { return strings.TrimSpace(quote) != "" && strings.Contains(unit.Body, quote) }
	for _, fact := range ledger.Facts {
		if strings.TrimSpace(fact.Text) == "" || !quoteValid(fact.Quote) {
			return unit, fmt.Errorf("实际事实缺少正文原句证据")
		}
	}
	known := map[string]bool{}
	for _, person := range snapshot.Work.Outline.Characters {
		known[person.ID] = true
	}
	seen := map[string]bool{}
	for i := range ledger.CharacterChanges {
		state := &ledger.CharacterChanges[i]
		key := state.CharacterID + "\x00" + state.Aspect + "\x00" + state.Key
		if !known[state.CharacterID] || (state.Aspect != "state" && state.Aspect != "knowledge") || strings.TrimSpace(state.Key) == "" || strings.TrimSpace(state.Value) == "" || !quoteValid(state.Quote) || seen[key] {
			return unit, fmt.Errorf("人物实际状态身份、主题或证据无效")
		}
		seen[key] = true
		state.Source = source
	}
	knownThreads := map[string]bool{}
	for _, group := range [][]writingThread{history.OpenThreads, history.ResolvedThreads} {
		for _, thread := range group {
			knownThreads[thread.ID] = true
		}
	}

	seen = map[string]bool{}
	for i := range ledger.Threads {
		thread := &ledger.Threads[i]
		if thread.ID == "" {
			for _, old := range history.ResolvedThreads {
				if strings.TrimSpace(old.Text) == strings.TrimSpace(thread.Text) {
					return unit, fmt.Errorf("已解决线索不能作为全新线索重新埋设")
				}
			}
			if thread.Status == "resolved" {
				return unit, fmt.Errorf("不能解决没有来源身份的线索")
			}
			thread.ID = uuid.NewString()
		} else if !knownThreads[thread.ID] {
			return unit, fmt.Errorf("线索不属于此前未解事项")
		}
		if (thread.Status != "open" && thread.Status != "resolved") || strings.TrimSpace(thread.Text) == "" || !quoteValid(thread.Quote) || seen[thread.ID] {
			return unit, fmt.Errorf("线索状态或正文证据无效")
		}
		seen[thread.ID] = true
		thread.Source = source
	}
	for _, finding := range ledger.Findings {
		if (finding.Code != "plan_coverage" && finding.Code != "continuity") || strings.TrimSpace(finding.Message) == "" || !quoteValid(finding.Evidence) {
			return unit, fmt.Errorf("衔接核对问题缺少有效正文证据")
		}
	}
	if (index+1)%writingContinuityCheckpointInterval == 0 {
		applyWritingActualDelta(&history, ledger)
		ledger.Checkpoint = &writingHistoryCheckpoint{ThroughUnitID: ref.ID, ChainHash: ledger.ChainHash, Characters: history.Characters, OpenThreads: history.OpenThreads, ResolvedThreads: history.ResolvedThreads}
	}
	unit.Synopsis = result.Synopsis
	unit.EndState = result.EndState
	unit.Continuity = &ledger
	unit.ContinuityValid = true
	unit.Ending = writingEnding(unit.Body, "")
	apply := history
	if ledger.Checkpoint == nil {
		applyWritingActualDelta(&apply, ledger)
	}
	threadTexts := []string{}
	for _, thread := range apply.OpenThreads {
		threadTexts = append(threadTexts, thread.Text)
	}
	unit.OpenThreads = strings.Join(threadTexts, "\n")
	if index > 0 {
		unit.PredecessorVersionID = snapshot.Work.Units[index-1].VersionID
	}
	return unit, nil
}
