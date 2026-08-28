package project

import (
	"context"
	"encoding/json"
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
	project, err = s.project.currentTeamRelease(ctx, project)
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
	if assistant := mapValue(payload["assistant"]); assistant != nil {
		if assistantAvailable, _ := assistant["available"].(bool); assistantAvailable {
			assistant["context_key"] = WorkspaceAssistantContextKey(
				project.ID,
				project.TeamID,
				uint64Value(assistant["role_id"]),
			)
		}
	}
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
	return withWorkspaceAssetLock(ctx, project.ID, []string{
		"canvas",
		fmt.Sprintf("%d", clean.AssetCateID),
	}, func() (map[string]any, error) {
		return s.saveCanvas(ctx, project.ID, clean)
	})
}

func (s WorkspaceService) saveCanvas(
	ctx context.Context,
	projectID uint64,
	clean persistedCanvas,
) (map[string]any, error) {
	content, err := encodeCanvasContent(clean)
	if err != nil {
		return nil, err
	}
	savedAt := time.Now()
	changed := false
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		model := projectmodel.NewCanvasModel()
		row := model.Find(tx, map[string]any{
			"project_id":    projectID,
			"asset_cate_id": clean.AssetCateID,
		})
		if row == nil {
			record := content.record(savedAt)
			record["project_id"] = projectID
			record["asset_cate_id"] = clean.AssetCateID
			record["created_at"] = savedAt
			if model.Insert(tx, record) == 0 {
				return fmt.Errorf("保存画布失败")
			}
			changed = true
		} else {
			if content.matches(*row) {
				savedAt = row.UpdatedAt
				return nil
			}
			if model.Update(tx, map[string]any{"id": row.ID}, content.record(savedAt)) == 0 {
				return fmt.Errorf("保存画布失败")
			}
			changed = true
			if row.Nodes == content.Nodes {
				return nil
			}
		}

		dependencies := inspectCanvasNodes(clean.Nodes)
		s.project.asset.EnsureCanvasMaterialSlotsActive(
			tx,
			projectID,
			clean.AssetCateID,
			dependencies.MaterialSlots,
		)
		s.project.asset.EnsureCanvasReferencedMaterialsActive(
			tx,
			projectID,
			dependencies.ReferencedAssetIDs,
		)
		return nil
	}); err != nil {
		return nil, err
	}
	return map[string]any{
		"asset_cate_id": clean.AssetCateID,
		"updated_at":    savedAt,
		"changed":       changed,
	}, nil
}

type canvasContent struct {
	NextNodeNo int
	Nodes      string
	Edges      string
	Viewport   string
}

func encodeCanvasContent(canvas persistedCanvas) (canvasContent, error) {
	nodes, err := json.Marshal(canvas.Nodes)
	if err != nil {
		return canvasContent{}, fmt.Errorf("编码画布节点失败: %w", err)
	}
	edges, err := json.Marshal(canvas.Edges)
	if err != nil {
		return canvasContent{}, fmt.Errorf("编码画布连线失败: %w", err)
	}
	viewport, err := json.Marshal(canvas.Viewport)
	if err != nil {
		return canvasContent{}, fmt.Errorf("编码画布视图失败: %w", err)
	}
	return canvasContent{
		NextNodeNo: canvas.NextNodeNo,
		Nodes:      string(nodes),
		Edges:      string(edges),
		Viewport:   string(viewport),
	}, nil
}

func (content canvasContent) record(updatedAt time.Time) map[string]any {
	return map[string]any{
		"next_node_no": content.NextNodeNo,
		"nodes":        content.Nodes,
		"edges":        content.Edges,
		"viewport":     content.Viewport,
		"updated_at":   updatedAt,
	}
}

func (content canvasContent) matches(row projectmodel.Canvas) bool {
	return content.NextNodeNo == row.NextNodeNo &&
		content.Nodes == row.Nodes &&
		content.Edges == row.Edges &&
		content.Viewport == row.Viewport
}

type canvasNodeDependencies struct {
	MaterialSlots      []assetservice.CanvasMaterialSlot
	ReferencedAssetIDs []uint64
}

