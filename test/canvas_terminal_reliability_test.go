package test

import "testing"

func TestCanvasTerminalReliability(t *testing.T) {
	runBotReadFixture(t, "project", "canvas_terminal_reliability_test.go", "^TestCanvasTerminalReliability$")
}
