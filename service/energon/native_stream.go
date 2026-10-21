package energon

import (
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
)

// 同一原生请求的预览、最终输出和用量共用已解析分片与工具累积结果。
type nativeOutputStream struct {
	outputs  []botprotocol.Output
	usage    tokenUsage
	tools    botprotocol.ToolCallAccumulator
	progress *powerOutputStreamProgress
	write    func(botprotocol.Output) error
}

func (stream *nativeOutputStream) Consume(chunk botprovider.StreamChunk) error {
	output, payload := botprotocol.DecodeStreamOutput(chunk.Data)
	usagePayload, _ := payload.(map[string]any)
	stream.usage = stream.usage.Prefer(extractTokenUsageMap(usagePayload))
	if len(output) == 0 {
		return nil
	}
	botprotocol.StripOutputProgress(output)
	stream.outputs = append(stream.outputs, output)
	if stream.progress == nil {
		stream.tools.Append(botprotocol.ParseToolCalls(output["tool_calls"]))
	}
	return stream.write(output)
}

func (stream *nativeOutputStream) Flush() error {
	if preview, changed := stream.progress.Flush(); changed {
		return stream.write(preview)
	}
	return nil
}

func (stream *nativeOutputStream) MergeFinal(final botprotocol.Output) botprotocol.Output {
	if stream.progress != nil {
		return stream.progress.MergeFinal(stream.outputs, final)
	}
	return botprotocol.MergeStreamFinalWithTools(stream.outputs, final, &stream.tools)
}
