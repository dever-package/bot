package test

import "testing"

func TestImageGenerationAssetMetadata(t *testing.T) {
	runBotReadFixture(t, "asset", "image_generation_metadata_test.go", "^TestImageGenerationAssetMetadata$")
}
