package test

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
)

func TestWritingStreamJSONResponse(t *testing.T) {
	arguments := `{"title":"故事规划","content":"主角抵达小镇"}`
	payload := map[string]any{
		"choices": []any{map[string]any{
			"message": map[string]any{
				"role": "assistant",
				"tool_calls": []any{map[string]any{
					"id": "call_plan", "type": "function",
					"function": map[string]any{"name": "submit_output", "arguments": arguments},
				}},
			},
			"finish_reason": "tool_calls",
		}},
		"usage": map[string]any{"prompt_tokens": 100, "completion_tokens": 25},
	}
	for _, contentType := range []string{"application/json; charset=utf-8", "application/problem+json"} {
		t.Run(contentType, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				if request.Header.Get("Accept") != "text/event-stream" {
					t.Error("request did not ask for streaming")
				}
				writer.Header().Set("Content-Type", contentType)
				encoder := json.NewEncoder(writer)
				encoder.SetIndent("", "  ")
				if err := encoder.Encode(payload); err != nil {
					t.Error(err)
				}
			}))
			defer server.Close()

			chunks := 0
			response, err := botprovider.NewHTTPClient(time.Second).Stream(context.Background(), botprovider.Request{
				Method: http.MethodPost, URL: server.URL, Body: map[string]any{"stream": true},
			}, func(botprovider.StreamChunk) error {
				chunks++
				return nil
			})
			if err != nil {
				t.Fatal(err)
			}
			if chunks != 0 {
				t.Fatalf("complete JSON was split into %d stream fragments", chunks)
			}
			body, ok := response.Body.(map[string]any)
			if !ok || body["usage"] == nil {
				t.Fatalf("final response or usage was lost: %#v", response.Body)
			}
			output := botprotocol.MergeStreamFinal(nil, botprotocol.ExtractOutput(body))
			assertWritingToolArguments(t, output, arguments)
		})
	}
}

func TestWritingStreamCompleteMessage(t *testing.T) {
	arguments := `{"title":"故事规划","content":"主角抵达小镇"}`
	raw, err := json.Marshal(map[string]any{"choices": []any{map[string]any{
		"message": map[string]any{"tool_calls": []any{map[string]any{
			"id": "call_plan", "type": "function",
			"function": map[string]any{"name": "submit_output", "arguments": arguments},
		}}},
		"finish_reason": "tool_calls",
	}}})
	if err != nil {
		t.Fatal(err)
	}
	output := botprotocol.MergeStreamResult([]botprotocol.Output{botprotocol.ExtractStreamOutput(string(raw))})
	assertWritingToolArguments(t, output, arguments)
	if output["finish_reason"] != "tool_calls" {
		t.Fatalf("finish reason was lost: %#v", output)
	}
}

func TestWritingStreamToolFragments(t *testing.T) {
	arguments := `{"title":"故事规划","content":"主角抵达小镇"}`
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "text/event-stream")
		for index, part := range []string{arguments[:16], arguments[16:]} {
			function := map[string]any{"arguments": part}
			call := map[string]any{"index": 0, "function": function}
			if index == 0 {
				call["id"] = "call_plan"
				call["type"] = "function"
				function["name"] = "submit_output"
			}
			raw, _ := json.Marshal(map[string]any{"choices": []any{map[string]any{
				"delta": map[string]any{"tool_calls": []any{call}},
			}}})
			fmt.Fprintf(writer, "data: %s\n\n", raw)
		}
		fmt.Fprint(writer, "data: {\"choices\":[{\"delta\":{},\"finish_reason\":\"tool_calls\"}]}\n\ndata: [DONE]\n\n")
	}))
	defer server.Close()
	var outputs []botprotocol.Output
	response, err := botprovider.NewHTTPClient(time.Second).Stream(context.Background(), botprovider.Request{
		Method: http.MethodPost, URL: server.URL, Body: map[string]any{"stream": true},
	}, func(chunk botprovider.StreamChunk) error {
		outputs = append(outputs, botprotocol.ExtractStreamOutput(chunk.Data))
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	output := botprotocol.MergeStreamFinal(outputs, botprotocol.ExtractOutput(response.Body))
	assertWritingToolArguments(t, output, arguments)
	if output["finish_reason"] != "tool_calls" {
		t.Fatalf("finish reason was lost: %#v", output)
	}
}

func assertWritingToolArguments(t *testing.T, output botprotocol.Output, arguments string) {
	t.Helper()
	calls := botprotocol.ParseToolCalls(output["tool_calls"])
	if len(calls) != 1 || calls[0].Name != "submit_output" || calls[0].Arguments != arguments {
		t.Fatalf("tool call was lost or duplicated: %#v", calls)
	}
}
