package test

import "testing"

func TestBotRound7BackendOptimization(t *testing.T) {
	runBotReadFixture(t, "project", "bot_round7_backend_test.go", "^TestBotRound7Backend$")
}
