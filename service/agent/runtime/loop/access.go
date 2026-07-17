package loop

import "context"

import runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"

func (s Service) RequireSessionScope(ctx context.Context, sessionID uint64, agentKey string, contextKey string) error {
	return s.chat.RequireSessionScope(ctx, sessionID, agentKey, contextKey)
}

func (s Service) RequireRunScope(ctx context.Context, requestID string, agentKey string, contextKey string) error {
	return s.chat.RequireRunScope(ctx, requestID, agentKey, contextKey)
}

func (s Service) RequireDocumentScope(ctx context.Context, documentID uint64, agentKey string, contextKey string) error {
	snapshot, err := s.requireDocumentAccess(ctx, documentID)
	if err != nil {
		return err
	}
	return s.chat.RequireSessionScope(ctx, snapshot.Document.SessionID, agentKey, contextKey)
}

func (s Service) RequireDocumentStreamScope(ctx context.Context, requestID string, agentKey string, contextKey string) error {
	documentID, err := runtimedocument.ParseStreamRequestID(requestID)
	if err != nil {
		return err
	}
	return s.RequireDocumentScope(ctx, documentID, agentKey, contextKey)
}
