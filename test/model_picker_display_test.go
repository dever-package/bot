package test

import (
	"os"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"testing"
)

func TestModelPickersDisplayServiceNameWithoutProviderPrefix(t *testing.T) {
	streamRequest := readModelPickerSource(t, "front/src/nodes/show/stream-request.tsx")
	streamOptions := modelPickerSourceSection(t, streamRequest, "  const sourcePickerOptions = useMemo(", "  const sourceReady =")
	modelNameCall := regexp.MustCompile(
		`resolvePowerSourceDisplayName\(\s*source\.service_name,\s*source\.name,\s*['\"]未命名模型['\"],?\s*\)`,
	)
	if !modelNameCall.MatchString(streamOptions) {
		t.Fatal("tool runner model options must prefer the service/model name")
	}
	if strings.Contains(streamOptions, "appearance === 'body'") {
		t.Fatal("tool runner model labels must not vary by page appearance")
	}
	for _, contract := range []string{
		`placeholder="请选择模型"`,
		`searchPlaceholder="搜索模型..."`,
	} {
		if !strings.Contains(streamRequest, contract) {
			t.Fatalf("tool runner model picker is missing %s", contract)
		}
	}
	if strings.Contains(streamRequest, "'请选择来源'") {
		t.Fatal("tool runner must not expose the provider/source layer in its model picker")
	}

	execution := readModelPickerSource(t, "front/src/nodes/show/agent-chat/execution.tsx")
	executionControls := modelPickerSourceSection(t, execution, "function AgentChatExecutionControls(", "function latestUserExecution(")
	if !modelNameCall.MatchString(executionControls) {
		t.Fatal("chat and agent-debug tool models must use the tool runner model label")
	}
}

func readModelPickerSource(t *testing.T, relativePath string) string {
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

func modelPickerSourceSection(t *testing.T, source string, startMarker string, endMarker string) string {
	t.Helper()
	start := strings.Index(source, startMarker)
	if start < 0 {
		t.Fatalf("source section start not found: %s", startMarker)
	}
	endOffset := strings.Index(source[start:], endMarker)
	if endOffset < 0 {
		t.Fatalf("source section end not found: %s", endMarker)
	}
	return source[start : start+endOffset]
}
