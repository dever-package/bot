package brain

import (
	"context"
	"encoding/json"
	"fmt"

	brainmodel "my/package/bot/model/brain"
)

type runtimeGraph struct {
	Brain              brainmodel.Brain
	Thinks             []brainmodel.Think
	ThinkEdges         []brainmodel.ThinkEdge
	FlowNodesByThinkID map[uint64][]brainmodel.ThinkFlowNode
	FlowEdgesByThinkID map[uint64][]brainmodel.ThinkFlowNodeEdge
}

func (s Service) runnableBrainRelease(ctx context.Context, brain brainmodel.Brain) (*brainmodel.BrainRelease, error) {
	if brain.CurrentReleaseID > 0 {
		if release := s.repo.FindBrainRelease(ctx, brain.CurrentReleaseID); release != nil {
			if release.Status == brainmodel.BrainReleaseStatusCurrent {
				return release, nil
			}
		}
	}
	if release := s.repo.FindCurrentBrainRelease(ctx, brain.ID); release != nil {
		return release, nil
	}
	return nil, fmt.Errorf("大脑尚未发布，不能运行")
}

func (s Service) runtimeGraphForRun(ctx context.Context, run brainmodel.Run) (runtimeGraph, error) {
	if run.ReleaseID > 0 {
		release := s.repo.FindBrainRelease(ctx, run.ReleaseID)
		if release == nil {
			return runtimeGraph{}, fmt.Errorf("运行绑定的发布版本不存在")
		}
		return runtimeGraphFromRelease(*release)
	}
	brain, err := s.repo.FindBrain(ctx, run.BrainID)
	if err != nil {
		return runtimeGraph{}, err
	}
	return s.currentRuntimeGraph(ctx, brain), nil
}

func (s Service) currentRuntimeGraph(ctx context.Context, brain brainmodel.Brain) runtimeGraph {
	thinks := s.repo.ListThinks(ctx, brain.ID, true)
	graph := runtimeGraph{
		Brain:              brain,
		Thinks:             thinks,
		ThinkEdges:         s.repo.ListThinkEdges(ctx, brain.ID, true),
		FlowNodesByThinkID: map[uint64][]brainmodel.ThinkFlowNode{},
		FlowEdgesByThinkID: map[uint64][]brainmodel.ThinkFlowNodeEdge{},
	}
	for _, think := range thinks {
		graph.FlowNodesByThinkID[think.ID] = s.repo.ListFlowNodes(ctx, think.ID, true)
		graph.FlowEdgesByThinkID[think.ID] = s.repo.ListFlowNodeEdges(ctx, think.ID, true)
	}
	return graph
}

func runtimeGraphFromRelease(release brainmodel.BrainRelease) (runtimeGraph, error) {
	snapshot, err := releaseSnapshotFromText(release.Snapshot)
	if err != nil {
		return runtimeGraph{}, err
	}
	graph := runtimeGraph{
		Brain:              graphBrainToModel(snapshot.Brain),
		Thinks:             make([]brainmodel.Think, 0, len(snapshot.Thinks)),
		ThinkEdges:         make([]brainmodel.ThinkEdge, 0, len(snapshot.ThinkEdges)),
		FlowNodesByThinkID: map[uint64][]brainmodel.ThinkFlowNode{},
		FlowEdgesByThinkID: map[uint64][]brainmodel.ThinkFlowNodeEdge{},
	}
	for _, payload := range snapshot.Thinks {
		graph.Thinks = append(graph.Thinks, graphThinkToModel(graph.Brain.ID, payload))
	}
	thinkByKey := map[string]brainmodel.Think{}
	for _, think := range graph.Thinks {
		thinkByKey[think.Key] = think
	}
	for _, payload := range snapshot.ThinkEdges {
		graph.ThinkEdges = append(graph.ThinkEdges, graphThinkEdgeToModel(graph.Brain.ID, payload))
	}
	for thinkKey, payloads := range snapshot.FlowNodesByThink {
		think := thinkByKey[thinkKey]
		if think.ID == 0 {
			continue
		}
		nodes := make([]brainmodel.ThinkFlowNode, 0, len(payloads))
		for _, payload := range payloads {
			nodes = append(nodes, graphFlowNodeToModel(graph.Brain.ID, think.ID, payload))
		}
		graph.FlowNodesByThinkID[think.ID] = nodes
	}
	for thinkKey, payloads := range snapshot.FlowEdgesByThink {
		think := thinkByKey[thinkKey]
		if think.ID == 0 {
			continue
		}
		edges := make([]brainmodel.ThinkFlowNodeEdge, 0, len(payloads))
		for _, payload := range payloads {
			edges = append(edges, graphFlowNodeEdgeToModel(graph.Brain.ID, think.ID, payload))
		}
		graph.FlowEdgesByThinkID[think.ID] = edges
	}
	return graph, nil
}

