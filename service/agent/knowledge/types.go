package knowledge

import (
	"time"

	agentprompt "github.com/dever-package/bot/service/agent/prompt"
)

type RetrievedSnippet = agentprompt.KnowledgeSnippet

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

type AgentKnowledgeBaseRuntime struct {
	ID     uint64
	Name   string
	Prompt string
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
	IndexPowerID     uint64
	Collection       string
	EmbeddingPowerID uint64
	ConceptGraphMode int16
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
