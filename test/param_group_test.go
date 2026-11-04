package test

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	bothook "github.com/dever-package/bot/service/energon/hook"
	"github.com/dever-package/bot/test/runtimefixture"
	frontaction "github.com/dever-package/front/service/action"
	frontmeta "github.com/dever-package/front/service/meta"
	"github.com/shemic/dever/load"
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"
)

func TestParamGroupManagement(t *testing.T) {
	db := runtimefixture.New(t)
	runtimefixture.CreateTable(t, db, "bot_energon_param", botmodel.Param{})
	runtimefixture.CreateTable(t, db, "bot_energon_param_group_member", botmodel.ParamGroupMember{})
	runtimefixture.CreateTable(t, db, "bot_energon_param_option", botmodel.ParamOption{})
	runtimefixture.CreateTable(t, db, "bot_energon_power_param", botmodel.PowerParam{})
	runtimefixture.CreateTable(t, db, "bot_energon_service_param", botmodel.ServiceParam{})
	if _, err := db.Exec("CREATE UNIQUE INDEX group_param ON bot_energon_param_group_member (group_id,param_id)"); err != nil {
		t.Fatal(err)
	}
	load.RegisterMany(map[string]any{
		"bot.energon.NewParamModel":            botmodel.NewParamModel,
		"bot.energon.NewParamGroupMemberModel": botmodel.NewParamGroupMemberModel,
		"bot.energon.NewParamOptionModel":      botmodel.NewParamOptionModel,
	})
	for _, seed := range []struct {
		id   int
		kind string
	}{{10, "input"}, {11, "option"}, {12, "files"}, {20, botmodel.ParamTypeGroup}} {
		if _, err := db.Exec("INSERT INTO bot_energon_param (id,name,key,type) VALUES (?,?,?,?)", seed.id, fmt.Sprint(seed.id), fmt.Sprint(seed.id), seed.kind); err != nil {
			t.Fatal(err)
		}
	}
	c := &server.Context{}
	ctx := context.Background()
	hook := bothook.ParamHook{}
	normalize := func(record map[string]any) map[string]any {
		return hook.ProviderBeforeSaveParam(c, []any{record}).(map[string]any)
	}
	save := func(record map[string]any) uint64 {
		t.Helper()
		result, err := frontaction.SaveModelRecord(c, "bot.energon.NewParamModel", normalize(record), "id")
		if err != nil {
			t.Fatal(err)
		}
		return util.ToUint64(result["id"])
	}
	group := func(id uint64, members ...any) map[string]any {
		return map[string]any{"id": id, "name": "声音", "key": "sound_panel", "type": botmodel.ParamTypeGroup, "members": members}
	}
	groupID := save(group(0, map[string]any{"param_id": 10}, map[string]any{"param_id": 11}))
	stored := botmodel.NewParamModel().FindMap(ctx, map[string]any{"id": groupID})
	if stored["type"] != botmodel.ParamTypeGroup {
		t.Fatalf("saved group type = %v", stored["type"])
	}
	members := botmodel.NewParamGroupMemberModel().SelectMap(ctx, map[string]any{"group_id": groupID})
	if len(members) != 2 || util.ToUint64(members[0]["param_id"]) != 10 || util.ToUint64(members[1]["param_id"]) != 11 {
		t.Fatalf("saved members = %v", members)
	}
	retainedID := util.ToUint64(members[0]["id"])
	t.Run("reload_members", func(t *testing.T) {
		rows := frontmeta.AttachRelationsByFields(ctx, "bot.energon.NewParamModel", []map[string]any{stored}, []string{"members"})
		encoded, err := json.Marshal(rows[0])
		if err != nil {
			t.Fatal(err)
		}
		var loaded struct {
			Members []struct {
				ParamID uint64 `json:"param_id"`
			} `json:"members"`
		}
		if err := json.Unmarshal(encoded, &loaded); err != nil {
			t.Fatal(err)
		}
		if len(loaded.Members) != 2 || loaded.Members[0].ParamID != 10 || loaded.Members[1].ParamID != 11 {
			t.Fatalf("reloaded group = %s", encoded)
		}
	})
	t.Run("edit_reorder_and_remove", func(t *testing.T) {
		save(group(groupID,
			map[string]any{"param_id": 12, "id": retainedID},
			map[string]any{"param_id": 10},
		))
		members = botmodel.NewParamGroupMemberModel().SelectMap(ctx, map[string]any{"group_id": groupID})
		if len(members) != 2 || util.ToUint64(members[0]["param_id"]) != 12 || util.ToUint64(members[1]["param_id"]) != 10 {
			t.Fatalf("edited members = %v", members)
		}
		if util.ToUint64(members[1]["id"]) != retainedID || util.ToUint64(members[0]["id"]) == retainedID {
			t.Fatalf("member ownership changed: %v", members)
		}
	})
	for _, tc := range []struct {
		name   string
		record map[string]any
		field  string
	}{
		{"nested_group", group(groupID, map[string]any{"param_id": 20}), "form.members"},
		{"self", group(groupID, map[string]any{"param_id": groupID}), "form.members"},
		{"missing", group(groupID, map[string]any{"param_id": 999}), "form.members"},
		{"unselected", group(groupID, map[string]any{}), "form.members"},
		{"duplicate", group(groupID, map[string]any{"param_id": 10}, map[string]any{"param_id": 10}), "form.members"},
		{"convert_member", group(10), "form.type"},
		{"partial_convert_member", map[string]any{"id": 10, "_partial": true, "type": botmodel.ParamTypeGroup}, "form.type"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			defer func() {
				err, ok := recover().(error)
				if !ok {
					t.Fatal("expected a form validation error")
				}
				failures, ok := frontaction.FieldFailures(err)
				if !ok || len(failures) != 1 || failures[0].Field != tc.field {
					t.Fatalf("unexpected validation error: %v", err)
				}
			}()
			normalize(tc.record)
		})
	}
	t.Run("partial_member_edit", func(t *testing.T) {
		save(map[string]any{"id": groupID, "_partial": true, "members": []any{map[string]any{"param_id": 11}}})
		members = botmodel.NewParamGroupMemberModel().SelectMap(ctx, map[string]any{"group_id": groupID})
		if len(members) != 1 || util.ToUint64(members[0]["param_id"]) != 11 {
			t.Fatalf("partial member save = %v", members)
		}
	})
	t.Run("ordinary_param_preserves_values", func(t *testing.T) {
		record := normalize(map[string]any{"id": 10, "type": "input", "default_value": "原来的值", "usage": 2})
		if record["type"] != "input" || record["default_value"] != "原来的值" || util.ToIntDefault(record["usage"], 0) != 2 {
			t.Fatalf("ordinary parameter changed: %v", record)
		}
		partial := normalize(map[string]any{"id": 10, "_partial": true, "sort": 7})
		if _, exists := partial["members"]; exists {
			t.Fatalf("partial sort save changed members: %v", partial)
		}
	})
	t.Run("delete_member_cleans_reference", func(t *testing.T) {
		hook.ProviderBeforeDeleteParam(c, []any{map[string]any{"id": 11}})
		if rows := botmodel.NewParamGroupMemberModel().SelectMap(ctx, map[string]any{"param_id": 11}); len(rows) != 0 {
			t.Fatalf("deleted parameter references remain: %v", rows)
		}
	})
	t.Run("changing_type_clears_members", func(t *testing.T) {
		save(group(groupID, map[string]any{"param_id": 10}))
		save(map[string]any{"id": groupID, "_partial": true, "type": "input"})
		if rows := botmodel.NewParamGroupMemberModel().SelectMap(ctx, map[string]any{"group_id": groupID}); len(rows) != 0 {
			t.Fatalf("retired group members remain: %v", rows)
		}
	})
}
