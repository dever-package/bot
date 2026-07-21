package provider

import (
	"context"
	"fmt"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const SkillInstallPlanToolName = "submit_skill_install_plan"

func SkillInstallPlanTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        SkillInstallPlanToolName,
			Title:       "提交技能安装计划",
			Kind:        "control",
			Description: "提交受控技能安装计划。仓库或压缩包使用 download 且 extract=true，单个 SKILL.md 使用 download 且 extract=false；GitHub 子目录及 npx、skillhub 等安装器使用 command，并把文件写入当前工作区、SKILLS_DIR 或 SKILLS_HOME。安装说明页面不能作为 download 来源。",
			Parameters:  skillInstallPlanParameters(),
		},
		ValidateArguments: validateSkillInstallPlanArguments,
		Handle: func(_ context.Context, call Call) (Result, error) {
			return Result{
				Text:     argumentText(call.Arguments, "summary"),
				Content:  call.Arguments,
				Terminal: true,
			}, nil
		},
	}
}

func skillInstallPlanParameters() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"kind": map[string]any{
				"type": "string",
				"enum": []any{agentskill.InstallPlanKind},
			},
			"version": map[string]any{
				"type": "integer",
				"enum": []any{agentskill.InstallPlanVersion},
			},
			"summary": map[string]any{
				"type":        "string",
				"description": "计划摘要；无法安全安装时说明原因",
			},
			"steps": map[string]any{
				"type":     "array",
				"maxItems": agentskill.InstallPlanMaxSteps,
				"items": map[string]any{
					"type": "object",
					"properties": map[string]any{
						"type": map[string]any{
							"type": "string",
							"enum": []any{agentskill.InstallPlanStepCommand, agentskill.InstallPlanStepDownload},
						},
						"command": map[string]any{
							"type":        "string",
							"description": "command 步骤执行的单条安装命令",
						},
						"url": map[string]any{
							"type":        "string",
							"description": "download 步骤的 http/https 技能文件或仓库地址",
						},
						"extract": map[string]any{
							"type":        "boolean",
							"description": "download 步骤是否必须解压",
						},
						"dir": map[string]any{
							"type":        "string",
							"description": "command 步骤相对于安装工作区的执行目录，默认 .",
						},
					},
					"required":             []any{"type"},
					"additionalProperties": false,
				},
			},
			"collect": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"entry": map[string]any{
						"type": "string",
						"enum": []any{agentskill.EntryFile},
					},
					"roots": map[string]any{
						"type":     "array",
						"minItems": 1,
						"items":    map[string]any{"type": "string"},
					},
					"mode": map[string]any{
						"type": "string",
						"enum": []any{agentskill.InstallPlanCollectModeAll, agentskill.InstallPlanCollectModeSingle},
					},
				},
				"required":             []any{"entry", "roots", "mode"},
				"additionalProperties": false,
			},
		},
		"required":             []any{"kind", "version", "summary", "steps", "collect"},
		"additionalProperties": false,
	}
}

func validateSkillInstallPlanArguments(arguments map[string]any) error {
	if argumentText(arguments, "kind") != agentskill.InstallPlanKind {
		return fmt.Errorf("安装计划 kind 必须是 %s", agentskill.InstallPlanKind)
	}
	if ArgumentInt(arguments, "version", 0) != agentskill.InstallPlanVersion {
		return fmt.Errorf("安装计划 version 必须是 %d", agentskill.InstallPlanVersion)
	}
	if argumentText(arguments, "summary") == "" {
		return fmt.Errorf("安装计划 summary 不能为空")
	}
	steps, ok := arguments["steps"].([]any)
	if !ok {
		return fmt.Errorf("安装计划 steps 格式无效")
	}
	if len(steps) > agentskill.InstallPlanMaxSteps {
		return fmt.Errorf("安装计划 steps 不能超过 %d 个", agentskill.InstallPlanMaxSteps)
	}
	for index, value := range steps {
		step, ok := value.(map[string]any)
		if !ok {
			return fmt.Errorf("安装计划第 %d 步格式无效", index+1)
		}
		switch strings.ToLower(argumentText(step, "type")) {
		case agentskill.InstallPlanStepCommand:
			if argumentText(step, "command") == "" {
				return fmt.Errorf("安装计划第 %d 步 command 不能为空", index+1)
			}
		case agentskill.InstallPlanStepDownload:
			if argumentText(step, "url") == "" {
				return fmt.Errorf("安装计划第 %d 步 url 不能为空", index+1)
			}
		default:
			return fmt.Errorf("安装计划第 %d 步 type 无效", index+1)
		}
	}
	collect, ok := arguments["collect"].(map[string]any)
	if !ok {
		return fmt.Errorf("安装计划 collect 格式无效")
	}
	if entry := argumentText(collect, "entry"); entry != agentskill.EntryFile {
		return fmt.Errorf("安装计划 collect.entry 必须是 %s", agentskill.EntryFile)
	}
	if roots, ok := collect["roots"].([]any); !ok || len(roots) == 0 {
		return fmt.Errorf("安装计划 collect.roots 不能为空")
	}
	mode := strings.ToLower(argumentText(collect, "mode"))
	if mode != agentskill.InstallPlanCollectModeAll && mode != agentskill.InstallPlanCollectModeSingle {
		return fmt.Errorf(
			"安装计划 collect.mode 必须是 %s 或 %s",
			agentskill.InstallPlanCollectModeAll,
			agentskill.InstallPlanCollectModeSingle,
		)
	}
	return nil
}
