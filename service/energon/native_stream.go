package energon

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
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
	if nativeStreamHasContent(output) || len(botprotocol.ParseToolCalls(output["tool_calls"])) > 0 || output["json"] != nil {
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
	errorCode := providerResponseErrorCode(&botprovider.Response{Body: payload})
	message := "模型服务返回错误，本次生成已停止，请稍后重试"
	if errorCode == "provider_busy" {
		message = "模型服务并发已满，请稍后重试；已完成内容已保留"
	}
	return &nativeStreamError{message: message, code: "provider_error", detail: string(diagnostic), errorCode: errorCode}
}

// 只重试故事来源明确拒绝、且尚无内容或输出用量的请求；中断和未知错误沿原路径上报。
func requestNativeStream(ctx context.Context, client botprovider.StreamClient, request botprovider.Request, stream *nativeOutputStream, retryBusy bool) (*botprovider.Response, error) {
	for attempt := 0; ; attempt++ {
		response, err := client.Stream(ctx, request, stream.Consume)
		if err == nil && response != nil {
			if response.StatusCode < 400 {
				err = stream.ValidateFinal(response.Body)
			} else if providerResponseErrorCode(response) == "provider_busy" {
				err = &nativeStreamError{message: "模型服务并发已满，请稍后重试；已完成内容已保留", code: "provider_error", detail: compactResponseBody(response.Body), errorCode: "provider_busy"}
			}
		}
		var busy interface{ ErrorCode() string }
		if !retryBusy || attempt >= 2 || !errors.As(err, &busy) || busy.ErrorCode() != "provider_busy" || stream.receivedContent || stream.usage.CompletionTokens > 0 || stream.completed {
			return response, err
		}
		delay := time.Duration(attempt+1) * 2 * time.Second
		if err := stream.write(botprotocol.Output{"event": "status", "text": fmt.Sprintf("模型并发繁忙，%d秒后重试（%d/2）", int(delay/time.Second), attempt+1), "meta": map[string]any{"execution_phase": "generating"}}); err != nil {
			return response, err
		}
		timer := time.NewTimer(delay)
		select {
		case <-ctx.Done():
			timer.Stop()
			return response, ctx.Err()
		case <-timer.C:
		}
		stream.outputs = nil
	}
}

func nativeStreamFailureDetail(err error) string {
	var failure *nativeStreamError
	if errors.As(err, &failure) {
		detail, _ := json.Marshal(map[string]string{"code": failure.code, "message": failure.detail})
		return string(detail)
	}
	return err.Error()
}

func (s GatewayService) dispatchStreamPowerTarget(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget) (callResult, error) {
	if botmodel.IsStoryboardGridPower(selected.Power) {
		return s.callStreamStoryboardGrid(ctx, req, selected)
	}
	if shouldPlanContextImages(req, selected.Power) {
		return s.callStreamContextImages(ctx, req, selected)
	}
	return s.callStreamTarget(ctx, req, selected)
}
