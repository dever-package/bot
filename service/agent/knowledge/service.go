package knowledge

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	knowledgeparse "my/package/bot/service/agent/knowledge/parse"
	agentprompt "my/package/bot/service/agent/prompt"
)

type Service struct {
	embedder embeddingService
	qdrant   qdrantClient
}

func NewService() Service {
	return Service{
		embedder: newEmbeddingService(),
		qdrant:   newQdrantClient(),
	}
}

func baseCollection(base agentmodel.KnowledgeBase) string {
	if strings.TrimSpace(base.Collection) != "" {
		return strings.TrimSpace(base.Collection)
	}
	return knowledgeCollectionName(base.CateID)
}

func (s Service) IndexDocument(ctx context.Context, docID uint64) (IndexResult, error) {
	startedAt := time.Now()
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": docID})
	if doc == nil {
		return IndexResult{}, fmt.Errorf("知识文档不存在")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": doc.KnowledgeBaseID})
	if base == nil {
		return IndexResult{}, fmt.Errorf("知识库不存在")
	}
	result := IndexResult{BaseID: base.ID, DocID: doc.ID, StartedAt: startedAt}
	resetDocumentIndexProgress(ctx, doc.ID)
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": doc.ID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"index_stage":   agentmodel.KnowledgeIndexStageParse,
		"error_message": "",
	})
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageParse, agentmodel.KnowledgeIndexStatusRunning, "")
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": base.ID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})

	parseResult, sourceHash, err := s.parseDocument(ctx, *base, *doc)
	if err != nil {
		s.markDocFailed(ctx, doc.ID, base.ID, err)
		result.Error = err.Error()
		result.FinishedAt = time.Now()
		return result, err
	}
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageParse, agentmodel.KnowledgeIndexStatusSuccess, "")
	s.clearDocumentIndex(ctx, *base, doc.ID)
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageNodes, agentmodel.KnowledgeIndexStatusRunning, "")
	parseID := saveKnowledgeParse(ctx, *base, *doc, parseResult, sourceHash)
	nodeCount, err := s.saveDocumentNodes(ctx, *base, *doc, parseID, parseResult)
	if err != nil {
		s.markDocFailed(ctx, doc.ID, base.ID, err)
		result.Error = err.Error()
		result.FinishedAt = time.Now()
		return result, err
	}
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageNodes, agentmodel.KnowledgeIndexStatusSuccess, "")
	if nodeCount == 0 {
		err := fmt.Errorf("文档内容为空，无法索引")
		s.markDocFailed(ctx, doc.ID, base.ID, err)
		result.Error = err.Error()
		result.FinishedAt = time.Now()
		return result, err
	}
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageVector, agentmodel.KnowledgeIndexStatusRunning, "")
	vectorErr := s.indexDocumentVectors(ctx, *base, doc.ID)
	errorMessage := ""
	if vectorErr != nil {
		errorMessage = appendIndexWarning(errorMessage, "向量索引失败: "+vectorErr.Error())
		markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageVector, agentmodel.KnowledgeIndexStatusFailed, vectorErr.Error())
	} else {
		markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageVector, agentmodel.KnowledgeIndexStatusSuccess, "")
	}
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageGraph, agentmodel.KnowledgeIndexStatusRunning, "")
	if graphErr := s.extractDocumentConceptGraph(ctx, *base, *doc); graphErr != nil {
		errorMessage = appendIndexWarning(errorMessage, "关系图谱抽取失败: "+graphErr.Error())
		markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageGraph, agentmodel.KnowledgeIndexStatusFailed, graphErr.Error())
	} else {
		markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageGraph, agentmodel.KnowledgeIndexStatusSuccess, "")
	}
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageSummary, agentmodel.KnowledgeIndexStatusRunning, "")
	docSummary := documentSummaryFromNodes(ctx, doc.ID)
	keywords := keywordText(docSummary)
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageSummary, agentmodel.KnowledgeIndexStatusSuccess, "")
	finalStage := agentmodel.KnowledgeIndexStageComplete
	if errorMessage != "" {
		finalStage = firstFailedIndexStage(ctx, doc.ID)
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": doc.ID}, map[string]any{
		"content":       parseResult.PlainText,
		"summary":       truncateText(docSummary, 1200),
		"keywords":      keywords,
		"content_hash":  sourceHash,
		"node_count":    nodeCount,
		"index_status":  agentmodel.KnowledgeIndexStatusSuccess,
		"index_stage":   finalStage,
		"error_message": errorMessage,
	})
	if doc.DirID > 0 {
		s.refreshDirectorySummaries(ctx, base.ID, doc.DirID)
	}
	s.refreshBaseStats(ctx, base.ID, agentmodel.KnowledgeIndexStatusSuccess, errorMessage)
	result.NodeCount = nodeCount
	result.Indexed = nodeCount
	result.FinishedAt = time.Now()
	return result, nil
}

