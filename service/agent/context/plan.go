package agentcontext

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"

	agentskill "github.com/dever-package/bot/service/agent/skill"
	energonservice "github.com/dever-package/bot/service/energon"
	botstream "github.com/dever-package/bot/service/energon/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

const plannerCacheTTL = 5 * time.Minute

func (a Assembler) buildPlan(ctx context.Context, req Request, collected collectedContext) Plan {
	plan := buildDeterministicPlan(req, collected)
	if !needsPlanner(req, collected, plan) {
		return plan
	}
	cacheKey := plannerCacheKey(req, collected)
	if cached, ok := a.cache.Get(cacheKey); ok {
		if cachedPlan, ok := cached.(Plan); ok {
			cachedPlan.Source = "planner_cache"
			return mergePlannerPlan(plan, cachedPlan)
		}
	}
	plannerPlan, ok := a.callPlanner(ctx, req, collected)
	if !ok {
		return plan
	}
	a.cache.Set(cacheKey, plannerPlan, plannerCacheTTL)
	return mergePlannerPlan(plan, plannerPlan)
}

func buildDeterministicPlan(req Request, collected collectedContext) Plan {
	if obviousNoResourceInput(req.Input) {
		plan := Plan{
			IncludeHistory:        len(collected.ContextNotes) > 0,
			IncludeBaseline:       false,
			IncludeKnowledgeTools: false,
			IncludeMemory:         false,
			SkillsPlanned:         true,
			Intent:                "chat",
			ResourceNeed:          "none",
			EditScope:             "none",
			ResponseModeHint:      "chat",
			Reason:                "明确普通对话，跳过候选技能、知识库和记忆资源。",
			Source:                "deterministic_no_resource",
		}
		plan.TaskFrame = deterministicTaskFrame(req, collected, plan)
		return plan
	}
	skillKeys, skillsPlanned, skillReason := deterministicSkillPlan(req, collected)
	plan := Plan{
		IncludeHistory:        len(collected.ContextNotes) > 0,
		IncludeBaseline:       collected.Baseline.Found,
		IncludeKnowledgeTools: len(collected.KnowledgeBases) > 0 && structuredKnowledgeSignal(req.Input),
		IncludeMemory:         req.Memory.Enabled && memoryAllowedForScene(req.Scene),
		SkillKeys:             skillKeys,
		SkillsPlanned:         skillsPlanned,
		Intent:                "run_agent",
		ResourceNeed:          deterministicResourceNeed(req, collected),
		EditScope:             "none",
		ResponseModeHint:      "auto",
		Reason:                "根据结构化输入和运行场景生成上下文。",
		Source:                "deterministic",
	}
	if plan.IncludeBaseline {
		plan.Intent = "continue_or_edit_result"
		plan.EditScope = deterministicEditScope(req.Input)
	}
	if skillReason != "" {
		plan.Reason += " " + skillReason
	}
	plan.TaskFrame = deterministicTaskFrame(req, collected, plan)
	return plan
}

func needsPlanner(req Request, collected collectedContext, plan Plan) bool {
	if req.Power.Key == "" {
		return false
	}
	if plan.Source == "deterministic_no_resource" {
		return false
	}
	if plan.IncludeBaseline && strings.TrimSpace(plan.EditScope) == "unknown" {
		return true
	}
	if len(collected.KnowledgeBases) > 0 && !plan.IncludeKnowledgeTools && shouldPlanKnowledgeTools(req, collected) {
		return true
	}
	if len(collected.SkillCatalog.Entries) > 0 && !plan.SkillsPlanned {
		return true
	}
	return false
}

func (a Assembler) callPlanner(ctx context.Context, req Request, collected collectedContext) (Plan, bool) {
	powerKey := a.plannerPowerKey(ctx, req)
	if powerKey == "" {
		return Plan{}, false
	}
	body := map[string]any{
		"power": powerKey,
		"set": map[string]any{
			"id":   agentIdentity(req.Agent) + "-context-planner",
			"role": plannerRole(),
		},
		"input": map[string]any{
			"text": plannerPrompt(req, collected),
		},
		"history": []any{},
		"options": map[string]any{
			"stream":      false,
			"temperature": 0,
		},
	}
	if req.SourceTargetID > 0 {
		body["source_target_id"] = req.SourceTargetID
	}
	resp := a.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Method:    req.Method,
		Host:      req.Host,
		Path:      req.Path,
		Headers:   req.Headers,
		Body:      body,
	})
	payload := resp.Payload()
	output := map[string]any(botstream.FrameOutput(payload))
	raw := strings.TrimSpace(firstText(output["text"], output["json"], payload["output"]))
	if int(frontstream.InputInt64(payload["status"], 0)) == 2 || raw == "" {
		return Plan{}, false
	}
	plan, ok := parsePlannerPlan(raw, output)
	if !ok {
		return Plan{}, false
	}
	plan.Source = "planner"
	return plan, true
}

