package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	projectmodel "github.com/dever-package/bot/model/project"
	assetservice "github.com/dever-package/bot/service/asset"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
	"github.com/shemic/dever/orm"
)

type WorkspaceService struct {
	project Service
	streams frontstream.Service
}

func NewWorkspaceService() WorkspaceService {
	return WorkspaceService{project: NewService(), streams: teamservice.StreamStore()}
}

func (s WorkspaceService) Bootstrap(ctx context.Context, projectID uint64, assetCateID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.project.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	payload, err := s.project.team.WorkspaceCanvasBootstrap(ctx, project.TeamID, project.ReleaseID)
	if err != nil {
		return nil, err
	}
	assetCates, _ := payload["asset_cates"].([]teamservice.GraphAssetCate)
	assetCateID = workspaceBootstrapAssetCateID(assetCates, assetCateID)
	bundle := s.canvasBundle(ctx, project.ID, assetCateID)
	payload["project"] = newPayloadBuilder(ctx).Project(*project)
	payload["assets"] = bundle["assets"]
	payload["canvas"] = map[string]any{canvasKey(assetCateID): bundle["canvas"]}
	payload["active_asset_cate_id"] = assetCateID
	return payload, nil
}

func (s WorkspaceService) Canvas(ctx context.Context, projectID uint64, assetCateID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return s.canvasBundle(ctx, project.ID, assetCateID), nil
}

func (s WorkspaceService) SaveCanvas(ctx context.Context, projectID uint64, assetCateID uint64, canvas map[string]any) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	clean, err := sanitizeCanvasPayload(assetCateID, canvas)
	if err != nil {
		return nil, err
	}
	savedAt := time.Now()
	record := map[string]any{
		"next_node_no": clean.NextNodeNo,
		"nodes":        jsonText(clean.Nodes, "[]"),
		"edges":        jsonText(clean.Edges, "[]"),
		"viewport":     jsonText(clean.Viewport, "{}"),
		"updated_at":   savedAt,
	}
	nextMaterialSlots := canvasMaterialSlots(clean.Nodes)
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		model := projectmodel.NewCanvasModel()
		row := model.Find(tx, map[string]any{
			"project_id":    project.ID,
			"asset_cate_id": clean.AssetCateID,
		})
		syncMaterialSlots := row == nil
		if row != nil {
			previousNodes := sliceValue(jsonValue(row.Nodes, []any{}))
			syncMaterialSlots = !sameCanvasMaterialSlots(
				canvasMaterialSlots(previousNodes),
				nextMaterialSlots,
			)
		}
		if row == nil {
			record["project_id"] = project.ID
			record["asset_cate_id"] = clean.AssetCateID
			record["created_at"] = time.Now()
			if model.Insert(tx, record) == 0 {
				return fmt.Errorf("保存画布失败")
			}
		} else if model.Update(tx, map[string]any{"id": row.ID}, record) == 0 {
			return fmt.Errorf("保存画布失败")
		}
		if syncMaterialSlots {
			s.project.asset.SyncCanvasMaterialSlots(tx, project.ID, clean.AssetCateID, nextMaterialSlots)
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return map[string]any{
		"asset_cate_id": clean.AssetCateID,
		"updated_at":    savedAt,
	}, nil
}

func canvasMaterialSlots(nodes []any) []assetservice.CanvasMaterialSlot {
	result := make([]assetservice.CanvasMaterialSlot, 0, len(nodes))
	for _, raw := range nodes {
		node, _ := raw.(map[string]any)
		nodeType := strings.TrimSpace(fmt.Sprint(node["type"]))
		if nodeType != "power" && nodeType != "agent" && nodeType != "flow" {
			continue
		}
		nodeKey := strings.TrimSpace(fmt.Sprint(node["id"]))
		if nodeKey == "" {
			continue
		}
		name := strings.TrimSpace(fmt.Sprint(node["title"]))
		if name == "" {
			name = nodeType
		}
		result = append(result, assetservice.CanvasMaterialSlot{NodeKey: nodeKey, Name: name})
	}
	return result
}

