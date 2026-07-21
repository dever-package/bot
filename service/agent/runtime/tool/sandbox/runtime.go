package sandbox

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

var hostRuntimeCommands = []string{"node", "npm", "npx", "pnpm", "yarn", "bun", "bunx"}

type hostRuntime struct {
	paths []string
	roots []string
}

// CommandPath returns only command directories that are also mounted by the
// bwrap sandbox. It keeps host-specific toolchains usable without exposing the
// rest of the user's home directory.
func CommandPath() string {
	runtime := discoverHostRuntime()
	return strings.Join(runtime.paths, string(filepath.ListSeparator))
}

func discoverHostRuntime() hostRuntime {
	paths := make([]string, 0, 6)
	roots := make([]string, 0, 2)
	seenPaths := map[string]struct{}{}
	seenRoots := map[string]struct{}{}

	nodeRoot, nodeBin := nodeRuntimeMount()
	if nodeRoot != "" {
		appendUniquePath(&roots, seenRoots, nodeRoot)
		appendUniquePath(&paths, seenPaths, nodeBin)
	}

	for _, name := range hostRuntimeCommands {
		commandPath, err := exec.LookPath(name)
		if err != nil {
			continue
		}
		commandPath, err = filepath.Abs(commandPath)
		if err != nil {
			continue
		}
		resolvedPath, err := filepath.EvalSymlinks(commandPath)
		if err != nil {
			resolvedPath = commandPath
		}
		if pathInside(commandPath, nodeRoot) && pathInside(resolvedPath, nodeRoot) {
			continue
		}
		if isSystemRuntimePath(commandPath) && isSystemRuntimePath(resolvedPath) {
			continue
		}
		if !isSystemRuntimePath(commandPath) && !pathInside(commandPath, nodeRoot) {
			appendUniquePath(&roots, seenRoots, filepath.Dir(commandPath))
		}
		if !isSystemRuntimePath(resolvedPath) && !pathInside(resolvedPath, nodeRoot) {
			appendUniquePath(&roots, seenRoots, packageRuntimeRoot(resolvedPath))
		}
		appendUniquePath(&paths, seenPaths, filepath.Dir(commandPath))
	}
	for _, path := range []string{"/usr/local/bin", "/usr/bin", "/bin"} {
		appendUniquePath(&paths, seenPaths, path)
	}
	return hostRuntime{paths: paths, roots: roots}
}

func nodeRuntimeMount() (string, string) {
	path, err := exec.LookPath("node")
	if err != nil {
		return "", ""
	}
	path, err = filepath.EvalSymlinks(path)
	if err != nil {
		return "", ""
	}
	dir := filepath.Dir(path)
	if isSystemRuntimePath(path) {
		return "", ""
	}
	root := dir
	if filepath.Base(dir) == "bin" {
		candidate := filepath.Dir(dir)
		if info, statErr := os.Stat(filepath.Join(candidate, "lib", "node_modules")); statErr == nil && info.IsDir() {
			root = candidate
		}
	}
	return root, dir
}

func packageRuntimeRoot(path string) string {
	dir := filepath.Dir(path)
	for current, depth := dir, 0; current != "." && current != string(filepath.Separator) && depth < 6; depth++ {
		if info, err := os.Stat(filepath.Join(current, "package.json")); err == nil && info.Mode().IsRegular() {
			return current
		}
		parent := filepath.Dir(current)
		if parent == current {
			break
		}
		current = parent
	}
	return dir
}

func isSystemRuntimePath(path string) bool {
	for _, root := range []string{"/usr", "/bin", "/lib", "/lib64"} {
		if pathInside(path, root) {
			return true
		}
	}
	return false
}

func pathInside(path string, root string) bool {
	path = filepath.Clean(strings.TrimSpace(path))
	root = filepath.Clean(strings.TrimSpace(root))
	if path == "." || root == "." || root == "" {
		return false
	}
	relative, err := filepath.Rel(root, path)
	return err == nil && relative != ".." && !strings.HasPrefix(relative, ".."+string(filepath.Separator))
}

func appendUniquePath(paths *[]string, seen map[string]struct{}, path string) {
	path = filepath.Clean(strings.TrimSpace(path))
	if path == "." || path == "" {
		return
	}
	if _, exists := seen[path]; exists {
		return
	}
	seen[path] = struct{}{}
	*paths = append(*paths, path)
}
