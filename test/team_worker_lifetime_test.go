package test

import "testing"

func TestTeamWorkerAsyncLifetime(t *testing.T) {
	runBotReadFixture(t, "team", "team_worker_lifetime_test.go", "^TestTeamWorkerAsyncLifetime$")
}
