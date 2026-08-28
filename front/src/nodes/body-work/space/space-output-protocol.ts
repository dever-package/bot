import { getCompatModule } from "@dever/front-plugin";
import {
  contentOutputMediaItems,
  firstNonEmptyText,
  normalizeEnergonOutput,
  plainMarkdownTextFromRichOutput,
  preferRicherMediaOutput,
} from "../shared/content-output";
import {
  looseRichJSONText,
  safeDocumentText,
  safeRichDocument,
  type richDocument,
} from "../shared/rich-document";
import {
  parseMaybeEmbeddedJSON,
  parseMaybeJSON,
  repairJSONControlChars,
  uniqueNonEmptyStrings,
} from "../shared/structured-json";
import type { GeneratedNodePreview } from "./space-node-runtime";
import type { SpaceCanvasNode } from "./types";

type UnknownRecord = Record<string, unknown>;
type RichDocument = NonNullable<ReturnType<typeof richDocument>>;

function isUnknownRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

const { normalizeAgentResultOutputValue } = getCompatModule(
  "@/lib/agent-result-protocol",
) as {
  normalizeAgentResultOutputValue?: (value: unknown) => unknown;
};

export function firstTiptapRichDocument(...values: unknown[]) {
  for (const value of values) {
    const rich = fixedTiptapRichDocument(value);
    if (rich) {
      return rich;
    }
  }
  return null;
}

export function firstDisplayOutput(...values: unknown[]) {
  for (const value of values) {
    const output = normalizeEnergonDisplayOutput(value);
    if (hasDisplayOutput(output)) {
      return output;
    }
  }
  return "";
}

export function normalizeEnergonDisplayOutput(value: unknown): unknown {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return normalizeEnergonDisplayOutput(agentResult);
  }
  const protocolOutput = normalizeAgentResultOutputValue?.(parsed) ?? parsed;
  const output = normalizeEnergonDisplayValue(protocolOutput, new Set());
  if (hasDisplayOutput(output)) {
    return output;
  }
  if (protocolOutput !== parsed) {
    const fallbackOutput = normalizeEnergonDisplayValue(parsed, new Set());
    if (hasDisplayOutput(fallbackOutput)) {
      return fallbackOutput;
    }
  }
  const fixedRichOutput = fixedTiptapRichOutput(parsed);
  if (fixedRichOutput) {
    return normalizeEnergonOutput?.(fixedRichOutput) ?? fixedRichOutput;
  }
  const canvasOutput = normalizeDisplayOutputForCanvas(value);
  if (canvasOutput !== parsed && hasDisplayOutput(canvasOutput)) {
    return canvasOutput;
  }
  return "";
}

function normalizeEnergonDisplayValue(
  value: unknown,
  seen: Set<unknown>,
): unknown {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return normalizeEnergonDisplayValue(agentResult, seen);
  }
  if (typeof parsed === "string") {
    const fixedOutput = fixedRichDisplayOutput(parsed);
    if (hasDisplayOutput(fixedOutput)) {
      return fixedOutput;
    }
    const looseText = looseRichJSONText(parsed);
    if (looseText) {
      return { text: looseText };
    }
    return looksLikeStructuredJSONSnippet(parsed) ? "" : parsed;
  }
  if (Array.isArray(parsed)) {
    const output = parsed
      .map((item) => normalizeEnergonDisplayValue(item, seen))
      .filter(hasDisplayOutput);
    return output.length > 0 ? output : "";
  }
  if (!isUnknownRecord(parsed)) {
    return parsed;
  }
  if (isRichDocumentLike(parsed)) {
    const embeddedOutput = embeddedStructuredDisplayOutput(parsed);
    if (embeddedOutput !== undefined) {
      return normalizeEnergonDisplayValue(embeddedOutput, seen);
    }
    const markdownText = plainMarkdownTextFromRichDocument(parsed);
    if (markdownText) {
      return { text: markdownText };
    }
    const rich = fixedTiptapRichDocument(parsed) || safeRichDocument(parsed);
    return rich ? { rich } : parsed;
  }
  if (seen.has(parsed)) {
    return "";
  }
  seen.add(parsed);

  if (isAgentResultPayload(parsed)) {
    return normalizeAgentResultPayloadForEnergon(parsed);
  }

  if (isDirectEnergonOutputObject(parsed)) {
    return parsed;
  }

  for (const key of ["output", "result", "data", "content", "json", "value"]) {
    if (!(key in parsed)) {
      continue;
    }
    const output = normalizeEnergonDisplayValue(parsed[key], seen);
    if (hasDisplayOutput(output)) {
      return output;
    }
  }

  const payloadRich = richDocumentFromPayload(parsed);
  if (payloadRich) {
    const output = { rich: payloadRich };
    return normalizeEnergonOutput?.(output) ?? output;
  }

  const rich = safeRichDocument(parsed);
  if (rich) {
    return { rich };
  }
  const fixedRichOutput = fixedTiptapRichOutput(parsed);
  if (fixedRichOutput) {
    return normalizeEnergonOutput?.(fixedRichOutput) ?? fixedRichOutput;
  }

  const extracted = extractDisplayOutput(parsed);
  if (extracted !== parsed) {
    return normalizeEnergonDisplayValue(extracted, seen);
  }

  if (isAgentResultPayloadObject(parsed)) {
    return normalizeAgentResultPayloadForEnergon(parsed);
  }
  if (isRunEnvelope(parsed)) {
    const text = firstNonEmptyText(parsed.message, parsed.error, parsed.status);
    return text ? { text } : "";
  }
  return hasMeaningfulObjectOutput(parsed) ? parsed : "";
}

