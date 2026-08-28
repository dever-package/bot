package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
)

func (Workspace) PostAssistantSession(c *server.Context) error {
	return (Workbench{}).PostChatSession(c)
}

func (Workspace) PostAssistantSessions(c *server.Context) error {
	return (Workbench{}).PostChatSessions(c)
}

func (Workspace) PostAssistantNewSession(c *server.Context) error {
	return (Workbench{}).PostChatNewSession(c)
}

func (Workspace) PostAssistantRenameSession(c *server.Context) error {
	return (Workbench{}).PostChatRenameSession(c)
}

func (Workspace) PostAssistantArchiveSession(c *server.Context) error {
	return (Workbench{}).PostChatArchiveSession(c)
}

func (Workspace) GetAssistantInputConfig(c *server.Context) error {
	return (Workbench{}).GetChatInputConfig(c)
}

func (Workspace) GetAssistantConfig(c *server.Context) error {
	return (Workbench{}).GetChatConfig(c)
}

func (Workspace) GetAssistantPowerForm(c *server.Context) error {
	scope, err := resolveWorkbenchChatScope(c, nil)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchRunner.PowerForm(
		c.Context(),
		scope.TeamID,
		botapi.QueryUint64(c, "team_power_id", "teamPowerId"),
		botapi.QueryUint64(c, "source_target_id", "sourceTargetId"),
		0,
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostAssistantRun(c *server.Context) error {
	return (Workbench{}).PostChatRun(c)
}

func (Workspace) PostAssistantOpening(c *server.Context) error {
	return (Workbench{}).PostChatOpening(c)
}

func (Workspace) GetAssistantStream(c *server.Context) error {
	return (Workbench{}).GetChatStream(c)
}

func (Workspace) GetAssistantStatus(c *server.Context) error {
	return (Workbench{}).GetChatStatus(c)
}

func (Workspace) PostAssistantStop(c *server.Context) error {
	return (Workbench{}).PostChatStop(c)
}

func (Workspace) PostAssistantReferencePreview(c *server.Context) error {
	return (Workbench{}).PostChatReferencePreview(c)
}

func (Workspace) GetAssistantDocument(c *server.Context) error {
	return (Workbench{}).GetChatDocument(c)
}

func (Workspace) GetAssistantDocumentStream(c *server.Context) error {
	return (Workbench{}).GetChatDocumentStream(c)
}
