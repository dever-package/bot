package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestStoryboardReferencePrompt(t *testing.T) {
	botRoot, err := filepath.Abs("..")
	if err != nil {
		t.Fatal(err)
	}
	replacements := map[string]string{}
	for _, service := range []string{"energon", "team", "project"} {
		replacements[filepath.Join(botRoot, "service", service, "storyboard_reference_prompt_test.go")] =
			filepath.Join(botRoot, "test", "storyboard_reference_prompt_"+service+"_test.go.fixture")
	}
	replacements[filepath.Join(botRoot, "service", "energon", "input", "storyboard_reference_prompt_test.go")] = filepath.Join(botRoot, "test", "storyboard_reference_prompt_input_test.go.fixture")
	overlay, err := json.Marshal(map[string]any{"Replace": replacements})
	if err != nil {
		t.Fatal(err)
	}
	overlayPath := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(overlayPath, overlay, 0o600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlayPath,
		"github.com/dever-package/bot/service/energon", "github.com/dever-package/bot/service/team",
		"github.com/dever-package/bot/service/project", "github.com/dever-package/bot/service/energon/input",
		"-run", "^TestStoryboardReferencePrompt", "-count=1", "-v")
	command.Dir = filepath.Join(botRoot, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("storyboard reference prompt: %v\n%s", err, output)
	}
	t.Log(string(output))
}