function isAgentResultPayloadObject(value: unknown): boolean {
  return Boolean(
    isUnknownRecord(value) &&
    (value.format ||
      value.result_mode ||
      value.rich ||
      value.images ||
      value.videos ||
      value.audios ||
      value.files),
  );
}

function normalizeAgentResultPayloadForEnergon(value: UnknownRecord) {
  const result: UnknownRecord = {};
  const content = parseMaybeJSON(value.content);
  if (isUnknownRecord(content)) {
    copyEnergonOutputFields(result, content);
  }
  copyEnergonOutputFields(result, value);
  const text = agentResultPayloadText(value);
  if (text) {
    result.text = text;
  }
  if (!hasDisplayOutput(result) && content && typeof content === "object") {
    return content;
  }
  return hasMeaningfulObjectOutput(result) ? result : "";
}

function agentResultPayloadText(value: Record<string, unknown>) {
  const direct = firstNonEmptyText(value.text);
  if (direct) {
    return direct;
  }
  const content = parseMaybeJSON(value.content);
  if (typeof content === "string") {
    return content.trim();
  }
  if (isUnknownRecord(content)) {
    return firstNonEmptyText(content.text);
  }
  return "";
}

function normalizeDisplayOutputForCanvas(value: unknown): unknown {
  const agentResult = parseAgentResultBlock(value);
  if (agentResult !== value) {
    return normalizeDisplayOutputForCanvas(agentResult);
  }
  const fixedRichOutput = fixedTiptapRichOutput(value);
  if (fixedRichOutput) {
    return fixedRichOutput;
  }
  const fixedOutput = fixedRichDisplayOutput(value);
  if (hasDisplayOutput(fixedOutput)) {
    return fixedOutput;
  }
  const parsed = parseMaybeJSON(value);
  const rich = safeRichDocument(parsed);
  if (rich) {
    return { rich };
  }
  const extracted = extractDisplayOutput(parsed);
  if (extracted !== parsed) {
    const extractedRich = safeRichDocument(extracted);
    return extractedRich ? { rich: extractedRich } : extracted;
  }
  return parsed;
}

function fixedTiptapRichOutput(value: unknown): { rich: RichDocument } | null {
  const rich = fixedTiptapRichDocument(value);
  return rich ? { rich } : null;
}

function fixedTiptapRichDocument(
  value: unknown,
  seen = new Set<unknown>(),
): RichDocument | null {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return fixedTiptapRichDocument(agentResult, seen);
  }
  if (Array.isArray(parsed)) {
    if (seen.has(parsed)) {
      return null;
    }
    seen.add(parsed);
    for (const item of parsed) {
      const rich = fixedTiptapRichDocument(item, seen);
      if (rich) {
        return rich;
      }
    }
    return null;
  }
  if (!isUnknownRecord(parsed)) {
    return null;
  }
  if (seen.has(parsed)) {
    return null;
  }
  seen.add(parsed);
  if (isRichDocumentLike(parsed)) {
    return fixedTiptapRichDocumentFromTextDoc(parsed, seen) || parsed;
  }
  const row = parsed;
  const candidates = [
    valueAtPath(row, ["output", "content", "rich"]),
    valueAtPath(row, ["output", "rich"]),
    valueAtPath(row, ["content", "rich"]),
    row.content,
    row.rich,
    row.text,
    row.summary,
  ];
  for (const candidate of candidates) {
    if (candidate === parsed) {
      continue;
    }
    const rich = fixedTiptapRichDocument(candidate, seen);
    if (rich) {
      return rich;
    }
  }
  return null;
}

function fixedTiptapRichDocumentFromTextDoc(
  doc: unknown,
  seen: Set<unknown>,
): RichDocument | null {
  const texts = collectTiptapTextValues(doc);
  for (const text of texts) {
    const rich = fixedTiptapRichDocumentFromStructuredText(text, seen);
    if (rich) {
      return rich;
    }
  }
  return fixedTiptapRichDocumentFromStructuredText(texts.join(""), seen);
}

function fixedTiptapRichDocumentFromStructuredText(
  value: string,
  seen: Set<unknown>,
): RichDocument | null {
  const text = String(value || "").trim();
  if (!looksLikeStructuredJSONSnippet(text)) {
    return null;
  }
  const parsedText = parseMaybeEmbeddedJSON(text);
  if (parsedText === text || parsedText === value) {
    return null;
  }
  return fixedTiptapRichDocument(parsedText, seen);
}

function collectTiptapText(value: unknown): string {
  return collectTiptapTextValues(value).join("");
}

function collectTiptapTextValues(
  value: unknown,
  seen = new Set<unknown>(),
): string[] {
  if (!value) {
    return [];
  }
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTiptapTextValues(item, seen));
  }
  if (!isUnknownRecord(value)) {
    return [];
  }
  if (seen.has(value)) {
    return [];
  }
  seen.add(value);
  const values: string[] = [];
  if (typeof value.text === "string") {
    values.push(value.text);
  }
  if (Array.isArray(value.content)) {
    values.push(...collectTiptapTextValues(value.content, seen));
  }
  return values;
}

function fixedRichDisplayOutput(value: unknown): unknown {
  const rich = fixedRichDocument(value);
  if (rich) {
    return { rich };
  }
  const parsed = parseMaybeJSON(value);
  if (!parsed) {
    return "";
  }
  if (typeof parsed === "string") {
    const looseText = looseRichJSONText(parsed);
    return looseText ? { text: looseText } : "";
  }
  return "";
}

