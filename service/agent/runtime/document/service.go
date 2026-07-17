package document

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type Service struct {
	repository repository
	streams    streamWriter
}

func NewService() Service {
	return Service{repository: repository{}, streams: newStreamWriter()}
}

func (s Service) Start(ctx context.Context, request StartRequest) (agentmodel.Document, error) {
	if request.SessionID == 0 || request.MessageID == 0 || request.RunID == 0 {
		return agentmodel.Document{}, fmt.Errorf("创建文档缺少会话、消息或运行信息")
	}
	if existing := s.repository.byMessage(ctx, request.MessageID); existing != nil {
		return *existing, nil
	}
	now := time.Now()
	row, err := s.repository.create(ctx, map[string]any{
		"session_id":        request.SessionID,
		"message_id":        request.MessageID,
		"run_id":            request.RunID,
		"title":             strings.TrimSpace(request.Title),
		"status":            agentmodel.DocumentStatusWriting,
		"block_count":       0,
		"pending_job_count": 0,
		"meta":              encodeJSON(request.Meta, "{}"),
		"created_at":        now,
		"updated_at":        now,
	})
	if err != nil {
		if existing := s.repository.byMessage(ctx, request.MessageID); existing != nil {
			return *existing, nil
		}
		return agentmodel.Document{}, err
	}
	_ = s.streams.write(ctx, row.ID, "document_start", map[string]any{"document": s.Payload(ctx, row, nil)})
	return row, nil
}

func (s Service) AppendText(ctx context.Context, request AppendTextRequest) (agentmodel.DocumentBlock, error) {
	if existing := s.repository.blockBySource(ctx, request.DocumentID, request.SourceKey); existing != nil {
		return *existing, nil
	}
	if s.repository.find(ctx, request.DocumentID) == nil {
		return agentmodel.DocumentBlock{}, fmt.Errorf("智能体文档不存在")
	}
	text := strings.TrimSpace(strings.ReplaceAll(request.Text, "\r\n", "\n"))
	if text == "" {
		return agentmodel.DocumentBlock{}, nil
	}
	return s.appendBlock(ctx, request.DocumentID, request.SourceKey, map[string]any{
		"type":       agentmodel.DocumentBlockTypeText,
		"format":     "markdown",
		"media_kind": "",
		"text":       text,
		"status":     agentmodel.DocumentBlockStatusReady,
		"meta":       encodeJSON(request.Meta, "{}"),
	})
}

func (s Service) AppendMedia(ctx context.Context, request AppendMediaRequest) (agentmodel.DocumentBlock, error) {
	kind := normalizeMediaKind(request.Kind)
	return s.appendBlock(ctx, request.DocumentID, request.SourceKey, map[string]any{
		"type":       agentmodel.DocumentBlockTypeMedia,
		"format":     "artifact",
		"media_kind": kind,
		"text":       "",
		"status":     agentmodel.DocumentBlockStatusGenerating,
		"meta":       encodeJSON(request.Meta, "{}"),
	})
}

func (s Service) appendBlock(ctx context.Context, documentID uint64, sourceKey string, values map[string]any) (agentmodel.DocumentBlock, error) {
	sourceKey = strings.TrimSpace(sourceKey)
	if documentID == 0 || sourceKey == "" {
		return agentmodel.DocumentBlock{}, fmt.Errorf("追加文档内容缺少文档或来源标识")
	}
	if existing := s.repository.blockBySource(ctx, documentID, sourceKey); existing != nil {
		return *existing, nil
	}
	document := s.repository.find(ctx, documentID)
	if document == nil {
		return agentmodel.DocumentBlock{}, fmt.Errorf("智能体文档不存在")
	}
	now := time.Now()
	values["document_id"] = document.ID
	values["message_id"] = document.MessageID
	values["run_id"] = document.RunID
	values["source_key"] = sourceKey
	values["seq"] = s.repository.nextSeq(ctx, document.ID)
	values["created_at"] = now
	values["updated_at"] = now
	block, err := s.repository.createBlock(ctx, values)
	if err != nil {
		if existing := s.repository.blockBySource(ctx, documentID, sourceKey); existing != nil {
			return *existing, nil
		}
		return agentmodel.DocumentBlock{}, err
	}
	blocks := s.repository.blocks(ctx, document.ID)
	s.repository.update(ctx, document.ID, map[string]any{"block_count": len(blocks)})
	event := "block_commit"
	if block.Type == agentmodel.DocumentBlockTypeMedia {
		event = "media_block_append"
	}
	_ = s.streams.write(ctx, document.ID, event, map[string]any{"block": blockPayload(block, nil)})
	return block, nil
}

