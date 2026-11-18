package test

import "testing"

func TestCanvasDurableExecution(t *testing.T) {
	runBotReadFixture(t, "team", "canvas_durable_execution_test.go", "^TestCanvasDurableExecution$")
}

func TestTeamPowerRecoveryIdentity(t *testing.T) {
	runBotReadFixture(t, "team", "canvas_durable_execution_test.go", "^TestTeamPowerRecoveryIdentity$")
}
func TestCanvasDurableGateway(t *testing.T) {
	runBotReadFixture(t, "energon", "canvas_durable_gateway_test.go", "^TestCanvasDurableGateway$")
}

func TestObserverDisconnectDuringReceiptRead(t *testing.T) {
	runBotReadFixture(t, "energon", "canvas_durable_gateway_test.go", "^TestObserverDisconnectDuringReceiptRead$")
}

func TestCanvasDurableBilling(t *testing.T) {
	runBotReadFixture(t, "billing", "canvas_durable_billing_test.go", "^TestCanvasDurableBilling$")
}

func TestGenerationResourceQueue(t *testing.T) {
	runBotReadFixture(t, "energon", "generation_resource_queue_test.go", "^TestGenerationResourceQueue$")
}

func TestComfyUIRecovery(t *testing.T) {
	runBotReadFixture(t, "energon/protocol/adapters", "comfyui_recovery_test.go", "^TestComfyUIRecovery$")
}
