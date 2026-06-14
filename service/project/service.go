package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	assetservice "my/package/bot/service/asset"
	bodyservice "my/package/bot/service/body"
	teamservice "my/package/bot/service/team"

	projectmodel "my/package/bot/model/project"
	teammodel "my/package/bot/model/team"
)

type Service struct {
	asset assetservice.Service
	body  bodyservice.Service
	team  teamservice.Service
}

type CreateRequest struct {
	Name        string
	Description string
	Cover       string
	TeamID      uint64
	ReleaseID   uint64
}

type SaveAssetRequest struct {
	AssetCateID uint64
	FlowID      uint64
	RunID       uint64
	NodeRunID   uint64
	ReleaseID   uint64
	RequestID   string
	NodeKey     string
	Source      map[string]any
	Name        string
	Kind        string
	Role        string
	Content     any
}

type UpdateAssetVersionRequest struct {
	AssetID   uint64
	VersionID uint64
	Content   any
}

func NewService() Service {
	return Service{
		asset: assetservice.NewService(),
		body:  bodyservice.NewService(),
		team:  teamservice.NewService(),
	}
}

func (s Service) List(ctx context.Context) (map[string]any, error) {
	userID, err := currentUserID(ctx)
	if err != nil {
		return nil, err
	}
	rows := projectmodel.NewProjectModel().Select(ctx, map[string]any{
		"user_id": userID,
		"status":  projectmodel.StatusEnabled,
	})
	builder := newPayloadBuilder(ctx)
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			items = append(items, builder.Project(*row))
		}
	}
	return map[string]any{"items": items}, nil
}

func (s Service) Create(ctx context.Context, req CreateRequest) (map[string]any, error) {
	userID, err := currentUserID(ctx)
	if err != nil {
		return nil, err
	}
	name := strings.TrimSpace(req.Name)
	if name == "" {
		return nil, fmt.Errorf("项目名称不能为空")
	}
	team, release, err := resolvePublishedTeamRelease(ctx, req.TeamID, req.ReleaseID)
	if err != nil {
		return nil, err
	}

	var projectID uint64
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		now := time.Now()
		projectID = uint64(projectmodel.NewProjectModel().Insert(tx, map[string]any{
			"user_id":     userID,
			"team_id":     team.ID,
			"release_id":  release.ID,
			"name":        name,
			"description": strings.TrimSpace(req.Description),
			"cover":       strings.TrimSpace(req.Cover),
			"status":      projectmodel.StatusEnabled,
			"created_at":  now,
			"updated_at":  now,
		}))
		if projectID == 0 {
			return fmt.Errorf("创建项目失败")
		}
		bodyID, err := s.body.CreateCanvasBody(tx, projectID, name)
		if err != nil {
			return err
		}
		if bodyID == 0 {
			return fmt.Errorf("创建项目载体失败")
		}
		projectmodel.NewProjectModel().Update(tx, map[string]any{"id": projectID}, map[string]any{
			"body_id":    bodyID,
			"updated_at": time.Now(),
		})
		return nil
	}); err != nil {
		return nil, err
	}
	return s.Detail(ctx, projectID)
}

func (s Service) Detail(ctx context.Context, projectID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	var teamDetail map[string]any
	if project.TeamID > 0 {
		teamDetail, err = s.team.TeamDetail(ctx, project.TeamID, project.ReleaseID)
		if err != nil {
			return nil, err
		}
	} else {
		teamDetail = map[string]any{}
	}
	assets, _ := s.asset.ListProject(ctx, project.ID, 0, "")
	return map[string]any{
		"project": newPayloadBuilder(ctx).Project(*project),
		"team":    teamDetail,
		"assets":  assets,
	}, nil
}

func (s Service) Delete(ctx context.Context, projectID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	projectmodel.NewProjectModel().Update(ctx, map[string]any{"id": project.ID}, map[string]any{
		"status":     projectmodel.StatusDisabled,
		"updated_at": time.Now(),
	})
	return map[string]any{"id": project.ID}, nil
}

func (s Service) TeamList(ctx context.Context) (map[string]any, error) {
	return s.team.TeamList(ctx)
}

func (s Service) Assets(ctx context.Context, projectID uint64, flowID uint64, kind string) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.asset.ListProject(ctx, projectID, flowID, kind)
}

func (s Service) AssetDetail(ctx context.Context, projectID uint64, assetID uint64) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.asset.ProjectDetail(ctx, projectID, assetID)
}

