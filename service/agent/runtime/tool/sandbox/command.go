package sandbox

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func scriptCommand(path string, args []string) (string, []string, error) {
	return scriptCommandForPath(path, path, args)
}

func scriptCommandForPath(runPath string, checkPath string, args []string) (string, []string, error) {
	ext := strings.ToLower(filepath.Ext(runPath))
	switch ext {
	case ".sh":
		return "/bin/sh", append([]string{runPath}, args...), nil
	case ".bash":
		return "/bin/bash", append([]string{runPath}, args...), nil
	case ".js":
		return "node", append([]string{runPath}, args...), nil
	case ".py":
		return "python3", append([]string{runPath}, args...), nil
	default:
		return executableScriptCommand(runPath, checkPath, args)
	}
}

func executableScriptCommand(runPath string, checkPath string, args []string) (string, []string, error) {
	info, err := os.Stat(checkPath)
	if err != nil {
		return "", nil, err
	}
	if info.Mode()&0o111 == 0 {
		return "", nil, fmt.Errorf("不支持的脚本类型: %s", strings.ToLower(filepath.Ext(runPath)))
	}
	return runPath, args, nil
}

func scriptEnv(tempRoot string, skillRoot string, extraEnv []string) []string {
	env := []string{
		"PATH=/usr/local/bin:/usr/bin:/bin",
		"LANG=C.UTF-8",
		"LC_ALL=C.UTF-8",
	}
	if tempRoot != "" {
		env = append(env, "HOME="+tempRoot, "TMPDIR="+tempRoot, "AGENT_TEMP_DIR="+tempRoot)
	}
	if skillRoot != "" {
		env = append(env,
			"PYTHONPATH="+filepath.Join(skillRoot, ".dever", "deps", "python"),
			"NODE_PATH="+filepath.Join(skillRoot, ".dever", "deps", "node", "node_modules"),
		)
	}
	env = append(env, extraEnv...)
	return env
}
