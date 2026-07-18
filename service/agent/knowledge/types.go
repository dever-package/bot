package knowledge

import "time"

type RetrievedSnippet struct {
	BaseID   uint64  `json:"base_id"`
	BaseName string  `json:"base_name"`
	Prompt   string  `json:"prompt"`
	DirID    uint64  `json:"dir_id"`
	DirPath  string  `json:"dir_path"`
	DocID    uint64  `json:"doc_id"`
	NodeID   uint64  `json:"node_id"`
	Title    string  `json:"title"`
	Content  string  `json:"content"`
	Score    float64 `json:"score"`
	Source   string  `json:"source"`
	SortRank int     `json:"sort_rank"`
	HitCount int     `json:"-"`
	Weight   float64 `json:"-"`
}

type IndexResult struct {
	BaseID     uint64    `json:"base_id"`
	DocID      uint64    `json:"doc_id"`
	NodeCount  int       `json:"node_count"`
	Indexed    int       `json:"indexed"`
	Failed     int       `json:"failed"`
	Error      string    `json:"error,omitempty"`
	StartedAt  time.Time `json:"started_at"`
	FinishedAt time.Time `json:"finished_at"`
}

type RetrieveResult struct {
	Snippets []RetrievedSnippet `json:"snippets"`
	Matches  []map[string]any   `json:"matches"`
}

type RetrieveDebugRequest struct {
	AgentID uint64
	BaseID  uint64
	Query   string
	Limit   int
}

type RetrieveDebugResult struct {
	Query         string                     `json:"query"`
	KnowledgeBase KnowledgeRetrieveDebugBase `json:"knowledge_base"`
	Snippets      []RetrievedSnippet         `json:"snippets"`
	Matches       []map[string]any           `json:"matches"`
	SourceCounts  map[string]int             `json:"source_counts"`
	Plans         []map[string]any           `json:"plans"`
}

type KnowledgeRetrieveDebugBase struct {
	ID         uint64 `json:"id"`
	Name       string `json:"name"`
	Mode       int16  `json:"mode"`
	GraphDepth int    `json:"graph_depth"`
}

type KnowledgeBaseRuntime struct {
	ID              uint64
	Name            string
	Prompt          string
	MaxContextChars int
}

type agentKnowledgeBinding struct {
	BaseID         uint64
	Prompt         string
	RetrieveLimit  int
	ScoreThreshold float64
	Base           knowledgeBaseConfig
}

type knowledgeBaseConfig struct {
	ID               uint64
	CateID           uint64
	Name             string
	IndexPowerID     uint64
	Collection       string
	EmbeddingPowerID uint64
	ConceptGraphMode int16
	ReviewRequired   bool
	RetrieveLimit    int
	ScoreThreshold   float64
	MaxContextChars  int
	GraphDepth       int
	Status           int16
}

type retrievalPlan struct {
	Queries  []string
	DirIDs   []uint64
	DocIDs   []uint64
	DirPaths []string
	Reason   string
	Raw      string
	Error    string
}

type searchHit struct {
	ID      any            `json:"id"`
	Score   float64        `json:"score"`
	Payload map[string]any `json:"payload"`
}
