package team

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	userservice "github.com/dever-package/user/service"
	"github.com/shemic/dever/orm"
)

type writingSnapshot struct {
	Asset   assetmodel.Asset
	Version assetmodel.Version
	Work    WritingDocument
}

func (s Service) loadWriting(ctx context.Context, projectID, canvasID, assetID uint64) (writingSnapshot, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return writingSnapshot{}, err
	}
	project := projectmodel.NewProjectModel().Find(ctx, map[string]any{"id": projectID, "user_id": actor.UserID, "status": projectmodel.StatusEnabled})
	if project == nil {
		return writingSnapshot{}, fmt.Errorf("作品不存在")
	}
	asset := s.asset.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil || asset.UserID != actor.UserID || asset.TeamID != project.TeamID || asset.CanvasID != canvasID || asset.Kind != assetmodel.KindCollection || asset.Status != assetmodel.StatusCurrent {
		return writingSnapshot{}, fmt.Errorf("创作资产不存在或不属于当前画布")
	}
	version := s.asset.FindVersion(ctx, asset.VersionID)
	if version == nil || version.AssetID != asset.ID {
		return writingSnapshot{}, fmt.Errorf("作品版本不存在")
	}
	if _, ok := assetservice.WritingDocument(version.Content); !ok {
		return writingSnapshot{}, fmt.Errorf("当前资产不是可编辑的创作作品")
	}
	var work WritingDocument
	if err = decodeWritingDocument(version.Content, &work); err != nil {
		return writingSnapshot{}, err
	}
	if !writingProfile(work.Type) || work.SchemaVersion != 1 {
		return writingSnapshot{}, fmt.Errorf("当前资产不是可编辑的故事")
	}
	if err := validateWritingSnapshot(work); err != nil {
		return writingSnapshot{}, err
	}
	return writingSnapshot{Asset: *asset, Version: *version, Work: work}, nil
}

func (s Service) loadWritingUnit(ctx context.Context, work writingSnapshot, index int) (WritingUnit, error) {
	ref := work.Work.Units[index]
	asset := s.asset.FindProjectAsset(ctx, work.Asset.ProjectID, ref.AssetID)
	if !writingUnitAssetBelongsTo(work.Asset, asset) {
		return WritingUnit{}, fmt.Errorf("正文单元不存在或归属无效")
	}
	return decodeWritingUnitReference(work.Work.Type, ref, s.asset.FindVersion(ctx, ref.VersionID))
}

func writingUnitAssetBelongsTo(work assetmodel.Asset, asset *assetmodel.Asset) bool {
	return asset != nil && asset.ProjectID == work.ProjectID && asset.CollectionID == work.ID &&
		asset.UserID == work.UserID && asset.TeamID == work.TeamID && asset.CanvasID == work.CanvasID &&
		asset.AssetCateID == work.AssetCateID && asset.Status == assetmodel.StatusCurrent
}

func decodeWritingUnitReference(profile string, ref WritingUnitEntry, version *assetmodel.Version) (WritingUnit, error) {
	if version == nil || version.AssetID != ref.AssetID {
		return WritingUnit{}, fmt.Errorf("正文版本不存在")
	}
	var unit WritingUnit
	if err := decodeWritingDocument(version.Content, &unit); err != nil {
		return unit, err
	}
	if unit.Type != "writing_unit" || unit.SchemaVersion != 1 || unit.UnitID != ref.ID || unit.Profile != profile {
		return unit, fmt.Errorf("正文单元身份无效")
	}
	return unit, nil
}

func writingAssetRequest(asset assetmodel.Asset, requestID string, content any) assetservice.SaveVersionRequest {
	return assetservice.SaveVersionRequest{WritingWrite: true, AssetID: asset.ID, UserID: asset.UserID, ProjectID: asset.ProjectID, CanvasID: asset.CanvasID, BodyID: asset.BodyID, TeamID: asset.TeamID, FlowID: asset.FlowID, AssetCateID: asset.AssetCateID, CollectionID: asset.CollectionID, RequestID: requestID, NodeKey: asset.NodeKey, SourceType: asset.SourceType, SourceID: asset.SourceID, SourceName: asset.SourceName, Name: asset.Name, Kind: asset.Kind, Role: asset.Role, Sort: asset.Sort, Content: map[string]any{"json": content}}
}
func writingRevision(version assetmodel.Version) uint64 {
	return uint64Value(jsonMap(version.Content)["writing_revision"])
}