func (s Service) parseDocument(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc) (knowledgeparse.Result, string, error) {
	filePath, err := knowledgeDocFilePath(ctx, base.ID, doc.StoragePath)
	if err != nil {
		return knowledgeparse.Result{}, "", err
	}
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		return knowledgeparse.Result{}, "", fmt.Errorf("文件不存在")
	}
	content := doc.Content
	if content == "" && isEditableKnowledgeFile(filePath, doc.MimeType, info.Size()) {
		if raw, err := os.ReadFile(filePath); err == nil {
			content = string(raw)
		}
	}
	sourceHash := fileContentHash(filePath, content, info)
	req := knowledgeparse.Request{
		Path:          filePath,
		Name:          doc.FileName,
		MimeType:      doc.MimeType,
		Content:       content,
		MaxNodeLength: normalizeNodeMaxLength(base.NodeMaxLength),
	}
	result, err := s.parseDocumentContent(ctx, base, doc, req)
	if err != nil {
		return knowledgeparse.Result{}, sourceHash, err
	}
	return result, sourceHash, nil
}

func (s Service) parseDocumentContent(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, req knowledgeparse.Request) (knowledgeparse.Result, error) {
	parserService, err := knowledgeParserServiceForDocument(ctx, base, doc)
	if err != nil {
		return knowledgeparse.Result{}, err
	}
	if parserService == nil {
		return knowledgeparse.ParseFile(req)
	}
	return knowledgeparse.ParseWithMinerU(ctx, req, knowledgeparse.MinerUConfig{
		Host:         parserService.Host,
		APIKey:       parserService.APIKey,
		ModelVersion: "vlm",
		Language:     "ch",
	})
}

func knowledgeParserServiceForDocument(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc) (*agentmodel.KnowledgeParserService, error) {
	if base.ParserServiceID == 0 {
		return nil, nil
	}
	if !knowledgeparse.SupportsMinerU(doc.FileName, doc.MimeType) {
		return nil, nil
	}
	parserService := agentmodel.NewKnowledgeParserServiceModel().Find(ctx, map[string]any{"id": base.ParserServiceID})
	if parserService == nil {
		return nil, fmt.Errorf("文档解析服务不存在")
	}
	if parserService.Status != 1 {
		return nil, fmt.Errorf("文档解析服务已停用")
	}
	if strings.ToLower(strings.TrimSpace(parserService.Provider)) != agentmodel.KnowledgeParserProviderMinerU {
		return nil, fmt.Errorf("当前仅支持 MinerU 文档解析服务")
	}
	return parserService, nil
}

func knowledgeDocFilePath(ctx context.Context, baseID uint64, storagePath string) (string, error) {
	_, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return "", err
	}
	storagePath = NormalizeDirPath(storagePath)
	if storagePath == "" {
		return "", fmt.Errorf("文档存储路径为空")
	}
	filePath := filepath.Join(root, filepath.FromSlash(storagePath))
	if err := ensureInsideKnowledgeRoot(root, filePath); err != nil {
		return "", err
	}
	return filePath, nil
}

func fileContentHash(filePath string, content string, info os.FileInfo) string {
	if strings.TrimSpace(content) != "" {
		return contentHash(content)
	}
	return contentHash(fmt.Sprintf("%s|%d|%d", filepath.ToSlash(filePath), info.Size(), info.ModTime().UnixNano()))
}

func saveKnowledgeParse(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, result knowledgeparse.Result, sourceHash string) uint64 {
	outlineJSON := jsonText(result.Outline)
	pagesJSON := jsonText(result.Pages)
	assetsJSON := jsonText(result.Assets)
	rawJSON := jsonText(result.Raw)
	parserServiceID, provider := parseProviderMetadata(ctx, base, doc, result)
	return util.ToUint64(agentmodel.NewKnowledgeParseModel().Insert(ctx, withCreatedAt(map[string]any{
		"knowledge_base_id": base.ID,
		"dir_id":            doc.DirID,
		"doc_id":            doc.ID,
		"parser_service_id": parserServiceID,
		"provider":          provider,
		"source_hash":       sourceHash,
		"parse_hash":        contentHash(result.PlainText + outlineJSON + pagesJSON + assetsJSON),
		"plain_text":        result.PlainText,
		"markdown":          result.Markdown,
		"outline_json":      outlineJSON,
		"pages_json":        pagesJSON,
		"assets_json":       assetsJSON,
		"raw_json":          rawJSON,
		"status":            1,
		"error_message":     "",
	})))
}

func parseProviderMetadata(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, result knowledgeparse.Result) (uint64, string) {
	if parserNameFromResult(result) != agentmodel.KnowledgeParserProviderMinerU {
		return 0, "local"
	}
	parserService, err := knowledgeParserServiceForDocument(ctx, base, doc)
	if err != nil || parserService == nil {
		return 0, agentmodel.KnowledgeParserProviderMinerU
	}
	return parserService.ID, strings.TrimSpace(parserService.Provider)
}

func parserNameFromResult(result knowledgeparse.Result) string {
	if result.Raw == nil {
		return ""
	}
	return strings.TrimSpace(util.ToString(result.Raw["parser"]))
}