func sameCanvasMaterialSlots(left []assetservice.CanvasMaterialSlot, right []assetservice.CanvasMaterialSlot) bool {
	if len(left) != len(right) {
		return false
	}
	leftByNodeKey := make(map[string]string, len(left))
	for _, slot := range left {
		leftByNodeKey[slot.NodeKey] = slot.Name
	}
	for _, slot := range right {
		if leftByNodeKey[slot.NodeKey] != slot.Name {
			return false
		}
	}
	return true
}

func (s WorkspaceService) projectCanvas(ctx context.Context, projectID uint64, assetCateID uint64) map[string]any {
	row := projectmodel.NewCanvasModel().Find(ctx, map[string]any{
		"project_id":    projectID,
		"asset_cate_id": assetCateID,
	})
	if row == nil {
		return map[string]any{
			"asset_cate_id": assetCateID,
			"next_node_no":  1,
			"nodes":         []any{},
			"edges":         []any{},
			"viewport":      map[string]any{},
		}
	}
	return canvasPayload(*row)
}

func (s WorkspaceService) canvasBundle(ctx context.Context, projectID uint64, assetCateID uint64) map[string]any {
	canvas := s.projectCanvas(ctx, projectID, assetCateID)
	nodes := sliceValue(canvas["nodes"])
	slots := canvasMaterialSlots(nodes)
	nodeKeys := make([]string, 0, len(slots))
	for _, slot := range slots {
		nodeKeys = append(nodeKeys, slot.NodeKey)
	}
	assets := s.project.asset.CanvasReferences(
		ctx,
		projectID,
		assetCateID,
		canvasReferencedAssetIDs(nodes),
		nodeKeys,
	)
	return map[string]any{
		"canvas": canvas,
		"assets": map[string]any{"items": assets},
	}
}

func workspaceBootstrapAssetCateID(assetCates []teamservice.GraphAssetCate, requested uint64) uint64 {
	if len(assetCates) == 0 {
		return 0
	}
	for _, assetCate := range assetCates {
		if requested > 0 && assetCate.ID == requested {
			return requested
		}
	}
	return assetCates[0].ID
}

func canvasReferencedAssetIDs(nodes []any) []uint64 {
	seen := map[uint64]struct{}{}
	for _, node := range nodes {
		collectCanvasReferencedAssetIDs(node, seen)
	}
	result := make([]uint64, 0, len(seen))
	for assetID := range seen {
		result = append(result, assetID)
	}
	return result
}

func collectCanvasReferencedAssetIDs(raw any, result map[uint64]struct{}) {
	switch value := raw.(type) {
	case map[string]any:
		if strings.EqualFold(strings.TrimSpace(textValue(value["ref_type"])), "asset") {
			if assetID := uint64Value(value["ref_id"]); assetID > 0 {
				result[assetID] = struct{}{}
			}
		}
		if asset := mapValue(value["asset"]); asset != nil {
			if assetID := uint64Value(asset["id"]); assetID > 0 {
				result[assetID] = struct{}{}
			}
		}
		for key, child := range value {
			normalizedKey := strings.ToLower(strings.ReplaceAll(key, "_", ""))
			if strings.HasSuffix(normalizedKey, "assetid") {
				if assetID := uint64Value(child); assetID > 0 {
					result[assetID] = struct{}{}
				}
			}
			collectCanvasReferencedAssetIDs(child, result)
		}
	case []any:
		for _, child := range value {
			collectCanvasReferencedAssetIDs(child, result)
		}
	case []map[string]any:
		for _, child := range value {
			collectCanvasReferencedAssetIDs(child, result)
		}
	}
}

func canvasPayload(row projectmodel.Canvas) map[string]any {
	return map[string]any{
		"id":            row.ID,
		"project_id":    row.ProjectID,
		"asset_cate_id": row.AssetCateID,
		"next_node_no":  row.NextNodeNo,
		"nodes":         jsonValue(row.Nodes, []any{}),
		"edges":         jsonValue(row.Edges, []any{}),
		"viewport":      jsonValue(row.Viewport, map[string]any{}),
		"updated_at":    row.UpdatedAt,
	}
}

func canvasKey(assetCateID uint64) string {
	if assetCateID == 0 {
		return "default"
	}
	return fmt.Sprintf("%d", assetCateID)
}
