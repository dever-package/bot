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
	SessionID  uint64
	ContextKey string
	AgentKey   string
	Role       string
	Kind       string
	Text       string
	Content    any
	Output     any
	RequestID  string
	Status     int16
}

type RunTurnRequest struct {
	SessionID       uint64
	AgentKey        string
	ContextKey      string
	RequestID       string
	Input           string
	Content         any
	InteractionID   string
	InteractionData map[string]any
}

type RunTurn struct {
	UserMessageID      uint64
	AssistantMessageID uint64
	InteractionResumed bool
	PriorKnowledgeUsed bool
	PriorLoadedSkills  []agentmodel.LoadedSkillRef
	Reused             bool
	Skipped            bool
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
		kind = agentmodel.MessageKindChat
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
			s.afterRecordedMessage(ctx, existing)
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
	s.afterRecordedMessage(ctx, message)
	return map[string]any{"session": sessionMap(*session), "message": messageMap(ctx, message)}, nil
}

func (s Service) BeginRunTurn(ctx context.Context, request RunTurnRequest) (RunTurn, error) {
	requestID := strings.TrimSpace(request.RequestID)
	input := strings.TrimSpace(request.Input)
	if requestID == "" {
		return RunTurn{}, fmt.Errorf("运行请求ID不能为空")
	}
	if input == "" {
		return RunTurn{}, fmt.Errorf("请输入消息内容")
	}
	request.RequestID = requestID
	request.Input = input
	return s.beginRunTurn(ctx, request, false)
}

func (s Service) BeginOpeningTurn(ctx context.Context, request RunTurnRequest) (RunTurn, error) {
	request.RequestID = strings.TrimSpace(request.RequestID)
	if request.RequestID == "" {
		return RunTurn{}, fmt.Errorf("运行请求ID不能为空")
	}
	return s.beginRunTurn(ctx, request, true)
}

