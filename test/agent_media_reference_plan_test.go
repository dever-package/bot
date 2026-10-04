package test

import (
	"context"
	"encoding/json"
	"reflect"
	"strconv"
	"strings"
	"testing"

	energonmodel "github.com/dever-package/bot/model/energon"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func referenceImage(id uint64, historical bool) runtimeprovider.MediaReference {
	return runtimeprovider.MediaReference{
		ReferenceType: "artifact", ReferenceID: id, ArtifactID: id, SeriesID: 7,
		Kind: "image", URL: "https://example.test/image-" + strconv.FormatUint(id, 10),
		Historical: historical, ActiveSeries: historical,
	}
}

func referencePower(kind string, params []energonservice.PowerParam, references []runtimeprovider.MediaReference, fixed map[string]any) runtimeprovider.Tool {
	properties := map[string]any{"prompt": map[string]any{"type": "string"}}
	for _, param := range params {
		properties[param.Key] = map[string]any{"type": "string"}
	}
	params = append([]energonservice.PowerParam{{Key: "prompt", Type: "prompt", ValueType: "string", Required: true}}, params...)
	for index := range params {
		params[index].ParamID = uint64(index + 1)
		params[index].ParamKey = params[index].Key
	}
	return runtimeprovider.PowerTool(
		energonmodel.Power{Key: "reference_test", Name: "测试", Kind: kind},
		energonservice.PowerParamConfig{Params: params, SelectedTargetID: 1},
		map[string]any{"type": "object", "properties": properties}, fixed,
		energonservice.GatewayService{}, runtimeprovider.Transport{}, references,
		runtimeprovider.ReferenceScope{}, botprotocol.BillingContext{}, runtimeprovider.PowerTargetAccess{},
	)
}

func referenceFileParam(key string) energonservice.PowerParam {
	return energonservice.PowerParam{Key: key, Type: "file", ValueType: "string", AcceptedKinds: []string{"image"}}
}

func preparedReferenceCall(t *testing.T, tool runtimeprovider.Tool, extra map[string]any) map[string]any {
	t.Helper()
	arguments := map[string]any{"prompt": "测试画面", runtimeprovider.MediaArtifactTitleArgument: "测试画面素材"}
	for key, value := range extra {
		arguments[key] = value
	}
	registry, err := runtimetool.NewRegistry(tool)
	if err != nil {
		t.Fatal(err)
	}
	prepared, err := registry.PrepareArguments(tool.Definition.Name, arguments)
	if err != nil {
		t.Fatal(err)
	}
	return prepared
}

func TestAgentMediaReferenceOwnership(t *testing.T) {
	previous := referenceImage(1, true)
	tool := referencePower("image", []energonservice.PowerParam{referenceFileParam("image")}, []runtimeprovider.MediaReference{previous}, nil)
	definition, _ := json.Marshal(tool.CurrentDefinition().Native())
	for _, forbidden := range []string{"__runtime_references", "ref_type", "ref_id", "param_key", "artifact:1", previous.URL} {
		if strings.Contains(string(definition), forbidden) {
			t.Fatalf("model schema leaked %s: %s", forbidden, definition)
		}
	}
	for _, mode := range []string{"continue", "new"} {
		t.Run(mode, func(t *testing.T) {
			prepared := preparedReferenceCall(t, tool, map[string]any{
				runtimeprovider.MediaSeriesModeArgument:    mode,
				runtimeprovider.MediaReferencesArgument:    []any{map[string]any{"ref_type": "artifact", "ref_id": 999, "param_key": "image"}},
				runtimeprovider.MediaReferencePlanArgument: []any{map[string]any{"ArtifactID": 999}},
				"image": "https://untrusted.test/forged.png",
			})
			sources, err := runtimeprovider.ArtifactReferences(prepared)
			if err != nil {
				t.Fatal(err)
			}
			if mode == "continue" {
				if prepared["image"] != previous.URL || len(sources) != 1 || sources[0].ArtifactID != previous.ArtifactID {
					t.Fatalf("continuation lost its source: %#v / %#v", prepared, sources)
				}
			} else if prepared["image"] != nil || len(sources) != 0 {
				t.Fatalf("new image retained history: %#v / %#v", prepared, sources)
			}
		})
	}
}

func TestAgentMediaFixedAndCurrentReferencesWin(t *testing.T) {
	previous, current := referenceImage(1, true), referenceImage(2, false)
	params := []energonservice.PowerParam{referenceFileParam("image")}
	fixed := map[string]any{runtimeprovider.MediaReferencesArgument: []map[string]any{{"ref_type": "artifact", "ref_id": current.ArtifactID, "param_key": "image"}}}
	for _, fixedArguments := range []map[string]any{nil, fixed} {
		tool := referencePower("image", params, []runtimeprovider.MediaReference{previous, current}, fixedArguments)
		prepared := preparedReferenceCall(t, tool, map[string]any{runtimeprovider.MediaSeriesModeArgument: "continue"})
		if prepared["image"] != current.URL {
			t.Fatalf("historical image overrode current/form image: %#v", prepared)
		}
	}
	current.ActiveSeries = true
	tool := referencePower("image", params, []runtimeprovider.MediaReference{current}, nil)
	prepared := preparedReferenceCall(t, tool, map[string]any{runtimeprovider.MediaSeriesModeArgument: "new"})
	if prepared["image"] != current.URL {
		t.Fatalf("new removed explicit current reference: %#v", prepared)
	}
}

func TestAgentMediaContinuationPreservesUnchangedVisualDetails(t *testing.T) {
	previous := referenceImage(1, true)
	previous.SeriesProfile = map[string]any{"prompt": "原有主体与物品的画面描述"}
	for _, tc := range []struct {
		name       string
		mode       string
		params     []energonservice.PowerParam
		references []runtimeprovider.MediaReference
		baseline   string
	}{
		{"image reference", "continue", []energonservice.PowerParam{referenceFileParam("image")}, []runtimeprovider.MediaReference{previous}, "实际输入的参考图"},
		{"text-only capability", "continue", nil, []runtimeprovider.MediaReference{previous}, "上一张图片的文字基准"},
		{"new theme", "new", []energonservice.PowerParam{referenceFileParam("image")}, []runtimeprovider.MediaReference{previous}, ""},
		{"first image", "", nil, nil, ""},
	} {
		t.Run(tc.name, func(t *testing.T) {
			const request = "改变拍摄视角，并按要求更换服装颜色"
			tool := referencePower("image", tc.params, tc.references, nil)
			prepared := preparedReferenceCall(t, tool, map[string]any{
				"prompt": request, runtimeprovider.MediaSeriesModeArgument: tc.mode,
			})
			prompt := prepared["prompt"].(string)
			if tc.baseline == "" {
				if prompt != request {
					t.Fatalf("independent image inherited continuity rules: %s", prompt)
				}
				return
			}
			for _, expected := range []string{request, tc.baseline, "服装款式与颜色", "用户明确要求更换的要素按本次要求修改"} {
				if !strings.Contains(prompt, expected) {
					t.Fatalf("continuation lost %q: %s", expected, prompt)
				}
			}
			if strings.Count(prompt, "连续画面要求：") != 1 || strings.Contains(prompt, "只继承风格") {
				t.Fatalf("continuation rule duplicated or weakened: %s", prompt)
			}
			if len(tc.params) == 0 && !strings.Contains(prompt, previous.SeriesProfile["prompt"].(string)) {
				t.Fatal("text-only capability lost the prior description")
			}
		})
	}
}

func TestAgentMediaHiddenSemanticArgumentsAreIgnored(t *testing.T) {
	current := referenceImage(2, false)
	image := referencePower("image", []energonservice.PowerParam{referenceFileParam("image")}, []runtimeprovider.MediaReference{current}, nil)
	prepared := preparedReferenceCall(t, image, map[string]any{runtimeprovider.MediaSeriesModeArgument: "continue"})
	if _, exists := prepared[runtimeprovider.MediaSeriesModeArgument]; exists {
		t.Fatalf("hidden image series mode affected a session without an active series: %#v", prepared)
	}

	video := referencePower("video", []energonservice.PowerParam{referenceFileParam("firstFrame")}, []runtimeprovider.MediaReference{current}, nil)
	prepared = preparedReferenceCall(t, video, map[string]any{runtimeprovider.MediaPreviousImageArgument: "previous"})
	if _, exists := prepared[runtimeprovider.MediaPreviousImageArgument]; exists {
		t.Fatalf("hidden previous-image choice affected a video with current media: %#v", prepared)
	}
}

func TestAgentVideoReferenceModes(t *testing.T) {
	first, last, previous := referenceImage(1, false), referenceImage(2, false), referenceImage(3, true)
	first.ParameterKey, last.ParameterKey = "agent_attachment", "agent_attachment"
	params := []energonservice.PowerParam{
		{Key: "referenceMode", Type: "option", ValueType: "string", DefaultValue: "frames"},
		referenceFileParam("firstFrame"), referenceFileParam("lastFrame"),
		{Key: "images", Type: "files", ValueType: "array", AcceptedKinds: []string{"image"}},
	}
	params[1].ActiveWhenKey, params[1].ActiveWhenValue = "referenceMode", "frames"
	params[2].ActiveWhenKey, params[2].ActiveWhenValue = "referenceMode", "frames"
	params[3].ActiveWhenKey, params[3].ActiveWhenValue = "referenceMode", "references"
	for _, tc := range []struct {
		name string
		refs []runtimeprovider.MediaReference
		args map[string]any
		want map[string]any
	}{
		{"one frame", []runtimeprovider.MediaReference{first}, nil, map[string]any{"firstFrame": first.URL}},
		{"two frames", []runtimeprovider.MediaReference{first, last}, nil, map[string]any{"firstFrame": first.URL, "lastFrame": last.URL}},
		{"multiple references", []runtimeprovider.MediaReference{first, last}, map[string]any{"referenceMode": "references"}, map[string]any{"images": []string{first.URL, last.URL}}},
		{"previous image", []runtimeprovider.MediaReference{previous}, map[string]any{runtimeprovider.MediaPreviousImageArgument: "previous"}, map[string]any{"firstFrame": previous.URL}},
		{"independent video", []runtimeprovider.MediaReference{previous}, map[string]any{runtimeprovider.MediaPreviousImageArgument: "none"}, map[string]any{}},
		{"current wins", []runtimeprovider.MediaReference{first, previous}, map[string]any{runtimeprovider.MediaPreviousImageArgument: "previous"}, map[string]any{"firstFrame": first.URL}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			prepared := preparedReferenceCall(t, referencePower("video", params, tc.refs, nil), tc.args)
			for _, key := range []string{"firstFrame", "lastFrame", "images"} {
				if !reflect.DeepEqual(prepared[key], tc.want[key]) {
					t.Fatalf("%s: got %#v want %#v", key, prepared[key], tc.want[key])
				}
			}
		})
	}
}

