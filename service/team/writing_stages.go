package team

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

var errWritingHistoryBatchReady = errors.New("本批前文整理完成，请继续下一批")

var writingPlanningPhases = []string{"preferences", "direction", "characters", "background", "chapters"}

func writingPlanningAction(checkpoint writingCheckpoint) string {
	switch checkpoint.Phase {
	case "preferences":
		return "planning_preferences"
	case "direction":
		return "planning_direction"
	case "characters":
		return "section_entities"
	case "background":
		return "planning_background"
	case "chapters":
		return "generate_chapters"
	}
	return ""
}

// 已持久化的阶段必须来自当前命令生产者；恢复不能补写旧检查点阶段。
func (checkpoint writingCheckpoint) validateExecutionPhase() error {
	switch checkpoint.Action {
	case "generate_outline":
		if writingPlanningAction(checkpoint) == "" {
			return fmt.Errorf("规划阶段无效")
		}
	case "generate_units":
		if checkpoint.Phase != "body" && checkpoint.Phase != "continuity" {
			return fmt.Errorf("正文运行阶段无效")
		}
	case "retry_continuity":
		if checkpoint.Phase != "continuity" {
			return fmt.Errorf("剧情衔接阶段无效")
		}
	}
	return nil
}

// 各阶段只提交自己的内容，保留已有章节和固定正文版本。
func applyWritingPlanningPhase(work *WritingDocument, checkpoint writingCheckpoint, candidate map[string]any) error {
	proposed := *work
	raw, err := json.Marshal(candidate)
	if err != nil {
		return err
	}
	switch checkpoint.Phase {
	case "preferences":
		var result struct {
			Preferences WritingPreferences `json:"preferences"`
		}
		if len(candidate) != 1 || candidate["preferences"] == nil {
			return fmt.Errorf("缺少写作设定")
		}
		if err = json.Unmarshal(raw, &result); err != nil {
			return err
		}
		if err = result.Preferences.validate(); err != nil {
			return err
		}
		proposed.Preferences = mergeWritingGeneratedPreferences(work.Preferences, result.Preferences)
	case "direction":
		content, ok := candidate["content"].(string)
		if !ok || len(candidate) != 1 || strings.TrimSpace(content) == "" {
			return fmt.Errorf("故事走向不能为空")
		}
		proposed.Outline.Overview = content
	case "characters":
		scoped := checkpoint
		scoped.SectionID = "characters"
		scoped.InspirationID = ""
		return applyWritingSectionResult(work, scoped, raw)
	case "background":
		var result struct {
			World     string          `json:"world"`
			Locations []WritingEntity `json:"locations"`
			Props     []WritingEntity `json:"props"`
		}
		if len(candidate) != 3 || candidate["world"] == nil || candidate["locations"] == nil || candidate["props"] == nil {
			return fmt.Errorf("背景须包含环境、地点与必要道具")
		}
		if err = json.Unmarshal(raw, &result); err != nil {
			return err
		}
		if strings.TrimSpace(result.World) == "" || len(result.Locations) == 0 || result.Props == nil {
			return fmt.Errorf("背景内容不完整")
		}
		proposed.Outline.World = result.World
		proposed.Outline.Locations = result.Locations
		proposed.Outline.Props = result.Props
		if err := preserveGeneratedEntities(proposed.Outline.WritingEntities, work.Outline.WritingEntities); err != nil {
			return err
		}
	case "chapters":
		// 完整规划只补首批；重做故事方向不隐式覆盖已有章节计划。
		if len(work.Units) > 0 {
			return nil
		}
		var result struct {
			Units []WritingUnitEntry `json:"units"`
		}
		if len(candidate) != 1 || candidate["units"] == nil {
			return fmt.Errorf("缺少剧情章节卡")
		}
		if err = json.Unmarshal(raw, &result); err != nil {
			return err
		}
		scoped := checkpoint
		scoped.UnitIDs = nil
		scoped.Count, err = writingNewChapterCount(*work, scoped.Count)
		if err != nil {
			return err
		}
		return applyWritingChapterResult(work, scoped, result.Units)
	default:
		return fmt.Errorf("规划阶段无效")
	}
	return work.saveDocument(proposed)
}

func writingInitialChapterCount(preferences WritingPreferences) int {
	if preferences.PlannedChapters > 0 {
		return min(preferences.PlannedChapters, writingChapterBatchLimit)
	}
	if preferences.Mode == "serial" {
		return 10
	}
	return 5
}

func advanceWritingCheckpoint(checkpoint writingCheckpoint, work WritingDocument, index int) writingCheckpoint {
	checkpoint.Draft = nil
	if checkpoint.Action == "generate_outline" && checkpoint.Phase != "" {
		checkpoint.Completed++
		if checkpoint.Completed < len(writingPlanningPhases) {
			checkpoint.Phase = writingPlanningPhases[checkpoint.Completed]
		}
		return checkpoint
	}
	if checkpoint.Action == "generate_units" || checkpoint.Action == "retry_continuity" {
		if checkpoint.Phase != "continuity" {
			checkpoint.Phase = "continuity"
			checkpoint.ContinuityUnitID = work.Units[index].ID
			return checkpoint
		}
		if index >= 0 && checkpoint.Completed < len(checkpoint.UnitIDs) && work.Units[index].ID == checkpoint.UnitIDs[checkpoint.Completed] {
			checkpoint.Completed++
		} else {
			checkpoint.HistoryCompleted++
		}
		checkpoint.Phase = "body"
		if checkpoint.Action == "retry_continuity" {
			checkpoint.Phase = "continuity"
		}
		checkpoint.ContinuityUnitID = ""
		return checkpoint
	}
	checkpoint.Completed++
	return checkpoint
}
