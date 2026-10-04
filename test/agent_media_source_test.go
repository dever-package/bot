package test

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
	"testing"

	energonmodel "github.com/dever-package/bot/model/energon"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func imageSourceConfigs() (energonservice.PowerParamConfig, map[uint64]energonservice.PowerParamConfig) {
	params := []energonservice.PowerParam{
		{ParamID: 1, ParamKey: "prompt", Key: "prompt", Type: "prompt", ValueType: "string", Required: true},
		{ParamID: 2, ParamKey: "single", Key: "single", Type: "file", ValueType: "string", AcceptedKinds: []string{"image"}},
		{ParamID: 3, ParamKey: "multiple", Key: "multiple", Type: "files", ValueType: "array", AcceptedKinds: []string{"image"}},
	}
	// 合并合同的单图参数在前，但首选来源实际使用多图参数。
	config := energonservice.PowerParamConfig{
		Params: params,
		Sources: []energonservice.PowerSource{
			{TargetID: 10, Name: "首选来源"}, {TargetID: 20, Name: "次选来源"},
		},
	}
	return config, map[uint64]energonservice.PowerParamConfig{
		10: {SelectedTargetID: 10, Params: []energonservice.PowerParam{params[0], params[2]}},
		20: {SelectedTargetID: 20, Params: []energonservice.PowerParam{params[0], params[1]}},
	}
}

func imageSourceTool(config energonservice.PowerParamConfig, references []runtimeprovider.MediaReference, access runtimeprovider.PowerTargetAccess) runtimeprovider.Tool {
	properties := make(map[string]any, len(config.Params))
	for _, param := range config.Params {
		properties[param.Key] = map[string]any{"type": "string"}
	}
	return runtimeprovider.PowerTool(
		energonmodel.Power{Key: "image_source_test", Kind: "image"}, config,
		map[string]any{"type": "object", "properties": properties}, nil,
		energonservice.GatewayService{}, runtimeprovider.Transport{}, references,
		runtimeprovider.ReferenceScope{}, botprotocol.BillingContext{}, access,
	)
}

func TestAgentMediaSourcePriorityUsesExactReferenceContract(t *testing.T) {
	previous := referenceImage(7, true)
	for _, rejectFirst := range []bool{false, true} {
		t.Run(fmt.Sprint(rejectFirst), func(t *testing.T) {
			config, contracts := imageSourceConfigs()
			var validated []uint64
			access := runtimeprovider.PowerTargetAccess{
				Config: func(id uint64) (energonservice.PowerParamConfig, error) { return contracts[id], nil },
				Validate: func(id uint64, input map[string]any) error {
					validated = append(validated, id)
					for key := range input {
						if strings.HasPrefix(key, "__runtime_") {
							t.Fatalf("private prepared argument leaked to provider validation: %s", key)
						}
					}
					if id == 10 && rejectFirst {
						return fmt.Errorf("该来源不支持本次参数")
					}
					return nil
				},
			}
			tool := imageSourceTool(config, []runtimeprovider.MediaReference{previous}, access)
			prepared := preparedReferenceCall(t, tool, map[string]any{
				runtimeprovider.MediaSeriesModeArgument: "continue", runtimeprovider.MediaSourceTargetArgument: 999,
			})
			wantTarget := uint64(10)
			wantValidation := []uint64{10}
			if rejectFirst {
				wantTarget, wantValidation = 20, []uint64{10, 20}
			}
			if runtimeprovider.ArgumentUint64(prepared, runtimeprovider.MediaSourceTargetArgument) != wantTarget || !reflect.DeepEqual(validated, wantValidation) {
				t.Fatalf("source priority changed: %#v / %v", prepared, validated)
			}
			if rejectFirst {
				if prepared["single"] != previous.URL || prepared["multiple"] != nil {
					t.Fatalf("wrong secondary contract binding: %#v", prepared)
				}
			} else if !reflect.DeepEqual(prepared["multiple"], []any{previous.URL}) || prepared["single"] != nil {
				t.Fatalf("merged parameter order forced the wrong source: %#v", prepared)
			}
			encoded, _ := json.Marshal(tool.CurrentDefinition().Native())
			if strings.Contains(string(encoded), runtimeprovider.MediaSourceTargetArgument) {
				t.Fatal("source selection leaked into model schema")
			}
		})
	}
}

