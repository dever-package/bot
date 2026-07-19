package draft

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"path/filepath"
	"strconv"
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
		row, err := loadEditableDraft(ctx, req.ID)
		if err != nil {
			return failResult(err.Error(), nil)
		}
		if err := requireDraftVersion(row, req.ExpectedVersion); err != nil {
			return failResult(err.Error(), applyPatchResultData(ctx, req.ID))
		}
		if err := validateDraftUpdate(ctx, row, values); err != nil {
			return failResult(err.Error(), nil)
		}
		if len(values) == 0 {
			data := applyPatchResultData(ctx, req.ID)
			if warning := rebindDraftAssistantSession(ctx, req, req.ID); warning != "" {
				data["assistant_session_warning"] = warning
			}
			return okResult("没有需要更新的草稿内容", data)
		}
		if err := updateDraftRow(ctx, row, values); err != nil {
			return failResult(err.Error(), nil)
		}
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
	release, err := reserveNewDraftKey(ctx, fmt.Sprint(values["key"]))
	if err != nil {
		return failResult(err.Error(), nil)
	}
	defer release()
	if err := validateDraftAssignmentValues(ctx, values); err != nil {
		return failResult(err.Error(), nil)
	}
	now := time.Now()
	values["status"] = agentmodel.SkillDraftStatusDraft
	values["version"] = 1
	values["created_at"] = now
	values["updated_at"] = now
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
	snapshot, issues, err := loadAndValidate(ctx, draftID)
	if err != nil {
		return map[string]any{
			"valid":  false,
			"issues": []string{err.Error()},
		}
	}
	payload := validationPayload(issues)
	if err := saveValidationResult(ctx, snapshot, payload); err != nil {
		payload["valid"] = false
		payload["save_error"] = err.Error()
		payload["issues"] = append(issues, err.Error())
	}
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
	if patchHasAnyKey(patch, "key") {
		rawKey := patchText(patch, "key")
		key := agentskill.NormalizeKey(rawKey)
		if rawKey != "" && key == "" {
			return nil, fmt.Errorf("技能标识只能包含字母、数字、横线或下划线")
		}
		if req.ID > 0 && key == "" {
			return nil, fmt.Errorf("技能标识不能为空")
		}
		if key != "" {
			values["key"] = key
		}
	}
	if patchHasAnyKey(patch, "name") {
		name := patchText(patch, "name")
		if req.ID > 0 && name == "" {
			return nil, fmt.Errorf("技能名称不能为空")
		}
		if name != "" {
			values["name"] = name
		}
	}
	if description := patchText(patch, "description", "desc"); description != "" {
		values["description"] = description
	} else if patchHasAnyKey(patch, "description", "desc") {
		values["description"] = ""
	}
	if patchHasAnyKey(patch, "pack_id", "packId") {
		packID, err := patchPositiveUint64(patch, "技能方案", "pack_id", "packId")
		if err != nil {
			return nil, err
		}
		values["pack_id"] = packID
	}
	if patchHasAnyKey(patch, "cate_id", "cateId") {
		cateID, err := patchPositiveUint64(patch, "技能分类", "cate_id", "cateId")
		if err != nil {
			return nil, err
		}
		values["cate_id"] = cateID
	}
	if patchHasAnyKey(patch, "skill_md", "skillMd", "skill", "content", "markdown") {
		skillMD := normalizeDraftMarkdownContent(patchText(patch, "skill_md", "skillMd", "skill", "content", "markdown"))
		if req.ID > 0 && skillMD == "" {
			return nil, fmt.Errorf("SKILL.md 不能为空")
		}
		if skillMD != "" {
			values["skill_md"] = skillMD
		}
	}
	if filesJSON, ok, err := patchFilesJSONText(patch, "files_json", "filesJson", "files"); err != nil {
		return nil, err
	} else if ok {
		values["files_json"] = filesJSON
	}
	if manifest, ok, err := patchJSONObjectText(patch, "manifest", "runtime_config", "runtimeConfig"); err != nil {
		return nil, err
	} else if ok {
		values["manifest"] = manifest
	}
	if err := validateDraftPatchSize(values); err != nil {
		return nil, err
	}

	if req.ID > 0 {
		return values, nil
	}
	applyDraftPatchDefaults(values)
	if err := agentskill.ValidateMetadata(
		patchText(values, "key"),
		patchText(values, "name"),
		patchText(values, "description"),
	); err != nil {
		return nil, err
	}
	if err := validateDraftAssignmentValues(ctx, values); err != nil {
		return nil, err
	}
	return values, nil
}

