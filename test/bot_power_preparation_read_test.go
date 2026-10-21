package test

import "testing"

func TestBotPowerPreparationReadOptimization(t *testing.T) {
	runBotReadFixture(t, "team", "bot_power_preparation_read_test.go", "^TestBotPowerPreparation")
}
