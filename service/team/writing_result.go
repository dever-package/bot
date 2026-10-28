package team

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

func applyWritingPlanningResult(work *WritingDocument, checkpoint writingCheckpoint, candidate map[string]any) error {
	raw, err := json.Marshal(candidate)
	if err != nil {
		return err
	}
	switch checkpoint.Action {
	case "generate_section":
		return applyWritingSectionResult(work, checkpoint, raw)
	case "generate_inspirations":
		return applyWritingInspirations(work, checkpoint.InspirationID, raw)
	case "generate_outline":
		return applyWritingPlanningPhase(work, checkpoint, candidate)
	case "generate_chapters":
		var result struct {
			Units []WritingUnitEntry `json:"units"`
		}
		if err := json.Unmarshal(raw, &result); err != nil {
			return err
		}
		if len(candidate) != 1 {
			return fmt.Errorf("章纲结果只允许章节目录")
		}
		return applyWritingChapterResult(work, checkpoint, result.Units)
	case "append":
		if _, err := writingNewChapterCount(*work, checkpoint.Count); err != nil {
			return err
		}
		var result struct {
			Units []WritingUnitEntry `json:"units"`
		}
		if err := json.Unmarshal(raw, &result); err != nil {
			return err
		}
		if len(candidate) != 1 {
			return fmt.Errorf("追加章纲结果只允许章节目录")
		}
		if len(result.Units) != checkpoint.Count {
			return writingChapterCountError(checkpoint.Count, len(result.Units))
		}
		if err := validateGeneratedDirectory(*work, result.Units, false); err != nil {
			return err
		}
		proposed := *work
		proposed.Units = append(append([]WritingUnitEntry{}, work.Units...), result.Units...)
		return work.saveDocument(proposed)
	}
	return fmt.Errorf("规划操作无效")
}

