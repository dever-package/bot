package test

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"image"
	"image/color"
	"image/png"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strconv"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botadapters "github.com/dever-package/bot/service/energon/protocol/adapters"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

const comfyAdapterWorkflow = `{
 "3":{"class_type":"KSampler","inputs":{"seed":18446744073709551615,"steps":20,"enabled":true}},
 "10":{"class_type":"CLIPTextEncode","inputs":{"text":"original","clip":["4",0]},"_meta":{"title":"Prompt"}},
 "14":{"class_type":"LoadImage","inputs":{"image":"original.png"}},
 "15":{"class_type":"LoadImage","inputs":{"image":"another.png"}}
}`

func comfyAdapterInput(host string) botprotocol.NativeInput {
	return botprotocol.NativeInput{
		Provider:        botmodel.Provider{Host: host, Protocol: botmodel.ProtocolComfyUI},
		Account:         botmodel.Account{Key: `{"username":"user","password":" pw:two "}`},
		Power:           botmodel.Power{Kind: "image"},
		Service:         botmodel.Service{Type: "image"},
		ServiceEndpoint: botmodel.ServiceEndpoint{InterfaceType: botmodel.ServiceEndpointTypeWorkflowJSON, WorkflowJSON: comfyAdapterWorkflow},
		Request:         &botprotocol.ShemicRequest{RequestID: "request-1", Options: map[string]any{"poll_interval_ms": 1, "poll_max_attempts": 4}},
	}
}

func TestComfyUIAdapterPureMapping(t *testing.T) {
	adapter := botadapters.ComfyUIAdapter{}
	if _, err := botadapters.DefaultRegistry().Get("comfyui"); err != nil {
		t.Fatal(err)
	}
	input := comfyAdapterInput("https://example.invalid")
	input.Mapped.Params = []botprotocol.MappedParam{
		{NativeKey: "10.text", ParamType: "prompt", Value: "new prompt"},
		{NativeKey: "3.steps", Value: "32"},
		{NativeKey: "3.enabled", Value: "false"},
	}
	request, err := adapter.BuildNativeRequest(input)
	if err != nil {
		t.Fatal(err)
	}
	encoded, err := json.Marshal(request.Body)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Contains(encoded, []byte(`"seed":18446744073709551615`)) || !bytes.Contains(encoded, []byte(`"steps":32`)) || !bytes.Contains(encoded, []byte(`"enabled":false`)) || !bytes.Contains(encoded, []byte(`"text":"new prompt"`)) || !bytes.Contains(encoded, []byte(`"clip":["4",0]`)) {
		t.Fatalf("mapping changed template types/connections: %s", encoded)
	}
	if input.ServiceEndpoint.WorkflowJSON != comfyAdapterWorkflow || !request.SameOriginRedirects || request.URL != "https://example.invalid/prompt" {
		t.Fatal("pure builder must preserve the template and constrain credential routing")
	}
	for _, identifier := range []string{"人物生成", "/商品换背景"} {
		t.Run(identifier, func(t *testing.T) {
			namedInput := input
			namedInput.ServiceEndpoint.Api = identifier
			namedInput.ServiceAPI = identifier
			namedRequest, err := adapter.BuildNativeRequest(namedInput)
			if err != nil {
				t.Fatal(err)
			}
			if namedRequest.URL != request.URL || !reflect.DeepEqual(namedRequest.Body, request.Body) {
				t.Fatal("workflow identifiers must not change the request URL or enter its native body")
			}
		})
	}
	if _, err := adapter.BuildNativeRequest(comfyAdapterInput("https://example.invalid")); err != nil {
		t.Fatal("rebuilding must not inherit previous mapped values")
	}
	if botprovider.AuthHeaders("token")["Authorization"] != "Bearer token" {
		t.Fatal("existing Bearer providers must remain unchanged")
	}
	for _, key := range []string{"prompt", "prompt.10.inputs.text", "999.text", "10.unknown"} {
		input.Mapped.Params = []botprotocol.MappedParam{{NativeKey: key, Value: "text"}}
		if _, err := adapter.BuildNativeRequest(input); err == nil {
			t.Fatalf("invalid mapping accepted: %s", key)
		}
	}
	input.Mapped.Params = []botprotocol.MappedParam{{NativeKey: "14.image", ParamType: "files", Value: []string{"first", "second"}}}
	if _, err := adapter.BuildNativeRequest(input); err == nil {
		t.Fatal("multiple references must not silently map to one LoadImage input")
	}
}