func (s Service) SaveAsset(ctx context.Context, projectID uint64, req SaveAssetRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID:   project.ID,
		BodyID:      project.BodyID,
		TeamID:      project.TeamID,
		FlowID:      req.FlowID,
		AssetCateID: req.AssetCateID,
		RunID:       req.RunID,
		NodeRunID:   req.NodeRunID,
		ReleaseID:   firstUint64(req.ReleaseID, project.ReleaseID),
		RequestID:   req.RequestID,
		NodeKey:     req.NodeKey,
		Source:      req.Source,
		Name:        req.Name,
		Kind:        req.Kind,
		Role:        req.Role,
		Content:     req.Content,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"asset": s.asset.AssetDetailMap(ctx, *asset, version),
	}, nil
}

func (s Service) UpdateAssetVersion(ctx context.Context, projectID uint64, req UpdateAssetVersionRequest) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	asset, version, err := s.asset.UpdateVersionContent(ctx, projectID, req.AssetID, req.VersionID, req.Content)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"asset": s.asset.AssetDetailMap(ctx, *asset, version),
	}, nil
}

func (s Service) UseAssetVersion(ctx context.Context, projectID uint64, assetID uint64, versionID uint64) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	asset, version, err := s.asset.UseVersion(ctx, projectID, assetID, versionID)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"asset": s.asset.AssetDetailMap(ctx, *asset, version),
	}, nil
}

func (s Service) CanvasConfig(ctx context.Context, projectID uint64, flowID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	config, err := s.team.CanvasConfig(ctx, project.ReleaseID, flowID)
	if err != nil {
		return nil, err
	}
	applyBodyLimits(ctx, s.body, project.BodyID, config)
	return config, nil
}

func (s Service) CanvasPowerForm(ctx context.Context, projectID uint64, flowID uint64, powerID uint64, powerKey string, targetID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	if err := requireBodyPower(ctx, s.body, project.BodyID, powerID); err != nil {
		return nil, err
	}
	return s.team.CanvasPowerForm(ctx, project.ReleaseID, flowID, powerID, powerKey, targetID)
}

func (s Service) SyncTeamRelease(ctx context.Context, project *projectmodel.Project) (*projectmodel.Project, error) {
	if project == nil || project.TeamID == 0 {
		return project, nil
	}
	team := teammodel.NewTeamModel().Find(ctx, map[string]any{
		"id":     project.TeamID,
		"status": teammodel.StatusEnabled,
	})
	if team == nil {
		return nil, fmt.Errorf("团队不存在")
	}
	release := teammodel.NewTeamReleaseModel().Find(ctx, map[string]any{"id": team.CurrentReleaseID})
	if release == nil || release.TeamID != team.ID {
		return nil, fmt.Errorf("团队尚未发布")
	}
	if project.ReleaseID == release.ID {
		return project, nil
	}
	projectmodel.NewProjectModel().Update(ctx, map[string]any{"id": project.ID}, map[string]any{
		"release_id": release.ID,
		"updated_at": time.Now(),
	})
	next := *project
	next.ReleaseID = release.ID
	next.UpdatedAt = time.Now()
	return &next, nil
}

func resolvePublishedTeamRelease(ctx context.Context, teamID uint64, releaseID uint64) (teammodel.Team, teammodel.TeamRelease, error) {
	if teamID == 0 && releaseID == 0 {
		return teammodel.Team{}, teammodel.TeamRelease{}, nil
	}

	var release *teammodel.TeamRelease
	if releaseID > 0 {
		release = teammodel.NewTeamReleaseModel().Find(ctx, map[string]any{"id": releaseID})
		if release == nil {
			return teammodel.Team{}, teammodel.TeamRelease{}, fmt.Errorf("团队版本不存在")
		}
		teamID = release.TeamID
	}
	if teamID == 0 {
		return teammodel.Team{}, teammodel.TeamRelease{}, fmt.Errorf("团队不能为空")
	}

	team := teammodel.NewTeamModel().Find(ctx, map[string]any{
		"id":     teamID,
		"status": teammodel.StatusEnabled,
	})
	if team == nil {
		return teammodel.Team{}, teammodel.TeamRelease{}, fmt.Errorf("团队不存在")
	}
	if release == nil {
		release = teammodel.NewTeamReleaseModel().Find(ctx, map[string]any{"id": team.CurrentReleaseID})
	}
	if release == nil || release.TeamID != team.ID {
		return teammodel.Team{}, teammodel.TeamRelease{}, fmt.Errorf("团队尚未发布")
	}
	return *team, *release, nil
}

func firstUint64(values ...uint64) uint64 {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}
