package knowledge

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

func NormalizeDirPath(path string) string {
	parts := make([]string, 0)
	for _, part := range strings.Split(strings.ReplaceAll(path, "\\", "/"), "/") {
		name := strings.TrimSpace(part)
		if name == "" || name == "." {
			continue
		}
		parts = append(parts, name)
	}
	return strings.Join(parts, "/")
}

func ValidateDirName(name string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return fmt.Errorf("目录名称不能为空")
	}
	if strings.Contains(name, "/") || strings.Contains(name, "\\") {
		return fmt.Errorf("目录名称不能包含斜杠")
	}
	if name == "." || name == ".." {
		return fmt.Errorf("目录名称无效")
	}
	return nil
}

func EnsureDirPath(ctx context.Context, baseID uint64, path string) (uint64, string, error) {
	path = NormalizeDirPath(path)
	if baseID == 0 {
		return 0, "", fmt.Errorf("知识库不能为空")
	}
	if path == "" {
		return 0, "", nil
	}
	parentID := uint64(0)
	currentPath := ""
	for _, name := range strings.Split(path, "/") {
		if err := ValidateDirName(name); err != nil {
			return 0, "", err
		}
		if currentPath == "" {
			currentPath = name
		} else {
			currentPath += "/" + name
		}
		row := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{
			"knowledge_base_id": baseID,
			"parent_id":         parentID,
			"name":              name,
		})
		if row == nil {
			id := util.ToUint64(agentmodel.NewKnowledgeDirModel().Insert(ctx, withCreatedAt(map[string]any{
				"knowledge_base_id": baseID,
				"parent_id":         parentID,
				"name":              name,
				"path":              currentPath,
				"depth":             strings.Count(currentPath, "/") + 1,
				"doc_count":         0,
				"status":            1,
				"sort":              100,
			})))
			if id == 0 {
				return 0, "", fmt.Errorf("创建目录失败")
			}
			parentID = id
			continue
		}
		agentmodel.NewKnowledgeDirModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"path":   currentPath,
			"depth":  strings.Count(currentPath, "/") + 1,
			"status": 1,
		})
		parentID = row.ID
	}
	return parentID, path, nil
}

func KnowledgeDirPath(ctx context.Context, dirID uint64) string {
	if dirID == 0 {
		return ""
	}
	dir := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{"id": dirID})
	if dir == nil || dir.Status != 1 {
		return ""
	}
	return strings.TrimSpace(dir.Path)
}

func docCountsByDir(ctx context.Context, baseID uint64) map[uint64]int {
	counts := map[uint64]int{}
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.dir_id",
	})
	for _, row := range rows {
		if row == nil {
			continue
		}
		counts[row.DirID]++
	}
	return counts
}

func joinDirPath(parentPath string, name string) string {
	parentPath = NormalizeDirPath(parentPath)
	name = strings.TrimSpace(name)
	if parentPath == "" {
		return name
	}
	return parentPath + "/" + name
}

func descendantDirIDs(ctx context.Context, baseID uint64, rootID uint64) []uint64 {
	ids := []uint64{rootID}
	children := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"parent_id":         rootID,
		"status":            1,
	})
	for _, child := range children {
		if child == nil {
			continue
		}
		ids = append(ids, descendantDirIDs(ctx, baseID, child.ID)...)
	}
	return ids
}
