package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"strings"
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
)

func TestComfyUIWorkflowValidation(t *testing.T) {
	root := botRoot(t)
	overlay, err := json.Marshal(map[string]any{"Replace": map[string]string{
		filepath.Join(root, "service/energon/hook/comfyui_workflow_test.go"):      filepath.Join(root, "test/comfyui_workflow_hook_test.go.fixture"),
		filepath.Join(root, "service/energon/provider/comfyui_transport_test.go"): filepath.Join(root, "test/comfyui_transport_provider_test.go.fixture"),
		filepath.Join(root, "service/energon/comfyui_media_test.go"):              filepath.Join(root, "test/comfyui_media_energon_test.go.fixture"),
		filepath.Join(root, "service/maintenance/comfyui_migration_test.go"):      filepath.Join(root, "test/comfyui_migration_test.go.fixture"),
	}})
	if err != nil {
		t.Fatal(err)
	}
	overlayPath := filepath.Join(t.TempDir(), "overlay.json")
	if err := os.WriteFile(overlayPath, overlay, 0o600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+overlayPath,
		"github.com/dever-package/bot/service/energon/hook", "github.com/dever-package/bot/service/energon/provider", "github.com/dever-package/bot/service/energon", "github.com/dever-package/bot/service/maintenance", "-run", "^TestComfyUI", "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("ComfyUI workflow validation: %v\n%s", err, output)
	}
	t.Log(string(output))
}

func TestComfyUIWorkflowConfiguration(t *testing.T) {
	if _, exists := reflect.TypeOf(botmodel.Service{}).FieldByName("WorkflowJSON"); exists {
		t.Fatal("workflow storage must not remain on the service")
	}
	legacyField, exists := reflect.TypeOf(botmodel.Service{}).FieldByName("LegacyWorkflowJSON")
	if !exists || legacyField.Tag.Get("json") != "-" || !strings.Contains(legacyField.Tag.Get("dorm"), "column:workflow_json") {
		t.Fatal("legacy service workflow must be hidden and retained only for migration")
	}
	field, exists := reflect.TypeOf(botmodel.ServiceEndpoint{}).FieldByName("WorkflowJSON")
	if !exists || field.Type.Kind() != reflect.String || !strings.Contains(field.Tag.Get("dorm"), "type:text") {
		t.Fatal("workflow must have separate text storage on the endpoint")
	}
	field, exists = reflect.TypeOf(botmodel.ServiceEndpoint{}).FieldByName("InterfaceType")
	if !exists || field.Type.Kind() != reflect.String || !strings.Contains(strings.ReplaceAll(field.Tag.Get("dorm"), "'", ""), "default:model") {
		t.Fatal("endpoint type must default to model for existing configurations")
	}
	root := botRoot(t)
	for _, pageName := range []string{"update", "view"} {
		page := readComfyUIConfigPage(t, "service/"+pageName)
		form := page["data"].(map[string]any)["form"].(map[string]any)
		if stringSet(form["_fields"].([]any))["workflow_json"] || form["workflow_json"] != nil {
			t.Fatalf("service %s must not load or default workflow JSON", pageName)
		}
		nodes := page["nodes"].(map[string]any)
		container := "basic-card"
		if pageName == "update" {
			container = "dialog-shell"
			selector := nodes[container].([]any)[0].(map[string]any)
			meta := selector["meta"].(map[string]any)
			if selector["type"] != "form-select" || !stringSet(meta["clearOnChange"].([]any))["form.account_id"] {
				t.Fatal("standard provider selection must still clear the selected account")
			}
		}
		if page["state"].(map[string]any)["providerProtocol"] != nil {
			t.Fatal("service pages must not retain workflow-only provider state")
		}
		for _, rawNode := range nodes[container].([]any) {
			node := rawNode.(map[string]any)
			if node["value"] == "form.workflow_json" {
				t.Fatalf("service %s must not own the workflow editor", pageName)
			}
		}
	}
	duplicateBytes, err := os.ReadFile(filepath.Join(root, "service/energon/service_duplicate.go"))
	if err != nil {
		t.Fatal(err)
	}
	for _, source := range []string{`"workflow_json"`, `"interface_type"`, "endpoint.WorkflowJSON", "endpoint.InterfaceType"} {
		if !strings.Contains(string(duplicateBytes), source) {
			t.Fatalf("duplicating a service must preserve each endpoint configuration: missing %s", source)
		}
	}
}

