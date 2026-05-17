package protocol

import (
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
	return newResponse(
		requestID,
		ResponseTypeResult,
		Output{},
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
	output := Output{}
	if r.Output != nil {
		output = r.Output
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
	return newResponse(
		requestID,
		ResponseTypeStream,
		Output{
			"event": "status",
			"text":  message,
			"error": message,
		},
		message,
		ResponseStatusFail,
	)
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
