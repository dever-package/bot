package artifact

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type BatchRequest struct {
	SessionID         uint64
	MessageID         uint64
	RunID             uint64
	DocumentID        uint64
	BlockID           uint64
	Kind              string
	Count             int
	Name              string
	BatchKey          string
	SeriesID          uint64
	SourceArtifactIDs []uint64
	Profile           map[string]any
}

type UploadBinding struct {
	FileID uint64
	Kind   string
	Name   string
}

type Service struct {
	repository repository
}

func NewService() Service {
	return Service{repository: repository{}}
}

func (s Service) BeginBatch(ctx context.Context, request BatchRequest) ([]agentmodel.Artifact, error) {
	if request.SessionID == 0 || request.MessageID == 0 || request.RunID == 0 {
		return []agentmodel.Artifact{}, nil
	}
	if existing := s.repository.byRunBatch(ctx, request.RunID, request.BatchKey); len(existing) > 0 {
		return existing, nil
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{"id": request.SessionID})
	if session == nil {
		return nil, fmt.Errorf("素材所属会话不存在")
	}
	kind := normalizeKind(request.Kind)
	count := request.Count
	if count < 1 {
		count = 1
	}
	if count > 8 {
		count = 8
	}
	sourceIDs := uniqueIDs(request.SourceArtifactIDs)
	seriesID, err := resolveSeries(ctx, *session, kind, request.SeriesID, sourceIDs, request.Profile)
	if err != nil {
		return nil, err
	}
	nextNo := s.repository.nextDisplayNo(ctx, request.SessionID, kind)
	now := time.Now()
	rows := make([]agentmodel.Artifact, 0, count)
	for index := 0; index < count; index++ {
		row, currentErr := s.repository.create(ctx, map[string]any{
			"session_id":          request.SessionID,
			"message_id":          request.MessageID,
			"run_id":              request.RunID,
			"step_id":             0,
			"document_id":         request.DocumentID,
			"block_id":            request.BlockID,
			"file_id":             0,
			"series_id":           seriesID,
			"kind":                kind,
			"display_no":          nextNo + index,
			"name":                batchArtifactName(request.Name, index, count),
			"batch_key":           strings.TrimSpace(request.BatchKey),
			"source_artifact_ids": encodeJSON(sourceIDs, "[]"),
			"meta":                encodeJSON(request.Profile, "{}"),
			"error":               "",
			"status":              agentmodel.ArtifactStatusGenerating,
			"created_at":          now,
			"updated_at":          now,
		})
		if currentErr != nil {
			return nil, currentErr
		}
		rows = append(rows, row)
	}
	if len(rows) > 0 && seriesID > 0 {
		setSeriesMaster(ctx, seriesID, rows[0].ID)
		agentmodel.NewSessionModel().Update(ctx, map[string]any{"id": request.SessionID}, map[string]any{
			"active_series_id": seriesID,
		})
	}
	return rows, nil
}

func (s Service) CompleteBatch(ctx context.Context, pending []agentmodel.Artifact, output any) (map[string]any, error) {
	result := generatedOutputMap(output)
	if len(pending) == 0 {
		return result, nil
	}
	files := generatedFiles(result)
	if len(files) < len(pending) {
		return result, fmt.Errorf("素材生成结果数量不足: 需要 %d 个，实际返回 %d 个", len(pending), len(files))
	}
	fileIDs := make([]uint64, len(pending))
	for index := range pending {
		fileIDs[index] = uint64Value(firstValue(files[index], "file_id", "id"))
		if fileIDs[index] == 0 {
			return result, fmt.Errorf("第 %d 个素材没有有效文件ID", index+1)
		}
	}
	for _, key := range generatedFileKeys {
		delete(result, key)
	}
	rows := make([]agentmodel.Artifact, 0, len(pending))
	for index, current := range pending {
		values := map[string]any{
			"file_id": fileIDs[index],
			"status":  agentmodel.ArtifactStatusReady,
			"error":   "",
		}
		updated := s.repository.update(ctx, current.ID, values)
		if updated.ID == 0 || updated.FileID != fileIDs[index] || updated.Status != agentmodel.ArtifactStatusReady {
			return result, fmt.Errorf("保存第 %d 个素材结果失败", index+1)
		}
		rows = append(rows, updated)
	}
	ensureReadySeriesMaster(ctx, rows)
	result["artifacts"] = Payloads(ctx, rows)
	return result, nil
}

