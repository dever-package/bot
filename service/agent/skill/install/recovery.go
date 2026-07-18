package install

import (
	"context"
	"strings"
	"sync"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const interruptedInstallAge = 10 * time.Minute

var (
	installRecoveryMu   sync.Mutex
	lastInstallRecovery time.Time
)

func recoverInterruptedInstalls() {
	installRecoveryMu.Lock()
	defer installRecoveryMu.Unlock()
	if time.Since(lastInstallRecovery) < 30*time.Second {
		return
	}
	lastInstallRecovery = time.Now()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	for _, status := range []string{
		agentmodel.SkillInstallStatusPending,
		agentmodel.SkillInstallStatusInstalling,
	} {
		recoverInstallStatus(ctx, status)
	}
}

func recoverInstallStatus(ctx context.Context, status string) {
	model := agentmodel.NewSkillInstallModel()
	now := time.Now()
	for _, row := range model.Select(ctx, map[string]any{"status": status}) {
		if row == nil || now.Sub(installReferenceTime(row)) < interruptedInstallAge {
			continue
		}
		message := "技能安装进程已中断，请重新发起安装"
		logText := strings.TrimSpace(row.Log)
		if logText != "" {
			logText += "\n"
		}
		logText += now.Format("15:04:05") + " " + message + "\n"
		model.Update(ctx, map[string]any{"id": row.ID, "status": status}, map[string]any{
			"status":      agentmodel.SkillInstallStatusFail,
			"error":       message,
			"log":         logText,
			"finished_at": now,
		})
	}
}

func installReferenceTime(row *agentmodel.SkillInstall) time.Time {
	if row != nil && row.StartedAt != nil {
		return *row.StartedAt
	}
	if row != nil {
		return row.CreatedAt
	}
	return time.Time{}
}
