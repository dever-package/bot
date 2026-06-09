package knowledge

import (
	"time"

	agentprompt "my/package/bot/service/agent/prompt"
)

type RetrievedSnippet = agentprompt.KnowledgeSnippet

type IndexResult struct {
	BaseID     uint64    `json:"base_id"`
	DocID      uint64    `json:"doc_id"`
	ChunkCount int       `json:"chunk_count"`
	Indexed    int       `json:"indexed"`
	Failed     int       `json:"failed"`
	Error      string    `json:"error,omitempty"`
	StartedAt  time.Time `json:"started_at"`
	FinishedAt time.Time `json:"finished_at"`
}

type RetrieveRequest struct {
	AgentID uint64
	Query   string
}

type RetrieveResult struct {
	Snippets []RetrievedSnippet `json:"snippets"`
	Matches  []map[string]any   `json:"matches"`
}

type agentKnowledgeBinding struct {
	ID             uint64
	AgentID        uint64
	BaseID         uint64
	Prompt         string
	RetrieveLimit  int
	ScoreThreshold float64
	Sort           int
	Base           knowledgeBaseConfig
}

type knowledgeBaseConfig struct {
	ID               uint64
	CateID           uint64
	Name             string
	Collection       string
	VectorEnabled    bool
	EmbeddingPowerID uint64
	ChunkSize        int
	ChunkOverlap     int
	RetrieveLimit    int
	ScoreThreshold   float64
	MaxContextChars  int
	Status           int16
}

type chunkRecord struct {
	ID        uint64
	DocID     uint64
	BaseID    uint64
	DirID     uint64
	DirPath   string
	Title     string
	Content   string
	EmbedText string
	PointID   uint64
	SortRank  int
}

type searchHit struct {
	ID      any            `json:"id"`
	Score   float64        `json:"score"`
	Payload map[string]any `json:"payload"`
}