func TestAgentMediaFixedFrameUsageWins(t *testing.T) {
	current := referenceImage(1, false)
	current.ParameterKey = "agent_attachment"
	fixed := map[string]any{runtimeprovider.MediaReferencesArgument: []map[string]any{
		{"ref_type": "artifact", "ref_id": current.ArtifactID, "param_key": "lastFrame"},
	}}
	tool := referencePower("video", []energonservice.PowerParam{referenceFileParam("firstFrame"), referenceFileParam("lastFrame")}, []runtimeprovider.MediaReference{current}, fixed)
	prepared := preparedReferenceCall(t, tool, nil)
	if prepared["firstFrame"] != nil || prepared["lastFrame"] != current.URL {
		t.Fatalf("fixed last-frame usage changed: %#v", prepared)
	}
}

func TestAgentMediaPromptMaterialDoesNotRequireModelVisibleIdentity(t *testing.T) {
	scope := runtimeprovider.ReferenceScopeFromInput(map[string]any{"references": []map[string]any{
		{"title": "主题", "prompt": "用户选定的主题"},
	}})
	prepared := runtimeprovider.ApplyPromptReferences(map[string]any{"prompt": "补充细节"}, "prompt", scope)
	if !strings.HasPrefix(prepared["prompt"].(string), "用户选定的主题\n") {
		t.Fatalf("identity-free prompt material was lost: %#v", prepared)
	}
}

