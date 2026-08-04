package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	assetservice "github.com/dever-package/bot/service/asset"
	bodyservice "github.com/dever-package/bot/service/body"
	teamservice "github.com/dever-package/bot/service/team"

	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
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
}

type SaveAssetRequest struct {
	AssetCateID  uint64
	CollectionID uint64
	FlowID       uint64
	RunID        uint64
	NodeRunID    uint64
	ReleaseID    uint64
	RequestID    string
	NodeKey      string
	Source       map[string]any
	Name         string
	Kind         string
	Role         string
	Content      any
	Sort         int
}

type UpdateAssetVersionRequest struct {
	AssetID   uint64
	VersionID uint64
	Content   any
}

type RestoreAssetVersionRequest struct {
	AssetID   uint64
	VersionID uint64
	RequestID string
	NodeKey   string
}

func NewService() Service {
	return Service{
		asset: assetservice.NewService(),
		body:  bodyservice.NewService(),
		team:  teamservice.NewService(),
	}
}

func (s Service) List(ctx context.Context, req ListRequest) (map[string]any, error) {
	return s.listByStatus(ctx, req, projectmodel.StatusEnabled, "main.id desc")
}

func (s Service) Create(ctx context.Context, req CreateRequest) (map[string]any, error) {
	userID, err := currentUserID(ctx)
	if err != nil {
		return nil, err
	}
	name, err := normalizeProjectName(req.Name)
	if err != nil {
		return nil, err
	}
	description := normalizeProjectDescription(req.Description)
	binding, err := s.team.ResolveProjectRelease(ctx, req.TeamID)
	if err != nil {
		return nil, err
	}

	var projectID uint64
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		now := time.Now()
		projectID = uint64(projectmodel.NewProjectModel().Insert(tx, map[string]any{
			"user_id":     userID,
			"team_id":     binding.TeamID,
			"release_id":  binding.ReleaseID,
			"name":        name,
			"description": description,
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
	return s.detailPayload(ctx, project)
}

func (s Service) detailPayload(ctx context.Context, project *projectmodel.Project) (map[string]any, error) {
	var teamDetail map[string]any
	var err error
	if project.TeamID > 0 {
		teamDetail, err = s.team.TeamDetail(ctx, project.TeamID, project.ReleaseID)
		if err != nil {
			return nil, err
		}
	} else {
		teamDetail = map[string]any{}
	}
	return map[string]any{
		"project": newPayloadBuilder(ctx).Project(*project),
		"team":    teamDetail,
	}, nil
}

func (s Service) TeamList(ctx context.Context) (map[string]any, error) {
	return s.team.TeamList(ctx)
}

func (s Service) Assets(
	ctx context.Context,
	projectID uint64,
	flowID uint64,
	kind string,
	page int,
	pageSize int,
) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.asset.ListProject(ctx, projectID, flowID, kind, page, pageSize)
}

func (s Service) AssetDetail(ctx context.Context, projectID uint64, assetID uint64, currentOnly bool) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	if currentOnly {
		asset := s.asset.FindProjectAsset(ctx, projectID, assetID)
		if asset == nil {
			return nil, fmt.Errorf("资产不存在")
		}
		return map[string]any{
			"asset": s.asset.AssetDetailMap(ctx, *asset, nil),
		}, nil
	}
	return s.asset.ProjectDetail(ctx, projectID, assetID)
}

func (s Service) AssetVersions(ctx context.Context, projectID uint64, assetID uint64, page int, pageSize int) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.asset.ProjectVersionPage(ctx, projectID, assetID, assetservice.VersionPageRequest{
		Page:     page,
		PageSize: pageSize,
	})
}

func (s Service) AssetVersionDetail(ctx context.Context, projectID uint64, assetID uint64, versionID uint64) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.asset.ProjectVersionDetail(ctx, projectID, assetID, versionID)
}

