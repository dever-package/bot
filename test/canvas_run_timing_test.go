package test

import "testing"

func TestCanvasRunTimingReload(t *testing.T) {
	runBotReadFixture(t, "project", "canvas_run_timing_test.go", "^TestCanvasRunTimingReload$")
}
