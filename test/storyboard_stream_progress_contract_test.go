package test

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestStoryboardStreamProgressReportsCurrentShotBeforeModelShotCount(t *testing.T) {
	promptSource := readStoryboardProgressSource(t, "service/energon/storyboard_prompt.go")
	for _, contract := range []string{
		"调用 submit_output 前先在内部完成整段分镜规划并确定最终镜头总数",
		"必须先输出 target_shot_count，再输出任何 shots 内容",
	} {
		if !strings.Contains(promptSource, contract) {
			t.Fatalf("storyboard prompt is missing planning contract %q", contract)
		}
	}

	progressSource := readStoryboardProgressSource(t, "service/energon/power_output.go")
	for _, contract := range []string{"observedCount = max(observedCount, counter(call))", "generatedCount = min(generatedCount, targetCount)"} {
		if !strings.Contains(progressSource, contract) {
			t.Fatalf("storyboard stream progress is missing contract %q", contract)
		}
	}
	if strings.Contains(progressSource, "targetCount == 0 {\n\t\treturn nil, false") {
		t.Fatal("storyboard stream progress must not wait for target_count before reporting the current shot")
	}

	outputSource := readStoryboardProgressSource(t, "service/energon/storyboard_output.go")
	if !strings.Contains(outputSource, "target_shot_count 与实际 shots 数量不一致") {
		t.Fatal("storyboard output must reject a changed model shot count")
	}

	frontSource := readStoryboardProgressSource(t, "front/src/nodes/body-work/space/space-storyboard-node.tsx")
	for _, text := range []string{"正在规划分镜", "正在生成第 ${generatedShotCount} 个分镜", "正在生成第 ${generatedShotCount} / ${targetShotCount} 个分镜"} {
		if !strings.Contains(frontSource, text) {
			t.Fatalf("storyboard node is missing progress label %q", text)
		}
	}
	if strings.Contains(frontSource, "总数待确定") {
		t.Fatal("storyboard node must not expose an indeterminate total after generation starts")
	}
	if strings.Contains(frontSource, "已生成 ${generatedShotCount}") {
		t.Fatal("a streamed shot order means the current shot, not a completed shot count")
	}
}

func readStoryboardProgressSource(t *testing.T, relativePath string) string {
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
