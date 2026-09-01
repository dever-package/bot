package test

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestStoryboardFrameExecutionScopeIsSerializedAndRecovered(t *testing.T) {
	runSource := readStoryboardFrameSource(t, "service/project/workspace_run.go")
	for _, contract := range []string{
		`"canvas_execute_storyboard_frame"`,
		"validateCanvasStoryboardExecutionConflict(ctx, projectID, req)",
	} {
		if !strings.Contains(runSource, contract) {
			t.Fatalf("canvas run is missing storyboard execution contract %q", contract)
		}
	}

	executionSource := readStoryboardFrameSource(t, "service/project/workspace_execution.go")
	for _, contract := range []string{
		`"_execution_scope": strings.TrimSpace(req.ExecutionScope)`,
		`payload["execution_scope"] = workspaceExecutionScope(execution)`,
	} {
		if !strings.Contains(executionSource, contract) {
			t.Fatalf("canvas execution recovery is missing contract %q", contract)
		}
	}
	if !strings.Contains(executionSource, "canvasStoryboardFrameStartNodePrefix") {
		t.Fatal("canvas execution list must recover legacy storyboard scope from its plan")
	}

	scopeSource := readStoryboardFrameSource(t, "service/project/workspace_storyboard_frame.go")
	for _, contract := range []string{
		"func validateCanvasStoryboardExecutionConflict(",
		"func canvasStoryboardExecutionSourceNodeID(",
		"制作区正在执行，请等待完成或停止后再试",
		"制作区内有节点正在执行，请等待完成后再试",
	} {
		if !strings.Contains(scopeSource, contract) {
			t.Fatalf("storyboard execution scope is missing contract %q", contract)
		}
	}
}

func TestStoryboardFrameControlsAreVisibleAndStoppable(t *testing.T) {
	pageSource := readStoryboardFrameSource(t, "front/src/nodes/body-work/space/space-page.tsx")
	if strings.Contains(pageSource, "const runActionEnabled = false") {
		t.Fatal("storyboard frame run action must not remain hard-coded off")
	}
	for _, contract := range []string{
		"onCanvasRunChange",
		"locallyManagedCanvasRunRequestIdsRef",
		"执行制作区",
		"onStopCanvasRun",
	} {
		if !strings.Contains(pageSource, contract) {
			t.Fatalf("storyboard frame page control is missing contract %q", contract)
		}
	}

	nodeSource := readStoryboardFrameSource(t, "front/src/nodes/body-work/space/space-storyboard-frame-node.tsx")
	for _, contract := range []string{
		"Square",
		"executionStatus",
		"currentNodeTitle",
		"onStop",
		"停止制作区执行",
	} {
		if !strings.Contains(nodeSource, contract) {
			t.Fatalf("storyboard frame node is missing control contract %q", contract)
		}
	}
}

func TestStoryboardFrameContinuesWhileCompletedGroupReruns(t *testing.T) {
	groupSource := readStoryboardFrameSource(t, "front/src/nodes/body-work/space/space-group-runtime.ts")
	if !strings.Contains(groupSource, "pendingMembers.length > 0 ? pendingMembers : runnableMembers") {
		t.Fatal("direct group execution must keep rerunning all runnable members when the group is complete")
	}

	frameSource := readStoryboardFrameSource(t, "service/project/workspace_storyboard_frame.go")
	for _, contract := range []string{
		"canvasStoryboardItemStale(node) || !hasCurrentResult(node.ID)",
		"propagateCanvasStoryboardFrameSelection(required, selected)",
	} {
		if !strings.Contains(frameSource, contract) {
			t.Fatalf("storyboard frame continuation is missing contract %q", contract)
		}
	}
}

func readStoryboardFrameSource(t *testing.T, relativePath string) string {
	t.Helper()
	data, err := os.ReadFile(filepath.Join("..", filepath.FromSlash(relativePath)))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
