package energon

import (
	"encoding/json"
	"errors"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
)

// 同一原生请求的预览、最终输出和用量共用已解析分片与工具累积结果。
type nativeOutputStream struct {
	outputs         []botprotocol.Output
	usage           tokenUsage
	tools           botprotocol.ToolCallAccumulator
	progress        *powerOutputStreamProgress
	write           func(botprotocol.Output) error
	decoder         botprotocol.StreamOutputDecoder
	completed       bool
	finishReason    string
	receivedContent bool
}

func (stream *nativeOutputStream) Consume(chunk botprovider.StreamChunk) error {
	decode := botprotocol.DecodeStreamOutput
	if stream.decoder != nil {
		decode = stream.decoder.DecodeStreamOutput
	}
	output, payload := decode(chunk.Data)
	usagePayload, _ := payload.(map[string]any)
	stream.usage = stream.usage.Prefer(extractTokenUsageMap(usagePayload))
	if err := nativeStreamPayloadError(chunk.Event, payload, chunk.Data); err != nil {
		return err
	}
	if reason := strings.TrimSpace(botprotocol.AsText(output["finish_reason"])); reason != "" {
		stream.finishReason = reason
	}
	if botprotocol.AsText(output["event"]) == "end" || stream.finishReason != "" {
		stream.completed = true
	}
	if len(output) == 0 {
		return nil
	}
	if stream.decoder != nil && nativeStreamHasContent(output) {
		stream.receivedContent = true
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

func (stream *nativeOutputStream) MergeFinal(body any) botprotocol.Output {
	extract := botprotocol.ExtractOutput
	if stream.decoder != nil {
		extract = stream.decoder.ExtractStreamFinal
	}
	final := extract(body)
	if stream.progress != nil {
		return stream.progress.MergeFinal(stream.outputs, final)
	}
	return botprotocol.MergeStreamFinalWithTools(stream.outputs, final, &stream.tools)
}

// 仅声明了原生 chat decoder 的协议要求其完成边界；通用媒体流保留自身合同。
func (stream *nativeOutputStream) ValidateFinal(body any) error {
	if err := nativeStreamPayloadError("", body, ""); err != nil {
		return err
	}
	if stream.decoder == nil {
		return nil
	}
	if body != nil {
		final := stream.decoder.ExtractStreamFinal(body)
		if nativeStreamHasContent(final) || strings.TrimSpace(botprotocol.AsText(final["finish_reason"])) != "" {
			return nil
		}
	}
	if stream.completed && (stream.receivedContent || stream.finishReason != "") {
		return nil
	}
	if !stream.receivedContent {
		return &nativeStreamError{message: "模型服务未返回有效内容，请重试", code: "empty_stream"}
	}
	return &nativeStreamError{message: "模型服务输出中断，本次生成已停止，请重试", code: "incomplete_stream"}
}

func nativeStreamHasContent(output botprotocol.Output) bool {
	return hasGeneralTextOutputContent(output) ||
		strings.TrimSpace(botprotocol.AsText(output["reasoning"])) != "" ||
		strings.TrimSpace(botprotocol.AsText(output["refusal"])) != ""
}

// 对外只给安全且可操作的原因；原始供应方错误仅进入内部调用日志。
type nativeStreamError struct {
	message   string
	code      string
	detail    string
	errorCode string
}

func (err *nativeStreamError) Error() string { return err.message }

func (err *nativeStreamError) ErrorCode() string { return err.errorCode }

func nativeStreamPayloadError(event string, payload any, raw string) error {
	mapped, _ := payload.(map[string]any)
	failure, exists := mapped["error"]
	if (!exists || failure == nil) && !strings.EqualFold(strings.TrimSpace(event), "error") {
		return nil
	}
	diagnostic, _ := json.Marshal(payload)
	if payload == nil {
		diagnostic = []byte(raw)
	}
	return &nativeStreamError{message: "模型服务返回错误，本次生成已停止，请稍后重试", code: "provider_error", detail: string(diagnostic), errorCode: providerResponseErrorCode(&botprovider.Response{Body: payload})}
}

func nativeStreamFailureDetail(err error) string {
	var failure *nativeStreamError
	if errors.As(err, &failure) {
		detail, _ := json.Marshal(map[string]string{"code": failure.code, "message": failure.detail})
		return string(detail)
	}
	return err.Error()
}
