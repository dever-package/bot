package test

import "testing"

func TestCanvasAPIWorkerHandoff(t *testing.T) {
	runBotReadFixture(t, "team", "canvas_worker_test.go", "^TestCanvasAPIWorkerHandoff$")
}