func TestComfyUIAdapterCredentialBoundaries(t *testing.T) {
	adapter := botadapters.ComfyUIAdapter{}
	for _, credentials := range []string{"a-secret-token", `{}`, `{"username":"user","password":""}`, `{"username":"a:b","password":"a-secret-token"}`} {
		input := comfyAdapterInput("https://example.invalid")
		input.Account.Key = credentials
		_, err := adapter.BuildNativeRequest(input)
		if err == nil || strings.Contains(err.Error(), "a-secret-token") {
			t.Fatal("invalid credentials must fail without echoing the secret")
		}
	}
	input := comfyAdapterInput("https://example.invalid")
	input.Service.Path = "https://example.invalid:443/prompt"
	if _, err := adapter.BuildNativeRequest(input); err != nil {
		t.Fatal("the default HTTPS port must count as the same origin", err)
	}
	input.Service.Path = ""
	input.Account.Host = "https://account.invalid/comfy"
	request, err := adapter.BuildNativeRequest(input)
	if err != nil || request.URL != "https://account.invalid/comfy/prompt" {
		t.Fatalf("account host override was lost: %v, %s", err, request.URL)
	}
	input.Service.Path = "https://other.invalid/prompt"
	if _, err := adapter.BuildNativeRequest(input); err == nil {
		t.Fatal("credential-bearing absolute endpoints must not change origin")
	}
	input.Service.Path = ""
	input.Account.Host = "https://user:password@example.invalid"
	if _, err := adapter.BuildNativeRequest(input); err == nil {
		t.Fatal("credentials in URLs must be rejected")
	}
}

func TestComfyUIAdapterMappedNumberPrecision(t *testing.T) {
	for _, seed := range []string{"9007199254740993", "18446744073709551615"} {
		for _, source := range []string{"input", "input-number", "input-uint64", "fixed-number", "fixed-json", "default", "option", "mapped-option"} {
			t.Run(seed+"/"+source, func(t *testing.T) {
				repo := optionMappingTestRepository{
					param:        botmodel.Param{ID: 101, Key: "seed", Name: "Seed", Type: "text", ValueType: "number", Status: 1},
					powerParam:   botmodel.PowerParam{ID: 1, ParamID: 101, PowerID: 201, Show: botmodel.PowerParamShowAlways, Status: 2},
					serviceParam: botmodel.ServiceParam{ID: 1, ServiceID: 301, ParamID: 101, Key: "3.seed", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1},
				}
				input := comfyAdapterInput("https://example.invalid")
				input.Request.Protocol = botmodel.ProtocolComfyUI
				input.Request.Input = map[string]any{"seed": seed}
				switch source {
				case "input-number":
					input.Request.Input["seed"] = json.Number(seed)
				case "input-uint64":
					number, err := strconv.ParseUint(seed, 10, 64)
					if err != nil {
						t.Fatal(err)
					}
					input.Request.Input["seed"] = number
				case "fixed-number", "fixed-json":
					repo.serviceParam.ParamID = 0
					repo.serviceParam.ParamRule = botmodel.ServiceParamRuleFixed
					repo.serviceParam.FixedValueType = strings.TrimPrefix(source, "fixed-")
					repo.serviceParam.Mapping = seed
				case "default":
					repo.param.DefaultValue = seed
					input.Request.Input = map[string]any{}
				case "option", "mapped-option":
					repo.param.Type = "option"
					repo.options = []botmodel.ParamOption{{ID: 17, ParamID: 101, Name: "Seed", Value: seed}}
					if source == "mapped-option" {
						repo.serviceParam.ParamRule = botmodel.ServiceParamRuleOption
						repo.serviceParam.Mapping = `[{"option_id":17,"native_value":"` + seed + `"}]`
					}
				}
				mapped, err := botinput.BuildMapped(context.Background(), repo, input.Request, botinput.Target{PowerID: 201, ServiceID: 301})
				if err != nil {
					t.Fatal(err)
				}
				input.Mapped = mapped
				request, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input)
				if err != nil {
					t.Fatal(err)
				}
				encoded, err := json.Marshal(request.Body)
				if err != nil || !bytes.Contains(encoded, []byte(`"seed":`+seed)) {
					t.Fatalf("mapped seed lost precision: %s, %v", encoded, err)
				}
			})
		}
	}
	if number := botinput.ScalarByType("number", "32"); number != float64(32) {
		t.Fatal("the default conversion for other providers must remain float64")
	}
	input := comfyAdapterInput("https://example.invalid")
	input.Mapped.Params = []botprotocol.MappedParam{{NativeKey: "3.seed", Value: float64(9007199254740993)}}
	if _, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input); err == nil {
		t.Fatal("an already rounded large floating value must not silently become a seed")
	}
}

