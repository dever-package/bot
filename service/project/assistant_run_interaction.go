package project

import (
	"fmt"
	"strings"
)

type assistantPendingRunInteraction struct {
	RunID       uint64
	NodeRunID   uint64
	ApprovalID  uint64
	Interaction map[string]any
}

func assistantRunReference(status map[string]any) (uint64, string) {
	run := mapValue(status["run"])
	runID := uint64Value(status["run_id"])
	if runID == 0 {
		runID = uint64Value(run["id"])
	}
	return runID, firstText(status["request_id"], run["request_id"])
}

func findAssistantPendingRunInteraction(
	status map[string]any,
	interactionID string,
) (assistantPendingRunInteraction, bool) {
	interactionID = strings.TrimSpace(interactionID)
	runID, _ := assistantRunReference(status)
	for _, raw := range sliceValue(status["interactions"]) {
		row := mapValue(raw)
		interaction := mapValue(row["interaction"])
		currentID := strings.TrimSpace(textValue(interaction["id"]))
		if currentID == "" || (interactionID != "" && currentID != interactionID) {
			continue
		}
		pendingRunID := uint64Value(row["run_id"])
		if pendingRunID == 0 {
			pendingRunID = runID
		}
		return assistantPendingRunInteraction{
			RunID:       pendingRunID,
			NodeRunID:   uint64Value(row["node_run_id"]),
			Interaction: cloneInput(interaction),
		}, true
	}
	for _, raw := range sliceValue(status["approvals"]) {
		row := mapValue(raw)
		approvalID := uint64Value(row["id"])
		if approvalID == 0 ||
			(strings.TrimSpace(textValue(row["status"])) != "pending" &&
				strings.TrimSpace(textValue(row["decision"])) != "pending") {
			continue
		}
		currentID := fmt.Sprintf("team-approval-%d", approvalID)
		if interactionID != "" && currentID != interactionID {
			continue
		}
		pendingRunID := uint64Value(row["run_id"])
		if pendingRunID == 0 {
			pendingRunID = runID
		}
		return assistantPendingRunInteraction{
			RunID:       pendingRunID,
			ApprovalID:  approvalID,
			Interaction: assistantApprovalInteraction(row, currentID),
		}, true
	}
	return assistantPendingRunInteraction{}, false
}

func assistantApprovalInteraction(approval map[string]any, interactionID string) map[string]any {
	content := mapValue(approval["content"])
	return map[string]any{
		"id":           interactionID,
		"type":         "form",
		"presentation": "form",
		"title":        firstText(approval["title"], "人工审核"),
		"description":  firstText(content["description"], content["summary"], content["text"]),
		"fields": []map[string]any{
			{
				"key": "decision", "name": "处理结果", "type": "option", "required": true, "sort": 1,
				"options": []map[string]any{
					{"label": "确认", "value": "approved"},
					{"label": "驳回", "value": "rejected"},
				},
			},
			{
				"key": "comment", "name": "意见", "type": "textarea", "required": false, "sort": 2,
				"placeholder": "可选，填写修改意见",
			},
		},
	}
}

func assistantApprovalResponse(input map[string]any) (string, string, map[string]any, error) {
	data := cloneInput(input)
	decision := strings.ToLower(strings.TrimSpace(textValue(data["decision"])))
	if decision != "approved" && decision != "rejected" {
		return "", "", nil, fmt.Errorf("请明确选择确认或驳回")
	}
	comment := strings.TrimSpace(textValue(data["comment"]))
	delete(data, "decision")
	delete(data, "comment")
	return decision, comment, data, nil
}
