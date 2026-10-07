package test

import (
	"context"
	"reflect"
	"strings"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func TestPowerParamCompatibilityUnmappedInput(t *testing.T) {
	for _, testCase := range []struct {
		name         string
		paramType    string
		valueType    string
		defaultValue string
		show         int16
		required     bool
		input        map[string]any
		wantError    string
	}{
		{name: "absent_default", defaultValue: "1:1"},
		{name: "required_by_source_absent_default", required: true, defaultValue: "1:1"},
		{name: "optional_always_absent_default", show: botmodel.PowerParamShowAlways, defaultValue: "1:1"},
		{name: "optional_always_explicit", show: botmodel.PowerParamShowAlways, defaultValue: "1:1", input: map[string]any{"ratio": "1:1"}, wantError: "未配置服务映射"},
		{name: "explicit", defaultValue: "1:1", input: map[string]any{"ratio": "16:9"}, wantError: "来源专属参数“比例”未配置服务映射"},
		{name: "explicit_default", defaultValue: "1:1", input: map[string]any{"ratio": "1:1"}, wantError: "来源专属参数“比例”未配置服务映射"},
		{name: "param_alias", defaultValue: "1:1", input: map[string]any{"param_102": "16:9"}, wantError: "来源专属参数“比例”未配置服务映射"},
		{name: "empty", defaultValue: "1:1", input: map[string]any{"ratio": " "}},
		{name: "nil", defaultValue: "1:1", input: map[string]any{"ratio": nil}},
		{name: "empty_with_alias", defaultValue: "1:1", input: map[string]any{"ratio": "", "param_102": "16:9"}, wantError: "来源专属参数“比例”未配置服务映射"},
		{name: "switch_false", paramType: "switch", valueType: "bool", defaultValue: "true", input: map[string]any{"ratio": false}},
		{name: "switch_alias_false", paramType: "switch", valueType: "bool", defaultValue: "true", input: map[string]any{"param_102": false}},
		{name: "switch_true", paramType: "switch", valueType: "bool", input: map[string]any{"ratio": true}, wantError: "来源专属参数“比例”未配置服务映射"},
		{name: "number_zero", valueType: "number", input: map[string]any{"ratio": 0}, wantError: "来源专属参数“比例”未配置服务映射"},
		{name: "empty_multi_option", paramType: "multi_option", defaultValue: `["square"]`, input: map[string]any{"ratio": []any{}}},
		{name: "empty_files", paramType: "files", defaultValue: `["https://example.invalid/default.png"]`, input: map[string]any{"ratio": []string{}}},
		{name: "explicit_file", paramType: "file", input: map[string]any{"ratio": "https://example.invalid/input.png"}, wantError: "附件参数“比例”未配置服务映射"},
		{name: "explicit_files_alias", paramType: "files", input: map[string]any{"param_102": []string{"https://example.invalid/input.png"}}, wantError: "附件参数“比例”未配置服务映射"},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			repo := newPowerParamCompatibilityRepository()
			param := repo.params[102]
			param.DefaultValue = testCase.defaultValue
			if testCase.show != 0 {
				repo.powerParams[1].Show = testCase.show
			}
			if testCase.required {
				repo.powerParams[1].Status = 1
			}
			if testCase.paramType != "" {
				param.Type = testCase.paramType
			}
			if testCase.valueType != "" {
				param.ValueType = testCase.valueType
			}
			repo.params[param.ID] = param
			assertPowerParamCompatibility(t, repo, testCase.input, testCase.wantError)
		})
	}
}

func TestPowerParamCompatibilityRequiredScope(t *testing.T) {
	for _, testCase := range []struct {
		name      string
		show      int16
		mapped    bool
		input     map[string]any
		wantError string
	}{
		{name: "unmapped_by_source", show: botmodel.PowerParamShowBySource},
		{name: "unmapped_explicit_still_rejected", show: botmodel.PowerParamShowBySource, input: map[string]any{"ratio": "16:9"}, wantError: "未配置服务映射"},
		{name: "unmapped_always_visible", show: botmodel.PowerParamShowAlways},
		{name: "unmapped_always_explicit_rejected", show: botmodel.PowerParamShowAlways, input: map[string]any{"ratio": "16:9"}, wantError: "未配置服务映射"},
		{name: "mapped_remains_required", show: botmodel.PowerParamShowBySource, mapped: true, wantError: "缺少必填参数“比例”"},
		{name: "mapped_explicit", show: botmodel.PowerParamShowBySource, mapped: true, input: map[string]any{"ratio": "16:9"}},
		{name: "mapped_alias", show: botmodel.PowerParamShowBySource, mapped: true, input: map[string]any{"param_102": "16:9"}},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			repo := newPowerParamCompatibilityRepository()
			repo.powerParams[1].Status = 1
			repo.powerParams[1].Show = testCase.show
			if testCase.mapped {
				repo.addRatioMapping()
			}
			assertPowerParamCompatibility(t, repo, testCase.input, testCase.wantError)
		})
	}
}

