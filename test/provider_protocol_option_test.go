package test

import (
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"runtime"
	"strings"
	"testing"

	energonmodel "github.com/dever-package/bot/model/energon"
)

func TestProviderUsesProtocolOption(t *testing.T) {
	providerType := reflect.TypeOf(energonmodel.Provider{})
	field, exists := providerType.FieldByName("ProtocolOption")
	if !exists {
		t.Fatal("Provider must expose ProtocolOption")
	}
	if !strings.Contains(field.Tag.Get("dorm"), "comment:协议选项") {
		t.Fatalf("ProtocolOption must use the generic protocol option label: %q", field.Tag.Get("dorm"))
	}
	if _, exists := providerType.FieldByName("Processor"); exists {
		t.Fatal("Provider must not expose Processor after the migration")
	}

	legacyField, exists := providerType.FieldByName("LegacyProcessor")
	if !exists || !strings.Contains(legacyField.Tag.Get("dorm"), "column:processor") {
		t.Fatal("the staged migration must retain the old processor column as a legacy read source")
	}
}

func TestProviderPageAndMigrationUseProtocolOption(t *testing.T) {
	root := botRoot(t)
	pageData, err := os.ReadFile(filepath.Join(root, "front/page/admin/energon/provider/update.json"))
	if err != nil {
		t.Fatal(err)
	}

	var page map[string]any
	if err := json.Unmarshal(pageData, &page); err != nil {
		t.Fatal(err)
	}
	pageSource := string(pageData)
	if !strings.Contains(pageSource, `"value": "form.protocol_option"`) || strings.Contains(pageSource, `"value": "form.processor"`) {
		t.Fatal("the provider option control must bind to form.protocol_option")
	}
	form := page["data"].(map[string]any)["form"].(map[string]any)
	if got := form["protocol_option"]; got != "ffmpeg" {
		t.Fatalf("protocol_option default = %v, want ffmpeg", got)
	}
	if _, exists := form["processor"]; exists {
		t.Fatal("provider form must not submit processor")
	}

	fields := stringSet(form["_fields"].([]any))
	if !fields["protocol_option"] || fields["processor"] {
		t.Fatalf("provider fields must contain protocol_option only: %#v", fields)
	}

	migrationData, err := os.ReadFile(filepath.Join(root, "service/maintenance/data_migration.go"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(migrationData), "energon.provider-protocol-option.v1") {
		t.Fatal("provider protocol option backfill must be registered")
	}

	videoComposeData, err := os.ReadFile(filepath.Join(root, "service/maintenance/energon_video_compose.go"))
	if err != nil {
		t.Fatal(err)
	}
	videoComposeSource := string(videoComposeData)
	if strings.Contains(videoComposeSource, `"processor"`) || !strings.Contains(videoComposeSource, `"protocol_option"`) {
		t.Fatal("the built-in video processor source must be maintained through protocol_option")
	}
}

func botRoot(t *testing.T) string {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve test path")
	}
	return filepath.Dir(filepath.Dir(filename))
}

func stringSet(values []any) map[string]bool {
	result := make(map[string]bool, len(values))
	for _, value := range values {
		result[value.(string)] = true
	}
	return result
}
