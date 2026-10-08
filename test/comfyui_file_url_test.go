package test

import (
	"context"
	"encoding/json"
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
)

type comfyFileURLRepository struct {
	optionMappingTestRepository
	serviceParams []botmodel.ServiceParam
}

func (repo comfyFileURLRepository) ServiceParamsByService(context.Context, uint64) []botmodel.ServiceParam {
	return repo.serviceParams
}

func comfyFileURLMapping(paramType, format string) comfyFileURLRepository {
	return comfyFileURLRepository{
		optionMappingTestRepository: optionMappingTestRepository{
			param:      botmodel.Param{ID: 101, Key: "references", Name: "References", Type: paramType, MaxFiles: 3, Status: 1},
			powerParam: botmodel.PowerParam{ID: 1, ParamID: 101, PowerID: 201, Show: botmodel.PowerParamShowAlways, Status: 2},
		},
		serviceParams: []botmodel.ServiceParam{
			{ID: 1, ServiceID: 301, ParamID: 101, Key: "14.image", ParamRule: botmodel.ServiceParamRuleDirect, FileValueFormat: format, Status: 1},
			{ID: 2, ServiceID: 301, ParamID: 101, Key: "15.image", ParamRule: botmodel.ServiceParamRuleDirect, FileValueFormat: format, Status: 1},
		},
	}
}

func TestComfyUIFileURLsReachPromptUnchanged(t *testing.T) {
	for _, extension := range []string{"PNG", "MP4", "WAV", "safetensors"} {
		for _, format := range []string{"url", "base64", "data_url"} {
			for _, paramType := range []string{"file", "files"} {
				t.Run(extension+"/"+format+"/"+paramType, func(t *testing.T) {
					var submissions, unexpectedRequests atomic.Int32
					var reference string
					server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
						if request.URL.Path != "/prompt" || request.Method != http.MethodPost {
							unexpectedRequests.Add(1)
							t.Errorf("file URL must not be downloaded or uploaded: %s %s", request.Method, request.URL.Path)
							writer.WriteHeader(http.StatusBadRequest)
							return
						}
						submissions.Add(1)
						username, password, valid := request.BasicAuth()
						if !valid || username != "user" || password != " pw:two " {
							t.Error("prompt submission lost authentication")
						}
						var body map[string]any
						if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
							t.Error(err)
							return
						}
						for _, key := range []string{"14.image", "15.image"} {
							inputs, name, err := botprotocol.ComfyWorkflowInput(botprotocol.NormalizeMap(body["prompt"]), key)
							if err != nil || inputs[name] != reference {
								t.Errorf("%s changed signed file URL: %v, %v", key, inputs[name], err)
							}
						}
						writer.Header().Set("Content-Type", "application/json")
						io.WriteString(writer, `{"prompt_id":"task-1"}`)
					}))
					defer server.Close()
					reference = strings.Replace(server.URL, "http://", "HTTP://", 1) + "/Source%20File." + extension + "?signature=Ab%2fc%2B%3D&key=b&key=a#Original"
					input := comfyAdapterInput(server.URL)
					input.Request.Protocol = botmodel.ProtocolComfyUI
					var value any = reference
					if paramType == "files" {
						value = []string{reference}
					}
					input.Request.Input = map[string]any{"references": value}
					var err error
					input.Mapped, err = botinput.BuildMapped(context.Background(), comfyFileURLMapping(paramType, format), input.Request, botinput.Target{PowerID: 201, ServiceID: 301})
					if err != nil {
						t.Fatal(err)
					}
					request, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input)
					if err != nil {
						t.Fatal(err)
					}
					if _, err := botprovider.NewHTTPClient(time.Second).Do(context.Background(), request); err != nil {
						t.Fatal(err)
					}
					if submissions.Load() != 1 || unexpectedRequests.Load() != 0 {
						t.Fatalf("expected only one prompt submission, got %d submissions and %d other requests", submissions.Load(), unexpectedRequests.Load())
					}
				})
			}
		}
	}
}

