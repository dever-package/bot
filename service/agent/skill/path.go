package skill

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"
)

const (
	MaxRelativePathRunes = 512
	MaxRelativePathDepth = 64
)

// NormalizeRelativePath is the shared contract for paths persisted by a skill
// manifest or draft. Runtime filesystem checks still resolve symlinks against
// the concrete root before reading or writing.
func NormalizeRelativePath(path string) (string, error) {
	raw := strings.TrimSpace(path)
	if raw == "" || filepath.IsAbs(raw) || strings.ContainsRune(raw, '\x00') || strings.Contains(raw, "\\") {
		return "", fmt.Errorf("路径必须是安全的相对路径")
	}
	if utf8.RuneCountInString(raw) > MaxRelativePathRunes {
		return "", fmt.Errorf("路径不能超过 %d 个字符", MaxRelativePathRunes)
	}
	normalized := filepath.ToSlash(filepath.Clean(raw))
	if normalized == "." || normalized == ".." || strings.HasPrefix(normalized, "../") || strings.HasPrefix(normalized, "/") {
		return "", fmt.Errorf("路径必须是安全的相对路径")
	}
	if len(strings.Split(normalized, "/")) > MaxRelativePathDepth {
		return "", fmt.Errorf("路径层级不能超过 %d 层", MaxRelativePathDepth)
	}
	return normalized, nil
}

// EnsureRoot creates the managed skill root and rejects a pre-existing link or
// non-directory before any lock or release path is created below it.
func EnsureRoot() error {
	root := filepath.Clean(Root)
	if err := os.MkdirAll(root, 0o755); err != nil {
		return err
	}
	info, err := os.Lstat(root)
	if err != nil {
		return err
	}
	if info.Mode()&os.ModeSymlink != 0 || !info.IsDir() {
		return fmt.Errorf("技能根目录必须是普通目录: %s", Root)
	}
	return nil
}

func IsSafePath(path string) bool {
	root, err := filepath.Abs(filepath.Clean(Root))
	if err != nil {
		return false
	}
	target, err := filepath.Abs(filepath.Clean(path))
	if err != nil {
		return false
	}
	return pathWithin(root, target)
}

// ValidateInstallRoot verifies that an existing skill directory is physically
// contained by Root, including all resolved parent symlinks.
func ValidateInstallRoot(path string) error {
	if err := validateInstallPath(path); err != nil {
		return err
	}
	info, err := os.Lstat(filepath.Clean(path))
	if err != nil {
		return err
	}
	if info.Mode()&os.ModeSymlink != 0 || !info.IsDir() {
		return fmt.Errorf("技能安装目录必须是普通目录: %s", path)
	}
	return nil
}

// ValidateInstallTarget applies the same containment check to a target that
// may not exist yet.
func ValidateInstallTarget(path string) error {
	return validateInstallPath(path)
}

func validateInstallPath(path string) error {
	root, err := filepath.Abs(filepath.Clean(Root))
	if err != nil {
		return err
	}
	rootInfo, err := os.Lstat(root)
	if err != nil {
		return err
	}
	if rootInfo.Mode()&os.ModeSymlink != 0 || !rootInfo.IsDir() {
		return fmt.Errorf("技能根目录必须是普通目录: %s", Root)
	}
	target, err := filepath.Abs(filepath.Clean(strings.TrimSpace(path)))
	if err != nil {
		return err
	}
	if !pathWithin(root, target) {
		return fmt.Errorf("路径超出技能根目录: %s", path)
	}
	resolvedRoot, err := filepath.EvalSymlinks(root)
	if err != nil {
		return err
	}
	resolvedAncestor, err := resolveNearestExistingPath(root, target)
	if err != nil {
		return err
	}
	if !pathWithin(resolvedRoot, resolvedAncestor) {
		return fmt.Errorf("路径通过符号链接超出技能根目录: %s", path)
	}
	if info, statErr := os.Lstat(target); statErr == nil && info.Mode()&os.ModeSymlink != 0 {
		return fmt.Errorf("技能路径不能是符号链接: %s", path)
	} else if statErr != nil && !os.IsNotExist(statErr) {
		return statErr
	}
	return nil
}

