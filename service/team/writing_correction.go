package team

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// 执行反馈只属于持久检查点，不进入编辑器或运行历史的公共快照。
func writingPublicCheckpoint(checkpoint writingCheckpoint) map[string]any {
	result := writingMap(checkpoint)
	delete(result, "correction_feedback")
	delete(result, "correction_candidate")
	return result
}

// 存储与历史读取失败直接停止；只有原领域验证器拒绝的完整候选可修正。
func (s Service) validateWritingCandidate(ctx context.Context, snapshot writingSnapshot, run teammodel.Run, checkpoint writingCheckpoint, index int, candidate map[string]any) (error, error) {
	if checkpoint.Phase == "continuity" || checkpoint.Action == "retry_continuity" {
		unit, err := s.loadWritingUnit(ctx, snapshot, index)
		if err != nil {
			return nil, err
		}
		history, err := s.writingHistoryBefore(ctx, snapshot, index, snapshot.Work.Units[index].Plan)
		if err != nil {
			return nil, err
		}
		_, err = writingContinuityResult(snapshot, index, unit, candidate, history)
		return err, nil
	}
	if checkpoint.Action == "propose_edit" {
		_, err := writingProposalResult(snapshot, checkpoint, run.ID, candidate)
		return err, nil
	}
	if index < 0 {
		// saveDocument、目录替换及失效标记会修改 slice，不能在基线的浅拷贝上试运行。
		raw, err := json.Marshal(snapshot.Work)
		if err != nil {
			return nil, err
		}
		var work WritingDocument
		if err = json.Unmarshal(raw, &work); err != nil {
			return nil, err
		}
		return applyWritingPlanningResult(&work, checkpoint, candidate), nil
	}
	body, ok := candidate["body"].(string)
	if !ok || len(candidate) != 2 || candidate["continuity"] == nil || strings.TrimSpace(body) == "" {
		return fmt.Errorf("正文组合结果必须包含非空 body 和衔接候选"), nil
	}
	return validateBodyHeading(writingUnitIdentityAt(snapshot.Work, index), body), nil
}

func sameWritingResultStep(first, second writingCheckpoint) bool {
	return sameWritingChapterBatch(first, second) && first.Completed == second.Completed && first.Target == second.Target &&
		first.UnitID == second.UnitID && first.ContinuityUnitID == second.ContinuityUnitID && first.SectionID == second.SectionID &&
		first.EntityID == second.EntityID && first.InspirationID == second.InspirationID && first.SelectedText == second.SelectedText &&
		first.CorrectionCount == second.CorrectionCount
}

// 与目录请求相同，所有写作结果都只能消费当前已发起的子请求。
func (s Service) fenceWritingResultRequest(ctx context.Context, run teammodel.Run, baseline writingSnapshot, checkpoint writingCheckpoint, current writingSnapshot) (*teammodel.Run, error) {
	if err := fenceWritingRun(ctx, run.ID, teammodel.RunStatusRunning); err != nil {
		return nil, err
	}
	if current.Work.ActiveRunID != run.ID || current.Version.ID != baseline.Version.ID || writingRevision(current.Version) != writingRevision(baseline.Version) {
		return nil, fmt.Errorf("生成期间作品已被修改，已保留新编辑")
	}
	latest := s.repo.FindRun(ctx, run.ID)
	if latest == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	issued := writingCheckpointFor(*latest)
	if !issued.Issued || checkpoint.RequestID == "" || issued.RequestID != checkpoint.RequestID || !sameWritingResultStep(issued, checkpoint) {
		return nil, fmt.Errorf("创作结果的来源请求已失效")
	}
	return latest, nil
}

// 已完成的拒绝请求在原行锁、Run 租约和 request 围栏内消费；下一轮才发新 request。
func (s Service) correctWritingResult(ctx context.Context, run teammodel.Run, baseline writingSnapshot, checkpoint writingCheckpoint, candidate map[string]any, failure error, native bool, onStream func(map[string]any)) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	if native && !botprotocol.IsWritingResultError(failure, checkpoint.RequestID) {
		return failure
	}
	if checkpoint.CorrectionCount != 0 {
		if checkpoint.Phase == "continuity" {
			return s.completeWritingPendingStep(ctx, run, baseline, checkpoint, onStream)
		}
		return failure
	}
	corrected, err := s.withWritingWrite(ctx, baseline.Asset.ProjectID, baseline.Asset.CanvasID, baseline.Asset.ID, func(tx context.Context, current *writingSnapshot) error {
		latest, err := s.fenceWritingResultRequest(tx, run, baseline, checkpoint, *current)
		if err != nil {
			return err
		}
		issued := writingCheckpointFor(*latest)
		checkpoint.Draft = issued.Draft
		checkpoint.CorrectionCount = 1
		checkpoint.CorrectionFeedback = failure.Error()
		checkpoint.CorrectionCandidate = candidate
		checkpoint.Issued = false
		if err := s.saveWritingCheckpoint(tx, *latest, checkpoint); err != nil {
			return err
		}
		latest = s.repo.FindRun(tx, run.ID)
		s.repo.UpdateRun(tx, run.ID, map[string]any{"output": jsonText(writingOutput(*current, *latest))})
		return nil
	})
	if err != nil {
		return err
	}
	if latest := s.repo.FindRun(ctx, run.ID); latest != nil {
		s.publishWritingProgress(ctx, corrected, *latest, onStream)
	}
	return nil
}
