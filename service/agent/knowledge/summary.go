package knowledge

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	maxConcurrentDirectorySummaries = 3
	maxPendingDirectorySummaries    = 2048
	directorySummaryTimeout         = 5 * time.Minute
)

type directorySummaryTask struct {
	baseID uint64
	dirID  uint64
}

type directorySummaryTaskState struct {
	queued  bool
	running bool
	dirty   bool
}

type directorySummaryQueue struct {
	once   sync.Once
	mutex  sync.Mutex
	states map[directorySummaryTask]*directorySummaryTaskState
	order  []directorySummaryTask
	wake   chan struct{}
}

var pendingDirectorySummaries directorySummaryQueue

func (s Service) refreshDirectorySummaries(ctx context.Context, baseID uint64, dirID uint64) {
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return
	}
	dirIDs := []uint64{dirID}
	if dirID > 0 {
		dirIDs = ancestorDirIDs(ctx, baseID, dirID)
	} else {
		dirIDs = allDirectoryIDs(ctx, baseID)
	}
	for _, currentDirID := range dirIDs {
		refreshDirectorySummary(ctx, base, currentDirID)
	}
}

func allDirectoryIDs(ctx context.Context, baseID uint64) []uint64 {
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field": "main.id",
		"order": "main.depth desc, main.id desc",
	})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			ids = append(ids, row.ID)
		}
	}
	return ids
}

func refreshDirectorySummary(ctx context.Context, base *agentmodel.KnowledgeBase, dirID uint64) {
	if dirID == 0 {
		return
	}
	childDirs, docs := loadDirectorySummaryMaterial(ctx, base, dirID)
	parts := make([]string, 0, len(childDirs)+len(docs)+1)
	keywords := make([]string, 0)
	for _, dir := range childDirs {
		if dir == nil {
			continue
		}
		if summary := strings.TrimSpace(dir.Summary); summary != "" {
			parts = append(parts, strings.TrimSpace(dir.Name)+"： "+summary)
		}
		keywords = append(keywords, splitSummaryKeywords(dir.Keywords)...)
	}
	for _, doc := range docs {
		if doc == nil {
			continue
		}
		if summary := strings.TrimSpace(doc.Summary); summary != "" {
			parts = append(parts, strings.TrimSpace(doc.Title)+"： "+summary)
		}
		keywords = append(keywords, splitSummaryKeywords(doc.Keywords)...)
	}
	summary := truncateText(strings.Join(parts, "\n"), 3000)
	keywordText := strings.Join(uniqueSummaryKeywords(keywords, 60), ", ")
	agentmodel.NewKnowledgeDirModel().Update(ctx, map[string]any{"id": dirID}, map[string]any{
		"summary":  summary,
		"keywords": keywordText,
	})
	if base.IndexPowerID <= 0 || len(docs) < 3 {
		return
	}
	pendingDirectorySummaries.enqueue(directorySummaryTask{baseID: base.ID, dirID: dirID})
}

func (q *directorySummaryQueue) enqueue(task directorySummaryTask) {
	if task.baseID == 0 || task.dirID == 0 {
		return
	}
	q.start()
	q.mutex.Lock()
	if state := q.states[task]; state != nil {
		if state.running {
			state.dirty = true
		}
		q.mutex.Unlock()
		return
	}
	if len(q.states) >= maxPendingDirectorySummaries {
		q.mutex.Unlock()
		dlog.ErrorFields("knowledge_directory_summary_queue_full", "知识库目录摘要队列已满", dlog.Fields{
			"knowledge_base_id": task.baseID,
			"dir_id":            task.dirID,
			"capacity":          maxPendingDirectorySummaries,
		})
		return
	}
	q.states[task] = &directorySummaryTaskState{queued: true}
	q.order = append(q.order, task)
	q.mutex.Unlock()
	q.notify()
}

func (q *directorySummaryQueue) start() {
	q.once.Do(func() {
		q.states = make(map[directorySummaryTask]*directorySummaryTaskState)
		q.wake = make(chan struct{}, 1)
		for range maxConcurrentDirectorySummaries {
			go q.run()
		}
	})
}

func (q *directorySummaryQueue) notify() {
	select {
	case q.wake <- struct{}{}:
	default:
	}
}

func (q *directorySummaryQueue) next() (directorySummaryTask, bool) {
	q.mutex.Lock()
	defer q.mutex.Unlock()
	for len(q.order) > 0 {
		task := q.order[0]
		q.order[0] = directorySummaryTask{}
		q.order = q.order[1:]
		state := q.states[task]
		if state == nil || !state.queued {
			continue
		}
		state.queued = false
		state.running = true
		return task, true
	}
	return directorySummaryTask{}, false
}

