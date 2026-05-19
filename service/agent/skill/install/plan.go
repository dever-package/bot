package install

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"

	agentskill "my/package/bot/service/agent/skill"
	frontstream "my/package/front/service/stream"
)

const (
	planKind         = "skill_install_plan"
	maxPlanSteps     = 8
	collectModeAll   = "all"
	collectModeOne   = "single"
	stepTypeCommand  = "command"
	stepTypeDownload = "download"
)

type installPlan struct {
	Kind    string             `json:"kind"`
	Version int                `json:"version"`
	Summary string             `json:"summary"`
	Steps   []installPlanStep  `json:"steps"`
	Collect installPlanCollect `json:"collect"`
}

type installPlanStep struct {
	Type    string `json:"type"`
	Command string `json:"command,omitempty"`
	URL     string `json:"url,omitempty"`
	Extract bool   `json:"extract,omitempty"`
	Dir     string `json:"dir,omitempty"`
}

type installPlanCollect struct {
	Entry string   `json:"entry"`
	Roots []string `json:"roots"`
	Mode  string   `json:"mode"`
}

func parseInstallPlanResult(output map[string]any, summary string) (installPlan, error) {
	for _, raw := range planCandidates(output, summary) {
		if plan, ok := raw.(installPlan); ok {
			if err := plan.NormalizeAndValidate(); err == nil {
				return plan, nil
			}
			continue
		}
		if mapped, ok := raw.(map[string]any); ok {
			plan, err := decodeInstallPlan(mapped)
			if err == nil && plan.NormalizeAndValidate() == nil {
				return plan, nil
			}
		}
		text := strings.TrimSpace(frontstream.InputText(raw))
		if text == "" {
			continue
		}
		if plan, err := parseInstallPlanText(text); err == nil {
			return plan, nil
		}
	}
	return installPlan{}, fmt.Errorf("技能安装规划器未返回有效安装计划")
}

func planCandidates(output map[string]any, summary string) []any {
	content := agentskill.NormalizeMap(output["content"])
	return []any{
		output["plan"],
		output["json"],
		output["value"],
		content["plan"],
		content["json"],
		content["value"],
		output["text"],
		content["text"],
		summary,
		output,
	}
}

func parseInstallPlanText(text string) (installPlan, error) {
	for _, block := range fencedJSONBlocks(text) {
		plan, err := decodeInstallPlanBytes([]byte(block))
		if err == nil {
			return plan, plan.NormalizeAndValidate()
		}
	}
	if jsonText := firstJSONObject(text); jsonText != "" {
		plan, err := decodeInstallPlanBytes([]byte(jsonText))
		if err == nil {
			return plan, plan.NormalizeAndValidate()
		}
	}
	return installPlan{}, fmt.Errorf("未识别到 skill_install_plan JSON")
}

func decodeInstallPlan(raw map[string]any) (installPlan, error) {
	content, err := json.Marshal(raw)
	if err != nil {
		return installPlan{}, err
	}
	return decodeInstallPlanBytes(content)
}

func decodeInstallPlanBytes(raw []byte) (installPlan, error) {
	var plan installPlan
	if err := json.Unmarshal(raw, &plan); err != nil {
		return installPlan{}, err
	}
	return plan, nil
}

func (plan *installPlan) NormalizeAndValidate() error {
	plan.Kind = strings.TrimSpace(plan.Kind)
	if plan.Kind != planKind {
		return fmt.Errorf("安装计划 kind 必须是 %s", planKind)
	}
	if plan.Version != 1 {
		return fmt.Errorf("安装计划 version 必须是 1")
	}
	if len(plan.Steps) == 0 {
		return fmt.Errorf("安装计划 steps 不能为空")
	}
	if len(plan.Steps) > maxPlanSteps {
		return fmt.Errorf("安装计划 steps 不能超过 %d 个", maxPlanSteps)
	}
	for index := range plan.Steps {
		if err := normalizePlanStep(&plan.Steps[index]); err != nil {
			return fmt.Errorf("安装计划第 %d 步无效: %w", index+1, err)
		}
	}
	normalizeCollect(&plan.Collect)
	return nil
}

func normalizePlanStep(step *installPlanStep) error {
	step.Type = strings.ToLower(strings.TrimSpace(step.Type))
	step.Command = strings.TrimSpace(step.Command)
	step.URL = strings.TrimSpace(step.URL)
	step.Dir = strings.TrimSpace(step.Dir)
	switch step.Type {
	case stepTypeCommand:
		if step.Command == "" {
			return fmt.Errorf("command 不能为空")
		}
	case stepTypeDownload:
		if step.URL == "" {
			return fmt.Errorf("url 不能为空")
		}
		if _, err := url.ParseRequestURI(step.URL); err != nil {
			return fmt.Errorf("url 不合法")
		}
	default:
		return fmt.Errorf("不支持的 step type: %s", step.Type)
	}
	return nil
}

func normalizeCollect(collect *installPlanCollect) {
	collect.Entry = agentskill.EntryFile
	if len(collect.Roots) == 0 {
		collect.Roots = []string{"."}
	}
	for index, root := range collect.Roots {
		root = strings.TrimSpace(root)
		if root == "" {
			root = "."
		}
		collect.Roots[index] = root
	}
	collect.Mode = strings.ToLower(strings.TrimSpace(collect.Mode))
	if collect.Mode != collectModeOne {
		collect.Mode = collectModeAll
	}
}

func fencedJSONBlocks(text string) []string {
	blocks := make([]string, 0)
	offset := 0
	for {
		start := strings.Index(text[offset:], "```")
		if start < 0 {
			break
		}
		start += offset
		langStart := start + 3
		lineEnd := strings.IndexAny(text[langStart:], "\r\n")
		if lineEnd < 0 {
			break
		}
		lineEnd += langStart
		lang := strings.ToLower(strings.TrimSpace(text[langStart:lineEnd]))
		contentStart := lineEnd + 1
		if strings.HasPrefix(text[lineEnd:], "\r\n") {
			contentStart = lineEnd + 2
		}
		end := strings.Index(text[contentStart:], "```")
		if end < 0 {
			break
		}
		contentEnd := contentStart + end
		if lang == "skill-install-plan" || lang == "json" || lang == "" {
			blocks = append(blocks, strings.TrimSpace(text[contentStart:contentEnd]))
		}
		offset = contentEnd + 3
	}
	return blocks
}

func firstJSONObject(text string) string {
	start := strings.Index(text, "{")
	if start < 0 {
		return ""
	}
	depth := 0
	inString := false
	escaped := false
	for index := start; index < len(text); index++ {
		char := text[index]
		if inString {
			if escaped {
				escaped = false
				continue
			}
			if char == '\\' {
				escaped = true
				continue
			}
			if char == '"' {
				inString = false
			}
			continue
		}
		switch char {
		case '"':
			inString = true
		case '{':
			depth++
		case '}':
			depth--
			if depth == 0 {
				return strings.TrimSpace(text[start : index+1])
			}
		}
	}
	return ""
}
