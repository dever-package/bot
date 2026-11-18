package test

import "testing"

func TestInternalWorkerObservation(t *testing.T) {
	runBotReadFixture(t, "agent/runtime/loop", "internal_worker_test.go", "^TestInternalWorkerObservation$")
}
