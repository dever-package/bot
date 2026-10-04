package test

import (
	"context"
	"strings"
	"testing"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
)

const videoPrivacyFailure = `能力计费准备失败：视频生成失败: status=400 body={"error":{"code":"InputImageSensitiveContentDetected.PrivacyInformation","message":"input image https://private.example/person.jpg may contain real person; request id private-request","param":"content[1]","type":"BadRequest"}}`

func TestAgentArtifactFailurePublicMessage(t *testing.T) {
	for _, scenario := range []struct {
		name, kind, detail, want string
	}{
		{"video privacy refusal", "video", videoPrivacyFailure, "参考图片被视频服务判定可能包含真人，当前模型不接受这类外部图片。请重新生成可用于视频的虚拟人物图片，或改用不含可识别真人面孔的参考图。"},
		{"other video error", "video", `status=500 body={"error":{"code":"InternalError","message":"private provider details"}}`, "视频生成失败"},
		{"code in message only", "video", `status=400 body={"error":{"code":"Other","message":"InputImageSensitiveContentDetected.PrivacyInformation"}}`, "视频生成失败"},
		{"code without JSON", "video", "InputImageSensitiveContentDetected.PrivacyInformation", "视频生成失败"},
		{"malformed JSON", "video", `body={"error":{"code":"InputImageSensitiveContentDetected.PrivacyInformation"}`, "视频生成失败"},
		{"other media kind", "image", videoPrivacyFailure, "图片生成失败"},
		{"empty error", "video", "", ""},
	} {
		t.Run(scenario.name, func(t *testing.T) {
			row := agentmodel.Artifact{Kind: scenario.kind, Status: agentmodel.ArtifactStatusFailed, Error: scenario.detail}
			payload := runtimeartifact.Payload(context.Background(), row)
			if payload["error"] != scenario.want {
				t.Fatalf("public error = %q, want %q", payload["error"], scenario.want)
			}
			if actual := runtimeartifact.FailureMessage(scenario.kind, scenario.detail); actual != scenario.want {
				t.Fatalf("tool and artifact error disagree: %q", actual)
			}
			if row.Error != scenario.detail {
				t.Fatal("public projection changed persisted diagnostic")
			}
		})
	}
}

func TestAgentArtifactFailureMessageRecovery(t *testing.T) {
	privacyMessage := runtimeartifact.FailureMessage("video", videoPrivacyFailure)
	for _, scenario := range []struct {
		name, activityError, activityText, artifactError, want string
	}{
		{"failed artifact carries reason", "", "视频已提交后台生成", videoPrivacyFailure, privacyMessage},
		{"unknown artifact stays generic", "", "视频已提交后台生成", `status=500 body={"error":{"code":"InternalError","message":"https://private.example request id private-request"}}`, "视频生成失败"},
		{"safe persisted error survives", privacyMessage, "", "", privacyMessage},
		{"safe persisted text survives", "", privacyMessage, "", privacyMessage},
		{"raw persisted error is classified", videoPrivacyFailure, "", "", privacyMessage},
		{"unknown persisted error stays generic", "https://private.example request id private-request", "", "", "视频生成失败"},
		{"code in persisted prose stays generic", "InputImageSensitiveContentDetected.PrivacyInformation", "", "", "视频生成失败"},
		{"empty failed activity stays generic", "", "", "", "视频生成失败"},
	} {
		t.Run(scenario.name, func(t *testing.T) {
			activity := map[string]any{
				"event": "tool_error", "error": scenario.activityError, "text": scenario.activityText,
				"meta": map[string]any{"tool_call_id": "video-call", "tool_kind": "video", "tool_status": "failed"},
			}
			var artifacts []map[string]any
			if scenario.artifactError != "" {
				activity["meta"].(map[string]any)["tool_status"] = "running"
				artifacts = runtimeartifact.Payloads(context.Background(), []agentmodel.Artifact{{
					ID: 1, Kind: "video", BatchKey: "video-call", Status: agentmodel.ArtifactStatusFailed, Error: scenario.artifactError,
				}})
			}
			output, _ := runtimemessageoutput.FormatMessage(map[string]any{"activities": []any{activity}}, "", artifacts)
			result := output["activities"].([]any)[0].(map[string]any)
			if result["error"] != scenario.want || result["text"] != scenario.want {
				t.Fatalf("recovered activity error/text = %q / %q, want %q", result["error"], result["text"], scenario.want)
			}
			if result["meta"].(map[string]any)["tool_status"] != "failed" || result["event"] != "tool_error" {
				t.Fatalf("failed artifact did not settle activity: %#v", result)
			}
			for _, secret := range []string{"https://", "body=", "private-request"} {
				if strings.Contains(result["error"].(string), secret) {
					t.Fatalf("public activity leaked %q", secret)
				}
			}
		})
	}
}

// 不连接数据库；检查执行器确实将共享分类用于重试，并保留原始诊断。
func TestAgentArtifactFailureRetryBranch(t *testing.T) {
	classify := agentRuntimeFunction(t, "artifact/failure.go", "classifyGenerationFailure")
	if !strings.Contains(classify, `case "InputImageSensitiveContentDetected.PrivacyInformation":`) || !strings.Contains(classify, "permanent: true") {
		t.Fatal("known deterministic input rejection must be permanent")
	}
	retry := agentRuntimeFunction(t, "artifact/failure.go", "shouldRetryGeneration")
	if !strings.Contains(retry, "attempt < artifactJobMaxAttempts && !classifyGenerationFailure(kind, detail).permanent") {
		t.Fatal("retry must honor both attempt bound and deterministic rejection")
	}
	execute := agentRuntimeFunction(t, "artifact/job_executor.go", "Execute")
	for _, contract := range []string{
		"if shouldRetryGeneration(job.ToolKind, err.Error(), job.Attempt)",
		"executor.retry(*job, lease.WorkerID, err, true)",
		"executor.artifacts.FailBatch(failCtx, pending, err.Error())",
		"agentmodel.ArtifactJobStatusFailed, err.Error()",
	} {
		if !strings.Contains(execute, contract) {
			t.Fatalf("job retry/failure contract missing: %s", contract)
		}
	}
	if strings.Contains(execute, "if job.Attempt < artifactJobMaxAttempts") {
		t.Fatal("executor bypasses rejection classification")
	}
}
