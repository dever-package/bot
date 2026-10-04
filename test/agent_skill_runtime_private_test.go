package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestAgentSkillRuntimePrivateContracts(t *testing.T) {
	botRoot, err := filepath.Abs("..")
	if err != nil {
		t.Fatal(err)
	}
	for _, fixture := range []struct {
		name        string
		owner       string
		packagePath string
	}{
		{"agent_skill_http_test.go.fixture", "service/agent/runtime/tool/provider", "github.com/dever-package/bot/service/agent/runtime/tool/provider"},
		{"agent_skill_loop_test.go.fixture", "service/agent/runtime/loop", "github.com/dever-package/bot/service/agent/runtime/loop"},
	} {
		t.Run(fixture.name, func(t *testing.T) {
			overlay := map[string]any{"Replace": map[string]string{
				filepath.Join(botRoot, fixture.owner, "agent_skill_runtime_overlay_test.go"): filepath.Join(botRoot, "test", fixture.name),
			}}
			encoded, marshalErr := json.Marshal(overlay)
			if marshalErr != nil {
				t.Fatal(marshalErr)
			}
			overlayPath := filepath.Join(t.TempDir(), "overlay.json")
			if writeErr := os.WriteFile(overlayPath, encoded, 0o600); writeErr != nil {
				t.Fatal(writeErr)
			}
			command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlayPath, fixture.packagePath, "-run", "^TestAgentSkillRuntime", "-count=1")
			command.Dir = filepath.Join(botRoot, "../..")
			output, runErr := command.CombinedOutput()
			if runErr != nil {
				t.Fatalf("private runtime contract: %v\n%s", runErr, output)
			}
			t.Log(string(output))
		})
	}
}