func (s Service) clearDocumentIndex(ctx context.Context, base agentmodel.KnowledgeBase, docID uint64) {
	clearKnowledgeDocumentIndexWithBase(ctx, base, docID)
}

func (s Service) saveDocumentNodes(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, parseID uint64, result knowledgeparse.Result) (int, error) {
	dirPath := KnowledgeDirPath(ctx, doc.DirID)
	docPath := strings.Trim(strings.Join(nonEmptyStrings(dirPath, doc.Title), "/"), "/")
	docNodeID := insertKnowledgeNode(ctx, knowledgeNodeInput{
		Base:      base,
		Doc:       doc,
		ParseID:   parseID,
		ParentID:  0,
		NodeType:  agentmodel.KnowledgeNodeTypeDoc,
		Title:     doc.Title,
		Content:   result.Markdown,
		PlainText: result.PlainText,
		Path:      docPath,
		NodeKey:   "doc",
		Depth:     0,
		Sort:      1,
	})
	if docNodeID == 0 {
		return 0, fmt.Errorf("创建文档节点失败")
	}
	count := 1
	for index, node := range result.Outline {
		count += insertParseNodeTree(ctx, base, doc, parseID, docNodeID, docPath, node, 1, index+1, fmt.Sprintf("n%d", index+1))
	}
	count += insertParsePages(ctx, base, doc, parseID, docNodeID, docPath, result.Pages)
	count += insertParseAssets(ctx, base, doc, parseID, docNodeID, docPath, result.Assets)
	return count, nil
}

type knowledgeNodeInput struct {
	Base      agentmodel.KnowledgeBase
	Doc       agentmodel.KnowledgeDoc
	ParseID   uint64
	ParentID  uint64
	NodeType  string
	Title     string
	Content   string
	PlainText string
	Summary   string
	Path      string
	NodeKey   string
	Depth     int
	Sort      int
	PageStart int
	PageEnd   int
	LineStart int
	LineEnd   int
	Metadata  map[string]any
}

func insertParseNodeTree(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, parseID uint64, parentID uint64, parentPath string, node knowledgeparse.Node, depth int, sortRank int, key string) int {
	title := strings.TrimSpace(node.Title)
	if title == "" {
		title = defaultNodeTitle(node.Type, sortRank)
	}
	plainText := strings.TrimSpace(node.PlainText)
	if plainText == "" {
		plainText = strings.TrimSpace(agentprompt.TextFromRichText(node.Content))
	}
	nodePath := strings.Trim(strings.Join(nonEmptyStrings(parentPath, title), "/"), "/")
	nodeID := insertKnowledgeNode(ctx, knowledgeNodeInput{
		Base:      base,
		Doc:       doc,
		ParseID:   parseID,
		ParentID:  parentID,
		NodeType:  normalizeParseNodeType(node.Type),
		Title:     title,
		Content:   node.Content,
		PlainText: plainText,
		Path:      nodePath,
		NodeKey:   key,
		Depth:     depth,
		Sort:      sortRank,
		PageStart: node.PageStart,
		PageEnd:   node.PageEnd,
		LineStart: node.LineStart,
		LineEnd:   node.LineEnd,
		Metadata:  node.Metadata,
	})
	if nodeID == 0 {
		return 0
	}
	insertContainsEdge(ctx, base.ID, doc.ID, parentID, nodeID)
	insertNodeReferenceEdges(ctx, base, doc, nodeID, node.Content)
	count := 1
	for index, child := range node.Children {
		count += insertParseNodeTree(ctx, base, doc, parseID, nodeID, nodePath, child, depth+1, index+1, fmt.Sprintf("%s.%d", key, index+1))
	}
	return count
}

func insertParsePages(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, parseID uint64, parentID uint64, parentPath string, pages []knowledgeparse.Page) int {
	count := 0
	for index, page := range pages {
		text := strings.TrimSpace(firstNonEmpty(page.PlainText, page.Markdown))
		if text == "" {
			continue
		}
		title := strings.TrimSpace(page.Title)
		if title == "" {
			title = fmt.Sprintf("第 %d 页", firstPositive(page.Number, index+1))
		}
		nodeID := insertKnowledgeNode(ctx, knowledgeNodeInput{
			Base:      base,
			Doc:       doc,
			ParseID:   parseID,
			ParentID:  parentID,
			NodeType:  agentmodel.KnowledgeNodeTypePage,
			Title:     title,
			Content:   strings.TrimSpace(page.Markdown),
			PlainText: text,
			Path:      strings.Trim(strings.Join(nonEmptyStrings(parentPath, title), "/"), "/"),
			NodeKey:   fmt.Sprintf("page:%d", firstPositive(page.Number, index+1)),
			Depth:     1,
			Sort:      2000 + index + 1,
			PageStart: firstPositive(page.Number, index+1),
			PageEnd:   firstPositive(page.Number, index+1),
			Metadata:  page.Metadata,
		})
		if nodeID == 0 {
			continue
		}
		insertContainsEdge(ctx, base.ID, doc.ID, parentID, nodeID)
		count++
	}
	return count
}

