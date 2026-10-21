package test

import (
	"os"
	"path/filepath"
	"reflect"
	"runtime"
	"strings"
	"testing"

	workspacemodel "github.com/dever-package/bot/model/workspace"
)

func TestWorkspaceWatcherRecoversActiveChildrenWithoutSnapshots(t *testing.T) {
	runBotReadFixture(t, "project", "bot_run_progress_project_test.go", "^TestBotRunProgressProject")
}

func TestActiveSingleNodeExecutionIsPagedAndIndexed(t *testing.T) {
	source := readBodyRuntimeSource(t, "service/project/workspace_execution.go")
	for _, contract := range []string{
		"activeSingleNodeExecutionCandidateLimit = 20",
		"for {",
		`"limit": activeSingleNodeExecutionCandidateLimit`,
		`filter["id"] = map[string]any{"lt": last.ID}`,
	} {
		if !strings.Contains(source, contract) {
			t.Fatalf("active single-node lookup is missing %q", contract)
		}
	}

	field, ok := reflect.TypeOf(workspacemodel.ExecutionIndex{}).FieldByName("ProjectSingleNodeActive")
	if !ok {
		t.Fatal("workspace execution model is missing the single-node activity index")
	}
	if got, want := field.Tag.Get("index"), "project_id,canvas_id,start_node_id,single_node,status,id"; got != want {
		t.Fatalf("unexpected single-node activity index: got %q want %q", got, want)
	}
}

func TestStoryboardPreflightReusesPreparedRuntimeContext(t *testing.T) {
	source := readBodyRuntimeSource(t, "service/project/workspace_storyboard_frame.go")
	for _, contract := range []string{
		"canvasStoryboardCurrentResultIndex(ctx, projectID, required, req.Canvas)",
		"documents := make(map[string]map[string]any)",
		"project, err := s.project.prepareCanvasPowerProject(ctx, projectID)",
		"referenceCache := newCanvasStoryboardPreflightReferenceCache()",
		"s.project.preflightCanvasPowerForProject(ctx, project,",
		"preparedNodes[node.ID] = node",
		"canvasStoryboardFrameRuntimeCanvas(",
		"preparedNodes map[string]canvasRunNode",
	} {
		if !strings.Contains(source, contract) {
			t.Fatalf("storyboard preflight is missing shared context contract %q", contract)
		}
	}
	if strings.Contains(source, "s.project.PreflightCanvasPower(ctx, projectID,") {
		t.Fatal("storyboard preflight still prepares project and release once per production node")
	}
}

func readBodyRuntimeSource(t *testing.T, relativePath string) string {
	t.Helper()
	_, currentFile, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("cannot resolve test path")
	}
	content, err := os.ReadFile(filepath.Join(filepath.Dir(currentFile), "..", relativePath))
	if err != nil {
		t.Fatalf("read %s: %v", relativePath, err)
	}
	return string(content)
}