function fixedRichDocument(
  value: unknown,
  seen = new Set<unknown>(),
): RichDocument | null {
  const parsed = parseMaybeJSON(value);
  if (isRichDocumentLike(parsed)) {
    return fixedTiptapRichDocumentFromTextDoc(parsed, seen) || parsed;
  }
  if (Array.isArray(parsed)) {
    return safeRichDocument(normalizeDisplayOutput(parsed));
  }
  if (!isUnknownRecord(parsed)) {
    return null;
  }
  if (seen.has(parsed)) {
    return null;
  }
  seen.add(parsed);

  const row = parsed;
  const payloadRich = richDocumentFromPayload(row);
  if (payloadRich) {
    return payloadRich;
  }

  const fixedCandidates = [
    valueAtPath(row, ["output", "content", "rich"]),
    valueAtPath(row, ["output", "content"]),
    valueAtPath(row, ["output", "rich"]),
    valueAtPath(row, ["content", "output", "content", "rich"]),
    valueAtPath(row, ["content", "output", "content"]),
    valueAtPath(row, ["content", "rich"]),
    valueAtPath(row, ["data", "output", "content", "rich"]),
    valueAtPath(row, ["data", "output", "content"]),
    valueAtPath(row, ["data", "content", "rich"]),
    row.rich,
    row.output,
    row.result,
    row.content,
    row.data,
    row.value,
    row.json,
    row.text,
    row.message,
  ];

  for (const candidate of fixedCandidates) {
    if (candidate == null || candidate === parsed) {
      continue;
    }
    const candidateRich = fixedRichDocument(candidate, seen);
    if (candidateRich) {
      return candidateRich;
    }
  }

  for (const [key, candidate] of Object.entries(row)) {
    if (
      !isLikelyNestedResultKey(key) ||
      !candidate ||
      typeof candidate !== "object"
    ) {
      continue;
    }
    const candidateRich = fixedRichDocument(candidate, seen);
    if (candidateRich) {
      return candidateRich;
    }
  }

  return null;
}

function richDocumentFromPayload(payload: UnknownRecord): RichDocument | null {
  if (isRichDocumentLike(payload)) {
    return payload;
  }
  const content = isUnknownRecord(payload.content) ? payload.content : null;
  const format = String(payload.format || "").toLowerCase();
  const contentFormat = String(content?.format || "").toLowerCase();
  if (
    Array.isArray(payload.content) &&
    (format === "rich_json" || payload.type === undefined)
  ) {
    return safeRichDocument({
      type: "doc",
      content: payload.content,
    });
  }
  if (
    (format === "rich_json" || contentFormat === "rich_json") &&
    payload.rich != null
  ) {
    return fixedRichDocument(payload.rich);
  }
  if (
    (format === "rich_json" || contentFormat === "rich_json") &&
    content?.rich != null
  ) {
    return fixedRichDocument(content.rich);
  }
  return null;
}

function isRichDocumentLike(value: unknown): value is RichDocument {
  return Boolean(
    isUnknownRecord(value) &&
    value.type === "doc" &&
    Array.isArray(value.content),
  );
}

function copyEnergonOutputFields(target: UnknownRecord, source: UnknownRecord) {
  for (const key of [
    "format",
    "title",
    "text",
    "reasoning",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error",
    "progress",
    "meta",
  ]) {
    if (hasDisplayOutput(source[key])) {
      target[key] =
        key === "rich" ? normalizeEnergonRichValue(source[key]) : source[key];
    }
  }
}

function normalizeEnergonRichValue(value: unknown) {
  const rich =
    fixedRichDocument(value) ||
    safeRichDocument(normalizeDisplayOutput(value)) ||
    safeRichDocument(value);
  return rich || value;
}

function hasMeaningfulObjectOutput(value: UnknownRecord) {
  return Object.entries(value).some(([key, item]) => {
    if (key.startsWith("_") || key === "format") {
      return false;
    }
    return hasDisplayOutput(item);
  });
}

function isDirectEnergonOutputObject(value: unknown): boolean {
  if (!isUnknownRecord(value)) {
    return false;
  }
  if (
    "output" in value ||
    "result" in value ||
    "data" in value ||
    "content" in value ||
    "kind" in value ||
    "event" in value
  ) {
    return false;
  }
  return [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error",
  ].some((key) => hasDisplayOutput(value[key]));
}

export function hasDisplayOutput(value: unknown): boolean {
  if (value == null || value === "") {
    return false;
  }
  if (typeof value === "string") {
    const text = value.trim();
    return (
      text.length > 0 &&
      !looksLikeStructuredJSONSnippet(text) &&
      !isNonContentText(text)
    );
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(hasDisplayOutput);
  }
  if (!isUnknownRecord(value)) {
    return false;
  }
  if (fixedRichDocument(value)) {
    return true;
  }
  if (isRunEnvelope(value)) {
    return false;
  }
  return hasMeaningfulObjectOutput(value);
}

export function nodeDisplayText(node: SpaceCanvasNode) {
  return displayTextFromOutput(
    nodeContextOutput(node),
    node.description || node.title,
  );
}

export function richDocumentFromNode(node: SpaceCanvasNode) {
  const candidates = [
    nodeContextOutput(node),
    node.asset?.version?.content,
    node.description,
  ];
  for (const candidate of candidates) {
    const rich =
      fixedRichDocument(candidate) ||
      safeRichDocument(normalizeDisplayOutputForCanvas(candidate)) ||
      safeRichDocument(extractDisplayOutput(candidate)) ||
      safeRichDocument(candidate);
    if (rich) {
      return rich;
    }
  }
  return null;
}

