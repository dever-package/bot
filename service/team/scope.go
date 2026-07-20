package team

import (
	"context"

	teammodel "github.com/dever-package/bot/model/team"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	"github.com/shemic/dever/server"
)

func attachRunScope(ctx context.Context, record map[string]any) {
	scope := runtimescope.FromContext(ctx)
	record["actor_type"] = scope.ActorType
	record["actor_id"] = scope.ActorID
	record["site_key"] = scope.SiteKey
}

func restoreRunScope(ctx context.Context, run teammodel.Run) (context.Context, *server.Context, error) {
	scope := runtimescope.Scope{
		ActorType: run.ActorType,
		ActorID:   run.ActorID,
		SiteKey:   run.SiteKey,
	}
	serverContext, err := scope.Server(ctx, nil)
	if err != nil {
		return ctx, nil, err
	}
	if serverContext == nil {
		return ctx, nil, nil
	}
	restored := serverContext.Context()
	if owner := runExecutionOwner(ctx); owner != "" {
		restored = withRunExecutionOwner(restored, owner)
	}
	return restored, serverContext, nil
}
