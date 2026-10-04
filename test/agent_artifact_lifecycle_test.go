package test

import (
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func agentRuntimeFunction(t *testing.T, relative, name string) string {
	t.Helper()
	path := filepath.Join("..", "service", "agent", "runtime", relative)
	source, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	positions := token.NewFileSet()
	parsed, err := parser.ParseFile(positions, path, source, 0)
	if err != nil {
		t.Fatal(err)
	}
	for _, declaration := range parsed.Decls {
		if function, ok := declaration.(*ast.FuncDecl); ok && function.Name.Name == name {
			return string(source[positions.Position(function.Pos()).Offset:positions.Position(function.End()).Offset])
		}
	}
	t.Fatalf("missing function %s", name)
	return ""
}

// Static contracts guard the database lifecycle without contacting a service.
// Database transaction/concurrency integration is deliberately not run here.
func TestAgentArtifactSuccessOwnsSeriesActivation(t *testing.T) {
	for _, name := range []string{"BeginBatch", "FailBatch", "ResetBatch"} {
		body := agentRuntimeFunction(t, "artifact/service.go", name)
		for _, forbidden := range []string{"active_series_id", "master_artifact_id", "activateReadyImageBatch"} {
			if strings.Contains(body, forbidden) {
				t.Fatalf("%s must not switch ready image reference: %s", name, forbidden)
			}
		}
	}
	complete := agentRuntimeFunction(t, "artifact/service.go", "CompleteBatch")
	transaction := strings.Index(complete, "orm.Transaction")
	lock := strings.Index(complete, "NewSessionModel().Update")
	persist := strings.Index(complete, "s.repository.update(tx")
	activate := strings.Index(complete, "activateReadyImageBatch(tx")
	if transaction < 0 || lock < transaction || persist < lock || activate < persist {
		t.Fatal("success must lock session, persist ready files and activate in the same transaction")
	}
}

func TestAgentArtifactOlderCompletionCannotMoveSeriesBack(t *testing.T) {
	body := agentRuntimeFunction(t, "artifact/series.go", "activateReadyImageBatch")
	for _, guard := range []string{
		"image := artifacts[0]",
		`image.Kind != "image"`,
		"image.Status != agentmodel.ArtifactStatusReady",
		"series.MasterArtifactID > image.ID",
		"active.MasterArtifactID > image.ID",
	} {
		if !strings.Contains(body, guard) {
			t.Fatalf("lost completion ordering/state guard %q", guard)
		}
	}
	resolve := agentRuntimeFunction(t, "artifact/series.go", "resolveSeries")
	if !strings.Contains(resolve, `if !strings.EqualFold(strings.TrimSpace(kind), "image") {`+"\n\t\treturn 0, nil") {
		t.Fatal("video and other output kinds must have no image series")
	}
	if strings.Contains(resolve, "sourceIDs") {
		t.Fatal("source lineage must not implicitly continue an image series")
	}
}

func TestAgentArtifactQueuedEventRemainsRunning(t *testing.T) {
	body := agentRuntimeFunction(t, "loop/tool_stream.go", "toolQueuedOutput")
	if !strings.Contains(body, `"running"`) || strings.Contains(body, `"succeeded"`) {
		t.Fatal("queue acceptance must not announce generation success")
	}
}

func TestAgentMediaResolvedContextHidesReferenceIdentity(t *testing.T) {
	body := agentRuntimeFunction(t, "reference/resolver.go", "resolvedContext")
	for _, field := range []string{"ref_type", "ref_id", "version_id", "artifact_id", "usage", "url"} {
		if strings.Contains(body, `"`+field+`"`) {
			t.Fatalf("model reference context exposes %s", field)
		}
	}
	for _, field := range []string{"trigger", "title", "prompt", "text", "label", "kind", "order"} {
		if !strings.Contains(body, `"`+field+`"`) {
			t.Fatalf("model reference context lost %s", field)
		}
	}
}

func TestAgentMediaSourceStaysInJobAndOutOfArtifactProfile(t *testing.T) {
	profile := agentRuntimeFunction(t, "loop/tool_artifact.go", "beginToolArtifactBatch")
	if !strings.Contains(profile, "delete(profile, runtimeprovider.MediaSourceTargetArgument)") {
		t.Fatal("private source target leaked into artifact/series profile")
	}
	job := agentRuntimeFunction(t, "loop/tool_artifact.go", "enqueueArtifactJob")
	if !strings.Contains(job, "Arguments:") || !strings.Contains(job, "arguments") || strings.Contains(job, "delete(arguments") {
		t.Fatal("job no longer preserves the server-prepared arguments")
	}
}