func (s Service) MarkBlockReady(ctx context.Context, blockID uint64, artifacts []map[string]any) (*agentmodel.DocumentBlock, error) {
	block := s.repository.updateBlock(ctx, blockID, map[string]any{"status": agentmodel.DocumentBlockStatusReady})
	if block == nil {
		return nil, fmt.Errorf("更新素材文档块失败")
	}
	return block, s.writeBlockStatus(ctx, block, "artifact_ready", artifacts)
}

func (s Service) MarkBlockFailed(ctx context.Context, blockID uint64, message string) (*agentmodel.DocumentBlock, error) {
	block := s.repository.updateBlock(ctx, blockID, map[string]any{
		"status": agentmodel.DocumentBlockStatusFailed,
		"meta":   encodeJSON(map[string]any{"error": publicError(message)}, "{}"),
	})
	if block == nil {
		return nil, fmt.Errorf("更新素材失败状态失败")
	}
	return block, s.writeBlockStatus(ctx, block, "artifact_failed", nil)
}

func (s Service) writeBlockStatus(ctx context.Context, block *agentmodel.DocumentBlock, event string, artifacts []map[string]any) error {
	if block == nil {
		return fmt.Errorf("素材文档块不存在")
	}
	output := map[string]any{"block": blockPayload(*block, artifacts)}
	if len(artifacts) > 0 {
		output["artifacts"] = artifacts
	}
	if err := s.streams.write(ctx, block.DocumentID, event, output); err != nil {
		return err
	}
	_, err := s.RefreshStatus(ctx, block.DocumentID)
	return err
}

func (s Service) MarkContentComplete(ctx context.Context, documentID uint64) (*agentmodel.Document, error) {
	document := s.repository.find(ctx, documentID)
	if document == nil {
		return nil, fmt.Errorf("智能体文档不存在")
	}
	if isTerminalDocumentStatus(document.Status) {
		return s.RefreshStatus(ctx, documentID)
	}
	if document.Status == agentmodel.DocumentStatusWriting {
		document = s.repository.update(ctx, documentID, map[string]any{"status": agentmodel.DocumentStatusGenerating})
	}
	if document == nil {
		return nil, fmt.Errorf("更新智能体文档状态失败")
	}
	_ = s.streams.write(ctx, documentID, "document_content_complete", map[string]any{
		"document_id": documentID,
		"status":      document.Status,
	})
	return s.RefreshStatus(ctx, documentID)
}

