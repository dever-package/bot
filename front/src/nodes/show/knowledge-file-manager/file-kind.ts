import type { KnowledgeFileContent } from "./types"

export type KnowledgeFileKind =
  | "markdown"
  | "text"
  | "code"
  | "html"
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "office"
  | "archive"
  | "unknown"

const markdownExts = new Set(["md", "markdown", "mdown", "mkd"])
const textExts = new Set(["txt", "log"])
const codeExts = new Set([
  "css",
  "csv",
  "go",
  "graphql",
  "ini",
  "java",
  "js",
  "json",
  "jsx",
  "less",
  "php",
  "py",
  "rb",
  "rs",
  "scss",
  "sql",
  "toml",
  "ts",
  "tsx",
  "vue",
  "xml",
  "yaml",
  "yml",
])
const imageExts = new Set(["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"])
const videoExts = new Set(["avi", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "webm"])
const audioExts = new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav", "weba"])
const officeExts = new Set([
  "doc",
  "docx",
  "odp",
  "ods",
  "odt",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
])
const archiveExts = new Set(["7z", "gz", "rar", "tar", "zip"])

export function resolveFileKind(file: Pick<KnowledgeFileContent, "name" | "mime_type">) {
  const ext = fileExt(file.name)
  const mime = String(file.mime_type || "").toLowerCase()
  if (markdownExts.has(ext)) {
    return "markdown"
  }
  if (ext === "html" || ext === "htm" || mime.includes("text/html")) {
    return "html"
  }
  if (codeExts.has(ext)) {
    return "code"
  }
  if (textExts.has(ext) || mime.startsWith("text/")) {
    return "text"
  }
  if (ext === "pdf" || mime.includes("pdf")) {
    return "pdf"
  }
  if (imageExts.has(ext) || mime.startsWith("image/")) {
    return "image"
  }
  if (videoExts.has(ext) || mime.startsWith("video/")) {
    return "video"
  }
  if (audioExts.has(ext) || mime.startsWith("audio/")) {
    return "audio"
  }
  if (officeExts.has(ext) || isOfficeMime(mime)) {
    return "office"
  }
  if (archiveExts.has(ext)) {
    return "archive"
  }
  return "unknown"
}

export function isTextEditableKind(kind: KnowledgeFileKind) {
  return kind === "markdown" || kind === "text" || kind === "code" || kind === "html"
}

export function fileExt(name: string) {
  const normalized = String(name || "").trim().toLowerCase()
  const index = normalized.lastIndexOf(".")
  return index >= 0 ? normalized.slice(index + 1) : ""
}

function isOfficeMime(mime: string) {
  return (
    mime.includes("msword") ||
    mime.includes("ms-excel") ||
    mime.includes("ms-powerpoint") ||
    mime.includes("officedocument") ||
    mime.includes("opendocument")
  )
}
