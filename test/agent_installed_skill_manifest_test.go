package test

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func TestInstalledSkillSidecarMountsDeclaredScript(t *testing.T) {
	root, parsed := installedSkillDeclarationFixture(t)
	agentskill.NormalizeManifestCapabilities(parsed.Manifest)
	if err := agentskill.ValidateManifestFiles(root, parsed.Manifest); err != nil {
		t.Fatal(err)
	}
	loaded := loadInstalledSkillDeclaration(t, root, agentskill.JSONText(parsed.Manifest))
	if !installedSkillHasTool(loaded, "run_skill_script") {
		t.Fatal("published script declaration did not mount its executor")
	}
	if installedSkillHasTool(loaded, "http_request") {
		t.Fatal("script declaration implicitly granted unrelated HTTP capability")
	}
}

func TestInstalledSkillRuntimeUsesPublishedPermissions(t *testing.T) {
	root, _ := installedSkillDeclarationFixture(t)
	loaded := loadInstalledSkillDeclaration(t, root, `{"capabilities":["files"]}`)
	if installedSkillHasTool(loaded, "run_skill_script") {
		t.Fatal("runtime granted script permission from an unpublished sidecar")
	}
	if !installedSkillHasTool(loaded, "read_skill_file") {
		t.Fatal("published file capability was lost")
	}
}

func TestInstalledSkillContentHashTracksScriptAndDeclaration(t *testing.T) {
	root, parsed := installedSkillDeclarationFixture(t)
	agentskill.NormalizeManifestCapabilities(parsed.Manifest)
	before, err := agentskill.SkillContentHash(root, parsed.Manifest)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, "scripts", "search.sh"), []byte("printf 'updated result\\n'\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	after, err := agentskill.SkillContentHash(root, parsed.Manifest)
	if err != nil {
		t.Fatal(err)
	}
	if before == after {
		t.Fatal("script changes did not update the published content identity")
	}
	changedDeclaration := agentskill.CloneMap(parsed.Manifest)
	changedDeclaration["targets"] = []any{"research"}
	declarationHash, err := agentskill.SkillContentHash(root, changedDeclaration)
	if err != nil {
		t.Fatal(err)
	}
	if after == declarationHash {
		t.Fatal("declaration changes did not update the published content identity")
	}
}

func installedSkillDeclarationFixture(t *testing.T) (string, agentskill.ParsedFile) {
	t.Helper()
	workspace := t.TempDir()
	t.Chdir(workspace)
	root := filepath.Join(workspace, agentskill.Root, "installed-search-fixture")
	if err := os.MkdirAll(filepath.Join(root, "scripts"), 0o755); err != nil {
		t.Fatal(err)
	}
	files := map[string]string{
		"SKILL.md":          "---\nname: installed-search-fixture\ndescription: Search through its declared script.\n---\nRun the declared search script.\n",
		"manifest.json":     `{"capabilities":["script"],"scripts":[{"key":"search","path":"scripts/search.sh"}]}`,
		"scripts/search.sh": "printf 'search result\\n'\n",
	}
	for relative, content := range files {
		if err := os.WriteFile(filepath.Join(root, relative), []byte(content), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	parsed, err := agentskill.ParseFile(filepath.Join(root, agentskill.EntryFile))
	if err != nil {
		t.Fatal(err)
	}
	return root, parsed
}

func loadInstalledSkillDeclaration(t *testing.T, root string, manifest string) runtimeprovider.Result {
	t.Helper()
	entry := agentskill.Entry{
		Key: "installed-search-fixture", Name: "Installed search fixture", SourceType: "installed",
		InstallPath: root, EntryFile: agentskill.EntryFile, Manifest: manifest,
	}
	for _, tool := range runtimeprovider.SkillTools([]agentskill.Entry{entry}, agentskill.DefaultLimits(), nil, runtimeprovider.SkillRuntime{}) {
		if tool.Definition.Name != "load_skill" {
			continue
		}
		result, err := tool.Handle(context.Background(), runtimeprovider.Call{Arguments: map[string]any{"key": entry.Key}})
		if err != nil {
			t.Fatal(err)
		}
		return result
	}
	t.Fatal("skill load tool was not mounted")
	return runtimeprovider.Result{}
}

func installedSkillHasTool(result runtimeprovider.Result, name string) bool {
	for _, tool := range result.Tools {
		if tool.Definition.Name == name {
			return true
		}
	}
	return false
}
