package test

import "testing"

func TestBotRound6StreamEfficiency(t *testing.T) {
	runBotReadFixture(t, "energon", "bot_round6_stream_test.go", "^TestRound6")
}
