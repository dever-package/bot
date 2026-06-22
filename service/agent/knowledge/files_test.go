package knowledge

import (
	"path/filepath"
	"testing"
)

func TestStableKnowledgeStorageRootUsesIDs(t *testing.T) {
	root := stableKnowledgeStorageRoot(12, 34)
	want := filepath.Join(knowledgeStorageRoot, "12", "34")
	if root != want {
		t.Fatalf("stableKnowledgeStorageRoot() = %q, want %q", root, want)
	}
}

func TestIsConceptGraphEnabledUsesStatusOption(t *testing.T) {
	if !isConceptGraphEnabled(1) {
		t.Fatalf("concept graph should be enabled for status 1")
	}
	if isConceptGraphEnabled(2) {
		t.Fatalf("concept graph should be disabled for status 2")
	}
	if isConceptGraphEnabled(0) {
		t.Fatalf("concept graph should be disabled for empty status")
	}
}