func insertParseAssets(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, parseID uint64, parentID uint64, parentPath string, assets []knowledgeparse.Asset) int {
	count := 0
	for index, asset := range assets {
		title := strings.TrimSpace(firstNonEmpty(asset.Name, asset.Path, fmt.Sprintf("资源 %d", index+1)))
		nodeType := agentmodel.KnowledgeNodeTypeAttachment
		if strings.HasPrefix(strings.ToLower(asset.MimeType), "image/") || strings.EqualFold(asset.Type, "image") {
			nodeType = agentmodel.KnowledgeNodeTypeImage
		}
		summary := strings.TrimSpace(strings.Join(nonEmptyStrings(asset.Type, asset.MimeType, asset.Path), " · "))
		nodeID := insertKnowledgeNode(ctx, knowledgeNodeInput{
			Base:      base,
			Doc:       doc,
			ParseID:   parseID,
			ParentID:  parentID,
			NodeType:  nodeType,
			Title:     title,
			Summary:   summary,
			PlainText: summary,
			Path:      strings.Trim(strings.Join(nonEmptyStrings(parentPath, "资源", title), "/"), "/"),
			NodeKey:   fmt.Sprintf("asset:%d:%s", index+1, contentHash(asset.Path)[:12]),
			Depth:     1,
			Sort:      3000 + index + 1,
			Metadata: map[string]any{
				"name":      asset.Name,
				"path":      asset.Path,
				"type":      asset.Type,
				"mime_type": asset.MimeType,
				"metadata":  asset.Metadata,
			},
		})
		if nodeID == 0 {
			continue
		}
		insertKnowledgeEdge(ctx, knowledgeEdgeInput{
			BaseID:     base.ID,
			DocID:      doc.ID,
			FromNodeID: parentID,
			ToNodeID:   nodeID,
			EdgeType:   agentmodel.KnowledgeEdgeTypeAsset,
			Label:      "资源",
			Summary:    summary,
			Weight:     0.7,
			Confidence: 1,
			Metadata: map[string]any{
				"source": "parse_asset",
			},
		})
		count++
	}
	return count
}

func insertKnowledgeNode(ctx context.Context, input knowledgeNodeInput) uint64 {
	content := strings.TrimSpace(input.Content)
	plainText := strings.TrimSpace(input.PlainText)
	if plainText == "" {
		plainText = strings.TrimSpace(agentprompt.TextFromRichText(content))
	}
	summary := strings.TrimSpace(input.Summary)
	if summary == "" {
		summary = truncateText(firstNonEmpty(plainText, content, input.Title), 600)
	}
	searchText := searchableNodeText(KnowledgeDirPath(ctx, input.Doc.DirID), input.Doc.Title, input.Path, input.Title, summary, plainText)
	return util.ToUint64(agentmodel.NewKnowledgeNodeModel().Insert(ctx, withCreatedAt(map[string]any{
		"knowledge_base_id": input.Base.ID,
		"dir_id":            input.Doc.DirID,
		"doc_id":            input.Doc.ID,
		"parse_id":          input.ParseID,
		"parent_id":         input.ParentID,
		"node_type":         input.NodeType,
		"title":             truncateText(strings.TrimSpace(input.Title), 255),
		"summary":           summary,
		"content":           content,
		"plain_text":        plainText,
		"search_text":       searchText,
		"keywords":          keywordText(searchText),
		"path":              truncateText(input.Path, 1024),
		"node_key":          input.NodeKey,
		"depth":             input.Depth,
		"sort":              input.Sort,
		"page_start":        input.PageStart,
		"page_end":          input.PageEnd,
		"line_start":        input.LineStart,
		"line_end":          input.LineEnd,
		"metadata":          jsonText(input.Metadata),
		"content_hash":      contentHash(input.Path + input.Title + plainText),
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"error_message":     "",
		"status":            1,
	})))
}

func insertContainsEdge(ctx context.Context, baseID uint64, docID uint64, parentID uint64, nodeID uint64) {
	if baseID == 0 || docID == 0 || parentID == 0 || nodeID == 0 {
		return
	}
	insertKnowledgeEdge(ctx, knowledgeEdgeInput{
		BaseID:     baseID,
		DocID:      docID,
		FromNodeID: parentID,
		ToNodeID:   nodeID,
		EdgeType:   agentmodel.KnowledgeEdgeTypeContains,
		Label:      "包含",
		Summary:    "文档结构包含关系",
		Weight:     1,
		Confidence: 1,
		Metadata: map[string]any{
			"source": "structure",
		},
	})
}

func normalizeParseNodeType(value string) string {
	switch strings.TrimSpace(value) {
	case agentmodel.KnowledgeNodeTypePage,
		agentmodel.KnowledgeNodeTypeHeading,
		agentmodel.KnowledgeNodeTypeParagraph,
		agentmodel.KnowledgeNodeTypeTable,
		agentmodel.KnowledgeNodeTypeImage,
		agentmodel.KnowledgeNodeTypeCode,
		agentmodel.KnowledgeNodeTypeAttachment:
		return strings.TrimSpace(value)
	default:
		return agentmodel.KnowledgeNodeTypeParagraph
	}
}

