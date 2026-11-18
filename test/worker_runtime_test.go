package test

import "testing"

func TestWorkerLifecycle(t *testing.T) {
	runBotReadFixture(t, "worker", "worker_runtime_test.go", "^TestWorker")
}
