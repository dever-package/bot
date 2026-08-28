package workbench

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// UserRecordService exposes read-only tool history records to administrators.
type UserRecordService struct{}

func (UserRecordService) ProviderLoadToolDetail(c *server.Context, _ []any) any {
	ctx, historyID, userID := adminToolRecordContext(c)
	if historyID == 0 || userID == 0 {
		panic("工具记录参数不完整")
	}
	history := workspacemodel.NewPowerHistoryModel().Find(ctx, map[string]any{
		"id": historyID, "user_id": userID,
	})
	if history == nil {
		panic("工具记录不存在")
	}
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": history.RunID})
	if !powerHistoryRunMatches(*history, run) {
		panic("工具运行记录不可用")
	}

	service := NewService()
	runInput := recordValue(run.Input)
	replayInput := powerHistoryReplayInput(runInput)
	toolName := fmt.Sprintf("工具 #%d（已删除）", history.TeamPowerID)
	resultKind := "richtext"
	prompt := ""
	if binding, err := service.team.ResolveWorkbenchPower(ctx, history.TeamID, history.TeamPowerID); err == nil {
		if name := strings.TrimSpace(binding.Name); name != "" {
			toolName = name
		}
		resultKind = binding.Power.Kind
		params := service.powerHistoryParams(ctx, binding, powerRunSourceTargetID(ctx, runInput, run.RequestID))
		prompt = powerHistoryPrompt(params, replayInput)
	}
	if strings.TrimSpace(prompt) == "" {
		prompt = botprotocol.BuildPromptContent(replayInput, botprotocol.PromptOptions{
			TextTitle: "提示词",
		}).TextWithMediaReferences(botprotocol.MediaReferenceOptions{
			Images: true, Videos: true, Audios: true, Files: true,
		})
	}
	if strings.TrimSpace(prompt) == "" {
		prompt = "未记录提示词"
	}
	resultRaw := recordValue(run.Output)
	if len(resultRaw) == 0 {
		resultRaw = map[string]any{"text": "未生成结果"}
	}
	return map[string]any{
		"id":              history.ID,
		"title":           strings.TrimSpace(history.Title),
		"tool_name":       toolName,
		"status":          strings.TrimSpace(run.Status),
		"prompt":          prompt,
		"result_text":     adminToolResultText(resultRaw),
		"result_document": assetservice.EnsureDocument(resultRaw, resultKind),
		"error":           strings.TrimSpace(run.Error),
		"has_error":       strings.TrimSpace(run.Error) != "",
		"request_id":      strings.TrimSpace(run.RequestID),
		"started_at":      run.StartedAt,
		"finished_at":     run.FinishedAt,
		"created_at":      history.CreatedAt,
		"updated_at":      history.UpdatedAt,
	}
}

func adminToolRecordContext(c *server.Context) (context.Context, uint64, uint64) {
	ctx := context.Background()
	if c != nil {
		ctx = c.Context()
		return ctx, util.ToUint64(c.Input("id")), util.ToUint64(c.Input("user_id"))
	}
	return ctx, 0, 0
}

func adminToolResultText(raw any) string {
	output := botprotocol.ExtractOutput(raw)
	for _, key := range []string{"text", "lyrics", "title", "error"} {
		if text := strings.TrimSpace(botprotocol.AsText(output[key])); text != "" {
			return text
		}
	}
	return ""
}
