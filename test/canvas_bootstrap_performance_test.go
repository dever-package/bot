package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestCanvasBootstrapPerformance(t *testing.T) {
	root := botRoot(t)
	for _, owner := range []string{"project", "asset", "team"} {
		t.Run(owner, func(t *testing.T) {
			overlay, err := json.Marshal(map[string]any{"Replace": map[string]string{
				filepath.Join(root, "service", owner, "canvas_bootstrap_performance_test.go"): filepath.Join(root, "test", "canvas_bootstrap_"+owner+"_test.go.fixture"),
			}})
			if err != nil {
				t.Fatal(err)
			}
			path := filepath.Join(t.TempDir(), "overlay.json")
			if err := os.WriteFile(path, overlay, 0o600); err != nil {
				t.Fatal(err)
			}
			command := exec.Command("go", "test", "-mod=readonly", "-overlay="+path, "github.com/dever-package/bot/service/"+owner, "-run", "^TestCanvasBootstrapPerformance", "-count=1", "-v")
			command.Dir = filepath.Join(root, "../..")
			output, err := command.CombinedOutput()
			if err != nil {
				t.Fatalf("%s: %v\n%s", owner, err, output)
			}
			t.Log(string(output))
		})
	}
}