func writingDocumentContent(snapshot writingSnapshot) map[string]any {
	return map[string]any{"json": writingMap(snapshot.Work), "writing_revision": writingRevision(snapshot.Version) + 1}
}

// 当前根是可编辑草稿；正文修订和非当前根版本仍保持固定内容。
func (s Service) saveWritingDocument(tx context.Context, snapshot *writingSnapshot, runID uint64) error {
	if assetmodel.NewVersionModel().Update(tx, map[string]any{"id": snapshot.Version.ID, "asset_id": snapshot.Asset.ID}, map[string]any{
		"content": jsonText(writingDocumentContent(*snapshot)),
		"run_id":  runID, "updated_at": time.Now(),
	}) != 1 {
		return fmt.Errorf("保存作品草稿失败")
	}
	if snapshot.Asset.NameMode != assetmodel.NameModeManual {
		assetmodel.NewAssetModel().Update(tx, map[string]any{"id": snapshot.Asset.ID}, map[string]any{"name": snapshot.Work.Title})
		snapshot.Asset.Name = snapshot.Work.Title
	}
	version := s.asset.FindVersion(tx, snapshot.Version.ID)
	if version == nil {
		return fmt.Errorf("读取作品草稿失败")
	}
	snapshot.Version = *version
	return nil
}

func (s Service) createWritingVersion(tx context.Context, snapshot *writingSnapshot, requestID string) error {
	request := writingAssetRequest(snapshot.Asset, requestID, writingMap(snapshot.Work))
	request.Name = snapshot.Work.Title
	request.RunID = snapshot.Work.ActiveRunID
	request.ReleaseID = snapshot.Version.ReleaseID
	request.Source = jsonMap(snapshot.Version.Source)
	request.Content = writingDocumentContent(*snapshot)
	asset, version, err := s.asset.SaveVersionInTransaction(tx, request)
	if err != nil {
		return err
	}
	snapshot.Asset = *asset
	snapshot.Version = *version
	return nil
}
func (s Service) saveWritingUnit(tx context.Context, snapshot *writingSnapshot, index int, unit WritingUnit, requestID string, runID uint64) error {
	ref := &snapshot.Work.Units[index]
	identity := snapshot.Asset
	identity.ID = ref.AssetID
	identity.Kind = assetmodel.KindText
	identity.CollectionID = snapshot.Asset.ID
	identity.NodeKey = fmt.Sprintf("writing:%d:%s", snapshot.Asset.ID, ref.ID)
	identity.Name = ref.Title
	request := writingAssetRequest(identity, requestID, writingMap(unit))
	request.RunID = runID
	request.ReleaseID = snapshot.Version.ReleaseID
	asset, version, err := s.asset.SaveVersionInTransaction(tx, request)
	if err != nil {
		return err
	}
	ref.AssetID = asset.ID
	ref.VersionID = version.ID
	ref.HasBody = strings.TrimSpace(unit.Body) != ""
	ref.ContinuityValid = unit.ContinuityValid
	ref.DependencyStale = false
	ref.ContinuityIndex = nil
	ref.ContinuityFindings = nil
	ref.ContinuityStatus = "pending"
	if unit.ContinuityValid && unit.Continuity != nil {
		ledger := unit.Continuity
		terms := unit.Synopsis
		for _, fact := range ledger.Facts {
			terms += "\n" + fact.Text
		}
		for _, thread := range ledger.Threads {
			terms += "\n" + thread.Text
		}
		ref.ContinuityIndex = &writingContinuityIndex{VersionID: version.ID, SourceVersionID: ledger.Source.BodyVersionID, BodyHash: ledger.Source.BodyHash, PlanHash: ledger.PlanHash, ChainHash: ledger.ChainHash, Terms: strings.ToLower(terms), Checkpoint: ledger.Checkpoint != nil}
		ref.ContinuityStatus = "ready"
		ref.ContinuityFindings = ledger.Findings
	}
	snapshot.Work.invalidateAfter(index)
	return nil
}

