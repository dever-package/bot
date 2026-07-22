package runtimecontext

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"sync"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	runtimesessionstate "github.com/dever-package/bot/service/agent/runtime/sessionstate"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	summaryKeepRecentGroups   = 10
	summaryBatchLimit         = 200
	maxSummaryLength          = 8000
	summaryMessageMaxRunes    = 800
	summaryStructuredRunes    = 1200
	summaryTriggerPercent     = 70
	summaryTargetPercent      = 50
	summaryMinimumInputTokens = 1024
)

type summaryBudget struct {
	triggerTokens int
	targetTokens  int
	sourceTokens  int
	outputTokens  int
}

type Compactor struct {
	gateway energonservice.GatewayService
}

type compactionLockEntry struct {
	mutex      sync.Mutex
	references int
}

var sessionCompactionLocks = struct {
	sync.Mutex
	entries map[uint64]*compactionLockEntry
}{entries: make(map[uint64]*compactionLockEntry)}

func NewCompactor(gateway energonservice.GatewayService) Compactor {
	return Compactor{gateway: gateway}
}

func (c Compactor) Compact(
	ctx context.Context,
	sessionID uint64,
	powerKey string,
	agentOutputTokens int,
) bool {
	budget, err := c.resolveSummaryBudget(ctx, powerKey, agentOutputTokens)
	if err != nil || !needsCompaction(ctx, sessionID, budget.triggerTokens) {
		return false
	}

	release := acquireCompactionLock(sessionID)
	defer release()

	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return false
	}
	rows := unsummarizedMessages(ctx, *session)
	batchFull := len(rows) >= summaryBatchLimit
	if !batchFull && !messagesNeedCompaction(rows, budget.triggerTokens) {
		return false
	}
	rows = summaryRowsToCompact(rows, session.ContextSummary, budget, batchFull)
	if len(rows) == 0 {
		return false
	}
	source := summarySource(session.ContextSummary, rows)
	if source == "" {
		return false
	}
	response := c.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power": powerKey,
			"set":   map[string]any{"role": summaryRole()},
			"input": energonservice.PromptInput(source),
			"options": map[string]any{
				"stream": false, "temperature": 0, "max_tokens": budget.outputTokens,
			},
		},
	})
	summary := ""
	if response.Status != botprotocol.ResponseStatusFail {
		summary = normalizeSummary(botprotocol.AsText(botprotocol.ExtractOutput(response.Payload())["text"]))
	}
	if summary == "" {
		summary = fallbackSummary(session.ContextSummary, rows)
		if summary == "" {
			return false
		}
	}
	lastMessageID := rows[len(rows)-1].ID
	if agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"id": lastMessageID, "session_id": session.ID,
	}) == nil {
		return false
	}
	updated := agentmodel.NewSessionModel().Update(ctx, map[string]any{
		"id":                 session.ID,
		"summary_message_id": session.SummaryMessageID,
		"status":             agentmodel.SessionStatusActive,
	}, map[string]any{
		"context_summary":    summary,
		"summary_message_id": lastMessageID,
	})
	return updated > 0
}

func (c Compactor) resolveSummaryBudget(
	ctx context.Context,
	powerKey string,
	agentOutputTokens int,
) (summaryBudget, error) {
	if strings.TrimSpace(powerKey) == "" {
		return summaryBudget{}, fmt.Errorf("摘要文本能力不能为空")
	}
	limits, err := c.gateway.ResolveModelLimits(ctx, powerKey)
	if err != nil {
		return summaryBudget{}, err
	}
	config := runtimeconfig.Load(ctx)
	runtimeOutputTokens := agentOutputTokens
	if runtimeOutputTokens <= 0 {
		runtimeOutputTokens = energonservice.DefaultModelMaxOutputTokens
	}
	if runtimeOutputTokens > limits.MaxOutputTokens {
		runtimeOutputTokens = limits.MaxOutputTokens
	}
	runtimeBudget, err := ResolveTokenBudget(
		limits.ContextWindowTokens,
		config.WorkingContextTokens,
		runtimeOutputTokens,
		summaryMinimumInputTokens,
	)
	if err != nil {
		return summaryBudget{}, err
	}
	summaryOutputTokens := minSummaryOutputTokens(limits.MaxOutputTokens)
	summaryCallBudget, err := ResolveTokenBudget(
		limits.ContextWindowTokens,
		config.WorkingContextTokens,
		summaryOutputTokens,
		summaryMinimumInputTokens,
	)
	if err != nil {
		return summaryBudget{}, err
	}
	return summaryBudget{
		triggerTokens: runtimeBudget.MaxInputTokens * summaryTriggerPercent / 100,
		targetTokens:  runtimeBudget.MaxInputTokens * summaryTargetPercent / 100,
		sourceTokens:  summaryCallBudget.MaxInputTokens * summaryTargetPercent / 100,
		outputTokens:  summaryOutputTokens,
	}, nil
}

