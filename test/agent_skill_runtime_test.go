package test

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"

	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func TestAgentSkillLoadReusesBodyAndPreservesContinuation(t *testing.T) {
	t.Chdir(t.TempDir())
	body := strings.Repeat("读", agentskill.DefaultContentPageRunes+20)
	entry := agentSkillFixture(t, "research", body, `{"capabilities":["http","script"],"scripts":["scripts/search.sh"]}`)
	other := agentSkillFixture(t, "notes", "其他内容", `{"capabilities":[]}`)
	limits := agentskill.DefaultLimits()
	limits.LoadedContentMaxRunes = agentskill.DefaultContentPageRunes + 30
	registry := agentSkillRegistry(t, []agentskill.Entry{entry, other}, limits)
	first := executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": entry.Key})
	if first["eof"] != false || first["remaining_runes"] != 30 {
		t.Fatalf("first page = %#v", first)
	}
	if err := os.Remove(filepath.Join(entry.InstallPath, agentskill.EntryFile)); err != nil {
		t.Fatal(err)
	}
	reused := executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": entry.Key})
	if reused["reused"] != true || reused["content_hash"] != entry.ContentHash {
		t.Fatalf("reused state = %#v", reused)
	}
	if _, exists := reused["content"]; exists {
		t.Fatal("reused load must not duplicate the body")
	}
	for _, name := range []string{"continue_skill_content", "http_request", "run_skill_script"} {
		if !registry.Has(name) {
			t.Fatalf("dynamic tool missing after repeated load: %s", name)
		}
	}
	if err := os.WriteFile(filepath.Join(entry.InstallPath, agentskill.EntryFile), []byte(body), 0o600); err != nil {
		t.Fatal(err)
	}
	continued := executeAgentSkillTool(t, registry, "continue_skill_content", map[string]any{
		"skill": entry.Key, "offset": first["next_offset"],
	})
	if continued["content"] != strings.Repeat("读", 20) || continued["remaining_runes"] != 10 || continued["eof"] != true {
		t.Fatalf("continuation lost shared budget: %#v", continued)
	}
	otherResult := executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": other.Key})
	if otherResult["content"] != "其他内容" || otherResult["remaining_runes"] != 6 {
		t.Fatalf("different skill must still load: %#v", otherResult)
	}
}

func TestAgentSkillLoadActivityDistinguishesReuseAndRestore(t *testing.T) {
	t.Chdir(t.TempDir())
	entry := agentSkillFixture(t, "research", "技能正文", `{"capabilities":[]}`)
	registry := agentSkillRegistry(t, []agentskill.Entry{entry}, agentskill.DefaultLimits())
	for _, action := range []string{"技能加载", "复用已加载技能"} {
		result, err := registry.Execute(context.Background(), botprotocol.ToolCall{
			ID: action, Name: "load_skill", Arguments: `{"key":"research"}`,
		}, "fixture", nil)
		if err != nil {
			t.Fatal(err)
		}
		metadata, _ := result.Presentation["meta"].(map[string]any)
		if metadata["skill_key"] != entry.Key || metadata["skill_action"] != action {
			t.Fatalf("skill load action = %#v, want %s", metadata, action)
		}
	}
	restoredRegistry := agentSkillRegistry(t, []agentskill.Entry{entry}, agentskill.DefaultLimits())
	arguments, err := json.Marshal(map[string]any{"key": entry.Key, runtimeprovider.SkillRestoreContentHashArgument: entry.ContentHash})
	if err != nil {
		t.Fatal(err)
	}
	result, err := restoredRegistry.Execute(context.Background(), botprotocol.ToolCall{
		ID: "restore", Name: "load_skill", Arguments: string(arguments),
	}, "fixture", nil)
	if err != nil {
		t.Fatal(err)
	}
	metadata, _ := result.Presentation["meta"].(map[string]any)
	if metadata["skill_action"] != "恢复已加载技能" {
		t.Fatalf("restored action = %#v", metadata)
	}
}

func TestAgentSkillLoadRestoresToolsWithoutBodyOrBudgetLoss(t *testing.T) {
	t.Chdir(t.TempDir())
	entry := agentSkillFixture(t, "research", "不应再次读取的正文", `{"capabilities":["http","script"],"scripts":["scripts/search.sh"]}`)
	other := agentSkillFixture(t, "notes", "后续正文", `{"capabilities":[]}`)
	if err := os.Remove(filepath.Join(entry.InstallPath, agentskill.EntryFile)); err != nil {
		t.Fatal(err)
	}
	limits := agentskill.DefaultLimits()
	limits.LoadedContentMaxRunes = 4
	registry := agentSkillRegistry(t, []agentskill.Entry{entry, other}, limits)
	result := executeAgentSkillTool(t, registry, "load_skill", map[string]any{
		"key": entry.Key, runtimeprovider.SkillRestoreContentHashArgument: entry.ContentHash,
	})
	if result["restored"] != true || result["content_hash"] != entry.ContentHash {
		t.Fatalf("restore state = %#v", result)
	}
	executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": entry.Key})
	if !registry.Has("run_skill_script") || !registry.Has("http_request") {
		t.Fatal("restore and reuse must preserve declared dynamic tools")
	}
	loadedOther := executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": other.Key})
	if loadedOther["content"] != "后续正文" || loadedOther["remaining_runes"] != 0 {
		t.Fatalf("restoration consumed body budget: %#v", loadedOther)
	}
	executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": other.Key})
}

