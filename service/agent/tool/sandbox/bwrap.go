package sandbox

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type bwrapRunner struct{}

func (bwrapRunner) Run(ctx context.Context, config Config, req Request) (Result, error) {
	bwrapPath, err := resolveBwrapPath(config.BwrapPath)
	if err != nil {
		return Result{}, err
	}
	hostScriptPath := filepath.Join(req.SkillRoot, filepath.FromSlash(req.ScriptRelative))
	sandboxScriptPath := "/skill/" + strings.TrimPrefix(filepath.ToSlash(req.ScriptRelative), "/")
	commandName, commandArgs, err := scriptCommandForPath(sandboxScriptPath, hostScriptPath, req.Args)
	if err != nil {
		return Result{}, err
	}

	args, err := bwrapArgs(config, req, commandName, commandArgs)
	if err != nil {
		return Result{}, err
	}
	result, err := runCommand(ctx, runCommandInput{
		Runner:         DriverBwrap,
		Script:         req.ScriptRelative,
		CommandName:    bwrapPath,
		CommandArgs:    args,
		Timeout:        requestTimeout(req, config),
		OutputMaxBytes: config.OutputMaxBytes,
	})
	if err != nil {
		return Result{}, err
	}
	if result.ExitCode != 0 && isBwrapStartupError(result.Stderr) {
		return Result{}, fmt.Errorf("bwrap 沙箱启动失败: %s。%s", strings.TrimSpace(result.Stderr), BwrapRuntimeGuide)
	}
	return result, nil
}

func resolveBwrapPath(path string) (string, error) {
	path = strings.TrimSpace(path)
	if path == "" {
		path = DefaultBwrapPath
	}
	if strings.Contains(path, string(os.PathSeparator)) {
		absolute, err := filepath.Abs(path)
		if err != nil {
			return "", err
		}
		if err := requireExecutable(absolute); err != nil {
			return "", fmt.Errorf("%s。%s", err.Error(), BwrapInstallGuide)
		}
		return absolute, nil
	}
	resolved, err := exec.LookPath(path)
	if err != nil {
		return "", fmt.Errorf("bwrap 未安装或不可执行: %s。%s", path, BwrapInstallGuide)
	}
	return resolved, nil
}

func requireExecutable(path string) error {
	info, err := os.Stat(path)
	if err != nil {
		return fmt.Errorf("bwrap 未安装或不可执行: %s", path)
	}
	if info.IsDir() || info.Mode()&0o111 == 0 {
		return fmt.Errorf("bwrap 未安装或不可执行: %s", path)
	}
	return nil
}

func bwrapArgs(config Config, req Request, commandName string, commandArgs []string) ([]string, error) {
	skillRoot, err := filepath.Abs(filepath.Clean(req.SkillRoot))
	if err != nil {
		return nil, err
	}
	tempRoot, err := filepath.Abs(filepath.Clean(req.TempRoot))
	if err != nil {
		return nil, err
	}

	args := []string{
		"--die-with-parent",
		"--new-session",
		"--unshare-all",
		"--clearenv",
	}
	if config.NetworkMode == NetworkHost {
		args = append(args, "--share-net")
	}
	args = append(args,
		"--ro-bind", skillRoot, "/skill",
		"--bind", tempRoot, "/work",
	)
	args = appendReadOnlyBinds(args, []string{
		"/usr",
		"/bin",
		"/lib",
		"/lib64",
		"/etc/ld.so.cache",
		"/etc/ld.so.conf",
		"/etc/ld.so.conf.d",
		"/etc/nsswitch.conf",
		"/etc/passwd",
		"/etc/group",
		"/etc/ssl/certs",
		"/etc/ca-certificates",
	})
	args = append(args,
		"--proc", "/proc",
		"--dev", "/dev",
		"--tmpfs", "/tmp",
		"--setenv", "HOME", "/work",
		"--setenv", "TMPDIR", "/work",
		"--setenv", "AGENT_TEMP_DIR", "/work",
		"--setenv", "PATH", "/usr/local/bin:/usr/bin:/bin",
		"--setenv", "LANG", "C.UTF-8",
		"--setenv", "LC_ALL", "C.UTF-8",
		"--chdir", "/skill",
		"--",
		commandName,
	)
	return append(args, commandArgs...), nil
}

func appendReadOnlyBinds(args []string, paths []string) []string {
	for _, path := range paths {
		if _, err := os.Stat(path); err == nil {
			args = append(args, "--ro-bind", path, path)
		}
	}
	return args
}

func isBwrapStartupError(stderr string) bool {
	stderr = strings.TrimSpace(stderr)
	return strings.HasPrefix(stderr, "bwrap:")
}