func minSummaryOutputTokens(maximum int) int {
	if maximum > 0 && maximum < 2000 {
		return maximum
	}
	return 2000
}

func needsCompaction(ctx context.Context, sessionID uint64, thresholdTokens int) bool {
	if sessionID == 0 || thresholdTokens <= 0 {
		return false
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return false
	}
	filter := map[string]any{
		"session_id": session.ID,
		"status":     agentmodel.MessageStatusNormal,
	}
	if session.SummaryMessageID > 0 {
		filter["id"] = map[string]any{"gt": session.SummaryMessageID}
	}
	rows := agentmodel.NewMessageModel().Select(ctx, filter, map[string]any{
		"order": "main.id asc",
		"limit": summaryBatchLimit,
	})
	return len(rows) >= summaryBatchLimit || messagesNeedCompaction(rows, thresholdTokens)
}

func messagesNeedCompaction(rows []*agentmodel.Message, thresholdTokens int) bool {
	if thresholdTokens <= 0 {
		return false
	}
	totalTokens := 0
	for _, row := range rows {
		if row == nil {
			continue
		}
		totalTokens += summaryMessageTokens(row)
		if totalTokens > thresholdTokens {
			return true
		}
	}
	return false
}

func summaryRowsToCompact(
	rows []*agentmodel.Message,
	previous string,
	budget summaryBudget,
	batchFull bool,
) []*agentmodel.Message {
	groups := summaryMessageGroups(rows)
	if len(groups) <= summaryKeepRecentGroups {
		return nil
	}
	retainedTokens := 0
	retainedStart := len(groups)
	for index := len(groups) - 1; index >= 0; index-- {
		groupTokens := summaryGroupTokens(groups[index])
		retainedGroups := len(groups) - retainedStart
		if retainedGroups >= summaryKeepRecentGroups && retainedTokens+groupTokens > budget.targetTokens {
			break
		}
		retainedTokens += groupTokens
		retainedStart = index
	}
	if retainedStart <= 0 {
		if !batchFull {
			return nil
		}
		retainedStart = len(groups) - summaryKeepRecentGroups
	}
	selectedGroups := append([][]*agentmodel.Message(nil), groups[:retainedStart]...)
	selected := flattenSummaryGroups(selectedGroups)
	for len(selectedGroups) > 1 && EstimateTokens(summarySource(previous, selected)) > budget.sourceTokens {
		selectedGroups = selectedGroups[:len(selectedGroups)-1]
		selected = flattenSummaryGroups(selectedGroups)
	}
	return selected
}

func summaryMessageGroups(rows []*agentmodel.Message) [][]*agentmodel.Message {
	groups := make([][]*agentmodel.Message, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		requestID := strings.TrimSpace(row.RequestID)
		if requestID != "" && len(groups) > 0 {
			last := groups[len(groups)-1]
			if len(last) > 0 && strings.TrimSpace(last[0].RequestID) == requestID {
				groups[len(groups)-1] = append(last, row)
				continue
			}
		}
		groups = append(groups, []*agentmodel.Message{row})
	}
	return groups
}

func summaryGroupTokens(group []*agentmodel.Message) int {
	total := 0
	for _, row := range group {
		total += summaryMessageTokens(row)
	}
	return total
}

func summaryMessageTokens(row *agentmodel.Message) int {
	if row == nil {
		return 0
	}
	return EstimateTokens(map[string]any{
		"role": row.Role, "kind": row.Kind, "text": row.Text,
		"content": row.Content, "output": row.Output,
	})
}

func flattenSummaryGroups(groups [][]*agentmodel.Message) []*agentmodel.Message {
	result := make([]*agentmodel.Message, 0)
	for _, group := range groups {
		result = append(result, group...)
	}
	return result
}

