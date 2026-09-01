package test

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

func TestSharedDetailDialogOwnsPointerInteraction(t *testing.T) {
	detailSource := readCanvasSource(t, filepath.Join(
		"..",
		"front/src/nodes/body-work/shared/detail-dialog.tsx",
	))
	if !strings.Contains(detailSource, `data-slot="dialog-layer"`) {
		t.Fatal("shared detail portal must identify itself as a Dever dialog layer")
	}

	detailStyles := readCanvasSource(t, filepath.Join(
		"..",
		"front/src/nodes/body-work/shared/detail-dialog.css",
	))
	backdropRule := regexp.MustCompile(
		`(?s)\.wb-detail-backdrop\s*\{([^}]*)\}`,
	).FindStringSubmatch(detailStyles)
	if len(backdropRule) != 2 || !strings.Contains(backdropRule[1], "pointer-events: auto") {
		t.Fatal("shared detail portal must restore pointer interaction when a host dialog locks body")
	}
}

func readCanvasSource(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
