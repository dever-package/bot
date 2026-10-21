package team

import (
	"context"
	"fmt"
)

// 作品运行链沿用 Run 记录，游标也必须属于同一作品；不扫描项目全部运行或正文版本。
func (s Service) WritingRuns(ctx context.Context, projectID, canvasID, workID, beforeID uint64) (map[string]any, error) {
	snapshot, err := s.loadWriting(ctx, projectID, canvasID, workID)
	if err != nil {
		return nil, err
	}
	next := snapshot.Work.ActiveRunID
	if beforeID > 0 {
		next = beforeID
	}
	items := []map[string]any{}
	seen := map[uint64]bool{}
	for len(items) < 20 && next > 0 {
		if seen[next] {
			return nil, fmt.Errorf("创作运行记录包含循环")
		}
		seen[next] = true
		run := s.repo.findWritingHistoryRun(ctx, next, projectID, snapshot.Asset.TeamID)
		if run == nil || run.ProjectID != projectID || run.TeamID != snapshot.Asset.TeamID {
			return nil, fmt.Errorf("创作运行记录不存在")
		}
		checkpoint := writingCheckpointFor(*run)
		if checkpoint.WorkAssetID != workID {
			return nil, fmt.Errorf("运行记录不属于当前作品")
		}
		row := runStateToMap(*run)
		row["checkpoint"] = writingMap(checkpoint)
		row["action"] = checkpoint.Action
		row["instruction"] = checkpoint.Instruction
		items = append(items, row)
		next = checkpoint.PreviousRunID
	}
	return map[string]any{"items": items, "has_more": next > 0, "before_id": next}, nil
}
