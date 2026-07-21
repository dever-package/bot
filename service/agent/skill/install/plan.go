package install

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	planKind                = agentskill.InstallPlanKind
	maxPlanSteps            = agentskill.InstallPlanMaxSteps
	maxPlanSummaryRunes     = 2000
	maxPlanCommandBytes     = 16 * 1024
	maxPlanURLRunes         = 4096
	maxPlanDirectoryRunes   = 512
	maxPlanCollectRootRunes = 512
	collectModeAll          = agentskill.InstallPlanCollectModeAll
	collectModeOne          = agentskill.InstallPlanCollectModeSingle
	stepTypeCommand         = agentskill.InstallPlanStepCommand
	stepTypeDownload        = agentskill.InstallPlanStepDownload
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
	var rejection error
	for _, raw := range planCandidates(output, summary) {
		if plan, ok := raw.(installPlan); ok {
			if err := plan.NormalizeAndValidate(); err == nil {
				return plan, nil
			} else {
				rejection = installPlanRejection(plan, err)
			}
			continue
		}
		if mapped, ok := raw.(map[string]any); ok {
			plan, err := decodeInstallPlan(mapped)
			if err == nil {
				if validateErr := plan.NormalizeAndValidate(); validateErr == nil {
					return plan, nil
				} else {
					rejection = installPlanRejection(plan, validateErr)
				}
			}
		}
		text := strings.TrimSpace(frontstream.InputText(raw))
		if text == "" {
			continue
		}
		if plan, err := parseInstallPlanText(text); err == nil {
			return plan, nil
		} else {
			rejection = installPlanRejection(plan, err)
		}
	}
	if rejection != nil {
		return installPlan{}, rejection
	}
	return installPlan{}, fmt.Errorf("技能安装规划器未返回有效安装计划")
}

func installPlanRejection(plan installPlan, fallback error) error {
	if plan.Kind != planKind || plan.Version != agentskill.InstallPlanVersion || len(plan.Steps) != 0 {
		return fallback
	}
	reason := strings.TrimSpace(plan.Summary)
	if reason == "" {
		return fallback
	}
	runes := []rune(reason)
	if len(runes) > 500 {
		reason = string(runes[:500]) + "..."
	}
	return fmt.Errorf("技能安装规划器未生成安全计划: %s", reason)
}

func planCandidates(output map[string]any, summary string) []any {
	content := agentskill.NormalizeMap(output["content"])
	return []any{
		output["plan"],
		output["json"],
		output["value"],
		output["result"],
		content["plan"],
		content["json"],
		content["value"],
		content["result"],
		output["text"],
		content["text"],
		summary,
		output,
	}
}

func parseInstallPlanText(text string) (installPlan, error) {
	var invalidPlan installPlan
	var invalidErr error
	for _, block := range fencedJSONBlocks(text) {
		plan, err := decodeInstallPlanBytes([]byte(block))
		if err == nil {
			if validateErr := plan.NormalizeAndValidate(); validateErr == nil {
				return plan, nil
			} else if invalidErr == nil {
				invalidPlan = plan
				invalidErr = validateErr
			}
		}
	}
	if jsonText := firstJSONObject(text); jsonText != "" {
		plan, err := decodeInstallPlanBytes([]byte(jsonText))
		if err == nil {
			if validateErr := plan.NormalizeAndValidate(); validateErr == nil {
				return plan, nil
			} else if invalidErr == nil {
				invalidPlan = plan
				invalidErr = validateErr
			}
		}
	}
	if invalidErr != nil {
		return invalidPlan, invalidErr
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
	if plan.Version != agentskill.InstallPlanVersion {
		return fmt.Errorf("安装计划 version 必须是 %d", agentskill.InstallPlanVersion)
	}
	plan.Summary = strings.TrimSpace(plan.Summary)
	if err := agentskill.ValidateStoredText("安装计划摘要", plan.Summary, maxPlanSummaryRunes); err != nil {
		return err
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
	return normalizeCollect(&plan.Collect)
}

func normalizePlanStep(step *installPlanStep) error {
	step.Type = strings.ToLower(strings.TrimSpace(step.Type))
	step.Command = strings.TrimSpace(step.Command)
	step.URL = strings.TrimSpace(step.URL)
	step.Dir = strings.TrimSpace(step.Dir)
	if err := agentskill.ValidateStoredText("安装目录", step.Dir, maxPlanDirectoryRunes); err != nil {
		return err
	}
	switch step.Type {
	case stepTypeCommand:
		step.Command = normalizeInstallCommand(step.Command)
		if step.Command == "" {
			return fmt.Errorf("command 不能为空")
		}
		if err := validateInstallCommand(step.Command); err != nil {
			return err
		}
		if err := agentskill.ValidateStoredBytes("安装命令", step.Command, maxPlanCommandBytes); err != nil {
			return err
		}
		step.URL = ""
		step.Extract = false
	case stepTypeDownload:
		if step.URL == "" {
			return fmt.Errorf("url 不能为空")
		}
		if isSkillHubInstallInstructionURL(step.URL) {
			return fmt.Errorf("SkillHub 安装说明页面不能作为技能下载地址")
		}
		if isGitHubTreeURL(step.URL) {
			return fmt.Errorf("GitHub 技能子目录不能直接下载，请使用安装命令")
		}
		if rawURL := githubBlobSkillURL(step.URL); rawURL != "" {
			step.URL = rawURL
			step.Extract = false
		} else if isSingleSkillFileURL(step.URL) {
			step.Extract = false
		}
		if err := agentskill.ValidateStoredText("下载地址", step.URL, maxPlanURLRunes); err != nil {
			return err
		}
		parsed, err := url.Parse(step.URL)
		if err != nil || parsed.Hostname() == "" || (strings.ToLower(parsed.Scheme) != "http" && strings.ToLower(parsed.Scheme) != "https") {
			return fmt.Errorf("url 不合法")
		}
		if parsed.User != nil {
			return fmt.Errorf("url 不能包含账号或凭据")
		}
		step.Command = ""
		step.Dir = ""
	default:
		return fmt.Errorf("不支持的 step type: %s", step.Type)
	}
	return nil
}

func normalizeCollect(collect *installPlanCollect) error {
	collect.Entry = agentskill.EntryFile
	if len(collect.Roots) == 0 {
		collect.Roots = []string{"."}
	}
	if len(collect.Roots) > maxCollectRoots {
		return fmt.Errorf("技能发现目录不能超过 %d 个", maxCollectRoots)
	}
	roots := make([]string, 0, len(collect.Roots))
	seen := make(map[string]struct{}, len(collect.Roots))
	for _, root := range collect.Roots {
		root = strings.TrimSpace(root)
		if root == "" {
			root = "."
		}
		if err := agentskill.ValidateStoredText("技能发现目录", root, maxPlanCollectRootRunes); err != nil {
			return err
		}
		if _, exists := seen[root]; exists {
			continue
		}
		seen[root] = struct{}{}
		roots = append(roots, root)
	}
	collect.Roots = roots
	collect.Mode = strings.ToLower(strings.TrimSpace(collect.Mode))
	if collect.Mode != collectModeOne {
		collect.Mode = collectModeAll
	}
	return nil
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
