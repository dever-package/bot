package stream

import (
	"fmt"
	"strings"

	botprotocol "my/package/bot/service/energon/protocol"
	bottask "my/package/bot/service/energon/task"
	frontstream "my/package/front/service/stream"
)

const Namespace = "energon"

type Entry = frontstream.Entry

func Key(requestID string) string {
	return frontstream.StreamKey(Namespace, requestID)
}

func FrameType(frame map[string]any) string {
	return strings.ToLower(strings.TrimSpace(frontstream.InputText(frame["type"])))
}

func FrameOutput(frame map[string]any) botprotocol.Output {
	if frame == nil {
		return botprotocol.Output{}
	}
	if output, ok := frame["output"].(botprotocol.Output); ok {
		return output
	}
	if output, ok := frame["output"].(map[string]any); ok {
		return botprotocol.Output(output)
	}
	return botprotocol.Output{}
}

func OutputEvent(output botprotocol.Output) string {
	if output == nil {
		return ""
	}
	return strings.ToLower(strings.TrimSpace(frontstream.InputText(output["event"])))
}

func HasEnd(outputs []botprotocol.Output) bool {
	for _, output := range outputs {
		if fmt.Sprint(output["event"]) == "end" {
			return true
		}
	}
	return false
}

func SupportsCancel(adapter botprotocol.Adapter, input botprotocol.NativeInput) bool {
	if cancelSupport, ok := adapter.(bottask.CancelSupportAdapter); ok {
		if cancelSupport.SupportsCancel(input) {
			return true
		}
	}
	if taskAdapter, ok := adapter.(bottask.StreamTaskAdapter); ok {
		_, ok := taskAdapter.StreamTaskSpec(input)
		return ok
	}
	return false
}

func CancelableMeta(cancelable bool) map[string]any {
	return map[string]any{"cancelable": cancelable}
}
