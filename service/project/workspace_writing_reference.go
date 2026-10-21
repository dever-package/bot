package project

import (
	"context"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	assetservice "github.com/dever-package/bot/service/asset"
)

type canvasContentSelection struct {
	Kind string   `json:"kind"`
	IDs  []string `json:"ids"`
}

func parseCanvasContentSelection(raw any) (*canvasContentSelection, error) {
	if raw == nil {
		return nil, nil
	}
	row := mapValue(raw)
	kind, _ := row["kind"].(string)
	if kind != "section" && kind != "unit" {
		return nil, fmt.Errorf("创作引用范围必须是规划部分或正文单元")
	}
	ids := sliceValue(row["ids"])
	if len(ids) == 0 {
		return nil, fmt.Errorf("创作引用没有选中内容")
	}
	selection := &canvasContentSelection{Kind: kind, IDs: make([]string, 0, len(ids))}
	seen := map[string]bool{}
	for _, rawID := range ids {
		id, ok := rawID.(string)
		if !ok || strings.TrimSpace(id) == "" || seen[id] {
			return nil, fmt.Errorf("创作引用包含无效或重复的内容标识")
		}
		seen[id] = true
		selection.IDs = append(selection.IDs, id)
	}
	return selection, nil
}

func canvasContentSelectionKey(selection *canvasContentSelection) string {
	if selection == nil {
		return ""
	}
	return jsonText(selection, "")
}

func resolveCanvasWritingContent(ctx context.Context, current assetservice.CurrentReference, reference canvasPromptReference) (map[string]any, any, error) {
	service := assetservice.NewService()
	pinned, err := service.RequireWritingReference(ctx, current.Asset.TeamID, reference.ReferenceID, reference.VersionID)
	if err != nil {
		return nil, nil, err
	}
	document, _ := assetservice.WritingDocument(pinned.Content)
	var unitsByReference map[assetservice.WritingReferenceID]assetservice.WritingReferenceResult
	output, err := projectCanvasWritingContent(document, reference.ContentSelection, func(unit map[string]any) (map[string]any, error) {
		if unitsByReference == nil {
			var err error
			unitsByReference, err = service.RequireWritingReferences(ctx, pinned.Asset.TeamID, selectedWritingReferences(document, reference.ContentSelection))
			if err != nil {
				return nil, err
			}
		}
		loaded := unitsByReference[writingUnitReference(unit)]
		if loaded.Err != nil {
			return nil, loaded.Err
		}
		resolved := loaded.Reference
		if !sameWritingCollection(pinned.Asset, resolved.Asset) {
			return nil, fmt.Errorf("正文单元不属于引用作品")
		}
		body, ok := assetservice.WritingDocument(resolved.Content)
		if !ok || textValue(body["type"]) != "writing_unit" || textValue(body["unit_id"]) != textValue(unit["id"]) || textValue(body["profile"]) != textValue(document["type"]) {
			return nil, fmt.Errorf("正文单元与引用目录不一致")
		}
		return body, nil
	})
	if err != nil {
		return nil, nil, fmt.Errorf("创作引用“%s”：%w", firstText(document["title"], current.Asset.Name), err)
	}
	metadata := assetservice.AssetToMap(pinned.Asset)
	metadata["kind"] = "text"
	metadata["version_id"] = pinned.Version.ID
	return metadata, output, nil
}

func writingUnitReference(unit map[string]any) assetservice.WritingReferenceID {
	return assetservice.WritingReferenceID{AssetID: uint64Value(unit["asset_id"]), VersionID: uint64Value(unit["version_id"])}
}

func selectedWritingReferences(document map[string]any, selection *canvasContentSelection) []assetservice.WritingReferenceID {
	units := writingUnitsByID(document)
	result := make([]assetservice.WritingReferenceID, 0, len(selection.IDs))
	for _, id := range selection.IDs {
		reference := writingUnitReference(units[id])
		if reference.AssetID > 0 && reference.VersionID > 0 {
			result = append(result, reference)
		}
	}
	return result
}

func writingUnitsByID(document map[string]any) map[string]map[string]any {
	units := map[string]map[string]any{}
	for _, raw := range sliceValue(document["units"]) {
		unit := mapValue(raw)
		units[textValue(unit["id"])] = unit
	}
	return units
}

