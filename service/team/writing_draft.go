package team

import (
	"context"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	dlog "github.com/shemic/dever/log"
)

type writingStreamDraft struct {
	Body      string `json:"body"`
	UnitID    string `json:"unit_id"`
	RunID     uint64 `json:"run_id"`
	RequestID string `json:"request_id"`
	UpdatedAt string `json:"updated_at"`
}
type writingDraftWriter struct {
	checkpoint writingCheckpoint
	body       string
	saved      string
	lastSaved  time.Time
}

// 半章只记在原Run检查点，不推进目录/正文pin；重连和停止后仍可显式恢复。
func (s Service) captureWritingDraft(ctx context.Context, run teammodel.Run, writer *writingDraftWriter, payload map[string]any, flush bool) {
	if writer.checkpoint.Phase != "body" {
		return
	}
	if payload != nil {
		if firstText(payload["request_id"]) != writer.checkpoint.RequestID {
			return
		}
		partial := mapValue(mapValue(mapValue(payload["output"])["meta"])["writing_preview"])
		if body, ok := mapValue(partial["fields"])["body"].(string); ok && body != "" {
			writer.body = body
		}
	}
	if writer.body == "" || writer.body == writer.saved || !flush && time.Since(writer.lastSaved) < time.Second {
		return
	}
	saveCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Second)
	defer cancel()
	current := s.repo.FindRun(saveCtx, run.ID)
	if current == nil {
		if flush {
			writingDraftSaveUnconfirmed(run.ID, writer.checkpoint.RequestID)
		}
		return
	}
	checkpoint := writingCheckpointFor(*current)
	if checkpoint.RequestID != writer.checkpoint.RequestID || checkpoint.Phase != "body" || !checkpoint.Issued {
		return
	}
	checkpoint.Draft = &writingStreamDraft{Body: writer.body, UnitID: writer.checkpoint.UnitID, RunID: run.ID, RequestID: writer.checkpoint.RequestID, UpdatedAt: time.Now().UTC().Format(time.RFC3339)}
	input := jsonMap(current.Input)
	input[writingRunKey] = writingMap(checkpoint)
	// 不改变租约或终态，只补同一次已发请求的文本。CAS避免覆盖刚完成或取消时的新检查点。
	changed := teammodel.NewRunModel().Update(saveCtx, map[string]any{"id": run.ID, "child_request_id": writer.checkpoint.RequestID, "execution_version": current.ExecutionVersion, "input": current.Input}, map[string]any{"input": jsonText(input)})
	if changed == 1 {
		writer.saved = writer.body
		writer.lastSaved = time.Now()
	} else if flush {
		writingDraftSaveUnconfirmed(run.ID, writer.checkpoint.RequestID)
	}
}

func writingDraftSaveUnconfirmed(runID uint64, requestID string) {
	dlog.ErrorFields("writing_draft_save", "流式草稿最后保存未确认；已完成正文不受影响", dlog.Fields{"run_id": runID, "request_id": requestID})
}
