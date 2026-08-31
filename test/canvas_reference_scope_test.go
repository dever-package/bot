package test

import (
	"go/ast"
	"go/parser"
	"go/token"
	"path/filepath"
	"testing"
)

func TestCanvasAssetHydrationUsesCanvasReferenceScope(t *testing.T) {
	hydrate := workspaceRunFunction(t, "hydrateCanvasAsset")
	selectors := map[string]bool{}
	ast.Inspect(hydrate.Body, func(node ast.Node) bool {
		selector, ok := node.(*ast.SelectorExpr)
		if ok {
			selectors[selector.Sel.Name] = true
		}
		return true
	})
	if !selectors["CanvasReferences"] {
		t.Fatal("canvas asset hydration must use the team-scoped canvas reference resolver")
	}
	if selectors["FindProjectAsset"] {
		t.Fatal("canvas asset hydration must not restrict explicit references to the current project")
	}
}

func TestCanvasContextTextTraversesRichDocumentWrappers(t *testing.T) {
	contextText := workspaceRunFunction(t, "canvasContextText")
	foundRichKey := false
	ast.Inspect(contextText.Body, func(node ast.Node) bool {
		literal, ok := node.(*ast.BasicLit)
		if ok && literal.Kind == token.STRING && literal.Value == `"rich"` {
			foundRichKey = true
		}
		return true
	})
	if !foundRichKey {
		t.Fatal("canvas text extraction must traverse the canonical rich document wrapper")
	}
}

func workspaceRunFunction(t *testing.T, name string) *ast.FuncDecl {
	t.Helper()
	file, err := parser.ParseFile(
		token.NewFileSet(),
		filepath.Join("..", "service", "project", "workspace_run.go"),
		nil,
		0,
	)
	if err != nil {
		t.Fatal(err)
	}
	for _, declaration := range file.Decls {
		function, ok := declaration.(*ast.FuncDecl)
		if ok && function.Name.Name == name {
			return function
		}
	}
	t.Fatalf("%s function not found", name)
	return nil
}
