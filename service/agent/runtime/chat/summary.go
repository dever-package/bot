package chat

import (
	"context"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
)

func (s Service) compactSessionContextAsync(sessionID uint64) {
	submitChatMaintenance("压缩会话上下文", sessionID, 30*time.Second, func(ctx context.Context) {
		powerKey := s.sessionPowerKey(ctx, sessionID)
		if powerKey != "" {
			s.compactor.Compact(ctx, sessionID, powerKey)
		}
	})
}

func (s Service) sessionPowerKey(ctx context.Context, sessionID uint64) string {
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return ""
	}
	agent, err := runtimecontext.ResolveAgent(ctx, session.AgentKey)
	if err != nil {
		return ""
	}
	power, err := runtimecontext.ResolveTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return ""
	}
	return power.Key
}