func releaseSnapshotFromText(text string) (BrainReleaseSnapshot, error) {
	var snapshot BrainReleaseSnapshot
	if err := json.Unmarshal([]byte(text), &snapshot); err != nil {
		return BrainReleaseSnapshot{}, fmt.Errorf("读取发布快照失败: %w", err)
	}
	if snapshot.Brain.ID == 0 {
		return BrainReleaseSnapshot{}, fmt.Errorf("发布快照缺少大脑信息")
	}
	return snapshot, nil
}

func graphBrainToModel(payload GraphBrain) brainmodel.Brain {
	return brainmodel.Brain{
		ID:          payload.ID,
		Name:        payload.Name,
		Key:         payload.Key,
		Description: payload.Description,
		Persona:     payload.Persona,
		Goal:        payload.Goal,
		Config:      jsonText(payload.Config),
		Status:      payload.Status,
		Sort:        payload.Sort,
	}
}

func graphThinkToModel(brainID uint64, payload GraphThink) brainmodel.Think {
	return brainmodel.Think{
		ID:           payload.ID,
		BrainID:      brainID,
		Name:         payload.Name,
		Key:          payload.Key,
		Type:         normalizeThinkType(payload.Type),
		Goal:         payload.Goal,
		InputSchema:  jsonText(payload.InputSchema),
		OutputSchema: jsonText(payload.OutputSchema),
		Position:     jsonText(payload.Position),
		Config:       jsonText(payload.Config),
		Status:       payload.Status,
		Sort:         payload.Sort,
	}
}

func graphThinkEdgeToModel(brainID uint64, payload GraphThinkEdge) brainmodel.ThinkEdge {
	return brainmodel.ThinkEdge{
		ID:           payload.ID,
		BrainID:      brainID,
		FromThinkID:  payload.FromThinkID,
		ToThinkID:    payload.ToThinkID,
		Condition:    payload.Condition,
		InputMapping: jsonText(payload.InputMapping),
		Config:       jsonText(payload.Config),
		Status:       payload.Status,
		Sort:         payload.Sort,
	}
}

func graphFlowNodeToModel(brainID uint64, thinkID uint64, payload GraphFlowNode) brainmodel.ThinkFlowNode {
	return brainmodel.ThinkFlowNode{
		ID:       payload.ID,
		BrainID:  brainID,
		ThinkID:  thinkID,
		NodeKey:  payload.NodeKey,
		Name:     payload.Name,
		Type:     payload.Type,
		AgentID:  payload.AgentID,
		Config:   jsonText(payload.Config),
		Position: jsonText(payload.Position),
		Status:   payload.Status,
		Sort:     payload.Sort,
	}
}

func graphFlowNodeEdgeToModel(brainID uint64, thinkID uint64, payload GraphFlowNodeEdge) brainmodel.ThinkFlowNodeEdge {
	return brainmodel.ThinkFlowNodeEdge{
		ID:           payload.ID,
		BrainID:      brainID,
		ThinkID:      thinkID,
		FromNodeID:   payload.FromNodeID,
		ToNodeID:     payload.ToNodeID,
		Condition:    payload.Condition,
		InputMapping: jsonText(payload.InputMapping),
		Config:       jsonText(payload.Config),
		Status:       payload.Status,
		Sort:         payload.Sort,
	}
}

func (graph runtimeGraph) findThink(id uint64) brainmodel.Think {
	for _, think := range graph.Thinks {
		if think.ID == id {
			return think
		}
	}
	return brainmodel.Think{}
}
