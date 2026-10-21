package asset

import (
	"context"
	"fmt"

	assetmodel "github.com/dever-package/bot/model/asset"
)

// WritingDocument recognizes only the persisted writing domain documents.
func WritingDocument(raw any) (map[string]any, bool) {
	if value, ok := raw.(string); ok {
		raw = jsonValue(value)
	}
	document, ok := raw.(map[string]any)
	if !ok {
		return nil, false
	}
	if nested, ok := document["json"].(map[string]any); ok {
		document = nested
	}
	switch document["type"] {
	case "story":
		_, inspirations := document["inspirations"].([]any)
		_, selected := document["selected_inspiration_id"].(string)
		_, preferences := document["preferences"].(map[string]any)
		outline, structured := document["outline"].(map[string]any)
		validOutline := structured && len(outline) == 5
		for _, key := range []string{"overview", "world"} {
			_, text := outline[key].(string)
			validOutline = validOutline && text
		}
		for _, key := range []string{"characters", "locations", "props"} {
			_, list := outline[key].([]any)
			validOutline = validOutline && list
		}
		for key := range document {
			switch key {
			case "type", "schema_version", "title", "preferences", "inspirations", "selected_inspiration_id", "outline", "units", "archived_units", "status", "active_run_id", "active_request_id":
			default:
				return nil, false
			}
		}
		for _, field := range []string{"units", "archived_units"} {
			rows, ok := document[field].([]any)
			if !ok {
				return nil, false
			}
			for _, raw := range rows {
				unit, ok := raw.(map[string]any)
				if !ok {
					return nil, false
				}
				if stale, exists := unit["plan_stale"]; exists {
					if _, ok := stale.(bool); !ok {
						return nil, false
					}
				}
				for key := range unit {
					switch key {
					case "id", "unit_type", "title", "plan", "plan_stale", "children", "asset_id", "version_id", "has_body", "continuity_valid", "continuity_index", "continuity_status", "continuity_findings", "dependency_stale":
					default:
						return nil, false
					}
				}
			}
		}
		return document, inspirations && selected && preferences && validOutline && document["schema_version"] == float64(1)
	case "writing_unit":
		_, body := document["body"].(string)
		_, id := document["unit_id"].(string)
		return document, body && id && document["profile"] == "story" && document["schema_version"] == float64(1)
	}
	return nil, false
}

// 故事引用读取指定根版本：当前根可编辑，历史根及正文修订保持固定内容。
// 普通资产引用仍遵循当前版本规则，权限校验与故事引用相同。
func (s Service) RequireWritingReference(ctx context.Context, teamID, assetID, versionID uint64) (CurrentReference, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return CurrentReference{}, err
	}
	if asset.Status != assetmodel.StatusCurrent || versionID == 0 {
		return CurrentReference{}, fmt.Errorf("创作引用需要可用资产和明确版本")
	}
	return writingReference(asset, s.FindVersion(ctx, versionID))
}

type WritingReferenceID struct {
	AssetID   uint64
	VersionID uint64
}

type WritingReferenceResult struct {
	Reference CurrentReference
	Err       error
}

// 每个精确版本独立保留校验结果，由调用方按选择顺序决定首先返回的错误。
func (s Service) RequireWritingReferences(ctx context.Context, teamID uint64, references []WritingReferenceID) (map[WritingReferenceID]WritingReferenceResult, error) {
	if teamID == 0 {
		return nil, fmt.Errorf("团队和资产不能为空")
	}
	result := make(map[WritingReferenceID]WritingReferenceResult, len(references))
	if len(references) == 0 {
		return result, nil
	}
	scope, err := resolveTeamAssetOwnerScope(ctx, teamID)
	if err != nil {
		return nil, err
	}
	assetIDs := make([]uint64, 0, len(references))
	for _, reference := range references {
		assetIDs = append(assetIDs, reference.AssetID)
	}
	assets := map[uint64]*assetmodel.Asset{}
	if ids := distinctAssetReferenceIDs(assetIDs); len(ids) > 0 {
		for _, asset := range assetmodel.NewAssetModel().Select(ctx, map[string]any{"id": ids, "user_id": scope.UserID, "team_id": scope.TeamID}) {
			if asset != nil {
				assets[asset.ID] = asset
			}
		}
	}
	versionIDs := make([]uint64, 0, len(references))
	versionAssetIDs := make([]uint64, 0, len(references))
	for _, reference := range references {
		asset := assets[reference.AssetID]
		var err error
		switch {
		case reference.AssetID == 0:
			err = fmt.Errorf("团队和资产不能为空")
		case !scope.contains(asset):
			err = fmt.Errorf("资产不存在或不属于当前团队")
		case asset.Status != assetmodel.StatusCurrent || reference.VersionID == 0:
			err = fmt.Errorf("创作引用需要可用资产和明确版本")
		default:
			versionIDs = append(versionIDs, reference.VersionID)
			versionAssetIDs = append(versionAssetIDs, reference.AssetID)
		}
		result[reference] = WritingReferenceResult{Err: err}
	}
	versions := map[uint64]*assetmodel.Version{}
	if ids := distinctAssetReferenceIDs(versionIDs); len(ids) > 0 {
		for _, version := range assetmodel.NewVersionModel().Select(ctx, map[string]any{"id": ids, "asset_id": distinctAssetReferenceIDs(versionAssetIDs)}) {
			if version != nil {
				versions[version.ID] = version
			}
		}
	}
	for reference, resolved := range result {
		if resolved.Err != nil {
			continue
		}
		resolved.Reference, resolved.Err = writingReference(assets[reference.AssetID], versions[reference.VersionID])
		result[reference] = resolved
	}
	return result, nil
}

func writingReference(asset *assetmodel.Asset, version *assetmodel.Version) (CurrentReference, error) {
	if version == nil || version.AssetID != asset.ID {
		return CurrentReference{}, fmt.Errorf("创作来源版本不存在")
	}
	content := jsonValue(version.Content)
	if _, ok := WritingDocument(content); !ok {
		return CurrentReference{}, fmt.Errorf("当前资产不是故事内容")
	}
	return CurrentReference{Asset: *asset, Version: *version, Content: content}, nil
}

func writingDedicatedWriteError() error {
	return fmt.Errorf("故事内容请通过创作工作区修订，历史版本不可覆盖")
}
