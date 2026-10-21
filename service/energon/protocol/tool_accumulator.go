package protocol

import "bytes"

// ToolCallAccumulator keeps positional deltas without copying the accumulated
// arguments on every frame. Snapshot returns independent, immutable calls.
type ToolCallAccumulator struct {
	calls []accumulatedToolCall
}

type accumulatedToolCall struct {
	call      ToolCall
	arguments []byte
}

func (accumulator *ToolCallAccumulator) Append(fragments []ToolCall) {
	for _, fragment := range fragments {
		position := -1
		for index, current := range accumulator.calls {
			if fragment.ID != "" && current.call.ID == fragment.ID || fragment.Index >= 0 && current.call.Index == fragment.Index {
				position = index
				break
			}
		}
		if position < 0 {
			arguments := []byte(fragment.Arguments)
			fragment.Arguments = ""
			accumulator.calls = append(accumulator.calls, accumulatedToolCall{call: fragment, arguments: arguments})
			continue
		}
		current := &accumulator.calls[position]
		if fragment.ID != "" {
			current.call.ID = fragment.ID
		}
		if fragment.Type != "" {
			current.call.Type = fragment.Type
		}
		current.call.Name = mergeToolCallName(current.call.Name, fragment.Name)
		// A full snapshot may extend the current prefix. Equal snapshots are
		// ignored, but repeated suffix deltas (including JSON closers) append.
		if fragment.Arguments == "" {
			continue
		}
		if len(fragment.Arguments) >= len(current.arguments) && bytes.Equal([]byte(fragment.Arguments[:len(current.arguments)]), current.arguments) {
			current.arguments = append(current.arguments, fragment.Arguments[len(current.arguments):]...)
			continue
		}
		current.arguments = append(current.arguments, fragment.Arguments...)
	}
}

func (accumulator *ToolCallAccumulator) ArgumentBytes() int {
	size := 0
	for _, current := range accumulator.calls {
		size += len(current.arguments)
	}
	return size
}

func (accumulator *ToolCallAccumulator) Snapshot() []ToolCall {
	if len(accumulator.calls) == 0 {
		return nil
	}
	result := make([]ToolCall, 0, len(accumulator.calls))
	for _, current := range accumulator.calls {
		call := current.call
		call.Arguments = string(current.arguments)
		result = append(result, call)
	}
	return result
}
