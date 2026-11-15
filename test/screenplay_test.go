package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"

	"github.com/dever-package/bot/service/asset"
	"github.com/dever-package/bot/service/team/story"
)

func TestScreenplayDraftIsAssetContent(t *testing.T) {
	draft := map[string]any{"type": "storyboard", "shots": []any{}, "screenplay": map[string]any{"parts": []any{map[string]any{"description": "她在窗前转身。"}}}}
	if !asset.HasContent(draft) {
		t.Fatal("chapter screenplay must be saved before shots exist")
	}
	draft["screenplay"] = map[string]any{"parts": []any{}}
	if asset.HasContent(draft) {
		t.Fatal("empty storyboard accepted as content")
	}
}

func TestScreenplay(t *testing.T) {
	root, err := filepath.Abs("..")
	if err != nil {
		t.Fatal(err)
	}
	replacements := map[string]string{}
	for _, service := range []string{"project", "energon"} {
		replacements[filepath.Join(root, "service", service, "screenplay_test.go")] = filepath.Join(root, "test", "screenplay_"+service+"_test.go.fixture")
	}
	raw, err := json.Marshal(map[string]any{"Replace": replacements})
	if err != nil {
		t.Fatal(err)
	}
	overlay := filepath.Join(t.TempDir(), "overlay.json")
	if err = os.WriteFile(overlay, raw, 0600); err != nil {
		t.Fatal(err)
	}
	// ORM models retain their database handle, so each database fixture needs its own process.
	for _, suite := range []struct{ service, pattern string }{
		{"project", "^TestScreenplaySavedChapterAndConfirmation$"},
		{"project", "^TestScreenplayCrossChapterScopeAndReopen$"},
		{"energon", "^TestScreenplay"},
	} {
		command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlay, "github.com/dever-package/bot/service/"+suite.service, "-run", suite.pattern, "-count=1", "-v")
		command.Dir = filepath.Join(root, "../..")
		output, err := command.CombinedOutput()
		if err != nil {
			t.Fatalf("screenplay regression: %v\n%s", err, output)
		}
		t.Log(string(output))
	}
}

func TestScreenplayExactSourceCoverage(t *testing.T) {
	body := "第一段。\n\n第二段，转身。"
	passages := story.SourcePassages(body)
	restored := ""
	for _, p := range passages {
		restored += p.Text
	}
	if restored != body {
		t.Fatal("source changed")
	}
	scene := story.ScriptScene{Title: "转身", Description: "人物在窗前转身。", SourceStart: 1, SourceEnd: len(passages), TargetDuration: 6, Connection: "reset", Scene: story.Scene{Layout: "窗在右侧", Axis: "南侧", Lighting: "日光"}}
	for _, scenario := range []string{"valid", "missing-end", "overlap"} {
		parts := []story.ScriptScene{scene}
		if scenario == "missing-end" {
			parts[0].SourceEnd--
		}
		if scenario == "overlap" {
			parts = append(parts, scene)
		}
		raw, _ := json.Marshal(map[string]any{"parts": parts})
		_, err := story.DecodeScreenplay(raw, passages)
		if (err == nil) != (scenario == "valid") {
			t.Fatalf("%s: %v", scenario, err)
		}
	}
}
