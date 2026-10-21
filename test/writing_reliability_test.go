package test

import "testing"

func TestWritingReliability(t *testing.T) {
	t.Run("team", func(t *testing.T) {
		runWritingSelectionFixture(t, "^TestWritingReliability", "writing_reliability_team_test.go")
	})
	t.Run("energon", func(t *testing.T) {
		runBotReadFixture(t, "energon", "writing_reliability_energon_test.go", "^TestWritingReliability")
	})
}
