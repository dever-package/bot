package test

import "testing"

func TestWritingPreferences(t *testing.T) {
	t.Run("team", func(t *testing.T) {
		runWritingSelectionFixture(t, "^TestWritingPreferences", "writing_scale_test.go", "writing_preferences_team_test.go")
	})
	t.Run("energon", func(t *testing.T) {
		runBotReadFixture(t, "energon", "writing_preferences_energon_test.go", "^TestWritingPreferences")
	})
}
