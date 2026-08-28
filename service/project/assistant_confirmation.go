package project

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	assistantConfirmationVersion = 1
	assistantConfirmationTTL     = 10 * time.Minute

	assistantActionCanvasPatch = "canvas_patch"
	assistantActionCanvasRun   = "canvas_run"
	assistantActionFlowRun     = "flow_run"
	assistantActionRunStop     = "run_stop"

	assistantDecisionConfirm = "confirm"
	assistantDecisionCancel  = "cancel"
)

type assistantConfirmation struct {
	Version       int            `json:"version"`
	Action        string         `json:"action"`
	ProjectID     uint64         `json:"project_id"`
	SessionID     uint64         `json:"session_id"`
	UserID        uint64         `json:"user_id"`
	InteractionID string         `json:"interaction_id"`
	ExpiresAt     int64          `json:"expires_at"`
	BaseRevision  string         `json:"base_revision,omitempty"`
	Payload       map[string]any `json:"payload"`
}

type assistantConfirmationValidation struct {
	Action        string
	ProjectID     uint64
	SessionID     uint64
	UserID        uint64
	InteractionID string
	Decision      string
	Revision      string
	Now           time.Time
}

func encodeAssistantConfirmation(value assistantConfirmation) (string, error) {
	value.Version = assistantConfirmationVersion
	if value.ExpiresAt == 0 {
		value.ExpiresAt = time.Now().Add(assistantConfirmationTTL).Unix()
	}
	raw, err := json.Marshal(value)
	if err != nil {
		return "", fmt.Errorf("生成确认凭证失败: %w", err)
	}
	return agentskill.EncryptSecret(string(raw))
}

func decodeAssistantConfirmation(token string) (assistantConfirmation, error) {
	token = strings.TrimSpace(token)
	if !strings.HasPrefix(token, "v1:") {
		return assistantConfirmation{}, fmt.Errorf("确认凭证无效")
	}
	plain, err := agentskill.DecryptSecret(token)
	if err != nil || len(plain) > 128*1024 {
		return assistantConfirmation{}, fmt.Errorf("确认凭证无效")
	}
	var value assistantConfirmation
	if err = json.Unmarshal([]byte(plain), &value); err != nil {
		return assistantConfirmation{}, fmt.Errorf("确认凭证无效")
	}
	return value, nil
}

func validateAssistantConfirmation(
	confirmation assistantConfirmation,
	validation assistantConfirmationValidation,
) error {
	if confirmation.Version != assistantConfirmationVersion ||
		strings.TrimSpace(confirmation.Action) != strings.TrimSpace(validation.Action) {
		return fmt.Errorf("确认操作与预览不一致")
	}
	if confirmation.ProjectID != validation.ProjectID ||
		confirmation.SessionID != validation.SessionID ||
		confirmation.UserID != validation.UserID {
		return fmt.Errorf("确认凭证不属于当前会话")
	}
	if strings.TrimSpace(confirmation.InteractionID) == "" ||
		strings.TrimSpace(confirmation.InteractionID) != strings.TrimSpace(validation.InteractionID) {
		return fmt.Errorf("确认交互不一致")
	}
	if strings.TrimSpace(validation.Decision) != assistantDecisionConfirm {
		return fmt.Errorf("用户未确认执行")
	}
	now := validation.Now
	if now.IsZero() {
		now = time.Now()
	}
	if confirmation.ExpiresAt <= now.Unix() {
		return fmt.Errorf("确认凭证已过期，请重新预览")
	}
	if expected := strings.TrimSpace(confirmation.BaseRevision); expected != "" &&
		expected != strings.TrimSpace(validation.Revision) {
		return fmt.Errorf("画布已发生变化，请重新预览后确认")
	}
	return nil
}

func assistantInteractionResponse(input map[string]any) (string, string) {
	interactionID, data := assistantInteractionPayload(input)
	return interactionID, strings.ToLower(textValue(data["decision"]))
}

func assistantInteractionPayload(input map[string]any) (string, map[string]any) {
	content := mapValue(input["content"])
	response := mapValue(content["interaction_response"])
	data := mapValue(response["data"])
	return textValue(response["interaction_id"]), cloneInput(data)
}

func assistantConfirmationInteraction(interactionID string, title string) map[string]any {
	return map[string]any{
		"id":           interactionID,
		"type":         "form",
		"presentation": "form",
		"title":        strings.TrimSpace(title),
		"fields": []map[string]any{
			{
				"key":      "decision",
				"name":     "确认操作",
				"type":     "option",
				"required": true,
				"sort":     1,
				"options": []map[string]any{
					{"label": "确认执行", "value": assistantDecisionConfirm},
					{"label": "取消", "value": assistantDecisionCancel},
				},
				"recommended": []string{assistantDecisionCancel},
			},
		},
	}
}
