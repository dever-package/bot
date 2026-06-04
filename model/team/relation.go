package team

import "github.com/shemic/dever/orm"

var teamRelation = orm.Relation{
	Field:      "team_id",
	Option:     "bot.team.NewTeamModel",
	OptionKeys: []string{"name"},
}

var teamCateRelation = orm.Relation{
	Field:      "cate_id",
	Option:     "bot.team.NewTeamCateModel",
	OptionKeys: []string{"name"},
}

var assetCateRelation = orm.Relation{
	Field:      "asset_cate_id",
	Option:     "bot.team.NewAssetCateModel",
	OptionKeys: []string{"name", "kind", "cardinality"},
}

var teamAssetCateRelation = orm.Relation{
	Field:      "asset_cates",
	Through:    "bot.team.NewAssetCateModel",
	OwnerField: "team_id",
	Order:      "sort asc, id asc",
}

var teamPowerRelation = orm.Relation{
	Field:      "team_powers",
	Through:    "bot.team.NewTeamPowerModel",
	OwnerField: "team_id",
	Order:      "sort asc, id asc",
}

var flowRelation = orm.Relation{
	Field:      "flow_id",
	Option:     "bot.team.NewFlowModel",
	OptionKeys: []string{"name", "key"},
}

var fromFlowRelation = orm.Relation{
	Field:      "from_flow_id",
	Option:     "bot.team.NewFlowModel",
	OptionKeys: []string{"name", "key"},
}

var toFlowRelation = orm.Relation{
	Field:      "to_flow_id",
	Option:     "bot.team.NewFlowModel",
	OptionKeys: []string{"name", "key"},
}

var nodeAgentRelation = orm.Relation{
	Field:      "agent_id",
	Option:     "bot.agent.NewAgentModel",
	OptionKeys: []string{"name"},
}

var roleAgentRelation = orm.Relation{
	Field:      "agent_id",
	Option:     "bot.agent.NewAgentModel",
	OptionKeys: []string{"name"},
}

var powerRelation = orm.Relation{
	Field:      "power_id",
	Option:     "bot.energon.NewPowerModel",
	OptionKeys: []string{"name", "key", "kind"},
}

var nodeRoleRelation = orm.Relation{
	Field:      "role_id",
	Option:     "bot.team.NewRoleModel",
	OptionKeys: []string{"name", "role_key", "role_type"},
}

var nodePowerRelation = powerRelation

var nodeSubTeamRelation = orm.Relation{
	Field:      "sub_team_id",
	Option:     "bot.team.NewTeamModel",
	OptionKeys: []string{"name"},
}

var nodeFromRelation = orm.Relation{
	Field:      "from_node_id",
	Option:     "bot.team.NewFlowNodeModel",
	OptionKeys: []string{"name", "node_key", "type"},
}

var nodeToRelation = orm.Relation{
	Field:      "to_node_id",
	Option:     "bot.team.NewFlowNodeModel",
	OptionKeys: []string{"name", "node_key", "type"},
}

var runRelation = orm.Relation{
	Field:      "run_id",
	Option:     "bot.team.NewRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var flowRunRelation = orm.Relation{
	Field:      "flow_run_id",
	Option:     "bot.team.NewFlowRunModel",
	OptionKeys: []string{"request_id", "flow_id", "status"},
}

var nodeRunRelation = orm.Relation{
	Field:      "node_run_id",
	Option:     "bot.team.NewNodeRunModel",
	OptionKeys: []string{"node_key", "node_type", "status"},
}

var runNodeRelation = orm.Relation{
	Field:      "node_id",
	Option:     "bot.team.NewFlowNodeModel",
	OptionKeys: []string{"name", "node_key", "type"},
}

var assetRelation = orm.Relation{
	Field:      "asset_id",
	Option:     "bot.asset.NewAssetModel",
	OptionKeys: []string{"name", "kind", "status"},
}

var versionRelation = orm.Relation{
	Field:      "version_id",
	Option:     "bot.asset.NewVersionModel",
	OptionKeys: []string{"version", "created_at"},
}