export function displayTextFromOutput(value: unknown, fallback = "") {
  const output = extractDisplayOutput(value);
  const rich = safeRichDocument(output);
  const richText = rich ? safeDocumentText(rich).trim() : "";
  if (richText && !isNonContentText(richText)) {
    return richText;
  }

  const text = safeDocumentText(output).trim();
  if (isNonContentText(text)) {
    return "";
  }
  const looseText = looseRichJSONText(text);
  if (looseText) {
    return looseText;
  }
  if (text && !looksLikeStructuredJSONSnippet(text)) {
    return text;
  }
  if (looksLikeJSONText(text)) {
    const parsedText = safeDocumentText(
      extractDisplayOutput(parseMaybeJSON(text)),
    ).trim();
    if (parsedText && parsedText !== text && !isNonContentText(parsedText)) {
      return parsedText;
    }
  }

  const fallbackText = String(fallback || "").trim();
  if (isNonContentText(fallbackText)) {
    return "";
  }
  const looseFallbackText = looseRichJSONText(fallbackText);
  if (looseFallbackText) {
    return looseFallbackText;
  }
  if (!looksLikeStructuredJSONSnippet(fallbackText)) {
    return fallbackText;
  }
  const parsedFallbackText = safeDocumentText(
    extractDisplayOutput(parseMaybeJSON(fallbackText)),
  ).trim();
  return parsedFallbackText &&
    parsedFallbackText !== fallbackText &&
    !isNonContentText(parsedFallbackText)
    ? parsedFallbackText
    : "";
}

function isNonContentText(text: string) {
  const normalized = text.trim();
  if (!normalized) {
    return false;
  }
  return (
    isEmptyPlaceholderText(normalized) || isTransientAssistantText(normalized)
  );
}

function isEmptyPlaceholderText(text: string) {
  const normalized = text.trim();
  return normalized === "map[]" || normalized === "<nil>";
}

function isTransientAssistantText(text: string) {
  const normalized = text.trim();
  if (!normalized) {
    return false;
  }
  return /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    normalized,
  );
}

export function generatedPreviewFromValue(
  value: unknown,
  kind: string,
): GeneratedNodePreview {
  const preview: GeneratedNodePreview = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: "",
  };
  const normalizedValue = extractDisplayOutput(value);
  fillGeneratedPreview(preview, normalizedValue, kind);
  if (!hasGeneratedPreview(preview) && normalizedValue !== value) {
    fillGeneratedPreview(preview, value, kind);
  }
  if (
    hasGeneratedPreviewMedia(preview) &&
    looksLikeStructuredJSONSnippet(preview.text)
  ) {
    preview.text = "";
  }
  if (preview.videoUrl) {
    preview.videoPosterUrl ||= contentOutputMediaItems(value, "video").find(
      (item) => item.url === preview.videoUrl,
    )?.thumbnail;
  }
  return preview;
}

export function mergeGeneratedPreview(
  primary: GeneratedNodePreview,
  fallback: GeneratedNodePreview,
): GeneratedNodePreview {
  return {
    text: firstNonEmptyText(primary.text, fallback.text),
    imageUrl: primary.imageUrl || fallback.imageUrl,
    videoUrl: primary.videoUrl || fallback.videoUrl,
    videoPosterUrl: primary.videoPosterUrl || fallback.videoPosterUrl,
    audioUrl: primary.audioUrl || fallback.audioUrl,
    fileUrl: primary.fileUrl || fallback.fileUrl,
  };
}

function fillGeneratedPreview(
  preview: GeneratedNodePreview,
  value: unknown,
  kind: string,
  seen: Set<unknown> = new Set(),
  depth = 0,
) {
  if (depth > 12) {
    return;
  }
  if (value == null) {
    return;
  }
  if (typeof value === "string") {
    setPreviewString(preview, value, kind);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      fillGeneratedPreview(preview, item, kind, seen, depth + 1);
      if (hasGeneratedPreviewMedia(preview)) {
        return;
      }
    }
    return;
  }
  if (typeof value !== "object") {
    preview.text = String(value);
    return;
  }
  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  const row = value as Record<string, unknown>;
  const mediaUrl = fillGeneratedPreviewMedia(preview, row, kind);
  const displayText = displayTextFromOutput(value, "");
  if (displayText && displayText !== mediaUrl && !looksLikeURL(displayText)) {
    preview.text ||= displayText;
  }
  const genericUrl = firstMediaURLText(row.url, row.src, row.href);
  if (genericUrl && genericUrl !== mediaUrl) {
    setPreviewString(preview, genericUrl, kind);
  }
  preview.imageUrl ||= firstMediaURLText(
    row.image,
    row.image_url,
    row.imageUrl,
    firstArrayValue(row.images),
    firstArrayValue(row.imageUrls),
  );
  preview.videoUrl ||= firstMediaURLText(
    row.video,
    row.video_url,
    row.videoUrl,
    firstArrayValue(row.videos),
    firstArrayValue(row.videoUrls),
  );
  preview.audioUrl ||= firstMediaURLText(
    row.audio,
    row.audio_url,
    row.audioUrl,
    firstArrayValue(row.audios),
    firstArrayValue(row.audioUrls),
  );
  preview.fileUrl ||= firstMediaURLText(
    row.file,
    row.file_url,
    row.fileUrl,
    firstArrayValue(row.files),
    firstArrayValue(row.fileUrls),
  );

  if (!hasGeneratedPreviewMedia(preview)) {
    for (const key of ["output", "result", "content", "body", "data", "rich"]) {
      if (row[key] && typeof row[key] === "object") {
        fillGeneratedPreview(preview, row[key], kind, seen, depth + 1);
        if (hasGeneratedPreviewMedia(preview)) {
          return;
        }
      }
    }
  }
  if (
    !preview.text &&
    !hasGeneratedPreview(preview) &&
    !isWrappedOutput(row) &&
    hasMeaningfulObjectOutput(row)
  ) {
    try {
      const fallbackText = JSON.stringify(value, null, 2);
      if (!isEmptyContextText(fallbackText)) {
        preview.text = fallbackText;
      }
    } catch {
      const fallbackText = String(value);
      if (!isEmptyContextText(fallbackText)) {
        preview.text = fallbackText;
      }
    }
  }
}

