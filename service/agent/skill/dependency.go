package skill

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
)

const dependencyInstallTimeout = 5 * time.Minute

func PrepareDependencies(ctx context.Context, config sandbox.Config, root string) ([]any, error) {
	root = strings.TrimSpace(root)
	if root == "" {
		return nil, fmt.Errorf("技能依赖目录不能为空")
	}
	absoluteRoot, err := filepath.Abs(filepath.Clean(root))
	if err != nil {
		return nil, err
	}
	info, err := os.Lstat(absoluteRoot)
	if err != nil {
		return nil, err
	}
	if info.Mode()&os.ModeSymlink != 0 || !info.IsDir() {
		return nil, fmt.Errorf("技能依赖目录不是普通目录: %s", root)
	}
	root = absoluteRoot
	config = sandbox.NormalizeConfig(config)
	config.NetworkMode = sandbox.NetworkHost
	dependencies := make([]any, 0, 2)
	managedRoot, _, err := ResolveRelativePath(root, ".dever")
	if err != nil {
		return nil, err
	}
	if err := os.RemoveAll(managedRoot); err != nil {
		return nil, err
	}
	defer os.RemoveAll(filepath.Join(managedRoot, "home"))

	hasPython, err := regularDependencyFile(root, "requirements.txt")
	if err != nil {
		return nil, err
	}
	if hasPython {
		target := filepath.Join(root, ".dever", "deps", "python")
		if err := resetDependencyDirectory(target); err != nil {
			return nil, err
		}
		if err := runDependencyCommand(ctx, config, root, "python3", "-m", "pip", "install", "--disable-pip-version-check", "-r", "requirements.txt", "-t", ".dever/deps/python"); err != nil {
			return nil, fmt.Errorf("安装 Python 依赖失败: %w", err)
		}
		dependencies = append(dependencies, map[string]any{
			"type": "python", "file": "requirements.txt", "path": ".dever/deps/python",
		})
	}

	hasNode, err := regularDependencyFile(root, "package.json")
	if err != nil {
		return nil, err
	}
	if hasNode {
		target := filepath.Join(root, ".dever", "deps", "node")
		if err := resetDependencyDirectory(target); err != nil {
			return nil, err
		}
		packageJSON, _, err := ResolveRelativePath(root, "package.json")
		if err != nil {
			return nil, err
		}
		raw, err := os.ReadFile(packageJSON)
		if err != nil {
			return nil, err
		}
		if err := os.WriteFile(filepath.Join(target, "package.json"), raw, 0o644); err != nil {
			return nil, err
		}
		if err := runDependencyCommand(ctx, config, root, "npm", "install", "--ignore-scripts", "--omit=dev", "--prefix", ".dever/deps/node"); err != nil {
			return nil, fmt.Errorf("安装 Node 依赖失败: %w", err)
		}
		dependencies = append(dependencies, map[string]any{
			"type": "node", "file": "package.json", "path": ".dever/deps/node",
		})
	}
	return dependencies, nil
}

func regularDependencyFile(root string, name string) (bool, error) {
	path, _, err := ResolveRelativePath(root, name)
	if err != nil {
		return false, err
	}
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	if !info.Mode().IsRegular() {
		return false, fmt.Errorf("依赖声明必须是普通文件: %s", name)
	}
	if info.Size() > DefaultLimits().SkillFileMaxBytes {
		return false, fmt.Errorf("依赖声明超过 %d 字节限制: %s", DefaultLimits().SkillFileMaxBytes, name)
	}
	return true, nil
}

func resetDependencyDirectory(path string) error {
	if err := os.RemoveAll(path); err != nil {
		return err
	}
	return os.MkdirAll(path, 0o755)
}

func runDependencyCommand(ctx context.Context, config sandbox.Config, workDir string, name string, args ...string) error {
	home := filepath.Join(workDir, ".dever", "home")
	if err := os.MkdirAll(home, 0o755); err != nil {
		return err
	}
	timeoutCtx, cancel := context.WithTimeout(ctx, dependencyInstallTimeout)
	defer cancel()
	process, err := sandbox.PrepareWorkspaceProcess(config, workDir, dependencyCommandEnv(config, workDir), name, args)
	if err != nil {
		return err
	}
	command := exec.CommandContext(timeoutCtx, process.CommandName, process.CommandArgs...)
	command.Dir = process.WorkDir
	command.Env = process.Env
	output := sandbox.NewOutputBuffer(sandbox.DefaultOutputMaxBytes)
	command.Stdout = output
	command.Stderr = output
	err = command.Run()
	if timeoutCtx.Err() == context.DeadlineExceeded {
		return fmt.Errorf("依赖安装超时")
	}
	if err != nil {
		message := strings.TrimSpace(output.String())
		if message == "" {
			message = err.Error()
		}
		if output.Truncated() {
			message += "\n[依赖安装输出已截断]"
		}
		return fmt.Errorf("%s", message)
	}
	return nil
}

func dependencyCommandEnv(config sandbox.Config, workDir string) []string {
	home := filepath.Join(workDir, ".dever", "home")
	if sandbox.NormalizeConfig(config).Driver == sandbox.DriverBwrap {
		home = "/work/.dever/home"
	}
	return []string{
		"HOME=" + home,
		"TMPDIR=" + home,
		"PATH=/usr/local/bin:/usr/bin:/bin",
		"LANG=C.UTF-8",
		"LC_ALL=C.UTF-8",
		"CI=true",
		"PIP_DISABLE_PIP_VERSION_CHECK=1",
		"PIP_NO_INPUT=1",
		"NPM_CONFIG_FUND=false",
		"NPM_CONFIG_AUDIT=false",
	}
}