func TestComfyUIAdapterOverriddenFileMapping(t *testing.T) {
	var calls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		calls.Add(1)
		writer.WriteHeader(http.StatusInternalServerError)
	}))
	defer server.Close()
	input := comfyAdapterInput(server.URL)
	input.Mapped.Params = []botprotocol.MappedParam{
		{NativeKey: "14.image", ParamType: "file", Value: "not-a-source"},
		{NativeKey: "14.image", ParamType: "fixed", Value: "existing.png"},
	}
	adapter := botadapters.ComfyUIAdapter{}
	request, err := adapter.BuildNativeRequest(input)
	if err != nil {
		t.Fatal(err)
	}
	workflow := request.Body["prompt"].(map[string]any)
	if workflow["14"].(map[string]any)["inputs"].(map[string]any)["image"] != "existing.png" || calls.Load() != 0 {
		t.Fatal("the effective final mapping must override the earlier file value without IO")
	}
}

func comfyPNG(t *testing.T, shade color.RGBA) []byte {
	t.Helper()
	bitmap := image.NewRGBA(image.Rect(0, 0, 1, 1))
	bitmap.Set(0, 0, shade)
	var encoded bytes.Buffer
	if err := png.Encode(&encoded, bitmap); err != nil {
		t.Fatal(err)
	}
	return encoded.Bytes()
}

