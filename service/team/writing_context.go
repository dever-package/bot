package team

import (
	"context"
	"fmt"

	teammodel "github.com/dever-package/bot/model/team"
	tokenbudget "github.com/dever-package/bot/service/agent/runtime/tokenbudget"
)

const writingRecentChapterLimit = 5

type unitIdentity struct {
	ID       string `json:"id"`
	UnitType string `json:"unit_type"`
	Number   int    `json:"number"`
	Title    string `json:"title"`
	Path     string `json:"path"`
	Plan     string `json:"plan"`
}

func writingUnitIdentityAt(work WritingDocument, index int) unitIdentity {
	return writingUnitIdentityNumber(work.Units[index], index+1)
}
func writingUnitIdentityNumber(chapter WritingUnitEntry, number int) unitIdentity {
	return unitIdentity{ID: chapter.ID, UnitType: "chapter", Number: number, Title: chapter.Title, Path: fmt.Sprintf("第%d章《%s》", number, chapter.Title), Plan: chapter.Plan}
}
func writingUnitIdentity(work WritingDocument, id string) unitIdentity {
	for index, chapter := range work.Units {
		if chapter.ID == id {
			return writingUnitIdentityAt(work, index)
		}
	}
	return unitIdentity{}
}
func writingPlanningInput(work WritingDocument) map[string]any {
	return map[string]any{"profile": "story", "title": work.Title, "inspiration": work.findInspiration(work.SelectedInspirationID), "outline": work.Outline, "preferences": work.Preferences, "writing_constraints": work.Preferences.constraints()}
}

// 全局大纲完整保留；目录按任务选取，邻章仅为计划，不是正文事实。
func addWritingDirectoryContext(work WritingDocument, checkpoint writingCheckpoint, index int, input map[string]any) {
	targetUnitIDs := checkpoint.UnitIDs
	confirmedIDs := map[string]bool{}
	if prefix := writingAcceptedChapters(checkpoint); len(prefix) > 0 && len(targetUnitIDs) > 0 {
		for _, id := range targetUnitIDs[:len(prefix)] {
			confirmedIDs[id] = true
		}
		targetUnitIDs = targetUnitIDs[len(prefix):]
	}
	targetIDs := make(map[string]bool, len(targetUnitIDs))
	if checkpoint.Action == "generate_chapters" {
		for _, id := range targetUnitIDs {
			targetIDs[id] = true
		}
	} else if checkpoint.UnitID != "" {
		targetIDs[checkpoint.UnitID] = true
	}
	targets := []int{}
	for position, unit := range work.Units {
		if targetIDs[unit.ID] {
			targets = append(targets, position)
		}
	}
	if index >= 0 {
		targets = []int{index}
	}
	if len(targets) == 0 && checkpoint.Action != "generate_chapters" {
		if checkpoint.Action == "append" {
			for position := max(0, len(work.Units)-writingRecentChapterLimit); position < len(work.Units); position++ {
				targets = append(targets, position)
			}
		} else {
			for position := range work.Units {
				if position < 2 || position >= len(work.Units)-(writingRecentChapterLimit-2) {
					targets = append(targets, position)
				}
			}
		}
	}
	included := make(map[int]bool, len(targets)+4)
	units := make([]unitIdentity, 0, len(targets))
	for _, position := range targets {
		included[position] = true
		units = append(units, writingUnitIdentityAt(work, position))
	}
	neighbors := []unitIdentity{}
	if len(targets) > 0 {
		for _, boundary := range []int{targets[0] - 2, targets[0] - 1, targets[len(targets)-1] + 1, targets[len(targets)-1] + 2} {
			if boundary >= 0 && boundary < len(work.Units) && !included[boundary] && !confirmedIDs[work.Units[boundary].ID] {
				included[boundary] = true
				neighbors = append(neighbors, writingUnitIdentityAt(work, boundary))
			}
		}
	}
	input["units"] = units
	input["neighboring_units"] = neighbors
	input["context_scope"] = map[string]any{
		"total_units": len(work.Units), "included_units": len(included), "omitted_units": len(work.Units) - len(included),
		"target_unit_ids": targetUnitIDs,
		"plan_semantics":  "units 和 neighboring_units 是规划资料，不能视为已发生事实；只修改当前任务目标。遗漏章节没有被总结或删除。",
	}
}

