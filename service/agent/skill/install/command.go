package install

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"net/url"
	"os"
	osexec "os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/dever-package/bot/service/agent/netguard"
	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const skillHubInstallScriptURL = "https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh"

const (
	maxCommandOutputLineBytes   = 1024 * 1024
	maxCommandStreamOutputBytes = 512 * 1024
)

const installWorkspaceCheckInterval = 500 * time.Millisecond

var (
	installShellControlPattern = regexp.MustCompile("[\\r\\n;|&<>`]")
	ansiControlPattern         = regexp.MustCompile(`\x1b\[[0-9;?]*[ -/]*[@-~]`)
	ansiCharsetPattern         = regexp.MustCompile(`\x1b[()][A-Za-z0-9]`)
)

type commandOutputFunc func(string)

func runInstallCommand(ctx context.Context, sandboxConfig sandbox.Config, workDir string, command string, onOutput commandOutputFunc) (string, error) {
	command = strings.TrimSpace(command)
	if command == "" {
		return "", fmt.Errorf("安装命令不能为空")
	}
	if err := validateInstallCommand(command); err != nil {
		return "", err
	}
	if err := validateInstallCommandNetwork(ctx, command); err != nil {
		return "", err
	}

	homeDir := filepath.Join(workDir, ".home")
	if !gitClonesIntoWorkspace(command) {
		if err := os.MkdirAll(homeDir, 0o755); err != nil {
			return "", err
		}
	}

	commandRoot := workDir
	commandHome := homeDir
	if sandbox.NormalizeConfig(sandboxConfig).Driver == sandbox.DriverBwrap {
		commandRoot = "/work"
		commandHome = "/work/.home"
	}
	process, err := sandbox.PrepareWorkspaceProcess(
		sandboxConfig,
		workDir,
		installCommandEnv(commandRoot, commandHome),
		"bash",
		[]string{"-lc", installCommandScript(command)},
	)
	if err != nil {
		return "", err
	}
	if err := agentskill.ValidateTreeLimits(workDir, installWorkspaceLimits); err != nil {
		return "", fmt.Errorf("技能安装工作区超过资源限制: %w", err)
	}
	commandCtx, cancel := context.WithCancel(ctx)
	defer cancel()
	cmd := osexec.CommandContext(commandCtx, process.CommandName, process.CommandArgs...)
	cmd.Dir = process.WorkDir
	cmd.Env = process.Env

	monitorStop := make(chan struct{})
	monitorResult := make(chan error, 1)
	go monitorInstallWorkspace(commandCtx, workDir, monitorStop, monitorResult, cancel)
	text, err := runCommandWithOutput(ctx, cmd, onOutput)
	close(monitorStop)
	if monitorErr := <-monitorResult; monitorErr != nil {
		return text, monitorErr
	}
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

func monitorInstallWorkspace(ctx context.Context, root string, stop <-chan struct{}, result chan<- error, cancel context.CancelFunc) {
	ticker := time.NewTicker(installWorkspaceCheckInterval)
	defer ticker.Stop()
	for {
		select {
		case <-stop:
			result <- nil
			return
		case <-ctx.Done():
			result <- nil
			return
		case <-ticker.C:
			if err := agentskill.ValidateTreeLimits(root, installWorkspaceLimits); err != nil {
				cancel()
				result <- fmt.Errorf("技能安装工作区超过资源限制: %w", err)
				return
			}
		}
	}
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
	streamedBytes := 0
	streamTruncated := false
	appendOutput := func(line string) {
		line = strings.TrimSpace(line)
		if line == "" {
			return
		}
		streamLine := ""
		outputMu.Lock()
		if output.Len() > 0 {
			output.WriteByte('\n')
		}
		output.WriteString(line)
		text := trimCommandOutput(output.String())
		output.Reset()
		output.WriteString(text)
		if onOutput != nil && !streamTruncated {
			nextBytes := len(line)
			if streamedBytes > 0 {
				nextBytes++
			}
			if streamedBytes+nextBytes <= maxCommandStreamOutputBytes {
				streamedBytes += nextBytes
				streamLine = line
			} else {
				streamTruncated = true
				streamLine = "安装命令输出过多，后续输出已省略"
			}
		}
		outputMu.Unlock()
		if streamLine != "" {
			onOutput(streamLine)
		}
	}

	if err := cmd.Start(); err != nil {
		return "", err
	}

	var readers sync.WaitGroup
	readErrors := make(chan error, 2)
	readers.Add(2)
	go scanCommandOutput(stdout, appendOutput, &readers, readErrors)
	go scanCommandOutput(stderr, appendOutput, &readers, readErrors)
	readers.Wait()
	close(readErrors)

	err = cmd.Wait()
	if ctx.Err() != nil {
		err = ctx.Err()
	} else if err == nil {
		for readErr := range readErrors {
			if readErr != nil {
				err = readErr
				break
			}
		}
	}

	outputMu.Lock()
	text := trimCommandOutput(output.String())
	outputMu.Unlock()
	return text, err
}

func scanCommandOutput(reader io.Reader, onLine func(string), wg *sync.WaitGroup, errors chan<- error) {
	defer wg.Done()
	buffered := bufio.NewReaderSize(reader, 64*1024)
	var line strings.Builder
	truncated := false
	for {
		fragment, prefix, err := buffered.ReadLine()
		if len(fragment) > 0 {
			remaining := maxCommandOutputLineBytes - line.Len()
			if remaining > 0 {
				if len(fragment) > remaining {
					line.Write(fragment[:remaining])
					truncated = true
				} else {
					line.Write(fragment)
				}
			} else {
				truncated = true
			}
		}
		if !prefix && (line.Len() > 0 || truncated) {
			text := line.String()
			if truncated {
				text += " [单行输出已截断]"
			}
			onLine(text)
			line.Reset()
			truncated = false
		}
		if err != nil {
			if err != io.EOF {
				errors <- err
			}
			return
		}
	}
}

func installCommandScript(command string) string {
	if !usesSkillHubCommand(command) {
		return command
	}
	return skillHubCommandPrelude() + "\n" + command
}

func usesSkillHubCommand(command string) bool {
	return installCommandName(command) == "skillhub"
}

func skillHubCommandPrelude() string {
	return strings.Join([]string{
		`export TAR_OPTIONS="${TAR_OPTIONS:+$TAR_OPTIONS }--no-same-owner"`,
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
	if installShellControlPattern.MatchString(command) || strings.Contains(command, "$(") {
		return fmt.Errorf("安装命令只允许单条命令，不支持 shell 组合、重定向或命令替换")
	}
	name := installCommandName(command)
	if _, allowed := allowedInstallCommands[name]; !allowed {
		return fmt.Errorf("不支持的技能安装命令: %s", name)
	}
	fields := strings.Fields(command)
	if name == "git" && (len(fields) < 3 || strings.ToLower(fields[1]) != "clone") {
		return fmt.Errorf("安装命令只允许使用 git clone")
	}
	if err := validateInstallCommandAction(name, fields); err != nil {
		return err
	}
	return nil
}

var allowedInstallCommands = map[string]struct{}{
	"bun": {}, "bunx": {}, "git": {}, "npm": {}, "npx": {}, "pnpm": {}, "skillhub": {}, "yarn": {},
}

func validateInstallCommandAction(name string, fields []string) error {
	if len(fields) < 2 {
		return fmt.Errorf("安装命令缺少操作参数")
	}
	if name == "npx" {
		return validateNpxPackage(fields[1:])
	}
	action := strings.ToLower(strings.TrimSpace(fields[1]))
	allowed := map[string]map[string]struct{}{
		"npm":      {"install": {}, "i": {}, "add": {}, "exec": {}},
		"pnpm":     {"install": {}, "i": {}, "add": {}, "dlx": {}, "exec": {}},
		"yarn":     {"install": {}, "add": {}, "dlx": {}, "exec": {}},
		"bun":      {"install": {}, "add": {}, "x": {}},
		"skillhub": {"install": {}, "add": {}},
	}
	if actions, exists := allowed[name]; exists {
		if _, ok := actions[action]; !ok {
			return fmt.Errorf("不支持的 %s 安装操作: %s", name, action)
		}
	}
	if name == "bunx" && strings.HasPrefix(action, "-") {
		return fmt.Errorf("%s 必须直接指定安装工具包", name)
	}
	return nil
}

func validateNpxPackage(fields []string) error {
	for len(fields) > 0 && (fields[0] == "-y" || fields[0] == "--yes") {
		fields = fields[1:]
	}
	if len(fields) == 0 || strings.HasPrefix(fields[0], "-") {
		return fmt.Errorf("npx 必须直接指定安装工具包")
	}
	return nil
}

func validateInstallCommandNetwork(ctx context.Context, command string) error {
	fields := strings.Fields(command)
	foundURL := false
	for _, field := range fields {
		candidate := strings.Trim(field, " \t\r\n\"'()[]{}<>,;")
		if !strings.HasPrefix(candidate, "http://") && !strings.HasPrefix(candidate, "https://") {
			continue
		}
		parsed, err := url.Parse(candidate)
		if err != nil {
			return fmt.Errorf("安装命令包含无效外部地址")
		}
		if err := netguard.ValidateURL(ctx, parsed); err != nil {
			return err
		}
		foundURL = true
	}
	if installCommandName(command) == "git" && !foundURL {
		return fmt.Errorf("git clone 只允许使用经过校验的 http/https 地址")
	}
	return nil
}

func installCommandName(command string) string {
	fields := strings.Fields(strings.TrimSpace(command))
	if len(fields) == 0 {
		return ""
	}
	return strings.ToLower(filepath.Base(fields[0]))
}

func gitClonesIntoWorkspace(command string) bool {
	fields := strings.Fields(strings.TrimSpace(command))
	destination := ""
	if len(fields) > 0 {
		destination = strings.Trim(fields[len(fields)-1], "\"'")
	}
	return len(fields) >= 4 && installCommandName(command) == "git" &&
		strings.EqualFold(fields[1], "clone") && destination != "" && filepath.Clean(destination) == "."
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
		"npm_config_yes=true",
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
		sandbox.CommandPath(),
	}
}

func trimCommandOutput(output string) string {
	if len(output) > 32*1024 {
		output = output[len(output)-32*1024:]
	}
	return strings.ToValidUTF8(output, "")
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
	output = ansiControlPattern.ReplaceAllString(output, "")
	output = ansiCharsetPattern.ReplaceAllString(output, "")
	return output
}
