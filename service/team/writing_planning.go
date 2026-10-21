package team

import (
	"encoding/json"
	"fmt"
	"slices"
	"strings"

	"github.com/google/uuid"
)

// 目录更新必须明确且有界；返回规范阅读顺序，作为模型、流式和结果合并的共同范围。
func writingChapterTargets(work WritingDocument, command WritingCommand) ([]string, error) {
	if command.Count < 0 || command.Count > writingChapterBatchLimit {
		return nil, fmt.Errorf("一次最多规划 %d 章，请先生成不超过 %d 章，再分批追加（每次 1 到 20 章）", writingChapterBatchLimit, writingChapterBatchLimit)
	}
	if len(work.Units) == 0 {
		if len(command.UnitIDs) != 0 {
			return nil, fmt.Errorf("目标章节不存在")
		}
		_, err := writingNewChapterCount(work, command.Count)
		return nil, err
	}
	if len(command.UnitIDs) == 0 && len(work.Units) > writingChapterBatchLimit {
		return nil, fmt.Errorf("章节较多，请在章节列表选择当前页更新章纲，每次最多 %d 章", writingChapterBatchLimit)
	}
	if len(command.UnitIDs) > writingChapterBatchLimit {
		return nil, fmt.Errorf("一次最多更新 %d 章章纲，请缩小目标范围", writingChapterBatchLimit)
	}
	requested := make(map[string]bool, len(command.UnitIDs))
	for _, id := range command.UnitIDs {
		if id == "" || requested[id] {
			return nil, fmt.Errorf("目标章节身份为空或重复")
		}
		requested[id] = true
	}
	targets := make([]string, 0, min(len(work.Units), writingChapterBatchLimit))
	for _, unit := range work.Units {
		if len(requested) == 0 || requested[unit.ID] {
			targets = append(targets, unit.ID)
		}
	}
	if len(requested) > 0 && len(targets) != len(requested) {
		return nil, fmt.Errorf("目标章节不存在，目录可能已更新")
	}
	if command.Count != 0 && command.Count != len(targets) {
		return nil, fmt.Errorf("章纲更新数量必须与目标章节数一致")
	}
	return targets, nil
}

// 详细章纲是有界批次；明确请求不能被截断成另一段范围。
func writingNewChapterCount(work WritingDocument, requested int) (int, error) {
	count := requested
	if count == 0 {
		count = writingInitialChapterCount(work.Preferences)
		if planned := work.Preferences.PlannedChapters; planned > 0 {
			count = min(count, max(0, planned-len(work.Units)))
		}
	}
	if count < 1 || count > writingChapterBatchLimit {
		return 0, fmt.Errorf("每批规划数量须为 1 到 %d；计划章数已达上限时请先调整写作设定", writingChapterBatchLimit)
	}
	if planned := work.Preferences.PlannedChapters; planned > 0 && len(work.Units)+count > planned {
		return 0, fmt.Errorf("已规划 %d 章，本批 %d 章将超过计划总数 %d，请调整批次或写作设定", len(work.Units), count, planned)
	}
	return count, nil
}

// 草稿可分步保存；生成动作另行校验其所需前置内容。
func (work *WritingDocument) saveDocument(proposed WritingDocument) error {
	raw, err := json.Marshal(proposed)
	if err != nil {
		return err
	}
	if err = json.Unmarshal(raw, &proposed); err != nil {
		return err
	}
	if proposed.Type != "story" || work.Type != "story" || proposed.SchemaVersion != 1 {
		return fmt.Errorf("创作类型不匹配")
	}
	if err := proposed.Preferences.validate(); err != nil {
		return err
	}
	if err := normalizeWritingInspirations(&proposed, *work); err != nil {
		return err
	}
	if err := normalizeWritingEntities(&proposed.Outline.WritingEntities, work.Outline.WritingEntities); err != nil {
		return err
	}
	if err := work.replaceDirectory(proposed.Units); err != nil {
		return err
	}
	outlineChanged := jsonText(work.Outline) != jsonText(proposed.Outline)
	planningChanged := outlineChanged || work.Preferences != proposed.Preferences
	work.Title = strings.TrimSpace(proposed.Title)
	work.Inspirations = proposed.Inspirations
	work.SelectedInspirationID = proposed.SelectedInspirationID
	work.Outline = proposed.Outline
	work.Preferences = proposed.Preferences
	if outlineChanged {
		work.invalidateAfter(-1)
	}
	if planningChanged {
		// 设定只改变后续规划的有效性，不在保存时重写计划或正文。
		for _, directory := range [][]WritingUnitEntry{work.Units, work.ArchivedUnits} {
			for i := range directory {
				if !directory[i].HasBody {
					directory[i].PlanStale = true
				}
			}
		}
	}
	work.Status = "ready"
	return nil
}
func (work WritingDocument) findInspiration(id string) *WritingInspiration {
	for i := range work.Inspirations {
		if work.Inspirations[i].ID == id {
			return &work.Inspirations[i]
		}
	}
	return nil
}
func (work WritingDocument) requireSelectedInspiration() error {
	candidate := work.findInspiration(work.SelectedInspirationID)
	if candidate == nil || strings.TrimSpace(candidate.Title) == "" || strings.TrimSpace(candidate.Content) == "" {
		return fmt.Errorf("请先选用一个完整灵感")
	}
	return nil
}

