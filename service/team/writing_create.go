package team

import (
	"context"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	assetservice "github.com/dever-package/bot/service/asset"
	userservice "github.com/dever-package/user/service"
	"github.com/google/uuid"
	"github.com/shemic/dever/orm"
)

func (s Service) createManualWriting(ctx context.Context, command WritingCommand) (map[string]any, error) {
	if command.ProjectID == 0 || command.CanvasID == 0 || strings.TrimSpace(command.NodeKey) == "" || len(command.NodeKey) > 128 || strings.TrimSpace(command.Title) == "" {
		return nil, fmt.Errorf("请选择故事节点并填写作品名称")
	}
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return nil, err
	}
	project := projectmodel.NewProjectModel().Find(ctx, map[string]any{"id": command.ProjectID, "user_id": actor.UserID, "status": projectmodel.StatusEnabled})
	if project == nil {
		return nil, fmt.Errorf("作品不存在")
	}
	if projectmodel.NewCanvasModel().Find(ctx, map[string]any{"id": command.CanvasID, "project_id": project.ID, "status": projectmodel.StatusEnabled}) == nil {
		return nil, fmt.Errorf("画布不存在")
	}
	release, err := assetservice.AcquireVersionLock(ctx, project.ID, fmt.Sprintf("writing:new:%d:%d:%s", project.ID, command.CanvasID, command.NodeKey))
	if err != nil {
		return nil, err
	}
	defer release()
	var snapshot writingSnapshot
	err = orm.Transaction(ctx, func(tx context.Context) error {
		if assetmodel.NewAssetModel().Find(tx, map[string]any{"project_id": project.ID, "canvas_id": command.CanvasID, "node_key": command.NodeKey, "status": assetmodel.StatusCurrent}) != nil {
			return fmt.Errorf("该节点已有作品，请打开已有内容")
		}
		work := newWritingDocument("story", strings.TrimSpace(command.Title))
		work.Status = "ready"
		chapterID := uuid.NewString()
		work.Units = []WritingUnitEntry{{ID: chapterID, UnitType: "chapter", Title: "第一章", Children: []WritingUnitEntry{}}}
		asset, version, err := s.asset.SaveVersionInTransaction(tx, assetservice.SaveVersionRequest{WritingWrite: true, UserID: project.UserID, ProjectID: project.ID, CanvasID: command.CanvasID, BodyID: project.BodyID, TeamID: project.TeamID, NodeKey: command.NodeKey, RequestID: uuid.NewString(), SourceType: assetmodel.SourceProject, SourceID: project.ID, Name: work.Title, Kind: assetmodel.KindCollection, Role: assetmodel.RoleMaterial, Content: map[string]any{"json": writingMap(work)}})
		if err != nil {
			return err
		}
		snapshot = writingSnapshot{Asset: *asset, Version: *version, Work: work}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return writingResponse(snapshot, nil), nil
}
