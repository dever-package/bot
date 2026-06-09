import { request } from "@/lib/request"
import type {
  KnowledgeApiResult,
  KnowledgeFileContent,
  KnowledgeFileManagerData,
  KnowledgeFileOperationData,
} from "./types"

type RequestMethod = "get" | "post"

async function knowledgeRequest<T>(
  path: string,
  method: RequestMethod,
  payload: Record<string, unknown>,
): Promise<T> {
  const result = (await request(path, method, payload)) as KnowledgeApiResult<T> | T
  if (!isKnowledgeApiResult(result)) {
    return result
  }
  if (typeof result.code === "number" && result.code !== 0) {
    throw new Error(result.msg || result.message || "请求失败")
  }
  if (typeof result.status === "number" && result.status !== 1) {
    throw new Error(result.msg || result.message || "请求失败")
  }
  return result.data
}

function isKnowledgeApiResult<T>(result: KnowledgeApiResult<T> | T): result is KnowledgeApiResult<T> {
  return (
    typeof result === "object" &&
    result !== null &&
    ("data" in result || "code" in result || "status" in result || "msg" in result || "message" in result)
  )
}

export function loadFileManagerData(params: {
  knowledgeBaseID: number
}) {
  return knowledgeRequest<KnowledgeFileManagerData>(
    "/bot/knowledge/file_manager_data",
    "get",
    {
      knowledge_base_id: params.knowledgeBaseID,
    },
  )
}

export function loadFileContent(params: { knowledgeBaseID: number; id: string }) {
  return knowledgeRequest<KnowledgeFileContent>(
    "/bot/knowledge/file_content",
    "get",
    {
      knowledge_base_id: params.knowledgeBaseID,
      id: params.id,
    },
  )
}

export function createFile(params: {
  knowledgeBaseID: number
  parent: string
  name: string
  type: "file" | "folder"
  contentBase64?: string
}) {
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/knowledge/create_file", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    parent: params.parent,
    parent_id: params.parent,
    name: params.name,
    type: params.type,
    content_base64: params.contentBase64 || "",
  })
}

export function renameFile(params: {
  knowledgeBaseID: number
  id: string
  name: string
}) {
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/knowledge/rename_file", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    id: params.id,
    name: params.name,
  })
}

export function saveFile(params: {
  knowledgeBaseID: number
  id: string
  content: string
}) {
  return knowledgeRequest<KnowledgeFileContent>("/bot/knowledge/save_file", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    id: params.id,
    content: params.content,
  })
}

export function deleteFiles(params: { knowledgeBaseID: number; ids: string[] }) {
  return knowledgeRequest<KnowledgeFileManagerData>("/bot/knowledge/delete_files", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    ids: params.ids,
  })
}

export function moveFiles(params: {
  knowledgeBaseID: number
  ids: string[]
  target: string
}) {
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/knowledge/move_files", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    ids: params.ids,
    target: params.target,
    operation: "move",
  })
}

export function copyFiles(params: {
  knowledgeBaseID: number
  ids: string[]
  target: string
}) {
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/knowledge/copy_files", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    ids: params.ids,
    target: params.target,
    operation: "copy",
  })
}

export function downloadFileURL(knowledgeBaseID: number, id: string) {
  const params = new URLSearchParams({
    knowledge_base_id: String(knowledgeBaseID),
    id,
  })
  return `/bot/knowledge/download_file?${params.toString()}`
}
