package sandbox

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// ScriptCommandForPath resolves a script command while checking permissions on
// the host path. runPath may point to the same file inside a sandbox.
func ScriptCommandForPath(runPath string, checkPath string, args []string) (string, []string, error) {
	ext := strings.ToLower(filepath.Ext(runPath))
	switch ext {
	case ".sh":
		return "/bin/bash", append([]string{runPath}, args...), nil
	case ".bash":
		return "/bin/bash", append([]string{runPath}, args...), nil
	case ".js", ".mjs":
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
