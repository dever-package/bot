package test

import (
	"context"
	"fmt"
	"reflect"
	"strings"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botadapters "github.com/dever-package/bot/service/energon/protocol/adapters"
)

func TestPowerParamSourceScopeUnmappedTypes(t *testing.T) {
	for _, paramCase := range []struct {
		controlType string
		valueType   string
		value       any
		defaultText string
	}{
		{controlType: "prompt", value: "content", defaultText: "content"},
		{controlType: "input", value: "content", defaultText: "content"},
		{controlType: "textarea", value: "content", defaultText: "content"},
		{controlType: "number", valueType: "number", value: 7, defaultText: "7"},
		{controlType: "option", value: "square", defaultText: "square"},
		{controlType: "multi_option", value: []any{"square"}, defaultText: `["square"]`},
		{controlType: "switch", valueType: "number", value: true, defaultText: "1"},
		{controlType: "file", value: "https://example.invalid/input.png", defaultText: "https://example.invalid/default.png"},
		{controlType: "files", value: []string{"https://example.invalid/input.png"}, defaultText: `["https://example.invalid/default.png"]`},
		{controlType: "hidden", value: "content", defaultText: "content"},
		{controlType: "description", value: "content", defaultText: "content"},
	} {
		for _, show := range []int16{1, 2} {
			for _, required := range []int16{1, 2} {
				for _, withDefault := range []bool{false, true} {
					name := fmt.Sprintf("%s/show_%d/required_%d/default_%t", paramCase.controlType, show, required, withDefault)
					t.Run(name, func(t *testing.T) {
						repo := newPowerParamCompatibilityRepository()
						param := repo.params[102]
						param.Type, param.ValueType = paramCase.controlType, paramCase.valueType
						if withDefault {
							param.DefaultValue = paramCase.defaultText
						}
						repo.params[102] = param
						repo.powerParams[1].Show, repo.powerParams[1].Status = show, required
						ctx := context.Background()
						for _, rows := range [][]botinput.PowerParam{
							botinput.BuildPowerParams(ctx, repo, 201, 301),
							botinput.BuildPowerParamsForServices(ctx, repo, 201, []uint64{301}),
						} {
							if len(rows) != 1 || rows[0].ParamID != 101 {
								t.Errorf("unsupported parameter entered form: %#v", rows)
							}
						}
						values := map[string]any{"prompt": "draw"}
						request := &botprotocol.ShemicRequest{Input: values}
						target := botinput.Target{PowerID: 201, ServiceID: 301}
						if err := botinput.ValidateTargetCompatibility(ctx, repo, request, target); err != nil {
							t.Errorf("omitted unsupported parameter rejected: %v", err)
						}
						mapped, err := botinput.BuildMapped(ctx, repo, request, target)
						if err != nil {
							t.Errorf("omitted unsupported parameter required: %v", err)
						} else if !reflect.DeepEqual(mapped.Original, values) || !reflect.DeepEqual(mapped.NativeBody(), values) {
							t.Errorf("unsupported default entered request: original=%#v native=%#v", mapped.Original, mapped.NativeBody())
						}
						for _, key := range []string{"ratio", "param_102"} {
							request.Input = map[string]any{"prompt": "draw", key: paramCase.value}
							err := botinput.ValidateTargetCompatibility(ctx, repo, request, target)
							if err == nil || !strings.Contains(err.Error(), "未配置服务映射") {
								t.Errorf("explicit unsupported %s: error=%v", key, err)
							}
						}
					})
				}
			}
		}
	}
}

func TestPowerParamSourceScopeUnmappedRequiredPrompt(t *testing.T) {
	repo := newPowerParamCompatibilityRepository()
	param := repo.params[101]
	param.Type, param.DefaultValue = "prompt", "default prompt"
	repo.params[101] = param
	repo.powerParams[0].Status = 1
	repo.serviceParams = nil
	repo.addRatioMapping()
	rows := botinput.BuildPowerParams(context.Background(), repo, 201, 301)
	if len(rows) != 1 || rows[0].ParamID != 102 {
		t.Errorf("unmapped required prompt entered form: %#v", rows)
	}
	assertPowerParamCompatibility(t, repo, map[string]any{"ratio": "1:1"}, "")
	assertPowerParamCompatibility(t, repo, map[string]any{"prompt": "draw", "ratio": "1:1"}, "未配置服务映射")
	mapped, err := botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{Input: map[string]any{"ratio": "1:1"}}, botinput.Target{PowerID: 201, ServiceID: 301})
	if err != nil {
		t.Fatal(err)
	}
	if _, exists := mapped.Original["prompt"]; exists {
		t.Errorf("unmapped prompt default entered request: %#v", mapped.Original)
	}
}