func (s Service) withWritingWrite(ctx context.Context, projectID, canvasID, assetID uint64, write func(context.Context, *writingSnapshot) error) (writingSnapshot, error) {
	release, err := assetservice.AcquireVersionLock(ctx, projectID, fmt.Sprintf("writing:%d:%d", projectID, assetID))
	if err != nil {
		return writingSnapshot{}, err
	}
	defer release()
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return writingSnapshot{}, err
	}
	var snapshot writingSnapshot
	err = orm.Transaction(ctx, func(tx context.Context) error {
		// 首次读取前取得根行锁，避免事务快照把已更新的草稿当成最新内容。
		assetmodel.NewAssetModel().Update(tx, map[string]any{"id": assetID, "project_id": projectID, "canvas_id": canvasID, "user_id": actor.UserID, "status": assetmodel.StatusCurrent}, map[string]any{"status": assetmodel.StatusCurrent})
		var loadErr error
		snapshot, loadErr = s.loadWriting(tx, projectID, canvasID, assetID)
		if loadErr != nil {
			return loadErr
		}
		return write(tx, &snapshot)
	})
	return snapshot, err
}

// Updating the run inside the asset transaction takes its row lock. Cancellation
// cannot pass this fence and then interleave before the unit/version commit.
func fenceWritingRun(ctx context.Context, runID uint64, allowedStatus string) error {
	owner := runExecutionOwner(ctx)
	if owner == "" {
		return fmt.Errorf("生成结果缺少运行租约")
	}
	current := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	if current == nil {
		return fmt.Errorf("运行不存在")
	}
	filters := map[string]any{"id": runID, "status": allowedStatus, "execution_version": current.ExecutionVersion}
	applyRunExecutionFilter(ctx, filters)
	if teammodel.NewRunModel().Update(ctx, filters, map[string]any{"updated_at": time.Now(), "execution_version": current.ExecutionVersion + 1}) != 1 {
		return fmt.Errorf("运行已停止或执行租约已失效")
	}
	return nil
}
func writingCheckpointFor(run teammodel.Run) writingCheckpoint {
	var checkpoint writingCheckpoint
	raw := mapValue(jsonMap(run.Input)[writingRunKey])
	encoded := jsonText(raw)
	_ = json.Unmarshal([]byte(encoded), &checkpoint)
	if checkpoint.UnitIDs == nil {
		checkpoint.UnitIDs = []string{}
	}
	return checkpoint
}
func (s Service) saveWritingCheckpoint(tx context.Context, run teammodel.Run, checkpoint writingCheckpoint) error {
	input := jsonMap(run.Input)
	input[writingRunKey] = writingMap(checkpoint)
	filters := map[string]any{"id": run.ID, "status": teammodel.RunStatusRunning}
	applyRunExecutionFilter(tx, filters)
	if teammodel.NewRunModel().Update(tx, filters, map[string]any{"input": jsonText(input), "child_request_id": checkpoint.RequestID, "updated_at": time.Now()}) != 1 {
		return fmt.Errorf("运行已停止或状态已变化")
	}
	return nil
}
func writingResponse(snapshot writingSnapshot, run *teammodel.Run) map[string]any {
	result := map[string]any{"work_asset_id": snapshot.Asset.ID, "work_version_id": snapshot.Version.ID, "work_revision": writingRevision(snapshot.Version), "work_version": snapshot.Version.Version, "work_updated_at": assetservice.VersionToMap(snapshot.Version)["updated_at"], "document": writingMap(snapshot.Work), "status": snapshot.Work.Status, "run_id": snapshot.Work.ActiveRunID, "request_id": snapshot.Work.ActiveRequestID}
	if run != nil {
		result["run_id"] = run.ID
		result["request_id"] = run.RequestID
		checkpoint := writingCheckpointFor(*run)
		result["checkpoint"] = writingPublicCheckpoint(checkpoint)
		if run.Status == teammodel.RunStatusSuccess && checkpoint.Proposal != nil && checkpoint.WorkVersionID == snapshot.Version.ID && checkpoint.WorkRevision == writingRevision(snapshot.Version) {
			result["proposal"] = writingMap(checkpoint.Proposal)
		}
		result["run_status"] = run.Status
	}
	return result
}
func writingOutput(snapshot writingSnapshot, run teammodel.Run) map[string]any {
	return map[string]any{
		"writing":    writingResponse(snapshot, &run),
		"asset_id":   snapshot.Asset.ID,
		"version_id": snapshot.Version.ID,
		"meta":       map[string]any{"output_type": snapshot.Work.Type, "work_asset_id": snapshot.Asset.ID, "work_version_id": snapshot.Version.ID, "run_id": run.ID},
	}
}