func (q *directorySummaryQueue) complete(task directorySummaryTask) {
	q.mutex.Lock()
	state := q.states[task]
	if state == nil {
		q.mutex.Unlock()
		return
	}
	state.running = false
	if state.dirty {
		state.dirty = false
		state.queued = true
		q.order = append(q.order, task)
		q.mutex.Unlock()
		q.notify()
		return
	}
	delete(q.states, task)
	q.mutex.Unlock()
}

func (q *directorySummaryQueue) run() {
	for {
		task, ok := q.next()
		if !ok {
			<-q.wake
			continue
		}
		q.notify()
		func() {
			defer q.complete(task)
			runQueuedDirectorySummary(task)
		}()
	}
}

func runQueuedDirectorySummary(task directorySummaryTask) {
	defer func() {
		if recovered := recover(); recovered != nil {
			dlog.ErrorFields("knowledge_directory_summary_failed", "知识库目录摘要任务失败", dlog.Fields{
				"knowledge_base_id": task.baseID,
				"dir_id":            task.dirID,
				"error":             fmt.Sprintf("%v", recovered),
			})
		}
	}()
	ctx, cancel := context.WithTimeout(context.Background(), directorySummaryTimeout)
	defer cancel()
	generateQueuedDirectorySummary(ctx, task)
	if ctx.Err() != nil {
		dlog.ErrorFields("knowledge_directory_summary_timeout", "知识库目录摘要任务超时", dlog.Fields{
			"knowledge_base_id": task.baseID,
			"dir_id":            task.dirID,
			"error":             ctx.Err().Error(),
		})
	}
}

func generateQueuedDirectorySummary(ctx context.Context, task directorySummaryTask) {
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{
		"id":     task.baseID,
		"status": 1,
	})
	if base == nil || base.IndexPowerID <= 0 {
		return
	}
	dir := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{
		"id":                task.dirID,
		"knowledge_base_id": task.baseID,
		"status":            1,
	})
	if dir == nil {
		return
	}
	childDirs, docs := loadDirectorySummaryMaterial(ctx, base, task.dirID)
	if len(docs) < 3 {
		return
	}
	generateLLMDirectorySummary(ctx, base, task.dirID, childDirs, docs, strings.TrimSpace(dir.Summary), strings.TrimSpace(dir.Keywords))
}

func loadDirectorySummaryMaterial(ctx context.Context, base *agentmodel.KnowledgeBase, dirID uint64) ([]*agentmodel.KnowledgeDir, []*agentmodel.KnowledgeDoc) {
	if base == nil || base.ID == 0 || dirID == 0 {
		return nil, nil
	}
	childDirs := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": base.ID,
		"parent_id":         dirID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.name, main.summary, main.keywords",
		"order": "main.sort asc, main.id asc",
	})
	return childDirs, representativeDirectorySummaryDocs(ctx, base, dirID, 40)
}

func representativeDirectorySummaryDocs(ctx context.Context, base *agentmodel.KnowledgeBase, dirID uint64, limit int) []*agentmodel.KnowledgeDoc {
	if base == nil || base.ID == 0 || dirID == 0 || limit <= 0 {
		return nil
	}
	filters := map[string]any{
		"knowledge_base_id": base.ID,
		"dir_id":            dirID,
		"status":            1,
		"index_status": []any{
			agentmodel.KnowledgeIndexStatusSuccess,
			agentmodel.KnowledgeIndexStatusRunning,
		},
	}
	if base.ReviewRequired {
		filters["review_status"] = agentmodel.KnowledgeReviewStatusApproved
	}
	total := countInt(agentmodel.NewKnowledgeDocModel().Count(ctx, filters))
	if total == 0 {
		return nil
	}
	windowSize := limit
	windows := []struct {
		order string
		page  int
	}{
		{order: "main.id desc", page: 1},
	}
	if total > windowSize*2 {
		middlePage := (total/windowSize + 1) / 2
		if middlePage < 2 {
			middlePage = 2
		}
		windows = append(windows, struct {
			order string
			page  int
		}{order: "main.id asc", page: middlePage})
	}
	windows = append(windows, struct {
		order string
		page  int
	}{order: "main.id asc", page: 1})

	now := time.Now()
	groups := make([][]*agentmodel.KnowledgeDoc, 0, len(windows))
	for _, window := range windows {
		rows := agentmodel.NewKnowledgeDocModel().Select(ctx, filters, map[string]any{
			"field":    "main.id, main.title, main.summary, main.keywords, main.node_count, main.status, main.index_status, main.expires_at, main.review_status",
			"order":    window.order,
			"page":     window.page,
			"pageSize": windowSize,
		})
		available := make([]*agentmodel.KnowledgeDoc, 0, len(rows))
		for _, row := range rows {
			if knowledgeDocAvailableAt(row, base.ReviewRequired, now) {
				available = append(available, row)
			}
		}
		groups = append(groups, available)
	}
	return interleaveDirectorySummaryDocs(groups, limit)
}

