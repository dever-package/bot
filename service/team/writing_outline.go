package team

import (
	"fmt"
	"strings"
)

// 大纲文字和素材共用一个持久化来源；章节卡展开同一故事走向。
func (outline *WritingOutline) textSection(sectionID string) *string {
	switch sectionID {
	case "overview":
		return &outline.Overview
	case "world":
		return &outline.World
	}
	return nil
}

func (outline WritingOutline) hasContent() bool {
	return strings.TrimSpace(outline.Overview+outline.World) != "" || len(outline.Characters)+len(outline.Locations)+len(outline.Props) > 0
}

func (outline WritingOutline) requireEntitiesComplete() error {
	if len(outline.Characters) == 0 || len(outline.Locations) == 0 {
		return fmt.Errorf("大纲至少需要一个角色和一个场景")
	}
	for _, group := range [][]WritingEntity{outline.Characters, outline.Locations, outline.Props} {
		for _, entity := range group {
			if strings.TrimSpace(entity.Name) == "" || strings.TrimSpace(entity.Description) == "" {
				return fmt.Errorf("请先完善大纲中角色、场景和道具的名称及描述")
			}
		}
	}
	return nil
}

// 生成只依赖已保存的故事走向、人物与背景。
func (work WritingDocument) requirePlanningComplete() error {
	if strings.TrimSpace(work.Outline.Overview) == "" || strings.TrimSpace(work.Outline.World) == "" {
		return fmt.Errorf("请先完成故事走向和背景")
	}
	return work.Outline.requireEntitiesComplete()
}
