package test

import (
	"context"
	"reflect"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func TestAudioParameterObjectLists(t *testing.T) {
	for _, source := range []string{"value", "index"} {
		t.Run(source, func(t *testing.T) {
			repo := optionMappingTestRepository{param: botmodel.Param{ID: 101, Name: "条目", Key: "items", Type: "multi_option", ValueType: "string", Status: 1}, powerParam: botmodel.PowerParam{ID: 1, PowerID: 201, ParamID: 101, Show: 1, Status: 2}, serviceParam: botmodel.ServiceParam{ID: 1, ServiceID: 301, ParamID: 101, Key: "entries", ParamRule: botmodel.ServiceParamRuleObjectList, Mapping: `{"field":"identifier","source":"` + source + `","max_items":2}`, Status: 1}, options: []botmodel.ParamOption{{ID: 1, ParamID: 101, Name: "甲", Value: "alpha"}, {ID: 2, ParamID: 101, Name: "乙", Value: "beta"}, {ID: 3, ParamID: 101, Name: "丙", Value: "gamma"}}}
			mapped, err := botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{Input: map[string]any{"items": []any{"beta", "alpha"}}}, botinput.Target{PowerID: 201, ServiceID: 301})
			if err != nil {
				t.Fatal(err)
			}
			want := []any{map[string]any{"identifier": "beta"}, map[string]any{"identifier": "alpha"}}
			if source == "index" {
				want = []any{map[string]any{"identifier": 0}, map[string]any{"identifier": 1}}
			}
			if got := mapped.NativeBody()["entries"]; !reflect.DeepEqual(got, want) {
				t.Fatalf("got %#v, want %#v", got, want)
			}
			params := botinput.BuildPowerParams(context.Background(), repo, 201, 301)
			if len(params) != 1 || params[0].MaxItems != 2 {
				t.Fatal(params)
			}
			_, err = botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{Input: map[string]any{"items": []any{"alpha", "beta", "gamma"}}}, botinput.Target{PowerID: 201, ServiceID: 301})
			if err == nil {
				t.Fatal("over-limit list accepted")
			}
			repo.param.Type = "files"
			repo.param.MaxFiles = 2
			repo.serviceParam.Mapping = `{"field":"reference_index","source":"index","max_items":2}`
			mapped, err = botinput.BuildMapped(context.Background(), repo, &botprotocol.ShemicRequest{Input: map[string]any{"items": []any{"https://fixture.invalid/a.wav", "https://fixture.invalid/b.wav"}}}, botinput.Target{PowerID: 201, ServiceID: 301})
			if err != nil {
				t.Fatal(err)
			}
			if got := mapped.NativeBody()["entries"]; !reflect.DeepEqual(got, []any{map[string]any{"reference_index": 0}, map[string]any{"reference_index": 1}}) {
				t.Fatal(got)
			}
			if mapped.Params[0].ParamType == "files" {
				t.Fatal("structured output remained a URL list")
			}
		})
	}
}

func TestAudioParameterGroupFilterAndConditionChain(t *testing.T) {
	params := []botinput.PowerParam{
		{ID: 1, ParamID: 1, Key: "mode", Type: "option", DefaultValue: "solo", Options: []botinput.PowerParamOption{{ID: 1, Value: "solo", NativeValue: "solo"}, {ID: 2, Value: "cast", NativeValue: "cast"}}},
		{ID: 2, ParamID: 2, Key: "category", Type: "option", DefaultValue: "primary", ActiveWhenKey: "mode", ActiveWhenValue: "solo", Options: []botinput.PowerParamOption{{ID: 3, Value: "primary", NativeValue: "primary"}, {ID: 4, Value: "secondary", NativeValue: "secondary"}}},
		{ID: 3, ParamID: 3, Key: "choice", Name: "声音", Type: "option", OptionFilterKey: "category", ActiveWhenKey: "category", ActiveWhenValue: "secondary", Options: []botinput.PowerParamOption{{ID: 5, Value: "a", NativeValue: "a", Group: "primary"}, {ID: 6, Value: "b", NativeValue: "b", Group: "secondary"}}},
	}
	values := botinput.ApplyPowerParamDefaults(map[string]any{"mode": "solo", "choice": "b"}, params)
	if values["category"] != "secondary" {
		t.Fatal("saved choice was replaced by first category", values)
	}
	if err := botinput.ValidatePowerParamValues(params, values); err != nil {
		t.Fatal(err)
	}
	categoryOnly := botinput.ApplyPowerParamDefaults(map[string]any{"mode": "solo", "category": "secondary"}, params)
	if categoryOnly["choice"] != "b" {
		t.Fatal("default choice did not follow explicit category", categoryOnly)
	}
	values["category"] = "primary"
	params[2].ActiveWhenKey = "mode"
	params[2].ActiveWhenValue = "solo"
	if botinput.ValidatePowerParamValues(params, values) == nil {
		t.Fatal("cross-category choice accepted")
	}
	params[2].ActiveWhenKey = "category"
	params[2].ActiveWhenValue = "secondary"
	values["mode"] = "cast"
	values["category"] = "secondary"
	active := botinput.FilterActivePowerParams(params, values)
	if len(active) != 1 || active[0].Key != "mode" {
		t.Fatal("cached grandchild remained active", active)
	}
	filtered := botinput.FilterInactivePowerParamValues(params, values)
	if filtered["choice"] != nil || filtered["category"] != nil {
		t.Fatal(filtered)
	}
}

func TestAudioParameterObjectListConfigurationRejectsInvalidShape(t *testing.T) {
	for _, raw := range []string{`{}`, `{"field":"id","source":"other"}`, `{"field":"id","source":"value","max_items":-1}`, `{"field":"id","source":"value","unknown":true}`, `{"field":"id","source":"value"}{}`} {
		if _, err := botinput.DecodeServiceParamObjectListMapping(raw); err == nil {
			t.Fatal(raw)
		}
	}
}

func TestAudioParameterEmptyMultiSelectionKeepsConfiguredDefault(t *testing.T) {
	params := []botinput.PowerParam{{Key: "choices", Type: "multi_option", ValueType: "string", DefaultValue: "[]", Options: []botinput.PowerParamOption{{ID: 1, Value: "first", NativeValue: "first"}}}}
	values := botinput.ApplyPowerParamDefaults(map[string]any{}, params)
	if len(botinput.List(values["choices"])) != 0 {
		t.Fatal("empty multi-selection silently selected the first option", values)
	}
}
