package project

import (
	"context"
	"encoding/json"
	"fmt"
	"slices"
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

func (s WorkspaceService) Bootstrap(ctx context.Context, projectID uint64, canvasID uint64, assetCateID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, team, release, err := s.project.currentTeamBinding(ctx, project)
	if err != nil {
		return nil, err
	}
	var payload map[string]any
	if team == nil {
		payload, err = s.project.team.WorkspaceCanvasBootstrap(ctx, project.TeamID, project.ReleaseID)
	} else {
		payload, err = s.project.team.WorkspaceCanvasBootstrapForRelease(ctx, *team, *release)
	}
	if err != nil {
		return nil, err
	}
	assetCates, _ := payload["asset_cates"].([]teamservice.GraphAssetCate)
	var activeCanvas *projectmodel.Canvas
	if canvasID > 0 {
		activeCanvas, err = requireProjectCanvas(ctx, project.ID, canvasID, 0)
		if err == nil && !validCanvasAssetCate(assetCates, activeCanvas.AssetCateID) {
			err = fmt.Errorf("画布输出类型不存在")
		}
	} else {
		assetCateID = workspaceBootstrapAssetCateID(assetCates, assetCateID)
		activeCanvas, err = s.ensureProjectCanvas(ctx, project.ID, assetCateID, 0)
	}
	if err != nil {
		return nil, err
	}
	assetCateID = activeCanvas.AssetCateID
	bundle := s.canvasBundle(ctx, *project, *activeCanvas)
	builder := newPayloadBuilder(ctx)
	if team != nil {
		builder.teams[team.ID] = team
		builder.releases[release.ID] = release
	}
	payload["project"] = builder.Project(*project)
	if assistant := mapValue(payload["assistant"]); assistant != nil {
		if assistantAvailable, _ := assistant["available"].(bool); assistantAvailable {
			assistant["context_key"] = WorkspaceAssistantContextKey(
				project.ID,
				activeCanvas.ID,
				project.TeamID,
				uint64Value(assistant["role_id"]),
			)
		}
	}
	payload["assets"] = bundle["assets"]
	payload["canvas"] = map[string]any{canvasKey(activeCanvas.ID): bundle["canvas"]}
	payload["canvas_list"] = bundle["canvas_list"]
	payload["active_canvas_id"] = activeCanvas.ID
	payload["active_asset_cate_id"] = assetCateID
	return payload, nil
}

func (s WorkspaceService) Canvas(ctx context.Context, projectID uint64, canvasID uint64, assetCateID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	var row *projectmodel.Canvas
	if canvasID > 0 {
		row, err = requireProjectCanvas(ctx, project.ID, canvasID, assetCateID)
	} else {
		var assetCates []teamservice.GraphAssetCate
		assetCates, err = s.projectCanvasAssetCates(ctx, project)
		if err == nil && !validCanvasAssetCate(assetCates, assetCateID) {
			err = fmt.Errorf("输出类型不存在")
		}
		if err == nil {
			row, err = s.ensureProjectCanvas(ctx, project.ID, assetCateID, 0)
		}
	}
	if err != nil {
		return nil, err
	}
	return s.canvasBundle(ctx, *project, *row), nil
}

func (s WorkspaceService) SaveCanvas(ctx context.Context, projectID uint64, canvasID uint64, assetCateID uint64, canvas map[string]any) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	row, err := requireProjectCanvasWithFields(ctx, project.ID, canvasID, assetCateID, canvasSummaryFields)
	if err != nil {
		return nil, err
	}
	clean, err := sanitizeCanvasPayload(row.AssetCateID, canvas)
	if err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, project.ID, []string{
		"canvas",
		fmt.Sprintf("%d", row.ID),
	}, func() (map[string]any, error) {
		return s.saveCanvas(ctx, *row, clean)
	})
}

func (s WorkspaceService) saveCanvas(
	ctx context.Context,
	canvasRow projectmodel.Canvas,
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
			"id":         canvasRow.ID,
			"project_id": canvasRow.ProjectID,
			"status":     projectmodel.CanvasStatusEnabled,
		})
		if row == nil {
			return fmt.Errorf("画布不存在或不属于当前项目")
		}
		changes := content.changedFields(*row)
		if len(changes) == 0 {
			savedAt = row.UpdatedAt
			return nil
		}
		changes["updated_at"] = savedAt
		if model.Update(tx, map[string]any{"id": row.ID}, changes) == 0 {
			return fmt.Errorf("保存画布失败")
		}
		changed = true
		if row.Nodes == content.Nodes {
			return nil
		}

		dependencies := inspectCanvasNodes(clean.Nodes)
		previous := inspectCanvasNodes(sliceValue(jsonValue(row.Nodes, []any{})))
		// 布局和展示变化不改变素材依赖；只有槽/名称或引用集合变化才同步。
		if !slices.Equal(previous.MaterialSlots, dependencies.MaterialSlots) {
			s.project.asset.EnsureCanvasMaterialSlotsActive(
				tx,
				canvasRow.ProjectID,
				canvasRow.ID,
				clean.AssetCateID,
				dependencies.MaterialSlots,
			)
		}
		if !slices.Equal(previous.ReferencedAssetIDs, dependencies.ReferencedAssetIDs) {
			s.project.asset.EnsureCanvasReferencedMaterialsActive(
				tx,
				canvasRow.ProjectID,
				dependencies.ReferencedAssetIDs,
			)
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return map[string]any{
		"canvas_id":     canvasRow.ID,
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

func (content canvasContent) changedFields(row projectmodel.Canvas) map[string]any {
	changes := map[string]any{}
	if content.NextNodeNo != row.NextNodeNo {
		changes["next_node_no"] = content.NextNodeNo
	}
	if content.Nodes != row.Nodes {
		changes["nodes"] = content.Nodes
	}
	if content.Edges != row.Edges {
		changes["edges"] = content.Edges
	}
	if content.Viewport != row.Viewport {
		changes["viewport"] = content.Viewport
	}
	return changes
}

type canvasNodeDependencies struct {
	MaterialSlots      []assetservice.CanvasMaterialSlot
	ReferencedAssetIDs []uint64
}

func inspectCanvasNodes(nodes []any) canvasNodeDependencies {
	dependencies := canvasNodeDependencies{
		MaterialSlots: make([]assetservice.CanvasMaterialSlot, 0, len(nodes)),
	}
	materialSlots := map[string]assetservice.CanvasMaterialSlot{}
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
				materialSlots[nodeKey] = assetservice.CanvasMaterialSlot{NodeKey: nodeKey, Name: name}
			}
		}
		collectCanvasReferencedAssetIDs(raw, referencedAssetIDs)
	}
	for _, slot := range materialSlots {
		dependencies.MaterialSlots = append(dependencies.MaterialSlots, slot)
	}
	slices.SortFunc(dependencies.MaterialSlots, func(left, right assetservice.CanvasMaterialSlot) int {
		return strings.Compare(left.NodeKey, right.NodeKey)
	})
	dependencies.ReferencedAssetIDs = make([]uint64, 0, len(referencedAssetIDs))
	for assetID := range referencedAssetIDs {
		dependencies.ReferencedAssetIDs = append(dependencies.ReferencedAssetIDs, assetID)
	}
	slices.Sort(dependencies.ReferencedAssetIDs)
	return dependencies
}