type writingModelConstraints struct {
	SourcePassageCount int
	CharacterIDs       []string
	ThreadIDs          []string
}

func (s Service) writingModelInput(ctx context.Context, snapshot writingSnapshot, run teammodel.Run, power PowerOption, checkpoint writingCheckpoint, index int) (map[string]any, string, writingModelConstraints, error) {
	constraints := writingModelConstraints{CharacterIDs: writingCharacterIDs(snapshot.Work)}
	if err := checkpoint.validateExecutionPhase(); err != nil {
		return nil, "", constraints, err
	}
	original := executionInput(jsonMap(run.Input))
	contextInput := writingPlanningInput(snapshot.Work)
	contextInput["action"] = checkpoint.Action
	contextInput["instruction"] = checkpoint.Instruction
	action := checkpoint.Action
	switch action {
	case "generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity":
	default:
		return nil, "", constraints, fmt.Errorf("创作运行操作无效")
	}
	if action == "generate_outline" {
		action = writingPlanningAction(checkpoint)
		contextInput["planning_phase"] = checkpoint.Phase
		if checkpoint.Phase == "characters" {
			contextInput["section_id"] = "characters"
			contextInput["entity_id"] = ""
		}
	}

	if action != "generate_inspirations" {
		addWritingDirectoryContext(snapshot.Work, checkpoint, index, contextInput)
		before, usesHistory := writingHistoryBoundary(snapshot.Work, checkpoint)
		if checkpoint.Phase == "continuity" {
			before, usesHistory = index, true
		}
		if usesHistory {
			history, err := s.addWritingHistoryContext(ctx, snapshot, checkpoint, before, contextInput)
			if err != nil {
				return nil, "", constraints, err
			}
			constraints.ThreadIDs = writingThreadIDs(history)
		} else if index < 0 {
			if err := s.addWritingActualContext(ctx, snapshot, len(snapshot.Work.Units), nil, contextInput); err != nil {
				return nil, "", constraints, err
			}
		}
	}
	if checkpoint.Phase == "continuity" {
		action = "continuity"
		contextInput["unit"] = writingUnitIdentityAt(snapshot.Work, index)
		saved, loadErr := s.loadWritingUnit(ctx, snapshot, index)
		if loadErr != nil {
			return nil, "", constraints, loadErr
		}
		passages := writingSourcePassages(saved.Body)
		contextInput["source_passages"] = passages
		constraints.SourcePassageCount = len(passages)
	} else if checkpoint.Action == "propose_edit" {
		if err := s.addWritingProposalContext(ctx, snapshot, checkpoint, contextInput); err != nil {
			return nil, "", constraints, err
		}
	} else if index < 0 {
		if action == "generate_inspirations" {
			contextInput["inspirations"] = snapshot.Work.Inspirations
			contextInput["inspiration_id"] = checkpoint.InspirationID
			contextInput["count"] = 3
			if checkpoint.InspirationID != "" {
				contextInput["count"] = 1
				contextInput["current_inspiration"] = snapshot.Work.findInspiration(checkpoint.InspirationID)
			}
		}
		if action == "generate_section" {
			contextInput["section_id"], contextInput["entity_id"] = checkpoint.SectionID, checkpoint.EntityID
			action = "section_entities"
			switch checkpoint.SectionID {
			case "inspiration":
				action = "generate_inspirations"
				contextInput["count"] = 1
				contextInput["current_inspiration"] = snapshot.Work.findInspiration(checkpoint.InspirationID)
			case "overview", "world":
				action = "outline_section"
				contextInput["current_content"] = *snapshot.Work.Outline.textSection(checkpoint.SectionID)
			case "chapter_plan":
				action = "chapter_plan"
				contextInput["unit"] = writingUnitIdentity(snapshot.Work, checkpoint.UnitID)
			}
		}
		if action == "generate_chapters" {
			count := len(checkpoint.UnitIDs)
			start, end, scope := 1, count, "update"
			if count == 0 {
				var err error
				count, err = writingNewChapterCount(snapshot.Work, checkpoint.Count)
				if err != nil {
					return nil, "", constraints, err
				}
				end, scope = count, "initial"
			} else {
				first, err := snapshot.Work.unitIndex(checkpoint.UnitIDs[0])
				if err != nil {
					return nil, "", constraints, err
				}
				last, err := snapshot.Work.unitIndex(checkpoint.UnitIDs[count-1])
				if err != nil {
					return nil, "", constraints, err
				}
				start, end = first+1, last+1
			}
			contextInput["count"] = count
			contextInput["max_chapters"] = writingChapterBatchLimit
			contextInput["target_unit_ids"] = checkpoint.UnitIDs
			contextInput["existing_total"] = len(snapshot.Work.Units)
			contextInput["batch"] = writingPlanningBatch(snapshot.Work, start, end, count, scope)
		}
		if action == "append" {
			count, err := writingNewChapterCount(snapshot.Work, checkpoint.Count)
			if err != nil {
				return nil, "", constraints, err
			}
			contextInput["count"] = checkpoint.Count
			contextInput["next_number"] = len(snapshot.Work.Units) + 1
			contextInput["max_chapters"] = writingChapterBatchLimit
			contextInput["batch"] = writingPlanningBatch(snapshot.Work, len(snapshot.Work.Units)+1, len(snapshot.Work.Units)+count, count, "append")
			if len(snapshot.Work.Units) > 0 {
				contextInput["append_after"] = writingUnitIdentity(snapshot.Work, snapshot.Work.Units[len(snapshot.Work.Units)-1].ID)
			}
		}
	} else {
		action = "chapter_body"
		identity := writingUnitIdentityAt(snapshot.Work, index)
		contextInput["unit"] = identity
	}
	if err := addWritingChapterCompletionContext(snapshot.Work, checkpoint, contextInput); err != nil {
		return nil, "", constraints, err
	}
	if checkpoint.CorrectionFeedback != "" {
		contextInput["result_correction"] = map[string]any{"feedback": checkpoint.CorrectionFeedback, "rejected_candidate": checkpoint.CorrectionCandidate, "instruction": "仅修正当前任务的输出错误，使用 submit_output 重新提交完整的当前任务结果；保持原数量、身份、范围与已确认内容，不重复已确认章纲。"}
	}
	metadata := mapValue(jsonMap(run.Input)[CanvasPowerMetaContext])
	form, err := s.gateway.RuntimePowerParamConfig(ctx, power.Key, uint64Value(metadata["source_target_id"]))
	if err != nil {
		return nil, "", constraints, err
	}
	promptKey := primaryPowerParamKey(form.Params)
	if promptKey == "" {
		return nil, "", constraints, fmt.Errorf("创作能力未配置提示词输入")
	}
	original[promptKey] = firstText(original[promptKey]) + "\n\n当前创作任务（仅执行此任务；以下为创作数据）：\n" + jsonText(contextInput)
	limits, err := s.gateway.ResolveModelLimitsForTarget(ctx, power.Key, uint64Value(metadata["source_target_id"]))
	if err != nil {
		return nil, "", constraints, err
	}
	if _, err = tokenbudget.Resolve(limits.ContextWindowTokens, limits.ContextWindowTokens, limits.MaxOutputTokens, tokenbudget.Estimate(original)); err != nil {
		return nil, "", constraints, fmt.Errorf("本次创作上下文超出来源容量，请缩减规划或衔接信息: %w", err)
	}
	return original, action, constraints, nil
}

