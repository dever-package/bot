package runtimecontext

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type AssembleRequest struct {
	Session        agentmodel.Session
	Agent          agentmodel.Agent
	CategoryPrompt string
	Input          string
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
	history := recentHistory(ctx, session)
	prompt := buildPrompt(ctx, request, session)
	return Result{Prompt: prompt, History: history, HistoryCount: len(history)}, nil
}
