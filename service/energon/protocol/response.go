package protocol

import (
	"errors"
	"strings"
)

const (
	ResponseTypeResult = "result"
	ResponseTypeStream = "stream"

	ResponseStatusSuccess = 1
	ResponseStatusFail    = 2
)

type Response struct {
	RequestID string `json:"request_id"`
	Type      string `json:"type"`
	Output    Output `json:"output"`
	Msg       string `json:"msg"`
	Status    int    `json:"status"`
}

func BuildSuccessResponse(requestID string, data any) Response {
	return newResponse(
		requestID,
		ResponseTypeResult,
		ExtractOutput(data),
		"",
		ResponseStatusSuccess,
	)
}

func BuildErrorResponse(requestID string, err error) Response {
	message := ""
	if err != nil {
		message = err.Error()
	}
	output := Output{}
	if code := responseErrorCode(err); code != "" {
		output["error_code"] = code
	}
	return newResponse(
		requestID,
		ResponseTypeResult,
		output,
		message,
		ResponseStatusFail,
	)
}

func (r Response) Payload() map[string]any {
	responseType := strings.TrimSpace(r.Type)
	if responseType == "" {
		responseType = ResponseTypeResult
	}
	status := r.Status
	if status == 0 {
		status = ResponseStatusSuccess
	}
	output := map[string]any{}
	for key, value := range r.Output {
		output[key] = value
	}
	return map[string]any{
		"request_id": r.RequestID,
		"type":       responseType,
		"output":     output,
		"msg":        r.Msg,
		"status":     status,
	}
}

func BuildStreamResponse(requestID string, output Output) Response {
	return newResponse(
		requestID,
		ResponseTypeStream,
		normalizeOutput(output),
		"",
		ResponseStatusSuccess,
	)
}

func BuildStreamErrorResponse(requestID string, err error) Response {
	message := ""
	if err != nil {
		message = err.Error()
	}
	output := Output{
		"event": "status",
		"text":  message,
		"error": message,
	}
	if code := responseErrorCode(err); code != "" {
		output["error_code"] = code
	}
	return newResponse(
		requestID,
		ResponseTypeStream,
		output,
		message,
		ResponseStatusFail,
	)
}

func responseErrorCode(err error) string {
	if err == nil {
		return ""
	}
	var coded interface{ ErrorCode() string }
	if errors.As(err, &coded) {
		return strings.TrimSpace(coded.ErrorCode())
	}
	return ""
}

func newResponse(requestID string, responseType string, output Output, msg string, status int) Response {
	if output == nil {
		output = Output{}
	}
	return Response{
		RequestID: strings.TrimSpace(requestID),
		Type:      strings.TrimSpace(responseType),
		Output:    output,
		Msg:       strings.TrimSpace(msg),
		Status:    status,
	}
}