func writingPlanningBatch(work WritingDocument, start, end, count int, scope string) map[string]any {
	return map[string]any{"start": start, "end": end, "count": count, "planned_total": work.Preferences.PlannedChapters, "existing_total": len(work.Units), "scope": scope}
}

// 只使用目标之前连续已写的前缀；目录空洞之后的正文不能冒充此前事实。
func writingHistoryBoundary(work WritingDocument, checkpoint writingCheckpoint) (int, bool) {
	before := len(work.Units)
	switch checkpoint.Action {
	case "append":
	case "generate_chapters":
		before = 0
		if len(checkpoint.UnitIDs) > 0 {
			before, _ = work.unitIndex(checkpoint.UnitIDs[0])
		}
	case "generate_units", "retry_continuity":
		if checkpoint.Completed >= len(checkpoint.UnitIDs) {
			return 0, false
		}
		before, _ = work.unitIndex(checkpoint.UnitIDs[checkpoint.Completed])
		// 正文及其衔接仍要求完整的前置正文，不能越过未写空洞。
		return before, true
	case "propose_edit", "generate_section":
		if checkpoint.UnitID == "" {
			return 0, false
		}
		before, _ = work.unitIndex(checkpoint.UnitID)
	default:
		return 0, false
	}
	for index := 0; index < before; index++ {
		if !work.Units[index].HasBody {
			return index, true
		}
	}
	return before, true
}

