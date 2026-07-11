package runtime

import (
	"context"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func (s Service) compactSessionContextAsync(sessionID uint64) {
	if sessionID == 0 {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		powerKey := s.sessionPowerKey(ctx, sessionID)
		if powerKey != "" {
			s.compactor.Compact(ctx, sessionID, powerKey, false)
		}
	}()
}

func (s Service) sessionPowerKey(ctx context.Context, sessionID uint64) string {
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return ""
	}
	agent, err := s.repository.FindAgent(ctx, session.AgentKey)
	if err != nil {
		return ""
	}
	power, err := s.repository.FindTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return ""
	}
	return power.Key
}
