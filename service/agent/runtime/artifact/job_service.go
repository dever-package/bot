package artifact

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
)

func (s Service) EnqueueJob(ctx context.Context, request JobRequest) (agentmodel.ArtifactJob, error) {
	callID := strings.TrimSpace(request.Call.ID)
	if request.DocumentID == 0 || request.BlockID == 0 || request.RunID == 0 || callID == "" {
		return agentmodel.ArtifactJob{}, fmt.Errorf("创建素材任务缺少文档、内容块、运行或工具调用信息")
	}
	repository := jobRepository{}
	if existing := repository.byToolCall(ctx, request.RunID, callID); existing != nil {
		dispatchJob(existing.ID)
		return *existing, nil
	}
	requestID := uuid.NewSHA1(uuid.NameSpaceOID, []byte(fmt.Sprintf("artifact:%d:%s", request.RunID, callID))).String()
	now := time.Now()
	row, err := repository.create(ctx, map[string]any{
		"request_id":       requestID,
		"document_id":      request.DocumentID,
		"block_id":         request.BlockID,
		"session_id":       request.SessionID,
		"message_id":       request.MessageID,
		"run_id":           request.RunID,
		"tool_call_id":     callID,
		"tool_name":        strings.TrimSpace(request.Call.Name),
		"tool_kind":        normalizeKind(request.Kind),
		"arguments":        encodeJSON(request.Arguments, "{}"),
		"snapshot":         encodeJSON(request.Snapshot, "{}"),
		"status":           agentmodel.ArtifactJobStatusPending,
		"attempt":          0,
		"version":          1,
		"worker_id":        "",
		"available_at":     now,
		"lease_expires_at": nil,
		"heartbeat_at":     nil,
		"error":            "",
		"created_at":       now,
		"updated_at":       now,
	})
	if err != nil {
		if existing := repository.byToolCall(ctx, request.RunID, callID); existing != nil {
			dispatchJob(existing.ID)
			return *existing, nil
		}
		return agentmodel.ArtifactJob{}, err
	}
	_, _ = runtimedocument.NewService().RefreshStatus(ctx, request.DocumentID)
	dispatchJob(row.ID)
	return row, nil
}
