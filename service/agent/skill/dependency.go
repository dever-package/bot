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

const (
	dependencyInstallTimeout = 5 * time.Minute
	dependencyCheckInterval  = 500 * time.Millisecond
	maxDependencyFiles       = 50_000
	maxDependencyBytes       = int64(512 * 1024 * 1024)
	maxDependencyDepth       = 32
)

var dependencyTreeLimits = TreeLimits{
	MaxFiles: maxDependencyFiles,
	MaxBytes: maxDependencyBytes,
	MaxDepth: maxDependencyDepth,
}

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
	config, err = sandbox.IsolatedConfig(config, true)
	if err != nil {
		return nil, err
	}
	dependencies := make([]any, 0, 2)
	managedRoot, _, err := ResolveRelativePath(root, ".dever")
	if err != nil {
		return nil, err
	}
	if err := os.RemoveAll(managedRoot); err != nil {
		return nil, err
	}
	defer os.RemoveAll(filepath.Join(managedRoot, "home"))

	hasRequirements, err := regularDependencyFile(root, "requirements.txt")
	if err != nil {
		return nil, err
	}
	hasPyproject, err := regularDependencyFile(root, "pyproject.toml")
	if err != nil {
		return nil, err
	}
	if hasRequirements || hasPyproject {
		target := filepath.Join(root, ".dever", "deps", "python")
		if err := resetDependencyDirectory(target); err != nil {
			return nil, err
		}
		dependencyFile := "pyproject.toml"
		args := []string{"-m", "pip", "install", "--disable-pip-version-check", ".", "-t", ".dever/deps/python"}
		if hasRequirements {
			dependencyFile = "requirements.txt"
			args = []string{"-m", "pip", "install", "--disable-pip-version-check", "-r", dependencyFile, "-t", ".dever/deps/python"}
		}
		if err := runDependencyCommand(ctx, config, root, managedRoot, "python3", args...); err != nil {
			return nil, fmt.Errorf("安装 Python 依赖失败: %w", err)
		}
		digest, err := DirectoryContentHash(target)
		if err != nil {
			return nil, err
		}
		dependencies = append(dependencies, map[string]any{
			"type": "python", "file": dependencyFile, "path": ".dever/deps/python", "digest": digest,
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
		if err := copyDependencyFile(root, target, "package.json"); err != nil {
			return nil, err
		}
		lockFile := ""
		for _, candidate := range []string{"npm-shrinkwrap.json", "package-lock.json"} {
			exists, fileErr := regularDependencyFile(root, candidate)
			if fileErr != nil {
				return nil, fileErr
			}
			if !exists {
				continue
			}
			lockFile = candidate
			if err := copyDependencyFile(root, target, candidate); err != nil {
				return nil, err
			}
			break
		}
		npmCommand := "install"
		if lockFile != "" {
			npmCommand = "ci"
		}
		if err := runDependencyCommand(ctx, config, root, managedRoot, "npm", npmCommand, "--ignore-scripts", "--omit=dev", "--prefix", ".dever/deps/node"); err != nil {
			return nil, fmt.Errorf("安装 Node 依赖失败: %w", err)
		}
		dependency := map[string]any{
			"type": "node", "file": "package.json", "path": ".dever/deps/node",
		}
		if lockFile != "" {
			dependency["lock_file"] = lockFile
		}
		digest, err := DirectoryContentHash(target)
		if err != nil {
			return nil, err
		}
		dependency["digest"] = digest
		dependencies = append(dependencies, dependency)
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

func copyDependencyFile(root string, target string, name string) error {
	path, _, err := ResolveRelativePath(root, name)
	if err != nil {
		return err
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(target, name), raw, 0o644)
}

func validateDependencyTree(root string) error {
	return ValidateTreeLimits(root, dependencyTreeLimits)
}

func runDependencyCommand(ctx context.Context, config sandbox.Config, workDir string, limitRoot string, name string, args ...string) error {
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
	if err := command.Start(); err != nil {
		return err
	}
	wait := make(chan error, 1)
	go func() {
		wait <- command.Wait()
	}()
	ticker := time.NewTicker(dependencyCheckInterval)
	defer ticker.Stop()
	for {
		select {
		case err := <-wait:
			if timeoutCtx.Err() == context.DeadlineExceeded {
				return fmt.Errorf("依赖安装超时")
			}
			if err != nil {
				return dependencyCommandError(err, output)
			}
			return validateDependencyTree(limitRoot)
		case <-ticker.C:
			if err := validateDependencyTree(limitRoot); err != nil {
				cancel()
				<-wait
				return fmt.Errorf("依赖目录超过资源限制: %w", err)
			}
		case <-timeoutCtx.Done():
			<-wait
			if timeoutCtx.Err() == context.DeadlineExceeded {
				return fmt.Errorf("依赖安装超时")
			}
			return timeoutCtx.Err()
		}
	}
}

func dependencyCommandError(err error, output *sandbox.OutputBuffer) error {
	message := strings.TrimSpace(output.String())
	if message == "" {
		message = err.Error()
	}
	if output.Truncated() {
		message += "\n[依赖安装输出已截断]"
	}
	return fmt.Errorf("%s", message)
}

func dependencyCommandEnv(config sandbox.Config, workDir string) []string {
	home := filepath.Join(workDir, ".dever", "home")
	if sandbox.NormalizeConfig(config).Driver == sandbox.DriverBwrap {
		home = "/work/.dever/home"
	}
	return []string{
		"HOME=" + home,
		"TMPDIR=" + home,
		"PATH=" + sandbox.CommandPath(),
		"LANG=C.UTF-8",
		"LC_ALL=C.UTF-8",
		"CI=true",
		"PIP_DISABLE_PIP_VERSION_CHECK=1",
		"PIP_NO_INPUT=1",
		"NPM_CONFIG_FUND=false",
		"NPM_CONFIG_AUDIT=false",
	}
}
