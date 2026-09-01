package test

import (
	"os"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"testing"
)

func TestTeamRoleDoesNotExposeToolSetting(t *testing.T) {
	roleSource := readRoleToolSource(t, "model/team/role.go")
	if strings.Contains(roleSource, "\tToolStatus") {
		t.Fatal("team roles must not expose a tool availability setting")
	}
	if !strings.Contains(roleSource, "LegacyToolStatus") ||
		!strings.Contains(roleSource, "column:tool_status") {
		t.Fatal("the removed role setting must retain its database column as an unused compatibility field")
	}

	for _, path := range []string{
		"front/page/admin/team/role/list.json",
		"front/page/admin/team/role/update.json",
	} {
		source := readRoleToolSource(t, path)
		if strings.Contains(source, `"tool_status"`) {
			t.Fatalf("%s must not expose or submit the removed role tool setting", path)
		}
	}
}

func TestWorkbenchToolsAreNotGatedByRoleSetting(t *testing.T) {
	serviceSource := readRoleToolSource(t, "service/team/workbench.go")
	if strings.Contains(serviceSource, "ToolsEnabled") {
		t.Fatal("workbench bindings and configs must derive tool availability from their tool catalog")
	}
	if !strings.Contains(serviceSource, "tools := s.workbenchAvailableTools(ctx, graph)") {
		t.Fatal("workbench dialogue config must always resolve the published tool catalog")
	}
	for _, forbidden := range []string{"binding.ToolsEnabled", "role.ToolStatus"} {
		if strings.Contains(serviceSource, forbidden) {
			t.Fatalf("workbench tool availability must not depend on %s", forbidden)
		}
	}

	executionSource := readRoleToolSource(t, "service/workbench/dialogue_execution.go")
	if strings.Contains(executionSource, "config.ToolsEnabled") {
		t.Fatal("dialogue execution must not carry the removed role tool switch")
	}
	if !regexp.MustCompile(`"tools_enabled"\s*:\s*len\(config\.Tools\) > 0`).MatchString(executionSource) {
		t.Fatal("the compatibility tools_enabled response must be derived from the tool catalog")
	}
}

func TestWorkbenchFrontendDerivesToolVisibilityFromCatalog(t *testing.T) {
	source := readRoleToolSource(t, "front/src/nodes/body-work/home/workbench-api.ts")
	if !strings.Contains(source, "toolsEnabled: tools.length > 0") {
		t.Fatal("workbench tool controls must be derived from the returned tool catalog")
	}
	if strings.Contains(source, "enabledValue(data.tools_enabled)") {
		t.Fatal("workbench frontend must not depend on the removed role tool switch")
	}
}

func readRoleToolSource(t *testing.T, relativePath string) string {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve bot test path")
	}
	root := filepath.Dir(filepath.Dir(filename))
	data, err := os.ReadFile(filepath.Join(root, filepath.FromSlash(relativePath)))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
