package test

import "testing"

func TestBotRound6RecoveryReads(t *testing.T) {
	runBotReadFixture(t, "project", "bot_round6_recovery_test.go", "^TestBotRound6RecoveryProjection$")
}
