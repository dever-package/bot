package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestStorySetting(t *testing.T) {
	root, err := filepath.Abs("..")
	if err != nil {
		t.Fatal(err)
	}
	replacements := map[string]string{}
	for _, service := range []string{"project", "energon"} {
		replacements[filepath.Join(root, "service", service, "story_setting_test.go")] = filepath.Join(root, "test", "story_setting_"+service+"_test.go.fixture")
	}
	overlay, err := json.Marshal(map[string]any{"Replace": replacements})
	if err != nil {
		t.Fatal(err)
	}
	filename := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(filename, overlay, 0600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+filename, "github.com/dever-package/bot/service/project", "github.com/dever-package/bot/service/energon", "-run", "^TestStorySetting", "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("story setting regression: %v\n%s", err, output)
	}
	t.Log(string(output))
}