func defaultNodeTitle(nodeType string, index int) string {
	switch nodeType {
	case agentmodel.KnowledgeNodeTypeCode:
		return fmt.Sprintf("代码 %d", index)
	case agentmodel.KnowledgeNodeTypeTable:
		return fmt.Sprintf("表格 %d", index)
	case agentmodel.KnowledgeNodeTypeImage:
		return fmt.Sprintf("图片 %d", index)
	default:
		return fmt.Sprintf("节点 %d", index)
	}
}

func searchableNodeText(dirPath string, docTitle string, path string, title string, summary string, content string) string {
	parts := make([]string, 0, 6)
	if strings.TrimSpace(dirPath) != "" {
		parts = append(parts, "目录："+strings.ReplaceAll(strings.TrimSpace(dirPath), "/", " / "))
	}
	if strings.TrimSpace(docTitle) != "" {
		parts = append(parts, "文档："+strings.TrimSpace(docTitle))
	}
	if strings.TrimSpace(path) != "" {
		parts = append(parts, "路径："+strings.ReplaceAll(strings.TrimSpace(path), "/", " / "))
	}
	if strings.TrimSpace(title) != "" {
		parts = append(parts, "标题："+strings.TrimSpace(title))
	}
	if strings.TrimSpace(summary) != "" {
		parts = append(parts, "摘要："+strings.TrimSpace(summary))
	}
	if strings.TrimSpace(content) != "" {
		parts = append(parts, "内容：\n"+strings.TrimSpace(content))
	}
	return strings.TrimSpace(strings.Join(parts, "\n"))
}

func documentSummaryFromNodes(ctx context.Context, docID uint64) string {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"doc_id": docID,
		"status": 1,
	}, map[string]any{
		"field":    "main.title, main.summary, main.plain_text, main.node_type, main.depth, main.sort",
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": 40,
	})
	parts := make([]string, 0, len(rows))
	for _, row := range rows {
		if row == nil || row.NodeType == agentmodel.KnowledgeNodeTypeDoc {
			continue
		}
		text := strings.TrimSpace(row.Summary)
		if text == "" {
			text = truncateText(strings.TrimSpace(row.PlainText), 180)
		}
		if text == "" {
			continue
		}
		title := strings.TrimSpace(row.Title)
		if title != "" {
			text = title + "： " + text
		}
		parts = append(parts, text)
	}
	return strings.Join(parts, "\n")
}

func (s Service) RebuildBase(ctx context.Context, baseID uint64) (IndexResult, error) {
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return IndexResult{}, fmt.Errorf("知识库不存在")
	}
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})
	markBaseDocsIndexRunning(ctx, baseID)
	clearKnowledgeBaseIndex(ctx, *base)
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	if len(docs) == 0 {
		s.refreshBaseStats(ctx, baseID, agentmodel.KnowledgeIndexStatusSuccess, "")
		now := time.Now()
		return IndexResult{BaseID: baseID, StartedAt: now, FinishedAt: now}, nil
	}
	total := IndexResult{BaseID: baseID, StartedAt: time.Now()}
	for _, doc := range docs {
		if doc == nil {
			continue
		}
		result, err := s.IndexDocument(ctx, doc.ID)
		total.NodeCount += result.NodeCount
		total.Indexed += result.Indexed
		total.Failed += result.Failed
		if err != nil && total.Error == "" {
			total.Error = err.Error()
		}
	}
	total.FinishedAt = time.Now()
	s.refreshDirectorySummaries(ctx, baseID, 0)
	s.refreshBaseStats(ctx, baseID, finalBaseIndexStatus(ctx, baseID, total.Error), total.Error)
	if total.Error != "" {
		return total, fmt.Errorf("%s", total.Error)
	}
	return total, nil
}

func markBaseDocsIndexRunning(ctx context.Context, baseID uint64) {
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"index_status":       agentmodel.KnowledgeIndexStatusRunning,
		"index_stage":        agentmodel.KnowledgeIndexStageParse,
		"index_stage_detail": "",
		"error_message":      "",
		"node_count":         0,
	})
}

func (s Service) markDocFailed(ctx context.Context, docID uint64, baseID uint64, err error) {
	message := ""
	if err != nil {
		message = err.Error()
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": docID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusFailed,
		"error_message": message,
	})
	s.refreshBaseStats(ctx, baseID, agentmodel.KnowledgeIndexStatusFailed, message)
}

func (s Service) refreshBaseStats(ctx context.Context, baseID uint64, status string, message string) {
	docCount := agentmodel.NewKnowledgeDocModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	nodeCount := agentmodel.NewKnowledgeNodeModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	if hasRunningKnowledgeDocs(ctx, baseID) {
		status = agentmodel.KnowledgeIndexStatusRunning
		message = ""
	} else if hasFailedKnowledgeDocs(ctx, baseID) {
		status = agentmodel.KnowledgeIndexStatusFailed
	}
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"doc_count":     docCount,
		"node_count":    nodeCount,
		"index_status":  normalizeIndexStatus(status),
		"error_message": strings.TrimSpace(message),
	})
}