func validateDraftAssignmentValues(ctx context.Context, values map[string]any) error {
	return agentskill.ValidateAssignment(
		ctx,
		patchUint64(values, "pack_id"),
		patchUint64(values, "cate_id"),
	)
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

func applyDraftPatchDefaults(values map[string]any) {
	key := patchText(values, "key")
	name := patchText(values, "name")
	description := patchText(values, "description")
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
	if _, exists := values["pack_id"]; !exists {
		values["pack_id"] = agentmodel.DefaultSkillPackID
	}
	if _, exists := values["cate_id"]; !exists {
		values["cate_id"] = defaultCateID(0)
	}
	if _, exists := values["files_json"]; !exists {
		values["files_json"] = "{}"
	}
	if _, exists := values["skill_md"]; !exists {
		values["skill_md"] = defaultDraftSkillMD(key, name, description)
	}
	if _, exists := values["manifest"]; !exists {
		values["manifest"] = defaultDraftManifest(key, name, description)
	}
	values["validation_result"] = agentskill.JSONText(map[string]any{
		"assistant_patch": true,
	})
}

func validateDraftPatchSize(values map[string]any) error {
	limits := []struct {
		field string
		limit int
	}{
		{field: "skill_md", limit: maxDraftFileBytes},
		{field: "manifest", limit: maxDraftManifestBytes},
		{field: "files_json", limit: maxDraftFilesJSONBytes},
	}
	for _, current := range limits {
		value, exists := values[current.field]
		if !exists {
			continue
		}
		if len([]byte(fmt.Sprint(value))) > current.limit {
			return fmt.Errorf("%s 不能超过 %d 字节", current.field, current.limit)
		}
	}
	return nil
}

func patchHasAnyKey(patch map[string]any, keys ...string) bool {
	for _, key := range keys {
		if _, exists := patch[key]; exists {
			return true
		}
	}
	return false
}

func defaultCateID(value uint64) uint64 {
	if value > 0 {
		return value
	}
	return agentmodel.DefaultSkillCateID
}

func defaultDraftSkillMD(key string, name string, description string) string {
	lines := []string{
		agentskill.MarkdownFrontMatter(key, name, description),
		"",
		"# " + strings.TrimSpace(name),
	}
	if strings.TrimSpace(description) != "" {
		lines = append(lines, "", strings.TrimSpace(description))
	}
	lines = append(lines, "", "## Usage", "", "按用户输入选择是否使用该技能。")
	return strings.Join(lines, "\n")
}

func defaultDraftManifest(key string, name string, description string) string {
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
			if value == nil {
				return ""
			}
			return strings.TrimSpace(fmt.Sprint(value))
		}
	}
	return ""
}

func patchUint64(patch map[string]any, keys ...string) uint64 {
	value, _ := patchUint64Value(patch, keys...)
	return value
}

func patchPositiveUint64(patch map[string]any, label string, keys ...string) (uint64, error) {
	value, valid := patchUint64Value(patch, keys...)
	if !valid || value == 0 {
		return 0, fmt.Errorf("%s必须是正整数", label)
	}
	return value, nil
}

func patchUint64Value(patch map[string]any, keys ...string) (uint64, bool) {
	for _, key := range keys {
		if value, exists := patch[key]; exists {
			switch typed := value.(type) {
			case float64:
				const maxExactJSONInteger = float64(1<<53 - 1)
				if typed < 0 || typed != math.Trunc(typed) || typed > maxExactJSONInteger {
					return 0, false
				}
				return uint64(typed), true
			case int:
				if typed < 0 {
					return 0, false
				}
				return uint64(typed), true
			case int64:
				if typed < 0 {
					return 0, false
				}
				return uint64(typed), true
			case uint64:
				return typed, true
			case json.Number:
				parsed, err := strconv.ParseUint(strings.TrimSpace(typed.String()), 10, 64)
				return parsed, err == nil
			case string:
				parsed, err := strconv.ParseUint(strings.TrimSpace(typed), 10, 64)
				return parsed, err == nil
			}
			return 0, false
		}
	}
	return 0, false
}

func patchJSONObjectText(patch map[string]any, keys ...string) (string, bool, error) {
	for _, key := range keys {
		value, exists := patch[key]
		if !exists {
			continue
		}
		if value == nil {
			return "", false, nil
		}
		var raw []byte
		var err error
		switch typed := value.(type) {
		case string:
			text := cleanPatchJSONText(typed)
			if text == "" {
				return "", false, nil
			}
			raw = []byte(text)
		default:
			raw, err = json.Marshal(typed)
			if err != nil {
				return "", false, fmt.Errorf("%s 无法序列化为 JSON: %w", key, err)
			}
		}
		object := map[string]any{}
		if err := json.Unmarshal(raw, &object); err != nil || object == nil {
			return "", false, fmt.Errorf("%s 必须是 JSON 对象", key)
		}
		return string(raw), true, nil
	}
	return "", false, nil
}

func patchFilesJSONText(patch map[string]any, keys ...string) (string, bool, error) {
	for _, key := range keys {
		value, exists := patch[key]
		if !exists {
			continue
		}
		if value == nil {
			return "", false, nil
		}
		files, empty, err := patchFilesMap(value)
		if err != nil {
			return "", false, fmt.Errorf("%s 必须是路径到文本内容的 JSON 对象", key)
		}
		if empty {
			return "", false, nil
		}
		normalized := normalizeDraftFiles(files)
		if len(normalized) != len(files) {
			return "", false, fmt.Errorf("%s 包含规范化后重复的文件路径", key)
		}
		return agentskill.JSONText(normalized), true, nil
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
	if isDraftDependencyFile(path) {
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
