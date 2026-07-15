package chat

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type MessageRequest struct {
	SessionID     uint64
	ContextKey    string
	AgentKey      string
	Role          string
	Kind          string
	Text          string
	Content       any
	Output        any
	RequestID     string
	Status        int16
	MemoryEnabled bool
}

type RunTurnRequest struct {
	SessionID  uint64
	AgentKey   string
	ContextKey string
	RequestID  string
	Input      string
	Content    any
}

type RunTurn struct {
	UserMessageID      uint64
	AssistantMessageID uint64
}

type RunTurnCompletion struct {
	RequestID string
	Status    string
	Text      string
	Output    any
	Error     string
}

func (s Service) RecordMessage(ctx context.Context, request MessageRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := resolveMessageSession(ctx, owner, request)
	if err != nil {
		return nil, err
	}
	role := normalizeRole(request.Role)
	if role == "" {
		return nil, fmt.Errorf("消息角色不能为空")
	}
	kind := strings.TrimSpace(request.Kind)
	if kind == "" {
		kind = "chat"
	}
	status := request.Status
	if status == 0 {
		status = agentmodel.MessageStatusNormal
	}
	requestID := strings.TrimSpace(request.RequestID)
	messageModel := agentmodel.NewMessageModel()
	if requestID != "" && role == "assistant" {
		if existing := messageModel.Find(ctx, map[string]any{
			"session_id": session.ID,
			"role":       role,
			"request_id": requestID,
		}); existing != nil {
			messageModel.Update(ctx, map[string]any{"id": existing.ID}, messageValues(kind, request.Text, request.Content, request.Output, status))
			now := time.Now()
			touchSessionTimestamp(ctx, session.ID, now)
			session.LastMessageAt = now
			existing = messageModel.Find(ctx, map[string]any{"id": existing.ID})
			s.afterRecordedMessage(existing, request.MemoryEnabled)
			return map[string]any{"session": sessionMap(*session), "message": messageMap(ctx, existing)}, nil
		}
	}

	now := time.Now()
	messageID := uint64(messageModel.Insert(ctx, map[string]any{
		"session_id": session.ID,
		"role":       role,
		"kind":       kind,
		"text":       strings.TrimSpace(request.Text),
		"content":    encodeJSON(request.Content, "{}"),
		"output":     encodeJSON(request.Output, "{}"),
		"request_id": requestID,
		"status":     status,
		"created_at": now,
	}))
	if messageID == 0 {
		return nil, fmt.Errorf("保存消息失败")
	}
	touchSession(ctx, session, role, request.Text, now)
	message := messageModel.Find(ctx, map[string]any{"id": messageID})
	s.afterRecordedMessage(message, request.MemoryEnabled)
	return map[string]any{"session": sessionMap(*session), "message": messageMap(ctx, message)}, nil
}

func (s Service) BeginRunTurn(ctx context.Context, request RunTurnRequest) (RunTurn, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return RunTurn{}, err
	}
	requestID := strings.TrimSpace(request.RequestID)
	input := strings.TrimSpace(request.Input)
	if requestID == "" {
		return RunTurn{}, fmt.Errorf("运行请求ID不能为空")
	}
	if input == "" {
		return RunTurn{}, fmt.Errorf("请输入消息内容")
	}
	turn := RunTurn{}
	err = orm.Transaction(ctx, func(tx context.Context) error {
		session, currentErr := requireSession(tx, owner, request.SessionID)
		if currentErr != nil {
			return currentErr
		}
		if currentErr = validateRunTurnSession(*session, request); currentErr != nil {
			return currentErr
		}
		messageModel := agentmodel.NewMessageModel()
		if running := messageModel.Find(tx, map[string]any{
			"session_id": session.ID,
			"role":       "assistant",
			"status":     agentmodel.MessageStatusRunning,
		}); running != nil {
			return fmt.Errorf("当前会话正在生成，请等待完成或先停止")
		}
		if existing := messageModel.Find(tx, map[string]any{"role": "assistant", "request_id": requestID}); existing != nil {
			return fmt.Errorf("运行请求ID已存在")
		}
		now := time.Now()
		turn.UserMessageID = uint64(messageModel.Insert(tx, map[string]any{
			"session_id": session.ID,
			"role":       "user",
			"kind":       "chat",
			"text":       input,
			"content":    encodeJSON(request.Content, "{}"),
			"output":     "{}",
			"request_id": "",
			"status":     agentmodel.MessageStatusNormal,
			"created_at": now,
		}))
		if turn.UserMessageID == 0 {
			return fmt.Errorf("保存用户消息失败")
		}
		turn.AssistantMessageID = uint64(messageModel.Insert(tx, map[string]any{
			"session_id": session.ID,
			"role":       "assistant",
			"kind":       "chat",
			"text":       "",
			"content":    encodeJSON(map[string]any{"format": "markdown", "text": ""}, "{}"),
			"output":     encodeJSON(map[string]any{"event": "running"}, "{}"),
			"request_id": requestID,
			"status":     agentmodel.MessageStatusRunning,
			"created_at": now,
		}))
		if turn.AssistantMessageID == 0 {
			return fmt.Errorf("保存助手消息失败")
		}
		values := map[string]any{
			"message_count":   session.MessageCount + 2,
			"last_message_at": now,
		}
		if session.Title == "" || session.Title == "新会话" {
			values["title"] = shortTitle(input)
			values["title_source"] = agentmodel.TitleSourceAuto
		}
		agentmodel.NewSessionModel().Update(tx, map[string]any{"id": session.ID}, values)
		return nil
	})
	return turn, err
}

func (s Service) CompleteRunTurn(ctx context.Context, completion RunTurnCompletion) error {
	sessionID, err := s.SaveRunTurnCompletion(ctx, completion)
	if err != nil {
		return err
	}
	s.AfterRunTurnCompletion(sessionID)
	return nil
}

// SaveRunTurnCompletion only persists the message state. Keeping lifecycle
// work outside this method lets callers commit the run and message atomically.
func (s Service) SaveRunTurnCompletion(ctx context.Context, completion RunTurnCompletion) (uint64, error) {
	requestID := strings.TrimSpace(completion.RequestID)
	if requestID == "" {
		return 0, fmt.Errorf("运行请求ID不能为空")
	}
	messageModel := agentmodel.NewMessageModel()
	message := messageModel.Find(ctx, map[string]any{"role": "assistant", "request_id": requestID})
	if message == nil {
		return 0, fmt.Errorf("运行中的助手消息不存在")
	}
	status, text, output := completedRunTurnMessage(completion)
	messageModel.Update(ctx, map[string]any{"id": message.ID}, map[string]any{
		"text":    text,
		"content": encodeJSON(map[string]any{"format": "markdown", "text": text}, "{}"),
		"output":  encodeJSON(output, "{}"),
		"status":  status,
	})
	touchSessionTimestamp(ctx, message.SessionID, time.Now())
	return message.SessionID, nil
}

func (s Service) AfterRunTurnCompletion(sessionID uint64) {
	if sessionID > 0 {
		s.afterTurn(sessionID)
	}
}

func (s Service) RequireRunAccess(ctx context.Context, requestID string) error {
	owner, err := currentOwner(ctx)
	if err != nil {
		return err
	}
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return fmt.Errorf("运行请求ID不能为空")
	}
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{"role": "assistant", "request_id": requestID})
	if message == nil {
		return fmt.Errorf("运行消息不存在")
	}
	if agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id": message.SessionID, "owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
	}) == nil {
		return fmt.Errorf("无权访问该运行")
	}
	return nil
}
