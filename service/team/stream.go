package team

import (
	"context"
	"fmt"
	"time"

	teammodel "my/package/bot/model/team"
	"my/package/bot/service/stream"
	frontstream "my/package/front/service/stream"
)

func (s Service) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	return s.streams.Read(ctx, requestID, lastID, count, block)
}

func (s Service) ReadProjectStream(ctx context.Context, projectID uint64, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	if projectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	if s.repo.FindRunByRequestIDInProject(ctx, requestID, projectID) == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	return s.ReadStream(ctx, requestID, lastID, count, block)
}

func (s Service) writeRunEvent(ctx context.Context, run teammodel.Run, event string, fields map[string]any) {
	if run.RequestID == "" {
		return
	}
	if fields == nil {
		fields = map[string]any{}
	}
	feature := stream.NormalizeFeature(fields["feature"])
	if feature == "" {
		feature = stream.FeatureTeam
	}
	delete(fields, "feature")
	fields["run_id"] = run.ID
	fields["team_id"] = run.TeamID
	fields["release_id"] = run.ReleaseID
	fields["run_status"] = run.Status
	if _, exists := fields["status"]; !exists {
		fields["status"] = run.Status
	}
	_ = stream.Write(ctx, s.streams, run.RequestID, feature, event, fields)
}

func (s Service) writeRunEventByID(ctx context.Context, runID uint64, event string, fields map[string]any) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return
	}
	s.writeRunEvent(ctx, *run, event, fields)
}

func (s Service) writeFlowEvent(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, flow teammodel.Flow, event string, fields map[string]any) {
	if fields == nil {
		fields = map[string]any{}
	}
	fields["feature"] = stream.FeatureFlow
	fields["scope"] = "flow"
	fields["flow_run_id"] = flowRun.ID
	fields["flow_id"] = flow.ID
	fields["flow_key"] = flow.Key
	fields["flow_name"] = flow.Name
	fields["status"] = flowRun.Status
	s.writeRunEvent(ctx, run, event, fields)
}

func (s Service) writeNodeEvent(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, flow teammodel.Flow, node teammodel.FlowNode, nodeRun teammodel.NodeRun, event string, fields map[string]any) {
	if fields == nil {
		fields = map[string]any{}
	}
	fields["scope"] = "node"
	fields["flow_run_id"] = flowRun.ID
	fields["flow_id"] = flow.ID
	fields["flow_key"] = flow.Key
	fields["flow_name"] = flow.Name
	fields["node_run_id"] = nodeRun.ID
	fields["node_id"] = node.ID
	fields["node_key"] = node.NodeKey
	fields["node_name"] = node.Name
	fields["node_type"] = node.Type
	fields["feature"] = featureByNodeType(node.Type)
	fields["status"] = nodeRun.Status
	s.writeRunEvent(ctx, run, event, fields)
}

func (s Service) writeEdgeActiveEvents(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, flow teammodel.Flow, node teammodel.FlowNode, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) {
	for _, edge := range incoming {
		fromNode, ok := nodeByID[edge.FromNodeID]
		if !ok {
			continue
		}
		s.writeRunEvent(ctx, run, stream.EventEdgeActive, map[string]any{
			"feature":       stream.FeatureFlow,
			"scope":         "edge",
			"flow_run_id":   flowRun.ID,
			"flow_id":       flow.ID,
			"flow_key":      flow.Key,
			"flow_name":     flow.Name,
			"edge_id":       edge.ID,
			"from_node_id":  edge.FromNodeID,
			"from_node_key": fromNode.NodeKey,
			"to_node_id":    edge.ToNodeID,
			"to_node_key":   node.NodeKey,
			"condition":     edge.Condition,
		})
	}
}

func featureByNodeType(nodeType string) string {
	switch nodeType {
	case teammodel.NodeTypePower:
		return stream.FeaturePower
	case teammodel.NodeTypeAgent:
		return stream.FeatureAgent
	case teammodel.NodeTypeTeam:
		return stream.FeatureTeam
	default:
		return stream.FeatureFlow
	}
}
