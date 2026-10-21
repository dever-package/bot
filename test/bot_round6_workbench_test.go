package test

import "testing"

func TestBotRound6WorkbenchReads(t *testing.T) {
	runBotReadFixture(t, "workbench", "bot_round6_workbench_test.go", "^TestBotRound6WorkbenchBinding$")
}
