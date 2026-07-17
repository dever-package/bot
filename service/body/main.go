package body

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	bodymodel "github.com/dever-package/bot/model/body"
)

type Service struct{}

func NewService() Service {
	return Service{}
}

func (Service) CreateCanvasBody(ctx context.Context, projectID uint64, name string) (uint64, error) {
	if projectID == 0 {
		return 0, fmt.Errorf("项目不能为空")
	}
	bodyID := uint64(bodymodel.NewBodyModel().Insert(ctx, map[string]any{
		"project_id": projectID,
		"name":       name,
		"type":       bodymodel.TypeCanvas,
		"config":     canvasConfigText(ctx),
		"status":     bodymodel.StatusEnabled,
		"sort":       100,
		"created_at": time.Now(),
	}))
	if bodyID == 0 {
		return 0, fmt.Errorf("创建项目载体失败")
	}
	bodymodel.NewSessionModel().Insert(ctx, map[string]any{
		"body_id":    bodyID,
		"project_id": projectID,
		"request_id": uuid.NewString(),
		"state":      "{}",
		"status":     bodymodel.SessionStatusActive,
		"created_at": time.Now(),
	})
	return bodyID, nil
}

func (Service) CreateTeamWorkspaceBody(ctx context.Context, name string) (uint64, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		name = "团队工作区"
	}
	bodyID := uint64(bodymodel.NewBodyModel().Insert(ctx, map[string]any{
		"project_id": 0,
		"name":       name,
		"type":       bodymodel.TypeWorkspace,
		"config":     "{}",
		"status":     bodymodel.StatusEnabled,
		"sort":       100,
		"created_at": time.Now(),
	}))
	if bodyID == 0 {
		return 0, fmt.Errorf("创建团队工作区载体失败")
	}
	return bodyID, nil
}

func DefaultCanvasID(ctx context.Context) uint64 {
	row := bodymodel.NewCanvasModel().Find(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	})
	if row == nil {
		return 0
	}
	return row.ID
}

func canvasConfigText(ctx context.Context) string {
	canvasID := DefaultCanvasID(ctx)
	if canvasID == 0 {
		return "{}"
	}
	content, err := json.Marshal(map[string]uint64{"canvas_id": canvasID})
	if err != nil {
		return "{}"
	}
	return string(content)
}
