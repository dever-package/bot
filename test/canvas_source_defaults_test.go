package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestCanvasSourceDefaults(t *testing.T) {
	root := botRoot(t)
	overlay, err := json.Marshal(map[string]any{"Replace": map[string]string{
		filepath.Join(root, "service/team/canvas_source_defaults_test.go"): filepath.Join(root, "test/canvas_source_defaults_test.go.fixture"),
	}})
	if err != nil {
		t.Fatal(err)
	}
	overlayPath := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(overlayPath, overlay, 0o600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlayPath,
		"github.com/dever-package/bot/service/team", "-run", "^TestCanvasSourceDefaults$", "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("canvas source defaults: %v\n%s", err, output)
	}
	t.Log(string(output))
}