func (s Service) SaveAsset(ctx context.Context, projectID uint64, req SaveAssetRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, project.ID, []string{
		"save",
		req.RequestID,
		req.NodeKey,
		req.Name,
		req.Role,
		fmt.Sprintf("%d", req.AssetCateID),
	}, func() (map[string]any, error) {
		if result, handled, err := s.saveImportedStoryboardGrid(
			ctx,
			project.ID,
			project.BodyID,
			project.TeamID,
			project.ReleaseID,
			req,
		); handled {
			return result, err
		}
		asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
			ProjectID:    project.ID,
			BodyID:       project.BodyID,
			TeamID:       project.TeamID,
			FlowID:       req.FlowID,
			AssetCateID:  req.AssetCateID,
			CollectionID: req.CollectionID,
			RunID:        req.RunID,
			NodeRunID:    req.NodeRunID,
			ReleaseID:    firstUint64(req.ReleaseID, project.ReleaseID),
			RequestID:    req.RequestID,
			NodeKey:      req.NodeKey,
			Source:       req.Source,
			Name:         req.Name,
			Kind:         req.Kind,
			Role:         req.Role,
			Content:      req.Content,
			Sort:         req.Sort,
		})
		if err != nil {
			return nil, err
		}
		return map[string]any{
			"asset": s.asset.AssetDetailMap(ctx, *asset, version),
		}, nil
	})
}

func (s Service) UpdateAssetVersion(ctx context.Context, projectID uint64, req UpdateAssetVersionRequest) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, projectID, []string{"update", fmt.Sprintf("%d", req.AssetID), fmt.Sprintf("%d", req.VersionID)}, func() (map[string]any, error) {
		content, err := s.editableAssetVersionContent(ctx, projectID, req)
		if err != nil {
			return nil, err
		}
		asset, version, err := s.asset.UpdateVersionContent(ctx, projectID, req.AssetID, req.VersionID, content)
		if err != nil {
			return nil, err
		}
		return map[string]any{
			"asset": s.asset.AssetDetailMap(ctx, *asset, version),
		}, nil
	})
}

func (s Service) RestoreAssetVersion(ctx context.Context, projectID uint64, req RestoreAssetVersionRequest) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, projectID, []string{
		"restore",
		fmt.Sprintf("%d", req.AssetID),
		fmt.Sprintf("%d", req.VersionID),
		req.RequestID,
	}, func() (map[string]any, error) {
		asset, version, err := s.asset.RestoreProjectVersion(ctx, assetservice.RestoreVersionRequest{
			ProjectID: projectID,
			AssetID:   req.AssetID,
			VersionID: req.VersionID,
			RequestID: req.RequestID,
			NodeKey:   req.NodeKey,
		})
		if err != nil {
			return nil, err
		}
		return map[string]any{
			"asset": s.asset.AssetDetailMap(ctx, *asset, version),
		}, nil
	})
}

func (s Service) CanvasConfig(ctx context.Context, projectID uint64, flowID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.currentTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	return s.team.CanvasConfig(ctx, project.ReleaseID, flowID)
}

func (s Service) CanvasPowerForm(ctx context.Context, projectID uint64, flowID uint64, powerID uint64, powerKey string, targetID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.currentTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	return s.team.CanvasPowerForm(ctx, project.ReleaseID, flowID, powerID, powerKey, targetID)
}

func (s Service) SyncTeamRelease(ctx context.Context, project *projectmodel.Project) (*projectmodel.Project, error) {
	next, err := s.currentTeamRelease(ctx, project)
	if err != nil || next == nil || project == nil || next.ReleaseID == project.ReleaseID {
		return next, err
	}
	next.UpdatedAt = time.Now()
	projectmodel.NewProjectModel().Update(ctx, map[string]any{"id": project.ID}, map[string]any{
		"release_id": next.ReleaseID,
		"updated_at": next.UpdatedAt,
	})
	return next, nil
}

func (s Service) currentTeamRelease(ctx context.Context, project *projectmodel.Project) (*projectmodel.Project, error) {
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
	next := *project
	next.ReleaseID = release.ID
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