func acquireCompactionLock(sessionID uint64) func() {
	sessionCompactionLocks.Lock()
	entry := sessionCompactionLocks.entries[sessionID]
	if entry == nil {
		entry = &compactionLockEntry{}
		sessionCompactionLocks.entries[sessionID] = entry
	}
	entry.references++
	sessionCompactionLocks.Unlock()

	entry.mutex.Lock()
	return func() {
		entry.mutex.Unlock()
		sessionCompactionLocks.Lock()
		entry.references--
		if entry.references == 0 {
			delete(sessionCompactionLocks.entries, sessionID)
		}
		sessionCompactionLocks.Unlock()
	}
}

func unsummarizedMessages(ctx context.Context, session agentmodel.Session) []*agentmodel.Message {
	filter := map[string]any{
		"session_id": session.ID,
		"status":     agentmodel.MessageStatusNormal,
	}
	if session.SummaryMessageID > 0 {
		filter["id"] = map[string]any{"gt": session.SummaryMessageID}
	}
	return agentmodel.NewMessageModel().Select(ctx, filter, map[string]any{
		"order": "main.id asc",
		"limit": summaryBatchLimit,
	})
}

func summarySource(previous string, rows []*agentmodel.Message) string {
	parts := make([]string, 0, len(rows)+2)
	if previous = strings.TrimSpace(previous); previous != "" {
		parts = append(parts, "已有摘要:\n"+limitRunes(previous, maxSummaryLength))
	}
	messages := make([]string, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if message := summaryMessageJSON(row); message != "" {
			messages = append(messages, message)
		}
	}
	if len(messages) > 0 {
		parts = append(parts, "需要合并的对话:\n"+strings.Join(messages, "\n"))
	}
	return strings.Join(parts, "\n\n")
}

func summaryMessageJSON(row *agentmodel.Message) string {
	message := map[string]any{
		"id": row.ID, "role": strings.TrimSpace(row.Role), "kind": strings.TrimSpace(row.Kind),
	}
	if text := compactMessageText(runtimemessageoutput.NormalizeText(row.Text)); text != "" {
		message["text"] = text
	}
	if content := compactSummaryPayload(row.Content, []string{
		"kind", "data", "interaction", "interaction_response", "interaction_answered", "interaction_data",
	}); content != "" {
		message["content"] = content
	}
	if output := compactSummaryPayload(row.Output, []string{
		"event", "interaction", "document", "artifacts", "images", "videos", "audios", "files",
		"completion_mode", "knowledge_used", "error",
	}); output != "" {
		message["output"] = output
	}
	if len(message) <= 3 {
		return ""
	}
	encoded, err := json.Marshal(message)
	if err != nil {
		return ""
	}
	return string(encoded)
}

func compactSummaryPayload(value string, keys []string) string {
	var source map[string]any
	if err := json.Unmarshal([]byte(strings.TrimSpace(value)), &source); err != nil || len(source) == 0 {
		return ""
	}
	selected := make(map[string]any, len(keys))
	for _, key := range keys {
		if current, exists := source[key]; exists && current != nil {
			selected[key] = current
		}
	}
	if len(selected) == 0 {
		return ""
	}
	return encodeCompactSummaryPayload(selected)
}

func encodeCompactSummaryPayload(value map[string]any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	if runeCount(string(encoded)) <= summaryStructuredRunes {
		return string(encoded)
	}
	for key, current := range value {
		if text, ok := current.(string); ok {
			value[key] = limitRunes(text, 240)
		}
	}
	encoded, err = json.Marshal(value)
	if err != nil || runeCount(string(encoded)) > summaryStructuredRunes {
		return ""
	}
	return string(encoded)
}

func fallbackSummary(previous string, rows []*agentmodel.Message) string {
	summary, ok := runtimesessionstate.Decode(previous)
	if !ok {
		summary = runtimesessionstate.Summary{Version: runtimesessionstate.Version}
		if previous = strings.TrimSpace(previous); previous != "" {
			summary.Confirmed = append(summary.Confirmed, limitRunes(previous, 400))
		}
	}
	for _, row := range rows {
		if row == nil {
			continue
		}
		text := compactMessageText(runtimemessageoutput.NormalizeText(row.Text))
		switch strings.ToLower(strings.TrimSpace(row.Role)) {
		case "user":
			if summary.Goal == "" && text != "" {
				summary.Goal = text
			}
			if text != "" {
				summary.Confirmed = append(summary.Confirmed, text)
			}
			if summary.Interaction.Status == "waiting" {
				summary.Interaction.Status = "answered"
			}
		case "assistant":
			if text != "" {
				summary.Completed = append(summary.Completed, text)
			}
		}
		mergeFallbackSummaryPayload(&summary, row.Content)
		mergeFallbackSummaryPayload(&summary, row.Output)
	}
	return runtimesessionstate.Encode(summary)
}