// 选用成功后方向固定，灵感编辑和重新选用都不能开启第二次选择。
func (work WritingDocument) requireEditableInspirations() error {
	if work.SelectedInspirationID != "" {
		return fmt.Errorf("故事方向已选定，不能修改、重新生成或再次选用灵感")
	}
	return nil
}

// 普通保存和历史恢复共用方向校验；后续规划、设定及正文仍可独立更新。
func (work WritingDocument) preserveSelectedInspiration(proposed WritingDocument) error {
	if work.SelectedInspirationID == "" {
		return nil
	}
	current := work.findInspiration(work.SelectedInspirationID)
	next := proposed.findInspiration(proposed.SelectedInspirationID)
	if current == nil || next == nil || *current != *next {
		return fmt.Errorf("故事方向已选定，保存或恢复不能改变选定灵感")
	}
	return nil
}

func normalizeWritingInspirations(proposed *WritingDocument, previous WritingDocument) error {
	if err := previous.preserveSelectedInspiration(*proposed); err != nil {
		return err
	}
	if previous.SelectedInspirationID != "" && !slices.Equal(proposed.Inspirations, previous.Inspirations) {
		return fmt.Errorf("故事方向已选定，不能修改灵感候选")
	}
	if proposed.Inspirations == nil {
		proposed.Inspirations = []WritingInspiration{}
	}
	if len(proposed.Inspirations) != len(previous.Inspirations) {
		return fmt.Errorf("灵感候选不能通过保存增加或删除")
	}
	seen := map[string]bool{}
	for i := range proposed.Inspirations {
		candidate := &proposed.Inspirations[i]
		if candidate.ID == "" || previous.findInspiration(candidate.ID) == nil || seen[candidate.ID] {
			return fmt.Errorf("灵感身份不存在或重复")
		}
		seen[candidate.ID] = true
	}
	if proposed.SelectedInspirationID != previous.SelectedInspirationID {
		return fmt.Errorf("请使用选用灵感操作切换创作方向")
	}
	return nil
}
func normalizeWritingEntities(proposed *WritingEntities, previous WritingEntities) error {
	known := map[string]int{}
	seen := map[string]bool{}
	for kind, group := range [][]WritingEntity{previous.Characters, previous.Locations, previous.Props} {
		for _, entity := range group {
			known[entity.ID] = kind
		}
	}
	for kind, group := range []*[]WritingEntity{&proposed.Characters, &proposed.Locations, &proposed.Props} {
		if *group == nil {
			*group = []WritingEntity{}
		}
		for i := range *group {
			entity := &(*group)[i]
			entity.Name = strings.TrimSpace(entity.Name)
			if entity.Name == "" {
				return fmt.Errorf("角色、场景或道具名称不能为空")
			}
			if seen[entity.ID] && entity.ID != "" {
				return fmt.Errorf("实体身份重复")
			}
			submittedID := entity.ID
			if entity.ID == "" || strings.HasPrefix(entity.ID, "new:") && len(entity.ID) > 4 {
				entity.ID = uuid.NewString()
			} else if previousKind, exists := known[entity.ID]; !exists || previousKind != kind {
				return fmt.Errorf("实体身份不存在或类型已改变，新实体请使用临时身份")
			}
			if seen[entity.ID] {
				return fmt.Errorf("实体身份重复")
			}
			if submittedID != "" {
				seen[submittedID] = true
			}
			seen[entity.ID] = true
		}
	}
	return nil
}
func (work *WritingDocument) replaceDirectory(proposed []WritingUnitEntry) error {
	previous := map[string]WritingUnitEntry{}
	for _, group := range [][]WritingUnitEntry{work.ArchivedUnits, work.Units} {
		for _, unit := range group {
			previous[unit.ID] = unit
		}
	}
	seen := map[string]bool{}
	if proposed == nil {
		proposed = []WritingUnitEntry{}
	}
	for i := range proposed {
		unit := &proposed[i]
		if unit.UnitType != "chapter" || len(unit.Children) > 0 {
			return fmt.Errorf("故事目录只能包含章节")
		}
		old, exists := previous[unit.ID]
		if unit.ID == "" || strings.HasPrefix(unit.ID, "new:") && len(unit.ID) > 4 {
			if seen[unit.ID] && unit.ID != "" {
				return fmt.Errorf("目录身份重复")
			}
			submittedID := unit.ID
			unit.ID = uuid.NewString()
			if submittedID != "" {
				seen[submittedID] = true
			}
		} else if !exists {
			return fmt.Errorf("目录身份不存在，新章节请留空 ID")
		}
		if seen[unit.ID] {
			return fmt.Errorf("目录身份重复")
		}
		seen[unit.ID] = true
		unit.Children = []WritingUnitEntry{}
		unit.AssetID, unit.VersionID = old.AssetID, old.VersionID
		unit.HasBody = old.HasBody
		unit.ContinuityValid = old.ContinuityValid
		unit.ContinuityIndex = old.ContinuityIndex
		unit.ContinuityStatus = old.ContinuityStatus
		unit.ContinuityFindings = old.ContinuityFindings
		unit.DependencyStale = old.DependencyStale
		// 普通保存不能把服务端的待同步标记清掉；实际修改本章计划才算人工确认。
		unit.PlanStale = old.PlanStale && old.Plan == unit.Plan
	}
	oldPredecessor := map[string]string{}
	prior := ""
	for _, unit := range work.Units {
		oldPredecessor[unit.ID] = prior
		prior = unit.ID
	}
	archived := archiveWritingDirectory(work.ArchivedUnits, work.Units, seen)
	work.Units, work.ArchivedUnits = proposed, archived
	prior = ""
	changed := false
	for i := range work.Units {
		unit := &work.Units[i]
		old := previous[unit.ID]
		changed = changed || oldPredecessor[unit.ID] != prior || old.Plan != unit.Plan || old.Title != unit.Title
		if changed && unit.VersionID > 0 {
			unit.DependencyStale = true
			unit.ContinuityStatus = "pending"
		}
		prior = unit.ID
	}
	return nil
}

