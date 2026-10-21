package test

import "testing"

func TestBotWorkbenchAssetBatchReadOptimization(t *testing.T) {
	runBotReadFixture(t, "workbench", "bot_workbench_asset_batch_read_test.go", "^TestBotWorkbenchAssetBatchRead$")
}