func TestComfyUIFileURLIndexes(t *testing.T) {
	repo := comfyFileURLMapping("files", "base64")
	for index := range repo.serviceParams {
		repo.serviceParams[index].ParamRule = botmodel.ServiceParamRuleAttachment
		repo.serviceParams[index].Mapping = "[" + strconv.Itoa(index+1) + "]"
	}
	urls := []string{"https://cdn.example.invalid/First.PNG?sig=A%2fb#One", "https://cdn.example.invalid/Second.MP4?sig=B%3d#Two"}
	input := comfyAdapterInput("https://example.invalid")
	input.Request.Protocol = botmodel.ProtocolComfyUI
	input.Request.Input = map[string]any{"references": urls}
	var err error
	input.Mapped, err = botinput.BuildMapped(context.Background(), repo, input.Request, botinput.Target{PowerID: 201, ServiceID: 301})
	if err != nil {
		t.Fatal(err)
	}
	request, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input)
	if err != nil {
		t.Fatal(err)
	}
	for index, key := range []string{"14.image", "15.image"} {
		inputs, name, err := botprotocol.ComfyWorkflowInput(botprotocol.NormalizeMap(request.Body["prompt"]), key)
		if err != nil || inputs[name] != urls[index] {
			t.Fatalf("file index %d did not preserve URL: %v, %v", index+1, inputs[name], err)
		}
	}
}

func TestComfyUIFileURLScalarContract(t *testing.T) {
	for _, paramType := range []string{"file", "files"} {
		for _, value := range []any{"", " \t", []string{}, []string{"first", "second"}, []any{"first", "second"}, 42} {
			input := comfyAdapterInput("https://example.invalid")
			input.Mapped.Params = []botprotocol.MappedParam{{NativeKey: "14.image", ParamType: paramType, Value: value}}
			if _, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input); err == nil || !strings.Contains(err.Error(), "必须映射一个文件") {
				t.Fatalf("%s accepted a non-scalar file value: %#v, %v", paramType, value, err)
			}
		}
	}
}

const comfyFileListWorkflow = `{"14":{"class_type":"DeverReferenceImages","inputs":{"files":[]}}}`

func TestComfyUIFileURLListsReachPromptUnchanged(t *testing.T) {
	for _, scenario := range []struct {
		name, paramType, format string
		count                   int
		asScalar, indexed       bool
	}{
		{name: "no-reference", paramType: "files", format: "url"},
		{name: "first-generated-reference", paramType: "files", format: "base64", count: 1},
		{name: "multiple-media-files", paramType: "files", format: "data_url", count: 3},
		{name: "single-file-parameter", paramType: "file", format: "url", count: 1, asScalar: true},
		{name: "indexed-reference", paramType: "files", format: "url", count: 1, indexed: true},
	} {
		t.Run(scenario.name, func(t *testing.T) {
			var submissions, unexpectedRequests atomic.Int32
			var want []any
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				if request.URL.Path != "/prompt" || request.Method != http.MethodPost {
					unexpectedRequests.Add(1)
					writer.WriteHeader(http.StatusBadRequest)
					return
				}
				submissions.Add(1)
				var body map[string]any
				if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
					t.Error(err)
					return
				}
				inputs, name, err := botprotocol.ComfyWorkflowInput(botprotocol.NormalizeMap(body["prompt"]), "14.files")
				if err != nil || !reflect.DeepEqual(inputs[name], want) {
					t.Errorf("file list must remain an ordered URL array: got %#v, want %#v, error %v", inputs[name], want, err)
				}
				writer.Header().Set("Content-Type", "application/json")
				io.WriteString(writer, `{"prompt_id":"task-1"}`)
			}))
			defer server.Close()
			urls := make([]string, 0, scenario.count)
			for _, extension := range []string{"PNG", "MP4", "WAV"}[:scenario.count] {
				urls = append(urls, strings.Replace(server.URL, "http://", "HTTP://", 1)+"/Source%20File."+extension+"?signature=Ab%2fc%2B%3D&key=b&key=a#Original")
			}
			want = make([]any, 0, len(urls))
			for _, source := range urls {
				want = append(want, source)
			}
			repo := comfyFileURLMapping(scenario.paramType, scenario.format)
			repo.serviceParams = repo.serviceParams[:1]
			repo.serviceParams[0].Key = "14.files"
			if scenario.indexed {
				repo.serviceParams[0].ParamRule = botmodel.ServiceParamRuleAttachment
				repo.serviceParams[0].Mapping = "[1]"
				want = []any{urls[0]}
			}
			var value any = urls
			if scenario.asScalar {
				value = urls[0]
			}
			input := comfyAdapterInput(server.URL)
			input.ServiceEndpoint.WorkflowJSON = comfyFileListWorkflow
			input.Request.Protocol = botmodel.ProtocolComfyUI
			input.Request.Input = map[string]any{"references": value}
			var err error
			input.Mapped, err = botinput.BuildMapped(context.Background(), repo, input.Request, botinput.Target{PowerID: 201, ServiceID: 301})
			if err != nil {
				t.Fatal(err)
			}
			request, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input)
			if err != nil {
				t.Fatal(err)
			}
			if _, err := botprovider.NewHTTPClient(time.Second).Do(context.Background(), request); err != nil {
				t.Fatal(err)
			}
			if submissions.Load() != 1 || unexpectedRequests.Load() != 0 {
				t.Fatalf("expected only one prompt submission, got %d submissions and %d input-file requests", submissions.Load(), unexpectedRequests.Load())
			}
		})
	}
}