func interleaveDirectorySummaryDocs(groups [][]*agentmodel.KnowledgeDoc, limit int) []*agentmodel.KnowledgeDoc {
	if len(groups) == 0 || limit <= 0 {
		return nil
	}
	seen := make(map[uint64]struct{}, limit)
	result := make([]*agentmodel.KnowledgeDoc, 0, limit)
	indices := make([]int, len(groups))
	appendRow := func(row *agentmodel.KnowledgeDoc) {
		if row == nil || len(result) >= limit {
			return
		}
		if _, exists := seen[row.ID]; exists {
			return
		}
		seen[row.ID] = struct{}{}
		result = append(result, row)
	}
	latestCount := 6
	if latestCount > len(groups[0]) {
		latestCount = len(groups[0])
	}
	for indices[0] < latestCount {
		appendRow(groups[0][indices[0]])
		indices[0]++
	}
	for len(result) < limit {
		advanced := false
		for groupIndex, group := range groups {
			if indices[groupIndex] >= len(group) {
				continue
			}
			appendRow(group[indices[groupIndex]])
			indices[groupIndex]++
			advanced = true
			if len(result) >= limit {
				break
			}
		}
		if !advanced {
			break
		}
	}
	return result
}

func (s Service) refreshDocumentDirectorySummaries(ctx context.Context, docIDs []uint64) {
	docIDs = uniqueUint64s(docIDs, 0)
	if len(docIDs) == 0 {
		return
	}
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{"id": docIDs}, map[string]any{
		"field":    "main.id, main.knowledge_base_id, main.dir_id",
		"page":     1,
		"pageSize": len(docIDs),
	})
	dirsByBase := make(map[uint64][]uint64)
	for _, doc := range docs {
		if doc != nil && doc.KnowledgeBaseID > 0 && doc.DirID > 0 {
			dirsByBase[doc.KnowledgeBaseID] = append(dirsByBase[doc.KnowledgeBaseID], doc.DirID)
		}
	}
	for baseID, changedDirIDs := range dirsByBase {
		base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
		if base == nil {
			continue
		}
		dirs := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
			"knowledge_base_id": baseID,
			"status":            1,
		}, map[string]any{
			"field": "main.id, main.parent_id, main.depth",
		})
		dirByID := make(map[uint64]*agentmodel.KnowledgeDir, len(dirs))
		for _, dir := range dirs {
			if dir != nil {
				dirByID[dir.ID] = dir
			}
		}
		refreshIDs := make(map[uint64]struct{})
		for _, dirID := range uniqueUint64s(changedDirIDs, 0) {
			for dir := dirByID[dirID]; dir != nil; dir = dirByID[dir.ParentID] {
				if _, exists := refreshIDs[dir.ID]; exists {
					break
				}
				refreshIDs[dir.ID] = struct{}{}
			}
		}
		ordered := make([]*agentmodel.KnowledgeDir, 0, len(refreshIDs))
		for dirID := range refreshIDs {
			if dir := dirByID[dirID]; dir != nil {
				ordered = append(ordered, dir)
			}
		}
		sort.SliceStable(ordered, func(i, j int) bool {
			if ordered[i].Depth == ordered[j].Depth {
				return ordered[i].ID > ordered[j].ID
			}
			return ordered[i].Depth > ordered[j].Depth
		})
		for _, dir := range ordered {
			refreshDirectorySummary(ctx, base, dir.ID)
		}
	}
}

func generateLLMDirectorySummary(ctx context.Context, base *agentmodel.KnowledgeBase, dirID uint64, childDirs []*agentmodel.KnowledgeDir, docs []*agentmodel.KnowledgeDoc, expectedSummary string, expectedKeywords string) {
	powerKey, err := knowledgeIndexPowerKey(ctx, base.IndexPowerID)
	if err != nil {
		return
	}
	dir := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{
		"id":                dirID,
		"knowledge_base_id": base.ID,
		"status":            1,
	})
	if dir == nil {
		return
	}
	source := buildDirectorySummarySource(dir, childDirs, docs)
	if strings.TrimSpace(source) == "" {
		return
	}
	prompt := strings.Join([]string{
		"你是企业知识库的目录摘要生成器。",
		"基于该目录下的子目录和文档信息，生成一段简洁的目录摘要（200字以内）。",
		"要求：概括该目录的核心内容和用途，语言简洁，便于检索时快速判断是否相关。",
		"只基于输入内容生成，不要编造。",
	}, "\n")
	srv := NewService()
	resp := srv.gateway().Request(ctx, energonservice.GatewayRequest{
		Body: map[string]any{
			"mode":  "normalize",
			"power": powerKey,
			"set": map[string]any{
				"role": prompt,
			},
			"input": energonservice.PromptInput(source),
			"options": map[string]any{
				"temperature": 0.1,
				"stream":      false,
			},
		},
	})
	payload := resp.Payload()
	if util.ToIntDefault(payload["status"], 0) == 2 {
		return
	}
	llmSummary := strings.TrimSpace(gatewayOutputText(payload))
	if llmSummary == "" {
		return
	}
	agentmodel.NewKnowledgeDirModel().Update(ctx, map[string]any{
		"id":                dirID,
		"knowledge_base_id": base.ID,
		"summary":           expectedSummary,
		"keywords":          expectedKeywords,
		"status":            1,
	}, map[string]any{
		"summary": truncateText(llmSummary, 2000),
	})
}

