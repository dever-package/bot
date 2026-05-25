package brain

import "github.com/shemic/dever/orm"

var brainRelation = orm.Relation{
	Field:      "brain_id",
	Option:     "bot.brain.NewBrainModel",
	OptionKeys: []string{"name", "key"},
}

var brainCateRelation = orm.Relation{
	Field:      "cate_id",
	Option:     "bot.brain.NewBrainCateModel",
	OptionKeys: []string{"name"},
}

var thinkRelation = orm.Relation{
	Field:      "think_id",
	Option:     "bot.brain.NewThinkModel",
	OptionKeys: []string{"name", "key"},
}

var fromThinkRelation = orm.Relation{
	Field:      "from_think_id",
	Option:     "bot.brain.NewThinkModel",
	OptionKeys: []string{"name", "key"},
}

var toThinkRelation = orm.Relation{
	Field:      "to_think_id",
	Option:     "bot.brain.NewThinkModel",
	OptionKeys: []string{"name", "key"},
}

var nodeAgentRelation = orm.Relation{
	Field:      "agent_id",
	Option:     "bot.agent.NewAgentModel",
	OptionKeys: []string{"name", "key"},
}

var nodePowerRelation = orm.Relation{
	Field:      "power_id",
	Option:     "bot.energon.NewPowerModel",
	OptionKeys: []string{"name", "key", "kind"},
}

var nodeSubBrainRelation = orm.Relation{
	Field:      "sub_brain_id",
	Option:     "bot.brain.NewBrainModel",
	OptionKeys: []string{"name", "key"},
}

var nodeFromRelation = orm.Relation{
	Field:      "from_node_id",
	Option:     "bot.brain.NewThinkNodeModel",
	OptionKeys: []string{"name", "node_key", "type"},
}

var nodeToRelation = orm.Relation{
	Field:      "to_node_id",
	Option:     "bot.brain.NewThinkNodeModel",
	OptionKeys: []string{"name", "node_key", "type"},
}

var runRelation = orm.Relation{
	Field:      "run_id",
	Option:     "bot.brain.NewRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var thinkRunRelation = orm.Relation{
	Field:      "think_run_id",
	Option:     "bot.brain.NewThinkRunModel",
	OptionKeys: []string{"request_id", "think_id", "status"},
}

var nodeRunRelation = orm.Relation{
	Field:      "node_run_id",
	Option:     "bot.brain.NewNodeRunModel",
	OptionKeys: []string{"node_key", "node_type", "status"},
}

var runNodeRelation = orm.Relation{
	Field:      "node_id",
	Option:     "bot.brain.NewThinkNodeModel",
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