func TestComfyUIAdapterAuthenticatedExecution(t *testing.T) {
	for _, mode := range []string{"response", "stream"} {
		t.Run(mode, func(t *testing.T) {
			first := comfyPNG(t, color.RGBA{R: 255, A: 255})
			second := comfyPNG(t, color.RGBA{G: 255, A: 255})
			const reference = "https://files.example.invalid/reference.png?signature=A%2Fb%3D#original"
			var submits, polls atomic.Int32
			var downloads []string
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				username, password, valid := request.BasicAuth()
				if !valid || username != "user" || password != " pw:two " {
					t.Error("credentials missing or password whitespace/colon changed")
					writer.WriteHeader(http.StatusUnauthorized)
					return
				}
				writer.Header().Set("Content-Type", "application/json")
				switch request.URL.Path {
				case "/prompt":
					submits.Add(1)
					var body map[string]any
					decoder := json.NewDecoder(request.Body)
					decoder.UseNumber()
					if err := decoder.Decode(&body); err != nil {
						t.Error(err)
						return
					}
					workflow := body["prompt"].(map[string]any)
					if workflow["14"].(map[string]any)["inputs"].(map[string]any)["image"] != reference || workflow["15"].(map[string]any)["inputs"].(map[string]any)["image"] != reference || body["client_id"] != "request-1" {
						t.Error("submitted workflow did not preserve the input URL")
					}
					io.WriteString(writer, `{"prompt_id":"task-1","number":1}`)
				case "/history/task-1":
					if polls.Add(1) == 1 {
						io.WriteString(writer, `{}`)
						return
					}
					io.WriteString(writer, `{"task-1":{"status":{"completed":true,"status_str":"success","messages":[]},"outputs":{"9":{"images":[{"filename":"first.png","subfolder":"out","type":"output"},{"filename":"second.png","subfolder":"out","type":"output"}]}}}}`)
				case "/view":
					filename := request.URL.Query().Get("filename")
					downloads = append(downloads, filename)
					if request.URL.Query().Get("subfolder") != "out" || request.URL.Query().Get("type") != "output" {
						t.Error("output descriptor was lost")
					}
					writer.Header().Set("Content-Type", "image/png")
					if filename == "first.png" {
						writer.Write(first)
					} else {
						writer.Write(second)
					}
				default:
					t.Errorf("unexpected request, including cancellation: %s", request.URL.Path)
					writer.WriteHeader(http.StatusNotFound)
				}
			}))
			defer server.Close()
			input := comfyAdapterInput(server.URL)
			input.Mapped.Params = []botprotocol.MappedParam{
				{NativeKey: "14.image", ParamType: "files", Value: []string{reference}},
				{NativeKey: "15.image", ParamType: "file", Value: reference},
			}
			adapter := botadapters.ComfyUIAdapter{}
			client := botprovider.NewHTTPClient(2 * time.Second)
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			if submits.Load() != 0 {
				t.Fatal("pure request building performed IO")
			}
			var output any
			if mode == "response" {
				response, requestErr := client.Do(context.Background(), request)
				if requestErr != nil {
					t.Fatal(requestErr)
				}
				var handled bool
				output, handled, err = (bottask.Service{}).ResolveResponse(context.Background(), bottask.ResponseJob{Input: input, Adapter: adapter, Client: client, Response: response})
				if !handled {
					t.Fatal("ComfyUI response bypassed polling")
				}
			} else {
				result, streamErr := (bottask.Service{}).ResolveStream(context.Background(), bottask.StreamJob{Input: input, Adapter: adapter, Client: client, Request: request})
				err, output = streamErr, result.Data
				if !result.Handled {
					t.Fatal("ComfyUI stream bypassed polling")
				}
			}
			if err != nil {
				t.Fatal(err)
			}
			media, valid := botprovider.AsBinaryMediaOutput(output)
			if !valid || len(media.Files) != 2 || media.Meta["prompt_id"] != "task-1" || !bytes.Equal(media.Files[0].Content, first) || !bytes.Equal(media.Files[1].Content, second) {
				t.Fatal("downloaded images or ordering changed")
			}
			if submits.Load() != 1 || polls.Load() != 2 || !reflect.DeepEqual(downloads, []string{"first.png", "second.png"}) {
				t.Fatalf("duplicate/missing IO: %d submits, %d polls, %v files", submits.Load(), polls.Load(), downloads)
			}
			public, _ := json.Marshal(output)
			if bytes.Contains(public, []byte("Authorization")) || bytes.Contains(public, []byte(" pw:two ")) || bytes.Contains(public, []byte(base64.StdEncoding.EncodeToString(first))) {
				t.Fatal("internal binary result must not serialize credentials or file bytes")
			}
		})
	}
}

