package draft

import (
	"context"
	"encoding/json"
	"fmt"
	"path/filepath"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func (Service) ApplyPatch(ctx context.Context, req PatchRequest) Result {
	values, err := draftPatchValues(ctx, req)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if draftPatchInvalidatesValidation(values) {
		values["validation_result"] = agentskill.JSONText(map[string]any{
			"assistant_patch": true,
			"content_changed": true,
		})
	}
	if req.ID > 0 {
		row := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": req.ID})
		if row == nil {
			return failResult("技能草稿不存在", nil)
		}
		if len(values) == 0 {
			data := applyPatchResultData(ctx, req.ID)
			if warning := rebindDraftAssistantSession(ctx, req, req.ID); warning != "" {
				data["assistant_session_warning"] = warning
			}
			return okResult("没有需要更新的草稿内容", data)
		}
		agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{"id": req.ID}, values)
		validation := validateAndSaveDraft(ctx, req.ID)
		data := applyPatchResultData(ctx, req.ID)
		if validation != nil {
			data["validation"] = validation
		}
		if warning := rebindDraftAssistantSession(ctx, req, req.ID); warning != "" {
			data["assistant_session_warning"] = warning
		}
		return okResult(draftPatchMessage("技能草稿已更新", validation), data)
	}

	if _, exists := values["key"]; !exists {
		return failResult("创建草稿时技能标识不能为空", nil)
	}
	if _, exists := values["name"]; !exists {
		values["name"] = values["key"]
	}
	if _, exists := values["pack_id"]; !exists {
		if req.PackID > 0 {
			values["pack_id"] = req.PackID
		} else {
			values["pack_id"] = agentmodel.DefaultSkillPackID
		}
	}
	if _, exists := values["cate_id"]; !exists {
		values["cate_id"] = defaultCateID(req.CateID)
	}
	values["status"] = agentmodel.SkillDraftStatusDraft
	values["created_at"] = time.Now()
	draftID := uint64(agentmodel.NewSkillDraftModel().Insert(ctx, values))
	if draftID == 0 {
		return failResult("创建技能草稿失败", nil)
	}
	validation := validateAndSaveDraft(ctx, draftID)
	data := applyPatchResultData(ctx, draftID)
	if validation != nil {
		data["validation"] = validation
	}
	if warning := rebindDraftAssistantSession(ctx, req, draftID); warning != "" {
		data["assistant_session_warning"] = warning
	}
	return okResult(draftPatchMessage("技能草稿已创建", validation), data)
}

func draftPatchInvalidatesValidation(values map[string]any) bool {
	for _, key := range []string{"key", "name", "description", "skill_md", "files_json", "manifest"} {
		if _, exists := values[key]; exists {
			return true
		}
	}
	return false
}

func validateAndSaveDraft(ctx context.Context, draftID uint64) map[string]any {
	if draftID == 0 {
		return nil
	}
	_, issues, err := loadAndValidate(ctx, draftID)
	if err != nil {
		return map[string]any{
			"valid":  false,
			"issues": []string{err.Error()},
		}
	}
	payload := validationPayload(issues)
	saveValidationResult(ctx, draftID, payload)
	return payload
}

func draftPatchMessage(defaultMessage string, validation map[string]any) string {
	if validation == nil || agentskill.Truthy(validation["valid"]) {
		return defaultMessage
	}
	return defaultMessage + "，但内容检查未通过"
}

func applyPatchResultData(ctx context.Context, draftID uint64) map[string]any {
	data := map[string]any{"draft_id": draftID}
	if row := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": draftID}); row != nil {
		if draft, ok := draftResultData(row, row.SourceSkillID, false)["draft"]; ok {
			data["draft"] = draft
		}
	}
	return data
}

func rebindDraftAssistantSession(ctx context.Context, req PatchRequest, draftID uint64) string {
	if req.AssistantSessionID == 0 || draftID == 0 {
		return ""
	}
	fromContextKey := strings.TrimSpace(req.AssistantContextKey)
	toContextKey := fmt.Sprintf("skill_draft:%d", draftID)
	if fromContextKey == "" || fromContextKey == toContextKey {
		return ""
	}
	if !isNewDraftAssistantContext(fromContextKey) {
		return ""
	}
	err := runtimechat.NewService().RebindSessionContext(ctx, runtimechat.RebindSessionContextRequest{
		SessionID:      req.AssistantSessionID,
		AgentKey:       req.AssistantAgentKey,
		FromContextKey: fromContextKey,
		ToContextKey:   toContextKey,
	})
	if err != nil {
		return err.Error()
	}
	return ""
}