func TestAgentMediaSourcePreservesExplicitAndIndependentRouting(t *testing.T) {
	previous := referenceImage(7, true)
	for _, scenario := range []string{"explicit source", "new theme", "first image"} {
		t.Run(scenario, func(t *testing.T) {
			config, contracts := imageSourceConfigs()
			refs := []runtimeprovider.MediaReference{previous}
			mode := "continue"
			switch scenario {
			case "explicit source":
				config = contracts[20]
			case "new theme":
				mode = "new"
			case "first image":
				refs = nil
			}
			tool := imageSourceTool(config, refs, runtimeprovider.PowerTargetAccess{
				Config: func(uint64) (energonservice.PowerParamConfig, error) {
					t.Fatal("unexpected automatic source selection")
					return energonservice.PowerParamConfig{}, nil
				},
			})
			prepared := preparedReferenceCall(t, tool, map[string]any{
				runtimeprovider.MediaSeriesModeArgument: mode, runtimeprovider.MediaSourceTargetArgument: 999,
			})
			if _, exists := prepared[runtimeprovider.MediaSourceTargetArgument]; exists {
				t.Fatalf("forged source survived: %#v", prepared)
			}
			if scenario == "explicit source" && prepared["single"] != previous.URL {
				t.Fatalf("explicit source contract was not retained: %#v", prepared)
			}
		})
	}
}

func TestAgentMediaSourceRequiresEveryCurrentImage(t *testing.T) {
	config, contracts := imageSourceConfigs()
	config.Sources[0], config.Sources[1] = config.Sources[1], config.Sources[0]
	first, second := referenceImage(8, false), referenceImage(9, false)
	tool := imageSourceTool(config, []runtimeprovider.MediaReference{referenceImage(7, true), first, second}, runtimeprovider.PowerTargetAccess{
		Config: func(id uint64) (energonservice.PowerParamConfig, error) { return contracts[id], nil },
		Validate: func(id uint64, _ map[string]any) error {
			if id != 10 {
				t.Fatal("single-image target accepted only part of the input images")
			}
			return nil
		},
	})
	prepared := preparedReferenceCall(t, tool, map[string]any{runtimeprovider.MediaSeriesModeArgument: "continue"})
	if !reflect.DeepEqual(prepared["multiple"], []any{first.URL, second.URL}) {
		t.Fatalf("current reference images changed: %#v", prepared)
	}
}

func TestAgentMediaSourceUsesExactContractForCurrentUploads(t *testing.T) {
	current := referenceImage(8, false)
	for _, existingSeries := range []bool{false, true} {
		t.Run(fmt.Sprint(existingSeries), func(t *testing.T) {
			config, contracts := imageSourceConfigs()
			refs := []runtimeprovider.MediaReference{current}
			if existingSeries {
				refs = append(refs, referenceImage(7, true))
			}
			tool := imageSourceTool(config, refs, runtimeprovider.PowerTargetAccess{
				Config: func(id uint64) (energonservice.PowerParamConfig, error) { return contracts[id], nil },
				Validate: func(id uint64, _ map[string]any) error {
					if id != 10 {
						t.Fatal("current upload forced the lower-priority single-image source")
					}
					return nil
				},
			})
			prepared := preparedReferenceCall(t, tool, map[string]any{runtimeprovider.MediaSeriesModeArgument: "new"})
			if !reflect.DeepEqual(prepared["multiple"], []any{current.URL}) || runtimeprovider.ArgumentUint64(prepared, runtimeprovider.MediaSourceTargetArgument) != 10 {
				t.Fatalf("current upload did not use exact source contract: %#v", prepared)
			}
			if strings.Contains(prepared["prompt"].(string), "连续画面要求") {
				t.Fatal("new theme inherited historical continuity constraints")
			}
		})
	}
}

