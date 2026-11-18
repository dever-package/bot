package test

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botadapters "github.com/dever-package/bot/service/energon/protocol/adapters"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

func openAIImageTaskInput(host string) botprotocol.NativeInput {
	return botprotocol.NativeInput{
		Provider:   botmodel.Provider{Host: host, Protocol: "openai"},
		Account:    botmodel.Account{Key: "image-test-key"},
		Service:    botmodel.Service{Type: "image", Path: "images/tasks"},
		ServiceAPI: "configured-image-model",
		Request: &botprotocol.ShemicRequest{
			RequestID: "image-request-1", Protocol: "openai",
			Input:   map[string]any{"prompt": "A paper boat on a pond", "images": []any{"https://media.example.invalid/reference.png"}},
			Options: map[string]any{"poll_interval_ms": 1, "poll_max_attempts": 3, "stream": true},
		},
	}
}

func TestOpenAIImageTaskLifecycle(t *testing.T) {
	for _, mode := range []string{"stream", "response", "resume"} {
		t.Run(mode, func(t *testing.T) {
			var submits, polls atomic.Int32
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/json")
				if r.Header.Get("Authorization") != "Bearer image-test-key" || r.URL.RawQuery != "region=test" {
					t.Error("authentication or configured query was lost")
				}
				switch {
				case r.Method == http.MethodPost && r.URL.Path == "/gateway/v1/images/tasks":
					submits.Add(1)
					if r.Header.Get("Idempotency-Key") != "image-request-1" {
						t.Error("submission lost stable request identity")
					}
					var body map[string]any
					if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
						t.Error(err)
					}
					want := map[string]any{"model": "configured-image-model", "prompt": "A paper boat on a pond", "images": []any{map[string]any{"image_url": "https://media.example.invalid/reference.png"}}}
					if !reflect.DeepEqual(body, want) {
						t.Errorf("native mapping changed or gateway controls leaked: %#v", body)
					}
					w.WriteHeader(http.StatusAccepted)
					io.WriteString(w, `{"id":"task-1","status":"queued"}`)
				case r.Method == http.MethodGet && r.URL.Path == "/gateway/v1/images/tasks/task-1":
					switch polls.Add(1) {
					case 1:
						io.WriteString(w, `{"status":"queued"}`)
					case 2:
						io.WriteString(w, `{"status":"processing"}`)
					default:
						io.WriteString(w, `{"status":"completed","account":"private account","references":["private reference"],"data":[{"url":"/v1/media/boat.png"}]}`)
					}
				default:
					t.Errorf("unexpected request: %s %s", r.Method, r.URL)
					w.WriteHeader(http.StatusNotFound)
				}
			}))
			defer server.Close()
			input := openAIImageTaskInput(server.URL + "/gateway/v1")
			input.Service.Path += "?region=test"
			adapter := botadapters.OpenAIAdapter{}
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			var statuses []botprotocol.Output
			job := bottask.StreamJob{Input: input, Adapter: adapter, Client: botprovider.NewHTTPClient(time.Second), Request: request, Write: func(o botprotocol.Output) error { statuses = append(statuses, o); return nil }}
			var result bottask.StreamResult
			switch mode {
			case "resume":
				result, err = (bottask.Service{}).ResumePolling(context.Background(), job, "task-1")
			case "stream":
				result, err = (bottask.Service{}).ResolveStream(context.Background(), job)
			case "response":
				var response *botprovider.Response
				response, err = job.Client.Do(context.Background(), request)
				if err != nil {
					t.Fatal(err)
				}
				result.Data, result.Handled, err = (bottask.Service{}).ResolveResponse(context.Background(), bottask.ResponseJob{Input: input, Adapter: adapter, Client: job.Client, Response: response, Write: job.Write})
			}
			if err != nil || !result.Handled {
				t.Fatalf("image task not handled: %#v, %v", result, err)
			}
			want := []string{server.URL + "/v1/media/boat.png"}
			if got := botprotocol.NormalizeMediaList(result.Data, botprotocol.MediaTypeImage); !reflect.DeepEqual(got, want) {
				t.Fatalf("invalid image output: %#v", result.Data)
			}
			data := result.Data.(map[string]any)
			if data["account"] != nil || data["references"] != nil {
				t.Fatal("internal task fields leaked", data)
			}
			wantSubmits := int32(1)
			if mode == "resume" {
				wantSubmits = 0
			}
			if submits.Load() != wantSubmits || polls.Load() != 3 || len(statuses) != 2 {
				t.Fatalf("unexpected lifecycle: %d submissions, %d polls, %#v", submits.Load(), polls.Load(), statuses)
			}
			for i, phase := range []string{"remote_queued", "generating"} {
				meta := statuses[i]["meta"].(map[string]any)
				if meta["remote_task_id"] != "task-1" || meta["execution_phase"] != phase {
					t.Fatal("task identity or progress lost", meta)
				}
			}
		})
	}
}

