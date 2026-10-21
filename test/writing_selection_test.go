package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// 只替换存储与调度边界，实际命令、版本请求和生成合同仍执行生产实现。
func TestWritingSelection(t *testing.T) {
	runWritingSelectionFixture(t, "^TestWritingSelection")
}

func runWritingSelectionFixture(t *testing.T, pattern string, fixtures ...string) {
	t.Helper()
	root := botRoot(t)
	directory := t.TempDir()
	replacements := map[string]string{
		filepath.Join(root, "service/team/writing_selection_test.go"): filepath.Join(root, "test/writing_selection_test.go.fixture"),
	}
	for _, fixture := range fixtures {
		replacements[filepath.Join(root, "service/team", fixture)] = filepath.Join(root, "test", fixture+".fixture")
	}
	boundaries := []struct{ file, signature, injection string }{
		{"service/team/writing_store.go", "func (s Service) withWritingWrite(", `if ctx.Value(writingSelectionKey{}) != nil { return writingSelectionStateFrom(ctx).write(ctx, projectID, canvasID, assetID, write) }`},
		{"service/team/writing_store.go", "func (s Service) saveWritingDocument(", `if tx.Value(writingSelectionKey{}) != nil { return writingSelectionStateFrom(tx).save(snapshot) }`},
		{"service/team/writing_revision.go", "func loadWritingBodyReferenceBatch(", `if ctx.Value(writingSelectionKey{}) != nil { state := writingSelectionStateFrom(ctx); return state.assets, state.versions }`},
		{"../front/service/stream/stream.go", "func (s Service) WritePayload(", `if capture, ok := ctx.Value("writing-selection-stream").(func(string, map[string]any)); ok { capture(requestID, payload); return "1-0", nil }`},
		{"service/team/repo.go", "func (Repo) FindRun(", `if ctx.Value(writingSelectionKey{}) != nil { return writingSelectionStateFrom(ctx).runs[id] }`},
		{"service/team/repo.go", "func (Repo) InsertRun(", `if ctx.Value(writingSelectionKey{}) != nil { return writingSelectionStateFrom(ctx).insert(record) }`},
		{"service/team/repo.go", "func (Repo) UpdateRun(", `if ctx.Value(writingSelectionKey{}) != nil { writingSelectionStateFrom(ctx).update(id, record); return }`},
		{"service/team/runtime_async.go", "func (s Service) runAsync(", `if ctx.Value(writingSelectionKey{}) != nil { writingSelectionStateFrom(ctx).scheduled++; return }`},
		{"service/asset/main.go", "func (Service) FindVersion(", `if find, ok := ctx.Value("writing-selection-find-version").(func(uint64) *assetmodel.Version); ok { return find(id) }`},
		{"service/asset/main.go", "func (Service) FindProjectAsset(", `if find, ok := ctx.Value("writing-selection-find-asset").(func(uint64, uint64) *assetmodel.Asset); ok { return find(projectID, id) }`},
		{"service/asset/main.go", "func (Service) SaveVersionInTransaction(", `if save, ok := ctx.Value("writing-selection-save-version").(func(SaveVersionRequest) (*assetmodel.Asset, *assetmodel.Version, error)); ok { return save(req) }`},
		{"service/energon/power_params.go", "func (s GatewayService) RuntimePowerParamConfig(", `if form, ok := ctx.Value("writing-scale-form").(PowerParamConfig); ok { return form, nil }`},
		{"service/energon/model_limits.go", "func (s GatewayService) ResolveModelLimitsForTarget(", `if limits, ok := ctx.Value("writing-scale-limits").(ModelLimits); ok { return limits, nil }`},
	}
	for _, boundary := range boundaries {
		path := filepath.Join(root, boundary.file)
		sourcePath := path
		if existing, ok := replacements[path]; ok {
			sourcePath = existing
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
		if err := os.WriteFile(target, []byte(string(source[:body])+"\n"+boundary.injection+"\n"+string(source[body:])), 0600); err != nil {
			t.Fatal(err)
		}
		replacements[path] = target
	}
	encoded, err := json.Marshal(map[string]any{"Replace": replacements})
	if err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(directory, "overlay.json")
	if err := os.WriteFile(path, encoded, 0600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+path, "github.com/dever-package/bot/service/team", "-run", pattern, "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("writing selection: %v\n%s", err, output)
	}
	t.Log(string(output))
}
