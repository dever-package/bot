package api

import (
	"context"
	"strings"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	skilldraft "github.com/dever-package/bot/service/agent/skill/draft"
)

type SkillDraft struct{}

var skillDraftService = skilldraft.NewService()

func (SkillDraft) PostTest(c *server.Context) error {
	body, err := skillDraftBody(c)
	if err != nil {
		return c.Error(err)
	}
	resp := skillDraftService.Test(c.Context(), skilldraft.Request{
		ID:      util.ToUint64(body["id"]),
		Script:  util.ToStringTrimmed(body["script"]),
		Args:    skillDraftArgs(body["args"]),
		Target:  util.ToStringTrimmed(body["target"]),
		Timeout: time.Duration(util.ToIntDefault(body["timeout_seconds"], 0)) * time.Second,
	})
	return skillDraftResponse(c, resp)
}

func (SkillDraft) PostPublish(c *server.Context) error {
	body, err := skillDraftBody(c)
	if err != nil {
		return c.Error(err)
	}
	resp := skillDraftService.Publish(c.Context(), skilldraft.PublishRequest{
		ID:             util.ToUint64(body["id"]),
		Name:           util.ToStringTrimmed(body["name"]),
		NameSet:        skillDraftBodyHas(body, "name"),
		Description:    util.ToStringTrimmed(body["description"]),
		DescriptionSet: skillDraftBodyHas(body, "description"),
		PackID:         util.ToUint64(firstSkillDraftBodyValue(body, "pack_id", "packId")),
		CateID:         util.ToUint64(firstSkillDraftBodyValue(body, "cate_id", "cateId")),
	})
	return skillDraftResponse(c, resp)
}

func (SkillDraft) PostPublishOptions(c *server.Context) error {
	return c.JSONPayload(200, map[string]any{
		"status": 1,
		"msg":    "ok",
		"data": map[string]any{
			"packs": skillDraftPackOptions(c.Context()),
			"cates": skillDraftCateOptions(c.Context()),
		},
	})
}

func (SkillDraft) PostFromSkill(c *server.Context) error {
	body, err := skillDraftBody(c)
	if err != nil {
		return c.Error(err)
	}
	resp := skillDraftService.CreateFromSkill(
		c.Context(),
		util.ToUint64(firstSkillDraftBodyValue(body, "skill_id", "skillId", "source_skill_id", "sourceSkillId")),
		util.ToUint64(firstSkillDraftBodyValue(body, "pack_id", "packId")),
	)
	return skillDraftResponse(c, resp)
}

func (SkillDraft) PostImportSource(c *server.Context) error {
	body, err := skillDraftBody(c)
	if err != nil {
		return c.Error(err)
	}
	resp := skillDraftService.ImportSource(c.Context(), skilldraft.SourceRequest{
		PackID:      util.ToUint64(body["pack_id"]),
		CateID:      util.ToUint64(body["cate_id"]),
		Key:         util.ToStringTrimmed(body["key"]),
		Name:        util.ToStringTrimmed(body["name"]),
		Description: util.ToStringTrimmed(body["description"]),
		SourceURL:   util.ToStringTrimmed(body["source_url"]),
		Ref:         util.ToStringTrimmed(body["ref"]),
		License:     util.ToStringTrimmed(body["license"]),
		Notes:       util.ToStringTrimmed(body["notes"]),
		UsedFiles:   skillDraftStringList(body["used_files"]),
	})
	return skillDraftResponse(c, resp)
}

func (SkillDraft) PostApplyPatch(c *server.Context) error {
	body, err := skillDraftBody(c)
	if err != nil {
		return c.Error(err)
	}
	resp := skillDraftService.ApplyPatch(c.Context(), skilldraft.PatchRequest{
		ID:                  util.ToUint64(firstSkillDraftBodyValue(body, "id", "draft_id", "draftId")),
		PackID:              util.ToUint64(firstSkillDraftBodyValue(body, "pack_id", "packId")),
		CateID:              util.ToUint64(firstSkillDraftBodyValue(body, "cate_id", "cateId")),
		Patch:               skillDraftMap(firstSkillDraftBodyValue(body, "patch", "draft")),
		AssistantSessionID:  util.ToUint64(firstSkillDraftBodyValue(body, "assistant_session_id", "assistantSessionId")),
		AssistantAgentKey:   util.ToStringTrimmed(firstSkillDraftBodyValue(body, "assistant_agent_key", "assistantAgentKey")),
		AssistantContextKey: util.ToStringTrimmed(firstSkillDraftBodyValue(body, "assistant_context_key", "assistantContextKey")),
	})
	return skillDraftResponse(c, resp)
}

func skillDraftBody(c *server.Context) (map[string]any, error) {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return nil, err
	}
	return body, nil
}

func firstSkillDraftBodyValue(body map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := body[key]; exists {
			return value
		}
	}
	return nil
}

func skillDraftBodyHas(body map[string]any, keys ...string) bool {
	for _, key := range keys {
		if _, exists := body[key]; exists {
			return true
		}
	}
	return false
}

func skillDraftMap(raw any) map[string]any {
	if mapped, ok := raw.(map[string]any); ok {
		return mapped
	}
	return map[string]any{}
}

func skillDraftArgs(raw any) []string {
	switch values := raw.(type) {
	case []any:
		args := make([]string, 0, len(values))
		for _, value := range values {
			if text := util.ToStringTrimmed(value); text != "" {
				args = append(args, text)
			}
		}
		return args
	case []string:
		args := make([]string, 0, len(values))
		for _, value := range values {
			if text := util.ToStringTrimmed(value); text != "" {
				args = append(args, text)
			}
		}
		return args
	case string:
		return skillDraftStringList(values)
	default:
		return nil
	}
}

func skillDraftPackOptions(ctx context.Context) []map[string]any {
	rows := agentmodel.NewSkillPackModel().Select(ctx, map[string]any{"status": 1})
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		options = append(options, map[string]any{
			"id":   row.ID,
			"name": row.Name,
		})
	}
	return options
}

func skillDraftCateOptions(ctx context.Context) []map[string]any {
	rows := agentmodel.NewSkillCateModel().Select(ctx, map[string]any{"status": 1})
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		options = append(options, map[string]any{
			"id":   row.ID,
			"name": row.Name,
		})
	}
	return options
}

func skillDraftStringList(raw any) []string {
	switch value := raw.(type) {
	case []any:
		result := make([]string, 0, len(value))
		for _, item := range value {
			if text := util.ToStringTrimmed(item); text != "" {
				result = append(result, text)
			}
		}
		return result
	case []string:
		result := make([]string, 0, len(value))
		for _, item := range value {
			if text := util.ToStringTrimmed(item); text != "" {
				result = append(result, text)
			}
		}
		return result
	case string:
		lines := strings.FieldsFunc(value, func(char rune) bool {
			return char == '\n' || char == '\r' || char == ','
		})
		result := make([]string, 0, len(lines))
		for _, item := range lines {
			if text := util.ToStringTrimmed(item); text != "" {
				result = append(result, text)
			}
		}
		return result
	default:
		return nil
	}
}

func skillDraftResponse(c *server.Context, resp skilldraft.Result) error {
	return c.JSONPayload(200, map[string]any{
		"status": resp.Status,
		"msg":    resp.Message,
		"data":   resp.Data,
	})
}