func isNewDraftAssistantContext(contextKey string) bool {
	return contextKey == "skill_draft:new" || strings.HasPrefix(contextKey, "skill_draft:new:")
}

func draftPatchValues(ctx context.Context, req PatchRequest) (map[string]any, error) {
	patch := normalizePatchMap(req.Patch)
	if len(patch) == 0 {
		return nil, fmt.Errorf("草稿 patch 不能为空")
	}
	values := map[string]any{}
	if req.PackID > 0 {
		values["pack_id"] = req.PackID
	}
	if req.CateID > 0 {
		values["cate_id"] = req.CateID
	}
	if key := agentskill.NormalizeKey(patchText(patch, "key")); key != "" {
		values["key"] = key
	}
	if name := patchText(patch, "name"); name != "" {
		values["name"] = name
	}
	if description := patchText(patch, "description", "desc"); description != "" {
		values["description"] = description
	}
	if packID := patchUint64(patch, "pack_id", "packId"); packID > 0 {
		values["pack_id"] = packID
	}
	if cateID := patchUint64(patch, "cate_id", "cateId"); cateID > 0 {
		values["cate_id"] = cateID
	}
	if skillMD := patchText(patch, "skill_md", "skillMd", "skill", "content", "markdown"); skillMD != "" {
		values["skill_md"] = normalizeDraftMarkdownContent(skillMD)
	}
	if filesJSON, ok, err := patchFilesJSONText(patch, "files_json", "filesJson", "files"); err != nil {
		return nil, err
	} else if ok {
		values["files_json"] = filesJSON
	}
	if manifest, ok, err := patchJSONText(patch, "manifest", "runtime_config", "runtimeConfig"); err != nil {
		return nil, err
	} else if ok {
		values["manifest"] = manifest
	}

	if req.ID > 0 {
		return values, nil
	}
	applyDraftPatchDefaults(ctx, values)
	return values, nil
}

func normalizePatchMap(raw map[string]any) map[string]any {
	if raw == nil {
		return map[string]any{}
	}
	if nested, ok := raw["patch"].(map[string]any); ok {
		return nested
	}
	if draft, ok := raw["draft"].(map[string]any); ok {
		return draft
	}
	return raw
}

func applyDraftPatchDefaults(ctx context.Context, values map[string]any) {
	key := strings.TrimSpace(fmt.Sprint(values["key"]))
	name := strings.TrimSpace(fmt.Sprint(values["name"]))
	description := strings.TrimSpace(fmt.Sprint(values["description"]))
	if key == "" {
		key = agentskill.NormalizeKey(name)
		if key != "" {
			values["key"] = key
		}
	}
	if name == "" && key != "" {
		name = key
		values["name"] = name
	}
	if _, exists := values["cate_id"]; !exists {
		values["cate_id"] = defaultCateID(0)
	}
	if _, exists := values["files_json"]; !exists {
		values["files_json"] = "{}"
	}
	if _, exists := values["skill_md"]; !exists {
		values["skill_md"] = defaultDraftSkillMD(name, description)
	}
	if _, exists := values["manifest"]; !exists {
		values["manifest"] = defaultDraftManifest(ctx, key, name, description)
	}
	values["validation_result"] = agentskill.JSONText(map[string]any{
		"assistant_patch": true,
	})
}

func defaultCateID(value uint64) uint64 {
	if value > 0 {
		return value
	}
	return agentmodel.DefaultSkillCateID
}

func defaultDraftSkillMD(name string, description string) string {
	lines := []string{
		"---",
		"name: " + strings.TrimSpace(name),
		"description: " + strings.TrimSpace(description),
		"---",
		"",
		"# " + strings.TrimSpace(name),
	}
	if strings.TrimSpace(description) != "" {
		lines = append(lines, "", strings.TrimSpace(description))
	}
	lines = append(lines, "", "## Usage", "", "按用户输入选择是否使用该技能。")
	return strings.Join(lines, "\n")
}

func defaultDraftManifest(_ context.Context, key string, name string, description string) string {
	return agentskill.JSONText(map[string]any{
		"key":         key,
		"name":        name,
		"description": description,
		"triggers":    []any{},
		"config":      []any{},
		"scripts":     []any{},
		"source_refs": []any{},
	})
}

func patchText(patch map[string]any, keys ...string) string {
	for _, key := range keys {
		if value, exists := patch[key]; exists {
			return strings.TrimSpace(fmt.Sprint(value))
		}
	}
	return ""
}

