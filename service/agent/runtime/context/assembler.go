package runtimecontext

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
)

type AssembleRequest struct {
	Session        agentmodel.Session
	Agent          agentmodel.Agent
	CategoryPrompt string
	Input          string
	IncludeMemory  bool
}

type InternalAssembleRequest struct {
	Agent          agentmodel.Agent
	CategoryPrompt string
	History        []any
}

type Result struct {
	Prompt       string
	History      []any
	HistoryCount int
}

type Assembler struct{}

func NewAssembler() Assembler {
	return Assembler{}
}

func (Assembler) Assemble(ctx context.Context, request AssembleRequest) (Result, error) {
	session := request.Session
	if session.ID == 0 || session.Status != agentmodel.SessionStatusActive {
		return Result{}, fmt.Errorf("会话不存在")
	}
	if strings.TrimSpace(request.Agent.Key) == "" || session.AgentKey != strings.TrimSpace(request.Agent.Key) {
		return Result{}, fmt.Errorf("会话智能体不匹配")
	}
	var history []any
	var prompt string
	var group runtimeasync.Group
	group.Go("读取会话历史", func() error {
		history = recentHistory(ctx, session)
		return nil
	})
	group.Go("组装智能体提示词", func() error {
		prompt = buildPrompt(ctx, request, session)
		return nil
	})
	if err := group.Wait(); err != nil {
		return Result{}, err
	}
	return Result{Prompt: prompt, History: history, HistoryCount: len(history)}, nil
}

func (Assembler) AssembleInternal(request InternalAssembleRequest) Result {
	history := normalizeHistory(request.History)
	return Result{
		Prompt:       buildInternalPrompt(request),
		History:      history,
		HistoryCount: len(history),
	}
}