function fillGeneratedPreviewMedia(
  preview: GeneratedNodePreview,
  row: Record<string, unknown>,
  kind: string,
) {
  const mediaKind = firstPreviewMediaKind(
    kind,
    row.kind,
    row.media_kind,
    row.mediaKind,
    row.media_type,
    row.mediaType,
    row.type,
    row.name,
  );
  if (!mediaKind) {
    return "";
  }
  const mediaUrl = firstMediaURLText(...mediaCandidatesForKind(row, mediaKind));
  if (!mediaUrl) {
    return "";
  }
  if (mediaKind === "image") preview.imageUrl ||= mediaUrl;
  if (mediaKind === "video") preview.videoUrl ||= mediaUrl;
  if (mediaKind === "audio") preview.audioUrl ||= mediaUrl;
  if (mediaKind === "file") preview.fileUrl ||= mediaUrl;
  return mediaUrl;
}

export function previewKindFromOutput(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }
  const row = value as Record<string, unknown>;
  return firstPreviewMediaKind(
    row.kind,
    row.media_kind,
    row.mediaKind,
    row.media_type,
    row.mediaType,
    row.type,
    row.name,
  );
}

function firstPreviewMediaKind(...values: unknown[]) {
  for (const value of values) {
    const kind = normalizePreviewMediaKind(String(value || ""));
    if (kind) {
      return kind;
    }
  }
  return "";
}

function normalizePreviewMediaKind(kind: string) {
  const normalized = kind.trim().toLowerCase();
  if (
    normalized === "image" ||
    normalized === "images" ||
    normalized === "picture" ||
    normalized === "pictures" ||
    normalized === "mediaimage" ||
    normalized === "editor media image" ||
    normalized === "editormediaimage" ||
    normalized.includes("image") ||
    normalized === "图片" ||
    normalized === "图像"
  ) {
    return "image";
  }
  if (
    normalized === "video" ||
    normalized === "videos" ||
    normalized === "mediavideo" ||
    normalized === "editor media video" ||
    normalized === "editormediavideo" ||
    normalized.includes("video") ||
    normalized === "视频"
  ) {
    return "video";
  }
  if (
    normalized === "audio" ||
    normalized === "audios" ||
    normalized === "music" ||
    normalized === "voice" ||
    normalized === "mediaaudio" ||
    normalized === "editor media audio" ||
    normalized === "editormediaaudio" ||
    normalized.includes("audio") ||
    normalized === "音频" ||
    normalized === "音乐" ||
    normalized === "语音"
  ) {
    return "audio";
  }
  if (
    normalized === "file" ||
    normalized === "files" ||
    normalized === "attachment" ||
    normalized === "attachments" ||
    normalized === "mediafile" ||
    normalized === "editorfile" ||
    normalized === "editor media file" ||
    normalized === "editormediafile" ||
    normalized === "文件" ||
    normalized === "附件"
  ) {
    return "file";
  }
  return "";
}

function mediaCandidatesForKind(
  row: Record<string, unknown>,
  kind: "image" | "video" | "audio" | "file",
) {
  const common = [
    row.url,
    row.src,
    row.href,
    row.path,
    row.file_url,
    row.fileUrl,
    row.text,
    row.content,
    row.value,
    valueAtPath(row, ["attrs", "src"]),
    valueAtPath(row, ["attrs", "url"]),
    valueAtPath(row, ["attrs", "href"]),
  ];
  if (kind === "image") {
    return [
      row.image,
      row.image_url,
      row.imageUrl,
      firstArrayValue(row.images),
      firstArrayValue(row.imageUrls),
      ...common,
    ];
  }
  if (kind === "video") {
    return [
      row.video,
      row.video_url,
      row.videoUrl,
      firstArrayValue(row.videos),
      firstArrayValue(row.videoUrls),
      ...common,
    ];
  }
  if (kind === "audio") {
    return [
      row.audio,
      row.audio_url,
      row.audioUrl,
      firstArrayValue(row.audios),
      firstArrayValue(row.audioUrls),
      ...common,
    ];
  }
  return [
    row.file,
    row.file_url,
    row.fileUrl,
    firstArrayValue(row.files),
    firstArrayValue(row.fileUrls),
    ...common,
  ];
}

function setPreviewString(
  preview: GeneratedNodePreview,
  value: string,
  kind: string,
) {
  const text = value.trim();
  if (!text) {
    return;
  }
  if (isNonContentText(text)) {
    return;
  }
  if (looksLikeJSONText(text)) {
    const parsed = parseMaybeJSON(text);
    if (parsed !== text) {
      fillGeneratedPreview(preview, parsed, kind);
      if (hasGeneratedPreviewMedia(preview)) {
        return;
      }
    }
    const parsedText = displayTextFromOutput(parsed, "");
    if (parsedText && !looksLikeURL(parsedText)) {
      preview.text ||= parsedText;
    }
    return;
  }
  const looseText = looseRichJSONText(text);
  if (looseText) {
    preview.text ||= looseText;
    return;
  }
  const documentTextValue = safeDocumentText(text);
  if (documentTextValue && documentTextValue !== text) {
    preview.text ||= documentTextValue;
    return;
  }
  const markdownMedia = firstMarkdownMediaPreview(text, kind);
  if (markdownMedia) {
    setPreviewMedia(preview, markdownMedia.kind, markdownMedia.url);
    preview.text ||= markdownMedia.caption;
    return;
  }
  if (looksLikeURL(text)) {
    const normalizedKind = normalizePreviewMediaKind(kind);
    if (
      normalizedKind === "image" ||
      /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(text)
    ) {
      preview.imageUrl ||= text;
      return;
    }
    if (
      normalizedKind === "video" ||
      /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(text)
    ) {
      preview.videoUrl ||= text;
      return;
    }
    if (
      normalizedKind === "audio" ||
      /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(text)
    ) {
      preview.audioUrl ||= text;
      return;
    }
    preview.fileUrl ||= text;
    return;
  }
  preview.text ||= text;
}

