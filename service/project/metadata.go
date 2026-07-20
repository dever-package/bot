package project

import (
	"context"
	"fmt"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/shemic/dever/orm"

	projectmodel "github.com/dever-package/bot/model/project"
)

const (
	defaultProjectDescription = "记录灵感、素材与创作成果。"
	maxProjectNameRunes       = 128
)

type UpdateRequest struct {
	Name        string
	Description string
}

func (s Service) Trash(ctx context.Context, teamID uint64) (map[string]any, error) {
	return s.listByStatus(ctx, teamID, projectmodel.StatusDeleted, "main.deleted_at desc,main.id desc")
}

func (s Service) Update(ctx context.Context, projectID uint64, req UpdateRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	name, err := normalizeProjectName(req.Name)
	if err != nil {
		return nil, err
	}
	description := normalizeProjectDescription(req.Description)
	now := time.Now()
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		affected := projectmodel.NewProjectModel().Update(tx, map[string]any{
			"id":      project.ID,
			"user_id": project.UserID,
			"status":  projectmodel.StatusEnabled,
		}, map[string]any{
			"name":        name,
			"description": description,
			"updated_at":  now,
		})
		if affected == 0 {
			return fmt.Errorf("作品不存在")
		}
		if project.BodyID > 0 && project.Name != name {
			return s.body.RenameCanvasBody(tx, project.BodyID, project.ID, name)
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return s.projectResult(ctx, project.ID)
}

func (s Service) Delete(ctx context.Context, projectID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	deletedAt := time.Now()
	affected := projectmodel.NewProjectModel().Update(ctx, map[string]any{
		"id":      project.ID,
		"user_id": project.UserID,
		"status":  projectmodel.StatusEnabled,
	}, map[string]any{
		"status":     projectmodel.StatusDeleted,
		"deleted_at": deletedAt,
	})
	if affected == 0 {
		return nil, fmt.Errorf("作品不存在")
	}
	return map[string]any{"id": project.ID, "deleted_at": deletedAt}, nil
}

func (s Service) Restore(ctx context.Context, projectID uint64) (map[string]any, error) {
	project, err := requireDeletedProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	affected := projectmodel.NewProjectModel().Update(ctx, map[string]any{
		"id":      project.ID,
		"user_id": project.UserID,
		"status":  projectmodel.StatusDeleted,
	}, map[string]any{
		"status":     projectmodel.StatusEnabled,
		"deleted_at": nil,
	})
	if affected == 0 {
		return nil, fmt.Errorf("作品不存在")
	}
	return s.projectResult(ctx, project.ID)
}

func (s Service) listByStatus(ctx context.Context, teamID uint64, status int16, order string) (map[string]any, error) {
	userID, err := currentUserID(ctx)
	if err != nil {
		return nil, err
	}
	if teamID == 0 {
		return nil, fmt.Errorf("团队不能为空")
	}
	rows := projectmodel.NewProjectModel().Select(ctx, map[string]any{
		"user_id": userID,
		"team_id": teamID,
		"status":  status,
	}, map[string]any{"order": order})
	builder := newPayloadBuilder(ctx)
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			items = append(items, builder.Project(*row))
		}
	}
	return map[string]any{"items": items}, nil
}

func (s Service) projectResult(ctx context.Context, projectID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return map[string]any{"project": newPayloadBuilder(ctx).Project(*project)}, nil
}

func normalizeProjectName(value string) (string, error) {
	name := strings.TrimSpace(value)
	if name == "" {
		return "", fmt.Errorf("作品标题不能为空")
	}
	if utf8.RuneCountInString(name) > maxProjectNameRunes {
		return "", fmt.Errorf("作品标题不能超过 %d 个字符", maxProjectNameRunes)
	}
	return name, nil
}

func normalizeProjectDescription(value string) string {
	description := strings.TrimSpace(value)
	if description == "" {
		return defaultProjectDescription
	}
	return description
}
