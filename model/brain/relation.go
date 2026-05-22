package brain

import "github.com/shemic/dever/orm"

var brainRelation = orm.Relation{
	Field:      "brain_id",
	Option:     "bot.brain.NewBrainModel",
	OptionKeys: []string{"name", "key"},
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

var flowNodeAgentRelation = orm.Relation{
	Field:      "agent_id",
	Option:     "bot.agent.NewAgentModel",
	OptionKeys: []string{"name", "key"},
}

var flowFromNodeRelation = orm.Relation{
	Field:      "from_node_id",
	Option:     "bot.brain.NewThinkFlowNodeModel",
	OptionKeys: []string{"name", "node_key", "type"},
}

var flowToNodeRelation = orm.Relation{
	Field:      "to_node_id",
	Option:     "bot.brain.NewThinkFlowNodeModel",
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
	Option:     "bot.brain.NewThinkFlowNodeModel",
	OptionKeys: []string{"name", "node_key", "type"},
}

var createPowerRelation = orm.Relation{
	Field:      "power_id",
	Option:     "bot.energon.NewPowerModel",
	OptionKeys: []string{"name", "key", "kind"},
}

var contentRelation = orm.Relation{
	Field:      "content_id",
	Option:     "bot.brain.NewContentModel",
	OptionKeys: []string{"name", "key", "type"},
}

var currentVersionRelation = orm.Relation{
	Field:      "current_version_id",
	Option:     "bot.brain.NewContentVersionModel",
	OptionKeys: []string{"title", "version", "status"},
}

var versionRelation = orm.Relation{
	Field:      "version_id",
	Option:     "bot.brain.NewContentVersionModel",
	OptionKeys: []string{"title", "version", "status"},
}
