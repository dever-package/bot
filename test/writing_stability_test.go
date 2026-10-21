package test

import "testing"

func TestWritingStabilityReads(t *testing.T) {
	runBotReadFixture(t, "team", "writing_stability_read_test.go", "^TestWritingStability")
}