func TestOpenAIImageTaskFailures(t *testing.T) {
	for _, tc := range []struct {
		name, submission, result, wantError string
		noTask                              bool
	}{
		{name: "missing-id", submission: `{"status":"queued"}`, wantError: "id", noTask: true},
		{name: "invalid-id", submission: `{"id":123}`, wantError: "id", noTask: true},
		{name: "failed", result: `{"status":"failed","error":"generation rejected"}`, wantError: "generation rejected"},
		{name: "unknown-status", result: `{"status":"unknown"}`, wantError: "status"},
		{name: "missing-data", result: `{"status":"completed"}`, wantError: "data"},
		{name: "invalid-item", result: `{"status":"completed","data":[123]}`, wantError: "格式无效"},
		{name: "missing-image", result: `{"status":"completed","data":[{}]}`, wantError: "url 或 b64_json"},
		{name: "invalid-scheme", result: `{"status":"completed","data":[{"url":"file:///tmp/image.png"}]}`, wantError: "HTTP(S)"},
		{name: "cross-origin-relative", result: `{"status":"completed","data":[{"url":"//other.example.invalid/image.png"}]}`, wantError: "同源"},
		{name: "credentials", result: `{"status":"completed","data":[{"url":"https://user:secret@media.example.invalid/image.png"}]}`, wantError: "HTTP(S)"},
		{name: "timeout", result: `{"status":"processing"}`, wantError: "长任务超时"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var submits, polls atomic.Int32
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/json")
				if r.Method == http.MethodPost {
					submits.Add(1)
					if tc.submission != "" {
						io.WriteString(w, tc.submission)
					} else {
						io.WriteString(w, `{"id":"task-1"}`)
					}
				} else {
					polls.Add(1)
					io.WriteString(w, tc.result)
				}
			}))
			defer server.Close()
			input := openAIImageTaskInput(server.URL + "/v1")
			adapter := botadapters.OpenAIAdapter{}
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			result, err := (bottask.Service{}).ResolveStream(context.Background(), bottask.StreamJob{Input: input, Adapter: adapter, Client: botprovider.NewHTTPClient(time.Second), Request: request})
			if err == nil || !strings.Contains(err.Error(), tc.wantError) || !botprotocol.PreventsReplay(err) || result.Data != nil {
				t.Fatalf("failure accepted or replayable: %#v, %v", result, err)
			}
			wantPolls := int32(1)
			if tc.noTask {
				wantPolls = 0
			} else if tc.name == "timeout" {
				wantPolls = 3
			}
			if submits.Load() != 1 || polls.Load() != wantPolls {
				t.Fatalf("submission was repeated or unexpectedly polled: %d, %d", submits.Load(), polls.Load())
			}
		})
	}
}

func TestOpenAIImageTaskConfiguration(t *testing.T) {
	adapter := botadapters.OpenAIAdapter{}
	for _, tc := range []struct {
		kind, path string
		polling    bool
	}{
		{"image", "images/tasks", true},
		{"image", "/v1/images/tasks/", true},
		{"image", "https://provider.example.invalid/gateway/v1/images/tasks?region=test", true},
		{"image", "images/generations", false},
		{"image", "images/edits", false},
		{"image", "myimages/tasks", false},
		{"text", "images/tasks", false},
	} {
		input := openAIImageTaskInput("https://unused.example.invalid")
		input.Service.Type, input.Service.Path = tc.kind, tc.path
		if got := bottask.IsPolling(adapter, input); got != tc.polling {
			t.Errorf("unexpected task selection: %#v = %v", tc, got)
		}
	}
	input := openAIImageTaskInput("https://unused.example.invalid")
	input.Service.Path = "https://provider.example.invalid/custom%2Fgateway/v1/images/tasks/?region=test"
	request, err := adapter.BuildPollRequest(input, "task/one?#")
	if err != nil || request.URL != "https://provider.example.invalid/custom%2Fgateway/v1/images/tasks/task%2Fone%3F%23?region=test" {
		t.Fatalf("task path or ID corrupted: %#v, %v", request, err)
	}
	const encoded = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB"
	data, err := adapter.ResolveTaskResult(context.Background(), input, "task-1", &botprovider.Response{Body: map[string]any{"data": []any{map[string]any{"b64_json": encoded}}}}, nil)
	if err != nil || data.(map[string]any)["data"].([]any)[0].(map[string]any)["b64_json"] != encoded {
		t.Fatalf("base64 result lost: %#v, %v", data, err)
	}
}