func buildDirectorySummarySource(dir *agentmodel.KnowledgeDir, childDirs []*agentmodel.KnowledgeDir, docs []*agentmodel.KnowledgeDoc) string {
	lines := []string{"目录：" + strings.TrimSpace(dir.Name)}
	if len(childDirs) > 0 {
		dirLines := make([]string, 0, len(childDirs))
		for _, d := range childDirs {
			if d == nil || strings.TrimSpace(d.Name) == "" {
				continue
			}
			line := strings.TrimSpace(d.Name)
			if strings.TrimSpace(d.Summary) != "" {
				line += "： " + strings.TrimSpace(d.Summary)
			}
			dirLines = append(dirLines, line)
		}
		if len(dirLines) > 0 {
			lines = append(lines, "子目录：\n"+strings.Join(dirLines, "\n"))
		}
	}
	if len(docs) > 0 {
		docLines := make([]string, 0, len(docs))
		for _, doc := range docs {
			if doc == nil || strings.TrimSpace(doc.Title) == "" {
				continue
			}
			line := strings.TrimSpace(doc.Title)
			if strings.TrimSpace(doc.Summary) != "" {
				line += "： " + strings.TrimSpace(doc.Summary)
			}
			docLines = append(docLines, line)
		}
		if len(docLines) > 0 {
			lines = append(lines, "文档：\n"+strings.Join(docLines, "\n"))
		}
	}
	return strings.Join(lines, "\n\n")
}

func (s Service) gateway() energonservice.GatewayService {
	return energonservice.NewGatewayService()
}

func knowledgeIndexPowerKey(ctx context.Context, powerID uint64) (string, error) {
	if powerID == 0 {
		powerID = agentmodel.DefaultKnowledgeIndexPowerID
	}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": powerID})
	if power == nil || power.Status != 1 {
		return "", fmt.Errorf("索引模型不可用")
	}
	key := strings.TrimSpace(power.Key)
	if key == "" {
		return "", fmt.Errorf("索引模型标识为空")
	}
	return key, nil
}

func gatewayOutputText(payload map[string]any) string {
	output := mapFromAny(payload["output"])
	if text := strings.TrimSpace(frontstream.InputText(output["text"])); text != "" {
		return text
	}
	if text := outputJSONText(output["json"]); text != "" {
		return text
	}
	return strings.TrimSpace(frontstream.InputText(payload["data"]))
}

func outputJSONText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(current)
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return ""
		}
		return strings.TrimSpace(string(raw))
	}
}

func mapFromAny(value any) map[string]any {
	switch current := value.(type) {
	case nil:
		return map[string]any{}
	case map[string]any:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return map[string]any{}
		}
		result := map[string]any{}
		if err := json.Unmarshal(raw, &result); err != nil {
			return map[string]any{}
		}
		return result
	}
}

func trimJSONFence(value string) string {
	value = strings.TrimSpace(value)
	value = strings.TrimPrefix(value, "```json")
	value = strings.TrimPrefix(value, "```")
	value = strings.TrimSuffix(value, "```")
	return strings.TrimSpace(value)
}

func splitSummaryKeywords(value string) []string {
	return strings.FieldsFunc(value, func(r rune) bool {
		return strings.ContainsRune(",，;；、\n\t ", r)
	})
}

func uniqueSummaryKeywords(values []string, limit int) []string {
	seen := map[string]struct{}{}
	result := make([]string, 0, len(values))
	for _, value := range values {
		item := strings.TrimSpace(util.ToString(value))
		if item == "" {
			continue
		}
		if _, exists := seen[item]; exists {
			continue
		}
		seen[item] = struct{}{}
		result = append(result, item)
		if limit > 0 && len(result) >= limit {
			break
		}
	}
	return result
}