function firstMarkdownMediaPreview(text: string, kind: string) {
  const hintedKind = previewKindFromTextHint(text, kind);
  const imageMatch = text.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/,
  );
  if (imageMatch) {
    const url = cleanMarkdownURL(imageMatch[2]);
    if (url) {
      return {
        kind: "image" as const,
        url,
        caption: markdownMediaCaption(text, imageMatch[0], imageMatch[1]),
      };
    }
  }
  const looseImageMatch = text.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i,
  );
  if (looseImageMatch) {
    const url = cleanMarkdownURL(looseImageMatch[1]);
    if (url) {
      return {
        kind: "image" as const,
        url,
        caption: markdownMediaCaption(text, looseImageMatch[0], ""),
      };
    }
  }

  const linkPattern =
    /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkPattern.exec(text))) {
    const url = cleanMarkdownURL(linkMatch[2]);
    const mediaKind = previewMediaKindFromURL(url, hintedKind);
    if (mediaKind) {
      return {
        kind: mediaKind,
        url,
        caption: markdownMediaCaption(text, linkMatch[0], linkMatch[1]),
      };
    }
  }

  const inlineURL = firstInlineURL(text);
  const mediaKind = previewMediaKindFromURL(inlineURL, hintedKind);
  if (mediaKind) {
    return {
      kind: mediaKind,
      url: inlineURL,
      caption: markdownMediaCaption(text, inlineURL, ""),
    };
  }
  return null;
}

export function previewKindFromTextHint(text: string, kind: string) {
  if (normalizePreviewMediaKind(kind)) {
    return kind;
  }
  return textHasImagePreviewHint(text) ? "image" : kind;
}

function textHasImagePreviewHint(text: string) {
  const imageKeywordURL =
    /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(text) || imageKeywordURL.test(text);
}

function setPreviewMedia(
  preview: GeneratedNodePreview,
  kind: "image" | "video" | "audio" | "file",
  url: string,
) {
  if (kind === "image") preview.imageUrl ||= url;
  if (kind === "video") preview.videoUrl ||= url;
  if (kind === "audio") preview.audioUrl ||= url;
  if (kind === "file") preview.fileUrl ||= url;
}

function previewMediaKindFromURL(url: string, kind: string) {
  if (!url || !looksLikeURL(url)) {
    return "";
  }
  const normalizedKind = normalizePreviewMediaKind(kind);
  if (
    normalizedKind === "image" ||
    /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url)
  ) {
    return "image" as const;
  }
  if (normalizedKind === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)) {
    return "video" as const;
  }
  if (
    normalizedKind === "audio" ||
    /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(url)
  ) {
    return "audio" as const;
  }
  if (normalizedKind === "file") {
    return "file" as const;
  }
  return "";
}

function markdownMediaCaption(
  text: string,
  matchedText: string,
  label: string,
) {
  const caption = text.replace(matchedText, "").replace(/\s+/g, " ").trim();
  if (caption && caption !== text.trim() && !looksLikeURL(caption)) {
    return caption;
  }
  return String(label || "").trim();
}

function cleanMarkdownURL(value: string) {
  const url = cleanInlineURL(value);
  return looksLikeURL(url) ? url : "";
}

function firstInlineURL(text: string) {
  const match = text.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return match ? cleanInlineURL(match[0]) : "";
}

function cleanInlineURL(value: string) {
  return String(value || "")
    .trim()
    .replace(/^<|>$/g, "")
    .replace(/[.,，。；;]+$/g, "");
}

function isWrappedOutput(value: UnknownRecord) {
  return Boolean(
    value.output ||
    value.result ||
    value.content ||
    value.rich ||
    value.agent_run_id ||
    value.approval_id,
  );
}

export function hasGeneratedPreview(preview: GeneratedNodePreview) {
  const text = String(preview.text || "").trim();
  return Boolean(
    (text && !isEmptyContextText(text)) ||
    preview.imageUrl ||
    preview.videoUrl ||
    preview.audioUrl ||
    preview.fileUrl,
  );
}

export function hasGeneratedPreviewMedia(preview: GeneratedNodePreview) {
  return Boolean(
    preview.imageUrl || preview.videoUrl || preview.audioUrl || preview.fileUrl,
  );
}

function firstMediaText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (isUnknownRecord(value)) {
      const text = firstNonEmptyText(
        value.url,
        value.src,
        value.href,
        value.path,
        value.file,
        value.file_url,
        value.fileUrl,
        value.image,
        value.image_url,
        value.imageUrl,
        value.video,
        value.video_url,
        value.videoUrl,
        value.audio,
        value.audio_url,
        value.audioUrl,
        valueAtPath(value, ["attrs", "src"]),
        valueAtPath(value, ["attrs", "url"]),
        valueAtPath(value, ["attrs", "href"]),
      );
      if (text) {
        return text;
      }
    }
  }
  return "";
}