func (s WorkspaceService) canvasBundle(ctx context.Context, project projectmodel.Project, row projectmodel.Canvas) map[string]any {
	canvas := canvasPayload(row)
	nodes := sliceValue(canvas["nodes"])
	dependencies := inspectCanvasNodes(nodes)
	nodeKeys := make([]string, 0, len(dependencies.MaterialSlots))
	for _, slot := range dependencies.MaterialSlots {
		nodeKeys = append(nodeKeys, slot.NodeKey)
	}
	assets := s.project.asset.CanvasProjectReferences(
		ctx,
		project,
		row.ID,
		row.AssetCateID,
		dependencies.ReferencedAssetIDs,
		nodeKeys,
	)
	currentVersions := canvasCurrentAssetVersions(assets)
	writingAssetIDs := canvasWritingAssetIDs(assets)
	refreshCanvasAssetReferenceVersions(nodes, currentVersions, writingAssetIDs)
	refreshCanvasAssetReferenceVersions(assets, currentVersions, writingAssetIDs)
	canvas["nodes"] = nodes
	return map[string]any{
		"canvas":           canvas,
		"assets":           map[string]any{"items": assets},
		"canvas_list":      projectCanvasListPayload(projectCanvasSummaryRows(ctx, row.ProjectID, nil)),
		"active_canvas_id": row.ID,
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

func canvasWritingAssetIDs(assets []map[string]any) map[uint64]bool {
	result := map[uint64]bool{}
	for _, asset := range assets {
		if _, ok := assetservice.WritingDocument(valueAtPath(asset, "version", "content")); ok {
			result[uint64Value(asset["id"])] = true
		}
	}
	return result
}

func refreshCanvasAssetReferenceVersions(raw any, versions map[uint64]uint64, writingAssetIDs map[uint64]bool) {
	switch value := raw.(type) {
	case map[string]any:
		// 已保存的叙事文档是不可变快照，目录内的单元版本不能随资产指针升级。
		if _, writing := assetservice.WritingDocument(value); writing {
			return
		}
		if strings.EqualFold(strings.TrimSpace(textValue(value["ref_type"])), "asset") {
			assetID := uint64Value(value["ref_id"])
			if versionID := versions[assetID]; versionID > 0 && !writingAssetIDs[assetID] && value["ref_content_selection"] == nil {
				value["ref_version_id"] = versionID
			}
		}
		assetID := uint64Value(value["asset_id"])
		if versionID := versions[assetID]; versionID > 0 && !writingAssetIDs[assetID] && value["content_selection"] == nil {
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
			refreshCanvasAssetReferenceVersions(child, versions, writingAssetIDs)
		}
	case []any:
		for _, child := range value {
			refreshCanvasAssetReferenceVersions(child, versions, writingAssetIDs)
		}
	case []map[string]any:
		for _, child := range value {
			refreshCanvasAssetReferenceVersions(child, versions, writingAssetIDs)
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
		if _, writing := assetservice.WritingDocument(value); writing {
			// 目录里的 asset_id 是按需读取的正文单元，不是画布待预加载的引用。
			if assetID := firstUint64(uint64Value(value["asset_id"]), uint64Value(value["work_asset_id"])); assetID > 0 {
				result[assetID] = struct{}{}
			}
			return
		}
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
		"name":          strings.TrimSpace(row.Name),
		"sort":          row.Sort,
		"status":        row.Status,
		"next_node_no":  row.NextNodeNo,
		"nodes":         jsonValue(row.Nodes, []any{}),
		"edges":         jsonValue(row.Edges, []any{}),
		"viewport":      jsonValue(row.Viewport, map[string]any{}),
		"updated_at":    row.UpdatedAt,
	}
}

func canvasKey(canvasID uint64) string {
	if canvasID == 0 {
		return "default"
	}
	return fmt.Sprintf("%d", canvasID)
}