func TestAgentSkillLoadKeepsPublishedCapabilityBoundary(t *testing.T) {
	t.Chdir(t.TempDir())
	entry := agentSkillFixture(t, "restricted", "有限能力", `{"capabilities":["http"]}`)
	if err := os.WriteFile(filepath.Join(entry.InstallPath, "manifest.json"), []byte(`{"capabilities":["script"],"scripts":["scripts/search.sh"]}`), 0o600); err != nil {
		t.Fatal(err)
	}
	registry := agentSkillRegistry(t, []agentskill.Entry{entry}, agentskill.DefaultLimits())
	executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": entry.Key})
	executeAgentSkillTool(t, registry, "load_skill", map[string]any{"key": entry.Key})
	if registry.Has("run_skill_script") || !registry.Has("http_request") {
		t.Fatal("mutable disk sidecar must not expand published permissions")
	}
}

func TestAgentSkillActivityUsesCatalogIdentityAndSafeProjection(t *testing.T) {
	t.Chdir(t.TempDir())
	entry := agentSkillFixture(t, "catalog-entry", "正文", `{"capabilities":["http"]}`)
	entry.Name = "Catalog Research"
	registry := agentSkillRegistry(t, []agentskill.Entry{entry}, agentskill.DefaultLimits())
	var progress map[string]any
	result, err := registry.Execute(context.Background(), botprotocol.ToolCall{
		ID: "named-load", Name: "load_skill", Arguments: `{"key":"catalog-entry","headers":{"Authorization":"not-for-display"}}`,
	}, "fixture", func(output map[string]any) error {
		progress = output
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	metadata := result.Presentation["meta"].(map[string]any)
	if metadata["skill_key"] != entry.Key || metadata["skill_name"] != entry.Name || metadata["skill_action"] != "技能加载" {
		t.Fatalf("catalog identity was lost: %#v", metadata)
	}
	if len(metadata) != 3 || len(progress["meta"].(map[string]any)) != 3 {
		t.Fatalf("activity exposes non-display fields: %#v", progress)
	}
	encoded, _ := json.Marshal(progress)
	if strings.Contains(string(encoded), "Authorization") || strings.Contains(string(encoded), "not-for-display") {
		t.Fatal("skill activity leaked arguments")
	}
	_, err = registry.Execute(context.Background(), botprotocol.ToolCall{
		ID: "named-failure", Name: "continue_skill_content", Arguments: `{"skill":"Catalog Research","offset":999}`,
	}, "fixture", nil)
	var activityErr *runtimeprovider.SkillActivityError
	if !errors.As(err, &activityErr) || activityErr.Metadata["skill_name"] != entry.Name || activityErr.Metadata["skill_action"] != "技能正文读取" {
		t.Fatalf("failed dynamic tool lost actual skill identity: %v", err)
	}
	for _, name := range []string{"http_request", "curl_request"} {
		definition, exists := registry.Definition(name)
		if !exists || definition.Execution.ReuseSuccessfulArguments || !definition.Execution.PreventDuplicateRecovery {
			t.Fatalf("side-effect policy changed for %s: %#v", name, definition.Execution)
		}
	}
}

func agentSkillFixture(t *testing.T, key string, body string, manifest string) agentskill.Entry {
	t.Helper()
	root := filepath.Join(agentskill.Root, key)
	if err := os.MkdirAll(root, 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, agentskill.EntryFile), []byte(body), 0o600); err != nil {
		t.Fatal(err)
	}
	return agentskill.Entry{Key: key, Name: "技能-" + key, InstallPath: root, Manifest: manifest, ContentHash: key + "-hash"}
}

func agentSkillRegistry(t *testing.T, entries []agentskill.Entry, limits agentskill.Limits) *runtimetool.Registry {
	t.Helper()
	registry, err := runtimetool.NewRegistry(runtimeprovider.SkillTools(entries, limits, nil, runtimeprovider.SkillRuntime{})...)
	if err != nil {
		t.Fatal(err)
	}
	return registry
}

func executeAgentSkillTool(t *testing.T, registry *runtimetool.Registry, name string, arguments map[string]any) map[string]any {
	t.Helper()
	encoded, err := json.Marshal(arguments)
	if err != nil {
		t.Fatal(err)
	}
	result, err := registry.Execute(context.Background(), botprotocol.ToolCall{ID: name, Name: name, Arguments: string(encoded)}, "fixture", nil)
	if err != nil {
		t.Fatalf("%s failed: %v", name, err)
	}
	content, ok := result.Content.(map[string]any)
	if !ok {
		t.Fatalf("%s returned no structured content: %#v", name, result)
	}
	return content
}
