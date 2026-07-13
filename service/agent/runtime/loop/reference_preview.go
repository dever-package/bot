package loop

import (
	"context"
	"strings"

	"github.com/shemic/dever/server"

	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
)

type ReferencePreviewRequest struct {
	SessionID     uint64
	AgentKey      string
	ReferenceType string
	ReferenceID   uint64
	Label         string
	Server        *server.Context
}

func (s Service) ReferencePreview(ctx context.Context, request ReferencePreviewRequest) (map[string]any, error) {
	session, err := s.chat.RequireAgentSession(ctx, request.SessionID, request.AgentKey)
	if err != nil {
		return nil, err
	}
	resolved, err := runtimereference.NewRequestResolver(request.Server).Preview(ctx, *session, runtimereference.Reference{
		Type:  strings.TrimSpace(request.ReferenceType),
		ID:    request.ReferenceID,
		Label: strings.TrimSpace(request.Label),
	})
	if err != nil {
		return nil, err
	}
	return runtimereference.PreviewPayload(resolved), nil
}
