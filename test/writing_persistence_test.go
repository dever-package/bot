package test

import "testing"

func TestWritingPersistence(t *testing.T) {
	runBotReadFixture(t, "team", "writing_persistence_test.go", "^TestWritingPersistence")
}

func TestWritingBusyRetry(t *testing.T) {
	runBotReadFixture(t, "energon", "writing_busy_retry_test.go", "^TestWritingBusyRetry")
}