func patchUint64(patch map[string]any, keys ...string) uint64 {
	for _, key := range keys {
		if value, exists := patch[key]; exists {
			switch typed := value.(type) {
			case float64:
				return uint64(typed)
			case int:
				return uint64(typed)
			case uint64:
				return typed
			case string:
				var parsed uint64
				_, _ = fmt.Sscanf(strings.TrimSpace(typed), "%d", &parsed)
				return parsed
			}
		}
	}
	return 0
}

func patchJSONText(patch map[string]any, keys ...string) (string, bool, error) {
	for _, key := range keys {
		value, exists := patch[key]
		if !exists {
			continue
		}
		switch typed := value.(type) {
		case string:
			text := cleanPatchJSONText(typed)
			if text == "" {
				return "", false, nil
			}
			if !json.Valid([]byte(text)) {
				return "", false, fmt.Errorf("%s 必须是 JSON", key)
			}
			return text, true, nil
		default:
			return agentskill.JSONText(typed), true, nil
		}
	}
	return "", false, nil
}

func patchFilesJSONText(patch map[string]any, keys ...string) (string, bool, error) {
	for _, key := range keys {
		value, exists := patch[key]
		if !exists {
			continue
		}
		files, empty, err := patchFilesMap(value)
		if err != nil {
			return "", false, fmt.Errorf("%s 必须是路径到文本内容的 JSON 对象", key)
		}
		if empty {
			return "", false, nil
		}
		return agentskill.JSONText(normalizeDraftFiles(files)), true, nil
	}
	return "", false, nil
}

func patchFilesMap(value any) (map[string]string, bool, error) {
	switch typed := value.(type) {
	case string:
		text := cleanPatchJSONText(typed)
		if text == "" {
			return nil, true, nil
		}
		files := map[string]string{}
		if err := json.Unmarshal([]byte(text), &files); err != nil {
			return nil, false, err
		}
		return files, false, nil
	default:
		raw, err := json.Marshal(typed)
		if err != nil {
			return nil, false, err
		}
		files := map[string]string{}
		if err := json.Unmarshal(raw, &files); err != nil {
			return nil, false, err
		}
		return files, false, nil
	}
}

func cleanPatchJSONText(text string) string {
	text = normalizeTextNewlines(strings.TrimPrefix(text, "\ufeff"))
	text = unwrapWholeFencedBlock(text)
	return strings.TrimSpace(text)
}

func normalizeDraftMarkdownContent(content string) string {
	content = normalizeTextNewlines(strings.TrimPrefix(content, "\ufeff"))
	content = unwrapWholeFencedBlock(content)
	return strings.TrimSpace(content)
}

func normalizeDraftFiles(files map[string]string) map[string]string {
	if len(files) == 0 {
		return map[string]string{}
	}
	normalized := make(map[string]string, len(files))
	for path, content := range files {
		cleanPath := filepath.ToSlash(filepath.Clean(strings.TrimSpace(path)))
		if cleanPath == "." {
			cleanPath = strings.TrimSpace(path)
		}
		normalized[cleanPath] = normalizeDraftFileContent(cleanPath, content)
	}
	return normalized
}

func normalizeDraftFileContent(path string, content string) string {
	content = normalizeTextNewlines(strings.TrimPrefix(content, "\ufeff"))
	content = unwrapWholeFencedBlock(content)
	if isDraftSourceFile(path) {
		content = normalizeLikelyEscapedSourceText(path, content)
		content = unwrapWholeFencedBlock(content)
		content = normalizeScriptTypography(content)
		return strings.TrimSpace(content)
	}
	if path == "requirements.txt" || path == "package.json" {
		return strings.TrimSpace(content)
	}
	return content
}

func normalizeTextNewlines(text string) string {
	text = strings.ReplaceAll(text, "\r\n", "\n")
	text = strings.ReplaceAll(text, "\r", "\n")
	return text
}

func unwrapWholeFencedBlock(text string) string {
	trimmed := strings.TrimSpace(text)
	if !strings.HasPrefix(trimmed, "```") {
		return text
	}
	firstLineEnd := strings.Index(trimmed, "\n")
	if firstLineEnd < 0 {
		return text
	}
	body := strings.TrimSpace(trimmed[firstLineEnd+1:])
	if !strings.HasSuffix(body, "```") {
		return text
	}
	body = strings.TrimSpace(strings.TrimSuffix(body, "```"))
	return body
}

