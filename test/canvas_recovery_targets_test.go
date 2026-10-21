package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestCanvasRecoveryTargets(t *testing.T) {
	root := botRoot(t)
	overlay, err := json.Marshal(map[string]any{"Replace": map[string]string{
		filepath.Join(root, "service/project/canvas_recovery_targets_test.go"): filepath.Join(root, "test/canvas_recovery_targets_test.go.fixture"),
	}})
	if err != nil {
		t.Fatal(err)
	}
	overlayPath := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(overlayPath, overlay, 0600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlayPath, "github.com/dever-package/bot/service/project", "-run", "^TestCanvasRecoveryTargets$", "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("canvas recovery targets: %v\n%s", err, output)
	}
	t.Log(string(output))
}
