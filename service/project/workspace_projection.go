package project

import (
	"context"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
)

const workspaceExecutionRunProjectionFields = "main.id,main.project_id,main.status,main.output,main.error,main.updated_at,main.finished_at"

// Project terminal truth without mutating records or dispatching recovery.
func projectWorkspaceExecution(execution *workspacemodel.Execution, run *teammodel.Run) *workspacemodel.Execution {
	if execution == nil || run == nil || execution.ProjectID != run.ProjectID || execution.RunID != run.ID || (!canvasRunStatusFinished(run.Status) && run.Status != teammodel.RunStatusWaiting) {
		return execution
	}
	if execution.Status == teammodel.RunStatusCanceled && run.Status != teammodel.RunStatusCanceled {
		return execution
	}
	output := mapValue(jsonValue(run.Output, map[string]any{}))
	projected := *execution
	projected.Status, projected.Output, projected.Error = run.Status, run.Output, run.Error
	projected.UpdatedAt, projected.FinishedAt = run.UpdatedAt, run.FinishedAt
	if count, ok := output["executed"]; ok {
		projected.Executed = intValue(count)
	}
	if total := intValue(output["total"]); total > 0 {
		projected.Total = total
	}
	return &projected
}

func projectWorkspaceExecutions(ctx context.Context, executions []*workspacemodel.Execution) []*workspacemodel.Execution {
	if len(executions) == 0 {
		return executions
	}
	runIDs := workspaceExecutionRunIDs(executions)
	runs := make(map[uint64]*teammodel.Run, len(runIDs))
	if len(runIDs) > 0 {
		for _, run := range teammodel.NewRunModel().Select(ctx, map[string]any{"id": runIDs}, map[string]any{"field": workspaceExecutionRunProjectionFields}) {
			if run != nil {
				runs[run.ID] = run
			}
		}
	}
	projected := make([]*workspacemodel.Execution, 0, len(executions))
	for _, execution := range executions {
		if execution != nil {
			projected = append(projected, projectWorkspaceExecution(execution, runs[execution.RunID]))
		}
	}
	return projected
}

// A terminal Run snapshot can contain the committed result before an older
// NodeExecution projection catches up. Keep that complete payload and fill only
// missing nodes from the table, rather than replacing it with an empty slice.
func workspaceProjectedNodeResults(execution *workspacemodel.Execution, records []map[string]any) []map[string]any {
	output := mapValue(jsonValue(execution.Output, map[string]any{}))
	result := make([]map[string]any, 0, len(records))
	indexes := map[string]int{}
	appendResult := func(node map[string]any) {
		if node == nil {
			return
		}
		key := strings.TrimSpace(textValue(node["node_key"]))
		if key == "" {
			key = strings.TrimSpace(textValue(node["node_id"]))
		}
		if index, exists := indexes[key]; key != "" && exists {
			if !canvasRunStatusFinished(textValue(result[index]["status"])) && canvasRunStatusFinished(textValue(node["status"])) {
				result[index] = node
			}
			return
		}
		if key != "" {
			indexes[key] = len(result)
		}
		result = append(result, node)
	}
	for _, raw := range sliceValue(output["node_results"]) {
		appendResult(mapValue(raw))
	}
	for _, node := range records {
		appendResult(node)
	}
	return result
}

func workspaceNodeResultMaps(value any) []map[string]any {
	result := []map[string]any{}
	for _, raw := range sliceValue(value) {
		if node := mapValue(raw); node != nil {
			result = append(result, node)
		}
	}
	return result
}
