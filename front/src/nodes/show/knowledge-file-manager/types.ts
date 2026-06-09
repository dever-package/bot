export type KnowledgeFileManagerData = {
  base?: {
    id: number
    name: string
    status: number
    root?: string
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

export type KnowledgeApiResult<T> = {
  code?: number
  status?: number
  msg?: string
  message?: string
  data: T
}
