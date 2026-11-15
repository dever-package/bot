package team

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	"github.com/google/uuid"
)

func (s Service) WritingCommand(ctx context.Context, command WritingCommand) (map[string]any, error) {
	if command.Action == "create" {
		return s.createManualWriting(ctx, command)
	}
	if command.ProjectID == 0 || command.CanvasID == 0 || command.WorkAssetID == 0 || command.ExpectedWorkVersionID == 0 || command.ExpectedWorkRevision == nil {
		return nil, fmt.Errorf("缺少作品、画布或版本基线")
	}
	var accepted *teammodel.Run
	editingDuringContinuity := false
	snapshot, err := s.withWritingWrite(ctx, command.ProjectID, command.CanvasID, command.WorkAssetID, func(tx context.Context, current *writingSnapshot) error {
		if err := checkWritingBaseline(*current, command); err != nil {
			return err
		}
		if active := s.repo.FindRun(tx, current.Work.ActiveRunID); active != nil && (active.Status == teammodel.RunStatusRunning || active.Status == teammodel.RunStatusPending) {
			checkpoint := writingCheckpointFor(*active)
			editingDuringContinuity = (command.Action == "save_unit" || command.Action == "save_document") && checkpoint.Phase == "continuity"
			if !editingDuringContinuity {
				return fmt.Errorf("作品正在生成，请先停止当前运行再修改")
			}
			if command.Action == "save_unit" {
				index, err := current.Work.unitIndex(command.UnitID)
				if err != nil {
					return err
				}
				if !current.Work.Units[index].HasBody {
					for _, id := range checkpoint.UnitIDs {
						if id == command.UnitID {
							return fmt.Errorf("该章节在本批正文生成范围内，请先停止生成后手动撰写")
						}
					}
				}
			}
		}

		switch command.Action {
		case "create_version":
			return s.createWritingVersion(tx, current, uuid.NewString())
		case "save_document":
			if command.Document == nil {
				return fmt.Errorf("缺少作品规划")
			}
			if err := current.Work.saveDocument(*command.Document); err != nil {
				return err
			}
		case "save_unit":
			if err := s.saveWritingUnitCommand(tx, current, command); err != nil {
				return err
			}
		case "apply_chapter_draft":
			return s.applyWritingChapterDraft(tx, current, command)
		case "restore_document":
			if err := s.restoreWritingContent(tx, current, command); err != nil {
				return err
			}
			return s.createWritingVersion(tx, current, uuid.NewString())
		case "retry_generation":
			prior := s.repo.FindRun(tx, current.Work.ActiveRunID)
			if prior == nil || prior.ProjectID != current.Asset.ProjectID || (prior.Status != teammodel.RunStatusFail && prior.Status != teammodel.RunStatusCanceled) {
				return fmt.Errorf("没有可恢复的创作任务")
			}
			checkpoint := writingCheckpointFor(*prior)
			switch checkpoint.Action {
			case "generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "append", "generate_section", "retry_continuity":
			default:
				return fmt.Errorf("当前创作任务不支持断点重试")
			}
			if err := checkpoint.validateExecutionPhase(); err != nil {
				return err
			}
			if checkpoint.Completed >= checkpoint.Target || checkpoint.WorkAssetID != current.Asset.ID || checkpoint.WorkVersionID != current.Version.ID || checkpoint.WorkRevision != writingRevision(current.Version) {
				return fmt.Errorf("创作基线已改变，请重新选择生成范围")
			}
			checkpoint.Draft = nil
			writingResumeChapterPrefix(current.Work, *prior, &checkpoint)
			checkpoint.Issued = false
			checkpoint.RequestID = ""
			checkpoint.CorrectionCount = 0
			checkpoint.HistoryCompleted, checkpoint.HistoryTotal = 0, 0
			var createErr error
			accepted, createErr = s.createWritingCommandRun(tx, current, checkpoint)
			return createErr
		case "select_inspiration", "generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "append", "generate_section", "propose_edit", "retry_continuity":
			checkpoint, err := prepareWritingCommand(*current, command)
			if err != nil {
				return err
			}
			if command.Action == "select_inspiration" {
				candidate := current.Work.findInspiration(command.InspirationID)
				current.Work.SelectedInspirationID = candidate.ID
				current.Work.Title = candidate.Title
			}
			accepted, err = s.createWritingCommandRun(tx, current, checkpoint)
			return err
		default:
			return fmt.Errorf("创作操作不存在")
		}
		current.Work.Status = "ready"
		if editingDuringContinuity {
			current.Work.Status = "running"
		}
		return s.saveWritingDocument(tx, current, current.Work.ActiveRunID)
	})
	if err != nil {
		return nil, err
	}
	if accepted != nil {
		s.runAsync(ctx, accepted.ID, func(runContext context.Context) { s.executeWritingRun(runContext, accepted.ID, nil) })
	}
	return writingResponse(snapshot, accepted), nil
}
func checkWritingBaseline(snapshot writingSnapshot, command WritingCommand) error {
	if snapshot.Version.ID != command.ExpectedWorkVersionID || command.ExpectedWorkRevision == nil || writingRevision(snapshot.Version) != *command.ExpectedWorkRevision {
		return fmt.Errorf("作品已更新，请保留当前编辑并重新载入后重试")
	}
	if command.UnitID != "" && command.SectionID != "chapter_plan" {
		index, err := snapshot.Work.unitIndex(command.UnitID)
		if err != nil {
			return err
		}
		if snapshot.Work.Units[index].VersionID != command.ExpectedUnitVersionID {
			return fmt.Errorf("正文版本已更新，请重新审阅")
		}
	}
	return nil
}
func prepareWritingCommand(snapshot writingSnapshot, command WritingCommand) (writingCheckpoint, error) {
	checkpoint := writingCheckpoint{Action: command.Action, WorkAssetID: snapshot.Asset.ID, WorkVersionID: snapshot.Version.ID, WorkRevision: writingRevision(snapshot.Version), Instruction: strings.TrimSpace(command.Instruction), Count: command.Count, InspirationID: command.InspirationID, SectionID: command.SectionID, EntityID: command.EntityID, SelectedText: command.SelectedText, Target: 1}
	if (command.Action == "select_inspiration" || command.Action == "generate_outline") && (command.Count < 0 || command.Count > writingChapterBatchLimit) {
		return checkpoint, fmt.Errorf("首批剧情卡数量须为 1 到 %d，或留空按写作设定规划", writingChapterBatchLimit)
	}
	switch command.Action {
	case "generate_inspirations":
		if err := snapshot.Work.requireEditableInspirations(); err != nil {
			return checkpoint, err
		}
		if command.InspirationID == "" {
			if snapshot.Work.Outline.hasContent() || len(snapshot.Work.Units) > 0 {
				return checkpoint, fmt.Errorf("已有规划不能更换整批灵感")
			}
		} else if snapshot.Work.findInspiration(command.InspirationID) == nil {
			return checkpoint, fmt.Errorf("灵感不存在")
		}
	case "select_inspiration":
		if err := snapshot.Work.requireEditableInspirations(); err != nil {
			return checkpoint, err
		}
		candidate := snapshot.Work.findInspiration(command.InspirationID)
		if candidate == nil || strings.TrimSpace(candidate.Title) == "" || strings.TrimSpace(candidate.Content) == "" {
			return checkpoint, fmt.Errorf("请选择完整灵感")
		}
		checkpoint.Action = "generate_outline"
		checkpoint.Phase = writingPlanningPhases[0]
		checkpoint.Target = len(writingPlanningPhases)
	case "generate_outline":
		checkpoint.Action = "generate_outline"
		checkpoint.Phase = writingPlanningPhases[0]
		checkpoint.Target = len(writingPlanningPhases)
		if err := snapshot.Work.requireWritingDirection(command.Instruction); err != nil {
			return checkpoint, err
		}
	case "generate_chapters":
		if err := snapshot.Work.requireWritingDirection(command.Instruction); err != nil {
			return checkpoint, err
		}
		targets, err := writingChapterTargets(snapshot.Work, command)
		if err != nil {
			return checkpoint, err
		}
		checkpoint.UnitIDs = targets
		if len(targets) > 0 {
			checkpoint.Count = len(targets)
		} else {
			checkpoint.Count, err = writingNewChapterCount(snapshot.Work, command.Count)
			if err != nil {
				return checkpoint, err
			}
		}
	case "generate_units":
		if err := snapshot.Work.requireWritingDirection(command.Instruction); err != nil {
			return checkpoint, err
		}
		queue, err := writingUnitQueue(snapshot.Work, command)
		if err != nil {
			return checkpoint, err
		}

		checkpoint.UnitIDs = queue
		checkpoint.Target = len(queue)
		checkpoint.Phase = "body"
	case "retry_continuity":
		index, err := snapshot.Work.unitIndex(command.UnitID)
		if err != nil {
			return checkpoint, err
		}
		if !snapshot.Work.Units[index].HasBody {
			return checkpoint, fmt.Errorf("本章尚无已保存正文")
		}
		checkpoint.UnitIDs = []string{command.UnitID}
		checkpoint.UnitID = command.UnitID
		checkpoint.Phase = "continuity"
	case "append":
		if command.Count < 1 || command.Count > writingChapterBatchLimit {
			return checkpoint, fmt.Errorf("每次追加数量应为 1 到 %d", writingChapterBatchLimit)
		}

		if err := snapshot.Work.requireWritingDirection(command.Instruction); err != nil {
			return checkpoint, err
		}
		if _, err := writingNewChapterCount(snapshot.Work, command.Count); err != nil {
			return checkpoint, err
		}
	case "generate_section":
		checkpoint.UnitID = command.UnitID
		if err := validateWritingSection(snapshot.Work, checkpoint.SectionID, checkpoint.EntityID, checkpoint.InspirationID, command.UnitID); err != nil {
			return checkpoint, err
		}
	case "propose_edit":
		if err := prepareWritingProposal(snapshot.Work, command, &checkpoint); err != nil {
			return checkpoint, err
		}
	default:
		return checkpoint, fmt.Errorf("生成操作无效")
	}
	return checkpoint, nil
}
func (s Service) createWritingCommandRun(ctx context.Context, snapshot *writingSnapshot, checkpoint writingCheckpoint) (*teammodel.Run, error) {
	previous := s.repo.FindRun(ctx, snapshot.Work.ActiveRunID)
	input := map[string]any{}
	releaseID := snapshot.Version.ReleaseID
	if previous != nil {
		if previous.ProjectID != snapshot.Asset.ProjectID {
			return nil, fmt.Errorf("作品运行归属无效")
		}
		checkpoint.PreviousRunID = previous.ID
		input = jsonMap(previous.Input)
		releaseID = previous.ReleaseID
	}
	// The story node on the canvas owns the writing model and its parameters.
	node, err := writingCanvasNode(ctx, snapshot.Asset.CanvasID, snapshot.Asset.NodeKey)
	if err != nil {
		return nil, err
	}
	draft := mapValue(node["composer_draft"])
	if powerID := uint64Value(valueAtPath(node["power"], "id")); powerID > 0 {
		power, ok := s.repo.FindPowerOption(ctx, powerID, "")
		if !ok || !isWritingPower(power) || power.OutputType != snapshot.Work.Type {
			return nil, fmt.Errorf("请在故事节点选择有效的写作模型")
		}
		input = mergeMaps(input, mapValue(draft["param_values"]))
		input[CanvasPowerMetaContext] = map[string]any{"power_id": power.ID, "power_key": power.Key, "source_target_id": uint64Value(draft["selected_target_id"]), "canvas_id": snapshot.Asset.CanvasID, "node_key": snapshot.Asset.NodeKey, "node_name": snapshot.Work.Title, "kind": power.Kind, "persist_result": true}
	} else if previous == nil {
		return nil, fmt.Errorf("请先在故事节点选择写作模型")
	}
	attachRunBilling(input, botprotocol.BillingContext{Billable: true, Scene: "project_power", UserID: snapshot.Asset.UserID, TeamID: snapshot.Asset.TeamID, ProjectID: snapshot.Asset.ProjectID})
	input[writingRunKey] = writingMap(checkpoint)
	requestID := uuid.NewString()
	now := time.Now()
	record := map[string]any{"request_id": requestID, "project_id": snapshot.Asset.ProjectID, "body_id": snapshot.Asset.BodyID, "team_id": snapshot.Asset.TeamID, "release_id": releaseID, "input": jsonText(input), "output": "{}", "status": teammodel.RunStatusRunning, "started_at": now, "created_at": now, "updated_at": now}
	attachRunScope(ctx, record)
	id := s.repo.InsertRun(ctx, record)
	if id == 0 {
		return nil, fmt.Errorf("创建创作运行失败")
	}
	snapshot.Work.ActiveRunID = id
	snapshot.Work.ActiveRequestID = requestID
	snapshot.Work.Status = "running"
	if err := s.saveWritingDocument(ctx, snapshot, id); err != nil {
		return nil, err
	}
	checkpoint.WorkVersionID = snapshot.Version.ID
	checkpoint.WorkRevision = writingRevision(snapshot.Version)
	if checkpoint.Draft != nil {
		checkpoint.Draft.RunID = id
		checkpoint.Draft.RequestID = checkpoint.RequestID
	}
	input[writingRunKey] = writingMap(checkpoint)
	s.repo.UpdateRun(ctx, id, map[string]any{"input": jsonText(input)})
	run := s.repo.FindRun(ctx, id)
	if run == nil {
		return nil, fmt.Errorf("读取创作运行失败")
	}
	s.repo.UpdateRun(ctx, id, map[string]any{"output": jsonText(writingOutput(*snapshot, *run))})
	return run, nil
}
func (s Service) saveWritingUnitCommand(ctx context.Context, snapshot *writingSnapshot, command WritingCommand) error {
	index, err := snapshot.Work.unitIndex(command.UnitID)
	if err != nil {
		return err
	}
	ref := snapshot.Work.Units[index]
	unit := WritingUnit{Type: "writing_unit", SchemaVersion: 1, Profile: snapshot.Work.Type, UnitID: ref.ID, Title: ref.Title}
	if ref.VersionID > 0 {
		unit, err = s.loadWritingUnit(ctx, *snapshot, index)
		if err != nil {
			return err
		}
	}
	if err := validateBodyHeading(writingUnitIdentity(snapshot.Work, ref.ID), command.Body); err != nil {
		return err
	}
	bodyChanged := ref.HasBody && unit.Body != command.Body
	if ref.HasBody && unit.Body == command.Body {
		return nil
	}
	unit.Body = command.Body
	unit.Title = ref.Title
	unit.ContinuityValid = false
	unit.Continuity = nil
	unit.Ending = writingEnding(unit.Body, "")
	if err := s.saveWritingUnit(ctx, snapshot, index, unit, uuid.NewString(), snapshot.Work.ActiveRunID); err != nil {
		return err
	}
	if bodyChanged {
		snapshot.Work.invalidatePlansAfter(index)
	}
	return nil
}

func writingCanvasNode(ctx context.Context, canvasID uint64, nodeKey string) (map[string]any, error) {
	canvas := projectmodel.NewCanvasModel().Find(ctx, map[string]any{"id": canvasID, "status": projectmodel.CanvasStatusEnabled})
	if canvas == nil {
		return nil, fmt.Errorf("故事所在画布不存在")
	}
	var nodes []map[string]any
	if err := json.Unmarshal([]byte(canvas.Nodes), &nodes); err != nil {
		return nil, fmt.Errorf("画布节点格式无效：%w", err)
	}
	for _, node := range nodes {
		if textValue(node["id"]) == nodeKey {
			return node, nil
		}
	}
	return nil, fmt.Errorf("故事节点已从画布移除")
}