func mergeFallbackSummaryPayload(summary *runtimesessionstate.Summary, raw string) {
	if summary == nil {
		return
	}
	var payload map[string]any
	if err := json.Unmarshal([]byte(strings.TrimSpace(raw)), &payload); err != nil {
		return
	}
	if interaction, ok := payload["interaction"].(map[string]any); ok && len(interaction) > 0 {
		summary.Interaction.Status = "waiting"
		for _, key := range []string{"question", "prompt", "text", "title"} {
			if value := strings.TrimSpace(fmt.Sprint(interaction[key])); value != "" && value != "<nil>" {
				summary.Interaction.Question = value
				break
			}
		}
	}
	if answered, _ := payload["interaction_answered"].(bool); answered {
		summary.Interaction.Status = "answered"
	}
	mergeInteractionResponse(summary, payload["interaction_response"])
	appendFallbackArtifacts(summary, payload["document"])
	appendFallbackArtifacts(summary, payload["artifacts"])
}

func mergeInteractionResponse(summary *runtimesessionstate.Summary, value any) {
	response, ok := value.(map[string]any)
	if !ok {
		return
	}
	data, ok := response["data"].(map[string]any)
	if !ok || len(data) == 0 {
		return
	}
	summary.Interaction.Status = "answered"
	keys := make([]string, 0, len(data))
	for key := range data {
		if key = strings.TrimSpace(key); key != "" {
			keys = append(keys, key)
		}
	}
	sort.Strings(keys)
	for _, key := range keys {
		if value := compactInteractionValue(data[key]); value != "" {
			summary.Confirmed = append(summary.Confirmed, key+": "+value)
		}
	}
}

func compactInteractionValue(value any) string {
	if value == nil {
		return ""
	}
	if text, ok := value.(string); ok {
		return limitRunes(text, 240)
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return limitRunes(fmt.Sprint(value), 240)
	}
	return limitRunes(string(encoded), 240)
}

func appendFallbackArtifacts(summary *runtimesessionstate.Summary, value any) {
	switch current := value.(type) {
	case map[string]any:
		id := firstSummaryValue(current, "id", "document_id", "artifact_id", "key")
		if id == "" {
			return
		}
		summary.Artifacts = append(summary.Artifacts, runtimesessionstate.Artifact{
			Type: firstSummaryValue(current, "type", "kind"),
			ID:   id, Status: firstSummaryValue(current, "status", "state"),
		})
	case []any:
		for _, item := range current {
			appendFallbackArtifacts(summary, item)
		}
	}
}

func firstSummaryValue(values map[string]any, keys ...string) string {
	for _, key := range keys {
		value := strings.TrimSpace(fmt.Sprint(values[key]))
		if value != "" && value != "<nil>" {
			return value
		}
	}
	return ""
}

func compactMessageText(value string) string {
	value = strings.TrimSpace(value)
	runes := []rune(value)
	if len(runes) <= summaryMessageMaxRunes {
		return value
	}
	headLength := summaryMessageMaxRunes * 2 / 3
	return strings.TrimSpace(string(runes[:headLength])) + "\n...\n" +
		strings.TrimSpace(string(runes[len(runes)-(summaryMessageMaxRunes-headLength):]))
}

func summaryRole() string {
	return strings.Join([]string{
		"你是对话上下文压缩器。",
		"将已有摘要和新增对话合并为一份紧凑、准确、可供后续模型继续工作的结构化状态。",
		"保留用户目标、约束、已确认事实、已完成步骤、待完成事项、产物标识和交互等待状态。",
		"interaction.status 只能是 none、waiting、answered；产物必须保留 type、id、status。",
		"删除寒暄、重复内容和无关措辞；不要补充对话中不存在的信息。",
		"只输出合法 JSON，不要 Markdown，不要解释过程。",
		`输出格式：{"version":1,"goal":"","constraints":[],"confirmed":[],"completed":[],"pending":[],"artifacts":[{"type":"","id":"","status":""}],"interaction":{"status":"none","question":""}}`,
	}, "\n")
}

func normalizeSummary(value string) string {
	return runtimesessionstate.Normalize(value)
}
