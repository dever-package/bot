package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// 只替换存储边界，父画布保存、子运行恢复和精确版本验证仍执行生产实现。
func TestWritingCanvasResultHandoff(t *testing.T) {
	root := botRoot(t)
	directory := t.TempDir()
	replacements := map[string]string{
		filepath.Join(root, "service/project/writing_canvas_result_test.go"): filepath.Join(root, "test/writing_canvas_result_test.go.fixture"),
	}
	for _, boundary := range []struct{ file, signature, injection string }{
		{"service/project/workspace_cancel.go", "func workspaceRunCanceled(", `return false`},
		{"service/project/service.go", "func (s Service) SaveAsset(", `if save, ok := ctx.Value("writing-canvas-save").(func(SaveAssetRequest) (map[string]any, error)); ok { return save(req) }`},
		{"service/project/workspace_runs.go", "func latestWorkspaceChildAsset(", `if find, ok := ctx.Value("writing-canvas-latest").(func() (map[string]any, map[string]any)); ok { return find() }`},
		{"service/asset/main.go", "func (Service) FindProjectAsset(", `if find, ok := ctx.Value("writing-canvas-asset").(func(uint64, uint64) *assetmodel.Asset); ok { return find(projectID, id) }`},
		{"service/asset/main.go", "func (Service) FindVersion(", `if find, ok := ctx.Value("writing-canvas-version").(func(uint64) *assetmodel.Version); ok { return find(id) }`},
	} {
		path := filepath.Join(root, boundary.file)
		sourcePath := path
		if previous, ok := replacements[path]; ok {
			sourcePath = previous
		}
		source, err := os.ReadFile(sourcePath)
		if err != nil {
			t.Fatal(err)
		}
		start := strings.Index(string(source), boundary.signature)
		if start < 0 {
			t.Fatal("missing boundary", boundary.signature)
		}
		body := start + strings.Index(string(source[start:]), "{") + 1
		target := filepath.Join(directory, filepath.Base(path))
		if err = os.WriteFile(target, []byte(string(source[:body])+"\n"+boundary.injection+"\n"+string(source[body:])), 0600); err != nil {
			t.Fatal(err)
		}
		replacements[path] = target
	}
	encoded, err := json.Marshal(map[string]any{"Replace": replacements})
	if err != nil {
		t.Fatal(err)
	}
	overlay := filepath.Join(directory, "overlay.json")
	if err = os.WriteFile(overlay, encoded, 0600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlay, "github.com/dever-package/bot/service/project", "-run", "^TestWritingCanvasResult", "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("writing canvas result: %v\n%s", err, output)
	}
	t.Log(string(output))
}
