package test

import "testing"

func TestSourceWorkerProcessPersistence(t *testing.T) {
	runBotReadFixture(t, "energon", "source_worker_test.go", "^TestSourceWorkerProcessPersistence$")
}
