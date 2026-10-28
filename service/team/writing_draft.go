package team

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	dlog "github.com/shemic/dever/log"
)

type writingStreamDraft struct {
	Body          string             `json:"body"`
	UnitID        string             `json:"unit_id"`
	RunID         uint64             `json:"run_id"`
	RequestID     string             `json:"request_id"`
	UpdatedAt     string             `json:"updated_at"`
	Units         []WritingUnitEntry `json:"units,omitempty"`
	ExpectedCount int                `json:"expected_count,omitempty"`
	Complete      bool               `json:"complete"`
	AcceptedCount int                `json:"accepted_count,omitempty"`
}
type writingDraftWriter struct {
	checkpoint writingCheckpoint
	work       WritingDocument
	body       string
	units      []WritingUnitEntry
	complete   bool
	saved      string
	lastSaved  time.Time
}

func writingChapterDraftPhase(checkpoint writingCheckpoint) bool {
	return checkpoint.Action == "generate_chapters" || checkpoint.Action == "append" || checkpoint.Action == "generate_outline" && checkpoint.Phase == "chapters"
}

// 草稿只放原 Run，不推进目录/正文 pin；完整对象与显示用的字符串前缀分开。
func (writer *writingDraftWriter) receive(payload map[string]any) {
	if firstText(payload["request_id"]) != writer.checkpoint.RequestID {
		return
	}
	output := mapValue(payload["output"])
	partial := mapValue(mapValue(output["meta"])["writing_preview"])
	if writer.checkpoint.Phase == "body" {
		if body, ok := mapValue(partial["fields"])["body"].(string); ok && body != "" {
			writer.body = body
		}
		return
	}
	if !writingChapterDraftPhase(writer.checkpoint) {
		return
	}
	candidate := mapValue(output["json"])
	complete := candidate["units"] != nil
	unitsValue := partial["units"]
	if complete {
		unitsValue = candidate["units"]
	}
	if unitsValue == nil {
		return
	}
	units, err := decodeWritingChapterUnits(unitsValue)
	if err != nil {
		return
	}
	units = append(writingAcceptedChapters(writer.checkpoint), units...)
	// 校验完整累计前缀；流式闭合本身不等于上游成功确认。
	if err := validateWritingDraftUnits(writer.work, writer.checkpoint, units); err != nil {
		return
	}
	writer.units, writer.complete = units, complete
}

func decodeWritingChapterUnits(value any) ([]WritingUnitEntry, error) {
	raw, err := json.Marshal(value)
	if err != nil {
		return nil, err
	}
	var units []WritingUnitEntry
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&units); err != nil {
		return nil, err
	}
	if len(units) == 0 {
		return nil, fmt.Errorf("模型未返回章纲")
	}
	var objects []map[string]json.RawMessage
	if err := json.Unmarshal(raw, &objects); err != nil {
		return nil, err
	}
	for _, object := range objects {
		if len(object) != 5 {
			return nil, fmt.Errorf("章纲只允许身份、类型、标题、剧情和子列表")
		}
		for _, field := range []string{"id", "unit_type", "title", "plan", "children"} {
			if len(object[field]) == 0 || string(object[field]) == "null" {
				return nil, fmt.Errorf("章纲缺少有效的 %s", field)
			}
		}
	}
	return units, nil
}

func validateWritingDraftUnits(work WritingDocument, checkpoint writingCheckpoint, units []WritingUnitEntry) error {
	if !writingChapterDraftPhase(checkpoint) || len(units) == 0 {
		return fmt.Errorf("没有可恢复的章纲")
	}
	targets := checkpoint.UnitIDs
	if checkpoint.Action == "append" || len(work.Units) == 0 {
		return validateGeneratedDirectory(WritingDocument{}, units, false)
	}
	if len(targets) == 0 || len(units) > len(targets) {
		return fmt.Errorf("章纲草稿超出原目标范围")
	}
	selected := WritingDocument{}
	for index, unit := range units {
		if unit.ID != targets[index] {
			return fmt.Errorf("章纲草稿身份或顺序与原目标不符")
		}
		position, err := work.unitIndex(unit.ID)
		if err != nil {
			return err
		}
		selected.Units = append(selected.Units, work.Units[position])
	}
	return validateGeneratedDirectory(selected, units, true)
}

