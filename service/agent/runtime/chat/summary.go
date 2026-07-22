package chat

import (
	"context"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
)

func (s Service) compactSessionContextAsync(sessionID uint64) {
	submitChatMaintenance("压缩会话上下文", sessionID, 30*time.Second, func(ctx context.Context) {
		powerKey, outputTokens := s.sessionModelSettings(ctx, sessionID)
		if powerKey != "" {
			s.compactor.Compact(ctx, sessionID, powerKey, outputTokens)
		}
	})
}

func (s Service) sessionModelSettings(ctx context.Context, sessionID uint64) (string, int) {
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return "", 0
	}
	agent, err := runtimecontext.ResolveAgent(ctx, session.AgentKey)
	if err != nil {
		return "", 0
	}
	power, err := runtimecontext.ResolveTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return "", 0
	}
	return power.Key, agent.MaxOutputTokens
}

func (s Service) sessionPowerKey(ctx context.Context, sessionID uint64) string {
	powerKey, _ := s.sessionModelSettings(ctx, sessionID)
	return powerKey
}