func finalBaseIndexStatus(ctx context.Context, baseID uint64, message string) string {
	if strings.TrimSpace(message) != "" || hasFailedKnowledgeDocs(ctx, baseID) {
		return agentmodel.KnowledgeIndexStatusFailed
	}
	return agentmodel.KnowledgeIndexStatusSuccess
}

func hasRunningKnowledgeDocs(ctx context.Context, baseID uint64) bool {
	return agentmodel.NewKnowledgeDocModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
		"index_status":      agentmodel.KnowledgeIndexStatusRunning,
	}) > 0
}

func hasFailedKnowledgeDocs(ctx context.Context, baseID uint64) bool {
	return agentmodel.NewKnowledgeDocModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
		"index_status":      agentmodel.KnowledgeIndexStatusFailed,
	}) > 0
}

func (s Service) Retrieve(ctx context.Context, req RetrieveRequest) (RetrieveResult, error) {
	query := strings.TrimSpace(req.Query)
	if req.AgentID == 0 || query == "" {
		return RetrieveResult{}, nil
	}
	bindings := s.activeBindings(ctx, req.AgentID)
	if len(bindings) == 0 {
		return RetrieveResult{}, nil
	}
	result := RetrieveResult{}
	for _, binding := range bindings {
		bindingResult := s.retrieveAgenticBinding(ctx, binding, query)
		result.Snippets = append(result.Snippets, bindingResult.Snippets...)
		result.Matches = append(result.Matches, bindingResult.Matches...)
	}
	sort.SliceStable(result.Snippets, func(i, j int) bool {
		return result.Snippets[i].Score > result.Snippets[j].Score
	})
	result.Snippets = limitContext(result.Snippets, bindings)
	return result, nil
}

func (s Service) DebugRetrieve(ctx context.Context, req RetrieveDebugRequest) (RetrieveDebugResult, error) {
	query := strings.TrimSpace(req.Query)
	if query == "" {
		return RetrieveDebugResult{}, fmt.Errorf("检索问题不能为空")
	}
	binding, err := s.debugRetrieveBinding(ctx, req)
	if err != nil {
		return RetrieveDebugResult{}, err
	}
	result := s.retrieveAgenticBinding(ctx, binding, query)
	if req.Limit > 0 && len(result.Snippets) > req.Limit {
		result.Snippets = result.Snippets[:req.Limit]
	}
	return RetrieveDebugResult{
		Query: query,
		KnowledgeBase: KnowledgeRetrieveDebugBase{
			ID:            binding.BaseID,
			Name:          binding.Base.Name,
			VectorEnabled: binding.Base.VectorEnabled,
			GraphDepth:    binding.Base.GraphDepth,
		},
		Snippets:     result.Snippets,
		Matches:      result.Matches,
		SourceCounts: retrievalSourceCounts(result.Snippets),
		Plans:        retrievalPlanMatches(result.Matches),
	}, nil
}

