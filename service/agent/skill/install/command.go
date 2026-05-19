package install

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	osexec "os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
)

const skillHubInstallScriptURL = "https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh"

type commandOutputFunc func(string)

func runInstallCommand(ctx context.Context, workDir string, command string, onOutput commandOutputFunc) (string, error) {
	command = strings.TrimSpace(command)
	if command == "" {
		return "", fmt.Errorf("安装命令不能为空")
	}
	if err := validateInstallCommand(command); err != nil {
		return "", err
	}

	homeDir := filepath.Join(workDir, ".home")
	if err := os.MkdirAll(homeDir, 0o755); err != nil {
		return "", err
	}

	cmd := osexec.CommandContext(ctx, "bash", "-lc", installCommandScript(command))
	cmd.Dir = workDir
	cmd.Env = append(os.Environ(), installCommandEnv(workDir, homeDir)...)

	text, err := runCommandWithOutput(ctx, cmd, onOutput)
	if ctx.Err() != nil {
		return text, fmt.Errorf("安装命令执行超时")
	}
	if err != nil {
		if output := commandErrorOutput(text); output != "" {
			return text, fmt.Errorf("安装命令执行失败: %w\n%s", err, output)
		}
		return text, fmt.Errorf("安装命令执行失败: %w", err)
	}
	return text, nil
}

func runCommandWithOutput(ctx context.Context, cmd *osexec.Cmd, onOutput commandOutputFunc) (string, error) {
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return "", err
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return "", err
	}

	var output strings.Builder
	var outputMu sync.Mutex
	appendOutput := func(line string) {
		line = strings.TrimSpace(line)
		if line == "" {
			return
		}
		outputMu.Lock()
		if output.Len() > 0 {
			output.WriteByte('\n')
		}
		output.WriteString(line)
		text := trimCommandOutput(output.String())
		output.Reset()
		output.WriteString(text)
		outputMu.Unlock()
		if onOutput != nil {
			onOutput(line)
		}
	}

	if err := cmd.Start(); err != nil {
		return "", err
	}

	var readers sync.WaitGroup
	readers.Add(2)
	go scanCommandOutput(stdout, appendOutput, &readers)
	go scanCommandOutput(stderr, appendOutput, &readers)
	readers.Wait()

	err = cmd.Wait()
	if ctx.Err() != nil {
		err = ctx.Err()
	}

	outputMu.Lock()
	text := trimCommandOutput(output.String())
	outputMu.Unlock()
	return text, err
}

func scanCommandOutput(reader io.Reader, onLine func(string), wg *sync.WaitGroup) {
	defer wg.Done()
	scanner := bufio.NewScanner(reader)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	for scanner.Scan() {
		onLine(scanner.Text())
	}
}

func installCommandScript(command string) string {
	if !usesSkillHubCommand(command) {
		return command
	}
	return skillHubCommandPrelude() + "\n" + command
}

func usesSkillHubCommand(command string) bool {
	return regexp.MustCompile(`(?i)\bskillhub\b`).MatchString(command)
}

func skillHubCommandPrelude() string {
	return strings.Join([]string{
		`export PATH="$HOME/.skillhub/bin:$HOME/.skillhub:$HOME/.local/bin:$HOME/bin:$PWD/.bin:$PWD/bin:$PWD/node_modules/.bin:$PATH"`,
		`skillhub() {`,
		`  local bin`,
		`  bin="$(type -P skillhub 2>/dev/null || true)"`,
		`  if [ -z "$bin" ]; then`,
		fmt.Sprintf(`    curl -fsSL %q | bash -s -- --cli-only`, skillHubInstallScriptURL),
		`    export PATH="$HOME/.skillhub/bin:$HOME/.skillhub:$HOME/.local/bin:$HOME/bin:$PWD/.bin:$PWD/bin:$PWD/node_modules/.bin:$PATH"`,
		`    bin="$(type -P skillhub 2>/dev/null || find "$HOME" "$PWD" -type f -name skillhub -perm -111 2>/dev/null | head -n 1 || true)"`,
		`  fi`,
		`  if [ -z "$bin" ]; then`,
		`    echo "skillhub command not found after CLI install" >&2`,
		`    return 127`,
		`  fi`,
		`  "$bin" "$@"`,
		`}`,
	}, "\n")
}

func validateInstallCommand(command string) error {
	lower := strings.ToLower(command)
	for _, forbidden := range []string{"sudo ", " su ", "mkfs", ":(){", "shutdown", "reboot"} {
		if strings.Contains(lower, forbidden) {
			return fmt.Errorf("安装命令包含不允许的操作: %s", strings.TrimSpace(forbidden))
		}
	}
	dangerous := []*regexp.Regexp{
		regexp.MustCompile(`(?i)\brm\s+-[^\n;&|]*r[^\n;&|]*f[^\n;&|]*(/|\$HOME|~)`),
		regexp.MustCompile(`(?i)>\s*/etc/`),
		regexp.MustCompile(`(?i)\bchmod\s+777\s+/`),
	}
	for _, pattern := range dangerous {
		if pattern.MatchString(command) {
			return fmt.Errorf("安装命令包含危险文件操作")
		}
	}
	return nil
}

func installCommandEnv(workDir string, homeDir string) []string {
	commandPath := strings.Join(installCommandPaths(workDir, homeDir), string(os.PathListSeparator))

	return []string{
		"HOME=" + homeDir,
		"XDG_CONFIG_HOME=" + filepath.Join(homeDir, ".config"),
		"CODEX_HOME=" + filepath.Join(homeDir, ".codex"),
		"CLAUDE_HOME=" + filepath.Join(homeDir, ".claude"),
		"SKILLS_HOME=" + workDir,
		"SKILLS_DIR=" + workDir,
		"CI=true",
		"NO_COLOR=1",
		"PATH=" + commandPath,
	}
}

func installCommandPaths(workDir string, homeDir string) []string {
	return []string{
		filepath.Join(homeDir, ".skillhub", "bin"),
		filepath.Join(homeDir, ".skillhub"),
		filepath.Join(homeDir, ".local", "bin"),
		filepath.Join(homeDir, "bin"),
		filepath.Join(workDir, ".bin"),
		filepath.Join(workDir, "bin"),
		filepath.Join(workDir, "node_modules", ".bin"),
		os.Getenv("PATH"),
	}
}

func trimCommandOutput(output string) string {
	if len(output) > 32*1024 {
		return output[len(output)-32*1024:]
	}
	return output
}

func commandErrorOutput(output string) string {
	output = strings.TrimSpace(stripANSI(output))
	if output == "" {
		return ""
	}
	runes := []rune(output)
	if len(runes) > 4000 {
		output = "...\n" + string(runes[len(runes)-4000:])
	}
	return output
}

func stripANSI(output string) string {
	output = regexp.MustCompile(`\x1b\[[0-9;?]*[ -/]*[@-~]`).ReplaceAllString(output, "")
	output = regexp.MustCompile(`\x1b[()][A-Za-z0-9]`).ReplaceAllString(output, "")
	return output
}
