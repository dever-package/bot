package install

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
	frontstream "my/package/front/service/stream"
)

func (s Service) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	entries, err := s.streams.Read(ctx, requestID, lastID, count, block)
	if err != nil || len(entries) > 0 {
		return entries, err
	}
	entry, ok := s.finalEntryFromInstall(ctx, requestID)
	if !ok {
		return entries, nil
	}
	return []frontstream.Entry{entry}, nil
}

func (s Service) finalEntryFromInstall(ctx context.Context, requestID string) (frontstream.Entry, bool) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return frontstream.Entry{}, false
	}

	install := agentmodel.NewSkillInstallModel().Find(ctx, map[string]any{"request_id": requestID})
	if install == nil || !isFinalInstallStatus(install.Status) {
		return frontstream.Entry{}, false
	}

	status := 1
	output := installResultOutput(install)
	if install.Status == agentmodel.SkillInstallStatusFail {
		status = 2
	}
	return frontstream.Entry{
		ID:      installFinalStreamID(install),
		Payload: frontstream.ResponsePayload(requestID, "result", output, install.Error, status),
	}, true
}

func isFinalInstallStatus(status string) bool {
	switch strings.TrimSpace(status) {
	case agentmodel.SkillInstallStatusSuccess, agentmodel.SkillInstallStatusFail:
		return true
	default:
		return false
	}
}

func installResultOutput(install *agentmodel.SkillInstall) map[string]any {
	if install == nil {
		return map[string]any{}
	}
	if install.Status == agentmodel.SkillInstallStatusSuccess {
		if output := decodeInstallResult(install.Result); len(output) > 0 {
			return output
		}
		return map[string]any{
			"event":      "final",
			"kind":       "skill_install",
			"text":       "技能安装成功。",
			"install_id": install.ID,
			"skill_id":   install.SkillID,
		}
	}

	message := strings.TrimSpace(install.Error)
	if message == "" {
		message = "技能安装失败。"
	}
	return map[string]any{
		"event":      "final",
		"kind":       "skill_install",
		"text":       message,
		"install_id": install.ID,
		"error":      message,
	}
}

func decodeInstallResult(raw string) map[string]any {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return map[string]any{}
	}
	output := map[string]any{}
	if err := json.Unmarshal([]byte(raw), &output); err != nil {
		return map[string]any{}
	}
	return output
}

func installFinalStreamID(install *agentmodel.SkillInstall) string {
	if install == nil {
		return "0-0"
	}
	finishedAt := time.Now()
	if install.FinishedAt != nil {
		finishedAt = *install.FinishedAt
	} else if install.StartedAt != nil {
		finishedAt = *install.StartedAt
	} else {
		finishedAt = install.CreatedAt
	}
	return fmt.Sprintf("%d-%d", finishedAt.UnixMilli(), install.ID)
}
