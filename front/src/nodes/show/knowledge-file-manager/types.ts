export type KnowledgeFileManagerData = {
  base?: {
    id: number
    name: string
    status: number
    root?: string
    index_status?: string
  }
  files?: KnowledgeFileItem[]
  drive?: {
    used?: number
    total?: number
  }
}

export type KnowledgeFileOperationData = KnowledgeFileManagerData & {
  new_id?: string
  new_ids?: string[]
}

export type KnowledgeFileUploadPartData = KnowledgeFileOperationData & {
  complete?: boolean
  upload_id?: string
  part_number?: number
  total_parts?: number
}

export type KnowledgeFileItem = {
  id: string
  name?: string
  type: "file" | "folder"
  size?: number
  date?: string | Date
  ext?: string
  doc_id?: number
  dir_id?: number
  index_status?: string
}

export type KnowledgeTreeNode = KnowledgeFileItem & {
  parent_id: string
  path: string
  level: number
  children: KnowledgeTreeNode[]
}

export type KnowledgeFileContent = {
  id: string
  name: string
  content: string
  editable: boolean
  mime_type: string
  size: number
  doc_id?: number
  index_status?: string
}

export type KnowledgeFileIndexDetail = {
  id: string
  name: string
  doc_id: number
  dir_id: number
  dir_path: string
  index_status: string
  index_stage?: string
  index_version?: number
  stages?: Record<string, KnowledgeIndexStageResult>
  error_message?: string
  node_count: number
  summary: string
  keywords?: string[]
  nodes?: KnowledgeFileIndexNode[]
  edges?: KnowledgeFileIndexEdge[]
}

export type KnowledgeFileIndexNode = {
  id: number
  sort: number
  node_type?: string
  title?: string
  path?: string
  content_preview: string
  keywords?: string[]
  index_status: string
  error_message?: string
}

export type KnowledgeFileIndexEdge = {
  id: number
  subject: string
  predicate: string
  object: string
  edge_type?: string
  label?: string
  description: string
  evidence: string
  confidence: number
}

export type KnowledgeFileViewerStatus = {
  label: string
}

export type KnowledgeIndexStatus = "pending" | "running" | "success" | "failed" | ""

export type KnowledgeIndexOverview = {
  base: {
    id: number
    name: string
    index_status: string
    error_message?: string
    doc_count: number
    node_count: number
    vector_enabled?: boolean
  }
  docs: KnowledgeIndexStatusCounts
  nodes: KnowledgeIndexStatusCounts
  stages?: KnowledgeIndexStageOverview[]
  dirs: number
  edges: number
  vectors: number
  progress: number
  recent_errors?: KnowledgeIndexError[]
}

export type KnowledgeIndexStageOverview = {
  stage: string
  label: string
  running: number
  failed: number
}

export type KnowledgeIndexStageResult = {
  status: string
  message?: string
}

export type KnowledgeIndexStatusCounts = {
  total: number
  pending: number
  running: number
  success: number
  failed: number
}

export type KnowledgeIndexError = {
  id: number
  title: string
  storage_path: string
  index_status: string
  error_message: string
}

export type KnowledgeNodeSearchResult = {
  nodes: KnowledgeNodeResult[]
}

export type KnowledgeTreeResult = {
  nodes: KnowledgeIndexTreeNode[]
}

export type KnowledgeGraphResult = {
  nodes: KnowledgeNodeResult[]
  edges: KnowledgeGraphEdge[]
}

export type KnowledgeGraphEdge = {
  id: number
  from_node_id: number
  to_node_id: number
  doc_id?: number
  edge_type: string
  label?: string
  summary?: string
  evidence?: string
  weight?: number
  confidence?: number
}

export type KnowledgeNodeOpenResult = {
  node: KnowledgeNodeResult
  parents?: KnowledgeNodeResult[]
  children?: KnowledgeNodeResult[]
  siblings?: KnowledgeNodeResult[]
  related?: KnowledgeNodeResult[]
}

export type KnowledgeRelatedResult = {
  nodes: KnowledgeNodeResult[]
}

export type KnowledgeRetrieveDebugResult = {
  query: string
  knowledge_base: {
    id: number
    name: string
    vector_enabled?: boolean
    graph_depth?: number
  }
  snippets?: KnowledgeRetrieveSnippet[]
  matches?: Array<Record<string, unknown>>
  source_counts?: Record<string, number>
  plans?: Array<Record<string, unknown>>
}

export type KnowledgeRetrieveSnippet = {
  base_id?: number
  base_name?: string
  dir_id?: number
  dir_path?: string
  doc_id?: number
  node_id?: number
  title?: string
  content?: string
  score?: number
  source?: string
}

export type KnowledgeNodeResult = {
  id: number
  knowledge_base_id: number
  dir_id?: number
  dir_path?: string
  doc_id?: number
  parent_id?: number
  node_type: string
  title: string
  path?: string
  summary?: string
  content?: string
  plain_text?: string
  keywords?: string[]
  page_start?: number
  page_end?: number
  line_start?: number
  line_end?: number
  score?: number
  index_status?: string
  index_stage?: string
}

export type KnowledgeIndexTreeNode = KnowledgeNodeResult & {
  children?: KnowledgeIndexTreeNode[]
  children_count?: number
}

export type KnowledgeApiResult<T> = {
  code?: number
  status?: number
  msg?: string
  message?: string
  data: T
}