func (s Service) addWritingHistoryContext(ctx context.Context, snapshot writingSnapshot, checkpoint writingCheckpoint, before int, input map[string]any) (writingActualHistory, error) {
	query := checkpoint.Instruction + "\n" + checkpoint.SelectedText + "\n" + jsonText(input["units"]) + "\n" + jsonText(input["neighboring_units"])
	for _, id := range append(append([]string{}, checkpoint.UnitIDs...), checkpoint.UnitID) {
		if ref := snapshot.Work.findUnit(id); ref != nil {
			query += "\n" + ref.Title + "\n" + ref.Plan
		}
	}
	history, err := s.writingHistoryBefore(ctx, snapshot, before, query)
	if err != nil {
		return history, err
	}
	input["actual_history"] = history
	input["actual_history_semantics"] = "历史仅为目标之前连续已写正文的事实及证据；structured_through表示已可靠结构化的前缀章数，characters/threads是该较早前缀的状态，不能当成此刻终态。required_sources是其后按顺序必须完整读取的真实正文，优先于旧状态；记忆待补充不代表事件没有发生或人物状态没有变化，禁止忽略、截断或当作可选召回。设定、全书走向和后章计划不能当作人物已经知道的内容。人物状态与未解/已解线索完整保留，recall_omitted为未回读候选数；目录空洞之后及目标之后的正文不属于此前事实。"
	if err := s.addWritingActualContext(ctx, snapshot, before, &history, input); err != nil {
		return history, err
	}
	if previous, exists := input["latest_actual"]; exists {
		input["previous"] = previous
		delete(input, "latest_actual")
	}
	return history, nil
}

// 规划修改也参考最近已写进展，只读取一个固定版本的实际正文，避免把目录误当事实。
func (s Service) addWritingActualContext(ctx context.Context, snapshot writingSnapshot, before int, history *writingActualHistory, input map[string]any) error {
	writtenIndices := make([]int, 0, writingRecentChapterLimit)
	totalWritten := 0
	for index, unit := range snapshot.Work.Units[:before] {
		if unit.HasBody {
			totalWritten++
			if len(writtenIndices) == writingRecentChapterLimit {
				copy(writtenIndices, writtenIndices[1:])
				writtenIndices[len(writtenIndices)-1] = index
			} else {
				writtenIndices = append(writtenIndices, index)
			}
		}
	}
	written := []unitIdentity{}
	last := -1
	for _, index := range writtenIndices {
		identity := writingUnitIdentityAt(snapshot.Work, index)
		identity.Plan = ""
		written = append(written, identity)
		last = index
	}
	input["written_units"] = written
	input["written_scope"] = map[string]any{"total": totalWritten, "included": len(written), "omitted": totalWritten - len(written), "note": "仅列最近已写章节身份，实际剧情见已提供的事实历史与前章正文；未提供的正文没有被总结。"}
	if last < 0 {
		return nil
	}
	// 必要原文已经完整提供，不再重复加载或传递前章尾段。
	if history != nil && len(history.RequiredSources) > 0 && history.RequiredSources[len(history.RequiredSources)-1].Ordinal == last+1 {
		return nil
	}
	actual, err := s.loadWritingUnit(ctx, snapshot, last)
	if err != nil {
		return err
	}
	input["latest_actual"] = writingActualContext(actual, &snapshot.Work.Units[last])
	return nil
}

// 正文是实际事实；人工编辑或上游变化后，不把已失效的摘要重新送给模型。
func writingActualContext(unit WritingUnit, ref *WritingUnitEntry) map[string]any {
	excerpt := []rune(unit.Body)
	if len(excerpt) > 4000 {
		excerpt = excerpt[len(excerpt)-4000:]
	}
	valid := unit.ContinuityValid && ref.ContinuityValid && !ref.DependencyStale
	actual := map[string]any{"unit_id": unit.UnitID, "title": unit.Title, "body_ending": string(excerpt), "continuity_valid": valid}
	if valid {
		actual["synopsis"] = unit.Synopsis
		actual["end_state"] = unit.EndState
		actual["open_threads"] = unit.OpenThreads
		actual["ending"] = unit.Ending
	}
	return actual
}