func isDraftSourceFile(path string) bool {
	switch strings.ToLower(filepath.Ext(path)) {
	case ".py", ".js", ".sh", ".bash":
		return strings.HasPrefix(filepath.ToSlash(path), "scripts/")
	default:
		return false
	}
}

func normalizeLikelyEscapedSourceText(path string, content string) string {
	if strings.Contains(content, "\n") || !strings.Contains(content, `\n`) {
		return content
	}
	candidate := strings.ReplaceAll(content, `\r\n`, "\n")
	candidate = strings.ReplaceAll(candidate, `\n`, "\n")
	candidate = strings.ReplaceAll(candidate, `\t`, "\t")
	if sourceContentLooksStructured(path, candidate) {
		return candidate
	}
	if strings.HasSuffix(content, `\n`) {
		return strings.TrimSuffix(content, `\n`) + "\n"
	}
	return content
}

func sourceContentLooksStructured(path string, content string) bool {
	if !strings.Contains(content, "\n") {
		return false
	}
	trimmed := strings.TrimSpace(content)
	switch strings.ToLower(filepath.Ext(path)) {
	case ".py":
		return strings.HasPrefix(trimmed, "import ") ||
			strings.HasPrefix(trimmed, "from ") ||
			strings.HasPrefix(trimmed, "def ") ||
			strings.HasPrefix(trimmed, "class ") ||
			strings.HasPrefix(trimmed, "if __name__") ||
			strings.HasPrefix(trimmed, "try:") ||
			containsAny(content, "\nimport ", "\nfrom ", "\ndef ", "\nclass ", "\nif __name__", "\ntry:", "\nexcept ", ":\n    ")
	case ".js":
		return strings.HasPrefix(trimmed, "import ") ||
			strings.HasPrefix(trimmed, "const ") ||
			strings.HasPrefix(trimmed, "let ") ||
			strings.HasPrefix(trimmed, "var ") ||
			strings.HasPrefix(trimmed, "function ") ||
			strings.HasPrefix(trimmed, "export ") ||
			containsAny(content, "\nimport ", "\nconst ", "\nlet ", "\nvar ", "\nfunction ", "\nexport ", "=>\n", "{\n")
	case ".sh", ".bash":
		return strings.HasPrefix(trimmed, "#!/") ||
			strings.HasPrefix(trimmed, "set ") ||
			strings.HasPrefix(trimmed, "if ") ||
			strings.HasPrefix(trimmed, "for ") ||
			strings.HasPrefix(trimmed, "while ") ||
			containsAny(content, "\necho ", "\nif ", "\nfor ", "\nwhile ", "\ncase ", "\nset ")
	default:
		return false
	}
}

func containsAny(text string, needles ...string) bool {
	for _, needle := range needles {
		if strings.Contains(text, needle) {
			return true
		}
	}
	return false
}

func normalizeScriptTypography(content string) string {
	content = strings.ReplaceAll(content, "\u00a0", " ")
	content = strings.ReplaceAll(content, "\u3000", " ")
	content = replaceStandaloneQuotePairs(content, '“', '”', '"')
	content = replaceStandaloneQuotePairs(content, '‘', '’', '\'')
	return content
}

func replaceStandaloneQuotePairs(text string, open rune, close rune, replacement rune) string {
	runes := []rune(text)
	var builder strings.Builder
	for index := 0; index < len(runes); index++ {
		if runes[index] != open {
			builder.WriteRune(runes[index])
			continue
		}
		end := nextRuneIndex(runes, close, index+1)
		if end < 0 || !quoteStartBoundary(runes, index) || !quoteEndBoundary(runes, end) {
			builder.WriteRune(runes[index])
			continue
		}
		builder.WriteRune(replacement)
		for inner := index + 1; inner < end; inner++ {
			builder.WriteRune(runes[inner])
		}
		builder.WriteRune(replacement)
		index = end
	}
	return builder.String()
}

func nextRuneIndex(runes []rune, target rune, start int) int {
	for index := start; index < len(runes); index++ {
		if runes[index] == target {
			return index
		}
	}
	return -1
}

func quoteStartBoundary(runes []rune, index int) bool {
	if index == 0 {
		return true
	}
	prev := runes[index-1]
	return prev == '\n' || prev == '\t' || prev == ' ' || strings.ContainsRune("([{=,:+-*/%!<>", prev)
}

func quoteEndBoundary(runes []rune, index int) bool {
	if index >= len(runes)-1 {
		return true
	}
	next := runes[index+1]
	return next == '\n' || next == '\t' || next == ' ' || strings.ContainsRune(")]},.;:+-*/%!<>", next)
}
