package project

import (
	"context"
	"strings"

	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
)

type payloadBuilder struct {
	ctx      context.Context
	teams    map[uint64]*teammodel.Team
	releases map[uint64]*teammodel.TeamRelease
}

func newPayloadBuilder(ctx context.Context) payloadBuilder {
	return payloadBuilder{
		ctx:      ctx,
		teams:    map[uint64]*teammodel.Team{},
		releases: map[uint64]*teammodel.TeamRelease{},
	}
}

func (b payloadBuilder) Project(project projectmodel.Project) map[string]any {
	return map[string]any{
		"id":          project.ID,
		"user_id":     project.UserID,
		"body_id":     project.BodyID,
		"team_id":     project.TeamID,
		"release_id":  project.ReleaseID,
		"name":        project.Name,
		"description": strings.TrimSpace(project.Description),
		"cover":       strings.TrimSpace(project.Cover),
		"mode":        projectMode(project),
		"status":      project.Status,
		"team":        b.Team(project.TeamID, project.ReleaseID),
		"created_at":  project.CreatedAt,
		"updated_at":  project.UpdatedAt,
	}
}

func (b payloadBuilder) Team(teamID uint64, releaseID uint64) map[string]any {
	if teamID == 0 {
		return map[string]any{}
	}
	team := b.findTeam(teamID)
	if team == nil {
		return map[string]any{}
	}
	payload := map[string]any{
		"id":          team.ID,
		"name":        team.Name,
		"description": strings.TrimSpace(team.Description),
		"release_id":  releaseID,
	}
	if releaseID > 0 {
		if release := b.findRelease(releaseID); release != nil {
			payload["version"] = release.Version
			payload["release_status"] = release.Status
		}
	}
	return payload
}

func (b payloadBuilder) findTeam(teamID uint64) *teammodel.Team {
	if teamID == 0 {
		return nil
	}
	if team, ok := b.teams[teamID]; ok {
		return team
	}
	team := teammodel.NewTeamModel().Find(b.ctx, map[string]any{"id": teamID})
	b.teams[teamID] = team
	return team
}

func (b payloadBuilder) findRelease(releaseID uint64) *teammodel.TeamRelease {
	if releaseID == 0 {
		return nil
	}
	if release, ok := b.releases[releaseID]; ok {
		return release
	}
	release := teammodel.NewTeamReleaseModel().Find(b.ctx, map[string]any{"id": releaseID})
	b.releases[releaseID] = release
	return release
}

func projectMode(project projectmodel.Project) string {
	if project.TeamID > 0 && project.ReleaseID > 0 {
		return "team"
	}
	return "canvas"
}
