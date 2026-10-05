package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestStoryboardExistingResults(t *testing.T) {
	botRoot, err := filepath.Abs("..")
	if err != nil {
		t.Fatal(err)
	}
	overlay, err := json.Marshal(map[string]any{"Replace": map[string]string{
		filepath.Join(botRoot, "service/project/storyboard_existing_results_test.go"): filepath.Join(botRoot, "test/storyboard_existing_results_test.go.fixture"),
	}})
	if err != nil {
		t.Fatal(err)
	}
	overlayPath := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(overlayPath, overlay, 0o600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlayPath,
		"github.com/dever-package/bot/service/project", "-run", "^TestStoryboardExistingResults", "-count=1", "-v")
	command.Dir = filepath.Join(botRoot, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("storyboard existing results: %v\n%s", err, output)
	}
	t.Log(string(output))
}