func sameWritingCollection(work assetmodel.Asset, unit assetmodel.Asset) bool {
	return work.ID > 0 && work.Kind == assetmodel.KindCollection && unit.Kind == assetmodel.KindText && unit.CollectionID == work.ID &&
		unit.UserID == work.UserID && unit.TeamID == work.TeamID && unit.ProjectID == work.ProjectID &&
		unit.CanvasID == work.CanvasID && unit.AssetCateID == work.AssetCateID
}

// The projection reads only the selected immutable units, never the full book.
func projectCanvasWritingContent(document map[string]any, selection *canvasContentSelection, loadUnit func(map[string]any) (map[string]any, error)) (map[string]any, error) {
	if textValue(document["type"]) == "writing_unit" {
		if selection != nil {
			return nil, fmt.Errorf("正文单元不能再次选择作品目录")
		}
		body := textValue(document["body"])
		if body == "" {
			return nil, fmt.Errorf("正文尚未生成")
		}
		return map[string]any{"text": firstText(document["title"]) + "\n\n" + body}, nil
	}
	parts := []string{firstText(document["title"])}
	sectionText := map[string]string{"inspiration": "", "outline": ""}
	for _, raw := range sliceValue(document["inspirations"]) {
		candidate := mapValue(raw)
		if textValue(candidate["id"]) == textValue(document["selected_inspiration_id"]) {
			sectionText["inspiration"] = firstText(candidate["title"]) + "\n" + firstText(candidate["content"])
		}
	}
	outline := mapValue(document["outline"])
	for _, kind := range []string{"characters", "locations", "props"} {
		rows := []string{}
		for _, raw := range sliceValue(outline[kind]) {
			entity := mapValue(raw)
			rows = append(rows, firstText(entity["name"])+"："+firstText(entity["description"]))
		}
		sectionText[kind] = strings.Join(rows, "\n")
	}
	outlineParts := []string{}
	for _, section := range []struct{ id, label string }{{"overview", "故事概览"}, {"world", "世界与规则"}, {"characters", "人物与关系"}, {"locations", "场景"}, {"props", "道具"}} {
		text := textValue(outline[section.id])
		if section.id == "characters" || section.id == "locations" || section.id == "props" {
			text = sectionText[section.id]
		}
		if text != "" {
			outlineParts = append(outlineParts, section.label+"\n"+text)
		}
	}
	sectionText["outline"] = strings.Join(outlineParts, "\n\n")
	labels := map[string]string{"inspiration": "灵感", "outline": "大纲", "characters": "角色", "locations": "场景", "props": "道具"}
	if selection == nil || selection.Kind == "section" {
		ids := []string{"inspiration", "outline"}
		if selection != nil {
			ids = selection.IDs
		}
		for _, id := range ids {
			label, ok := labels[id]
			if !ok {
				return nil, fmt.Errorf("所选规划部分不存在")
			}
			if id != "inspiration" && id != "outline" && containsWritingSelection(ids, "outline") {
				continue
			}
			text := sectionText[id]
			if text == "" && selection != nil {
				return nil, fmt.Errorf("所选规划部分尚无内容")
			}
			if text != "" {
				parts = append(parts, label+"\n"+text)
			}
		}
		if selection == nil || containsWritingSelection(ids, "outline") {
			appendWritingPlanText(&parts, sliceValue(document["units"]))
		}
		if len(parts) == 1 {
			return nil, fmt.Errorf("作品规划尚未生成")
		}
		return map[string]any{"text": strings.Join(parts, "\n\n")}, nil
	}
	if selection.Kind != "unit" || len(selection.IDs) == 0 {
		return nil, fmt.Errorf("创作引用范围无效")
	}
	for _, id := range []string{"inspiration", "outline"} {
		if sectionText[id] != "" {
			parts = append(parts, labels[id]+"\n"+sectionText[id])
		}
	}
	units := writingUnitsByID(document)

	loaded := map[string]bool{}
	appendBody := func(unit map[string]any) error {

		id := textValue(unit["id"])
		if loaded[id] {
			return nil
		}
		loaded[id] = true
		if uint64Value(unit["asset_id"]) == 0 || uint64Value(unit["version_id"]) == 0 {
			return fmt.Errorf("所选正文单元尚未生成")
		}
		body, err := loadUnit(unit)
		if err != nil {
			return err
		}
		text := textValue(body["body"])
		if text == "" {
			return fmt.Errorf("所选正文为空")
		}
		parts = append(parts, firstText(unit["title"], body["title"], id)+"\n剧情计划："+firstText(unit["plan"])+"\n\n"+text)
		return nil
	}
	for _, id := range selection.IDs {
		unit := units[id]
		if unit == nil {
			return nil, fmt.Errorf("所选正文单元不存在")
		}
		if err := appendBody(unit); err != nil {
			return nil, err
		}
	}
	return map[string]any{"text": strings.Join(parts, "\n\n")}, nil
}
func containsWritingSelection(ids []string, id string) bool {
	for _, candidate := range ids {
		if candidate == id {
			return true
		}
	}
	return false
}
func appendWritingPlanText(parts *[]string, units []any) {
	for _, raw := range units {
		unit := mapValue(raw)
		*parts = append(*parts, firstText(unit["title"])+"\n"+firstText(unit["plan"]))
	}
}

