package team

import (
	"context"
	"fmt"

	teammodel "github.com/dever-package/bot/model/team"
	energonservice "github.com/dever-package/bot/service/energon"
	"github.com/dever-package/bot/service/stream"
)

func (s Service) runPowerNode(
	ctx context.Context,
	run teammodel.Run,
	flowRun teammodel.FlowRun,
	flow teammodel.Flow,
	node teammodel.FlowNode,
	config map[string]any,
	input map[string]any,
) (map[string]any, string, uint64, error) {
	nodeRun := s.repo.FindNodeRunByNode(ctx, flowRun.ID, node.ID)
	if nodeRun == nil {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("能力节点运行记录不存在")
	}
	power, ok := s.repo.FindPowerOption(ctx, firstUint64(node.PowerID, uint64Value(config["power_id"])), firstText(config["power_key"], config["power"]))
	if !ok {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("能力节点未绑定有效能力: %s", node.Name)
	}

	response := jsonMap(nodeRun.InteractionResponse)
	values := powerNodeValues(config, input, response)
	targetID := firstUint64(
		uint64Value(response["source_target_id"]),
		uint64Value(response["sourceTargetId"]),
		uint64Value(config["source_target_id"]),
		uint64Value(input["source_target_id"]),
	)
	form, err := s.gateway.PowerParamConfig(ctx, power.Key, targetID)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	targetID = form.SelectedTargetID
	values, missing := energonservice.PreparePowerParamInput(values, form.Params)
	if len(missing) > 0 {
		interaction := map[string]any{
			"id":               fmt.Sprintf("team-power-%d", nodeRun.ID),
			"type":             "power_params",
			"title":            node.Name,
			"power":            power.Key,
			"values":           values,
			"fields":           form.Params,
			"sources":          form.Sources,
			"missing":          missing,
			"source_target_id": targetID,
		}
		s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
			"interaction":          jsonText(interaction),
			"interaction_response": "{}",
		})
		return map[string]any{
			"interaction": interaction,
			"pending":     true,
		}, teammodel.RunStatusWaiting, 0, runWaitError{message: "等待能力参数"}
	}

	requestID := newRequestID()
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
		"child_request_id":     requestID,
		"interaction":          "{}",
		"interaction_response": "{}",
	})
	nodeRun.ChildRequestID = requestID
	billing := runBillingContext(run)
	billing.RunID = run.ID
	output, err := s.executePower(ctx, requestID, power, values, targetID, billing, func(payload map[string]any) {
		streamOutput := mapValue(payload["output"])
		if len(streamOutput) == 0 {
			return
		}
		s.writeNodeEvent(context.WithoutCancel(ctx), run, flowRun, flow, node, *nodeRun, stream.EventNodeOutput, map[string]any{
			"output":           streamOutput,
			"child_request_id": requestID,
		})
	})
	if err != nil {
		return output, teammodel.RunStatusFail, 0, err
	}
	return map[string]any{
		"power":            power.Key,
		"params":           values,
		"source_target_id": targetID,
		"request_id":       requestID,
		"output":           output,
	}, teammodel.RunStatusSuccess, 0, nil
}

func powerNodeValues(config map[string]any, input map[string]any, response map[string]any) map[string]any {
	values := mergeMaps(input, mapValue(config["input"]))
	values = mergeMaps(values, mapValue(config["params"]))
	values = mergeMaps(values, mapValue(config["values"]))
	if params := mapValue(response["params"]); len(params) > 0 {
		return mergeMaps(values, params)
	}
	return mergeMaps(values, response)
}