func TestComfyUIEndpointConfigurationPage(t *testing.T) {
	page := readComfyUIConfigPage(t, "service_endpoint/update")
	form := page["data"].(map[string]any)["form"].(map[string]any)
	if form["interface_type"] != "model" || form["workflow_json"] != "" {
		t.Fatal("new endpoints must default to model with no workflow")
	}
	nodes := page["nodes"].(map[string]any)["dialog-shell"].([]any)
	selector := nodes[0].(map[string]any)
	if selector["type"] != "form-radio" || selector["value"] != "form.interface_type" || selector["option"] != nil {
		t.Fatal("endpoint modal must start with the type radio using Model.Options")
	}
	selectorMeta, _ := selector["meta"].(map[string]any)
	if selectorMeta["clearOnChange"] != nil {
		t.Fatal("changing endpoint type must retain the entered API identifier")
	}
	for _, input := range []struct {
		field    string
		nodeType string
		mode     string
	}{
		{"api", "form-input", ""},
		{"workflow_json", "form-textarea", "workflow_json"},
	} {
		node := comfyUIConfigNode(t, nodes, "form."+input.field)
		if node["type"] != input.nodeType {
			t.Fatalf("%s must use %s", input.field, input.nodeType)
		}
		meta, _ := node["meta"].(map[string]any)
		var conditions any
		if input.mode != "" {
			conditions = []any{map[string]any{"path": "form.interface_type", "operator": "equals", "value": input.mode}}
		}
		if !reflect.DeepEqual(meta["showWhen"], conditions) {
			t.Fatalf("%s visibility must match its supported endpoint types", input.field)
		}
		rule := node["validate"].([]any)[0].(map[string]any)
		if rule["type"] != "required" || !reflect.DeepEqual(rule["when"], conditions) {
			t.Fatalf("%s must be required for its supported endpoint types", input.field)
		}
		if input.field == "api" && (meta["readOnly"] != nil || meta["disabled"] != nil) {
			t.Fatal("endpoint identifiers must remain editable")
		}
		if input.field == "workflow_json" && meta["rows"].(float64) < 10 {
			t.Fatal("workflow paste control must provide a large text area")
		}
	}
}

func TestComfyUIEndpointConfigurationList(t *testing.T) {
	page := readComfyUIConfigPage(t, "service_endpoint/list")
	nodes := page["nodes"].(map[string]any)
	addButton := nodes["header-actions"].([]any)[0].(map[string]any)
	addActions := addButton["action"].(map[string]any)["click"].([]any)
	newForm := addActions[1].(map[string]any)["value"].(map[string]any)
	initialForm := page["state"].(map[string]any)["serviceEndpointForm"].(map[string]any)
	for _, form := range []map[string]any{newForm, initialForm} {
		if form["interface_type"] != "model" || form["workflow_json"] != "" {
			t.Fatal("parent modal defaults must carry both endpoint fields")
		}
	}
	modal := nodes["table-row"].([]any)[1].(map[string]any)
	patches := modal["meta"].(map[string]any)["pageDataPatches"].(map[string]any)
	if patches["form"] != "state.serviceEndpointForm" {
		t.Fatal("modal patch must preserve the complete endpoint form")
	}
	for _, table := range []map[string]any{
		nodes["table-row"].([]any)[0].(map[string]any),
		readComfyUIConfigPage(t, "service/view")["nodes"].(map[string]any)["endpoint-card"].([]any)[1].(map[string]any),
	} {
		columns := table["meta"].(map[string]any)["columns"].([]any)
		summary := comfyUIConfigNode(t, columns, "api")
		summaryMeta, _ := summary["meta"].(map[string]any)
		if summary["type"] != "show-base" || summaryMeta["cases"] != nil {
			t.Fatal("endpoint lists must display the actual identifier for both types")
		}
		for _, rawColumn := range columns {
			column := rawColumn.(map[string]any)
			if column["value"] == "workflow_json" {
				t.Fatal("endpoint lists must not display complete workflow JSON")
			}
			if column["name"] == "操作" {
				buttons := column["meta"].(map[string]any)["buttons"].([]any)
				edit := buttons[0].(map[string]any)["action"].(map[string]any)["click"].([]any)
				patch := edit[1].(map[string]any)
				if patch["key"] != "serviceEndpointForm" || patch["value"] != "$row" {
					t.Fatal("editing must preserve the endpoint type, workflow, identity and prices")
				}
			}
		}
	}
}

func readComfyUIConfigPage(t *testing.T, pageName string) map[string]any {
	t.Helper()
	pageBytes, err := os.ReadFile(filepath.Join(botRoot(t), "front/page/admin/energon", pageName+".json"))
	if err != nil {
		t.Fatal(err)
	}
	var page map[string]any
	if err := json.Unmarshal(pageBytes, &page); err != nil {
		t.Fatal(err)
	}
	return page
}

func comfyUIConfigNode(t *testing.T, nodes []any, value string) map[string]any {
	t.Helper()
	for _, rawNode := range nodes {
		node := rawNode.(map[string]any)
		if node["value"] == value {
			return node
		}
	}
	t.Fatalf("configuration node %s not found", value)
	return nil
}
