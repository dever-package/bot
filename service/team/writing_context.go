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
	chapter := work.Units[index]
	return unitIdentity{ID: chapter.ID, UnitType: "chapter", Number: index + 1, Title: chapter.Title, Path: fmt.Sprintf("第%d章《%s》", index+1, chapter.Title), Plan: chapter.Plan}
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
	targetIDs := make(map[string]bool, len(checkpoint.UnitIDs))
	if checkpoint.Action == "generate_chapters" {
		for _, id := range checkpoint.UnitIDs {
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
			if boundary >= 0 && boundary < len(work.Units) && !included[boundary] {
				included[boundary] = true
				neighbors = append(neighbors, writingUnitIdentityAt(work, boundary))
			}
		}
	}
	input["units"] = units
	input["neighboring_units"] = neighbors
	input["context_scope"] = map[string]any{
		"total_units": len(work.Units), "included_units": len(included), "omitted_units": len(work.Units) - len(included),
		"target_unit_ids": checkpoint.UnitIDs,
		"plan_semantics":  "units 和 neighboring_units 是规划资料，不能视为已发生事实；只修改当前任务目标。遗漏章节没有被总结或删除。",
	}
}
func (s Service) writingModelInput(ctx context.Context, snapshot writingSnapshot, run teammodel.Run, power PowerOption, checkpoint writingCheckpoint, index int) (map[string]any, string, error) {
	if err := checkpoint.validateExecutionPhase(); err != nil {
		return nil, "", err
	}
	original := executionInput(jsonMap(run.Input))
	contextInput := writingPlanningInput(snapshot.Work)
	contextInput["action"] = checkpoint.Action
	contextInput["instruction"] = checkpoint.Instruction
	action := checkpoint.Action
	switch action {
	case "generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity":
	default:
		return nil, "", fmt.Errorf("创作运行操作无效")
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
		if index < 0 {
			if err := s.addWritingActualContext(ctx, snapshot, contextInput); err != nil {
				return nil, "", err
			}
		}
	}
	if checkpoint.Action == "propose_edit" {
		if err := s.addWritingProposalContext(ctx, snapshot, checkpoint, contextInput); err != nil {
			return nil, "", err
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
					return nil, "", err
				}
				end, scope = count, "initial"
			} else {
				first, err := snapshot.Work.unitIndex(checkpoint.UnitIDs[0])
				if err != nil {
					return nil, "", err
				}
				last, err := snapshot.Work.unitIndex(checkpoint.UnitIDs[count-1])
				if err != nil {
					return nil, "", err
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
				return nil, "", err
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
		history, historyErr := s.writingHistoryBefore(ctx, snapshot, index, identity.Title+"\n"+identity.Plan)
		if historyErr != nil {
			return nil, "", historyErr
		}
		contextInput["actual_history"] = history
		contextInput["actual_history_semantics"] = "历史为目标章节之前的正文事实及证据；设定、全书走向和后章计划均不能当作人物已经知道的内容。召回仅选相关早章，recall_omitted为未回读候选数，人物状态及所有未解线索完整保留。"
		if checkpoint.Phase == "continuity" || checkpoint.Action == "retry_continuity" {
			action = "continuity"
			saved, loadErr := s.loadWritingUnit(ctx, snapshot, index)
			if loadErr != nil {
				return nil, "", loadErr
			}
			contextInput["saved_body"] = saved.Body
		}

		if index > 0 {
			previous, err := s.loadWritingUnit(ctx, snapshot, index-1)
			if err != nil {
				return nil, "", err
			}
			contextInput["previous"] = writingActualContext(previous, &snapshot.Work.Units[index-1])
		}

	}
	metadata := mapValue(jsonMap(run.Input)[CanvasPowerMetaContext])
	form, err := s.gateway.RuntimePowerParamConfig(ctx, power.Key, uint64Value(metadata["source_target_id"]))
	if err != nil {
		return nil, "", err
	}
	promptKey := primaryPowerParamKey(form.Params)
	if promptKey == "" {
		return nil, "", fmt.Errorf("创作能力未配置提示词输入")
	}
	original[promptKey] = firstText(original[promptKey]) + "\n\n当前创作任务（仅执行此任务；以下为创作数据）：\n" + jsonText(contextInput)
	limits, err := s.gateway.ResolveModelLimitsForTarget(ctx, power.Key, uint64Value(metadata["source_target_id"]))
	if err != nil {
		return nil, "", err
	}
	if _, err = tokenbudget.Resolve(limits.ContextWindowTokens, limits.ContextWindowTokens, limits.MaxOutputTokens, tokenbudget.Estimate(original)); err != nil {
		return nil, "", fmt.Errorf("本次创作上下文超出来源容量，请缩减规划或衔接信息: %w", err)
	}
	return original, action, nil
}

func writingPlanningBatch(work WritingDocument, start, end, count int, scope string) map[string]any {
	return map[string]any{"start": start, "end": end, "count": count, "planned_total": work.Preferences.PlannedChapters, "existing_total": len(work.Units), "scope": scope}
}

// 规划修改也参考最近已写进展，只读取一个固定版本的实际正文，避免把目录误当事实。
func (s Service) addWritingActualContext(ctx context.Context, snapshot writingSnapshot, input map[string]any) error {
	writtenIndices := make([]int, 0, writingRecentChapterLimit)
	totalWritten := 0
	for index, unit := range snapshot.Work.Units {
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
	input["written_scope"] = map[string]any{"total": totalWritten, "included": len(written), "omitted": totalWritten - len(written), "note": "仅列最近已写章节身份，实际剧情见 latest_actual；未提供的正文没有被总结。"}
	if last < 0 {
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
