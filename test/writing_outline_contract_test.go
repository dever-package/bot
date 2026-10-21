package test

import "testing"

func TestWritingOutlineContracts(t *testing.T) {
	for _, service := range []string{"energon", "asset", "project"} {
		t.Run(service, func(t *testing.T) {
			runBotReadFixture(t, service, "writing_outline_"+service+"_test.go", "^TestWritingOutline")
		})
	}
}