func (s Service) beginRunTurn(ctx context.Context, request RunTurnRequest, opening bool) (RunTurn, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return RunTurn{}, err
	}
	requestID := request.RequestID
	input := request.Input
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
		if opening {
			if existing := openingAssistantMessage(tx, session.ID, requestID); existing != nil {
				turn.AssistantMessageID = existing.ID
				turn.Reused = true
				return nil
			}
			if session.MessageCount > 0 {
				turn.Skipped = true
				return nil
			}
		}
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
		claimFilter := map[string]any{
			"id": session.ID, "status": agentmodel.SessionStatusActive, "active_request_id": "",
		}
		if opening {
			claimFilter["message_count"] = 0
		}
		if claimed := agentmodel.NewSessionModel().Update(tx, claimFilter, map[string]any{"active_request_id": requestID}); claimed != 1 {
			if opening {
				if existing := openingAssistantMessage(tx, session.ID, requestID); existing != nil {
					turn.AssistantMessageID = existing.ID
					turn.Reused = true
					return nil
				}
				if current := agentmodel.NewSessionModel().Find(tx, map[string]any{"id": session.ID}); current != nil && current.MessageCount > 0 {
					turn.Skipped = true
					return nil
				}
			}
			return fmt.Errorf("当前会话正在生成，请等待完成或先停止")
		}
		if !opening && strings.TrimSpace(request.InteractionID) != "" {
			resumeState, interactionErr := resolveInteractionResponse(
				tx, session.ID, request.InteractionID, request.InteractionData,
			)
			if interactionErr != nil {
				return interactionErr
			}
			turn.InteractionResumed = true
			turn.PriorKnowledgeUsed = resumeState.knowledgeUsed
			turn.PriorLoadedSkills = agentmodel.NormalizeLoadedSkillRefs(resumeState.loadedSkills)
		}
		now := time.Now()
		if !opening {
			turn.UserMessageID = uint64(messageModel.Insert(tx, map[string]any{
				"session_id": session.ID,
				"role":       "user",
				"kind":       agentmodel.MessageKindChat,
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
		}
		messageKind := agentmodel.MessageKindChat
		if opening {
			messageKind = agentmodel.MessageKindOpening
		}
		turn.AssistantMessageID = uint64(messageModel.Insert(tx, map[string]any{
			"session_id": session.ID,
			"role":       "assistant",
			"kind":       messageKind,
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
		messageCount := session.MessageCount + 2
		if opening {
			messageCount = session.MessageCount + 1
		}
		values := map[string]any{
			"message_count":   messageCount,
			"last_message_at": now,
		}
		if !opening && (session.Title == "" || session.Title == "新会话") {
			values["title"] = shortTitle(input)
			values["title_source"] = agentmodel.TitleSourceAuto
		}
		agentmodel.NewSessionModel().Update(tx, map[string]any{
			"id": session.ID, "active_request_id": requestID,
		}, values)
		return nil
	})
	return turn, err
}

func openingAssistantMessage(ctx context.Context, sessionID uint64, requestID string) *agentmodel.Message {
	return agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"session_id": sessionID,
		"role":       "assistant",
		"kind":       agentmodel.MessageKindOpening,
		"request_id": requestID,
	})
}

func (s Service) CompleteRunTurn(ctx context.Context, completion RunTurnCompletion) error {
	sessionID := uint64(0)
	messageID := uint64(0)
	err := orm.Transaction(ctx, func(tx context.Context) error {
		var saveErr error
		sessionID, messageID, saveErr = s.SaveRunTurnCompletion(tx, completion)
		return saveErr
	})
	if err != nil {
		return err
	}
	s.AfterRunTurnCompletion(sessionID, messageID, completion.Status)
	return nil
}

// SaveRunTurnCompletion only persists the message state. Keeping lifecycle
// work outside this method lets callers commit the run and message atomically.
func (s Service) SaveRunTurnCompletion(ctx context.Context, completion RunTurnCompletion) (uint64, uint64, error) {
	requestID := strings.TrimSpace(completion.RequestID)
	if requestID == "" {
		return 0, 0, fmt.Errorf("运行请求ID不能为空")
	}
	messageModel := agentmodel.NewMessageModel()
	message := messageModel.Find(ctx, map[string]any{"role": "assistant", "request_id": requestID})
	if message == nil {
		return 0, 0, fmt.Errorf("运行中的助手消息不存在")
	}
	status, text, output := completedRunTurnMessage(completion)
	if updated := messageModel.Update(ctx, map[string]any{
		"id": message.ID, "status": agentmodel.MessageStatusRunning,
	}, map[string]any{
		"text":    text,
		"content": encodeJSON(map[string]any{"format": "markdown", "text": text}, "{}"),
		"output":  encodeJSON(output, "{}"),
		"status":  status,
	}); updated != 1 {
		return 0, 0, fmt.Errorf("运行中的助手消息状态已变化")
	}
	if updated := agentmodel.NewSessionModel().Update(ctx, map[string]any{
		"id": message.SessionID, "active_request_id": requestID,
	}, map[string]any{
		"active_request_id": "",
		"last_message_at":   time.Now(),
	}); updated != 1 {
		return 0, 0, fmt.Errorf("会话运行状态已变化")
	}
	return message.SessionID, message.ID, nil
}

func (s Service) AfterRunTurnCompletion(sessionID uint64, messageID uint64, status string) {
	if messageID > 0 {
		message := agentmodel.NewMessageModel().Find(context.Background(), map[string]any{"id": messageID})
		if message != nil && message.Kind == agentmodel.MessageKindOpening {
			return
		}
	}
	if sessionID > 0 {
		s.afterTurn(sessionID)
	}
	if messageID > 0 && strings.EqualFold(strings.TrimSpace(status), completionSuccess) {
		s.extractSessionMemoryAsync(sessionID, messageID)
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