func TestAgentMediaSourcePreparationOutlivesMountContext(t *testing.T) {
	executionCtx, cancelExecution := context.WithCancel(context.Background())
	defer cancelExecution()
	mountCtx, cancelMount := context.WithCancel(executionCtx)
	request := runtimetool.MountRequest{ExecutionContext: executionCtx, BuiltinOnly: true}
	mounted, err := runtimetool.Mount(mountCtx, request)
	if err != nil {
		t.Fatal(err)
	}
	defer mounted.Close()
	config, contracts := imageSourceConfigs()
	tool := imageSourceTool(config, []runtimeprovider.MediaReference{referenceImage(7, true)}, runtimeprovider.PowerTargetAccess{
		Config: func(id uint64) (energonservice.PowerParamConfig, error) {
			return contracts[id], request.ExecutionContext.Err()
		},
		Validate: func(uint64, map[string]any) error { return request.ExecutionContext.Err() },
	})
	if err := mounted.Registry.Add(tool); err != nil {
		t.Fatal(err)
	}
	cancelMount()
	arguments := map[string]any{"prompt": "继续画面", runtimeprovider.MediaArtifactTitleArgument: "继续画面素材", runtimeprovider.MediaSeriesModeArgument: "continue"}
	if _, err := mounted.Registry.PrepareArguments(tool.Definition.Name, arguments); err != nil {
		t.Fatalf("mount cleanup canceled later tool preparation: %v", err)
	}
	cancelExecution()
	if _, err := mounted.Registry.PrepareArguments(tool.Definition.Name, arguments); err == nil {
		t.Fatal("tool preparation ignored execution cancellation")
	}
	// 纯测试验证生命周期；接线合同确保真实数据库访问也使用同一执行上下文。
	mount := agentRuntimeFunction(t, "tool/mount.go", "mountPowerTools")
	for _, required := range []string{"executionCtx := request.ExecutionContext", "executionCtx = ctx", "PowerTargetParamConfig(executionCtx,", "ValidatePowerTarget(executionCtx,"} {
		if !strings.Contains(mount, required) {
			t.Fatalf("mount lost execution-context wiring: %s", required)
		}
	}
	loop := agentRuntimeFunction(t, "loop/mount.go", "mountExecutionTools")
	if !strings.Contains(loop, "ExecutionContext:       execution.scopedContext") {
		t.Fatal("agent loop did not provide the context that outlives mounting")
	}
}

func TestAgentMediaSourceDoesNotDowngradeToTextOnly(t *testing.T) {
	config, contracts := imageSourceConfigs()
	for id, contract := range contracts {
		contract.Params = contract.Params[:1]
		contracts[id] = contract
	}
	tool := imageSourceTool(config, []runtimeprovider.MediaReference{referenceImage(7, true)}, runtimeprovider.PowerTargetAccess{
		Config: func(id uint64) (energonservice.PowerParamConfig, error) { return contracts[id], nil },
		Validate: func(uint64, map[string]any) error {
			t.Fatal("text-only source must not receive an image continuation")
			return nil
		},
	})
	registry, err := runtimetool.NewRegistry(tool)
	if err != nil {
		t.Fatal(err)
	}
	_, err = registry.PrepareArguments(tool.Definition.Name, map[string]any{
		"prompt": "继续画面", runtimeprovider.MediaArtifactTitleArgument: "延续画面素材", runtimeprovider.MediaSeriesModeArgument: "continue",
	})
	if err == nil || !strings.Contains(err.Error(), "没有可接收参考图片的来源") {
		t.Fatalf("missing reference support silently downgraded to text: %v", err)
	}
}

func TestAgentPreparedImageSourceSurvivesJobRestore(t *testing.T) {
	config, contracts := imageSourceConfigs()
	selected := false
	var loaded []uint64
	access := runtimeprovider.PowerTargetAccess{
		Config: func(id uint64) (energonservice.PowerParamConfig, error) {
			loaded = append(loaded, id)
			return contracts[id], nil
		},
		Validate: func(uint64, map[string]any) error {
			if selected {
				t.Fatal("job restore selected a source again")
			}
			return nil
		},
	}
	tool := imageSourceTool(config, []runtimeprovider.MediaReference{referenceImage(7, true)}, access)
	prepared := preparedReferenceCall(t, tool, map[string]any{runtimeprovider.MediaSeriesModeArgument: "continue"})
	raw, _ := json.Marshal(prepared)
	var restored map[string]any
	if err := json.Unmarshal(raw, &restored); err != nil {
		t.Fatal(err)
	}
	selected, loaded = true, nil
	config.Sources[0], config.Sources[1] = config.Sources[1], config.Sources[0]
	tool = imageSourceTool(config, []runtimeprovider.MediaReference{referenceImage(10, true)}, access)
	tool.Handle = func(_ context.Context, call runtimeprovider.Call) (runtimeprovider.Result, error) {
		if runtimeprovider.ArgumentUint64(call.Arguments, runtimeprovider.MediaSourceTargetArgument) != 10 || !reflect.DeepEqual(call.Arguments["multiple"], []any{referenceImage(7, true).URL}) {
			t.Fatalf("job changed source or image: %#v", call.Arguments)
		}
		return runtimeprovider.Result{}, nil
	}
	registry, err := runtimetool.NewRegistry(tool)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := registry.ExecutePrepared(context.Background(), botprotocol.ToolCall{Name: tool.Definition.Name}, restored, "restored-image-job", nil, nil); err != nil {
		t.Fatal(err)
	}
	for _, id := range loaded {
		if id != 10 {
			t.Fatalf("job used a newly preferred source: %v", loaded)
		}
	}
}
