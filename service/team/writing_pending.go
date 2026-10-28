package team

import (
	"context"
	"fmt"
	teammodel "github.com/dever-package/bot/model/team"
	"strings"
)

type writingRequiredSource struct {
	Source  writingActualSource `json:"source"`
	Ordinal int                 `json:"ordinal"`
	Body    string              `json:"body"`
}

// pending 的授权来自受围栏的提交事务；读取只能验证已有固定来源，不能授予新资格。
func (s Service) writingRequiredSource(ctx context.Context, snapshot writingSnapshot, index int) (writingRequiredSource, error) {
	ref := snapshot.Work.Units[index]
	source := ref.ContinuityIndex
	unit, err := s.loadWritingUnit(ctx, snapshot, index)
	if err != nil {
		return writingRequiredSource{}, err
	}
	if source == nil || source.SourceVersionID == 0 || source.VersionID != ref.VersionID || source.BodyHash != writingHash(unit.Body) || source.PlanHash != writingPlanHash(ref) || ref.DependencyStale || strings.TrimSpace(unit.Body) == "" {
		return writingRequiredSource{}, fmt.Errorf("第%d章必要前文的固定正文来源已失效", index+1)
	}
	sourceRef := ref
	sourceRef.VersionID = source.SourceVersionID
	original, err := decodeWritingUnitReference(snapshot.Work.Type, sourceRef, s.asset.FindVersion(ctx, sourceRef.VersionID))
	if err != nil || writingHash(original.Body) != source.BodyHash {
		return writingRequiredSource{}, fmt.Errorf("第%d章必要前文的原始版本证据无效", index+1)
	}
	return writingRequiredSource{Source: writingActualSource{UnitID: ref.ID, BodyVersionID: source.SourceVersionID, BodyHash: source.BodyHash}, Ordinal: index + 1, Body: unit.Body}, nil
}

func (s Service) markWritingRawPending(ctx context.Context, snapshot *writingSnapshot, index int) error {
	unit, err := s.loadWritingUnit(ctx, *snapshot, index)
	if err != nil {
		return err
	}
	if strings.TrimSpace(unit.Body) == "" {
		return fmt.Errorf("待补记忆缺少已保存正文")
	}
	ref := &snapshot.Work.Units[index]
	prior := ""
	if index > 0 {
		previous := snapshot.Work.Units[index-1].ContinuityIndex
		if previous == nil {
			return fmt.Errorf("待补记忆缺少前文来源链")
		}
		prior = previous.ChainHash
	}
	bodyHash, planHash := writingHash(unit.Body), writingPlanHash(*ref)
	ref.ContinuityIndex = &writingContinuityIndex{RawPending: true, SourceVersionID: ref.VersionID, VersionID: ref.VersionID, BodyHash: bodyHash, PlanHash: planHash, ChainHash: writingChainHash(prior, bodyHash, planHash)}
	ref.ContinuityValid = false
	ref.ContinuityStatus = "raw_pending"
	ref.ContinuityFindings = nil
	ref.DependencyStale = false
	return nil
}

// 修好旧 raw 缺口后，后章原文仍可用，旧结构化推导不能直接复活。
// 只在已确认该缺口的原事务内重建受影响后缀的原文索引，不从任意 stale 读取路径放行。
func (s Service) rebaseWritingRawSuffix(ctx context.Context, snapshot *writingSnapshot, index int) error {
	for next := index + 1; next < len(snapshot.Work.Units); next++ {
		if !snapshot.Work.Units[next].HasBody {
			break
		}
		if err := s.markWritingRawPending(ctx, snapshot, next); err != nil {
			return err
		}
	}
	return nil
}

// 只消费已知完整但内容不合法的派生结果。网络/结算/租约等错误不会进入这里。
func (s Service) completeWritingPendingStep(ctx context.Context, run teammodel.Run, baseline writingSnapshot, checkpoint writingCheckpoint, onStream func(map[string]any)) error {
	index, err := baseline.Work.unitIndex(checkpoint.ContinuityUnitID)
	if err != nil {
		return err
	}
	saved, err := s.withWritingWrite(ctx, baseline.Asset.ProjectID, baseline.Asset.CanvasID, baseline.Asset.ID, func(tx context.Context, current *writingSnapshot) error {
		if _, err := s.fenceWritingResultRequest(tx, run, baseline, checkpoint, *current); err != nil {
			return err
		}
		if err := s.markWritingRawPending(tx, current, index); err != nil {
			return err
		}
		checkpoint = advanceWritingCheckpoint(checkpoint, current.Work, index)
		return s.persistWritingStepProgress(tx, current, run, checkpoint)
	})
	if err != nil {
		return err
	}
	if latest := s.repo.FindRun(ctx, run.ID); latest != nil {
		s.publishWritingProgress(ctx, saved, *latest, onStream)
		if latest.Status != teammodel.RunStatusRunning {
			s.publishWritingTerminal(ctx, saved, *latest, nil)
		}
	}
	return nil
}
