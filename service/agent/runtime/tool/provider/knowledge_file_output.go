package provider

import knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"

type knowledgeFileView struct {
	Path        string `json:"path"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Ext         string `json:"ext,omitempty"`
	MimeType    string `json:"mime_type,omitempty"`
	Size        int64  `json:"size,omitempty"`
	IndexStatus string `json:"index_status,omitempty"`
	SourceType  string `json:"source_type,omitempty"`
}

type knowledgeFileSearchView struct {
	knowledgeFileView
	Preview string  `json:"preview"`
	Score   float64 `json:"score"`
}

type knowledgeFileContentView struct {
	knowledgeFileView
	Content         string `json:"content"`
	OffsetBytes     int64  `json:"offset_bytes"`
	NextOffsetBytes int64  `json:"next_offset_bytes,omitempty"`
	TotalBytes      int64  `json:"total_bytes"`
	Truncated       bool   `json:"truncated"`
}

func knowledgeFileViews(files []knowledgeservice.KnowledgeRuntimeFile) []knowledgeFileView {
	result := make([]knowledgeFileView, 0, len(files))
	for _, file := range files {
		result = append(result, knowledgeFileViewFromRuntime(file))
	}
	return result
}

func knowledgeFileSearchViews(hits []knowledgeservice.KnowledgeRuntimeFileSearchHit) []knowledgeFileSearchView {
	result := make([]knowledgeFileSearchView, 0, len(hits))
	for _, hit := range hits {
		result = append(result, knowledgeFileSearchView{
			knowledgeFileView: knowledgeFileViewFromRuntime(hit.KnowledgeRuntimeFile),
			Preview:           hit.Preview,
			Score:             hit.Score,
		})
	}
	return result
}

func knowledgeFileContentViewFromRuntime(content knowledgeservice.KnowledgeRuntimeFileContent) knowledgeFileContentView {
	return knowledgeFileContentView{
		knowledgeFileView: knowledgeFileViewFromRuntime(content.KnowledgeRuntimeFile),
		Content:           content.Content,
		OffsetBytes:       content.OffsetBytes,
		NextOffsetBytes:   content.NextOffsetBytes,
		TotalBytes:        content.TotalBytes,
		Truncated:         content.Truncated,
	}
}

func knowledgeFileViewFromRuntime(file knowledgeservice.KnowledgeRuntimeFile) knowledgeFileView {
	return knowledgeFileView{
		Path:        file.Path,
		Name:        file.Name,
		Type:        file.Type,
		Ext:         file.Ext,
		MimeType:    file.MimeType,
		Size:        file.Size,
		IndexStatus: file.IndexStatus,
		SourceType:  file.SourceType,
	}
}
