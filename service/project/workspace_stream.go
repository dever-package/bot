package project

import (
	"context"

	teammodel "github.com/dever-package/bot/model/team"
	"github.com/dever-package/bot/service/stream"
)

func (s WorkspaceService) forwardWorkspaceNodeStream(ctx context.Context, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, payload map[string]any) {
	if textValue(payload["type"]) == "result" {
		return
	}
	output := mapValue(payload["output"])
	if len(output) == 0 {
		return
	}
	s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, stream.EventNodeOutput, teammodel.RunStatusRunning, output)
}

func (s WorkspaceService) writeWorkspaceNodeEvent(ctx context.Context, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, event string, status string, output map[string]any) {
	if run == nil || run.RequestID == "" {
		return
	}
	fields := map[string]any{
		"scope":              "canvas",
		"execution_id":       workspaceExecutionIDByRunID(ctx, run.ID),
		"run_id":             run.ID,
		"parent_run_id":      run.ID,
		"request_id":         run.RequestID,
		"parent_request_id":  run.RequestID,
		"release_id":         run.ReleaseID,
		"node_run_id":        nodeRunID,
		"node_key":           node.ID,
		"node_name":          canvasRunNodeTitle(node),
		"node_type":          node.Type,
		"function_key":       node.FunctionKey,
		"status":             status,
		"persists_result":    node.PersistsResult,
		"workspace_run_id":   run.ID,
		"workspace_node_key": node.ID,
	}
	if output != nil {
		fields["output"] = output
		if approval := canvasPayloadApproval(output); approval != nil {
			fields["approval"] = approval
			fields["approval_id"] = uint64Value(approval["id"])
		}
		if interaction := canvasPayloadInteraction(output); interaction != nil {
			fields["interaction"] = interaction
		}
		if childRunID := uint64Value(output["child_run_id"]); childRunID > 0 {
			fields["child_run_id"] = childRunID
		}
		if childRequestID := textValue(output["child_request_id"]); childRequestID != "" {
			fields["child_request_id"] = childRequestID
		}
	}
	_ = stream.Write(ctx, s.streams, run.RequestID, stream.FeatureFlow, event, fields)
}

func (s WorkspaceService) writeWorkspaceRunResult(ctx context.Context, run *teammodel.Run, output map[string]any, errorText string, status int) {
	if run == nil || run.RequestID == "" {
		return
	}
	_ = stream.WriteResult(ctx, s.streams, run.RequestID, output, errorText, status)
}
