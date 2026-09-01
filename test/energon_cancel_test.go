package test

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCancelledCallRecordUsesDetachedBoundedContext(t *testing.T) {
	data, err := os.ReadFile(filepath.Join("..", "service", "energon", "normalize.go"))
	if err != nil {
		t.Fatal(err)
	}
	source := string(data)
	checks := []struct {
		name    string
		snippet string
	}{
		{name: "bounded detached context", snippet: "context.WithTimeout(context.WithoutCancel(ctx), callRecordTimeout)"},
		{name: "shared finalization context", snippet: "recordCtx, cancelRecord := callRecordContext(ctx, costAttempted)"},
		{name: "required log persistence", snippet: "botlog.RecordRequired(recordCtx, logItem)"},
		{name: "regular log persistence", snippet: "botlog.Record(recordCtx, logItem)"},
		{name: "cost record persistence", snippet: "botpricing.RecordAttempt(recordCtx"},
	}
	for _, check := range checks {
		if !strings.Contains(source, check.snippet) {
			t.Fatalf("missing %s contract: %s", check.name, check.snippet)
		}
	}
}