func TestAgentPreparedJobDoesNotReplan(t *testing.T) {
	previous := referenceImage(1, true)
	tool := referencePower("image", []energonservice.PowerParam{referenceFileParam("image")}, []runtimeprovider.MediaReference{previous}, nil)
	prepared := preparedReferenceCall(t, tool, map[string]any{runtimeprovider.MediaSeriesModeArgument: "continue"})
	// Serialize exactly as an asynchronous job does, then advance the session.
	raw, _ := json.Marshal(prepared)
	var restored map[string]any
	if err := json.Unmarshal(raw, &restored); err != nil {
		t.Fatal(err)
	}
	tool.AddMediaReferences([]runtimeprovider.MediaReference{referenceImage(2, true)})
	tool.Handle = func(_ context.Context, call runtimeprovider.Call) (runtimeprovider.Result, error) {
		if call.Arguments["image"] != previous.URL {
			t.Fatalf("queued reference changed: %#v", call.Arguments)
		}
		if call.Arguments["prompt"] != prepared["prompt"] || strings.Count(call.Arguments["prompt"].(string), "连续画面要求：") != 1 {
			t.Fatal("job recovery changed or duplicated its continuity instructions")
		}
		return runtimeprovider.Result{}, nil
	}
	registry, err := runtimetool.NewRegistry(tool)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := registry.ExecutePrepared(context.Background(), botprotocol.ToolCall{Name: tool.Definition.Name}, restored, "job", nil, nil); err != nil {
		t.Fatal(err)
	}
	sources, err := runtimeprovider.ArtifactReferences(restored)
	if err != nil || len(sources) != 1 || sources[0].ArtifactID != previous.ArtifactID {
		t.Fatalf("persisted lineage changed: %#v %v", sources, err)
	}
}

