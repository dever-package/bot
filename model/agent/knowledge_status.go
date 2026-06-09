package agent

const (
	KnowledgeIndexStatusPending = "pending"
	KnowledgeIndexStatusRunning = "running"
	KnowledgeIndexStatusSuccess = "success"
	KnowledgeIndexStatusFailed  = "failed"
)

const (
	DefaultKnowledgeCateID           uint64  = 1
	DefaultKnowledgeChunkSize        int     = 800
	DefaultKnowledgeChunkOverlap     int     = 120
	DefaultKnowledgeRetrieveLimit    int     = 5
	DefaultKnowledgeScoreThreshold   float64 = 0.35
	DefaultKnowledgeMaxContextChars  int     = 6000
	DefaultKnowledgeCollectionPrefix         = "zf_bot_knowledge_chunks"
)

var knowledgeIndexStatusOptions = []map[string]any{
	{"id": KnowledgeIndexStatusPending, "value": "待索引"},
	{"id": KnowledgeIndexStatusRunning, "value": "索引中"},
	{"id": KnowledgeIndexStatusSuccess, "value": "索引完成"},
	{"id": KnowledgeIndexStatusFailed, "value": "索引失败"},
}

func KnowledgeIndexStatusOptions() []map[string]any {
	return cloneOptionRows(knowledgeIndexStatusOptions)
}
