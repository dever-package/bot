package test

import "testing"

func TestEmptyPowerResult(t *testing.T) {
	for _, service := range []string{"energon", "asset", "project"} {
		t.Run(service, func(t *testing.T) {
			runBotReadFixture(t, service, "empty_power_result_"+service+"_test.go", "^TestEmptyPowerResult")
		})
	}
}
