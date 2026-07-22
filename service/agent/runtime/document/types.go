package document

import agentmodel "github.com/dever-package/bot/model/agent"

type StartRequest struct {
	SessionID uint64
	MessageID uint64
	RunID     uint64
	Title     string
	Meta      map[string]any
}

type AppendTextRequest struct {
	DocumentID uint64
	SourceKey  string
	Text       string
	Meta       map[string]any
}

type TextDelta struct {
	DocumentID uint64
	BlockID    uint64
	Revision   int
	Delta      string
}

type AppendMediaRequest struct {
	DocumentID uint64
	SourceKey  string
	Kind       string
	Meta       map[string]any
}

type ArtifactPayloadMap map[uint64][]map[string]any

type Payload struct {
	ID              uint64         `json:"id"`
	SessionID       uint64         `json:"session_id"`
	MessageID       uint64         `json:"message_id"`
	RunID           uint64         `json:"run_id"`
	Title           string         `json:"title"`
	Status          string         `json:"status"`
	BlockCount      int            `json:"block_count"`
	PendingJobCount int            `json:"pending_job_count"`
	Meta            map[string]any `json:"meta"`
	Blocks          []BlockPayload `json:"blocks"`
	CreatedAt       string         `json:"created_at"`
	UpdatedAt       string         `json:"updated_at"`
	CompletedAt     string         `json:"completed_at"`
}

type BlockPayload struct {
	ID        uint64           `json:"id"`
	Seq       int              `json:"seq"`
	Type      string           `json:"type"`
	Format    string           `json:"format"`
	MediaKind string           `json:"media_kind"`
	Text      string           `json:"text"`
	Status    string           `json:"status"`
	Meta      map[string]any   `json:"meta"`
	Artifacts []map[string]any `json:"artifacts"`
}

type Snapshot struct {
	Document agentmodel.Document
	Blocks   []agentmodel.DocumentBlock
}