func TestPowerParamCompatibilityMappedDefaults(t *testing.T) {
	for _, required := range []bool{false, true} {
		name := "optional"
		if required {
			name = "required"
		}
		t.Run(name, func(t *testing.T) {
			repo := newPowerParamCompatibilityRepository()
			repo.addRatioMapping()
			param := repo.params[102]
			param.DefaultValue = "1:1"
			repo.params[param.ID] = param
			if required {
				repo.powerParams[1].Status = 1
			}
			assertPowerParamCompatibility(t, repo, nil, "")
			mapped, err := botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{}, botinput.Target{PowerID: 201, ServiceID: 301})
			if err != nil {
				t.Fatal(err)
			}
			if got := mapped.NativeBody()["native_ratio"]; got != "1:1" {
				t.Fatalf("mapped default = %#v, want 1:1", got)
			}
		})
	}
}

func TestPowerParamCompatibilityLegacyPassThrough(t *testing.T) {
	for _, testCase := range []struct {
		name          string
		serviceParams []botmodel.ServiceParam
	}{
		{name: "no_rows"},
		{name: "no_active_rows", serviceParams: []botmodel.ServiceParam{{ID: 1, ServiceID: 301, ParamID: 101, Key: "prompt", Status: 2}}},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			repo := newPowerParamCompatibilityRepository()
			repo.serviceParams = testCase.serviceParams
			repo.powerParams[1].Show = botmodel.PowerParamShowAlways
			values := map[string]any{"ratio": "16:9", "prompt": "draw"}
			assertPowerParamCompatibility(t, repo, values, "")
			mapped, err := botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{Input: values}, botinput.Target{PowerID: 201, ServiceID: 301})
			if err != nil {
				t.Fatal(err)
			}
			if !reflect.DeepEqual(mapped.Original, values) {
				t.Fatalf("legacy input = %#v, want %#v", mapped.Original, values)
			}
		})
	}
}

func TestPowerParamCompatibilitySupportSchema(t *testing.T) {
	for _, testCase := range []struct {
		name          string
		serviceID     uint64
		serviceParams []botmodel.ServiceParam
		wantIDs       map[uint64]bool
		wantVisible   bool
	}{
		{name: "unknown_service", wantVisible: true},
		{name: "no_rows", serviceID: 301, wantVisible: true},
		{name: "no_active_rows", serviceID: 301, serviceParams: []botmodel.ServiceParam{{ID: 1, ParamID: 102, Status: 2}}, wantVisible: true},
		{name: "fixed_only", serviceID: 301, serviceParams: []botmodel.ServiceParam{{ID: 1, ParamRule: botmodel.ServiceParamRuleFixed, Status: 1}}, wantIDs: map[uint64]bool{}},
		{name: "mapped", serviceID: 301, serviceParams: []botmodel.ServiceParam{{ID: 1, ParamID: 102, ParamRule: botmodel.ServiceParamRuleDirect, Status: 1}}, wantIDs: map[uint64]bool{102: true}, wantVisible: true},
		{name: "condition_controller", serviceID: 301, serviceParams: []botmodel.ServiceParam{{ID: 1, ActiveWhenParamID: 102, ParamRule: botmodel.ServiceParamRuleFixed, Status: 1}}, wantIDs: map[uint64]bool{102: true}, wantVisible: true},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			repo := newPowerParamCompatibilityRepository()
			repo.powerParams[1].Show = botmodel.PowerParamShowAlways
			repo.serviceParams = testCase.serviceParams
			supported := botinput.ActiveServiceParamIDs(context.Background(), repo, testCase.serviceID)
			if !reflect.DeepEqual(supported, testCase.wantIDs) {
				t.Fatalf("supported parameters = %#v, want %#v", supported, testCase.wantIDs)
			}
			visible := false
			for _, param := range botinput.BuildPowerParams(context.Background(), repo, 201, testCase.serviceID) {
				if param.ParamID == 102 {
					visible = true
				}
			}
			if visible != testCase.wantVisible {
				t.Fatalf("optional parameter visible = %v, want %v", visible, testCase.wantVisible)
			}
		})
	}
}

