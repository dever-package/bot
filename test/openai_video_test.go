package test

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
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

func openAIVideoInput(host string) botprotocol.NativeInput {
	return botprotocol.NativeInput{
		Provider:   botmodel.Provider{Host: host, Protocol: "openai"},
		Account:    botmodel.Account{Key: "video-test-key"},
		Service:    botmodel.Service{Type: "video", Path: "videos/generations"},
		ServiceAPI: "grok-imagine-video-1.5",
		Request: &botprotocol.ShemicRequest{
			RequestID: "video-request-1", Protocol: "openai",
			Input:   map[string]any{"prompt": "A paper boat drifting on a pond", "duration": 6, "resolution": "720p", "aspect_ratio": "9:16", "generate_audio": true},
			Options: map[string]any{"poll_interval_ms": 1, "poll_max_attempts": 3, "stream": true},
		},
	}
}

func TestOpenAIVideoPolling(t *testing.T) {
	for _, mode := range []string{"stream", "response"} {
		t.Run(mode, func(t *testing.T) {
			var submits, polls atomic.Int32
			const videoURL = "https://media.example.invalid/generated.mp4"
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/json")
				if r.Header.Get("Authorization") != "Bearer video-test-key" || r.URL.RawQuery != "region=test" {
					t.Error("configured authentication or query was lost")
				}
				switch {
				case r.Method == http.MethodPost && r.URL.Path == "/gateway/v1/videos/generations":
					submits.Add(1)
					var body map[string]any
					if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
						t.Error(err)
					}
					want := map[string]any{"model": "grok-imagine-video-1.5", "prompt": "A paper boat drifting on a pond", "duration": float64(6), "resolution": "720p", "aspect_ratio": "9:16", "generate_audio": true}
					if !reflect.DeepEqual(body, want) {
						t.Errorf("native parameters changed or gateway controls leaked: %#v", body)
					}
					io.WriteString(w, `{"request_id":"task-1"}`)
				case r.Method == http.MethodGet && r.URL.Path == "/gateway/v1/videos/task-1":
					if polls.Add(1) == 1 {
						io.WriteString(w, `{"status":"pending"}`)
					} else {
						json.NewEncoder(w).Encode(map[string]any{"status": "done", "model": "grok-imagine-video-1.5", "video": map[string]any{"url": videoURL, "duration": 6, "respect_moderation": true}})
					}
				default:
					t.Errorf("unexpected request: %s %s", r.Method, r.URL)
					w.WriteHeader(http.StatusNotFound)
				}
			}))
			defer server.Close()
			input := openAIVideoInput(server.URL + "/gateway/v1")
			input.Service.Path += "?region=test"
			adapter := botadapters.OpenAIAdapter{}
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			client := botprovider.NewHTTPClient(time.Second)
			var statuses []botprotocol.Output
			write := func(output botprotocol.Output) error { statuses = append(statuses, output); return nil }
			var data any
			if mode == "stream" {
				result, err := (bottask.Service{}).ResolveStream(context.Background(), bottask.StreamJob{Input: input, Adapter: adapter, Client: client, Request: request, Write: write})
				if err != nil || !result.Handled {
					t.Fatalf("video task was not handled: %v, %#v", err, result)
				}
				data = result.Data
			} else {
				response, err := client.Do(context.Background(), request)
				if err != nil {
					t.Fatal(err)
				}
				var handled bool
				data, handled, err = (bottask.Service{}).ResolveResponse(context.Background(), bottask.ResponseJob{Input: input, Adapter: adapter, Client: client, Response: response, Write: write})
				if err != nil || !handled {
					t.Fatalf("video response was not handled: %v", err)
				}
			}
			if got := botprotocol.NormalizeMediaList(data, botprotocol.MediaTypeVideo); !reflect.DeepEqual(got, []string{videoURL}) {
				t.Fatalf("video was not normalized: %#v", data)
			}
			if submits.Load() != 1 || polls.Load() != 2 || len(statuses) != 1 {
				t.Fatalf("unexpected lifecycle: %d submissions, %d polls, %#v", submits.Load(), polls.Load(), statuses)
			}
			meta := statuses[0]["meta"].(map[string]any)
			if meta["remote_task_id"] != "task-1" || meta["execution_phase"] != "generating" {
				t.Fatal("pending result lost task identity or generation status", meta)
			}
		})
	}
}

