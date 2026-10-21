package test

import "testing"

func TestBotRunProgressReadOptimization(t *testing.T) {
	runBotReadFixture(t, "team", "bot_run_progress_team_test.go", "^TestBotRunProgressTeam(Read|LeaseClassification)$")
	runBotReadFixture(t, "team", "bot_run_progress_team_test.go", "^TestBotRunProgressTeamRecoverOrphan$")
	runBotReadFixture(t, "team", "bot_run_progress_team_test.go", "^TestBotRunProgressTeamRecoverInvalidWaiting$")
}
