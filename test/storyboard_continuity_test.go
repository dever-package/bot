package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestStoryboardContinuity(t *testing.T) {
	root, err := filepath.Abs("..")
	if err != nil {
		t.Fatal(err)
	}
	overlay, err := json.Marshal(map[string]any{"Replace": map[string]string{
		filepath.Join(root, "service/energon/storyboard_continuity_test.go"):              filepath.Join(root, "test/storyboard_continuity_test.go.fixture"),
		filepath.Join(root, "service/energon/processor/storyboard_speech_timing_test.go"): filepath.Join(root, "test/storyboard_speech_timing_test.go.fixture"),
	}})
	if err != nil {
		t.Fatal(err)
	}
	filename := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(filename, overlay, 0600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+filename, "github.com/dever-package/bot/service/energon", "github.com/dever-package/bot/service/energon/processor", "-run", "^TestStoryboardContinuity", "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("storyboard continuity regression: %v\n%s", err, output)
	}
	t.Log(string(output))
}
