package install

import (
	"net/url"
	"os/exec"
	"regexp"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func directSkillHubPlan(input string) (installPlan, bool) {
	target := skillHubInstallTarget(input)
	if target == "" {
		return installPlan{}, false
	}
	return commandPlan(
		"通过 SkillHub 安装技能 "+target,
		"skillhub install "+target+" --dir .",
		[]string{"."},
	)
}

func directCommandPlan(input string) (installPlan, bool) {
	command := normalizeInstallCommand(strings.TrimSpace(input))
	if command == "" || validateInstallCommand(command) != nil {
		return installPlan{}, false
	}
	return commandPlan("执行用户提供的技能安装命令", command, []string{"."})
}

func normalizeInstallCommand(command string) string {
	command = normalizeSkillsAddCommand(command)
	fields := strings.Fields(command)
	if installCommandName(command) == "skillhub" && len(fields) >= 2 &&
		(strings.EqualFold(fields[1], "install") || strings.EqualFold(fields[1], "add")) &&
		!hasCommandOption(fields, "-d", "--dir") {
		command += " --dir ."
	}
	return command
}

func normalizeSkillsAddCommand(command string) string {
	fields := strings.Fields(command)
	if !isSkillsAddCommand(fields) {
		return command
	}
	if !hasCommandOption(fields, "-a", "--agent", "--all") {
		command += " --agent codex"
	}
	if !hasCommandOption(fields, "-y", "--yes", "--all") {
		command += " --yes"
	}
	return command
}

func isSkillsAddCommand(fields []string) bool {
	if len(fields) < 3 {
		return false
	}
	name := installCommandName(strings.Join(fields, " "))
	switch name {
	case "npx":
		index := 1
		for index < len(fields) && (fields[index] == "-y" || fields[index] == "--yes") {
			index++
		}
		return skillsAddAt(fields, index)
	case "bunx":
		return skillsAddAt(fields, 1)
	case "npm":
		return strings.EqualFold(fields[1], "exec") && containsSkillsAdd(fields, 2)
	case "pnpm", "yarn":
		action := strings.ToLower(fields[1])
		return (action == "dlx" || action == "exec") && containsSkillsAdd(fields, 2)
	case "bun":
		return strings.EqualFold(fields[1], "x") && containsSkillsAdd(fields, 2)
	default:
		return false
	}
}

func containsSkillsAdd(fields []string, start int) bool {
	for index := start; index < len(fields); index++ {
		if skillsAddAt(fields, index) {
			return true
		}
	}
	return false
}

func skillsAddAt(fields []string, index int) bool {
	if index < 0 || index >= len(fields) || !isSkillsPackage(fields[index]) {
		return false
	}
	index++
	if index < len(fields) && fields[index] == "--" {
		index++
	}
	return index < len(fields) && strings.EqualFold(fields[index], "add")
}

func isSkillsPackage(value string) bool {
	value = strings.ToLower(strings.TrimSpace(value))
	return value == "skills" || (strings.HasPrefix(value, "skills@") && len(value) > len("skills@"))
}

func hasCommandOption(fields []string, names ...string) bool {
	for _, field := range fields {
		for _, name := range names {
			if field == name || strings.HasPrefix(field, name+"=") {
				return true
			}
		}
	}
	return false
}

func commandPlan(summary string, command string, roots []string) (installPlan, bool) {
	plan := installPlan{
		Kind:    planKind,
		Version: agentskill.InstallPlanVersion,
		Summary: summary,
		Steps: []installPlanStep{{
			Type: stepTypeCommand, Command: command, Dir: ".",
		}},
		Collect: installPlanCollect{
			Entry: agentskill.EntryFile, Roots: roots, Mode: collectModeAll,
		},
	}
	return plan, plan.NormalizeAndValidate() == nil
}

func skillHubInstallTarget(input string) string {
	if match := skillHubCommandTargetPattern.FindStringSubmatch(input); len(match) > 1 {
		return strings.TrimSpace(match[1])
	}
	if !containsSkillHubURL(input) {
		return ""
	}
	matches := installTargetPattern.FindAllStringSubmatch(input, -1)
	for index := len(matches) - 1; index >= 0; index-- {
		if target := normalizedSkillHubTarget(matches[index][1]); target != "" {
			return target
		}
	}
	return ""
}

func normalizedSkillHubTarget(target string) string {
	target = strings.TrimSpace(target)
	switch strings.ToLower(target) {
	case "skillhub", "skillhub-cli", "cli", "npx", "npm":
		return ""
	default:
		return target
	}
}

func containsSkillHubURL(input string) bool {
	for _, link := range httpURLs(input) {
		parsed, err := url.Parse(link)
		host := normalizedURLHost(parsed)
		if err == nil && (host == "skillhub.cn" || strings.HasSuffix(host, ".skillhub.cn")) {
			return true
		}
	}
	return false
}

func directGitHubPlan(input string) (installPlan, bool) {
	link := firstMatchingHTTPURL(input, directGitHubDownloadURL)
	if link == "" || len(githubArchiveCandidates(link)) == 0 {
		return installPlan{}, false
	}
	link = publicSourceURL(link)
	if link == "" {
		return installPlan{}, false
	}
	return downloadPlan("通过 GitHub 仓库下载技能", link, true)
}

func directGitHubTreePlan(input string) (installPlan, bool) {
	link := firstMatchingHTTPURL(input, isGitHubTreeURL)
	if link == "" {
		return installPlan{}, false
	}
	if _, err := exec.LookPath("npx"); err != nil {
		return installPlan{}, false
	}
	link = publicSourceURL(link)
	if link == "" {
		return installPlan{}, false
	}
	return commandPlan(
		"通过官方 skills CLI 安装 GitHub 子目录技能",
		"npx skills add "+link+" --agent codex --yes",
		[]string{"."},
	)
}

func directURLPlan(input string) (installPlan, bool) {
	for _, link := range httpURLs(input) {
		if rawURL := githubBlobSkillURL(link); rawURL != "" {
			return downloadPlan("下载 GitHub 技能文件", rawURL, false)
		}
		parsed, err := url.Parse(link)
		if err != nil || parsed == nil || parsed.Hostname() == "" {
			continue
		}
		if isSingleSkillFileURL(link) {
			return downloadPlan("下载技能文件", link, false)
		}
		if isArchivePath(strings.ToLower(parsed.Path)) {
			return downloadPlan("下载技能压缩包", link, true)
		}
	}
	return installPlan{}, false
}

func isSingleSkillFileURL(rawURL string) bool {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed == nil {
		return false
	}
	lowerPath := strings.ToLower(parsed.Path)
	return strings.HasSuffix(lowerPath, "/skill.md") || lowerPath == "skill.md"
}

func isGitHubTreeURL(rawURL string) bool {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed == nil || normalizedURLHost(parsed) != "github.com" {
		return false
	}
	parts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
	return len(parts) >= 4 && parts[2] == "tree"
}

func isSkillHubInstallInstructionURL(rawURL string) bool {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed == nil {
		return false
	}
	host := normalizedURLHost(parsed)
	return (host == "skillhub.cn" || strings.HasSuffix(host, ".skillhub.cn")) &&
		strings.HasPrefix(strings.ToLower(parsed.Path), "/install/")
}

func githubBlobSkillURL(rawURL string) string {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed == nil || normalizedURLHost(parsed) != "github.com" {
		return ""
	}
	parts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
	if len(parts) < 5 || parts[2] != "blob" || !strings.EqualFold(parts[len(parts)-1], agentskill.EntryFile) {
		return ""
	}
	rawParts := append([]string(nil), parts[:2]...)
	rawParts = append(rawParts, parts[3:]...)
	return (&url.URL{Scheme: "https", Host: "raw.githubusercontent.com", Path: "/" + strings.Join(rawParts, "/")}).String()
}

func isArchivePath(value string) bool {
	for _, suffix := range []string{".zip", ".tar", ".tar.gz", ".tgz"} {
		if strings.HasSuffix(value, suffix) {
			return true
		}
	}
	return false
}

func downloadPlan(summary string, link string, extract bool) (installPlan, bool) {
	plan := installPlan{
		Kind:    planKind,
		Version: agentskill.InstallPlanVersion,
		Summary: summary,
		Steps:   []installPlanStep{{Type: stepTypeDownload, URL: link, Extract: extract}},
		Collect: installPlanCollect{
			Entry: agentskill.EntryFile, Roots: []string{"."}, Mode: collectModeAll,
		},
	}
	return plan, plan.NormalizeAndValidate() == nil
}

func directGitHubDownloadURL(rawURL string) bool {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed == nil || normalizedURLHost(parsed) != "github.com" {
		return false
	}
	parts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
	if len(parts) == 2 {
		return parts[0] != "" && strings.TrimSuffix(parts[1], ".git") != ""
	}
	return len(parts) >= 5 && parts[0] != "" && parts[1] != "" && parts[2] == "archive"
}

func normalizedURLHost(parsed *url.URL) string {
	if parsed == nil {
		return ""
	}
	return strings.TrimPrefix(strings.ToLower(parsed.Hostname()), "www.")
}

func firstMatchingHTTPURL(input string, matches func(string) bool) string {
	for _, link := range httpURLs(input) {
		if matches(link) {
			return link
		}
	}
	return ""
}

func httpURLs(input string) []string {
	result := make([]string, 0)
	seen := map[string]struct{}{}
	for _, match := range httpURLPattern.FindAllString(input, -1) {
		link := strings.Trim(match, " \t\r\n，。；;、()[]{}<>\"'")
		if link == "" {
			continue
		}
		if _, exists := seen[link]; exists {
			continue
		}
		seen[link] = struct{}{}
		result = append(result, link)
	}
	return result
}

func installFallbackSourceURL(input string) string {
	link := firstMatchingHTTPURL(input, func(candidate string) bool {
		return !isSkillHubInstallInstructionURL(candidate)
	})
	return publicSourceURL(link)
}

var (
	httpURLPattern               = regexp.MustCompile(`https?://[^\s\])>，。；;、]+`)
	skillHubCommandTargetPattern = regexp.MustCompile(`(?i)\bskillhub\s+(?:install|add)\s+([@a-z0-9][a-z0-9._/@-]*)`)
	installTargetPattern         = regexp.MustCompile(`(?i)(?:安装[ \t:：]*|install[ \t:：]+)([@a-z0-9][a-z0-9._/@-]*)`)
)
