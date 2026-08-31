package test

import (
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"testing"
)

func TestCanvasNodeDetailStaysAboveCanvasLoadingOverlay(t *testing.T) {
	root := filepath.Join("..")
	detailSource := readTestFile(t, filepath.Join(
		root,
		"front/src/nodes/body-work/space/node-detail/node-detail-dialog.tsx",
	))
	detailFrame := regexp.MustCompile(`(?s)<DetailDialogFrame\b([^>]*)>`).FindStringSubmatch(detailSource)
	if len(detailFrame) != 2 || !strings.Contains(detailFrame[1], `layer="nested"`) {
		t.Fatal("canvas node detail must use the nested detail layer so canvas overlays cannot intercept its controls")
	}

	detailStyles := readTestFile(t, filepath.Join(
		root,
		"front/src/nodes/body-work/shared/detail-dialog.css",
	))
	canvasStyles := readTestFile(t, filepath.Join(
		root,
		"front/src/nodes/body-work/space/space.css",
	))
	detailLayer := cssZIndex(t, detailStyles, `.wb-detail-backdrop.is-nested`)
	loadingLayer := cssZIndex(t, canvasStyles, `.ws-module-loading.is-overlay`)
	if detailLayer <= loadingLayer {
		t.Fatalf(
			"canvas node detail layer (%d) must be above canvas loading overlays (%d)",
			detailLayer,
			loadingLayer,
		)
	}
}

func readTestFile(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}

func cssZIndex(t *testing.T, source string, selector string) int {
	t.Helper()
	pattern := regexp.MustCompile(
		`(?s)` + regexp.QuoteMeta(selector) + `\s*\{[^}]*z-index:\s*([0-9]+)`,
	)
	match := pattern.FindStringSubmatch(source)
	if len(match) != 2 {
		t.Fatalf("z-index not found for %s", selector)
	}
	value, err := strconv.Atoi(match[1])
	if err != nil {
		t.Fatal(err)
	}
	return value
}