func plannerRole() string {
	return strings.Join([]string{
		"你是智能体上下文与任务语义规划器，只判断本轮需要带哪些上下文资源，并提炼可执行的任务理解。",
		"不要生成正文、图片提示词、最终结果、Markdown 或解释。",
		"只输出 JSON: {\"include_history\":true,\"include_baseline\":true,\"include_knowledge_tools\":false,\"include_memory\":false,\"skill_keys\":[],\"intent\":\"简短意图\",\"resource_need\":\"none|knowledge|skill|memory|baseline|mixed\",\"edit_scope\":\"none|local|rewrite|replace_assets|unknown\",\"response_mode_hint\":\"chat|interaction|final_result|action|auto\",\"task_frame\":{\"goal\":\"用户真实目标\",\"deliverable\":\"最终交付物\",\"constraints\":[],\"inputs\":[],\"missing\":[],\"non_goals\":[],\"output_mode\":\"chat|interaction|final_result|action|auto\",\"success_criteria\":[]},\"reason\":\"简短原因\"}",
		"知识库/技能是候选资源；只有本轮确实需要时才启用。",
		"task_frame 要保留用户明确意图；missing 只列阻塞本轮任务的关键缺失信息，不阻塞不要写；有阻塞缺失时 output_mode 用 interaction。",
		"non_goals 写用户未要求且模型容易擅自扩展的范围。",
		"response_mode_hint 只是提示，不要把具体业务类型写死。",
	}, "\n")
}

func plannerPrompt(req Request, collected collectedContext) string {
	payload := map[string]any{
		"scene":          req.Scene,
		"input":          truncateText(jsonText(req.Input), DefaultBudget().PlannerInputRunes),
		"history_notes":  contextNoteStringsForPlanner(collected.ContextNotes),
		"baseline":       baselineNoteText(collected.Baseline),
		"knowledge_base": knowledgePlannerRows(collected),
		"skills":         skillPlannerRows(collected),
		"memory_enabled": req.Memory.Enabled,
	}
	return jsonText(payload)
}

func contextNoteStringsForPlanner(notes []ContextNote) []string {
	rows := make([]string, 0, len(notes))
	for _, note := range notes {
		if text := strings.TrimSpace(note.Text); text != "" {
			rows = append(rows, truncateText(strings.TrimSpace(note.Role)+": "+text, 600))
		}
	}
	return rows
}

func knowledgePlannerRows(collected collectedContext) []map[string]any {
	rows := make([]map[string]any, 0, len(collected.KnowledgeBases))
	for _, base := range collected.KnowledgeBases {
		rows = append(rows, map[string]any{
			"id":     base.ID,
			"name":   base.Name,
			"prompt": truncateText(base.Prompt, 240),
		})
	}
	return rows
}

func skillPlannerRows(collected collectedContext) []map[string]any {
	entries := collected.SkillCatalog.MetadataEntries
	if len(entries) == 0 {
		entries = collected.SkillCatalog.Entries
	}
	rows := make([]map[string]any, 0, len(entries))
	for _, entry := range entries {
		rows = append(rows, map[string]any{
			"key":         entry.Key,
			"name":        entry.Name,
			"description": truncateText(entry.Description, 260),
			"triggers":    entry.Triggers,
			"domains":     entry.Domains,
			"targets":     entry.Targets,
		})
	}
	return rows
}

func parsePlannerPlan(raw string, output map[string]any) (Plan, bool) {
	if mapped := normalizeMap(output["json"]); len(mapped) > 0 {
		return plannerPlanFromMap(mapped), true
	}
	jsonPayload := extractPlannerJSON(raw)
	if jsonPayload == "" {
		return Plan{}, false
	}
	payload := map[string]any{}
	if err := json.Unmarshal([]byte(jsonPayload), &payload); err != nil {
		return Plan{}, false
	}
	return plannerPlanFromMap(payload), true
}

