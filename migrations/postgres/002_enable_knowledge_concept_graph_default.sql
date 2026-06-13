-- Enable concept graph by default for knowledge bases.

ALTER TABLE zf_bot_knowledge_base
	ALTER COLUMN concept_graph_enabled SET DEFAULT 1;

UPDATE zf_bot_knowledge_base
SET concept_graph_enabled = 1
WHERE concept_graph_enabled = 2;