func (s Service) debugRetrieveBinding(ctx context.Context, req RetrieveDebugRequest) (agentKnowledgeBinding, error) {
	if req.AgentID > 0 {
		for _, binding := range s.activeBindings(ctx, req.AgentID) {
			if req.BaseID == 0 || binding.BaseID == req.BaseID {
				return binding, nil
			}
		}
		return agentKnowledgeBinding{}, fmt.Errorf("智能体未绑定该知识库")
	}
	if req.BaseID == 0 {
		return agentKnowledgeBinding{}, fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": req.BaseID, "status": 1})
	if base == nil {
		return agentKnowledgeBinding{}, fmt.Errorf("知识库不存在")
	}
	return knowledgeBaseDebugBinding(*base), nil
}

func knowledgeBaseDebugBinding(base agentmodel.KnowledgeBase) agentKnowledgeBinding {
	return agentKnowledgeBinding{
		BaseID: base.ID,
		Base: knowledgeBaseConfig{
			ID:               base.ID,
			CateID:           base.CateID,
			Name:             strings.TrimSpace(base.Name),
			IndexPowerID:     base.IndexPowerID,
			Collection:       baseCollection(base),
			VectorEnabled:    isVectorEnabled(base.VectorEnabled),
			EmbeddingPowerID: base.EmbeddingPowerID,
			RetrieveLimit:    normalizeRetrieveLimit(base.RetrieveLimit),
			ScoreThreshold:   normalizeScoreThreshold(base.ScoreThreshold),
			MaxContextChars:  normalizeMaxContextChars(base.MaxContextChars),
			GraphDepth:       normalizeGraphDepth(base.GraphDepth),
			Status:           base.Status,
		},
	}
}

func retrievalPlanMatches(matches []map[string]any) []map[string]any {
	result := make([]map[string]any, 0, len(matches))
	for _, match := range matches {
		source := strings.TrimSpace(util.ToString(match["source"]))
		if source == "planner" || source == "graph" || source == "agentic_knowledge" {
			result = append(result, match)
		}
	}
	return result
}

func (s Service) retrieveAgenticBinding(ctx context.Context, binding agentKnowledgeBinding, query string) RetrieveResult {
	plannerPlan := s.planRetrieval(ctx, binding, query)
	graphPlan := graphRetrievalPlan(ctx, binding.BaseID, query, binding.Base.GraphDepth)
	plan := mergeRetrievalPlans(plannerPlan, graphPlan)
	dirs := retrievalCandidateDirs(ctx, binding, query, plan)
	dirIDs := candidateDirIDs(dirs)
	snippets := s.retrieveBroadBinding(ctx, binding, query)
	plannedSnippets := s.retrievePlannedBinding(ctx, binding, query, plan, dirIDs)
	docSnippets := retrievePlanDocNodes(ctx, binding, plan.DocIDs, query)
	snippets = append(snippets, plannedSnippets...)
	snippets = append(snippets, docSnippets...)
	snippets = rankKnowledgeSnippets(mergeKnowledgeSnippets(snippets), query, dirs)
	return RetrieveResult{
		Snippets: snippets,
		Matches:  retrievalMatches(binding, query, plan, plannerPlan, graphPlan, dirIDs, snippets),
	}
}

func (s Service) retrieveBroadBinding(ctx context.Context, binding agentKnowledgeBinding, query string) []RetrievedSnippet {
	snippets := s.retrieveKeywordBinding(ctx, binding, query)
	snippets = append(snippets, s.retrieveVectorBinding(ctx, binding, query)...)
	return snippets
}

func (s Service) retrievePlannedBinding(ctx context.Context, binding agentKnowledgeBinding, query string, plan retrievalPlan, dirIDs []uint64) []RetrievedSnippet {
	queries := plannedQueries(query, plan)
	if len(queries) == 0 {
		return nil
	}
	snippets := make([]RetrievedSnippet, 0)
	for _, plannedQuery := range queries {
		if len(dirIDs) > 0 {
			snippets = append(snippets, s.retrieveKeywordBinding(ctx, binding, plannedQuery, dirIDs...)...)
		} else if !strings.EqualFold(strings.TrimSpace(plannedQuery), strings.TrimSpace(query)) {
			snippets = append(snippets, s.retrieveKeywordBinding(ctx, binding, plannedQuery)...)
		}
		if !strings.EqualFold(strings.TrimSpace(plannedQuery), strings.TrimSpace(query)) {
			snippets = append(snippets, s.retrieveVectorBinding(ctx, binding, plannedQuery)...)
		}
	}
	return snippets
}

func retrievalCandidateDirs(ctx context.Context, binding agentKnowledgeBinding, query string, plan retrievalPlan) []candidateDir {
	return mergeCandidateDirs(
		expandedCandidateDirs(ctx, binding.BaseID, query, binding.Base.GraphDepth),
		candidateKnowledgeDirsByIDs(ctx, binding.BaseID, plan.DirIDs),
		candidateKnowledgeDirsByDocIDs(ctx, binding.BaseID, plan.DocIDs),
	)
}

func retrievePlanDocNodes(ctx context.Context, binding agentKnowledgeBinding, docIDs []uint64, query string) []RetrievedSnippet {
	docIDs = uniqueUint64s(docIDs, 30)
	if len(docIDs) == 0 {
		return nil
	}
	limit := binding.RetrieveLimit
	if limit <= 0 {
		limit = binding.Base.RetrieveLimit
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": binding.BaseID,
		"doc_id":            docIDs,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.dir_id, main.doc_id, main.title, main.content, main.plain_text, main.summary, main.path, main.sort, main.node_type",
		"order":    "main.doc_id asc, main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": keywordCandidateLimit(limit, true, query),
	})
	snippets := make([]RetrievedSnippet, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		content := strings.TrimSpace(firstNonEmpty(row.PlainText, row.Content, row.Summary))
		if content == "" {
			continue
		}
		snippets = append(snippets, RetrievedSnippet{
			BaseID:   binding.BaseID,
			BaseName: binding.Base.Name,
			Prompt:   binding.Prompt,
			DirID:    row.DirID,
			DirPath:  KnowledgeDirPath(ctx, row.DirID),
			DocID:    row.DocID,
			NodeID:   row.ID,
			Title:    strings.TrimSpace(firstNonEmpty(row.Path, row.Title)),
			Content:  content,
			Score:    keywordNodeScore(row, query) + 0.12,
			Source:   "planned_doc",
			SortRank: row.Sort,
		})
	}
	return snippets
}

func retrievalMatches(binding agentKnowledgeBinding, query string, plan retrievalPlan, plannerPlan retrievalPlan, graphPlan retrievalPlan, dirIDs []uint64, snippets []RetrievedSnippet) []map[string]any {
	matches := []map[string]any{{
		"source":            "agentic_knowledge",
		"knowledge_base_id": binding.BaseID,
		"knowledge_base":    binding.Base.Name,
		"query":             query,
		"planned_queries":   plannedQueries(query, plan),
		"dir_ids":           dirIDs,
		"doc_ids":           plan.DocIDs,
		"reason":            plan.Reason,
		"vector_enabled":    binding.Base.VectorEnabled,
		"retrieval_debug":   retrievalSourceCounts(snippets),
	}}
	matches = append(matches, retrievalPlanMatchWithSource(binding, "planner", plannerPlan)...)
	matches = append(matches, retrievalPlanMatchWithSource(binding, "graph", graphPlan)...)
	return matches
}

