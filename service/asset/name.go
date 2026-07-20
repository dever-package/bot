package asset

import (
	"context"
	"fmt"
	"strings"
	"unicode/utf8"

	assetmodel "github.com/dever-package/bot/model/asset"
)

const maxAssetNameRunes = 128

func (s Service) RenameTeamAsset(ctx context.Context, teamID uint64, assetID uint64, name string) (map[string]any, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	name = strings.TrimSpace(name)
	if name == "" {
		return nil, fmt.Errorf("资产标题不能为空")
	}
	if utf8.RuneCountInString(name) > maxAssetNameRunes {
		return nil, fmt.Errorf("资产标题不能超过 %d 个字符", maxAssetNameRunes)
	}
	assetmodel.NewAssetModel().Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
		"name":      name,
		"name_mode": assetmodel.NameModeManual,
	})
	updated := s.Find(ctx, asset.ID)
	if updated == nil {
		return nil, fmt.Errorf("读取资产失败")
	}
	return map[string]any{"asset": s.AssetDetailMap(ctx, *updated, nil)}, nil
}
