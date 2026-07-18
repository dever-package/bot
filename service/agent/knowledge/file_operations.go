package knowledge

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type knowledgePathOperation struct {
	Source string
	Target string
}

func planKnowledgeSourcePaths(root string, ids []string, action string) ([]knowledgePathOperation, error) {
	if len(ids) == 0 {
		return nil, fmt.Errorf("请选择要%s的文件", action)
	}
	plans := make([]knowledgePathOperation, 0, len(ids))
	seen := make(map[string]struct{}, len(ids))
	for _, id := range ids {
		source, _, err := knowledgeIDPath(root, id)
		if err != nil {
			return nil, err
		}
		if sameCleanPath(source, root) {
			return nil, fmt.Errorf("不能%s知识库根目录", action)
		}
		if _, err := os.Stat(source); err != nil {
			return nil, fmt.Errorf("%s来源不存在", action)
		}
		cleanSource := filepath.Clean(source)
		if _, exists := seen[cleanSource]; exists {
			continue
		}
		seen[cleanSource] = struct{}{}
		plans = append(plans, knowledgePathOperation{Source: cleanSource})
	}
	sort.SliceStable(plans, func(left int, right int) bool {
		return len(plans[left].Source) < len(plans[right].Source)
	})
	result := make([]knowledgePathOperation, 0, len(plans))
	for _, plan := range plans {
		covered := false
		for _, parent := range result {
			if isPathAncestor(parent.Source, plan.Source) {
				covered = true
				break
			}
		}
		if !covered {
			result = append(result, plan)
		}
	}
	return result, nil
}

func planKnowledgeTargetPaths(root string, targetDir string, ids []string, action string) ([]knowledgePathOperation, error) {
	plans, err := planKnowledgeSourcePaths(root, ids, action)
	if err != nil {
		return nil, err
	}
	seenTargets := make(map[string]struct{}, len(plans))
	for index := range plans {
		target := filepath.Join(targetDir, filepath.Base(plans[index].Source))
		if err := ensureInsideKnowledgeRoot(root, target); err != nil {
			return nil, err
		}
		if isPathAncestor(plans[index].Source, target) {
			return nil, fmt.Errorf("不能%s到自身或子目录下", action)
		}
		if _, exists := seenTargets[target]; exists {
			return nil, fmt.Errorf("目标文件夹下存在重名来源")
		}
		seenTargets[target] = struct{}{}
		if _, err := os.Stat(target); err == nil {
			return nil, fmt.Errorf("目标文件夹下已存在同名文件")
		} else if !os.IsNotExist(err) {
			return nil, fmt.Errorf("读取目标路径失败: %w", err)
		}
		plans[index].Target = target
	}
	return plans, nil
}

func moveKnowledgePaths(plans []knowledgePathOperation) ([]knowledgePathOperation, error) {
	completed := make([]knowledgePathOperation, 0, len(plans))
	for _, plan := range plans {
		if err := os.Rename(plan.Source, plan.Target); err != nil {
			return completed, fmt.Errorf("移动失败: %w", err)
		}
		completed = append(completed, plan)
	}
	return completed, nil
}

func rollbackMovedKnowledgePaths(plans []knowledgePathOperation) {
	for index := len(plans) - 1; index >= 0; index-- {
		_ = os.MkdirAll(filepath.Dir(plans[index].Source), 0o755)
		_ = os.Rename(plans[index].Target, plans[index].Source)
	}
}

func copyKnowledgePaths(plans []knowledgePathOperation) ([]knowledgePathOperation, error) {
	completed := make([]knowledgePathOperation, 0, len(plans))
	for _, plan := range plans {
		if err := copyKnowledgePath(plan.Source, plan.Target); err != nil {
			_ = os.RemoveAll(plan.Target)
			return completed, err
		}
		completed = append(completed, plan)
	}
	return completed, nil
}

func removeKnowledgeTargets(plans []knowledgePathOperation) {
	for index := len(plans) - 1; index >= 0; index-- {
		_ = os.RemoveAll(plans[index].Target)
	}
}

func knowledgeTargetIDs(root string, plans []knowledgePathOperation) []string {
	ids := make([]string, 0, len(plans))
	for _, plan := range plans {
		ids = append(ids, idFromFilePath(root, plan.Target))
	}
	return ids
}

func rollbackKnowledgeRename(ctx context.Context, base *agentmodel.KnowledgeBase, root string, oldPath string, newPath string, isDir bool) {
	if base == nil {
		return
	}
	if err := os.Rename(newPath, oldPath); err != nil {
		return
	}
	_ = migrateRenamedKnowledgeRecords(ctx, base.ID, root, newPath, oldPath, isDir)
	_ = syncKnowledgeFilesystem(ctx, base, root)
}