func TestPowerParamCompatibilityInactiveConditionalCleanup(t *testing.T) {
	repo := newPowerParamCompatibilityRepository()
	repo.addRatioMapping()
	repo.powerParams[1].Status = 1
	repo.params[103] = botmodel.Param{ID: 103, Name: "模式", Key: "mode", Type: "input", ValueType: "string", DefaultValue: "free", Status: 1}
	repo.powerParams = append(repo.powerParams, botmodel.PowerParam{ID: 3, PowerID: 201, ParamID: 103, Show: botmodel.PowerParamShowBySource, Status: 2})
	repo.serviceParams[1].ActiveWhenParamID = 103
	repo.serviceParams[1].ActiveWhenValue = "fixed"
	values := map[string]any{"mode": "free", "ratio": "16:9", "param_102": "16:9"}
	assertPowerParamCompatibility(t, repo, values, "")
	mapped, err := botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{Input: values}, botinput.Target{PowerID: 201, ServiceID: 301})
	if err != nil {
		t.Fatal(err)
	}
	for _, key := range []string{"mode", "ratio", "param_102", "native_ratio"} {
		if value, exists := mapped.Original[key]; exists {
			t.Errorf("inactive value %s survived cleanup: %#v", key, value)
		}
	}
	if _, exists := mapped.NativeBody()["native_ratio"]; exists {
		t.Error("inactive ratio must not reach the provider")
	}
	assertPowerParamCompatibility(t, repo, map[string]any{"mode": "fixed"}, "缺少必填参数“比例”")
}

func TestPowerParamCompatibilityResolveDefaultSemantics(t *testing.T) {
	param := botmodel.Param{ID: 102, Key: "ratio", Type: "input", ValueType: "string", DefaultValue: "1:1"}
	for _, testCase := range []struct {
		name  string
		input map[string]any
		key   string
		value any
	}{
		{name: "absent", key: "ratio", value: "1:1"},
		{name: "empty", input: map[string]any{"ratio": ""}, key: "ratio", value: "1:1"},
		{name: "alias", input: map[string]any{"param_102": "16:9"}, key: "param_102", value: "16:9"},
		{name: "false_is_present", input: map[string]any{"ratio": false}, key: "ratio", value: false},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			key, value, exists := botinput.ResolveParamValue(testCase.input, param)
			if !exists || key != testCase.key || !reflect.DeepEqual(value, testCase.value) {
				t.Fatalf("resolved (%q, %#v, %v), want (%q, %#v, true)", key, value, exists, testCase.key, testCase.value)
			}
		})
	}
}

func assertPowerParamCompatibility(t *testing.T, repo powerParamCompatibilityRepository, values map[string]any, wantError string) {
	t.Helper()
	err := botinput.ValidateTargetCompatibility(context.Background(), repo, &botprotocol.ShemicRequest{Input: values}, botinput.Target{PowerID: 201, ServiceID: 301})
	if wantError == "" {
		if err != nil {
			t.Fatalf("unexpected incompatibility: %v", err)
		}
		return
	}
	if err == nil || !strings.Contains(err.Error(), wantError) {
		t.Fatalf("compatibility error = %v, want %q", err, wantError)
	}
}

type powerParamCompatibilityRepository struct {
	params        map[uint64]botmodel.Param
	powerParams   []botmodel.PowerParam
	serviceParams []botmodel.ServiceParam
}

func newPowerParamCompatibilityRepository() powerParamCompatibilityRepository {
	return powerParamCompatibilityRepository{
		params: map[uint64]botmodel.Param{
			101: {ID: 101, Name: "提示词", Key: "prompt", Type: "input", ValueType: "string", Status: 1},
			102: {ID: 102, Name: "比例", Key: "ratio", Type: "input", ValueType: "string", Status: 1},
		},
		powerParams: []botmodel.PowerParam{
			{ID: 1, PowerID: 201, ParamID: 101, Show: botmodel.PowerParamShowAlways, Status: 2},
			{ID: 2, PowerID: 201, ParamID: 102, Show: botmodel.PowerParamShowBySource, Status: 2},
		},
		serviceParams: []botmodel.ServiceParam{
			{ID: 1, ServiceID: 301, ParamID: 101, Key: "prompt", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1},
		},
	}
}

func (repo *powerParamCompatibilityRepository) addRatioMapping() {
	repo.serviceParams = append(repo.serviceParams, botmodel.ServiceParam{ID: 2, ServiceID: 301, ParamID: 102, Key: "native_ratio", ParamRule: botmodel.ServiceParamRuleDirect, Status: 1})
}

func (repo powerParamCompatibilityRepository) ParamMap(context.Context) map[uint64]botmodel.Param {
	return repo.params
}

func (repo powerParamCompatibilityRepository) PowerParamsByPower(context.Context, uint64) []botmodel.PowerParam {
	return repo.powerParams
}

func (repo powerParamCompatibilityRepository) ServiceParamsByService(context.Context, uint64) []botmodel.ServiceParam {
	return repo.serviceParams
}

func (powerParamCompatibilityRepository) ServiceEndpointsByService(context.Context, uint64) []botmodel.ServiceEndpoint {
	return nil
}

func (powerParamCompatibilityRepository) ParamOptionsByParam(context.Context, uint64) []botmodel.ParamOption {
	return nil
}