func TestAgentMediaNextCallUsesNewestReadyImage(t *testing.T) {
	previous, newest := referenceImage(1, true), referenceImage(2, true)
	tool := referencePower("image", []energonservice.PowerParam{referenceFileParam("image")}, []runtimeprovider.MediaReference{previous}, nil)
	tool.AddMediaReferences([]runtimeprovider.MediaReference{newest})
	prepared := preparedReferenceCall(t, tool, map[string]any{runtimeprovider.MediaSeriesModeArgument: "continue"})
	if prepared["image"] != newest.URL {
		t.Fatalf("next call retained a mount-time reference: %#v", prepared)
	}
}

func TestAgentMediaBatchLimit(t *testing.T) {
	tool := referencePower("image", nil, nil, nil)
	registry, err := runtimetool.NewRegistry(tool)
	if err != nil {
		t.Fatal(err)
	}
	for _, count := range []int{runtimeprovider.MaxMediaExecutionCount, runtimeprovider.MaxMediaExecutionCount + 1} {
		_, err := registry.PrepareArguments(tool.Definition.Name, map[string]any{
			"prompt": "测试画面", runtimeprovider.MediaArtifactTitleArgument: "测试画面素材", "__runtime_count": count,
		})
		if (err != nil) != (count > runtimeprovider.MaxMediaExecutionCount) {
			t.Fatalf("unexpected batch limit outcome for %d: %v", count, err)
		}
	}
}

func TestAgentMediaDefinitionDoesNotMutateRequiredSchema(t *testing.T) {
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"image":  map[string]any{"type": "string"},
			"prompt": map[string]any{"type": "string"},
		},
		"required": []any{"image", "prompt"},
	}
	before, _ := json.Marshal(parameters)
	tool := runtimeprovider.PowerTool(
		energonmodel.Power{Key: "reference_test", Kind: "image"},
		energonservice.PowerParamConfig{Params: []energonservice.PowerParam{referenceFileParam("image")}},
		parameters, nil, energonservice.GatewayService{}, runtimeprovider.Transport{}, nil,
		runtimeprovider.ReferenceScope{}, botprotocol.BillingContext{}, runtimeprovider.PowerTargetAccess{},
	)
	first, _ := json.Marshal(tool.CurrentDefinition().Native())
	second, _ := json.Marshal(tool.CurrentDefinition().Native())
	after, _ := json.Marshal(parameters)
	if string(before) != string(after) || string(first) != string(second) {
		t.Fatalf("dynamic schema mutated shared input: before=%s after=%s first=%s second=%s", before, after, first, second)
	}
}
