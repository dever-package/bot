package team

import (
	"encoding/json"
	"fmt"
	"strings"
)

func writingEntitySection(entities *WritingEntities, sectionID string) *[]WritingEntity {
	switch sectionID {
	case "characters":
		return &entities.Characters
	case "locations":
		return &entities.Locations
	case "props":
		return &entities.Props
	}
	return nil
}

func validateWritingSection(work WritingDocument, sectionID, entityID, inspirationID, unitID string) error {
	if sectionID != "inspiration" {
		if err := work.requireSelectedInspiration(); err != nil {
			return err
		}
	}
	switch sectionID {
	case "inspiration":
		if err := work.requireEditableInspirations(); err != nil {
			return err
		}
		if entityID != "" || unitID != "" || work.findInspiration(inspirationID) == nil {
			return fmt.Errorf("请选择有效灵感")
		}
		return nil
	case "overview", "world":
		if entityID != "" || unitID != "" || inspirationID != "" {
			return fmt.Errorf("大纲目标无效")
		}
		return nil
	case "chapter_plan":
		if entityID != "" || inspirationID != "" || work.findUnit(unitID) == nil {
			return fmt.Errorf("章纲目标无效")
		}
		return nil
	}
	if inspirationID != "" || unitID != "" {
		return fmt.Errorf("素材目标无效")
	}
	group := writingEntitySection(&work.Outline.WritingEntities, sectionID)
	if group == nil {
		return fmt.Errorf("请选择有效的大纲区块、章纲、角色、场景或道具")
	}
	if entityID == "" {
		return nil
	}
	for _, entity := range *group {
		if entity.ID == entityID {
			return nil
		}
	}
	return fmt.Errorf("所选素材不存在，请重新载入")
}

// 模型只能提交当前类型或当前实体；规划保存仍负责身份生成和正文依赖失效。
func applyWritingSectionResult(work *WritingDocument, checkpoint writingCheckpoint, raw []byte) error {
	if err := validateWritingSection(*work, checkpoint.SectionID, checkpoint.EntityID, checkpoint.InspirationID, checkpoint.UnitID); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(raw, &fields); err != nil {
		return err
	}
	if len(fields) != 1 {
		return fmt.Errorf("局部生成结果只允许当前区块")
	}
	proposed := *work
	switch checkpoint.SectionID {
	case "inspiration":
		return applyWritingInspirations(work, checkpoint.InspirationID, raw)
	case "overview", "world":
		var result struct {
			Content string `json:"content"`
		}
		if err := json.Unmarshal(raw, &result); err != nil {
			return err
		}
		if strings.TrimSpace(result.Content) == "" {
			return fmt.Errorf("大纲区块不能为空")
		}
		*proposed.Outline.textSection(checkpoint.SectionID) = result.Content
		return work.saveDocument(proposed)
	case "chapter_plan":
		var result struct {
			Plan string `json:"plan"`
		}
		if err := json.Unmarshal(raw, &result); err != nil {
			return err
		}
		if strings.TrimSpace(result.Plan) == "" {
			return fmt.Errorf("章纲不能为空")
		}
		proposed.Units = append([]WritingUnitEntry{}, work.Units...)
		proposed.findUnit(checkpoint.UnitID).Plan = result.Plan
		if err := work.saveDocument(proposed); err != nil {
			return err
		}
		work.findUnit(checkpoint.UnitID).PlanStale = false
		return nil
	}

	var result struct {
		Entities []WritingEntity `json:"entities"`
	}
	if err := json.Unmarshal(raw, &result); err != nil {
		return err
	}
	if result.Entities == nil {
		return fmt.Errorf("模型未返回当前类型的素材列表")
	}
	for _, entity := range result.Entities {
		if strings.TrimSpace(entity.Name) == "" || strings.TrimSpace(entity.Description) == "" {
			return fmt.Errorf("素材名称和描述不能为空")
		}
	}
	group := writingEntitySection(&proposed.Outline.WritingEntities, checkpoint.SectionID)
	if checkpoint.EntityID != "" {
		if len(result.Entities) != 1 || result.Entities[0].ID != checkpoint.EntityID {
			return fmt.Errorf("生成结果必须只包含所选素材，并保留原有身份")
		}
		updated := append([]WritingEntity{}, (*group)...)
		for i := range updated {
			if updated[i].ID == checkpoint.EntityID {
				updated[i] = result.Entities[0]
			}
		}
		*group = updated
	} else {
		known := map[string]bool{}
		for _, entity := range *group {
			known[entity.ID] = true
		}
		seen := map[string]bool{}
		for _, entity := range result.Entities {
			if entity.ID == "" {
				continue
			}
			if !known[entity.ID] || seen[entity.ID] {
				return fmt.Errorf("素材身份不存在或重复，新素材请留空 ID")
			}
			seen[entity.ID] = true
		}
		if len(seen) != len(known) {
			return fmt.Errorf("生成列表必须保留当前类型的已有素材")
		}
		*group = result.Entities
	}
	return work.saveDocument(proposed)
}