func (s Service) FailBatch(ctx context.Context, pending []agentmodel.Artifact, message string) []map[string]any {
	rows := make([]agentmodel.Artifact, 0, len(pending))
	for _, current := range pending {
		rows = append(rows, s.repository.update(ctx, current.ID, map[string]any{
			"status": agentmodel.ArtifactStatusFailed,
			"error":  strings.TrimSpace(message),
		}))
	}
	return Payloads(ctx, rows)
}

func (s Service) ResetBatch(ctx context.Context, pending []agentmodel.Artifact) []agentmodel.Artifact {
	rows := make([]agentmodel.Artifact, 0, len(pending))
	for _, current := range pending {
		rows = append(rows, s.repository.update(ctx, current.ID, map[string]any{
			"file_id": 0,
			"status":  agentmodel.ArtifactStatusGenerating,
			"error":   "",
		}))
	}
	return rows
}

func (s Service) BindUploads(ctx context.Context, sessionID uint64, messageID uint64, bindings []UploadBinding) ([]agentmodel.Artifact, error) {
	if sessionID == 0 || messageID == 0 || len(bindings) == 0 {
		return []agentmodel.Artifact{}, nil
	}
	rows := make([]agentmodel.Artifact, 0, len(bindings))
	nextByKind := map[string]int{}
	for _, binding := range bindings {
		if binding.FileID == 0 {
			continue
		}
		if existing := agentmodel.NewArtifactModel().Find(ctx, map[string]any{"message_id": messageID, "file_id": binding.FileID}); existing != nil {
			rows = append(rows, *existing)
			continue
		}
		kind := normalizeKind(binding.Kind)
		next := nextByKind[kind]
		if next == 0 {
			next = s.repository.nextDisplayNo(ctx, sessionID, kind)
		}
		now := time.Now()
		row, err := s.repository.create(ctx, map[string]any{
			"session_id":          sessionID,
			"message_id":          messageID,
			"file_id":             binding.FileID,
			"kind":                kind,
			"display_no":          next,
			"name":                strings.TrimSpace(binding.Name),
			"batch_key":           fmt.Sprintf("input:%d", messageID),
			"source_artifact_ids": "[]",
			"meta":                "{}",
			"status":              agentmodel.ArtifactStatusReady,
			"created_at":          now,
			"updated_at":          now,
		})
		if err != nil {
			return nil, err
		}
		rows = append(rows, row)
		nextByKind[kind] = next + 1
	}
	return rows, nil
}

func (s Service) Find(ctx context.Context, id uint64) *agentmodel.Artifact {
	return s.repository.find(ctx, id)
}

func (s Service) ByMessage(ctx context.Context, messageID uint64) []agentmodel.Artifact {
	return s.repository.byMessage(ctx, messageID)
}

func (s Service) MessagePayloads(ctx context.Context, messageID uint64) []map[string]any {
	return Payloads(ctx, s.ByMessage(ctx, messageID))
}

func (s Service) MessagePayloadMap(ctx context.Context, messageIDs []uint64) map[uint64][]map[string]any {
	result := make(map[uint64][]map[string]any, len(messageIDs))
	for _, artifact := range s.repository.byMessages(ctx, messageIDs) {
		result[artifact.MessageID] = append(result[artifact.MessageID], Payload(ctx, artifact))
	}
	return result
}

func (s Service) BlockPayloadMap(ctx context.Context, blockIDs []uint64) map[uint64][]map[string]any {
	result := make(map[uint64][]map[string]any, len(blockIDs))
	for _, current := range s.repository.byBlocks(ctx, blockIDs) {
		result[current.BlockID] = append(result[current.BlockID], Payload(ctx, current))
	}
	return result
}

func IsSupportedKind(kind string) bool {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image", "video", "audio", "file":
		return true
	default:
		return false
	}
}

func normalizeKind(kind string) string {
	kind = strings.ToLower(strings.TrimSpace(kind))
	if IsSupportedKind(kind) {
		return kind
	}
	return "file"
}

func batchArtifactName(base string, index int, count int) string {
	base = strings.TrimSpace(strings.Join(strings.Fields(base), " "))
	if base == "" {
		base = "生成素材"
	}
	runes := []rune(base)
	if len(runes) > 48 {
		base = string(runes[:48])
	}
	if count > 1 {
		return fmt.Sprintf("%s（%d）", base, index+1)
	}
	return base
}

func cloneMap(source map[string]any) map[string]any {
	result := make(map[string]any, len(source)+1)
	for key, value := range source {
		result[key] = value
	}
	return result
}

func firstValue(source map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := source[key]; exists {
			return value
		}
	}
	return nil
}