func TestOpenAIVideoFailuresAndResume(t *testing.T) {
	for _, tc := range []struct {
		name, submission, result, wantError string
		resume                              bool
		httpStatus                          int
		wantPolls                           int32
	}{
		{name: "resume", resume: true, result: `{"status":"done","video":{"url":"https://media.example.invalid/video.mp4"}}`, wantPolls: 1},
		{name: "missing-id", submission: `{}`, wantError: "request_id"},
		{name: "invalid-id", submission: `{"request_id":123}`, wantError: "request_id"},
		{name: "failed", result: `{"status":"failed","error":{"code":"invalid_argument","message":"Prompt cannot be empty"}}`, wantError: "Prompt cannot be empty", wantPolls: 1},
		{name: "missing-status", result: `{}`, wantError: "status", wantPolls: 1},
		{name: "unknown-status", result: `{"status":"unknown"}`, wantError: "unknown", wantPolls: 1},
		{name: "missing-video", result: `{"status":"done"}`, wantError: "video.url", wantPolls: 1},
		{name: "invalid-video", result: `{"status":"done","video":{"url":123}}`, wantError: "video.url", wantPolls: 1},
		{name: "moderation", result: `{"status":"done","video":{"url":"https://media.example.invalid/video.mp4","respect_moderation":false}}`, wantError: "来源内容审核", wantPolls: 1},
		{name: "poll-auth", result: `{"error":{"message":"Invalid API key"}}`, httpStatus: http.StatusUnauthorized, wantError: "401", wantPolls: 1},
		{name: "timeout", result: `{"status":"pending"}`, wantError: "长任务超时: task-1", wantPolls: 3},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var submits, polls atomic.Int32
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/json")
				switch r.Method {
				case http.MethodPost:
					submits.Add(1)
					if tc.submission != "" {
						io.WriteString(w, tc.submission)
					} else {
						io.WriteString(w, `{"request_id":"task-1"}`)
					}
				case http.MethodGet:
					polls.Add(1)
					if r.URL.Path != "/v1/videos/task-1" {
						t.Errorf("incorrect polling path: %s", r.URL)
					}
					if tc.httpStatus != 0 {
						w.WriteHeader(tc.httpStatus)
					}
					io.WriteString(w, tc.result)
				default:
					t.Errorf("unexpected method: %s", r.Method)
				}
			}))
			defer server.Close()
			input := openAIVideoInput(server.URL + "/v1")
			adapter := botadapters.OpenAIAdapter{}
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			job := bottask.StreamJob{Input: input, Adapter: adapter, Client: botprovider.NewHTTPClient(time.Second), Request: request}
			var result bottask.StreamResult
			if tc.resume {
				result, err = (bottask.Service{}).ResumePolling(context.Background(), job, "task-1")
			} else {
				result, err = (bottask.Service{}).ResolveStream(context.Background(), job)
			}
			if tc.wantError == "" {
				if err != nil || len(botprotocol.NormalizeMediaList(result.Data, botprotocol.MediaTypeVideo)) != 1 {
					t.Fatalf("resume failed: %#v, %v", result, err)
				}
			} else if err == nil || !strings.Contains(err.Error(), tc.wantError) || result.Data != nil {
				t.Fatalf("failure was hidden: %#v, %v", result, err)
			}
			if err != nil && !botprotocol.PreventsReplay(err) {
				t.Fatalf("accepted or ambiguous submission allowed gateway failover/replay: %v", err)
			}
			wantSubmits := int32(1)
			if tc.resume {
				wantSubmits = 0
			}
			if submits.Load() != wantSubmits || polls.Load() != tc.wantPolls {
				t.Fatalf("incorrect IO/replay: %d submissions, %d polls", submits.Load(), polls.Load())
			}
		})
	}
}

