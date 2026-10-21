package test

import "testing"

func TestBotRound3CanvasCategories(t *testing.T) {
	runBotReadFixture(t, "project", "bot_round3_canvas_categories_test.go", "^TestBotRound3CanvasCategories$")
}

func TestBotRound3AssetProjection(t *testing.T) {
	runBotReadFixture(t, "asset", "bot_round3_asset_projection_test.go", "^TestBotRound3AssetProjection$")
}