func TestPowerParamSourceScopeMediaShapes(t *testing.T) {
	for _, withFrame := range []bool{false, true} {
		name := "image_prompt_only"
		if withFrame {
			name = "video_prompt_and_frame"
		}
		t.Run(name, func(t *testing.T) {
			repo := newPowerParamCompatibilityRepository()
			repo.params = map[uint64]botmodel.Param{
				101: {ID: 101, Key: "prompt", Type: "prompt", Status: 1},
				102: {ID: 102, Key: "resolution", Type: "option", DefaultValue: "2k", Status: 1},
				103: {ID: 103, Key: "aspectRatio", Type: "option", DefaultValue: "1:1", Status: 1},
				104: {ID: 104, Key: "frame", Type: "file", Status: 1},
				105: {ID: 105, Key: "duration", Type: "number", ValueType: "number", Status: 1},
			}
			repo.powerParams = nil
			for paramID := uint64(101); paramID <= 105; paramID++ {
				repo.powerParams = append(repo.powerParams, botmodel.PowerParam{ID: paramID, ParamID: paramID, Show: 1, Status: 1, Sort: int(paramID - 101)})
			}
			values := map[string]any{"prompt": "draw"}
			wantKeys := []string{"prompt"}
			if withFrame {
				repo.serviceParams = append(repo.serviceParams, botmodel.ServiceParam{ID: 2, ServiceID: 301, ParamID: 104, Key: "frame", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[1]", Status: 1})
				values["frame"] = "https://example.invalid/frame.png"
				wantKeys = append(wantKeys, "frame")
			}
			var keys []string
			for _, row := range botinput.BuildPowerParams(context.Background(), repo, 201, 301) {
				keys = append(keys, row.Key)
				if !row.Required {
					t.Errorf("supported required parameter became optional: %s", row.Key)
				}
			}
			if !reflect.DeepEqual(keys, wantKeys) {
				t.Errorf("form keys=%v, want %v", keys, wantKeys)
			}
			assertPowerParamCompatibility(t, repo, values, "")
			mapped, err := botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{Input: values}, botinput.Target{PowerID: 201, ServiceID: 301})
			if err != nil || !reflect.DeepEqual(mapped.NativeBody(), values) {
				t.Fatalf("native body=%#v, error=%v, want %#v", mapped.NativeBody(), err, values)
			}
		})
	}
}

func TestPowerParamSourceScopeConditions(t *testing.T) {
	repo := sourceScopeConditionRepository{powerParamCompatibilityRepository: newPowerParamCompatibilityRepository()}
	repo.params = map[uint64]botmodel.Param{
		101: {ID: 101, Name: "提示词", Key: "prompt", Type: "prompt", Status: 1},
		102: {ID: 102, Name: "参考模式", Key: "referenceMode", Type: "input", DefaultValue: "enabled", Status: 1},
		103: {ID: 103, Name: "参考图", Key: "image", Type: "files", MaxFiles: 2, Status: 1},
		104: {ID: 104, Name: "大小", Key: "size", Type: "option", Status: 1},
		105: {ID: 105, Name: "比例", Key: "ratio", Type: "option", Status: 1},
		106: {ID: 106, Name: "固定开关", Key: "fixedMode", Type: "input", DefaultValue: "enabled", Status: 1},
	}
	repo.powerParams = nil
	for paramID := uint64(101); paramID <= 106; paramID++ {
		repo.powerParams = append(repo.powerParams, botmodel.PowerParam{ID: paramID, ParamID: paramID, Show: 2, Status: 1, Sort: int(paramID)})
	}
	repo.serviceParams = append(repo.serviceParams,
		botmodel.ServiceParam{ID: 2, ParamID: 103, Key: "first_image", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[1]", ActiveWhenParamID: 102, ActiveWhenValue: "enabled", Status: 1},
		botmodel.ServiceParam{ID: 3, ParamID: 103, Key: "last_image", ParamRule: botmodel.ServiceParamRuleAttachment, Mapping: "[2]", ActiveWhenParamID: 102, ActiveWhenValue: "enabled", Status: 1},
		botmodel.ServiceParam{ID: 4, ParamID: 104, Key: "dimensions", ParamRule: botmodel.ServiceParamRuleCombo, Mapping: `{"params":[104,105],"rows":[{"values":{"104":1,"105":2},"native_value":"1024x1024"}]}`, ActiveWhenParamID: 102, ActiveWhenValue: "enabled", Status: 1},
		botmodel.ServiceParam{ID: 5, ParamID: 103, Key: "image_type", ParamRule: botmodel.ServiceParamRuleFixed, Mapping: "reference", Status: 1},
		botmodel.ServiceParam{ID: 6, Key: "fixed_flag", ParamRule: botmodel.ServiceParamRuleFixed, Mapping: "active", ActiveWhenParamID: 106, ActiveWhenValue: "enabled", Status: 1},
	)
	ctx := context.Background()
	rows := botinput.BuildPowerParams(ctx, repo, 201, 301)
	seen := map[uint64]bool{}
	for _, row := range rows {
		seen[row.ParamID] = true
		if row.ParamID == 103 && (row.MaxFiles != 2 || row.ActiveWhenKey != "referenceMode") {
			t.Errorf("file mapping condition/capacity lost: %#v", row)
		}
	}
	if len(seen) != 6 {
		t.Fatalf("controller/combo/file parameters lost: %v", seen)
	}
	for _, enabled := range []bool{false, true} {
		t.Run(fmt.Sprintf("enabled_%t", enabled), func(t *testing.T) {
			values := map[string]any{"prompt": "draw", "image": []string{"https://example.invalid/first.png", "https://example.invalid/last.png"}}
			wantBody := map[string]any{"prompt": "draw"}
			if enabled {
				wantBody["first_image"] = "https://example.invalid/first.png"
				wantBody["last_image"] = "https://example.invalid/last.png"
				wantBody["dimensions"] = "1024x1024"
				wantBody["image_type"] = "reference"
				wantBody["fixed_flag"] = "active"
			} else {
				values["referenceMode"], values["fixedMode"] = "disabled", "disabled"
			}
			request := &botprotocol.ShemicRequest{Input: values}
			target := botinput.Target{PowerID: 201, ServiceID: 301}
			if err := botinput.ValidateTargetCompatibility(ctx, repo, request, target); err != nil {
				t.Fatal(err)
			}
			mapped, err := botinput.BuildMapped(ctx, repo, request, target)
			if err != nil {
				t.Fatal(err)
			}
			mappedValues := map[string]any{}
			for _, param := range mapped.Params {
				mappedValues[param.NativeKey] = param.Value
			}
			if !reflect.DeepEqual(mappedValues, wantBody) {
				t.Fatalf("mapped values=%#v, want %#v", mappedValues, wantBody)
			}
			for _, controller := range []string{"referenceMode", "fixedMode"} {
				if _, exists := mapped.NativeBody()[controller]; exists {
					t.Errorf("unmapped condition controller leaked to native body: %s", controller)
				}
			}
		})
	}
}

func TestPowerParamSourceScopeOpenAIAutomaticMapping(t *testing.T) {
	for _, inactiveRow := range []bool{false, true} {
		t.Run(fmt.Sprintf("inactive_row_%t", inactiveRow), func(t *testing.T) {
			repo := newPowerParamCompatibilityRepository()
			repo.params[102] = botmodel.Param{ID: 102, Key: "temperature", Type: "number", ValueType: "number", DefaultValue: "0.25", Status: 1}
			repo.powerParams[1].Show, repo.powerParams[1].Status = 1, 1
			if inactiveRow {
				repo.serviceParams[0].Status = 2
			} else {
				repo.serviceParams = nil
			}
			ctx := context.Background()
			if ids := botinput.ActiveServiceParamIDs(ctx, repo, 301); ids != nil {
				t.Fatalf("no active schema must remain nil: %v", ids)
			}
			request := &botprotocol.ShemicRequest{Protocol: "openai", Input: map[string]any{"prompt": "hello"}}
			target := botinput.Target{PowerID: 201, ServiceID: 301}
			if err := botinput.ValidateTargetCompatibility(ctx, repo, request, target); err != nil {
				t.Fatal(err)
			}
			mapped, err := botinput.BuildMapped(ctx, repo, request, target)
			if err != nil {
				t.Fatal(err)
			}
			native, err := (botadapters.OpenAIAdapter{}).BuildNativeRequest(botprotocol.NativeInput{Request: request, Mapped: mapped})
			if err != nil {
				t.Fatal(err)
			}
			if native.Body["temperature"] != float64(0.25) || !strings.Contains(fmt.Sprint(native.Body["messages"]), "hello") {
				t.Fatalf("automatic mapping lost native defaults or messages: %#v", native.Body)
			}
		})
	}
}

type sourceScopeConditionRepository struct {
	powerParamCompatibilityRepository
}

func (sourceScopeConditionRepository) ParamOptionsByParam(_ context.Context, paramID uint64) []botmodel.ParamOption {
	switch paramID {
	case 104:
		return []botmodel.ParamOption{{ID: 1, ParamID: 104, Name: "标准", Value: "standard"}}
	case 105:
		return []botmodel.ParamOption{{ID: 2, ParamID: 105, Name: "方形", Value: "square"}}
	default:
		return nil
	}
}