func TestOpenAIVideoCancelPolling(t *testing.T) {
	var submits, polls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodPost {
			submits.Add(1)
			io.WriteString(w, `{"request_id":"task-1"}`)
		} else {
			polls.Add(1)
			io.WriteString(w, `{"status":"pending"}`)
		}
	}))
	defer server.Close()
	input := openAIVideoInput(server.URL + "/v1")
	input.Request.Options["poll_interval_ms"] = 60000
	adapter := botadapters.OpenAIAdapter{}
	request, err := adapter.BuildNativeRequest(input)
	if err != nil {
		t.Fatal(err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	_, err = (bottask.Service{}).ResolveStream(ctx, bottask.StreamJob{
		Input: input, Adapter: adapter, Client: botprovider.NewHTTPClient(time.Second), Request: request,
		Write: func(botprotocol.Output) error { cancel(); return nil },
	})
	if !errors.Is(err, context.Canceled) || submits.Load() != 1 || polls.Load() != 1 {
		t.Fatalf("polling did not stop promptly: %v, %d submissions, %d polls", err, submits.Load(), polls.Load())
	}
}

func TestOpenAIVideoEndpointSelection(t *testing.T) {
	adapter := botadapters.OpenAIAdapter{}
	for _, tc := range []struct {
		kind, path string
		polling    bool
	}{
		{"video", "videos/generations", true},
		{"video", "/v1/videos/generations/", true},
		{"video", "https://provider.example.invalid/custom/v1/videos/generations?region=test", true},
		{"video", "videos/render", false},
		{"video", "videos", true},
		{"video", "/v1/videos/", true},
		{"video", "https://provider.example.invalid/gateway/v1/videos?region=test", true},
		{"video", "myvideos", false},
		{"video", "myvideos/generations", false},
		{"image", "videos/generations", false},
		{"image", "images/generations", false},
		{"audio", "audio/speech", false},
		{"text", "chat/completions", false},
		{"text", "", false},
	} {
		t.Run(tc.kind+"/"+tc.path, func(t *testing.T) {
			input := openAIVideoInput("https://base.example.invalid/v1")
			input.Service.Type, input.Service.Path = tc.kind, tc.path
			if got := bottask.IsPolling(adapter, input); got != tc.polling {
				t.Fatalf("unexpected polling selection for %s %s: %v", tc.kind, tc.path, got)
			}
			if !tc.polling && tc.kind != "text" {
				spec, ok := adapter.StreamTaskSpec(input)
				if !ok || spec.Kind != bottask.StreamKindRequest || !spec.PlainRequest {
					t.Fatal("configured synchronous media behavior changed", spec)
				}
			}
		})
	}
	input := openAIVideoInput("https://unused.example.invalid")
	input.Service.Path = "https://provider.example.invalid/custom%2Fgateway/v1/videos/generations/?region=test"
	request, err := adapter.BuildPollRequest(input, "task/one?#")
	if err != nil {
		t.Fatal(err)
	}
	if request.URL != "https://provider.example.invalid/custom%2Fgateway/v1/videos/task%2Fone%3F%23?region=test" || request.Method != http.MethodGet || request.Headers["Authorization"] != "Bearer video-test-key" {
		t.Fatalf("configured URL or opaque task ID was corrupted: %#v", request)
	}
}

func TestOpenAIVideoIDTasks(t *testing.T) {
	for _, tc := range []struct {
		name, submission, result, wantError string
		resume                              bool
		wantPolls                           int32
	}{
		{name: "relative-completed", result: `{"status":"completed","result":{"url":"/v1/media/clip.mp4"}}`, wantPolls: 3},
		{name: "absolute-succeeded", result: `{"status":"succeeded","result":{"url":"https://media.example.invalid/video.mp4"}}`, wantPolls: 3},
		{name: "resume", resume: true, result: `{"status":"completed","result":{"url":"/v1/media/clip.mp4"}}`, wantPolls: 3},
		{name: "missing-id", submission: `{"request_id":"task-1"}`, wantError: "id"},
		{name: "invalid-id", submission: `{"id":123}`, wantError: "id"},
		{name: "failed", result: `{"status":"failed","error":"generation rejected"}`, wantError: "generation rejected", wantPolls: 3},
		{name: "unknown-status", result: `{"status":"unknown"}`, wantError: "unknown", wantPolls: 3},
		{name: "missing-result", result: `{"status":"completed"}`, wantError: "result.url", wantPolls: 3},
		{name: "invalid-result", result: `{"status":"completed","result":{"url":123}}`, wantError: "result.url", wantPolls: 3},
		{name: "cross-origin-relative", result: `{"status":"completed","result":{"url":"//other.example.invalid/video.mp4"}}`, wantError: "同源", wantPolls: 3},
		{name: "credentials-in-url", result: `{"status":"completed","result":{"url":"https://user:secret@media.example.invalid/video.mp4"}}`, wantError: "HTTP(S)", wantPolls: 3},
		{name: "invalid-scheme", result: `{"status":"completed","result":{"url":"file:///tmp/video.mp4"}}`, wantError: "HTTP(S)", wantPolls: 3},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var submits, polls atomic.Int32
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/json")
				if r.Header.Get("Authorization") != "Bearer video-test-key" || r.URL.RawQuery != "region=test" {
					t.Error("configured authentication or query was lost")
				}
				switch {
				case r.Method == http.MethodPost && r.URL.Path == "/gateway/v1/videos":
					submits.Add(1)
					var body map[string]any
					if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
						t.Error(err)
					}
					if body["model"] != "muse-video" || body["duration"] != float64(6) || body["image"] != "https://media.example.invalid/frame.png" || body["stream"] != nil || body["poll_max_attempts"] != nil {
						t.Errorf("native media parameters changed or gateway controls leaked: %#v", body)
					}
					if tc.submission != "" {
						io.WriteString(w, tc.submission)
					} else {
						io.WriteString(w, `{"id":"task/one?#","status":"queued"}`)
					}
				case r.Method == http.MethodGet && r.URL.EscapedPath() == "/gateway/v1/videos/task%2Fone%3F%23":
					switch polls.Add(1) {
					case 1:
						io.WriteString(w, `{"status":"queued"}`)
					case 2:
						io.WriteString(w, `{"status":"processing"}`)
					default:
						io.WriteString(w, tc.result)
					}
				default:
					t.Errorf("unexpected request: %s %s", r.Method, r.URL)
					w.WriteHeader(http.StatusNotFound)
				}
			}))
			defer server.Close()
			input := openAIVideoInput(server.URL + "/gateway/v1")
			input.Service.Path = "videos?region=test"
			input.ServiceAPI = "muse-video"
			input.Request.Input = map[string]any{"prompt": "A paper boat drifting on a pond", "duration": 6, "size": "16:9", "image": "https://media.example.invalid/frame.png"}
			adapter := botadapters.OpenAIAdapter{}
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			job := bottask.StreamJob{Input: input, Adapter: adapter, Client: botprovider.NewHTTPClient(time.Second), Request: request}
			var result bottask.StreamResult
			if tc.resume {
				result, err = (bottask.Service{}).ResumePolling(context.Background(), job, "task/one?#")
			} else {
				result, err = (bottask.Service{}).ResolveStream(context.Background(), job)
			}
			if tc.wantError != "" {
				if err == nil || !strings.Contains(err.Error(), tc.wantError) || !botprotocol.PreventsReplay(err) || result.Data != nil {
					t.Fatalf("invalid task result allowed success/replay: %#v, %v", result, err)
				}
			} else {
				wantURL := server.URL + "/v1/media/clip.mp4"
				if tc.name == "absolute-succeeded" {
					wantURL = "https://media.example.invalid/video.mp4"
				}
				if err != nil || !reflect.DeepEqual(botprotocol.NormalizeMediaList(result.Data, botprotocol.MediaTypeVideo), []string{wantURL}) {
					t.Fatalf("video output was not normalized: %#v, %v", result, err)
				}
			}
			wantSubmits := int32(1)
			if tc.resume {
				wantSubmits = 0
			}
			if submits.Load() != wantSubmits || polls.Load() != tc.wantPolls {
				t.Fatalf("incorrect IO/replay: %d submissions, %d polls", submits.Load(), polls.Load())
			}
		})
	}
}