// ResolveRelativePath validates both lexical and symlink-resolved containment.
// Missing target components are allowed so the same contract can protect writes.
func ResolveRelativePath(root string, requested string) (string, string, error) {
	root = strings.TrimSpace(root)
	if root == "" {
		return "", "", fmt.Errorf("运行目录未初始化")
	}
	requested = strings.TrimSpace(requested)
	if requested == "" {
		requested = "."
	}
	if filepath.IsAbs(requested) {
		return "", "", fmt.Errorf("不允许使用绝对路径")
	}

	cleanRoot, err := filepath.Abs(filepath.Clean(root))
	if err != nil {
		return "", "", err
	}
	cleanTarget, err := filepath.Abs(filepath.Join(cleanRoot, filepath.Clean(requested)))
	if err != nil {
		return "", "", err
	}
	if !pathWithin(cleanRoot, cleanTarget) {
		return "", "", fmt.Errorf("路径超出允许目录")
	}
	resolvedRoot, err := filepath.EvalSymlinks(cleanRoot)
	if err != nil {
		return "", "", err
	}
	resolvedAncestor, err := resolveNearestExistingPath(cleanRoot, cleanTarget)
	if err != nil {
		return "", "", err
	}
	if !pathWithin(resolvedRoot, resolvedAncestor) {
		return "", "", fmt.Errorf("路径通过符号链接超出允许目录")
	}
	relative, err := filepath.Rel(cleanRoot, cleanTarget)
	if err != nil {
		return "", "", err
	}
	return cleanTarget, filepath.ToSlash(relative), nil
}

// ValidateTree rejects relocatable skill trees whose links or special files
// could escape the directory after installation.
func ValidateTree(root string) error {
	cleanRoot, err := filepath.Abs(filepath.Clean(root))
	if err != nil {
		return err
	}
	rootInfo, err := os.Lstat(cleanRoot)
	if err != nil {
		return err
	}
	if rootInfo.Mode()&os.ModeSymlink != 0 || !rootInfo.IsDir() {
		return fmt.Errorf("技能根路径必须是普通目录: %s", root)
	}
	resolvedRoot, err := filepath.EvalSymlinks(cleanRoot)
	if err != nil {
		return err
	}
	return filepath.WalkDir(cleanRoot, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		if info.Mode()&(os.ModeSetuid|os.ModeSetgid|os.ModeSticky) != 0 {
			return fmt.Errorf("技能目录包含特殊权限位: %s", path)
		}
		if path == cleanRoot || entry.IsDir() {
			return nil
		}
		if entry.Type()&os.ModeSymlink != 0 {
			target, err := os.Readlink(path)
			if err != nil {
				return err
			}
			if filepath.IsAbs(target) {
				return fmt.Errorf("技能目录包含绝对符号链接: %s", path)
			}
			resolved, err := filepath.EvalSymlinks(path)
			if err != nil {
				return fmt.Errorf("技能目录包含无效符号链接 %s: %w", path, err)
			}
			if !pathWithin(resolvedRoot, resolved) {
				return fmt.Errorf("技能目录符号链接越界: %s", path)
			}
			return nil
		}
		if !info.Mode().IsRegular() {
			return fmt.Errorf("技能目录包含不支持的特殊文件: %s", path)
		}
		return nil
	})
}

func resolveNearestExistingPath(root string, target string) (string, error) {
	current := target
	for {
		if _, err := os.Lstat(current); err == nil {
			return filepath.EvalSymlinks(current)
		} else if !os.IsNotExist(err) {
			return "", err
		}
		if current == root {
			return filepath.EvalSymlinks(root)
		}
		parent := filepath.Dir(current)
		if parent == current || !pathWithin(root, parent) {
			return "", fmt.Errorf("路径超出允许目录")
		}
		current = parent
	}
}

func pathWithin(root string, target string) bool {
	relative, err := filepath.Rel(filepath.Clean(root), filepath.Clean(target))
	if err != nil {
		return false
	}
	return relative != ".." && !strings.HasPrefix(relative, ".."+string(filepath.Separator))
}
