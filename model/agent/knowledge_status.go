package agent

const (
	KnowledgeIndexStatusPending = "pending"
	KnowledgeIndexStatusRunning = "running"
	KnowledgeIndexStatusSuccess = "success"
	KnowledgeIndexStatusFailed  = "failed"
)

const (
	KnowledgeReviewStatusPending  = "pending"
	KnowledgeReviewStatusApproved = "approved"
	KnowledgeReviewStatusRejected = "rejected"
	KnowledgeReviewStatusExpired  = "expired"
)

const (
	KnowledgeIndexStagePending  = "pending"
	KnowledgeIndexStageParse    = "parse"
	KnowledgeIndexStageNodes    = "nodes"
	KnowledgeIndexStageSummary  = "summary"
	KnowledgeIndexStageGraph    = "graph"
	KnowledgeIndexStageVector   = "vector"
	KnowledgeIndexStageComplete = "complete"
	KnowledgeIndexStageFailed   = "failed"
)

const (
	DefaultKnowledgeCateID           uint64  = 1
	DefaultKnowledgeIndexPowerID     uint64  = 1
	DefaultKnowledgeNodeMaxLength    int     = 800
	DefaultKnowledgeNodeSplitOverlap int     = 120
	DefaultKnowledgeRetrieveLimit    int     = 5
	DefaultKnowledgeScoreThreshold   float64 = 0.35
	DefaultKnowledgeMaxContextChars  int     = 6000
	DefaultKnowledgeGraphDepth       int     = 1
	DefaultKnowledgeCollectionPrefix         = "zf_bot_knowledge_nodes"
)

var knowledgeIndexStatusOptions = []map[string]any{
	{"id": KnowledgeIndexStatusPending, "value": "待索引"},
	{"id": KnowledgeIndexStatusRunning, "value": "索引中"},
	{"id": KnowledgeIndexStatusSuccess, "value": "索引完成"},
	{"id": KnowledgeIndexStatusFailed, "value": "索引失败"},
}

var knowledgeIndexStageOptions = []map[string]any{
	{"id": KnowledgeIndexStagePending, "value": "待处理"},
	{"id": KnowledgeIndexStageParse, "value": "解析文档"},
	{"id": KnowledgeIndexStageNodes, "value": "生成节点"},
	{"id": KnowledgeIndexStageSummary, "value": "生成摘要"},
	{"id": KnowledgeIndexStageGraph, "value": "抽取图谱"},
	{"id": KnowledgeIndexStageVector, "value": "向量化"},
	{"id": KnowledgeIndexStageComplete, "value": "完成"},
	{"id": KnowledgeIndexStageFailed, "value": "失败"},
}

func KnowledgeIndexStatusOptions() []map[string]any {
	return cloneOptionRows(knowledgeIndexStatusOptions)
}

var knowledgeNodeTypeOptions = []map[string]any{
	{"id": KnowledgeNodeTypeRoot, "value": "根节点"},
	{"id": KnowledgeNodeTypeDir, "value": "目录"},
	{"id": KnowledgeNodeTypeDoc, "value": "文档"},
	{"id": KnowledgeNodeTypePage, "value": "页面"},
	{"id": KnowledgeNodeTypeHeading, "value": "标题"},
	{"id": KnowledgeNodeTypeParagraph, "value": "段落"},
	{"id": KnowledgeNodeTypeTable, "value": "表格"},
	{"id": KnowledgeNodeTypeImage, "value": "图片"},
	{"id": KnowledgeNodeTypeCode, "value": "代码"},
	{"id": KnowledgeNodeTypeAttachment, "value": "附件"},
	{"id": KnowledgeNodeTypeConcept, "value": "概念"},
	{"id": KnowledgeNodeTypeQA, "value": "QA 积累"},
}

var knowledgeReviewStatusOptions = []map[string]any{
	{"id": KnowledgeReviewStatusPending, "value": "待审核"},
	{"id": KnowledgeReviewStatusApproved, "value": "已通过"},
	{"id": KnowledgeReviewStatusRejected, "value": "已驳回"},
	{"id": KnowledgeReviewStatusExpired, "value": "已过期"},
}

var knowledgeSourceTypeOptions = []map[string]any{
	{"id": "upload", "value": "上传文档"},
	{"id": "qa", "value": "QA 积累"},
}

var knowledgeEdgeTypeOptions = []map[string]any{
	{"id": KnowledgeEdgeTypeContains, "value": "包含"},
	{"id": KnowledgeEdgeTypeReferences, "value": "引用"},
	{"id": KnowledgeEdgeTypeMentions, "value": "提及"},
	{"id": KnowledgeEdgeTypeDefines, "value": "定义"},
	{"id": KnowledgeEdgeTypeDependsOn, "value": "依赖"},
	{"id": KnowledgeEdgeTypeSimilar, "value": "相似"},
	{"id": KnowledgeEdgeTypeEvidence, "value": "证据"},
	{"id": KnowledgeEdgeTypeAsset, "value": "资源"},
	{"id": KnowledgeEdgeTypeConcept, "value": "概念"},
}