func canvasWritingEdgeOutput(ctx context.Context, projectID uint64, nodeID string, results []canvasNodeResult, canvas map[string]any, allowedSourceNodeIDs map[string]bool, referencesConfigured bool) (any, map[string]bool, error) {
	references, err := canvasStructuredPromptReferences(mapValue(valueAtPath(canvasNodeByID(nodeID, canvas), "composer_draft", "prompt_content")))
	if err != nil {
		return nil, nil, err
	}
	excluded := map[string]bool{}
	sources := []any{}
	for _, edge := range logicalUpstreamCanvasEdges(nodeID, canvas) {
		if referencesConfigured && len(allowedSourceNodeIDs) > 0 && !allowedSourceNodeIDs[edge.From] {
			continue
		}
		if excluded[edge.From] {
			continue
		}
		source := canvasNodeByID(edge.From, canvas)
		if !canvasNodeMayProvideWriting(source) {
			continue
		}
		reference, ok := canvasNodeCurrentAssetReference(edge.From, results, canvas)
		if !ok {
			if canvasNodeDeclaresWriting(source) {
				return nil, nil, fmt.Errorf("创作来源需要先保存明确的作品版本")
			}
			continue
		}
		if !canvasNodeDeclaresWriting(source) {
			project, err := requireProject(ctx, projectID)
			if err != nil {
				return nil, nil, err
			}
			resolved, err := assetservice.NewService().RequireCanvasCurrentReferences(ctx, project.TeamID, []uint64{reference.ReferenceID})
			if err != nil {
				return nil, nil, err
			}
			if _, writing := assetservice.WritingDocument(resolved[reference.ReferenceID].Content); !writing {
				continue
			}
		}
		bound := false
		for _, explicit := range references {
			if explicit.ReferenceType != canvasReferenceTypeAsset || explicit.ReferenceID != reference.ReferenceID {
				continue
			}
			if !strings.EqualFold(explicit.Origin, "edge") || explicit.ContentSelection != nil {
				// This reference is projected by canvasPromptReferenceOutput.
				bound = true
				break
			}
			if explicit.OriginID == edge.ID && explicit.VersionID > 0 {
				reference.VersionID = explicit.VersionID
			}
		}
		excluded[edge.From] = true
		if bound {
			continue
		}
		metadata, output, err := resolveCanvasReference(ctx, projectID, reference)
		if err != nil {
			return nil, nil, err
		}
		sources = append(sources, newCanvasGroupOutputSource(edge.From, firstText(metadata["name"], source["title"]), "text", "", reference.ReferenceID, uint64Value(metadata["version_id"]), output))
	}
	if len(sources) == 0 {
		return nil, excluded, nil
	}
	return map[string]any{"type": "reference_output", "sources": sources}, excluded, nil
}

func canvasNodeMayProvideWriting(node map[string]any) bool {
	if canvasNodeDeclaresWriting(node) {
		return true
	}
	if firstText(node["kind"], valueAtPath(node, "asset", "kind")) == assetmodel.KindCollection {
		return true
	}
	for _, output := range []any{valueAtPath(node, "asset", "version", "content"), node["result_output"]} {
		if _, ok := assetservice.WritingDocument(output); ok {
			return true
		}
	}
	_, writing := workspaceWritingResultDocument(node["result_output"])
	return writing
}

func canvasNodeDeclaresWriting(node map[string]any) bool {
	for _, outputType := range []any{node["output_type"], valueAtPath(node, "power", "output_type"), valueAtPath(node, "power", "output", "key")} {
		if kind := textValue(outputType); kind == "story" {
			return true
		}
	}
	return false
}
