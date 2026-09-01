package test

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestAgentChatExecutionPickersUseCompactRoleWidths(t *testing.T) {
	execution := readAgentChatExecutionLayoutSource(t, "front/src/nodes/show/agent-chat/execution.tsx")
	for _, contract := range []string{
		`className="agent-chat-execution-choice-group"`,
		`className="agent-chat-execution-picker is-tool"`,
		`className="agent-chat-execution-picker is-model"`,
	} {
		if !strings.Contains(execution, contract) {
			t.Fatalf("execution controls must include compact picker contract %s", contract)
		}
	}

	styles := readAgentChatExecutionLayoutSource(t, "front/src/nodes/show/agent-chat/execution-controls.css")
	defaultPicker := agentChatExecutionCSSRule(t, styles, ".agent-chat-execution-picker")
	if strings.Contains(defaultPicker, "176px") {
		t.Fatal("execution pickers must not reserve the old 176px width")
	}
	for selector, width := range map[string]string{
		".agent-chat-execution-picker.is-tool .agent-chat-execution-trigger":  "120px",
		".agent-chat-execution-picker.is-model .agent-chat-execution-trigger": "156px",
	} {
		rule := agentChatExecutionCSSRule(t, styles, selector)
		if !strings.Contains(rule, "max-width: "+width) {
			t.Fatalf("%s must cap its compact width at %s", selector, width)
		}
	}
	menu := agentChatExecutionCSSRule(t, styles, ".agent-chat-execution-menu")
	if !strings.Contains(menu, "min-width: 210px") {
		t.Fatal("compact triggers must retain a readable full-width picker menu")
	}
}

func TestAgentChatSingleSelectedModelUsesStaticLabel(t *testing.T) {
	picker := readAgentChatExecutionLayoutSource(t, "front/src/nodes/show/agent-chat/execution-picker.tsx")
	for _, contract := range []string{
		"options.length === 1 && options[0]?.id === value",
		"agent-chat-execution-source-static",
		"title={selectedLabel}",
	} {
		if !strings.Contains(picker, contract) {
			t.Fatalf("single selected model display is missing %s", contract)
		}
	}
}

func readAgentChatExecutionLayoutSource(t *testing.T, relativePath string) string {
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

func agentChatExecutionCSSRule(t *testing.T, source string, selector string) string {
	t.Helper()
	startMarker := selector + " {"
	start := strings.Index(source, startMarker)
	if start < 0 {
		t.Fatalf("CSS rule not found: %s", selector)
	}
	endOffset := strings.Index(source[start:], "}")
	if endOffset < 0 {
		t.Fatalf("CSS rule is not closed: %s", selector)
	}
	return source[start : start+endOffset+1]
}
