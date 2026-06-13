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

func TestDeterministicLegacyKnowledgeStorageRootsIncludeRenamedPaths(t *testing.T) {
	roots := deterministicLegacyKnowledgeStorageRoots("语境分类", 12, "语境", 34)

	want := filepath.Join(knowledgeStorageRoot, "语境分类", "语境")
	if !containsCleanPath(roots, want) {
		t.Fatalf("legacy roots missing current name path %q: %#v", want, roots)
	}

	want = filepath.Join(knowledgeStorageRoot, "语境分类", "34")
	if !containsCleanPath(roots, want) {
		t.Fatalf("legacy roots missing old id path %q: %#v", want, roots)
	}

	want = filepath.Join(knowledgeStorageRoot, "cate-12", "base-34")
	if !containsCleanPath(roots, want) {
		t.Fatalf("legacy roots missing prefixed id path %q: %#v", want, roots)
	}
}

func containsCleanPath(paths []string, want string) bool {
	want = filepath.Clean(want)
	for _, path := range paths {
		if filepath.Clean(path) == want {
			return true
		}
	}
	return false
}
