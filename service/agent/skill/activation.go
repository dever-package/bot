package skill

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	activeStatus   = int16(1)
	inactiveStatus = int16(2)
)

type directoryReplacement struct {
	target    string
	backup    string
	committed bool
}

type DirectoryActivation struct {
	Key    string
	Source string
	Target string
}

func ActivateDirectory(ctx context.Context, key string, source string, target string, save func(context.Context) error) (err error) {
	return ActivateDirectories(ctx, []DirectoryActivation{{Key: key, Source: source, Target: target}}, save)
}

func ActivateDirectories(ctx context.Context, activations []DirectoryActivation, save func(context.Context) error) (err error) {
	if save == nil {
		return fmt.Errorf("技能激活缺少保存逻辑")
	}
	if len(activations) == 0 {
		return fmt.Errorf("技能激活目录不能为空")
	}
	sorted := append([]DirectoryActivation(nil), activations...)
	sort.Slice(sorted, func(i, j int) bool {
		return NormalizeKey(sorted[i].Key) < NormalizeKey(sorted[j].Key)
	})
	lastKey := ""
	for _, activation := range sorted {
		key := NormalizeKey(activation.Key)
		if key == "" {
			return fmt.Errorf("技能激活缺少有效标识")
		}
		if key == lastKey {
			return fmt.Errorf("技能激活包含重复标识: %s", key)
		}
		lastKey = key
		release, lockErr := Lock(ctx, key)
		if lockErr != nil {
			return lockErr
		}
		defer release()
	}
	for _, activation := range activations {
		if validateErr := ValidateTree(activation.Source); validateErr != nil {
			return fmt.Errorf("技能目录检查失败 %s: %w", activation.Key, validateErr)
		}
	}
	replacements := make([]*directoryReplacement, 0, len(activations))
	defer func() {
		if recovered := recover(); recovered != nil {
			if recoveredErr, ok := recovered.(error); ok {
				err = recoveredErr
			} else {
				err = fmt.Errorf("%v", recovered)
			}
		}
		if err != nil {
			if rollbackErr := rollbackDirectories(replacements); rollbackErr != nil {
				err = fmt.Errorf("%w；目录回滚失败: %v", err, rollbackErr)
			}
			return
		}
		for _, replacement := range replacements {
			replacement.commit()
		}
	}()
	for _, activation := range activations {
		replacement, replaceErr := replaceDirectory(activation.Source, activation.Target)
		if replaceErr != nil {
			return replaceErr
		}
		replacements = append(replacements, replacement)
	}
	err = orm.Transaction(ctx, save)
	return err
}

func rollbackDirectories(replacements []*directoryReplacement) error {
	errorsList := make([]error, 0)
	for index := len(replacements) - 1; index >= 0; index-- {
		if err := replacements[index].rollback(); err != nil {
			errorsList = append(errorsList, err)
		}
	}
	return errors.Join(errorsList...)
}

func EnsurePackItem(ctx context.Context, packID uint64, skillID uint64) {
	if packID == 0 || skillID == 0 {
		return
	}
	model := agentmodel.NewSkillPackItemModel()
	existing := model.Find(ctx, map[string]any{"pack_id": packID, "skill_id": skillID})
	if existing != nil {
		if existing.Status != activeStatus {
			model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{"status": activeStatus})
		}
		return
	}
	model.Insert(ctx, map[string]any{
		"pack_id": packID, "skill_id": skillID, "status": activeStatus,
		"sort": nextPackItemSort(ctx, packID), "created_at": time.Now(),
	})
}

func RemoveObsoletePath(oldPath string, currentPath string) {
	oldPath = filepath.Clean(strings.TrimSpace(oldPath))
	currentPath = filepath.Clean(strings.TrimSpace(currentPath))
	root := filepath.Clean(Root)
	if oldPath == "" || oldPath == "." || oldPath == currentPath || oldPath == root || !IsSafePath(oldPath) {
		return
	}
	oldAbsolute, oldErr := filepath.Abs(oldPath)
	currentAbsolute, currentErr := filepath.Abs(currentPath)
	if oldErr == nil && currentErr == nil && pathWithin(oldAbsolute, currentAbsolute) {
		return
	}
	_ = os.RemoveAll(oldPath)
}

func replaceDirectory(source string, target string) (*directoryReplacement, error) {
	if !IsSafePath(target) {
		return nil, fmt.Errorf("技能安装目录不安全: %s", target)
	}
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return nil, err
	}
	replacement := &directoryReplacement{target: target}
	if _, err := os.Stat(target); err == nil {
		replacement.backup = target + ".bak-" + strings.ReplaceAll(time.Now().Format("20060102150405.000000000"), ".", "")
		if err := os.Rename(target, replacement.backup); err != nil {
			return nil, err
		}
	} else if !os.IsNotExist(err) {
		return nil, err
	}
	if err := moveDirectory(source, target); err != nil {
		_ = os.RemoveAll(target)
		if replacement.backup != "" {
			if restoreErr := os.Rename(replacement.backup, target); restoreErr != nil {
				return nil, fmt.Errorf("%w；恢复旧技能目录失败: %v", err, restoreErr)
			}
		}
		return nil, err
	}
	return replacement, nil
}

func (replacement *directoryReplacement) commit() {
	if replacement == nil || replacement.committed {
		return
	}
	replacement.committed = true
	if replacement.backup != "" {
		_ = os.RemoveAll(replacement.backup)
	}
}

func (replacement *directoryReplacement) rollback() error {
	if replacement == nil || replacement.committed {
		return nil
	}
	replacement.committed = true
	if err := os.RemoveAll(replacement.target); err != nil {
		return fmt.Errorf("清理新技能目录失败: %w", err)
	}
	if replacement.backup == "" {
		return nil
	}
	if err := os.Rename(replacement.backup, replacement.target); err != nil {
		return fmt.Errorf("恢复旧技能目录失败: %w", err)
	}
	return nil
}

func moveDirectory(source string, target string) error {
	if err := os.Rename(source, target); err == nil {
		return nil
	}
	if err := copyDirectory(source, target); err != nil {
		_ = os.RemoveAll(target)
		return err
	}
	return os.RemoveAll(source)
}

func copyDirectory(source string, target string) error {
	return filepath.WalkDir(source, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		relative, err := filepath.Rel(source, path)
		if err != nil {
			return err
		}
		targetPath := filepath.Join(target, relative)
		if entry.IsDir() {
			info, err := entry.Info()
			if err != nil {
				return err
			}
			return os.MkdirAll(targetPath, info.Mode())
		}
		if entry.Type()&os.ModeSymlink != 0 {
			link, err := os.Readlink(path)
			if err != nil {
				return err
			}
			if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
				return err
			}
			return os.Symlink(link, targetPath)
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		return copyFile(path, targetPath, info.Mode())
	})
}

func copyFile(source string, target string, mode os.FileMode) error {
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return err
	}
	input, err := os.Open(source)
	if err != nil {
		return err
	}
	defer input.Close()
	output, err := os.OpenFile(target, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, mode)
	if err != nil {
		return err
	}
	defer output.Close()
	_, err = io.Copy(output, input)
	return err
}

func nextPackItemSort(ctx context.Context, packID uint64) int {
	rows := agentmodel.NewSkillPackItemModel().Select(ctx, map[string]any{"pack_id": packID})
	maxSort := 0
	for _, row := range rows {
		if row != nil && row.Sort > maxSort {
			maxSort = row.Sort
		}
	}
	if maxSort <= 0 {
		return 100
	}
	return maxSort + 10
}