func retrievalSourceCounts(snippets []RetrievedSnippet) map[string]int {
	result := map[string]int{}
	for _, snippet := range snippets {
		source := strings.TrimSpace(snippet.Source)
		if source == "" {
			source = "unknown"
		}
		result[source]++
	}
	return result
}

func (s Service) AgentKnowledgeBases(ctx context.Context, agentID uint64) []AgentKnowledgeBaseRuntime {
	bindings := s.activeBindings(ctx, agentID)
	result := make([]AgentKnowledgeBaseRuntime, 0, len(bindings))
	for _, binding := range bindings {
		result = append(result, AgentKnowledgeBaseRuntime{
			ID:     binding.BaseID,
			Name:   binding.Base.Name,
			Prompt: binding.Prompt,
		})
	}
	return result
}

func (s Service) retrieveKeywordBinding(ctx context.Context, binding agentKnowledgeBinding, query string, dirIDs ...uint64) []RetrievedSnippet {
	limit := binding.RetrieveLimit
	if limit <= 0 {
		limit = binding.Base.RetrieveLimit
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, keywordNodeFilters(binding.BaseID, query, dirIDs...), map[string]any{
		"field":    "main.id, main.dir_id, main.doc_id, main.title, main.content, main.plain_text, main.search_text, main.keywords, main.path, main.sort, main.node_type",
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": keywordCandidateLimit(limit, len(dirIDs) > 0, query),
	})
	snippets := make([]RetrievedSnippet, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		content := strings.TrimSpace(firstNonEmpty(row.PlainText, row.Content, row.Summary))
		if content == "" {
			continue
		}
		snippets = append(snippets, RetrievedSnippet{
			BaseID:   binding.BaseID,
			BaseName: binding.Base.Name,
			Prompt:   binding.Prompt,
			DirID:    row.DirID,
			DirPath:  KnowledgeDirPath(ctx, row.DirID),
			DocID:    row.DocID,
			NodeID:   row.ID,
			Title:    strings.TrimSpace(firstNonEmpty(row.Path, row.Title)),
			Content:  content,
			Score:    keywordNodeScore(row, query),
			Source:   "node",
			SortRank: row.Sort,
		})
	}
	return rankKnowledgeSnippets(mergeKnowledgeSnippets(snippets), query, nil)
}

func (s Service) activeBindings(ctx context.Context, agentID uint64) []agentKnowledgeBinding {
	rows := agentmodel.NewAgentKnowledgeBaseModel().Select(ctx, map[string]any{
		"agent_id": agentID,
		"status":   1,
	})
	result := make([]agentKnowledgeBinding, 0, len(rows))
	for _, row := range rows {
		if row == nil || row.KnowledgeBaseID == 0 {
			continue
		}
		base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{
			"id":     row.KnowledgeBaseID,
			"status": 1,
		})
		if base == nil {
			continue
		}
		result = append(result, agentKnowledgeBinding{
			ID:             row.ID,
			AgentID:        row.AgentID,
			BaseID:         row.KnowledgeBaseID,
			Prompt:         row.Prompt,
			RetrieveLimit:  row.RetrieveLimit,
			ScoreThreshold: row.ScoreThreshold,
			Sort:           row.Sort,
			Base: knowledgeBaseConfig{
				ID:               base.ID,
				CateID:           base.CateID,
				Name:             base.Name,
				IndexPowerID:     base.IndexPowerID,
				Collection:       baseCollection(*base),
				VectorEnabled:    isVectorEnabled(base.VectorEnabled),
				EmbeddingPowerID: base.EmbeddingPowerID,
				RetrieveLimit:    normalizeRetrieveLimit(base.RetrieveLimit),
				ScoreThreshold:   normalizeScoreThreshold(base.ScoreThreshold),
				MaxContextChars:  normalizeMaxContextChars(base.MaxContextChars),
				GraphDepth:       normalizeGraphDepth(base.GraphDepth),
				Status:           base.Status,
			},
		})
	}
	sort.SliceStable(result, func(i, j int) bool {
		return result[i].Sort < result[j].Sort
	})
	return result
}

func limitContext(snippets []RetrievedSnippet, bindings []agentKnowledgeBinding) []RetrievedSnippet {
	if len(snippets) == 0 {
		return snippets
	}
	limit := defaultMaxContextChars
	for _, binding := range bindings {
		if binding.Base.MaxContextChars > limit {
			limit = binding.Base.MaxContextChars
		}
	}
	total := 0
	result := make([]RetrievedSnippet, 0, len(snippets))
	for _, snippet := range snippets {
		length := textLength(snippet.Content)
		if total+length > limit {
			remaining := limit - total
			if remaining <= 0 {
				break
			}
			snippet.Content = truncateText(snippet.Content, remaining)
			length = textLength(snippet.Content)
		}
		result = append(result, snippet)
		total += length
	}
	return result
}
