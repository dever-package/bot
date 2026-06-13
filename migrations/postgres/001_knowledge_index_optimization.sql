-- Knowledge index optimization for the current zufang PostgreSQL schema.
-- The local Dever table prefix is `zf_`; adjust table names if this package is reused in another app.
-- If the database is large, run the index statements during a maintenance window.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE zf_bot_knowledge_vector
	ADD COLUMN IF NOT EXISTS index_version INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_zf_bot_knowledge_node_search_text_trgm
	ON zf_bot_knowledge_node USING GIN (search_text gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_zf_bot_knowledge_node_keywords_trgm
	ON zf_bot_knowledge_node USING GIN (keywords gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_zf_bot_knowledge_edge_label_trgm
	ON zf_bot_knowledge_edge USING GIN (label gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_zf_bot_knowledge_edge_summary_trgm
	ON zf_bot_knowledge_edge USING GIN (summary gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_zf_bot_knowledge_edge_evidence_trgm
	ON zf_bot_knowledge_edge USING GIN (evidence gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_zf_bot_knowledge_vector_base_version_status
	ON zf_bot_knowledge_vector (knowledge_base_id, index_version, status, id);

CREATE INDEX IF NOT EXISTS idx_zf_bot_knowledge_vector_doc_version_status
	ON zf_bot_knowledge_vector (doc_id, index_version, status, id);
