package workbench

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"sync"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	energonservice "github.com/dever-package/bot/service/energon"
	teamservice "github.com/dever-package/bot/service/team"
	"github.com/dever-package/bot/service/worker"
)

var powerHistoryTitleOnce sync.Once

func StartPowerHistoryTitleScheduler() {
	powerHistoryTitleOnce.Do(func() {
		jobs := powerHistoryTitleJobs{}
		worker.NewDatabaseDispatcher(jobs, jobs, worker.Config{
			Name: "工具历史标题", Concurrency: 2,
			OnPollError: func(err error) { slog.Error("工具标题队列读取失败", "error", err) },
			OnExecutionError: func(job worker.Lease, err error) {
				slog.Error("工具标题生成失败", "history_id", job.ID, "error", err)
			},
		})
	})
}

type powerHistoryTitleJobs struct{}

func (powerHistoryTitleJobs) ListRunnable(ctx context.Context, limit int) ([]worker.Candidate, error) {
	rows := workspacemodel.NewPowerHistoryModel().Select(ctx, map[string]any{"title_source": workspacemodel.PowerHistoryTitleSourcePending}, map[string]any{"order": "id asc", "limit": limit})
	result := make([]worker.Candidate, 0, len(rows))
	for _, row := range rows {
		result = append(result, worker.Candidate{ID: row.ID})
	}
	return result, nil
}

func (powerHistoryTitleJobs) Execute(ctx context.Context, job worker.Lease) (err error) {
	model := workspacemodel.NewPowerHistoryModel()
	filter := map[string]any{"id": job.ID, "title_source": workspacemodel.PowerHistoryTitleSourcePending}
	history := model.Find(ctx, filter)
	if history == nil {
		return nil
	}
	defer func() {
		if err != nil && ctx.Err() == nil {
			// A title failure keeps the already-saved automatic title. A worker
			// shutdown leaves it pending so the next process can read its receipt.
			model.Update(ctx, filter, map[string]any{"title_source": workspacemodel.PowerHistoryTitleSourceAuto})
		}
	}()
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": history.RunID})
	if run == nil {
		return fmt.Errorf("工具运行记录不存在")
	}
	var input map[string]any
	if err := json.Unmarshal([]byte(run.Input), &input); err != nil {
		return err
	}
	resume := recordValue(input[teamservice.CanvasPowerMetaContext])
	config, err := powerHistoryTitleGateway.RuntimePowerParamConfig(ctx, nestedText(resume, "power_key"), nestedUint64(resume, "source_target_id"))
	if err != nil {
		return err
	}
	power, err := energonservice.ResolveDefaultGeneralTextPower(ctx)
	if err != nil {
		return err
	}
	titleCtx, cancel := context.WithTimeout(ctx, powerHistoryTitleTimeout)
	defer cancel()
	title, err := powerHistoryTitleGateway.GenerateShortTitle(titleCtx, energonservice.ShortTitleRequest{
		RequestID: history.RequestID + "-title", PowerID: power.ID,
		Role: powerHistoryTitleRole(), MaxRunes: 16,
		Source: powerHistoryTitleSource(nestedText(resume, "node_name"), nestedText(resume, "kind"), powerHistoryPrompt(config.Params, powerHistoryReplayInput(input))),
	})
	if err != nil {
		return err
	}
	model.Update(ctx, filter, map[string]any{"title": title, "title_source": workspacemodel.PowerHistoryTitleSourceLLM, "updated_at": time.Now()})
	return nil
}
