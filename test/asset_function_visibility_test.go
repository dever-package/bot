package test

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestAssetSourceFiltersRespectEnabledBodyFunctions(t *testing.T) {
	settings := readAssetVisibilitySource(t, "front/src/nodes/body-work/asset/asset-source-labels.ts")
	for _, contract := range []string{
		"project: menu.works.enabled",
		"tool: menu.function.enabled",
		"dialogue: menu.dialogue.enabled",
	} {
		if !strings.Contains(settings, contract) {
			t.Fatalf("asset source settings must map the body function switch with %s", contract)
		}
	}

	browser := readAssetVisibilitySource(t, "front/src/nodes/body-work/asset/asset-browser.tsx")
	if !strings.Contains(browser, "sourceVisibility={sourceVisibility}") {
		t.Fatal("asset browser must pass body function visibility to its source filters")
	}

	filters := readAssetVisibilitySource(t, "front/src/nodes/body-work/asset/asset-source-filters.tsx")
	if !strings.Contains(filters, "sourceVisibility[option.key] !== false") {
		t.Fatal("asset source filters must hide sources whose body function is disabled")
	}
}

func readAssetVisibilitySource(t *testing.T, relativePath string) string {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve bot test path")
	}
	root := filepath.Dir(filepath.Dir(filename))
	data, err := os.ReadFile(filepath.Join(root, filepath.FromSlash(relativePath)))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