// 删除章节只移出活动目录，仍保留其固定正文版本供历史恢复。
func archiveWritingDirectory(archived, current []WritingUnitEntry, active map[string]bool) []WritingUnitEntry {
	roots := []WritingUnitEntry{}
	seen := map[string]bool{}
	for _, source := range [][]WritingUnitEntry{archived, current} {
		for _, unit := range source {
			if !active[unit.ID] && !seen[unit.ID] {
				roots = append(roots, unit)
				seen[unit.ID] = true
			}
		}
	}
	return roots
}

// 历史快照允许未完成阶段，但身份和固定正文引用仍需有效。
func validateWritingSnapshot(work WritingDocument) error {
	if work.Type != "story" || work.SchemaVersion != 1 {
		return fmt.Errorf("故事快照类型无效")
	}
	if err := work.Preferences.validate(); err != nil {
		return err
	}
	seen := map[string]bool{}
	for _, candidate := range work.Inspirations {
		if candidate.ID == "" || seen[candidate.ID] {
			return fmt.Errorf("灵感身份无效")
		}
		seen[candidate.ID] = true
	}
	if work.SelectedInspirationID != "" && !seen[work.SelectedInspirationID] {
		return fmt.Errorf("选用灵感不存在")
	}
	seen = map[string]bool{}
	for _, group := range [][]WritingUnitEntry{work.Units, work.ArchivedUnits} {
		for _, unit := range group {
			if unit.ID == "" || seen[unit.ID] || unit.UnitType != "chapter" || len(unit.Children) != 0 || (unit.AssetID == 0) != (unit.VersionID == 0) || (unit.HasBody && unit.VersionID == 0) {
				return fmt.Errorf("章节身份或正文引用无效")
			}
			seen[unit.ID] = true
		}
	}
	seen = map[string]bool{}
	for _, group := range [][]WritingEntity{work.Outline.WritingEntities.Characters, work.Outline.WritingEntities.Locations, work.Outline.WritingEntities.Props} {
		for _, entity := range group {
			if entity.ID == "" || seen[entity.ID] {
				return fmt.Errorf("素材身份无效")
			}
			seen[entity.ID] = true
		}
	}
	return nil
}
