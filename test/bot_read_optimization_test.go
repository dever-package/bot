package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestBotCanvasReadOptimization(t *testing.T) {
	runBotReadFixture(t, "project", "bot_canvas_read_test.go", "^TestBotCanvasRead")
}

func TestBotAssetReadOptimization(t *testing.T) {
	runBotReadFixture(t, "asset", "bot_asset_read_test.go", "^TestBotAssetRead")
}

func TestBotConfigReadOptimization(t *testing.T) {
	runBotReadFixture(t, "project", "bot_config_read_test.go", "^TestBotConfigReadBinding$")
}

func TestBotParamOptionBatchReadOptimization(t *testing.T) {
	runBotReadFixture(t, "energon", "bot_param_option_batch_test.go", "^TestBotParamOptionBatch")
}

func TestBotDetailReadOptimization(t *testing.T) {
	runBotReadFixture(t, "project", "bot_detail_read_test.go", "^TestBotDetailReadBinding$")
}

func TestBotRunNameReadOptimization(t *testing.T) {
	runBotReadFixture(t, "team", "bot_run_name_read_test.go", "^TestBotRunNameReadProjection$")
}

func TestBotMediaReadOptimization(t *testing.T) {
	runBotReadFixture(t, "energon", "bot_media_read_test.go", "^TestBotMediaRead")
}

func TestBotContentNavigationReadOptimization(t *testing.T) {
	runBotReadFixture(t, "body", "bot_content_navigation_read_test.go", "^TestBotContentNavigationRead")
}

func TestBotWritingReferenceBatchReadOptimization(t *testing.T) {
	runBotReadFixture(t, "project", "bot_writing_reference_batch_test.go", "^TestBotWritingReferenceBatchReads$")
}

func runBotReadFixture(t *testing.T, service, fixture, pattern string) {
	t.Helper()
	root := botRoot(t)
	overlay, err := json.Marshal(map[string]any{"Replace": map[string]string{
		filepath.Join(root, "service", service, fixture): filepath.Join(root, "test", fixture+".fixture"),
	}})
	if err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(path, overlay, 0o600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+path, "github.com/dever-package/bot/service/"+service, "-run", pattern, "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("%v\n%s", err, output)
	}
	t.Log(string(output))
}