func (s Service) captureWritingDraft(ctx context.Context, run teammodel.Run, writer *writingDraftWriter, payload map[string]any, flush bool) {
	if writer.checkpoint.Phase != "body" && !writingChapterDraftPhase(writer.checkpoint) {
		return
	}
	if payload != nil {
		writer.receive(payload)
	}
	if writer.body == "" && len(writer.units) == 0 {
		return
	}
	draft := writingStreamDraft{Body: writer.body, UnitID: writer.checkpoint.UnitID, Units: writer.units, ExpectedCount: writer.checkpoint.Count, Complete: writer.complete, AcceptedCount: len(writingAcceptedChapters(writer.checkpoint)), RunID: run.ID, RequestID: writer.checkpoint.RequestID}
	signature := jsonText(draft)
	if signature == writer.saved || !flush && time.Since(writer.lastSaved) < time.Second {
		return
	}
	saveCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Second)
	defer cancel()
	// 与完成/取消共享作品锁，防止终态用旧 input 覆盖刚保存的草稿。
	_, err := s.withWritingWrite(saveCtx, run.ProjectID, uint64Value(mapValue(jsonMap(run.Input)[CanvasPowerMetaContext])["canvas_id"]), writer.checkpoint.WorkAssetID, func(tx context.Context, snapshot *writingSnapshot) error {
		current := s.repo.FindRun(tx, run.ID)
		if current == nil {
			return fmt.Errorf("运行不存在")
		}
		checkpoint := writingCheckpointFor(*current)
		if checkpoint.RequestID != writer.checkpoint.RequestID || checkpoint.Action != writer.checkpoint.Action || checkpoint.Phase != writer.checkpoint.Phase || !checkpoint.Issued || current.Status == teammodel.RunStatusSuccess {
			return nil
		}
		if snapshot.Work.ActiveRunID != run.ID || checkpoint.WorkVersionID != snapshot.Version.ID || checkpoint.WorkRevision != writingRevision(snapshot.Version) {
			return nil
		}
		draft.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
		checkpoint.Draft = &draft
		input := jsonMap(current.Input)
		input[writingRunKey] = writingMap(checkpoint)
		changed := teammodel.NewRunModel().Update(tx, map[string]any{"id": run.ID, "child_request_id": writer.checkpoint.RequestID, "execution_version": current.ExecutionVersion, "input": current.Input}, map[string]any{"input": jsonText(input)})
		if changed != 1 {
			return fmt.Errorf("草稿保存基线已变化")
		}
		writer.saved, writer.lastSaved = signature, time.Now()
		return nil
	})
	if err != nil && flush {
		writingDraftSaveUnconfirmed(run.ID, writer.checkpoint.RequestID)
	}
}

func writingDraftSaveUnconfirmed(runID uint64, requestID string) {
	dlog.ErrorFields("writing_draft_save", "流式草稿最后保存未确认；已保存内容不受影响", dlog.Fields{"run_id": runID, "request_id": requestID})
}

// 人工确认只提交原批次；不会改计划总数，也不会触及范围外章纲/正文 pin。
func (s Service) applyWritingChapterDraft(ctx context.Context, current *writingSnapshot, command WritingCommand) error {
	run := s.repo.FindRun(ctx, current.Work.ActiveRunID)
	if run == nil || run.ID != command.SourceRunID || run.ProjectID != current.Asset.ProjectID || (run.Status != teammodel.RunStatusFail && run.Status != teammodel.RunStatusCanceled) {
		return fmt.Errorf("原章纲草稿运行已变化，请重新载入")
	}
	checkpoint := writingCheckpointFor(*run)
	draft := checkpoint.Draft
	if draft == nil || len(draft.Units) == 0 || draft.RunID != run.ID || draft.RequestID != command.SourceRequestID || draft.RequestID != checkpoint.RequestID || checkpoint.WorkAssetID != current.Asset.ID || checkpoint.WorkVersionID != current.Version.ID || checkpoint.WorkRevision != writingRevision(current.Version) || !writingChapterDraftPhase(checkpoint) {
		return fmt.Errorf("章纲草稿基线已变化，已保留当前编辑")
	}
	if draft.ExpectedCount < 1 || draft.ExpectedCount > writingChapterBatchLimit || checkpoint.Count != 0 && checkpoint.Count != draft.ExpectedCount {
		return fmt.Errorf("原章纲批次无效")
	}
	checkpoint.Count = draft.ExpectedCount
	// 普通目录替换负责保留已有 pin；模型/草稿仍不得提交任何正文引用。
	if checkpoint.Action == "append" {
		candidate := map[string]any{"units": command.Units}
		if err := applyWritingPlanningResult(&current.Work, checkpoint, candidate); err != nil {
			return err
		}
	} else {
		if err := applyWritingChapterResult(&current.Work, checkpoint, command.Units); err != nil {
			return err
		}
	}
	current.Work.Status = "ready"
	if err := s.saveWritingDocument(ctx, current, run.ID); err != nil {
		return err
	}
	checkpoint.Draft = nil
	checkpoint.Issued = false
	checkpoint.WorkVersionID, checkpoint.WorkRevision = current.Version.ID, writingRevision(current.Version)
	input := jsonMap(run.Input)
	input[writingRunKey] = writingMap(checkpoint)
	run.Input = jsonText(input)
	// 保留原失败/取消事实，仅清理已人工接收的草稿并刷新快照。
	s.repo.UpdateRun(ctx, run.ID, map[string]any{"input": run.Input, "output": jsonText(writingOutput(*current, *run))})
	return nil
}
