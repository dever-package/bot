package skill

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// TreeLimits bounds a temporary source or dependency tree before activation.
type TreeLimits struct {
	MaxFiles int
	MaxBytes int64
	MaxDepth int
}

// ValidateTreeLimits checks resource usage without following directory links.
func ValidateTreeLimits(root string, limits TreeLimits) error {
	cleanRoot := filepath.Clean(root)
	info, err := os.Lstat(cleanRoot)
	if err != nil {
		return err
	}
	if info.Mode()&os.ModeSymlink != 0 || !info.IsDir() {
		return fmt.Errorf("目录根路径必须是普通目录: %s", root)
	}
	files := 0
	var totalBytes int64
	return filepath.WalkDir(cleanRoot, func(path string, entry os.DirEntry, walkErr error) error {
		if os.IsNotExist(walkErr) {
			return nil
		}
		if walkErr != nil {
			return walkErr
		}
		relative, err := filepath.Rel(cleanRoot, path)
		if err != nil {
			return err
		}
		if limits.MaxDepth > 0 && relative != "." && len(strings.Split(filepath.ToSlash(relative), "/")) > limits.MaxDepth {
			return fmt.Errorf("目录深度超过 %d 层", limits.MaxDepth)
		}
		if entry.IsDir() {
			return nil
		}
		info, err := entry.Info()
		if os.IsNotExist(err) {
			return nil
		}
		if err != nil {
			return err
		}
		if entry.Type()&os.ModeSymlink == 0 && !info.Mode().IsRegular() {
			return fmt.Errorf("目录包含不支持的特殊文件: %s", relative)
		}
		files++
		totalBytes += info.Size()
		if limits.MaxFiles > 0 && files > limits.MaxFiles {
			return fmt.Errorf("文件数量超过 %d 个", limits.MaxFiles)
		}
		if limits.MaxBytes > 0 && totalBytes > limits.MaxBytes {
			return fmt.Errorf("目录大小超过 %d 字节", limits.MaxBytes)
		}
		return nil
	})
}