func TestComfyUIAdapterFailuresPreventReplay(t *testing.T) {
	for _, failure := range []string{"poll-auth", "execution", "missing-output", "bad-path", "download-auth", "wrong-task", "missing-status"} {
		t.Run(failure, func(t *testing.T) {
			var submits atomic.Int32
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				writer.Header().Set("Content-Type", "application/json")
				switch request.URL.Path {
				case "/prompt":
					submits.Add(1)
					io.WriteString(writer, `{"prompt_id":"task-1"}`)
				case "/history/task-1":
					if failure == "wrong-task" {
						io.WriteString(writer, `{"other-task":{"status":{"completed":true,"status_str":"success"}}}`)
						return
					}
					if failure == "missing-status" {
						io.WriteString(writer, `{"task-1":{"outputs":{}}}`)
						return
					}
					if failure == "poll-auth" {
						writer.WriteHeader(http.StatusUnauthorized)
						io.WriteString(writer, `{"error":"auth"}`)
						return
					}
					if failure == "execution" {
						io.WriteString(writer, `{"task-1":{"status":{"completed":false,"status_str":"error","messages":[["execution_error",{"exception_message":"node failed"}]]}}}`)
						return
					}
					filename := "first.png"
					if failure == "bad-path" {
						filename = "../secret.png"
					}
					outputs := map[string]any{"9": map[string]any{"images": []any{map[string]any{"filename": filename, "type": "output"}}}}
					if failure == "missing-output" {
						outputs = map[string]any{}
					}
					json.NewEncoder(writer).Encode(map[string]any{"task-1": map[string]any{"status": map[string]any{"completed": true, "status_str": "success"}, "outputs": outputs}})
				case "/view":
					writer.WriteHeader(http.StatusForbidden)
					io.WriteString(writer, `{"error":"forbidden"}`)
				}
			}))
			defer server.Close()
			adapter := botadapters.ComfyUIAdapter{}
			input := comfyAdapterInput(server.URL)
			request, err := adapter.BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			_, err = (bottask.Service{}).ResolveStream(context.Background(), bottask.StreamJob{Input: input, Adapter: adapter, Client: botprovider.NewHTTPClient(time.Second), Request: request})
			if err == nil || !botprotocol.PreventsReplay(err) || !strings.Contains(err.Error(), "task-1") || submits.Load() != 1 {
				t.Fatalf("failed accepted task must not be resubmitted: %v, %d", err, submits.Load())
			}
		})
	}
}

func TestComfyUIAdapterStandardMediaOutputs(t *testing.T) {
	for _, output := range []struct{ kind, key, mime string }{
		{"image", "images", "image/png"},
		{"video", "videos", "video/mp4"},
		{"video", "gifs", "video/mp4"},
		{"audio", "audio", "audio/wav"},
		{"audio", "audios", "audio/wav"},
	} {
		t.Run(output.key, func(t *testing.T) {
			var downloads []string
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				username, password, ok := request.BasicAuth()
				if !ok || username != "user" || password != " pw:two " || request.URL.Path != "/view" {
					t.Error("the file request must be authenticated")
					writer.WriteHeader(http.StatusUnauthorized)
					return
				}
				filename := request.URL.Query().Get("filename")
				downloads = append(downloads, filename)
				writer.Header().Set("Content-Type", output.mime)
				io.WriteString(writer, filename)
			}))
			defer server.Close()
			input := comfyAdapterInput(server.URL)
			input.Power.Kind = output.kind
			response := &botprovider.Response{StatusCode: http.StatusOK, Body: map[string]any{
				"task-1": map[string]any{"outputs": map[string]any{
					"10": map[string]any{output.key: []any{map[string]any{"filename": "second", "type": "output"}}},
					"2":  map[string]any{output.key: []any{map[string]any{"filename": "first", "type": "output"}}},
				}},
			}}
			result, err := (botadapters.ComfyUIAdapter{}).ResolveTaskResult(context.Background(), input, "task-1", response, botprovider.NewHTTPClient(time.Second))
			if err != nil {
				t.Fatal(err)
			}
			media, ok := botprovider.AsBinaryMediaOutput(result)
			if !ok || len(media.Files) != 2 || !reflect.DeepEqual(downloads, []string{"first", "second"}) || string(media.Files[0].Content) != "first" || media.Files[1].MIME != output.mime {
				t.Fatal("media dispatch and numeric node ordering must preserve all files")
			}
		})
	}
}

