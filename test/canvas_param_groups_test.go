package test

import (
	"context"
	"strings"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type canvasParamGroupRepository struct {
	powerParamOrderRepository
	members []botmodel.ParamGroupMember
}

func (repo canvasParamGroupRepository) ParamGroupMembersByGroups(_ context.Context, ids []uint64) []botmodel.ParamGroupMember {
	var rows []botmodel.ParamGroupMember
	for _, member := range repo.members {
		for _, id := range ids {
			if id == member.GroupID {
				rows = append(rows, member)
			}
		}
	}
	return rows
}

func canvasParamGroupFixture() canvasParamGroupRepository {
	return canvasParamGroupRepository{
		powerParamOrderRepository: powerParamOrderRepository{
			params: map[uint64]botmodel.Param{
				100: {ID: 100, Key: "voice", Name: "音色", Type: "input", Status: 1, ValueType: "string"},
				200: {ID: 200, Key: "language", Name: "语言", Type: "input", Status: 1, ValueType: "string", DefaultValue: "中文"},
				300: {ID: 300, Key: "speed", Name: "速度", Type: "input", Status: 1, ValueType: "string", DefaultValue: "标准"},
				500: {ID: 500, Key: "soundSettings", Name: "声音设置", Type: botmodel.ParamTypeGroup, Status: 1},
			},
			powerParams: []botmodel.PowerParam{
				{ID: 10, PowerID: 1, ParamID: 300, Show: 2, Status: 2, Sort: 10},
				{ID: 20, PowerID: 1, ParamID: 500, Show: 2, Status: 2, Sort: 20},
			},
			serviceParams: map[uint64][]botmodel.ServiceParam{
				1: {
					{ID: 1, ServiceID: 1, ParamID: 100, Key: "510.voice", ParamRule: 1, Status: 1},
					{ID: 2, ServiceID: 1, ParamID: 200, Key: "510.language", ParamRule: 1, Status: 1},
					{ID: 3, ServiceID: 1, ParamID: 300, Key: "510.profile", ParamRule: 1, Status: 1, DefaultValue: "极速"},
				},
				2: {{ID: 4, ServiceID: 2, ParamID: 100, Key: "voice", ParamRule: 1, Status: 1}},
				3: {{ID: 5, ServiceID: 3, ParamID: 300, Key: "profile", ParamRule: 1, Status: 1}},
			},
		},
		members: []botmodel.ParamGroupMember{
			{ID: 1, GroupID: 500, ParamID: 100, Sort: 2, Required: 1},
			{ID: 2, GroupID: 500, ParamID: 200, Sort: 1, Required: 2},
		},
	}
}

func TestCanvasParamGroups(t *testing.T) {
	ctx := context.Background()
	t.Run("mixed_order_and_member_order", func(t *testing.T) {
		repo := canvasParamGroupFixture()
		rows := botinput.BuildPowerParams(ctx, repo, 1, 1)
		if len(rows) != 3 || rows[0].Key != "speed" || rows[1].Key != "language" || rows[2].Key != "voice" {
			t.Fatalf("mixed order = %#v", rows)
		}
		if rows[0].Group != nil || rows[1].Group == nil || rows[1].Group.Name != "声音设置" || rows[2].Group.ID != 20 {
			t.Fatalf("presentation = %#v", rows)
		}
		if rows[1].Required || !rows[2].Required {
			t.Fatal("member required flags were not preserved")
		}
	})
	t.Run("standalone_wins_for_this_capability", func(t *testing.T) {
		repo := canvasParamGroupFixture()
		repo.powerParams = append(repo.powerParams, botmodel.PowerParam{ID: 30, PowerID: 1, ParamID: 100, Show: 2, Status: 2, Sort: 5})
		rows := botinput.BuildPowerParams(ctx, repo, 1, 1)
		if len(rows) != 3 || rows[0].Key != "voice" || rows[0].Group != nil || rows[0].Required {
			t.Fatalf("standalone override = %#v", rows)
		}
		if len(repo.members) != 2 {
			t.Fatal("group definition was modified")
		}
	})
	t.Run("source_filter_and_empty_group", func(t *testing.T) {
		repo := canvasParamGroupFixture()
		rows := botinput.BuildPowerParams(ctx, repo, 1, 2)
		if len(rows) != 1 || rows[0].Key != "voice" || rows[0].Group == nil {
			t.Fatalf("source filter = %#v", rows)
		}
		rows = botinput.BuildPowerParams(ctx, repo, 1, 3)
		if len(rows) != 1 || rows[0].Key != "speed" || rows[0].Group != nil {
			t.Fatalf("empty group = %#v", rows)
		}
	})
	t.Run("automatic_union_keeps_all_members", func(t *testing.T) {
		repo := canvasParamGroupFixture()
		rows := botinput.BuildPowerParamsForServices(ctx, repo, 1, []uint64{1, 2})
		if len(rows) != 3 {
			t.Fatalf("union collapsed members: %#v", rows)
		}
		for _, row := range rows {
			if row.Key == "voice" && row.DeferDefault {
				t.Fatal("shared member default was deferred")
			}
			if row.Key == "language" && (!row.DeferDefault || row.Required) {
				t.Fatal("source-only member became a routing constraint")
			}
		}
	})
	t.Run("flat_mapping_and_source_default", func(t *testing.T) {
		repo := canvasParamGroupFixture()
		req := &botprotocol.ShemicRequest{Protocol: botmodel.ProtocolComfyUI, Input: map[string]any{"voice": "音色甲"}}
		mapped, err := botinput.BuildMapped(ctx, repo, req, botinput.Target{PowerID: 1, ServiceID: 1})
		if err != nil {
			t.Fatal(err)
		}
		values := map[string]any{}
		for _, row := range mapped.Params {
			values[row.NativeKey] = row.Value
		}
		if values["510.voice"] != "音色甲" || values["510.language"] != "中文" || values["510.profile"] != "极速" {
			t.Fatalf("native parameters = %#v", values)
		}
		if _, exists := mapped.Original["soundSettings"]; exists {
			t.Fatal("presentation group leaked into input")
		}
		req.Input["speed"] = "快速"
		mapped, err = botinput.BuildMapped(ctx, repo, req, botinput.Target{PowerID: 1, ServiceID: 1})
		if err != nil {
			t.Fatal(err)
		}
		if mapped.Original["speed"] != "快速" {
			t.Fatal("source default overwrote an explicit value")
		}
	})
	t.Run("required_member_validation", func(t *testing.T) {
		repo := canvasParamGroupFixture()
		_, err := botinput.BuildMapped(ctx, repo, &botprotocol.ShemicRequest{Protocol: botmodel.ProtocolComfyUI, Input: map[string]any{}}, botinput.Target{PowerID: 1, ServiceID: 1})
		if err == nil || !strings.Contains(err.Error(), "音色") {
			t.Fatalf("required member error = %v", err)
		}
	})
	t.Run("conditional_member", func(t *testing.T) {
		repo := canvasParamGroupFixture()
		repo.serviceParams[1][0].ActiveWhenParamID = 300
		repo.serviceParams[1][0].ActiveWhenValue = "快速"
		_, err := botinput.BuildMapped(ctx, repo, &botprotocol.ShemicRequest{Protocol: botmodel.ProtocolComfyUI, Input: map[string]any{}}, botinput.Target{PowerID: 1, ServiceID: 1})
		if err != nil {
			t.Fatalf("inactive required member blocked submit: %v", err)
		}
	})
}
