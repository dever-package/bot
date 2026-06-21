package api

import (
	"strings"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	skilldraft "github.com/dever-package/bot/service/agent/skill/draft"
)

type SkillDraft struct{}

var skillDraftService = skilldraft.NewService()

func (SkillDraft) PostValidate(c *server.Context) error {
	body, err := skillDraftBody(c)
	if err != nil {
		return c.Error(err)
	}
	resp := skillDraftService.Validate(c.Context(), util.ToUint64(body["id"]))
	return skillDraftResponse(c, resp)
}

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
	resp := skillDraftService.Publish(c.Context(), util.ToUint64(body["id"]))
	return skillDraftResponse(c, resp)
}

func (SkillDraft) PostFromSkill(c *server.Context) error {
	body, err := skillDraftBody(c)
	if err != nil {
		return c.Error(err)
	}
	resp := skillDraftService.CreateFromSkill(
		c.Context(),
		util.ToUint64(body["skill_id"]),
		util.ToUint64(body["pack_id"]),
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
		ID:     util.ToUint64(firstSkillDraftBodyValue(body, "id", "draft_id", "draftId")),
		PackID: util.ToUint64(firstSkillDraftBodyValue(body, "pack_id", "packId")),
		CateID: util.ToUint64(firstSkillDraftBodyValue(body, "cate_id", "cateId")),
		Patch:  skillDraftMap(firstSkillDraftBodyValue(body, "patch", "draft")),
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