func applyWritingChapterResult(work *WritingDocument, checkpoint writingCheckpoint, units []WritingUnitEntry) error {
	targets, err := writingChapterTargets(*work, WritingCommand{UnitIDs: checkpoint.UnitIDs, Count: checkpoint.Count})
	if err != nil {
		return err
	}
	if len(work.Units) == 0 {
		count, err := writingNewChapterCount(*work, checkpoint.Count)
		if err != nil {
			return err
		}
		if len(units) != count {
			return writingChapterCountError(count, len(units))
		}
		if err := validateGeneratedDirectory(*work, units, false); err != nil {
			return err
		}
		proposed := *work
		proposed.Units = units
		return work.saveDocument(proposed)
	}
	if len(units) != len(targets) {
		return writingChapterCountError(len(targets), len(units))
	}
	expected := make(map[string]bool, len(targets))
	for _, id := range targets {
		expected[id] = true
	}
	updates := make(map[string]WritingUnitEntry, len(units))
	for index, unit := range units {
		if !expected[unit.ID] || updates[unit.ID].ID != "" {
			return fmt.Errorf("章纲结果包含范围外、空白或重复章节身份")
		}
		if unit.ID != targets[index] {
			return fmt.Errorf("章纲结果顺序必须与目标章节一致，避免流式内容指向其他章节")
		}
		updates[unit.ID] = unit
	}
	targetWork := WritingDocument{}
	for _, unit := range work.Units {
		if expected[unit.ID] {
			targetWork.Units = append(targetWork.Units, unit)
		}
	}
	if err := validateGeneratedDirectory(targetWork, units, true); err != nil {
		return err
	}
	merged := append([]WritingUnitEntry{}, work.Units...)
	for i, previous := range merged {
		if update, exists := updates[previous.ID]; exists {
			merged[i] = update
		}
	}
	proposed := *work
	proposed.Units = merged
	if err := work.saveDocument(proposed); err != nil {
		return err
	}
	// 模型明确确认的目标可能与原章纲文字相同，也应解除该批次的待同步状态。
	for i := range work.Units {
		if expected[work.Units[i].ID] {
			work.Units[i].PlanStale = false
		}
	}
	return nil
}
func applyWritingInspirations(work *WritingDocument, id string, raw []byte) error {
	if err := work.requireEditableInspirations(); err != nil {
		return err
	}
	var result struct {
		Inspirations []WritingInspiration `json:"inspirations"`
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(raw, &result); err != nil {
		return err
	}
	if err := json.Unmarshal(raw, &fields); err != nil {
		return err
	}
	expected := 3
	if id != "" {
		expected = 1
	}
	if len(fields) != 1 || len(result.Inspirations) != expected {
		return fmt.Errorf("灵感数量与请求不符")
	}
	for i := range result.Inspirations {
		candidate := &result.Inspirations[i]
		if candidate.ID != "" || strings.TrimSpace(candidate.Title) == "" || strings.TrimSpace(candidate.Content) == "" {
			return fmt.Errorf("灵感应包含标题和内容，新身份必须留空")
		}
		candidate.ID = uuid.NewString()
	}
	if id == "" {
		if work.Outline.hasContent() || len(work.Units) > 0 {
			return fmt.Errorf("已有规划不能更换整批灵感")
		}
		work.Inspirations = result.Inspirations
		return nil
	}
	for i := range work.Inspirations {
		if work.Inspirations[i].ID == id {
			candidate := result.Inspirations[0]
			candidate.ID = id
			work.Inspirations[i] = candidate
			return nil
		}
	}
	return fmt.Errorf("灵感不存在")
}
func validateGeneratedDirectory(work WritingDocument, units []WritingUnitEntry, preserve bool) error {
	if len(units) == 0 {
		return fmt.Errorf("模型未返回章纲")
	}
	known := map[string]bool{}
	for _, unit := range work.Units {
		known[unit.ID] = true
	}
	seen := map[string]bool{}
	for _, unit := range units {
		if unit.UnitType != "chapter" || len(unit.Children) > 0 || strings.TrimSpace(unit.Title) == "" || strings.TrimSpace(unit.Plan) == "" || unit.AssetID != 0 || unit.VersionID != 0 || unit.HasBody || unit.ContinuityValid || unit.DependencyStale || unit.PlanStale {
			return fmt.Errorf("生成章纲内容或正文引用无效")
		}
		if unit.ID == "" {
			continue
		}
		if !preserve || !known[unit.ID] || seen[unit.ID] {
			return fmt.Errorf("模型不能伪造或重复章节身份")
		}
		seen[unit.ID] = true
	}
	if preserve && len(seen) != len(known) {
		return fmt.Errorf("重新生成章纲必须保留全部已有章节")
	}
	return nil
}
func preserveGeneratedEntities(proposed, previous WritingEntities) error {
	for i, group := range [][]WritingEntity{proposed.Characters, proposed.Locations, proposed.Props} {
		old := [][]WritingEntity{previous.Characters, previous.Locations, previous.Props}[i]
		known, seen := map[string]bool{}, map[string]bool{}
		for _, entity := range old {
			known[entity.ID] = true
		}
		for _, entity := range group {
			if entity.ID != "" {
				if !known[entity.ID] || seen[entity.ID] {
					return fmt.Errorf("素材身份不存在或重复")
				}
				seen[entity.ID] = true
			}
		}
		if len(seen) != len(known) {
			return fmt.Errorf("生成大纲必须保留已有素材")
		}
	}
	return nil
}

func writingChapterCountError(expected, actual int) error {
	if actual > writingChapterBatchLimit {
		return fmt.Errorf("请求 %d 章，模型返回 %d 章，超过单批 %d 章上限；本批未提交，请调整章纲草稿后保存", expected, actual, writingChapterBatchLimit)
	}
	return fmt.Errorf("请求 %d 章，模型返回 %d 章；本批未提交，请调整章纲草稿后保存", expected, actual)
}