func TestOpenAIVideoPreservesExistingRequests(t *testing.T) {
	for _, tc := range []struct {
		kind, path, response, want string
	}{
		{"text", "", `{"choices":[{"message":{"role":"assistant","content":"hello"}}]}`, "hello"},
		{"image", "images/generations", `{"data":[{"url":"https://media.example.invalid/image.png"}]}`, "https://media.example.invalid/image.png"},
		{"video", "videos/render", `{"video":{"url":"https://media.example.invalid/video.mp4"}}`, "https://media.example.invalid/video.mp4"},
	} {
		t.Run(tc.kind, func(t *testing.T) {
			var calls atomic.Int32
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				calls.Add(1)
				if r.Method != http.MethodPost {
					t.Errorf("existing synchronous request started polling: %s %s", r.Method, r.URL)
				}
				w.Header().Set("Content-Type", "application/json")
				io.WriteString(w, tc.response)
			}))
			defer server.Close()
			input := openAIVideoInput(server.URL + "/v1")
			input.Service.Type, input.Service.Path = tc.kind, tc.path
			input.Request.Input = map[string]any{"prompt": "hello"}
			input.Request.Options = nil
			adapter := botadapters.OpenAIAdapter{}
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			client := botprovider.NewHTTPClient(time.Second)
			result, err := (bottask.Service{}).ResolveStream(context.Background(), bottask.StreamJob{Input: input, Adapter: adapter, Client: client, Request: request})
			if err != nil {
				t.Fatal(err)
			}
			data := result.Data
			if tc.kind == "text" {
				if result.Handled {
					t.Fatal("ordinary chat was intercepted by video task handling")
				}
				response, err := client.Do(context.Background(), request)
				if err != nil {
					t.Fatal(err)
				}
				data, err = adapter.BuildClientResponse(input.Request, response)
				if err != nil || botprotocol.ExtractOutput(data)["text"] != tc.want {
					t.Fatalf("chat output changed: %#v, %v", data, err)
				}
			} else if !result.Handled || !reflect.DeepEqual(botprotocol.NormalizeMediaList(data, tc.kind), []string{tc.want}) {
				t.Fatal("existing media output changed", data)
			}
			if calls.Load() != 1 || adapter.SupportsCancel(input) != (tc.kind == "text") {
				t.Fatalf("existing request lifecycle changed: %d calls", calls.Load())
			}
			failure := errors.New("provider connection failed")
			if bottask.WrapTaskError(adapter, "", failure) != failure {
				t.Fatal("ordinary requests lost their original error handling")
			}
		})
	}
}

