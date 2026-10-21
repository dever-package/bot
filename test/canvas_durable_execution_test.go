package test

import "testing"

func TestCanvasDurableExecution(t *testing.T) {
	runBotReadFixture(t, "team", "canvas_durable_execution_test.go", "^TestCanvasDurableExecution$")
}
func TestCanvasDurableGateway(t *testing.T) {
	runBotReadFixture(t, "energon", "canvas_durable_gateway_test.go", "^TestCanvasDurableGateway$")
}

func TestCanvasDurableBilling(t *testing.T) {
	runBotReadFixture(t, "billing", "canvas_durable_billing_test.go", "^TestCanvasDurableBilling$")
}
