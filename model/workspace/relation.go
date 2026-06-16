package workspace

import "github.com/shemic/dever/orm"

var projectRelation = orm.Relation{
	Field:      "project_id",
	Option:     "bot.project.NewProjectModel",
	OptionKeys: []string{"name", "status"},
}

var agentRelation = orm.Relation{
	Field:      "agent_id",
	Option:     "bot.agent.NewAgentModel",
	OptionKeys: []string{"name", "key", "status"},
}

var teamRelation = orm.Relation{
	Field:      "team_id",
	Option:     "bot.team.NewTeamModel",
	OptionKeys: []string{"name", "key", "status"},
}

var releaseRelation = orm.Relation{
	Field:      "release_id",
	Option:     "bot.team.NewTeamReleaseModel",
	OptionKeys: []string{"version", "status"},
}

var executionRelation = orm.Relation{
	Field:      "execution_id",
	Option:     "bot.workspace.NewExecutionModel",
	OptionKeys: []string{"request_id", "status"},
}

var runRelation = orm.Relation{
	Field:      "run_id",
	Option:     "bot.team.NewRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var flowRunRelation = orm.Relation{
	Field:      "flow_run_id",
	Option:     "bot.team.NewFlowRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var nodeRunRelation = orm.Relation{
	Field:      "node_run_id",
	Option:     "bot.team.NewNodeRunModel",
	OptionKeys: []string{"node_key", "status"},
}
