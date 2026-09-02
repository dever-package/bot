package test

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestCanvasStartupDoesNotMutateStoryboardStructure(t *testing.T) {
	page := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	startup := canvasRuleSourceSection(
		t,
		page,
		"const canvasReferenceItems = useMemo(",
		"const openImportPickerByNodeId = useCallback(",
	)
	for _, forbidden := range []string{
		"syncCanvasStoryboardDerivedGroups",
		"materializeCanvasStoryboardDerivedGroups",
		"setCanvasStates",
		"changedCanvasKeysRef.current.add",
	} {
		if strings.Contains(startup, forbidden) {
			t.Fatalf("canvas startup must remain read-only: found %s", forbidden)
		}
	}
	if strings.Contains(page, "canvasStoryboardReferenceSourceSignature") {
		t.Fatal("canvas startup must not compute a signature solely to mutate loaded canvases")
	}
}

func TestCanvasStoryboardRefreshPreservesUserStructure(t *testing.T) {
	source := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-storyboard-derived-groups.ts")
	for _, required := range []string{
		"sourceNode.id !== input.sourceNodeId",
		"storyboardMaterializationSourceChanged(",
	} {
		if !strings.Contains(source, required) {
			t.Fatalf("storyboard materialization boundary is missing %s", required)
		}
	}
	refresh := canvasRuleSourceSection(
		t,
		source,
		"function refreshStoryboardDerivedGroups(",
		"export function syncStoryboardDerivedGroups(",
	)
	for _, forbidden := range []string{
		"ensureDerivedGroupEdges(",
		"ensureStoryboardItemEdges(",
		"ensureStoryboardCompositionEdges(",
		"removeStoryboardCompositionEdges(",
	} {
		if strings.Contains(refresh, forbidden) {
			t.Fatalf("result refresh must not restore or delete storyboard structure: found %s", forbidden)
		}
	}
	for _, required := range []string{
		"createMissing: false",
		"preservePosition: true",
	} {
		if !strings.Contains(refresh, required) {
			t.Fatalf("result refresh must preserve existing storyboard nodes: missing %s", required)
		}
	}

	page := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	for _, required := range []string{
		"pendingStoryboardMaterializations",
		`storyboardUpdateMode === "defer-materialize"`,
		"powerCatalogLoaded",
		"sourceNodeId: nodeId",
	} {
		if !strings.Contains(page, required) {
			t.Fatalf("deferred storyboard materialization is missing %s", required)
		}
	}
}

func TestCanvasFunctionSemanticsHaveSingleFrontendOwner(t *testing.T) {
	semantics := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-function.ts")
	for _, required := range []string{
		"export const canvasFunctionDefinitions",
		"export const canvasFunctionOptions",
		"export function canvasFunctionDefinition",
		"export function normalizeCanvasFunctionOption",
		"export function isCanvasFunctionNode",
		"runsInBackend",
		"persistsResult",
		"showsResult",
		"stopsExecution",
	} {
		if !strings.Contains(semantics, required) {
			t.Fatalf("canvas function semantic owner is missing %s", required)
		}
	}

	page := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	for _, forbidden := range []string{
		`node.title === "开始"`,
		`node.title.includes("保存")`,
		`{ output: "操作已应用" }`,
	} {
		if strings.Contains(page, forbidden) {
			t.Fatalf("canvas runtime must not infer function behavior from labels: found %s", forbidden)
		}
	}
	if !strings.Contains(page, "不支持的画布功能") {
		t.Fatal("unsupported canvas function actions must fail explicitly")
	}

	menu := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-add-node-menu.tsx")
	if strings.Contains(menu, "export const canvasFunctionOptions") {
		t.Fatal("function menu must consume the shared function definitions")
	}
	if !strings.Contains(menu, `from "./space-function"`) {
		t.Fatal("function menu must import the shared function definitions")
	}

	model := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-model.ts")
	if !strings.Contains(model, "normalizeCanvasFunctionOption(") ||
		!strings.Contains(model, "value.function_option,") ||
		!strings.Contains(model, "rawTitle,") {
		t.Fatal("legacy function labels must be normalized only at the canvas read boundary")
	}

	plan := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-execution-plan.ts")
	if !strings.Contains(plan, "canvasFunctionDefinition") {
		t.Fatal("frontend execution planning must consume shared function semantics")
	}
}

func TestCanvasFunctionSemanticsHaveSingleBackendOwner(t *testing.T) {
	semantics := readCanvasRuleSource(t, "service/project/workspace_function.go")
	for _, required := range []string{
		"var canvasFunctionDefinitions",
		"func canvasFunctionDefinitionFor",
		"func isSupportedCanvasFunctionKey",
		"func canvasRunNodeReturnsResult",
		"Runnable",
		"PersistsResult",
		"ReturnsResult",
		"StopsRun",
	} {
		if !strings.Contains(semantics, required) {
			t.Fatalf("backend canvas function semantic owner is missing %s", required)
		}
	}

	assistant := readCanvasRuleSource(t, "service/project/assistant_canvas_patch.go")
	if strings.Contains(assistant, "assistantCanvasFunctionKeys") {
		t.Fatal("assistant canvas validation must not keep a second function-key registry")
	}
	if !strings.Contains(assistant, "isSupportedCanvasFunctionKey(key)") {
		t.Fatal("assistant canvas validation must use shared function semantics")
	}

	runs := readCanvasRuleSource(t, "service/project/workspace_runs.go")
	if strings.Contains(runs, `key == "save" || key == "display"`) {
		t.Fatal("workspace recovery must not duplicate result-bearing function rules")
	}
	group := readCanvasRuleSource(t, "service/project/workspace_group.go")
	if strings.Contains(group, `functionKey == "display"`) {
		t.Fatal("group output selection must not duplicate function result rules")
	}
}

func TestCanvasRunStatusUsesRuntimeNormalizer(t *testing.T) {
	page := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	for _, forbidden := range []string{
		"function canvasNodeRunFinishedStatus(",
		"function canvasRunNodeResultStatus(",
	} {
		if strings.Contains(page, forbidden) {
			t.Fatalf("canvas page must not own runtime status normalization: found %s", forbidden)
		}
	}
	runner := readCanvasRuleSource(t, "front/src/nodes/body-work/space/space-runner.ts")
	for _, required := range []string{
		"export function canvasRunNodeResultStatus",
		"export function isCanvasRunTerminalStatus",
		"isRuntimeRunTerminal",
		"value.status || value.result?.status",
	} {
		if !strings.Contains(runner, required) {
			t.Fatalf("canvas runner status boundary is missing %s", required)
		}
	}
}

func readCanvasRuleSource(t *testing.T, relativePath string) string {
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

func canvasRuleSourceSection(t *testing.T, source string, startMarker string, endMarker string) string {
	t.Helper()
	start := strings.Index(source, startMarker)
	end := strings.Index(source, endMarker)
	if start < 0 || end <= start {
		t.Fatalf("resolve source section %q -> %q", startMarker, endMarker)
	}
	return source[start:end]
}