func plannerPlanFromMap(payload map[string]any) Plan {
	return Plan{
		IncludeHistory:        boolValue(payload["include_history"]),
		IncludeBaseline:       boolValue(payload["include_baseline"]),
		IncludeKnowledgeTools: boolValue(payload["include_knowledge_tools"]),
		IncludeMemory:         boolValue(payload["include_memory"]),
		SkillKeys:             stringSlice(payload["skill_keys"]),
		SkillsPlanned:         true,
		Intent:                firstText(payload["intent"]),
		ResourceNeed:          normalizePlanResourceNeed(firstText(payload["resource_need"], payload["resourceNeed"])),
		EditScope:             normalizePlanEditScope(firstText(payload["edit_scope"], payload["editScope"])),
		ResponseModeHint:      normalizePlanResponseMode(firstText(payload["response_mode_hint"], payload["responseModeHint"], payload["response_mode"])),
		TaskFrame:             taskFrameFromMap(normalizeMap(payload["task_frame"])),
		Reason:                firstText(payload["reason"]),
	}
}

func extractPlannerJSON(raw string) string {
	raw = strings.TrimSpace(raw)
	if strings.HasPrefix(raw, "{") && strings.HasSuffix(raw, "}") {
		return raw
	}
	patterns := []*regexp.Regexp{
		regexp.MustCompile("(?s)```json\\s*(\\{.*?\\})\\s*```"),
		regexp.MustCompile("(?s)```\\s*(\\{.*?\\})\\s*```"),
		regexp.MustCompile("(?s)(\\{.*\\})"),
	}
	for _, pattern := range patterns {
		match := pattern.FindStringSubmatch(raw)
		if len(match) > 1 {
			return strings.TrimSpace(match[1])
		}
	}
	return ""
}

func mergePlannerPlan(base Plan, planner Plan) Plan {
	next := base
	next.IncludeHistory = planner.IncludeHistory
	next.IncludeBaseline = base.IncludeBaseline && planner.IncludeBaseline
	next.IncludeKnowledgeTools = base.IncludeKnowledgeTools || planner.IncludeKnowledgeTools
	next.IncludeMemory = base.IncludeMemory && planner.IncludeMemory
	next.SkillKeys = uniqueNonEmpty(append(base.SkillKeys, planner.SkillKeys...))
	next.SkillsPlanned = base.SkillsPlanned || planner.SkillsPlanned || planner.Source == "planner"
	next.Source = firstNonEmpty(planner.Source, base.Source)
	next.Intent = firstNonEmpty(planner.Intent, base.Intent)
	next.ResourceNeed = firstNonEmpty(planner.ResourceNeed, base.ResourceNeed)
	next.EditScope = mergePlanEditScope(base.EditScope, planner.EditScope)
	next.ResponseModeHint = firstNonEmpty(planner.ResponseModeHint, base.ResponseModeHint)
	next.TaskFrame = mergeTaskFrame(base.TaskFrame, planner.TaskFrame)
	next.Reason = firstNonEmpty(planner.Reason, base.Reason)
	return next
}

func plannerCacheKey(req Request, collected collectedContext) string {
	hash := sha256.Sum256([]byte(strings.Join([]string{
		"context-planner",
		string(req.Scene),
		agentIdentity(req.Agent),
		req.Power.Key,
		strconv.FormatUint(req.Agent.PlannerPowerID, 10),
		strconv.FormatUint(req.SourceTargetID, 10),
		jsonText(req.Input),
		jsonText(contextNoteStringsForPlanner(collected.ContextNotes)),
		baselineNoteText(collected.Baseline),
		strconv.FormatBool(req.Memory.Enabled),
		jsonText(skillPlannerRows(collected)),
		jsonText(knowledgePlannerRows(collected)),
	}, "\n")))
	return hex.EncodeToString(hash[:])
}

func deterministicSkillPlan(req Request, collected collectedContext) ([]string, bool, string) {
	if len(collected.SkillCatalog.Entries) == 0 {
		return nil, true, ""
	}
	selected, keys := agentskill.MatchByInput(collected.SkillCatalog.Entries, primaryInputText(req.Input))
	if len(selected) == 1 {
		return keys, true, "本地触发词唯一命中，已确定技能。"
	}
	if len(selected) == 0 && agentskill.CanSkipSelectorWithoutLocalCandidate(collected.SkillCatalog.SelectableEntries()) {
		return nil, true, "无本地触发词命中，且技能均配置明确触发范围，跳过技能正文。"
	}
	return nil, false, ""
}

