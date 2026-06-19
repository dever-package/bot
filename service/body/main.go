package body

import (
	"context"
	"encoding/json"
	"fmt"
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

func (Service) AllowedPowerIDs(ctx context.Context, bodyID uint64) (map[uint64]bool, bool) {
	ids, restricted := Service{}.AllowedPowerOrder(ctx, bodyID)
	return idSet(ids), restricted
}

func (Service) AllowedPowerOrder(ctx context.Context, bodyID uint64) ([]uint64, bool) {
	canvasID := canvasIDForBody(ctx, bodyID)
	if canvasID == 0 {
		return nil, false
	}
	rows := bodymodel.NewCanvasPowerModel().Select(ctx, map[string]any{
		"canvas_id": canvasID,
		"status":    bodymodel.StatusEnabled,
	})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.PowerID > 0 {
			ids = append(ids, row.PowerID)
		}
	}
	if len(ids) == 0 {
		return nil, false
	}
	return ids, true
}

func (Service) AllowedAgentIDs(ctx context.Context, bodyID uint64) (map[uint64]bool, bool) {
	ids, restricted := Service{}.AllowedAgentOrder(ctx, bodyID)
	return idSet(ids), restricted
}

func (Service) AllowedAgentOrder(ctx context.Context, bodyID uint64) ([]uint64, bool) {
	canvasID := canvasIDForBody(ctx, bodyID)
	if canvasID == 0 {
		return nil, false
	}
	rows := bodymodel.NewCanvasAgentModel().Select(ctx, map[string]any{
		"canvas_id": canvasID,
		"status":    bodymodel.StatusEnabled,
	})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.AgentID > 0 {
			ids = append(ids, row.AgentID)
		}
	}
	if len(ids) == 0 {
		return nil, false
	}
	return ids, true
}

func (Service) AllowedTeamIDs(ctx context.Context, bodyID uint64) (map[uint64]bool, bool) {
	ids, restricted := Service{}.AllowedTeamOrder(ctx, bodyID)
	return idSet(ids), restricted
}

func (Service) AllowedTeamOrder(ctx context.Context, bodyID uint64) ([]uint64, bool) {
	canvasID := canvasIDForBody(ctx, bodyID)
	if canvasID == 0 {
		return nil, false
	}
	rows := bodymodel.NewCanvasTeamModel().Select(ctx, map[string]any{
		"canvas_id": canvasID,
		"status":    bodymodel.StatusEnabled,
	})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.TeamID > 0 {
			ids = append(ids, row.TeamID)
		}
	}
	if len(ids) == 0 {
		return nil, false
	}
	return ids, true
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

func canvasIDForBody(ctx context.Context, bodyID uint64) uint64 {
	if bodyID == 0 {
		return 0
	}
	body := bodymodel.NewBodyModel().Find(ctx, map[string]any{"id": bodyID})
	if body == nil || body.Type != bodymodel.TypeCanvas {
		return 0
	}
	config := map[string]uint64{}
	if err := json.Unmarshal([]byte(body.Config), &config); err != nil {
		return 0
	}
	return config["canvas_id"]
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

func idSet(ids []uint64) map[uint64]bool {
	result := make(map[uint64]bool, len(ids))
	for _, id := range ids {
		if id > 0 {
			result[id] = true
		}
	}
	return result
}