func inspectCanvasNodes(nodes []any) canvasNodeDependencies {
	dependencies := canvasNodeDependencies{
		MaterialSlots: make([]assetservice.CanvasMaterialSlot, 0, len(nodes)),
	}
	referencedAssetIDs := map[uint64]struct{}{}
	for _, raw := range nodes {
		node, _ := raw.(map[string]any)
		nodeType := strings.TrimSpace(fmt.Sprint(node["type"]))
		if nodeType == "power" || nodeType == "agent" || nodeType == "flow" {
			nodeKey := strings.TrimSpace(fmt.Sprint(node["id"]))
			if nodeKey != "" {
				name := strings.TrimSpace(fmt.Sprint(node["title"]))
				if name == "" {
					name = nodeType
				}
				dependencies.MaterialSlots = append(dependencies.MaterialSlots, assetservice.CanvasMaterialSlot{NodeKey: nodeKey, Name: name})
			}
		}
		collectCanvasReferencedAssetIDs(raw, referencedAssetIDs)
	}
	dependencies.ReferencedAssetIDs = make([]uint64, 0, len(referencedAssetIDs))
	for assetID := range referencedAssetIDs {
		dependencies.ReferencedAssetIDs = append(dependencies.ReferencedAssetIDs, assetID)
	}
	return dependencies
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
	dependencies := inspectCanvasNodes(nodes)
	nodeKeys := make([]string, 0, len(dependencies.MaterialSlots))
	for _, slot := range dependencies.MaterialSlots {
		nodeKeys = append(nodeKeys, slot.NodeKey)
	}
	assets := s.project.asset.CanvasReferences(
		ctx,
		projectID,
		assetCateID,
		dependencies.ReferencedAssetIDs,
		nodeKeys,
	)
	currentVersions := canvasCurrentAssetVersions(assets)
	refreshCanvasAssetReferenceVersions(nodes, currentVersions)
	refreshCanvasAssetReferenceVersions(assets, currentVersions)
	canvas["nodes"] = nodes
	return map[string]any{
		"canvas": canvas,
		"assets": map[string]any{"items": assets},
	}
}

func canvasCurrentAssetVersions(assets []map[string]any) map[uint64]uint64 {
	result := make(map[uint64]uint64, len(assets))
	for _, asset := range assets {
		assetID := uint64Value(asset["id"])
		versionID := uint64Value(asset["version_id"])
		if assetID > 0 && versionID > 0 {
			result[assetID] = versionID
		}
	}
	return result
}

func refreshCanvasAssetReferenceVersions(raw any, versions map[uint64]uint64) {
	switch value := raw.(type) {
	case map[string]any:
		if strings.EqualFold(strings.TrimSpace(textValue(value["ref_type"])), "asset") {
			if versionID := versions[uint64Value(value["ref_id"])]; versionID > 0 {
				value["ref_version_id"] = versionID
			}
		}
		if versionID := versions[uint64Value(value["asset_id"])]; versionID > 0 {
			if _, exists := value["version_id"]; exists {
				value["version_id"] = versionID
			}
		}
		if versionID := versions[uint64Value(value["id"])]; versionID > 0 {
			if _, exists := value["version_id"]; exists {
				value["version_id"] = versionID
			}
		}
		for _, child := range value {
			refreshCanvasAssetReferenceVersions(child, versions)
		}
	case []any:
		for _, child := range value {
			refreshCanvasAssetReferenceVersions(child, versions)
		}
	case []map[string]any:
		for _, child := range value {
			refreshCanvasAssetReferenceVersions(child, versions)
		}
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
			if strings.HasSuffix(normalizedKey, "assetids") {
				collectCanvasAssetIDValues(child, result)
			} else if strings.HasSuffix(normalizedKey, "assetid") {
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

func collectCanvasAssetIDValues(raw any, result map[uint64]struct{}) {
	for _, value := range sliceValue(raw) {
		if assetID := uint64Value(value); assetID > 0 {
			result[assetID] = struct{}{}
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