func deterministicResourceNeed(req Request, collected collectedContext) string {
	needs := make([]string, 0, 4)
	if collected.Baseline.Found {
		needs = append(needs, "baseline")
	}
	if len(collected.KnowledgeBases) > 0 && structuredKnowledgeSignal(req.Input) {
		needs = append(needs, "knowledge")
	}
	if req.Memory.Enabled && memoryAllowedForScene(req.Scene) {
		needs = append(needs, "memory")
	}
	if len(collected.SkillCatalog.Entries) > 0 {
		needs = append(needs, "skill")
	}
	switch len(needs) {
	case 0:
		return "none"
	case 1:
		return needs[0]
	default:
		return "mixed"
	}
}

func deterministicTaskFrame(req Request, collected collectedContext, plan Plan) TaskFrame {
	goal := truncateText(primaryInputText(req.Input), 240)
	if goal == "" {
		goal = "按当前输入完成任务"
	}
	frame := TaskFrame{
		Goal:            goal,
		Deliverable:     deterministicDeliverable(plan),
		Inputs:          deterministicTaskInputs(req, collected, plan),
		OutputMode:      deterministicTaskOutputMode(plan),
		SuccessCriteria: deterministicSuccessCriteria(plan),
	}
	if plan.IncludeBaseline {
		frame.NonGoals = append(frame.NonGoals, "不要改动用户未要求修改的上一版结果内容")
	}
	return normalizeTaskFrame(frame)
}

func deterministicDeliverable(plan Plan) string {
	if plan.IncludeBaseline {
		return "基于上一版结果完成本轮指定修改"
	}
	switch deterministicTaskOutputMode(plan) {
	case "chat":
		return "直接回复用户当前问题"
	case "interaction":
		return "向用户收集完成任务所需的关键信息"
	case "final_result":
		return "交付可展示或可继续编辑的最终结果"
	case "action":
		return "调用必要能力或工具后继续完成任务"
	default:
		return "按用户要求完成任务"
	}
}

func deterministicTaskOutputMode(plan Plan) string {
	mode := normalizePlanResponseMode(plan.ResponseModeHint)
	if mode != "" && mode != "auto" {
		return mode
	}
	if plan.IncludeBaseline {
		return "final_result"
	}
	if plan.Intent == "chat" && plan.ResourceNeed == "none" {
		return "chat"
	}
	return "auto"
}

func deterministicTaskInputs(req Request, collected collectedContext, plan Plan) []string {
	inputs := make([]string, 0, 4)
	if req.SourceTargetID > 0 {
		inputs = append(inputs, "包含来源目标上下文")
	}
	if plan.IncludeBaseline {
		inputs = append(inputs, "包含上一版 final_result")
	}
	if len(collected.ContextNotes) > 0 && plan.IncludeHistory {
		inputs = append(inputs, "包含历史摘要")
	}
	if len(collected.KnowledgeBases) > 0 && plan.IncludeKnowledgeTools {
		inputs = append(inputs, "包含可读取知识库")
	}
	if len(plan.SkillKeys) > 0 {
		inputs = append(inputs, "包含已选择技能: "+strings.Join(plan.SkillKeys, "、"))
	}
	return inputs
}

func deterministicSuccessCriteria(plan Plan) []string {
	criteria := []string{"回答或交付内容要贴合用户本轮目标", "不编造未提供的事实、文件、链接或执行结果"}
	if deterministicTaskOutputMode(plan) == "chat" {
		criteria = []string{"直接回答当前问题", "保持简洁自然"}
	}
	if plan.IncludeBaseline {
		criteria = append(criteria, "保留用户未要求修改的内容")
	}
	return criteria
}

