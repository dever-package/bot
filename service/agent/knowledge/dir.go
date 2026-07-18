package knowledge

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
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

func knowledgeDirPaths(ctx context.Context, baseID uint64, dirIDs []uint64) map[uint64]string {
	dirIDs = uniqueUint64s(dirIDs, 0)
	result := make(map[uint64]string, len(dirIDs))
	if len(dirIDs) == 0 {
		return result
	}
	filters := map[string]any{
		"id":     dirIDs,
		"status": 1,
	}
	if baseID > 0 {
		filters["knowledge_base_id"] = baseID
	}
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, filters, map[string]any{
		"field":    "main.id, main.path",
		"page":     1,
		"pageSize": len(dirIDs),
	})
	for _, row := range rows {
		if row != nil {
			result[row.ID] = strings.TrimSpace(row.Path)
		}
	}
	return result
}

func knowledgeNodeDirIDs(rows []*agentmodel.KnowledgeNode) []uint64 {
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.DirID > 0 {
			ids = append(ids, row.DirID)
		}
	}
	return ids
}

func knowledgeNodeIDs(rows []*agentmodel.KnowledgeNode) []uint64 {
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			ids = append(ids, row.ID)
		}
	}
	return ids
}

func joinDirPath(parentPath string, name string) string {
	parentPath = NormalizeDirPath(parentPath)
	name = strings.TrimSpace(name)
	if parentPath == "" {
		return name
	}
	return parentPath + "/" + name
}

func ancestorDirIDs(ctx context.Context, baseID uint64, dirID uint64) []uint64 {
	ids := make([]uint64, 0)
	seen := map[uint64]struct{}{}
	for dirID > 0 {
		if _, exists := seen[dirID]; exists {
			break
		}
		seen[dirID] = struct{}{}
		dir := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{
			"id":                dirID,
			"knowledge_base_id": baseID,
			"status":            1,
		})
		if dir == nil {
			break
		}
		ids = append(ids, dir.ID)
		dirID = dir.ParentID
	}
	return ids
}
