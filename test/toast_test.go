package test

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestPowerNodeExecutionDoesNotEmitGlobalSuccessToast(t *testing.T) {
	source, err := os.ReadFile(filepath.Join(
		botSourceRoot(t),
		"front/src/nodes/body-work/space/space-node-settings.tsx",
	))
	if err != nil {
		t.Fatal(err)
	}
	settingsSource := string(source)
	runStart := strings.Index(settingsSource, "  const runNodeNow = async (")
	if runStart < 0 {
		t.Fatal("locate canvas node execution function")
	}
	runEndOffset := strings.Index(settingsSource[runStart:], "\n  const handleRun = async (")
	if runEndOffset < 0 {
		t.Fatal("locate end of canvas node execution function")
	}
	if strings.Contains(settingsSource[runStart:runStart+runEndOffset], "toast.success(") {
		t.Fatal("power node completion must rely on canvas state instead of a global success toast")
	}
}

func botSourceRoot(t *testing.T) string {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve test path")
	}
	return filepath.Dir(filepath.Dir(filename))
}
