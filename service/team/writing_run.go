package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	"github.com/dever-package/bot/service/stream"
	userservice "github.com/dever-package/user/service"
	"github.com/google/uuid"
	"github.com/shemic/dever/orm"
)

func isWritingPower(power PowerOption) bool { return writingProfile(power.OutputType) }
func isWritingRun(run teammodel.Run) bool {
	return len(mapValue(jsonMap(run.Input)[writingRunKey])) > 0
}

func (s Service) runInitialWriting(ctx context.Context, execution *canvasPowerExecution) (map[string]any, error) {
	if execution.request.ProjectID == 0 || execution.request.CanvasID == 0 {
		return nil, s.failCanvasPowerStart(ctx, execution, fmt.Errorf("故事需要在项目画布内生成并保存"))
	}
	snapshot, err := s.createWritingWork(ctx, execution)
	if err != nil {
		return nil, s.failCanvasPowerStart(ctx, execution, err)
	}
	s.publishWritingProgress(ctx, snapshot, *execution.run, execution.request.OnStream)
	s.executeWritingRun(ctx, execution.run.ID, execution.request.OnStream)
	run := s.repo.FindRun(ctx, execution.run.ID)
	if run == nil {
		return nil, fmt.Errorf("创作运行不存在")
	}
	snapshot, err = s.loadWriting(ctx, snapshot.Asset.ProjectID, snapshot.Asset.CanvasID, snapshot.Asset.ID)
	if err != nil {
		return nil, err
	}
	output := writingOutput(snapshot, *run)
	result := execution.result(run.Status, output)
	result["asset"] = s.asset.AssetDetailMap(ctx, snapshot.Asset, &snapshot.Version)
	result["version"] = assetservice.VersionToMap(snapshot.Version)
	if run.Status == teammodel.RunStatusFail {
		return result, fmt.Errorf("%s", run.Error)
	}
	return result, nil
}
func (s Service) createWritingWork(ctx context.Context, execution *canvasPowerExecution) (writingSnapshot, error) {
	req := execution.request
	release, err := assetservice.AcquireVersionLock(ctx, req.ProjectID, fmt.Sprintf("writing:new:%d:%d:%s", req.ProjectID, req.CanvasID, execution.nodeKey))
	if err != nil {
		return writingSnapshot{}, err
	}
	defer release()
	var snapshot writingSnapshot
	err = orm.Transaction(ctx, func(tx context.Context) error {
		if err := fenceWritingRun(tx, execution.run.ID, teammodel.RunStatusRunning); err != nil {
			return err
		}
		actor, err := userservice.RequireActor(tx)
		if err != nil {
			return err
		}
		project := projectmodel.NewProjectModel().Find(tx, map[string]any{"id": req.ProjectID, "user_id": actor.UserID, "status": projectmodel.StatusEnabled})
		if project == nil {
			return fmt.Errorf("作品不存在")
		}
		existing := assetmodel.NewAssetModel().Find(tx, map[string]any{"project_id": project.ID, "canvas_id": req.CanvasID, "node_key": execution.nodeKey, "kind": assetmodel.KindCollection, "status": assetmodel.StatusCurrent})
		if existing != nil {
			return fmt.Errorf("当前节点已有创作内容，请在编辑器继续或重写")
		}
		work := newWritingDocument(execution.power.OutputType, execution.nodeName)
		work.ActiveRunID = execution.run.ID
		work.ActiveRequestID = execution.run.RequestID
		asset, version, err := s.asset.SaveVersionInTransaction(tx, assetservice.SaveVersionRequest{WritingWrite: true, UserID: project.UserID, ProjectID: project.ID, CanvasID: req.CanvasID, BodyID: project.BodyID, TeamID: project.TeamID, FlowID: req.FlowID, AssetCateID: req.AssetCateID, RunID: execution.run.ID, NodeRunID: execution.nodeRunID, ReleaseID: execution.run.ReleaseID, RequestID: execution.requestID, NodeKey: execution.nodeKey, Name: work.Title, Kind: assetmodel.KindCollection, Role: assetmodel.RoleMaterial, Content: map[string]any{"json": writingMap(work)}})
		if err != nil {
			return err
		}
		snapshot = writingSnapshot{Asset: *asset, Version: *version, Work: work}
		checkpoint := writingCheckpoint{Action: "generate_inspirations", WorkAssetID: asset.ID, WorkVersionID: version.ID, Target: 1}
		checkpoint.WorkRevision = writingRevision(*version)
		return s.saveWritingCheckpoint(tx, *execution.run, checkpoint)
	})
	return snapshot, err
}

