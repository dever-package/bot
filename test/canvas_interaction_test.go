package test

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestBodyCanvasStoryboardRangeAppliesImmediately(t *testing.T) {
	source := readBodyCanvasInteractionSource(t, "front/src/nodes/body-work/space/space-storyboard-range-select.tsx")
	for _, obsolete := range []string{"<form", "onSubmit=", ">确定<"} {
		if strings.Contains(source, obsolete) {
			t.Fatalf("storyboard range must apply immediately without confirmation: found %s", obsolete)
		}
	}
	for _, contract := range []string{
		"applySelection(nextStartMs, selection.endMs)",
		"applySelection(selection.startMs, nextEndMs)",
	} {
		if !strings.Contains(source, contract) {
			t.Fatalf("storyboard range selector is missing immediate update contract %s", contract)
		}
	}
	styles := readBodyCanvasInteractionSource(t, "front/src/nodes/body-work/space/space.css")
	if strings.Contains(styles, ".ws-storyboard-range-form button") {
		t.Fatal("removed storyboard range confirmation must not leave dead button styles")
	}
}

func TestBodyCanvasTerminalRunAlwaysReconcilesRuntime(t *testing.T) {
	source := readBodyCanvasInteractionSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	if strings.Contains(source, "canvasRunRecordMatchesCanvas(run, canvas) &&\n        !canvasRunAlreadyAppliedToCanvas(run, canvas)") {
		t.Fatal("an already persisted terminal run must still reconcile transient node runtime")
	}
	for _, contract := range []string{
		"const resultsAlreadyApplied = canvasRunAlreadyAppliedToCanvas(",
		"? []",
		"finishBackendCanvasRunningNodes(input, run, managedNodeIds);",
	} {
		if !strings.Contains(source, contract) {
			t.Fatalf("terminal run runtime reconciliation is missing %s", contract)
		}
	}
}

func TestBodyCanvasVideoUsesDedicatedPlaybackControl(t *testing.T) {
	preview := readBodyCanvasInteractionSource(t, "front/src/nodes/shared/playable-video-preview.tsx")
	for _, contract := range []string{
		"playButtonOnly?: boolean;",
		"controls={requested && !playButtonOnly}",
		"onClick={playButtonOnly ? undefined : stopMediaEvent}",
		"const showPlaybackButton = playButtonOnly || (!ready && !requested);",
		"\"bottom-2 left-2\"",
		"playing",
		"\"暂停视频\"",
	} {
		if !strings.Contains(preview, contract) {
			t.Fatalf("canvas video playback contract is missing %s", contract)
		}
	}
	playIntentIndex := strings.Index(preview, "setPlayingSrc(src);")
	playRequestIndex := strings.Index(preview, "void video.play()")
	if playIntentIndex < 0 || playRequestIndex < 0 || playIntentIndex > playRequestIndex {
		t.Fatal("canvas video control must switch to pause before starting asynchronous playback")
	}

	page := readBodyCanvasInteractionSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	if strings.Count(page, "playButtonOnly") < 3 {
		t.Fatal("all direct canvas video node previews must use play-button-only interaction")
	}
	if strings.Contains(page, "is-video-detail") {
		t.Fatal("video detail eye must use the same centered position as other nodes")
	}
	styles := readBodyCanvasInteractionSource(t, "front/src/nodes/body-work/space/space.css")
	if strings.Contains(styles, ".ws-node-quick-view.is-video-detail") {
		t.Fatal("video detail eye must not keep a video-only position override")
	}
}

func readBodyCanvasInteractionSource(t *testing.T, relativePath string) string {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve bot test path")
	}
	botRoot := filepath.Dir(filepath.Dir(filename))
	data, err := os.ReadFile(filepath.Join(botRoot, filepath.FromSlash(relativePath)))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
