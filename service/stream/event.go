package stream

import (
	"context"
	"strings"
	"time"

	frontstream "github.com/dever-package/front/service/stream"
)

const (
	FeaturePower   = "power"
	FeatureAgent   = "agent"
	FeatureTeam    = "team"
	FeatureFlow    = "flow"
	FeatureUpload  = "upload"
	FeatureSkill   = "skill"
	FeatureEnergon = "energon"

	EventTypeLifecycle = "lifecycle"
	EventTypeProgress  = "progress"
	EventTypeOutput    = "output"
	EventTypeResult    = "result"
	EventTypeEdge      = "edge"
	EventTypeWaiting   = "waiting"

	EventStart          = "start"
	EventProgress       = "progress"
	EventStatus         = "status"
	EventWarning        = "warning"
	EventDelta          = "delta"
	EventResult         = "result"
	EventCancel         = "cancel"
	EventRunStarted     = "run_started"
	EventRunFinished    = "run_finished"
	EventFlowStarted    = "flow_started"
	EventFlowFinished   = "flow_finished"
	EventNodeStarted    = "node_started"
	EventNodeOutput     = "node_output"
	EventNodeFinished   = "node_finished"
	EventEdgeActive     = "edge_active"
	EventWaiting        = "waiting"
	EventResultCreated  = "result_created"
	EventResultProgress = "result_progress"
	EventTaskProgress   = "task_progress"
	EventTaskDone       = "task_done"
)

var lifecycleEvents = map[string]struct{}{
	EventStart:        {},
	EventStatus:       {},
	EventWarning:      {},
	EventCancel:       {},
	EventRunStarted:   {},
	EventRunFinished:  {},
	EventFlowStarted:  {},
	EventFlowFinished: {},
	EventNodeStarted:  {},
	EventNodeFinished: {},
}

func Output(feature string, event string, fields map[string]any) map[string]any {
	now := time.Now()
	output := map[string]any{
		"feature":    NormalizeFeature(feature),
		"event":      NormalizeEvent(event),
		"event_type": EventType(event),
		"meta": map[string]any{
			"emitted_at":    now.Format(time.RFC3339Nano),
			"emitted_at_ms": now.UnixMilli(),
		},
	}
	for key, value := range fields {
		if key == "" || value == nil {
			continue
		}
		if key == "meta" {
			mergeMeta(output, value)
			continue
		}
		output[key] = value
	}
	return NormalizeOutput(feature, output)
}

func Payload(requestID string, feature string, event string, fields map[string]any) map[string]any {
	return frontstream.ResponsePayload(requestID, "stream", Output(feature, event, fields), "", 1)
}

func ResultPayload(requestID string, output map[string]any, msg string, status int) map[string]any {
	return frontstream.ResponsePayload(requestID, "result", output, msg, status)
}

func Write(ctx context.Context, store frontstream.Service, requestID string, feature string, event string, fields map[string]any) error {
	_, err := store.WritePayload(ctx, requestID, Payload(requestID, feature, event, fields))
	return err
}

func WriteResult(ctx context.Context, store frontstream.Service, requestID string, output map[string]any, msg string, status int) error {
	_, err := store.WritePayload(ctx, requestID, ResultPayload(requestID, output, msg, status))
	return err
}

func NormalizeOutput(feature string, output map[string]any) map[string]any {
	if output == nil {
		output = map[string]any{}
	}
	if normalized := NormalizeFeature(output["feature"]); normalized != "" {
		output["feature"] = normalized
	} else if normalized = NormalizeFeature(feature); normalized != "" {
		output["feature"] = normalized
	}
	event := NormalizeEvent(output["event"])
	if event != "" {
		output["event"] = event
	}
	if text := strings.TrimSpace(frontstream.InputText(output["event_type"])); text == "" {
		output["event_type"] = EventType(event)
	}
	return output
}

func NormalizePayload(feature string, payload map[string]any) map[string]any {
	if payload == nil {
		return payload
	}
	output, ok := payload["output"].(map[string]any)
	if !ok {
		return payload
	}
	payload["output"] = NormalizeOutput(feature, output)
	return payload
}

func NormalizeFeature(value any) string {
	text := strings.ToLower(strings.TrimSpace(frontstream.InputText(value)))
	switch text {
	case "ability":
		return FeaturePower
	default:
		return text
	}
}

func NormalizeEvent(value any) string {
	return strings.ToLower(strings.TrimSpace(frontstream.InputText(value)))
}

func EventType(event string) string {
	event = NormalizeEvent(event)
	if event == "" {
		return EventTypeLifecycle
	}
	if _, ok := lifecycleEvents[event]; ok {
		return EventTypeLifecycle
	}
	switch event {
	case EventProgress, EventResultProgress, EventTaskProgress:
		return EventTypeProgress
	case EventDelta, EventNodeOutput:
		return EventTypeOutput
	case EventResult, EventResultCreated, EventTaskDone:
		return EventTypeResult
	case EventEdgeActive:
		return EventTypeEdge
	case EventWaiting:
		return EventTypeWaiting
	default:
		return EventTypeLifecycle
	}
}

func mergeMeta(output map[string]any, value any) {
	next, ok := value.(map[string]any)
	if !ok {
		output["meta"] = value
		return
	}
	current, ok := output["meta"].(map[string]any)
	if !ok {
		current = map[string]any{}
		output["meta"] = current
	}
	for key, item := range next {
		if key == "" || item == nil {
			continue
		}
		current[key] = item
	}
}