func (s Service) RefreshStatus(ctx context.Context, documentID uint64) (*agentmodel.Document, error) {
	document := s.repository.find(ctx, documentID)
	if document == nil {
		return nil, fmt.Errorf("智能体文档不存在")
	}
	jobs := s.repository.jobs(ctx, documentID)
	pending := 0
	failed := 0
	for _, job := range jobs {
		switch job.Status {
		case agentmodel.ArtifactJobStatusPending, agentmodel.ArtifactJobStatusRunning:
			pending++
		case agentmodel.ArtifactJobStatusFailed:
			failed++
		}
	}
	for _, block := range s.repository.blocks(ctx, documentID) {
		if block.Type == agentmodel.DocumentBlockTypeMedia && block.Status == agentmodel.DocumentBlockStatusFailed {
			failed++
		}
	}
	if document.Status == agentmodel.DocumentStatusWriting {
		updated := s.repository.update(ctx, documentID, map[string]any{"pending_job_count": pending})
		return updated, nil
	}
	if isTerminalDocumentStatus(document.Status) && pending == 0 {
		return document, s.publishDocumentComplete(ctx, *document)
	}
	status := agentmodel.DocumentStatusReady
	completedAt := any(time.Now())
	if pending > 0 {
		status = agentmodel.DocumentStatusGenerating
		completedAt = nil
	} else if failed > 0 {
		status = agentmodel.DocumentStatusPartialFailed
	}
	if status == agentmodel.DocumentStatusReady || status == agentmodel.DocumentStatusPartialFailed {
		projected := *document
		projected.Status = status
		if err := s.publishDocumentComplete(ctx, projected); err != nil {
			// Keep the durable document non-terminal so periodic reconciliation can
			// retry a terminal event that did not reach the shared stream.
			return document, err
		}
	}
	updated := s.repository.update(ctx, documentID, map[string]any{
		"status":            status,
		"pending_job_count": pending,
		"completed_at":      completedAt,
	})
	if updated == nil {
		return nil, fmt.Errorf("更新智能体文档状态失败")
	}
	return updated, nil
}

func (s Service) publishDocumentComplete(ctx context.Context, document agentmodel.Document) error {
	return s.streams.write(ctx, document.ID, "document_complete", map[string]any{
		"document_id": document.ID,
		"status":      document.Status,
	})
}

func isTerminalDocumentStatus(status string) bool {
	return status == agentmodel.DocumentStatusReady || status == agentmodel.DocumentStatusPartialFailed
}

func (s Service) Find(ctx context.Context, id uint64) *agentmodel.Document {
	return s.repository.find(ctx, id)
}

func (s Service) ByMessage(ctx context.Context, messageID uint64) *agentmodel.Document {
	return s.repository.byMessage(ctx, messageID)
}

func (s Service) Snapshot(ctx context.Context, documentID uint64) *Snapshot {
	document := s.repository.find(ctx, documentID)
	if document == nil {
		return nil
	}
	return &Snapshot{Document: *document, Blocks: s.repository.blocks(ctx, documentID)}
}

func (s Service) Text(ctx context.Context, documentID uint64) string {
	snapshot := s.Snapshot(ctx, documentID)
	if snapshot == nil {
		return ""
	}
	parts := make([]string, 0, len(snapshot.Blocks))
	for _, block := range snapshot.Blocks {
		if block.Type != agentmodel.DocumentBlockTypeText {
			continue
		}
		if text := strings.TrimSpace(block.Text); text != "" {
			parts = append(parts, text)
		}
	}
	return strings.Join(parts, "\n\n")
}

func (s Service) DeleteSession(ctx context.Context, sessionID uint64) {
	if sessionID == 0 {
		return
	}
	rows := agentmodel.NewDocumentModel().Select(ctx, map[string]any{"session_id": sessionID}, map[string]any{
		"order": "main.id asc",
	})
	documentIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			documentIDs = append(documentIDs, row.ID)
		}
	}
	agentmodel.NewArtifactJobModel().Delete(ctx, map[string]any{"session_id": sessionID})
	if len(documentIDs) > 0 {
		agentmodel.NewDocumentBlockModel().Delete(ctx, map[string]any{"document_id": documentIDs})
	}
	agentmodel.NewDocumentModel().Delete(ctx, map[string]any{"session_id": sessionID})
}

func normalizeMediaKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image", "video", "audio", "file":
		return strings.ToLower(strings.TrimSpace(kind))
	default:
		return "file"
	}
}

func publicError(_ string) string {
	return "素材生成失败"
}