// A single lease owns the sequential queue. It never holds an asset lock during
// a provider call; each successful unit becomes durable before the next starts.
func (s Service) executeWritingRun(ctx context.Context, runID uint64, onStream func(map[string]any)) {
	for {
		run := s.repo.FindRun(ctx, runID)
		if run == nil || run.Status != teammodel.RunStatusRunning {
			return
		}
		checkpoint := writingCheckpointFor(*run)
		if checkpoint.Issued {
			s.failWritingRun(ctx, *run, fmt.Errorf("上次模型请求已发起但结果未提交，请显式重试以避免重复生成"), onStream)
			return
		}
		if checkpoint.Completed >= checkpoint.Target {
			s.finishWritingRun(ctx, *run, nil, onStream)
			return
		}
		if err := s.executeWritingStep(ctx, *run, checkpoint, onStream); err != nil {
			s.failWritingRun(ctx, *run, err, onStream)
			return
		}
	}
}
func (s Service) executeWritingStep(ctx context.Context, run teammodel.Run, checkpoint writingCheckpoint, onStream func(map[string]any)) error {
	if err := checkpoint.validateExecutionPhase(); err != nil {
		return err
	}
	metadata := mapValue(jsonMap(run.Input)[CanvasPowerMetaContext])
	snapshot, err := s.loadWriting(ctx, run.ProjectID, uint64Value(metadata["canvas_id"]), checkpoint.WorkAssetID)
	if err != nil {
		return err
	}
	if snapshot.Version.ID != checkpoint.WorkVersionID || writingRevision(snapshot.Version) != checkpoint.WorkRevision || snapshot.Work.ActiveRunID != run.ID {
		return fmt.Errorf("作品已被修改，本次生成已停止以保留新编辑")
	}
	power, ok := s.repo.FindPowerOption(ctx, uint64Value(metadata["power_id"]), firstText(metadata["power_key"]))
	if !ok || !isWritingPower(power) || power.OutputType != snapshot.Work.Type {
		return fmt.Errorf("故事能力配置已变化，请重新选择有效来源")
	}
	index := -1
	if len(checkpoint.UnitIDs) > 0 && checkpoint.Action != "generate_chapters" {
		index, err = snapshot.Work.unitIndex(checkpoint.UnitIDs[checkpoint.Completed])
		if err != nil {
			return err
		}
		if checkpoint.Action != "propose_edit" {
			if err = writingPredecessor(snapshot.Work, index); err != nil {
				return err
			}
		}
		checkpoint.UnitID = snapshot.Work.Units[index].ID
	}
	if checkpoint.Action == "generate_units" || checkpoint.Action == "retry_continuity" {
		if checkpoint.Action == "generate_units" && snapshot.Work.Units[index].PlanStale && !snapshot.Work.Units[index].HasBody {
			return fmt.Errorf("第%d章章纲待同步，请先同步后续剧情", index+1)
		}
		// 先重建实际历史；读取过期摘要不能成为继续写作的隐式退路。
		if invalid := writingFirstInvalidContinuity(snapshot.Work, index); invalid >= 0 {
			if !snapshot.Work.Units[invalid].HasBody {
				return fmt.Errorf("第%d章尚未写作", invalid+1)
			}
			if checkpoint.HistoryTotal == 0 {
				checkpoint.HistoryTotal = index - invalid
			}
			index = invalid
			checkpoint.Phase = "continuity"
			checkpoint.ContinuityUnitID = snapshot.Work.Units[index].ID
			if checkpoint.HistoryCompleted >= writingContinuityCheckpointInterval {
				_, saveErr := s.withWritingWrite(ctx, snapshot.Asset.ProjectID, snapshot.Asset.CanvasID, snapshot.Asset.ID, func(tx context.Context, current *writingSnapshot) error {
					if err := fenceWritingRun(tx, run.ID, teammodel.RunStatusRunning); err != nil {
						return err
					}
					if current.Version.ID != checkpoint.WorkVersionID || writingRevision(current.Version) != checkpoint.WorkRevision {
						return fmt.Errorf("作品已修改")
					}
					return s.saveWritingCheckpoint(tx, run, checkpoint)
				})
				if saveErr != nil {
					return saveErr
				}
				return errWritingHistoryBatchReady
			}
		} else if checkpoint.Action == "retry_continuity" || checkpoint.Phase == "continuity" {
			checkpoint.Phase = "continuity"
			checkpoint.ContinuityUnitID = snapshot.Work.Units[index].ID
		} else {
			checkpoint.Phase = "body"
		}
		checkpoint.UnitID = snapshot.Work.Units[index].ID
	}
	if checkpoint.Action == "generate_outline" && checkpoint.Phase == "chapters" && len(snapshot.Work.Units) > 0 {
		committed, commitErr := s.commitWritingStep(ctx, run, snapshot, checkpoint, -1, map[string]any{})
		if commitErr == nil {
			if current := s.repo.FindRun(ctx, run.ID); current != nil {
				s.publishWritingProgress(ctx, committed, *current, onStream)
			}
		}
		return commitErr
	}
	input, action, err := s.writingModelInput(ctx, snapshot, run, power, checkpoint, index)
	if err != nil {
		return err
	}
	checkpoint.Issued = true
	checkpoint.RequestID = uuid.NewString()
	_, err = s.withWritingWrite(ctx, snapshot.Asset.ProjectID, snapshot.Asset.CanvasID, snapshot.Asset.ID, func(tx context.Context, current *writingSnapshot) error {
		if current.Version.ID != checkpoint.WorkVersionID || writingRevision(current.Version) != checkpoint.WorkRevision {
			return fmt.Errorf("作品版本已变化")
		}
		if err := fenceWritingRun(tx, run.ID, teammodel.RunStatusRunning); err != nil {
			return err
		}
		return s.saveWritingCheckpoint(tx, run, checkpoint)
	})
	if err != nil {
		return err
	}
	currentRun := s.repo.FindRun(ctx, run.ID)
	if currentRun == nil {
		return fmt.Errorf("运行不存在")
	}
	s.publishWritingProgress(ctx, snapshot, *currentRun, onStream)
	constraints := resumedCanvasPowerConstraints(metadata)
	constraints.WritingAction = action
	billing := runBillingContext(run)
	billing.RunID = run.ID
	billing.TeamRunID = run.ID
	billing.TeamID = run.TeamID
	billing.ProjectID = run.ProjectID
	billing.BusinessKey = checkpoint.RequestID
	draftWriter := writingDraftWriter{checkpoint: checkpoint, lastSaved: time.Now()}
	output, err := s.executePower(ctx, checkpoint.RequestID, power, input, constraints, billing, func(payload map[string]any) {
		s.captureWritingDraft(ctx, run, &draftWriter, payload, false)
		s.publishWritingPreview(ctx, run, checkpoint, payload, onStream)
	})
	s.captureWritingDraft(ctx, run, &draftWriter, nil, true)
	if err != nil {
		return err
	}
	candidate := mapValue(output["json"])
	if len(candidate) == 0 {
		return fmt.Errorf("模型没有返回有效创作内容")
	}
	committed, err := s.commitWritingStep(ctx, run, snapshot, checkpoint, index, candidate)
	if err != nil {
		return err
	}
	currentRun = s.repo.FindRun(ctx, run.ID)
	if currentRun == nil {
		return fmt.Errorf("运行不存在")
	}
	s.publishWritingProgress(ctx, committed, *currentRun, onStream)
	if currentRun.Status != teammodel.RunStatusRunning {
		s.publishWritingTerminal(ctx, committed, *currentRun, nil)
	}
	return nil
}
func (s Service) commitWritingStep(ctx context.Context, run teammodel.Run, baseline writingSnapshot, checkpoint writingCheckpoint, index int, candidate map[string]any) (writingSnapshot, error) {
	return s.withWritingWrite(ctx, baseline.Asset.ProjectID, baseline.Asset.CanvasID, baseline.Asset.ID, func(tx context.Context, current *writingSnapshot) error {
		if err := fenceWritingRun(tx, run.ID, teammodel.RunStatusRunning); err != nil {
			return err
		}
		if current.Version.ID != baseline.Version.ID || writingRevision(current.Version) != writingRevision(baseline.Version) || current.Work.ActiveRunID != run.ID {
			return fmt.Errorf("生成期间作品已被修改，已保留新编辑")
		}
		if checkpoint.Action == "propose_edit" {
			proposal, err := writingProposalResult(*current, checkpoint, run.ID, candidate)
			if err != nil {
				return err
			}
			checkpoint.Proposal = proposal
		} else if index < 0 {
			if err := applyWritingPlanningResult(&current.Work, checkpoint, candidate); err != nil {
				return err
			}
		} else if checkpoint.Phase == "continuity" || checkpoint.Action == "retry_continuity" {
			unit, err := s.loadWritingUnit(tx, *current, index)
			if err != nil {
				return err
			}
			history, err := s.writingHistoryBefore(tx, *current, index, current.Work.Units[index].Plan)
			if err != nil {
				return err
			}
			unit, err = writingContinuityResult(*current, index, unit, candidate, history)
			if err != nil {
				return err
			}
			if err = s.saveWritingUnit(tx, current, index, unit, checkpoint.RequestID, run.ID); err != nil {
				return err
			}
		} else {
			if err := writingPredecessor(current.Work, index); err != nil {
				return err
			}
			body, ok := candidate["body"].(string)
			if !ok || len(candidate) != 1 || strings.TrimSpace(body) == "" {
				return fmt.Errorf("正文结果只允许非空 body")
			}
			if err := validateBodyHeading(writingUnitIdentityAt(current.Work, index), body); err != nil {
				return err
			}
			ref := current.Work.Units[index]
			unit := WritingUnit{Type: "writing_unit", SchemaVersion: 1, Profile: current.Work.Type, UnitID: ref.ID, Title: ref.Title, Body: body, Ending: writingEnding(body, "")}
			if err := s.saveWritingUnit(tx, current, index, unit, checkpoint.RequestID, run.ID); err != nil {
				return err
			}
		}
		checkpoint = advanceWritingCheckpoint(checkpoint, current.Work, index)
		runStatus := teammodel.RunStatusRunning
		current.Work.Status = "running"
		if checkpoint.Completed >= checkpoint.Target {
			current.Work.Status = "ready"
			runStatus = teammodel.RunStatusSuccess
		}
		if err := s.saveWritingDocument(tx, current, run.ID); err != nil {
			return err
		}
		checkpoint.Issued = false
		checkpoint.WorkVersionID = current.Version.ID
		checkpoint.WorkRevision = writingRevision(current.Version)
		if checkpoint.Proposal != nil {
			checkpoint.Proposal.WorkVersionID = current.Version.ID
			checkpoint.Proposal.WorkRevision = checkpoint.WorkRevision
		}
		if err := s.saveWritingCheckpoint(tx, run, checkpoint); err != nil {
			return err
		}
		currentRun := s.repo.FindRun(tx, run.ID)
		if currentRun == nil {
			return fmt.Errorf("运行不存在")
		}
		currentRun.Status = runStatus
		output := writingOutput(*current, *currentRun)
		updates := map[string]any{"output": jsonText(output), "status": runStatus, "error": ""}
		if runStatus == teammodel.RunStatusSuccess {
			updates["finished_at"] = time.Now()
		}
		s.repo.UpdateRun(tx, run.ID, updates)
		if runStatus != teammodel.RunStatusRunning {
			s.finishWritingRecords(tx, *currentRun, output, nil)
		}
		return nil
	})
}
func (s Service) publishWritingProgress(ctx context.Context, snapshot writingSnapshot, run teammodel.Run, onStream func(map[string]any)) {
	output := writingOutput(snapshot, run)
	payload := map[string]any{"event": "status", "output": output}
	_, _ = s.streams.WritePayload(ctx, run.RequestID, stream.NormalizePayload(stream.FeaturePower, payload))
	if onStream != nil {
		onStream(payload)
	}
}
func (s Service) finishWritingRun(ctx context.Context, run teammodel.Run, failure error, onStream func(map[string]any)) {
	checkpoint := writingCheckpointFor(run)
	metadata := mapValue(jsonMap(run.Input)[CanvasPowerMetaContext])
	snapshot, err := s.withWritingWrite(ctx, run.ProjectID, uint64Value(metadata["canvas_id"]), checkpoint.WorkAssetID, func(tx context.Context, current *writingSnapshot) error {
		if err := fenceWritingRun(tx, run.ID, teammodel.RunStatusRunning); err != nil {
			return err
		}
		if current.Work.ActiveRunID != run.ID {
			return fmt.Errorf("作品已有其他运行")
		}
		current.Work.Status = "ready"
		run.Status = teammodel.RunStatusSuccess
		if failure == errWritingHistoryBatchReady {
			current.Work.Status = "stopped"
			run.Status = teammodel.RunStatusCanceled
			failure = nil
		} else if failure != nil {
			current.Work.Status = "failed"
			run.Status = teammodel.RunStatusFail
		}
		if err := s.saveWritingDocument(tx, current, run.ID); err != nil {
			return err
		}
		checkpoint.WorkVersionID = current.Version.ID
		checkpoint.WorkRevision = writingRevision(current.Version)
		input := jsonMap(run.Input)
		input[writingRunKey] = writingMap(checkpoint)
		run.Input = jsonText(input)
		output := writingOutput(*current, run)
		updates := map[string]any{"input": run.Input, "output": jsonText(output), "status": run.Status, "error": errorText(failure)}
		updates["finished_at"] = time.Now()
		s.repo.UpdateRun(tx, run.ID, updates)
		s.finishWritingRecords(tx, run, output, failure)
		return nil
	})
	if err != nil {
		if current := s.repo.FindRun(ctx, run.ID); current != nil && current.Status == teammodel.RunStatusRunning {
			s.finishRun(ctx, run.ID, teammodel.RunStatusFail, jsonMap(current.Output), err)
		}
		return
	}
	s.publishWritingProgress(ctx, snapshot, run, onStream)
	s.publishWritingTerminal(ctx, snapshot, run, failure)
}
func (s Service) finishWritingRecords(ctx context.Context, run teammodel.Run, output map[string]any, failure error) {
	for _, node := range s.repo.ListNodeRuns(ctx, run.ID) {
		s.repo.UpdateNodeRun(ctx, node.ID, canvasPowerFinishRecord(run.Status, output, failure))
	}
	for _, flow := range s.repo.ListFlowRuns(ctx, run.ID) {
		s.repo.UpdateFlowRun(ctx, flow.ID, canvasPowerFinishRecord(run.Status, output, failure))
	}
}
func (s Service) publishWritingTerminal(ctx context.Context, snapshot writingSnapshot, run teammodel.Run, failure error) {
	current := s.repo.FindRun(ctx, run.ID)
	if current == nil || current.Status != run.Status || writingCheckpointFor(*current).WorkVersionID != snapshot.Version.ID || writingCheckpointFor(*current).WorkRevision != writingRevision(snapshot.Version) {
		return
	}
	event := stream.EventRunFinished
	s.writeRunEvent(ctx, *current, event, map[string]any{"scope": "run", "output": writingOutput(snapshot, *current), "error": errorText(failure)})
	s.writeRunResult(ctx, *current)
}
func (s Service) failWritingRun(ctx context.Context, run teammodel.Run, err error, onStream func(map[string]any)) {
	if ctx.Err() != nil {
		return
	}
	if current := s.repo.FindRun(ctx, run.ID); current != nil && current.Status == teammodel.RunStatusRunning {
		s.finishWritingRun(ctx, *current, err, onStream)
	}
}
