package scope

import (
	"context"
	"fmt"
	"strings"

	deverjwt "github.com/shemic/dever/auth/jwt"
	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	frontauthcontext "github.com/dever-package/front/service/authcontext"
	"github.com/dever-package/front/service/siteconfig"
)

type Scope struct {
	ActorType string `json:"actor_type,omitempty"`
	ActorID   uint64 `json:"actor_id,omitempty"`
	SiteKey   string `json:"site_key,omitempty"`
}

func New(ctx context.Context, actorType string, actorID uint64) Scope {
	return Scope{
		ActorType: strings.TrimSpace(actorType),
		ActorID:   actorID,
		SiteKey:   siteconfig.SiteKeyFromContext(ctx),
	}
}

func FromContext(ctx context.Context) Scope {
	actorID := uint64(0)
	if current, ok := deverjwt.ActiveInt64(ctx); ok && current > 0 {
		actorID = uint64(current)
	}
	return New(ctx, agentmodel.SessionOwnerTypeAdmin, actorID)
}

func FromSession(ctx context.Context, session agentmodel.Session) Scope {
	return New(ctx, session.OwnerType, session.OwnerID)
}

// RestoreSession keeps new snapshots self-contained while allowing queued runs
// created before the scope field existed to recover from their durable session.
func RestoreSession(ctx context.Context, current Scope, sessionID uint64) Scope {
	if current.ActorID > 0 || sessionID == 0 {
		return current
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{"id": sessionID})
	if session == nil {
		return current
	}
	restored := FromSession(ctx, *session)
	if strings.TrimSpace(current.SiteKey) != "" {
		restored.SiteKey = current.SiteKey
	}
	return restored
}

func (current Scope) Server(ctx context.Context, existing *server.Context) (*server.Context, error) {
	if existing != nil {
		return existing, nil
	}
	if ctx == nil {
		ctx = context.Background()
	}
	if current.ActorID > 0 {
		ctx = frontauthcontext.WithActor(ctx, frontauthcontext.Actor{
			Type: current.ActorType,
			ID:   current.ActorID,
		})
	}
	siteKey := strings.TrimSpace(current.SiteKey)
	if siteKey != "" {
		config, err := siteconfig.Load(ctx)
		if err != nil {
			return nil, fmt.Errorf("恢复运行站点失败: %w", err)
		}
		site, exists := config.FindBySiteKey(siteKey)
		if !exists {
			return nil, fmt.Errorf("运行站点不存在: %s", siteKey)
		}
		ctx = siteconfig.WithSite(ctx, site)
	}
	if current.ActorID == 0 && siteKey == "" {
		return nil, nil
	}
	result := &server.Context{}
	result.SetContext(ctx)
	return result, nil
}
