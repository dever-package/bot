package agentcontext

import (
	"fmt"
	"strings"

	agentprompt "github.com/dever-package/bot/service/agent/prompt"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func buildPromptInput(req Request, collected collectedContext, plan Plan, catalog agentskill.Catalog, memories []agentprompt.MemorySnippet, options RuntimeOptions) agentprompt.RuntimeInput {
	contextNotes := []string{}
	if plan.IncludeHistory {
		contextNotes = contextNoteStrings(collected.ContextNotes)
	}
	knowledgeBases := []agentprompt.KnowledgeBaseRuntime{}
	if plan.IncludeKnowledgeTools {
		knowledgeBases = promptKnowledgeBases(collected.KnowledgeBases)
	}
	baselineText := ""
	if plan.IncludeBaseline {
		baselineText = baselinePrompt(collected.Baseline)
	}
	mode := runtimePromptMode(plan)
	taskFrame := promptTaskFrame(plan.TaskFrame)
	if strings.TrimSpace(taskFrame.OutputMode) == "" || taskFrame.OutputMode == "auto" {
		taskFrame.OutputMode = mode
	}
	return agentprompt.RuntimeInput{
		Mode:           mode,
		TaskFrame:      taskFrame,
		PublicSettings: collected.PublicSettings,
		AgentSettings:  collected.AgentSettings,
		KnowledgeBases: knowledgeBases,
		Memory:         memories,
		Powers:         collected.Powers,
		SkillCatalog:   catalog,
		Tools:          runtimePromptTools(options.Tool),
		Result: agentprompt.ResultRuntime{
			AsyncMaxConcurrency: options.AsyncMaxConcurrency,
		},
		History:        nil,
		ContextNotes:   contextNotes,
		BaselinePrompt: baselineText,
	}
}

func runtimePromptMode(plan Plan) string {
	mode := strings.TrimSpace(plan.ResponseModeHint)
	if taskMode := strings.TrimSpace(plan.TaskFrame.OutputMode); taskMode != "" && taskMode != "auto" {
		mode = taskMode
	}
	if len(plan.TaskFrame.Missing) > 0 {
		return "interaction"
	}
	if mode != "" && mode != "auto" {
		return mode
	}
	if plan.Intent == "chat" && plan.ResourceNeed == "none" && !plan.IncludeBaseline && !plan.IncludeKnowledgeTools && len(plan.SkillKeys) == 0 {
		return "chat"
	}
	if plan.IncludeBaseline {
		return "final_result"
	}
	if mode == "" {
		return "auto"
	}
	return mode
}

func promptTaskFrame(frame TaskFrame) agentprompt.TaskFrameRuntime {
	return agentprompt.TaskFrameRuntime{
		Goal:            frame.Goal,
		Deliverable:     frame.Deliverable,
		Constraints:     frame.Constraints,
		Inputs:          frame.Inputs,
		Missing:         frame.Missing,
		NonGoals:        frame.NonGoals,
		OutputMode:      frame.OutputMode,
		SuccessCriteria: frame.SuccessCriteria,
	}
}

func contextNoteStrings(notes []ContextNote) []string {
	rows := make([]string, 0, len(notes))
	for _, note := range notes {
		text := strings.TrimSpace(note.Text)
		if text == "" {
			continue
		}
		role := strings.TrimSpace(note.Role)
		if role == "" {
			role = "entry"
		}
		rows = append(rows, fmt.Sprintf("%s: %s", role, text))
	}
	return rows
}