function firstMediaURLText(...values: unknown[]) {
  const text = firstMediaText(...values);
  return looksLikeURL(text) ? text : "";
}

function firstArrayValue(value: unknown) {
  return Array.isArray(value) ? value[0] : undefined;
}

export function looksLikeURL(text: string) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(text);
}

export function nodeContextOutput(node: SpaceCanvasNode) {
  return firstMeaningfulNodeOutput(
    preferRicherMediaOutput(node.asset?.version?.content, node.resultOutput),
  );
}

function firstMeaningfulNodeOutput(...values: unknown[]) {
  let fallback: unknown;
  for (const value of values) {
    if (value == null) {
      continue;
    }
    if (fallback === undefined) {
      fallback = value;
    }
    const embeddedOutput = embeddedStructuredDisplayOutput(value);
    if (embeddedOutput !== undefined) {
      return embeddedOutput;
    }
    const markdownText = plainMarkdownTextFromRichDocument(value);
    if (markdownText) {
      return { text: markdownText };
    }
    const output = firstDisplayOutput(value) || extractDisplayOutput(value);
    if (hasDisplayOutput(output) || hasContextOutput(output)) {
      return output;
    }
  }
  if (fallback !== undefined) {
    return firstDisplayOutput(fallback) || extractDisplayOutput(fallback);
  }
  return undefined;
}

function embeddedStructuredDisplayOutput(value: unknown) {
  const parsed = parseMaybeJSON(value);
  const rich = isRichDocumentLike(parsed) ? parsed : fixedRichDocument(parsed);
  if (!rich) {
    return undefined;
  }
  const richText = collectTiptapText(rich).trim();
  if (!looksLikeStructuredJSONSnippet(richText)) {
    return undefined;
  }
  const embedded = parseMaybeEmbeddedJSON(richText);
  if (embedded === richText) {
    return undefined;
  }
  const normalized = extractDisplayOutput(embedded);
  if (hasDisplayOutput(normalized) || hasContextOutput(normalized)) {
    return normalized;
  }
  return undefined;
}

function plainMarkdownTextFromRichDocument(value: unknown) {
  const parsed = parseMaybeJSON(value);
  const rich = isRichDocumentLike(parsed) ? parsed : fixedRichDocument(parsed);
  return plainMarkdownTextFromRichOutput(rich);
}

export function extractDisplayOutput(value: unknown): unknown {
  const parsed = parseMaybeJSON(value);
  const agentResult = parseAgentResultBlock(parsed);
  if (agentResult !== parsed) {
    return extractDisplayOutput(agentResult);
  }
  if (isDirectEnergonOutputObject(parsed)) {
    return parsed;
  }
  if (isUnknownRecord(parsed) && isAgentResultPayload(parsed)) {
    const output = normalizeAgentResultPayloadForEnergon(parsed);
    if (hasDisplayOutput(output)) {
      return output;
    }
  }
  const fixedRichOutput = fixedTiptapRichOutput(parsed);
  if (fixedRichOutput) {
    return fixedRichOutput.rich;
  }
  if (isRichDocumentLike(parsed)) {
    return parsed;
  }
  const rich = fixedRichDocument(parsed);
  if (rich) {
    return rich;
  }
  return normalizeDisplayOutput(extractDisplayOutputInner(parsed, new Set()));
}

function extractDisplayOutputInner(
  value: unknown,
  seen: Set<unknown>,
): unknown {
  if (!isUnknownRecord(value)) {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);

  const row = value;
  const directRich = directRichOutput(row);
  if (directRich !== undefined) {
    return directRich;
  }

  const nestedNodeOutput = firstNestedNodeOutput(row, seen);
  if (nestedNodeOutput !== undefined) {
    return nestedNodeOutput;
  }

  for (const path of displayOutputPaths) {
    const candidate = valueAtPath(row, path);
    if (candidate === undefined || candidate === value) {
      continue;
    }
    const normalized = extractDisplayOutputInner(
      parseMaybeJSON(candidate),
      seen,
    );
    if (isDisplayOutputValue(normalized)) {
      return normalized;
    }
  }

  if (isRunEnvelope(row)) {
    for (const key of ["output", "result", "data", "body"]) {
      if (row[key] === undefined || row[key] === value) {
        continue;
      }
      const normalized = extractDisplayOutputInner(
        parseMaybeJSON(row[key]),
        seen,
      );
      if (isDisplayOutputValue(normalized)) {
        return normalized;
      }
    }
  }

  return value;
}

function firstNestedNodeOutput(row: UnknownRecord, seen: Set<unknown>) {
  for (const [key, value] of Object.entries(row)) {
    if (!isLikelyNestedResultKey(key) || !value || typeof value !== "object") {
      continue;
    }
    const normalized = extractDisplayOutputInner(parseMaybeJSON(value), seen);
    if (isDisplayOutputValue(normalized)) {
      return normalized;
    }
  }
  return undefined;
}

function isLikelyNestedResultKey(key: string) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(key);
}

const displayOutputPaths = [
  ["output", "content", "rich"],
  ["output", "content"],
  ["output", "rich"],
  ["content", "output", "content", "rich"],
  ["content", "output", "content"],
  ["content", "output", "rich"],
  ["content", "data", "text"],
  ["content", "data", "content"],
  ["content", "rich"],
  ["content", "text"],
  ["data", "output", "content", "rich"],
  ["data", "output", "content"],
  ["data", "content", "rich"],
  ["data", "content"],
  ["rich"],
] as const;