func TestComfyUIFileURLListContract(t *testing.T) {
	const first = "https://cdn.example.invalid/First.PNG?sig=A%2fb#One"
	const second = "https://cdn.example.invalid/Second.safetensors?sig=B%3d#Two"
	for _, paramType := range []string{"file", "files"} {
		for _, scenario := range []struct {
			name  string
			value any
			want  []string
		}{
			{"empty-string-list", []string{}, []string{}},
			{"empty-json-list", []any{}, []string{}},
			{"nil-string-list", []string(nil), []string{}},
			{"nil-json-list", []any(nil), []string{}},
			{"scalar", first, []string{first}},
			{"single-json-list", []any{first}, []string{first}},
			{"multiple-string-list", []string{first, second}, []string{first, second}},
			{"multiple-json-list", []any{first, second}, []string{first, second}},
		} {
			t.Run(paramType+"/"+scenario.name, func(t *testing.T) {
				input := comfyAdapterInput("https://example.invalid")
				input.ServiceEndpoint.WorkflowJSON = comfyFileListWorkflow
				input.Mapped.Params = []botprotocol.MappedParam{{NativeKey: "14.files", ParamType: paramType, Value: scenario.value}}
				request, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input)
				if err != nil {
					t.Fatal(err)
				}
				inputs, name, err := botprotocol.ComfyWorkflowInput(botprotocol.NormalizeMap(request.Body["prompt"]), "14.files")
				if err != nil || !reflect.DeepEqual(inputs[name], scenario.want) {
					t.Fatalf("file list shape changed: got %#v, want %#v, error %v", inputs[name], scenario.want, err)
				}
			})
		}
		for _, value := range []any{nil, "", " \t", 42, map[string]any{"url": first}, []map[string]any{{"url": first}}, []string{first, ""}, []any{first, nil}, []any{first, 42}, []any{first, map[string]any{"url": second}}, []any{[]string{first}}, []any{[]any{first}}} {
			input := comfyAdapterInput("https://example.invalid")
			input.ServiceEndpoint.WorkflowJSON = comfyFileListWorkflow
			input.Mapped.Params = []botprotocol.MappedParam{{NativeKey: "14.files", ParamType: paramType, Value: value}}
			if _, err := (botadapters.ComfyUIAdapter{}).BuildNativeRequest(input); err == nil || !strings.Contains(err.Error(), "14.files") {
				t.Fatalf("%s accepted an invalid file list: %#v, %v", paramType, value, err)
			}
		}
	}
}

func TestComfyUIFileURLChangePreservesOtherProtocolFormats(t *testing.T) {
	const source = "data:APPLICATION/OCTET-STREAM;base64,AAECAw=="
	for _, test := range []struct{ format, want string }{
		{"url", source},
		{"base64", "AAECAw=="},
		{"data_url", "data:application/octet-stream;base64,AAECAw=="},
	} {
		t.Run(test.format, func(t *testing.T) {
			request := &botprotocol.ShemicRequest{Protocol: "openai", Input: map[string]any{"references": source}}
			mapped, err := botinput.BuildMapped(context.Background(), comfyFileURLMapping("file", test.format), request, botinput.Target{PowerID: 201, ServiceID: 301})
			if err != nil {
				t.Fatal(err)
			}
			if len(mapped.Params) != 2 {
				t.Fatalf("expected both file mappings: %#v", mapped.Params)
			}
			for _, param := range mapped.Params {
				if param.Value != test.want {
					t.Fatalf("other protocol %s format changed: got %#v, want %q", test.format, param.Value, test.want)
				}
			}
		})
	}
}
