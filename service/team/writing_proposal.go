package team

import (
	"context"
	"fmt"
	"strings"
)

// 提案只存于现有 Run；作者内容直到显式保存才改变。
type writingProposal struct {
	RunID         uint64 `json:"run_id"`
	WorkAssetID   uint64 `json:"work_asset_id"`
	WorkVersionID uint64 `json:"work_version_id"`
	WorkRevision  uint64 `json:"work_revision"`
	UnitID        string `json:"unit_id,omitempty"`
	UnitVersionID uint64 `json:"unit_version_id,omitempty"`
	InspirationID string `json:"inspiration_id,omitempty"`
	SectionID     string `json:"section_id,omitempty"`
	EntityID      string `json:"entity_id,omitempty"`
	SelectedText  string `json:"selected_text,omitempty"`
	Replacement   string `json:"replacement"`
}

func prepareWritingProposal(work WritingDocument, command WritingCommand, checkpoint *writingCheckpoint) error {
	if command.UnitID != "" && command.SectionID != "chapter_plan" {
		if command.SectionID != "" || command.EntityID != "" || command.InspirationID != "" {
			return fmt.Errorf("一次只能修改一个正文或内容目标")
		}
		index, err := work.unitIndex(command.UnitID)
		if err != nil {
			return err
		}
		if !work.Units[index].HasBody {
			return fmt.Errorf("当前正文尚未生成，请先生成正文")
		}
		checkpoint.UnitIDs = []string{command.UnitID}
		checkpoint.UnitID = command.UnitID
		return nil
	}
	if command.SectionID != "inspiration" && work.Outline.textSection(command.SectionID) == nil && command.SectionID != "chapter_plan" && command.EntityID == "" {
		return fmt.Errorf("请选择一个素材后修改")
	}
	checkpoint.UnitID = command.UnitID
	return validateWritingSection(work, command.SectionID, command.EntityID, command.InspirationID, command.UnitID)
}

func (s Service) addWritingProposalContext(ctx context.Context, snapshot writingSnapshot, checkpoint writingCheckpoint, input map[string]any) error {
	input["selected_text"] = checkpoint.SelectedText
	input["target"] = map[string]any{"unit_id": checkpoint.UnitID, "section_id": checkpoint.SectionID, "entity_id": checkpoint.EntityID, "inspiration_id": checkpoint.InspirationID}
	if checkpoint.UnitID != "" && checkpoint.SectionID != "chapter_plan" {
		index, err := snapshot.Work.unitIndex(checkpoint.UnitID)
		if err != nil {
			return err
		}
		unit, err := s.loadWritingUnit(ctx, snapshot, index)
		if err != nil {
			return err
		}
		input["current_content"] = unit.Body
		input["unit"] = writingUnitIdentity(snapshot.Work, checkpoint.UnitID)
		return nil
	}
	switch checkpoint.SectionID {
	case "inspiration":
		input["current_content"] = snapshot.Work.findInspiration(checkpoint.InspirationID).Content
	case "chapter_plan":
		input["current_content"] = snapshot.Work.findUnit(checkpoint.UnitID).Plan
	case "overview", "world":
		input["current_content"] = *snapshot.Work.Outline.textSection(checkpoint.SectionID)
	default:
		group := writingEntitySection(&snapshot.Work.Outline.WritingEntities, checkpoint.SectionID)
		if group == nil {
			return fmt.Errorf("修改目标不存在")
		}
		for _, entity := range *group {
			if entity.ID == checkpoint.EntityID {
				input["current_content"] = entity.Description
				input["entity_name"] = entity.Name
				return nil
			}
		}
		return fmt.Errorf("修改目标不存在")
	}
	return nil
}

func writingProposalResult(snapshot writingSnapshot, checkpoint writingCheckpoint, runID uint64, candidate map[string]any) (*writingProposal, error) {
	if checkpoint.SectionID == "inspiration" {
		if err := validateWritingSection(snapshot.Work, checkpoint.SectionID, checkpoint.EntityID, checkpoint.InspirationID, checkpoint.UnitID); err != nil {
			return nil, err
		}
	}
	replacement, ok := candidate["replacement"].(string)
	if !ok || strings.TrimSpace(replacement) == "" || len(candidate) != 1 {
		return nil, fmt.Errorf("修改结果必须只包含有效的替换文字")
	}
	proposal := &writingProposal{RunID: runID, WorkAssetID: snapshot.Asset.ID, WorkVersionID: snapshot.Version.ID, WorkRevision: writingRevision(snapshot.Version), UnitID: checkpoint.UnitID, SectionID: checkpoint.SectionID, EntityID: checkpoint.EntityID, InspirationID: checkpoint.InspirationID, SelectedText: checkpoint.SelectedText, Replacement: replacement}
	if checkpoint.UnitID != "" && checkpoint.SectionID != "chapter_plan" {
		index, err := snapshot.Work.unitIndex(checkpoint.UnitID)
		if err != nil {
			return nil, err
		}
		proposal.UnitVersionID = snapshot.Work.Units[index].VersionID
		if checkpoint.SelectedText == "" {
			if err := validateBodyHeading(writingUnitIdentity(snapshot.Work, checkpoint.UnitID), replacement); err != nil {
				return nil, err
			}
		}
	}
	return proposal, nil
}
