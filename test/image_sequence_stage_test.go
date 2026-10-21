package test

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// 外部调用在临时 overlay 中替换，生产代码不增加测试 hook，也不访问数据库或生图服务。
func TestImageSequenceStages(t *testing.T) {
	root := botRoot(t)
	directory := t.TempDir()
	replacements := map[string]string{
		filepath.Join(root, "service/energon/image_sequence_stage_test.go"): filepath.Join(root, "test/image_sequence_stage_test.go.fixture"),
	}
	boundaries := []struct{ file, signature, injection string }{
		{"service/energon/input/param_config.go", "func BuildPowerParams(", `if params, ok := ctx.Value("image-stage-params").([]PowerParam); ok { return params }`},
		{"service/energon/call.go", "func (s GatewayService) callNormalizeTarget(", `if call, ok := ctx.Value("image-stage-call").(func(*botprotocol.ShemicRequest) (callResult,error)); ok { return call(req) }`},
		{"service/energon/storyboard_grid.go", "func (s GatewayService) planImageSequence(", `if call, ok := ctx.Value("image-stage-plan").(func(string,imageSequencePlannerOptions) (storyboardGridPlan,error)); ok { return call(source,options) }`},
	}
	for _, method := range []struct{ name, result, args string }{
		{"ParamMap", "map[uint64]botmodel.Param", "ctx"},
		{"PowerParamsByPower", "[]botmodel.PowerParam", "ctx,powerID"},
		{"ServiceParamsByService", "[]botmodel.ServiceParam", "ctx,serviceID"},
		{"ServiceEndpointsByService", "[]botmodel.ServiceEndpoint", "ctx,serviceID"},
		{"ParamOptionsByParam", "[]botmodel.ParamOption", "ctx,paramID"},
	} {
		signatureArgs := "context.Context"
		if method.name != "ParamMap" {
			signatureArgs += ",uint64"
		}
		injection := "if repo, ok := ctx.Value(\"image-stage-repo\").(interface { " + method.name + "(" + signatureArgs + ") " + method.result + " }); ok { return repo." + method.name + "(" + method.args + ") }"
		boundaries = append(boundaries, struct{ file, signature, injection string }{"service/energon/repo.go", "func (r Repo) " + method.name + "(", injection})
	}
	boundaries = append(boundaries, struct{ file, signature, injection string }{"service/energon/repo.go", "func (r Repo) PreloadParamOptions(", `if ctx.Value("image-stage-repo") != nil { return }`})

	for _, boundary := range boundaries {
		path := filepath.Join(root, boundary.file)
		sourcePath := path
		if existing, ok := replacements[path]; ok {
			sourcePath = existing
		}
		source, err := os.ReadFile(sourcePath)
		if err != nil {
			t.Fatal(err)
		}
		start := strings.Index(string(source), boundary.signature)
		if start < 0 {
			t.Fatal("missing boundary", boundary.signature)
		}
		body := start + strings.Index(string(source[start:]), "{") + 1
		target := filepath.Join(directory, filepath.Base(path))
		replaced := string(source[:body]) + "\n" + boundary.injection + "\n" + string(source[body:])
		if err := os.WriteFile(target, []byte(replaced), 0600); err != nil {
			t.Fatal(err)
		}
		replacements[path] = target
	}
	overlay, err := json.Marshal(map[string]any{"Replace": replacements})
	if err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(directory, "overlay.json")
	if err := os.WriteFile(path, overlay, 0600); err != nil {
		t.Fatal(err)
	}
	command := exec.Command("go", "test", "-mod=readonly", "-overlay="+path, "github.com/dever-package/bot/service/energon", "-run", "^TestImageStage", "-count=1", "-v")
	command.Dir = filepath.Join(root, "../..")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("image stage: %v\n%s", err, output)
	}
	t.Log(string(output))
}
