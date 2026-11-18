package test

import "testing"

func TestSourceGatewayLifecycle(t *testing.T) {
	runBotReadFixture(t, "energon", "source_gateway_test.go", "^TestSourceGatewayLifecycle$")
}
