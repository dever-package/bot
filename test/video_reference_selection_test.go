package test

import "testing"

func TestVideoReferenceSelection(t *testing.T) {
	runBotReadFixture(t, "project", "video_reference_selection_test.go", "^TestVideoReferenceSelection$")
}
