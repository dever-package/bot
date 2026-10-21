package team

import (
	"context"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
)

func (s Service) restoreWritingContent(ctx context.Context, snapshot *writingSnapshot, command WritingCommand) error {
	version := s.asset.FindVersion(ctx, command.SourceWorkVersionID)
	if version == nil || version.AssetID != snapshot.Asset.ID {
		return fmt.Errorf("作品历史版本不存在")
	}
	if _, ok := assetservice.WritingDocument(version.Content); !ok {
		return fmt.Errorf("历史版本不是当前故事合同")
	}
	var historical WritingDocument
	if err := decodeWritingDocument(version.Content, &historical); err != nil {
		return err
	}
	restored, err := restoredWritingDocument(snapshot.Work, historical)
	if err != nil {
		return err
	}
	// 历史根版本是完整快照，已移出目录的正文也必须验证精确 pin。
	if err := validateWritingRestoredUnits(ctx, *snapshot, restored); err != nil {
		return err
	}
	snapshot.Work = restored
	return nil
}

// 限制每次 IN 查询和驻留正文的数量，长篇恢复不随章节数产生逐章 SQL。
const writingBodyReferenceBatchSize = 200

func validateWritingRestoredUnits(ctx context.Context, snapshot writingSnapshot, historical WritingDocument) error {
	for _, directory := range [][]WritingUnitEntry{historical.Units, historical.ArchivedUnits} {
		for start := 0; start < len(directory); start += writingBodyReferenceBatchSize {
			refs := directory[start:min(start+writingBodyReferenceBatchSize, len(directory))]
			assets, versions := loadWritingBodyReferenceBatch(ctx, snapshot.Asset, refs)
			// 按历史目录顺序返回第一个错误，不按 SQL 结果或 map 顺序校验。
			for _, ref := range refs {
				if ref.AssetID == 0 && ref.VersionID == 0 {
					continue
				}
				if ref.AssetID == 0 || ref.VersionID == 0 {
					return fmt.Errorf("历史正文引用不完整")
				}
				if !writingUnitAssetBelongsTo(snapshot.Asset, assets[ref.AssetID]) {
					return fmt.Errorf("正文单元不存在或归属无效")
				}
				body, err := decodeWritingUnitReference(historical.Type, ref, versions[ref.VersionID])
				if err != nil {
					return err
				}
				if ref.HasBody != (strings.TrimSpace(body.Body) != "") {
					return fmt.Errorf("历史正文内容与目录状态不符")
				}
			}
		}
	}
	return nil
}

func loadWritingBodyReferenceBatch(ctx context.Context, work assetmodel.Asset, refs []WritingUnitEntry) (map[uint64]*assetmodel.Asset, map[uint64]*assetmodel.Version) {
	assetIDs, versionIDs := []uint64{}, []uint64{}
	for _, ref := range refs {
		if ref.AssetID > 0 && ref.VersionID > 0 {
			assetIDs = append(assetIDs, ref.AssetID)
			versionIDs = append(versionIDs, ref.VersionID)
		}
	}
	assets, versions := map[uint64]*assetmodel.Asset{}, map[uint64]*assetmodel.Version{}
	if len(assetIDs) == 0 {
		return assets, versions
	}
	for _, asset := range assetmodel.NewAssetModel().Select(ctx, map[string]any{
		"id": assetIDs, "project_id": work.ProjectID, "user_id": work.UserID, "team_id": work.TeamID,
		"canvas_id": work.CanvasID, "collection_id": work.ID, "asset_cate_id": work.AssetCateID, "status": assetmodel.StatusCurrent,
	}) {
		if asset != nil {
			assets[asset.ID] = asset
		}
	}
	// 不读取未通过作品归属校验的资产正文；版本仍以目录精确 pin 为准。
	validAssetIDs := make([]uint64, 0, len(assets))
	for id := range assets {
		validAssetIDs = append(validAssetIDs, id)
	}
	if len(validAssetIDs) > 0 {
		for _, version := range assetmodel.NewVersionModel().Select(ctx, map[string]any{"id": versionIDs, "asset_id": validAssetIDs}) {
			if version != nil {
				versions[version.ID] = version
			}
		}
	}
	return assets, versions
}

func restoredWritingDocument(current, historical WritingDocument) (WritingDocument, error) {
	if historical.Type != current.Type || historical.SchemaVersion != 1 {
		return WritingDocument{}, fmt.Errorf("作品历史版本类型不匹配")
	}
	if err := validateWritingSnapshot(historical); err != nil {
		return WritingDocument{}, err
	}

	if err := current.preserveSelectedInspiration(historical); err != nil {
		return WritingDocument{}, err
	}

	// 保留最新运行链作为后续创作配置来源，不恢复历史运行状态。
	historical.ActiveRunID = current.ActiveRunID
	historical.ActiveRequestID = ""
	historical.Status = "ready"
	return historical, nil
}
func (s Service) markWritingStopped(ctx context.Context, run teammodel.Run) {
	checkpoint := writingCheckpointFor(run)
	metadata := mapValue(jsonMap(run.Input)[CanvasPowerMetaContext])
	_, err := s.withWritingWrite(ctx, run.ProjectID, uint64Value(metadata["canvas_id"]), checkpoint.WorkAssetID, func(tx context.Context, current *writingSnapshot) error {
		if current.Work.ActiveRunID != run.ID {
			return nil
		}
		// 取消可能等待正在提交的单元事务，必须保留该事务刚写入的进度。
		stopped := s.repo.FindRun(tx, run.ID)
		if stopped == nil || stopped.Status != teammodel.RunStatusCanceled {
			return fmt.Errorf("运行停止状态已变化")
		}
		run = *stopped
		checkpoint = writingCheckpointFor(run)
		current.Work.Status = "stopped"
		if err := s.saveWritingDocument(tx, current, run.ID); err != nil {
			return err
		}
		checkpoint.WorkVersionID = current.Version.ID
		checkpoint.WorkRevision = writingRevision(current.Version)
		input := jsonMap(run.Input)
		input[writingRunKey] = writingMap(checkpoint)
		run.Input = jsonText(input)
		s.repo.UpdateRun(tx, run.ID, map[string]any{"input": run.Input, "output": jsonText(writingOutput(*current, run)), "interaction": "{}"})
		return nil
	})
	if err != nil {
		s.repo.UpdateRun(ctx, run.ID, map[string]any{"error": fmt.Sprintf("运行已停止，刷新作品状态失败: %v", err)})
	}
}