function directRichOutput(row: UnknownRecord): RichDocument | undefined {
  const payloadRich = richDocumentFromPayload(row);
  if (payloadRich) {
    return payloadRich;
  }
  if (
    String(row.result_mode || "").toLowerCase() === "inline" &&
    row.content != null
  ) {
    const content = parseMaybeJSON(row.content);
    if (isUnknownRecord(content)) {
      const rich = directRichOutput(content);
      if (rich !== undefined) {
        return rich;
      }
    }
  }
  return undefined;
}

function normalizeDisplayOutput(value: unknown) {
  const parsed = parseMaybeJSON(value);
  if (
    isUnknownRecord(parsed) &&
    !parsed.type &&
    Array.isArray(parsed.content)
  ) {
    return {
      type: "doc",
      content: parsed.content,
    };
  }
  if (Array.isArray(parsed)) {
    return {
      type: "doc",
      content: parsed,
    };
  }
  return parsed;
}

function isRunEnvelope(row: UnknownRecord) {
  return Boolean(
    row.agent_run_id ||
    row.approval_id ||
    row.node_run_id ||
    row.request_id ||
    row.approved !== undefined ||
    row.message !== undefined,
  );
}

function isDisplayOutputValue(value: unknown) {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    const text = value.trim();
    return (
      text.length > 0 &&
      !looksLikeStructuredJSONSnippet(text) &&
      !isNonContentText(text)
    );
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (!isUnknownRecord(value)) {
    return true;
  }
  if (fixedRichDocument(value) || safeRichDocument(value)) {
    return true;
  }
  if (isRunEnvelope(value)) {
    return false;
  }
  const text = safeDocumentText(value).trim();
  return Boolean(text && !isEmptyContextText(text));
}

function valueAtPath(source: UnknownRecord, path: readonly string[]) {
  let current: unknown = source;
  for (const key of path) {
    if (!isUnknownRecord(current) || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function parseAgentResultBlock(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }
  const text = value.trim();
  for (const language of ["agent-result", "agent-output", "json"]) {
    const extracted = extractFencedAgentResultPayload(text, language);
    if (extracted !== undefined) {
      return extracted;
    }
  }
  return value;
}

function extractFencedAgentResultPayload(value: string, language: string) {
  const open = `\`\`\`${language}`;
  const start = value.toLowerCase().indexOf(open);
  if (start < 0) {
    return undefined;
  }
  let bodyStart = start + open.length;
  while (bodyStart < value.length && /\s/.test(value[bodyStart] || "")) {
    bodyStart += 1;
  }
  let searchStart = bodyStart;
  while (searchStart < value.length) {
    const end = value.indexOf("```", searchStart);
    const body =
      end >= 0 ? value.slice(bodyStart, end) : value.slice(bodyStart);
    const parsed = parseAgentResultJSON(body, language === "json");
    if (parsed) {
      return parsed;
    }
    if (end < 0) {
      return undefined;
    }
    searchStart = end + 3;
  }
  return undefined;
}

function parseAgentResultJSON(value: string, strict = false) {
  const text = value.trim();
  const repaired = repairJSONControlChars(text);
  for (const source of uniqueNonEmptyStrings([text, repaired])) {
    const parsed = parseMaybeJSON(source);
    if (
      parsed !== source &&
      (strict
        ? isStrictAgentResultPayload(parsed)
        : isAgentResultPayload(parsed))
    ) {
      return parsed;
    }
  }
  return null;
}

function isStrictAgentResultPayload(value: unknown): boolean {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const kind = String(value.kind || value.type || value.event || "")
    .toLowerCase()
    .trim();
  return (
    [
      "final",
      "result",
      "final_result",
      "answer",
      "tool",
      "tool_result",
      "power_result",
    ].includes(kind) ||
    "content" in value ||
    "tasks" in value ||
    "suggestions" in value ||
    "rich" in value
  );
}

function isAgentResultPayload(value: unknown): boolean {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const kind = String(value.kind || value.type || value.event || "")
    .toLowerCase()
    .trim();
  return (
    [
      "final",
      "result",
      "final_result",
      "answer",
      "tool",
      "tool_result",
      "power_result",
    ].includes(kind) ||
    "content" in value ||
    "tasks" in value ||
    "suggestions" in value ||
    [
      "title",
      "text",
      "rich",
      "images",
      "videos",
      "audios",
      "files",
      "json",
    ].some((key) => hasDisplayOutput(value[key]))
  );
}

function looksLikeJSONText(value: string) {
  const text = String(value || "").trim();
  return (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"))
  );
}

function looksLikeStructuredJSONSnippet(value: string) {
  const text = String(value || "").trim();
  return Boolean(
    text &&
    (looksLikeJSONText(text) ||
      text.startsWith("{") ||
      text.startsWith("[") ||
      text.includes('"agent_run_id"') ||
      text.includes('"node_run_id"') ||
      text.includes('"approval_id"')),
  );
}

export function stringifyContextValue(value: unknown) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return isNonContentText(value) ? "" : value;
  }
  const documentText = safeDocumentText(value).trim();
  if (documentText && isNonContentText(documentText)) {
    return "";
  }
  try {
    const text = JSON.stringify(value);
    return isEmptyContextText(text) ? "" : text;
  } catch {
    const text = String(value);
    return isNonContentText(text) ? "" : text;
  }
}

export function hasContextOutput(value: unknown) {
  const text = stringifyContextValue(value).trim();
  return Boolean(text && !isEmptyContextText(text));
}

function isEmptyContextText(text: string) {
  const normalized = text.trim();
  return (
    !normalized ||
    normalized === "{}" ||
    normalized === "[]" ||
    normalized === "null" ||
    isNonContentText(normalized)
  );
}
