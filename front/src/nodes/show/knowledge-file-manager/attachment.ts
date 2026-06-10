import type { KnowledgeTreeNode } from "./types"

export type AttachmentKind = "image" | "file"

export type AttachmentLink = {
  label: string
  target: string
  kind: AttachmentKind
  fileID: string
  url: string
}

export function currentFileDirectoryID(fileID: string) {
  return parentIDOf(fileID)
}

export function parentIDOf(id: string) {
  const normalized = normalizeID(id)
  const index = normalized.lastIndexOf("/")
  return index > 0 ? normalized.slice(0, index) : "/"
}

export function joinKnowledgePath(parentID: string, name: string) {
  const parent = normalizeID(parentID)
  const cleanName = sanitizeAttachmentName(name)
  if (!cleanName) {
    return parent
  }
  return parent === "/" ? cleanName : `${parent}/${cleanName}`
}

export function normalizeID(id: string) {
  const value = String(id || "").trim().replace(/\\/g, "/").replace(/\/+/g, "/")
  if (!value || value === ".") {
    return "/"
  }
  const normalized = value.replace(/^\/+/, "")
  return normalized || "/"
}

export function uniqueAttachmentName(
  files: KnowledgeTreeNode[],
  parentID: string,
  name: string,
  reservedNames = new Set<string>(),
) {
  const cleanName = sanitizeAttachmentName(name) || "附件"
  const siblings = new Set(
    files
      .filter((node) => node.parent_id === parentID && node.type === "file")
      .map((node) => String(node.name || "").toLowerCase()),
  )
  for (const reservedName of reservedNames) {
    siblings.add(reservedName.toLowerCase())
  }
  if (!siblings.has(cleanName.toLowerCase())) {
    return cleanName
  }
  const dot = cleanName.lastIndexOf(".")
  const stem = dot > 0 ? cleanName.slice(0, dot) : cleanName
  const ext = dot > 0 ? cleanName.slice(dot) : ""
  for (let index = 1; index < 1000; index += 1) {
    const candidate = `${stem} ${index}${ext}`
    if (!siblings.has(candidate.toLowerCase())) {
      return candidate
    }
  }
  return `${stem} ${Date.now()}${ext}`
}

export function attachmentMarkdown(name: string, kind: AttachmentKind) {
  const target = sanitizeAttachmentName(name)
  if (!target) {
    return ""
  }
  const href = encodeMarkdownLinkTarget(target)
  const label = escapeMarkdownLabel(target)
  return kind === "image" ? `![${label}](<${href}>)` : `[${label}](<${href}>)`
}

export function isImageFileName(name: string) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(name)
}

export function extractAttachmentLinks(content: string) {
  const links: Array<{
    from: number
    to: number
    raw: string
    target: string
    label: string
    embedded: boolean
  }> = []
  const wikiPattern = /!?\[\[([^\]\n]+)\]\]/g
  let match: RegExpExecArray | null
  while ((match = wikiPattern.exec(content))) {
    const raw = match[0]
    const body = String(match[1] || "").trim()
    if (!body) {
      continue
    }
    const [target, alias] = body.split("|")
    links.push({
      from: match.index,
      to: match.index + raw.length,
      raw,
      target: normalizeLinkTarget(target || ""),
      label: String(alias || target || "").trim(),
      embedded: raw.startsWith("!"),
    })
  }

  const markdownPattern = /!?\[([^\]\n]*)\]\(([^)\n]+)\)/g
  while ((match = markdownPattern.exec(content))) {
    const raw = match[0]
    const target = normalizeLinkTarget(String(match[2] || ""))
    if (!target || isExternalTarget(target)) {
      continue
    }
    links.push({
      from: match.index,
      to: match.index + raw.length,
      raw,
      target,
      label: String(match[1] || target).trim(),
      embedded: raw.startsWith("!"),
    })
  }

  return links
}

export function resolveAttachmentLink({
  currentFileID,
  files,
  link,
  downloadURL,
}: {
  currentFileID: string
  files: KnowledgeTreeNode[]
  link: {
    target: string
    label: string
    embedded: boolean
  }
  downloadURL: (id: string) => string
}): AttachmentLink | null {
  const fileID = resolveAttachmentID(files, currentFileID, link.target)
  if (!fileID) {
    return null
  }
  const label = link.label || basename(fileID)
  const kind = link.embedded && isImageFileName(fileID) ? "image" : "file"
  return {
    label,
    target: link.target,
    kind,
    fileID,
    url: downloadURL(fileID),
  }
}

export function resolveAttachmentID(
  files: KnowledgeTreeNode[],
  currentFileID: string,
  target: string,
) {
  const normalizedTarget = normalizeLinkTarget(target)
  if (!normalizedTarget || isExternalTarget(normalizedTarget)) {
    return ""
  }
  const currentDir = parentIDOf(currentFileID)
  const candidates = linkTargetCandidates(currentDir, normalizedTarget)
  const byID = new Map(files.filter((node) => node.type === "file").map((node) => [node.id, node]))
  for (const candidate of candidates) {
    if (byID.has(candidate)) {
      return candidate
    }
  }
  const lowerCandidates = new Set(candidates.map((candidate) => candidate.toLowerCase()))
  const match = files.find(
    (node) => node.type === "file" && lowerCandidates.has(node.id.toLowerCase()),
  )
  return match?.id || ""
}

export function basename(path: string) {
  const normalized = normalizeID(path)
  const index = normalized.lastIndexOf("/")
  return index >= 0 ? normalized.slice(index + 1) : normalized
}

function linkTargetCandidates(currentDir: string, target: string) {
  const cleanTarget = normalizeLinkTarget(target)
  if (cleanTarget.startsWith("/")) {
    return [normalizeID(cleanTarget)]
  }
  const withoutDot = cleanTarget.replace(/^\.\//, "")
  return [joinKnowledgePath(currentDir, withoutDot)]
}

function sanitizeAttachmentName(name: string) {
  return String(name || "")
    .trim()
    .replace(/\\/g, "-")
    .replace(/\//g, "-")
    .replace(/[\u0000-\u001f]/g, "")
}

function encodeMarkdownLinkTarget(target: string) {
  return target
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")
}

function escapeMarkdownLabel(label: string) {
  return label.replace(/([\\\]])/g, "\\$1")
}

function normalizeLinkTarget(target: string) {
  const raw = String(target || "").trim().split("#")[0] || ""
  try {
    return decodeURI(raw).replace(/\\/g, "/")
  } catch {
    return raw.replace(/\\/g, "/")
  }
}

function isExternalTarget(target: string) {
  return /^(https?:|mailto:|tel:|data:|blob:)/i.test(target)
}
