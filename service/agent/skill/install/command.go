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

	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
)

const skillHubInstallScriptURL = "https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh"

const maxCommandOutputLineBytes = 1024 * 1024

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

	homeDir := filepath.Join(workDir, ".home")
	if err := os.MkdirAll(homeDir, 0o755); err != nil {
		return "", err
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
	cmd := osexec.CommandContext(ctx, process.CommandName, process.CommandArgs...)
	cmd.Dir = process.WorkDir
	cmd.Env = process.Env

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
	return nil
}

var allowedInstallCommands = map[string]struct{}{
	"bun": {}, "bunx": {}, "curl": {}, "git": {}, "node": {}, "npm": {},
	"npx": {}, "pnpm": {}, "skillhub": {}, "tar": {}, "unzip": {}, "yarn": {},
}

func installCommandName(command string) string {
	fields := strings.Fields(strings.TrimSpace(command))
	if len(fields) == 0 {
		return ""
	}
	return strings.ToLower(filepath.Base(fields[0]))
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
