import { request } from "@/lib/request"
import type {
  KnowledgeApiResult,
  KnowledgeFileContent,
  KnowledgeFileIndexDetail,
  KnowledgeFileManagerData,
  KnowledgeFileOperationData,
  KnowledgeFileUploadPartData,
  KnowledgeGraphResult,
  KnowledgeIndexOverview,
  KnowledgeNodeOpenResult,
  KnowledgeRelatedResult,
  KnowledgeRetrieveDebugResult,
  KnowledgeTreeResult,
} from "./types"

type RequestMethod = "get" | "post"

type UploadFilePartParams = {
  knowledgeBaseID: number
  parent: string
  name: string
  uploadID: string
  partNumber: number
  totalParts: number
  chunk: Blob
}

async function knowledgeRequest<T>(
  path: string,
  method: RequestMethod,
  payload: Record<string, unknown>,
): Promise<T> {
  const result = (await request(path, method, payload)) as KnowledgeApiResult<T> | T
  if (!isKnowledgeApiResult(result)) {
    return result
  }
  return unwrapKnowledgeResult(result)
}

function unwrapKnowledgeResult<T>(result: KnowledgeApiResult<T>) {
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
    "/bot/admin/knowledge/file_manager_data",
    "get",
    {
      knowledge_base_id: params.knowledgeBaseID,
    },
  )
}

export function loadFileContent(params: { knowledgeBaseID: number; id: string }) {
  return knowledgeRequest<KnowledgeFileContent>(
    "/bot/admin/knowledge/file_content",
    "get",
    {
      knowledge_base_id: params.knowledgeBaseID,
      id: params.id,
    },
  )
}

export function loadFileIndexDetail(params: { knowledgeBaseID: number; id: string }) {
  return knowledgeRequest<KnowledgeFileIndexDetail>(
    "/bot/admin/knowledge/file_index_detail",
    "get",
    {
      knowledge_base_id: params.knowledgeBaseID,
      id: params.id,
    },
  )
}

export function loadIndexOverview(params: { knowledgeBaseID: number }) {
  return knowledgeRequest<KnowledgeIndexOverview>(
    "/bot/admin/knowledge/index_overview",
    "get",
    {
      knowledge_base_id: params.knowledgeBaseID,
    },
  )
}

export function loadKnowledgeIndexTree(params: {
  knowledgeBaseID: number
  parentID?: number
  depth?: number
  limit?: number
}) {
  return knowledgeRequest<KnowledgeTreeResult>("/bot/admin/knowledge/tree", "get", {
    knowledge_base_id: params.knowledgeBaseID,
    parent_id: params.parentID || 0,
    depth: params.depth || 4,
    limit: params.limit || 120,
  })
}

export function loadKnowledgeGraph(params: {
  knowledgeBaseID: number
  limit?: number
}) {
  return knowledgeRequest<KnowledgeGraphResult>("/bot/admin/knowledge/graph", "get", {
    knowledge_base_id: params.knowledgeBaseID,
    limit: params.limit || 180,
  })
}

export function openKnowledgeNode(params: { nodeID: number }) {
  return knowledgeRequest<KnowledgeNodeOpenResult>("/bot/admin/knowledge/node_open", "get", {
    node_id: params.nodeID,
  })
}

export function loadRelatedKnowledgeNodes(params: { nodeID: number; limit?: number }) {
  return knowledgeRequest<KnowledgeRelatedResult>("/bot/admin/knowledge/node_related", "get", {
    node_id: params.nodeID,
    limit: params.limit || 12,
  })
}

export function loadKnowledgeRetrieveDebug(params: {
  knowledgeBaseID: number
  agentID?: number
  query: string
  limit?: number
}) {
  return knowledgeRequest<KnowledgeRetrieveDebugResult>("/bot/admin/knowledge/retrieve_debug", "get", {
    knowledge_base_id: params.knowledgeBaseID,
    agent_id: params.agentID || 0,
    query: params.query,
    limit: params.limit || 8,
  })
}

export function createFile(params: {
  knowledgeBaseID: number
  parent: string
  name: string
  type: "file" | "folder"
  contentBase64?: string
}) {
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/admin/knowledge/create_file", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    parent: params.parent,
    parent_id: params.parent,
    name: params.name,
    type: params.type,
    content_base64: params.contentBase64 || "",
  })
}

export async function uploadFilePart(params: UploadFilePartParams) {
  const form = new FormData()
  form.set("knowledge_base_id", String(params.knowledgeBaseID))
  form.set("parent", params.parent)
  form.set("parent_id", params.parent)
  form.set("name", params.name)
  form.set("type", "file")
  form.set("upload_id", params.uploadID)
  form.set("part_number", String(params.partNumber))
  form.set("total_parts", String(params.totalParts))
  form.set("file", params.chunk, params.name)

  const result = (await request(
    "/bot/admin/knowledge/create_file",
    "post",
    form,
  )) as KnowledgeApiResult<KnowledgeFileUploadPartData> | KnowledgeFileUploadPartData
  if (!isKnowledgeApiResult(result)) {
    return result
  }
  return unwrapKnowledgeResult(result)
}

export function renameFile(params: {
  knowledgeBaseID: number
  id: string
  name: string
}) {
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/admin/knowledge/rename_file", "post", {
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
  return knowledgeRequest<KnowledgeFileContent>("/bot/admin/knowledge/save_file", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    id: params.id,
    content: params.content,
  })
}

export function indexKnowledgeBase(params: { knowledgeBaseID: number }) {
  return knowledgeRequest<{ index_status: string }>("/bot/admin/knowledge/index_base", "post", {
    knowledge_base_id: params.knowledgeBaseID,
  })
}

export function deleteFiles(params: { knowledgeBaseID: number; ids: string[] }) {
  return knowledgeRequest<KnowledgeFileManagerData>("/bot/admin/knowledge/delete_files", "post", {
    knowledge_base_id: params.knowledgeBaseID,
    ids: params.ids,
  })
}

export function moveFiles(params: {
  knowledgeBaseID: number
  ids: string[]
  target: string
}) {
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/admin/knowledge/move_files", "post", {
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
  return knowledgeRequest<KnowledgeFileOperationData>("/bot/admin/knowledge/copy_files", "post", {
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
  return `/bot/admin/knowledge/download_file?${params.toString()}`
}

export function previewFileURL(knowledgeBaseID: number, id: string) {
  const params = new URLSearchParams({
    knowledge_base_id: String(knowledgeBaseID),
    id,
    preview: "1",
  })
  return `/bot/admin/knowledge/download_file?${params.toString()}`
}

export function downloadFileBaseURL(knowledgeBaseID: number, directoryID: string) {
  const idPrefix = directoryID && directoryID !== "/" ? `${directoryID}/` : ""
  return `/bot/admin/knowledge/download_file?knowledge_base_id=${encodeURIComponent(
    String(knowledgeBaseID),
  )}&id=${encodeURIComponent(idPrefix)}`
}