func taskFrameFromMap(payload map[string]any) TaskFrame {
	if len(payload) == 0 {
		return TaskFrame{}
	}
	return normalizeTaskFrame(TaskFrame{
		Goal:            firstText(payload["goal"], payload["user_goal"], payload["userGoal"]),
		Deliverable:     firstText(payload["deliverable"], payload["output"], payload["expected_output"], payload["expectedOutput"]),
		Constraints:     taskFrameStringSlice(payload["constraints"], payload["rules"]),
		Inputs:          taskFrameStringSlice(payload["inputs"], payload["known_inputs"], payload["knownInputs"]),
		Missing:         taskFrameStringSlice(payload["missing"], payload["missing_info"], payload["missingInfo"]),
		NonGoals:        taskFrameStringSlice(payload["non_goals"], payload["nonGoals"], payload["out_of_scope"], payload["outOfScope"]),
		OutputMode:      normalizePlanResponseMode(firstText(payload["output_mode"], payload["outputMode"], payload["mode"])),
		SuccessCriteria: taskFrameStringSlice(payload["success_criteria"], payload["successCriteria"], payload["criteria"]),
	})
}

func mergeTaskFrame(base TaskFrame, planner TaskFrame) TaskFrame {
	return normalizeTaskFrame(TaskFrame{
		Goal:            firstNonEmpty(planner.Goal, base.Goal),
		Deliverable:     firstNonEmpty(planner.Deliverable, base.Deliverable),
		Constraints:     uniqueNonEmpty(append(base.Constraints, planner.Constraints...)),
		Inputs:          uniqueNonEmpty(append(base.Inputs, planner.Inputs...)),
		Missing:         uniqueNonEmpty(append(base.Missing, planner.Missing...)),
		NonGoals:        uniqueNonEmpty(append(base.NonGoals, planner.NonGoals...)),
		OutputMode:      firstNonEmpty(planner.OutputMode, base.OutputMode),
		SuccessCriteria: uniqueNonEmpty(append(base.SuccessCriteria, planner.SuccessCriteria...)),
	})
}

func normalizeTaskFrame(frame TaskFrame) TaskFrame {
	return TaskFrame{
		Goal:            truncateText(frame.Goal, 240),
		Deliverable:     truncateText(frame.Deliverable, 180),
		Constraints:     limitTaskFrameValues(frame.Constraints),
		Inputs:          limitTaskFrameValues(frame.Inputs),
		Missing:         limitTaskFrameValues(frame.Missing),
		NonGoals:        limitTaskFrameValues(frame.NonGoals),
		OutputMode:      normalizePlanResponseMode(frame.OutputMode),
		SuccessCriteria: limitTaskFrameValues(frame.SuccessCriteria),
	}
}

func limitTaskFrameValues(values []string) []string {
	values = uniqueNonEmpty(values)
	result := make([]string, 0, len(values))
	for _, value := range values {
		value = truncateText(value, 160)
		if value == "" {
			continue
		}
		result = append(result, value)
		if len(result) >= 6 {
			break
		}
	}
	return result
}

func firstNonNil(values ...any) any {
	for _, value := range values {
		if value != nil {
			return value
		}
	}
	return nil
}

func taskFrameStringSlice(values ...any) []string {
	value := firstNonNil(values...)
	result := stringSlice(value)
	if len(result) > 0 {
		return result
	}
	if text := strings.TrimSpace(firstText(value)); text != "" {
		return []string{text}
	}
	return nil
}

func deterministicEditScope(input map[string]any) string {
	text := strings.ToLower(primaryInputText(input))
	if strings.TrimSpace(text) == "" {
		return "unknown"
	}
	if containsAny(text, []string{"换图", "换图片", "换封面", "重生成图", "重新生成图", "只改图", "只换图", "replace image", "cover"}) {
		return "replace_assets"
	}
	if containsAny(text, []string{"只改", "仅改", "保留正文", "不要改正文", "不改正文", "局部", "微调", "local"}) {
		return "local"
	}
	if containsAny(text, []string{"重写", "重新写", "整体改", "全部改", "rewrite"}) {
		return "rewrite"
	}
	return "unknown"
}

func normalizePlanResourceNeed(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "none", "knowledge", "skill", "memory", "baseline", "mixed":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return ""
	}
}

func normalizePlanEditScope(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "none", "local", "rewrite", "replace_assets", "unknown":
		return strings.ToLower(strings.TrimSpace(value))
	case "replace-assets", "asset", "assets":
		return "replace_assets"
	default:
		return ""
	}
}

func mergePlanEditScope(base string, planner string) string {
	base = normalizePlanEditScope(base)
	planner = normalizePlanEditScope(planner)
	if base != "" && base != "none" && base != "unknown" {
		return base
	}
	return firstNonEmpty(planner, base)
}

func normalizePlanResponseMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "chat", "interaction", "final_result", "action", "auto":
		return strings.ToLower(strings.TrimSpace(value))
	case "final", "result":
		return "final_result"
	default:
		return ""
	}
}

func structuredKnowledgeSignal(input map[string]any) bool {
	if len(input) == 0 {
		return false
	}
	for _, key := range []string{
		"knowledge_base_id",
		"knowledgeBaseId",
		"knowledge_base_ids",
		"knowledgeBaseIds",
		"reference_files",
		"referenceFiles",
		"references",
		"doc_id",
		"docId",
		"file_id",
		"fileId",
	} {
		if value, ok := input[key]; ok && strings.TrimSpace(firstText(value)) != "" {
			return true
		}
	}
	return false
}

func shouldPlanKnowledgeTools(req Request, collected collectedContext) bool {
	if len(collected.KnowledgeBases) == 0 {
		return false
	}
	if req.SourceTargetID > 0 || structuredKnowledgeSignal(req.Input) || hasContextualInputFields(req.Input) {
		return true
	}
	text := primaryInputText(req.Input)
	if resourceIntentSignal(text) {
		return true
	}
	return len([]rune(strings.TrimSpace(text))) >= 160
}

func hasContextualInputFields(input map[string]any) bool {
	for key, value := range input {
		normalizedKey := strings.ToLower(strings.TrimSpace(key))
		switch normalizedKey {
		case "", "text", "message", "prompt", "assistant_session_id", "assistantsessionid", "memory_enabled", "memoryenabled":
			continue
		}
		if strings.TrimSpace(firstText(value)) != "" {
			return true
		}
	}
	return false
}

func resourceIntentSignal(text string) bool {
	text = strings.TrimSpace(text)
	if text == "" {
		return false
	}
	for _, cue := range []string{
		"参考",
		"依据",
		"根据",
		"资料",
		"材料",
		"文档",
		"知识库",
		"文件",
		"引用",
		"来源",
		"出处",
		"原文",
		"检索",
		"查找",
		"搜索",
		"阅读",
		"总结",
		"归纳",
		"对比",
		"核对",
		"验证",
		"fact",
		"source",
		"reference",
		"document",
		"file",
	} {
		if strings.Contains(strings.ToLower(text), cue) {
			return true
		}
	}
	return false
}

func containsAny(text string, values []string) bool {
	for _, value := range values {
		if strings.Contains(text, strings.ToLower(value)) {
			return true
		}
	}
	return false
}

func obviousNoResourceInput(input map[string]any) bool {
	text := normalizeShortInput(primaryInputText(input))
	if text == "" {
		return false
	}
	if len([]rune(text)) > 20 {
		return false
	}
	phrases := map[string]struct{}{
		"hi":     {},
		"hello":  {},
		"ok":     {},
		"你好":     {},
		"您好":     {},
		"哈喽":     {},
		"在吗":     {},
		"谢谢":     {},
		"谢了":     {},
		"辛苦了":    {},
		"好的":     {},
		"好":      {},
		"收到":     {},
		"嗯":      {},
		"嗯嗯":     {},
		"可以":     {},
		"你是谁":    {},
		"你能做什么":  {},
		"你可以做什么": {},
		"帮我":     {},
		"你能帮我吗":  {},
		"怎么用":    {},
	}
	_, ok := phrases[text]
	return ok
}

func normalizeShortInput(text string) string {
	text = strings.ToLower(strings.TrimSpace(text))
	text = strings.Trim(text, " \t\r\n　。.!！?？~～,，；;：:")
	return strings.TrimSpace(text)
}

func memoryAllowedForScene(scene Scene) bool {
	switch scene {
	case SceneTeamRole, SceneAdminAssistant:
		return true
	default:
		return false
	}
}

func boolValue(value any) bool {
	switch current := value.(type) {
	case bool:
		return current
	case string:
		switch strings.ToLower(strings.TrimSpace(current)) {
		case "1", "true", "yes", "on":
			return true
		default:
			return false
		}
	default:
		return frontstream.InputInt64(value, 0) != 0
	}
}

func stringSlice(value any) []string {
	values := normalizeSlice(value)
	result := make([]string, 0, len(values))
	for _, item := range values {
		if text := strings.TrimSpace(firstText(item)); text != "" {
			result = append(result, text)
		}
	}
	return result
}
