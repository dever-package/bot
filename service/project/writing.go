package project

import (
	"context"

	teamservice "github.com/dever-package/bot/service/team"
)

func (s Service) WritingCommand(ctx context.Context, command teamservice.WritingCommand) (map[string]any, error) {
	project, err := requireProject(ctx, command.ProjectID)
	if err != nil {
		return nil, err
	}
	if _, err = requireProjectCanvas(ctx, project.ID, command.CanvasID, 0); err != nil {
		return nil, err
	}
	return s.team.WritingCommand(ctx, command)
}

func (s Service) WritingRuns(ctx context.Context, projectID, canvasID, workID, beforeID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	if _, err = requireProjectCanvas(ctx, project.ID, canvasID, 0); err != nil {
		return nil, err
	}
	return s.team.WritingRuns(ctx, projectID, canvasID, workID, beforeID)
}