func TestOpenAIVideoProtectedContent(t *testing.T) {
	content := []byte("opaque video bytes from the provider")
	for _, mode := range []string{"relative", "absolute", "wrong-task", "wrong-path", "cross-origin", "redirect", "unauthorized", "json", "empty"} {
		t.Run(mode, func(t *testing.T) {
			var submits, downloads, leaked atomic.Int32
			other := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { leaked.Add(1) }))
			defer other.Close()
			var serverURL string
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.Header.Get("Authorization") != "Bearer video-test-key" {
					t.Error("video task/content request lost authentication")
				}
				switch r.URL.Path {
				case "/v1/videos/generations":
					submits.Add(1)
					w.Header().Set("Content-Type", "application/json")
					io.WriteString(w, `{"request_id":"task-1"}`)
				case "/v1/videos/task-1":
					videoURL := "/v1/videos/task-1/content"
					switch mode {
					case "absolute":
						videoURL = serverURL + videoURL
					case "wrong-task":
						videoURL = "/v1/videos/other-task/content"
					case "wrong-path":
						videoURL = "/admin/export"
					case "cross-origin":
						videoURL = strings.TrimPrefix(other.URL, "http:") + videoURL
					}
					w.Header().Set("Content-Type", "application/json")
					json.NewEncoder(w).Encode(map[string]any{"status": "done", "model": "grok-imagine-video-1.5", "video": map[string]any{"url": videoURL, "duration": 1}})
				case "/v1/videos/task-1/content":
					downloads.Add(1)
					switch mode {
					case "redirect":
						http.Redirect(w, r, other.URL, http.StatusFound)
					case "unauthorized":
						w.WriteHeader(http.StatusUnauthorized)
					case "json":
						w.Header().Set("Content-Type", "application/json")
						io.WriteString(w, `{"error":"missing video"}`)
					case "empty":
						w.Header().Set("Content-Type", "video/mp4")
					default:
						w.Header().Set("Content-Type", "video/mp4")
						w.Write(content)
					}
				default:
					t.Errorf("unexpected video content path: %s", r.URL)
					w.WriteHeader(http.StatusNotFound)
				}
			}))
			defer server.Close()
			serverURL = server.URL
			input := openAIVideoInput(server.URL + "/v1")
			adapter := botadapters.OpenAIAdapter{}
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			job := bottask.StreamJob{Input: input, Adapter: adapter, Client: botprovider.NewHTTPClient(time.Second), Request: request}
			result, err := (bottask.Service{}).ResolveStream(context.Background(), job)
			if mode == "relative" || mode == "absolute" {
				payload, ok := botprovider.AsBinaryPayload(result.Data)
				if err != nil || !ok || payload.MIME != "video/mp4" || !bytes.Equal(payload.Content, content) || payload.Meta["request_id"] != "task-1" || payload.Meta["duration"] != float64(1) {
					t.Fatalf("authenticated video result was not preserved: %#v, %v", payload, err)
				}
				resumed, resumeErr := (bottask.Service{}).ResumePolling(context.Background(), job, "task-1")
				if _, ok := botprovider.AsBinaryPayload(resumed.Data); resumeErr != nil || !ok || submits.Load() != 1 || downloads.Load() != 2 {
					t.Fatalf("resumed content download replayed or failed: %#v, %v", resumed, resumeErr)
				}
			} else if err == nil || !botprotocol.PreventsReplay(err) || result.Data != nil {
				t.Fatalf("invalid video download allowed success/replay: %#v, %v", result, err)
			}
			if submits.Load() != 1 || leaked.Load() != 0 {
				t.Fatalf("unexpected create or cross-origin request: %d submits, %d leaks", submits.Load(), leaked.Load())
			}
			if (mode == "wrong-task" || mode == "wrong-path" || mode == "cross-origin") && downloads.Load() != 0 {
				t.Fatal("untrusted content path was requested")
			}
		})
	}
}
