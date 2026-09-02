package test

import (
	"context"
	"reflect"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	optionMappingTestParamID   uint64 = 101
	optionMappingTestPowerID   uint64 = 201
	optionMappingTestServiceID uint64 = 301
)

func TestServiceParamOptionMappingInheritsCanonicalOptionValue(t *testing.T) {
	body := buildOptionMappedBody(t, optionMappingTestConfig{
		paramType:  "option",
		valueType:  "number",
		inputValue: "8",
		mapping:    `[{"option_id":17,"native_value":""}]`,
		options: []botmodel.ParamOption{
			{ID: 17, ParamID: optionMappingTestParamID, Name: "8秒", Value: "8"},
		},
	})

	if got := body["duration"]; got != float64(8) {
		t.Fatalf("blank native value must inherit numeric option value 8, got %#v", got)
	}
}

func TestServiceParamOptionMappingKeepsExplicitNativeValue(t *testing.T) {
	body := buildOptionMappedBody(t, optionMappingTestConfig{
		paramType:  "option",
		valueType:  "number",
		inputValue: "8",
		mapping:    `[{"option_id":17,"native_value":"6"}]`,
		options: []botmodel.ParamOption{
			{ID: 17, ParamID: optionMappingTestParamID, Name: "8秒", Value: "8"},
		},
	})

	if got := body["duration"]; got != float64(6) {
		t.Fatalf("explicit native value must override the option value, got %#v", got)
	}
}

func TestServiceParamMultiOptionMappingInheritsEachBlankValue(t *testing.T) {
	body := buildOptionMappedBody(t, optionMappingTestConfig{
		paramType:  "multi_option",
		valueType:  "string",
		inputValue: []any{"first", "second"},
		mapping: `[
			{"option_id":21,"native_value":""},
			{"option_id":22,"native_value":"provider-second"}
		]`,
		options: []botmodel.ParamOption{
			{ID: 21, ParamID: optionMappingTestParamID, Name: "第一项", Value: "first"},
			{ID: 22, ParamID: optionMappingTestParamID, Name: "第二项", Value: "second"},
		},
	})

	want := []any{"first", "provider-second"}
	if got := body["duration"]; !reflect.DeepEqual(got, want) {
		t.Fatalf("multi-option mapping must inherit blanks and preserve explicit values: got %#v, want %#v", got, want)
	}
}

type optionMappingTestConfig struct {
	paramType  string
	valueType  string
	inputValue any
	mapping    string
	options    []botmodel.ParamOption
}

func buildOptionMappedBody(t *testing.T, config optionMappingTestConfig) map[string]any {
	t.Helper()
	repo := optionMappingTestRepository{
		param: botmodel.Param{
			ID:        optionMappingTestParamID,
			Name:      "时长",
			Key:       "duration",
			Type:      config.paramType,
			ValueType: config.valueType,
			Status:    1,
		},
		powerParam: botmodel.PowerParam{
			ID:      1,
			PowerID: optionMappingTestPowerID,
			ParamID: optionMappingTestParamID,
			Show:    botmodel.PowerParamShowAlways,
			Status:  2,
		},
		serviceParam: botmodel.ServiceParam{
			ID:        1,
			ServiceID: optionMappingTestServiceID,
			ParamID:   optionMappingTestParamID,
			ParamRule: botmodel.ServiceParamRuleOption,
			Key:       "duration",
			Mapping:   config.mapping,
			Status:    1,
		},
		options: config.options,
	}

	mapped, err := botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{
		Input: map[string]any{"duration": config.inputValue},
	}, botinput.Target{
		PowerID:   optionMappingTestPowerID,
		ServiceID: optionMappingTestServiceID,
	})
	if err != nil {
		t.Fatalf("build mapped input: %v", err)
	}
	return mapped.NativeBody()
}

type optionMappingTestRepository struct {
	param        botmodel.Param
	powerParam   botmodel.PowerParam
	serviceParam botmodel.ServiceParam
	options      []botmodel.ParamOption
}

func (repo optionMappingTestRepository) ParamMap(context.Context) map[uint64]botmodel.Param {
	return map[uint64]botmodel.Param{repo.param.ID: repo.param}
}

func (repo optionMappingTestRepository) PowerParamsByPower(context.Context, uint64) []botmodel.PowerParam {
	return []botmodel.PowerParam{repo.powerParam}
}

func (repo optionMappingTestRepository) ServiceParamsByService(context.Context, uint64) []botmodel.ServiceParam {
	return []botmodel.ServiceParam{repo.serviceParam}
}

func (optionMappingTestRepository) ServiceEndpointsByService(context.Context, uint64) []botmodel.ServiceEndpoint {
	return nil
}

func (repo optionMappingTestRepository) ParamOptionsByParam(context.Context, uint64) []botmodel.ParamOption {
	return append([]botmodel.ParamOption(nil), repo.options...)
}
