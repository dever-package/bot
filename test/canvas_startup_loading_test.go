package test

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestCanvasPageUsesItsOwnStartupLoading(t *testing.T) {
	pageSource := readCanvasStartupLoadingSource(t, "front/page/body/work/space.json")
	var config struct {
		Page struct {
			Loading string `json:"loading"`
		} `json:"page"`
	}
	if err := json.Unmarshal([]byte(pageSource), &config); err != nil {
		t.Fatal(err)
	}
	if config.Page.Loading != "none" {
		t.Fatalf("canvas page must suppress the host loading view, got %q", config.Page.Loading)
	}
}

func TestCanvasPluginEntryUsesSafeStartupBoundary(t *testing.T) {
	plugin := readCanvasStartupLoadingSource(t, "front/src/plugin.ts")
	for _, contract := range []string{
		`import { WorkSpaceNode } from "./nodes/body-work/space/space-node";`,
		`const workSpaceNodeModule = Promise.resolve({ default: WorkSpaceNode });`,
		`"bot-body-work-space-page": lazyNode(() => workSpaceNodeModule)`,
	} {
		if !strings.Contains(plugin, contract) {
			t.Fatalf("canvas startup boundary must be ready with the plugin: missing %s", contract)
		}
	}
	if strings.Contains(plugin, `WorkSpaceEntry`) || strings.Contains(plugin, `space-entry`) {
		t.Fatal("plugin entry must not import the workspace business module before node registration")
	}

	boundary := readCanvasStartupLoadingSource(t, "front/src/nodes/body-work/space/space-node.tsx")
	for _, contract := range []string{
		`import("./space-page")`,
		`<Suspense fallback={null}>`,
		`<WorkSpacePage onInitialLoadComplete={handleInitialLoadComplete} />`,
	} {
		if !strings.Contains(boundary, contract) {
			t.Fatalf("canvas startup boundary is missing %s", contract)
		}
	}
	if strings.Contains(boundary, `space-entry`) || strings.Contains(boundary, `WorkSpaceEntry`) {
		t.Fatal("canvas startup must not wait for an intermediate lazy entry")
	}
	if strings.Contains(boundary, `@dever/front-plugin`) || strings.Contains(boundary, `.css`) {
		t.Fatal("canvas startup boundary must not require host compat or runtime styles before plugin registration")
	}
}

func TestCanvasStartupLoadingRemainsSingle(t *testing.T) {
	boundary := readCanvasStartupLoadingSource(t, "front/src/nodes/body-work/space/space-node.tsx")
	for _, contract := range []string{
		`const [initialLoading, setInitialLoading] = useState(true);`,
		`{initialLoading ? <CanvasStartupLoading /> : null}`,
	} {
		if !strings.Contains(boundary, contract) {
			t.Fatalf("canvas startup boundary must own the single loader: missing %s", contract)
		}
	}

	loading := readCanvasStartupLoadingSource(t, "front/src/nodes/body-work/space/space-startup-loading.tsx")
	for _, contract := range []string{
		`import startupLoadingStyles from "./space-entry.css?inline";`,
		`export function CanvasStartupLoading()`,
		`<strong>正在加载创作空间</strong>`,
		`<span>正在准备画布与项目内容</span>`,
		`<style>{startupLoadingStyles}</style>`,
	} {
		if !strings.Contains(loading, contract) {
			t.Fatalf("canvas loading view is missing single-loader contract %s", contract)
		}
	}
	styles := readCanvasStartupLoadingSource(t, "front/src/nodes/body-work/space/space-entry.css")
	if strings.Contains(styles, "ws-startup-loading-progress") {
		t.Fatal("canvas startup must not render a separate segmented progress bar")
	}
	if strings.Contains(loading, `@dever/front-plugin`) || strings.Contains(loading, `import "./space-entry.css"`) {
		t.Fatal("canvas startup loading must not execute host compat before plugin registration")
	}
}

func TestCanvasStartupDefersNonessentialModules(t *testing.T) {
	page := readCanvasStartupLoadingSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	if strings.Contains(page, `import { uploadSpaceFiles } from "./space-upload";`) {
		t.Fatal("canvas startup must not load the upload implementation before user intent")
	}
	if !strings.Contains(page, `await import("./space-upload")`) {
		t.Fatal("canvas upload must load its implementation on demand")
	}
	if !strings.Contains(page, `const [showMiniMap, setShowMiniMap] = useState(false);`) {
		t.Fatal("canvas startup must not mount MiniMap before user intent")
	}
}

func TestWorkspaceBootstrapReusesBundleCanvasList(t *testing.T) {
	source := readCanvasStartupLoadingSource(t, "service/project/workspace.go")
	bootstrap := sourceSection(t, source, "func (s WorkspaceService) Bootstrap", "func (s WorkspaceService) Canvas")
	if !strings.Contains(bootstrap, `payload["canvas_list"] = bundle["canvas_list"]`) {
		t.Fatal("workspace bootstrap must reuse the canvas list already loaded by canvasBundle")
	}
	if strings.Contains(bootstrap, "projectCanvasListPayload(projectCanvasRows") {
		t.Fatal("workspace bootstrap must not query the same canvas list twice")
	}
}

func TestProjectCanvasConfigUsesSlimCatalog(t *testing.T) {
	projectSource := readCanvasStartupLoadingSource(t, "service/project/service.go")
	projectConfig := sourceSection(t, projectSource, "func (s Service) CanvasConfig", "func (s Service) CanvasPowerForm")
	if !strings.Contains(projectConfig, "return s.team.CanvasCatalog") {
		t.Fatal("project canvas config must use the slim canvas catalog")
	}

	teamSource := readCanvasStartupLoadingSource(t, "service/team/frontend.go")
	teamConfig := sourceSection(t, teamSource, "func (s Service) CanvasConfig", "func (s Service) ValidateCanvasAgent")
	for _, contract := range []string{
		"func (s Service) CanvasCatalog",
		"includeGeneralOptions bool",
		"if includeGeneralOptions",
	} {
		if !strings.Contains(teamConfig, contract) {
			t.Fatalf("team canvas config must preserve full and slim paths: missing %s", contract)
		}
	}
	for _, generalQuery := range []string{
		"publishedTeamOptions",
		"ListAgents",
		"ListAgentCates",
		"ListKnowledgeCates",
		"ListKnowledgeBases",
	} {
		if !strings.Contains(teamConfig, generalQuery) {
			t.Fatalf("admin canvas config must preserve general data from %s", generalQuery)
		}
	}
}

func TestCanvasSelectionURLUpdateDoesNotReloadThePage(t *testing.T) {
	page := readCanvasStartupLoadingSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	if !strings.Contains(page, `window.History.prototype.replaceState.call(`) {
		t.Fatal("canvas selection must update the address without notifying the page router")
	}
	if strings.Contains(page, `window.history.replaceState(`) {
		t.Fatal("router-observed replaceState reloads the page and interrupts the canvas loader")
	}
}

func readCanvasStartupLoadingSource(t *testing.T, relativePath string) string {
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

func sourceSection(t *testing.T, source string, startMarker string, endMarker string) string {
	t.Helper()
	start := strings.Index(source, startMarker)
	end := strings.Index(source, endMarker)
	if start < 0 || end <= start {
		t.Fatalf("resolve source section %q -> %q", startMarker, endMarker)
	}
	return source[start:end]
}