func TestComfyUIAdapterMediaOutputClassification(t *testing.T) {
	for _, scenario := range []struct {
		name      string
		kind      string
		outputs   map[string]any
		filenames []string
	}{
		{
			name: "SaveVideo uses images with animated metadata",
			kind: "video",
			outputs: map[string]any{
				"16": map[string]any{
					"images":   []any{map[string]any{"filename": "i2v_00012_.mp4", "subfolder": "video", "type": "output", "id": "saved-video"}},
					"animated": []any{true},
				},
			},
			filenames: []string{"i2v_00012_.mp4"},
		},
		{
			name: "video ignores image previews and keeps output ordering",
			kind: "video",
			outputs: map[string]any{
				"2": map[string]any{"images": []any{
					map[string]any{"filename": "preview.png"},
					map[string]any{"filename": "first.mp4"},
					map[string]any{"filename": "second.WEBM"},
				}},
				"10": map[string]any{"gifs": []any{
					map[string]any{"filename": "preview.gif", "format": "image/gif"},
					map[string]any{"filename": "third.mp4", "format": "video/h264-mp4"},
				}},
			},
			filenames: []string{"first.mp4", "second.WEBM", "third.mp4"},
		},
		{
			name: "shared images descriptors do not turn video into an image",
			kind: "image",
			outputs: map[string]any{
				"16": map[string]any{"images": []any{
					map[string]any{"filename": "video.mp4"},
					map[string]any{"filename": "image.png"},
				}},
			},
			filenames: []string{"image.png"},
		},
		{
			name: "explicit format classifies extensionless video descriptors",
			kind: "video",
			outputs: map[string]any{
				"16": map[string]any{"images": []any{
					map[string]any{"filename": "preview"},
					map[string]any{"filename": "video", "format": "video/h264-mp4"},
				}},
			},
			filenames: []string{"video"},
		},
		{
			name: "duplicate descriptors download once",
			kind: "video",
			outputs: map[string]any{
				"16": map[string]any{
					"images": []any{map[string]any{"filename": "video.mp4"}},
					"videos": []any{map[string]any{"filename": "video.mp4"}},
				},
			},
			filenames: []string{"video.mp4"},
		},
		{
			name: "preview images alone cannot satisfy a video request",
			kind: "video",
			outputs: map[string]any{
				"16": map[string]any{"images": []any{map[string]any{"filename": "preview.png"}}},
			},
		},
	} {
		t.Run(scenario.name, func(t *testing.T) {
			var downloads []string
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				username, password, ok := request.BasicAuth()
				if !ok || username != "user" || password != " pw:two " || request.Method != http.MethodGet || request.URL.Path != "/view" {
					t.Error("output resolution must only make authenticated downloads, never resubmit")
					writer.WriteHeader(http.StatusUnauthorized)
					return
				}
				filename := request.URL.Query().Get("filename")
				downloads = append(downloads, filename)
				writer.Header().Set("Content-Type", scenario.kind+"/"+map[string]string{"image": "png", "video": "mp4"}[scenario.kind])
				io.WriteString(writer, filename)
			}))
			defer server.Close()
			input := comfyAdapterInput(server.URL)
			input.Power.Kind = scenario.kind
			response := &botprovider.Response{StatusCode: http.StatusOK, Body: map[string]any{
				"task-1": map[string]any{"outputs": scenario.outputs},
			}}
			result, err := (botadapters.ComfyUIAdapter{}).ResolveTaskResult(context.Background(), input, "task-1", response, botprovider.NewHTTPClient(time.Second))
			if len(scenario.filenames) == 0 {
				if err == nil || !strings.Contains(err.Error(), "没有可读取的 video 输出文件") || len(downloads) != 0 {
					t.Fatalf("image previews must not be returned as video: result=%v err=%v downloads=%v", result, err, downloads)
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			media, ok := botprovider.AsBinaryMediaOutput(result)
			if !ok || len(media.Files) != len(scenario.filenames) || !reflect.DeepEqual(downloads, scenario.filenames) {
				t.Fatalf("unexpected resolved files: expected=%v downloaded=%v result=%v", scenario.filenames, downloads, result)
			}
		})
	}
}
