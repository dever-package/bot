import {
  contentOutputHasMedia,
  firstNonEmptyText,
  looksLikeMarkdownSyntax,
  markdownCompatibleRichContent,
  normalizeContentOutputItems,
  parseStoryboardGridOutput,
  plainMarkdownTextFromRichOutput,
  preferRicherMediaOutput,
  type StoryboardGridDocument,
} from "../../shared/content-output";
import {
  documentText,
  richDocument,
  safeRichDocument,
} from "../../shared/rich-document";
import {
  parseStoryboardOutput,
  storyboardSummary,
  type StoryboardDocument,
} from "../space-storyboard";
import {
  firstDefinedValue as firstDefined,
  isPlainRecord as isRecord,
  parseMaybeJSON,
  safeJSONString,
} from "../../shared/structured-json";
import type { AssetVersion, SpaceCanvasNode } from "../types";

export type NodeDetailContentMode =
  | "rich"
  | "storyboard"
  | "storyboard_grid"
  | "file";
export type NodeDetailContentFormat = "json" | "markdown";

export type NodeDetailFileValue = {
  url: string;
  name: string;
  description: string;
};

export type NodeDetailEditableContent = {
  mode: NodeDetailContentMode;
  value:
    | string
    | StoryboardDocument
    | StoryboardGridDocument
    | NodeDetailFileValue;
  format: NodeDetailContentFormat;
  summary: string;
  downloadUrl: string;
};

export function resolveNodeDetailContent(
  node: SpaceCanvasNode,
  version?: AssetVersion,
): NodeDetailEditableContent {
  const raw = resolveNodeDetailRawContent(node, version);
  const storyboardGrid = parseStoryboardGridOutput(raw);
  if (storyboardGrid) {
    return {
      mode: "storyboard_grid",
      value: storyboardGrid,
      format: "json",
      summary: storyboardGridSummary(storyboardGrid),
      downloadUrl: "",
    };
  }
  const storyboard = parseStoryboardOutput(raw);
  if (storyboard) {
    return {
      mode: "storyboard",
      value: storyboard,
      format: "json",
      summary: storyboardSummary(storyboard),
      downloadUrl: "",
    };
  }

  const directRich = directRichDocument(raw);
  if (directRich) {
    const markdown = isExplicitRichJSON(raw)
      ? null
      : markdownCompatibleRichContent(directRich);
    if (
      markdown &&
      (node.kind === "text" || looksLikeMarkdownSyntax(markdown.plainText))
    ) {
      return markdownContent(markdown.markdown);
    }
    return richContent(directRich);
  }

  const file = fileValueFromOutput(raw);
  if (file) {
    return {
      mode: "file",
      value: file,
      format: "json",
      summary: file.description || file.name || "文件内容",
      downloadUrl: file.url,
    };
  }

  const directMarkdown = directMarkdownText(raw);
  if (directMarkdown) {
    return markdownContent(directMarkdown);
  }

  const protocolRich = protocolRichDocument(raw);
  if (protocolRich) {
    return richContent(protocolRich);
  }

  const markdown = markdownTextFromOutput(raw) || node.description || "";
  return markdownContent(markdown);
}

export function resolveNodeDetailMediaOutput(
  node: SpaceCanvasNode,
  version?: AssetVersion,
  options: { includeNodeResult?: boolean } = {},
) {
  const raw =
    options.includeNodeResult === false
      ? version?.content
      : preferRicherMediaOutput(
          version?.content,
          node.asset?.version?.content,
          node.resultOutput,
          valueAtPath(node, "result", "output"),
        );
  const parsedRaw = parseMaybeJSON(raw);
  if (parseStoryboardGridOutput(parsedRaw)) {
    return undefined;
  }
  const embeddedText = plainMarkdownTextFromRichOutput(parsedRaw);
  for (const parsed of [parsedRaw, parseMaybeJSON(embeddedText)]) {
    if (contentOutputHasMedia(parsed)) {
      return mediaDisplayOutput(parsed);
    }
  }
  const directMedia = directMediaOutput(node.kind, parsedRaw);
  if (directMedia) {
    return directMedia;
  }
  return undefined;
}

function mediaDisplayOutput(value: unknown) {
  const items = normalizeContentOutputItems(value);
  const displayItems = items.map((item) => {
    if (!isRecord(item) || item.json === undefined) {
      return item;
    }
    const displayItem = { ...item };
    delete displayItem.json;
    return displayItem;
  });
  return displayItems.length === 1 ? displayItems[0] : displayItems;
}

function resolveNodeDetailRawContent(
  node: SpaceCanvasNode,
  version?: AssetVersion,
) {
  return firstDefined(
    version?.content,
    node.asset?.version?.content,
    node.resultOutput,
    valueAtPath(node, "result", "output"),
    node.description,
  );
}

export function serializeNodeDetailContent(
  content: NodeDetailEditableContent,
): unknown {
  if (
    content.mode === "storyboard" ||
    content.mode === "storyboard_grid"
  ) {
    return content.value;
  }
  if (content.mode === "file") {
    return fileContent(content.value as NodeDetailFileValue);
  }
  const value = String(content.value || "");
  if (content.format === "markdown") {
    return { format: "markdown", text: value };
  }
  return safeRichDocument(parseMaybeJSON(value)) || plainTextDocument(value);
}

export function nodeDetailContentFingerprint(
  content: NodeDetailEditableContent,
) {
  return safeJSONString(serializeNodeDetailContent(content));
}

export function nodeDetailContentWithValue(
  content: NodeDetailEditableContent,
  value: NodeDetailEditableContent["value"],
): NodeDetailEditableContent {
  const next = { ...content, value };
  if (next.mode === "storyboard") {
    next.summary = storyboardSummary(value as StoryboardDocument);
  } else if (next.mode === "storyboard_grid") {
    next.summary = storyboardGridSummary(value as StoryboardGridDocument);
  } else if (next.mode === "file") {
    const file = value as NodeDetailFileValue;
    next.summary = file.description || file.name || "文件内容";
    next.downloadUrl = file.url;
  } else {
    next.summary = summarizeText(documentText(serializeNodeDetailContent(next)));
  }
  return next;
}

function storyboardGridSummary(grid: StoryboardGridDocument) {
  return firstNonEmptyText(
    grid.summary,
    `${grid.title || "宫格图片"} · ${grid.frames.length} 张`,
  );
}

function richContent(value: NonNullable<ReturnType<typeof richDocument>>) {
  const text = documentText(value);
  return {
    mode: "rich" as const,
    value: safeJSONString(value),
    format: "json" as const,
    summary: summarizeText(text),
    downloadUrl: firstRichMediaURL(value),
  };
}

function markdownContent(value: string): NodeDetailEditableContent {
  return {
    mode: "rich",
    value,
    format: "markdown",
    summary: summarizeText(value),
    downloadUrl: "",
  };
}

function protocolRichDocument(raw: unknown) {
  if (typeof raw === "string" && parseMaybeJSON(raw) === raw) {
    return null;
  }
  const normalized = normalizeContentOutputItems(raw);
  const content: any[] = [];
  const seenValues = new Set<object>();
  const seenText = new Set<string>();
  const seenMedia = new Set<string>();
  collectProtocolNodes(
    normalized,
    content,
    seenValues,
    seenText,
    seenMedia,
    0,
  );
  if (content.length === 0) {
    return null;
  }
  return safeRichDocument({ type: "doc", content });
}

function collectProtocolNodes(
  value: unknown,
  content: any[],
  seenValues: Set<object>,
  seenText: Set<string>,
  seenMedia: Set<string>,
  depth: number,
) {
  if (value == null || depth > 12) {
    return;
  }
  const parsed = parseMaybeJSON(value);
  if (typeof parsed === "string") {
    appendParagraph(content, parsed, seenText);
    return;
  }
  if (Array.isArray(parsed)) {
    parsed.forEach((item) =>
      collectProtocolNodes(
        item,
        content,
        seenValues,
        seenText,
        seenMedia,
        depth + 1,
      ),
    );
    return;
  }
  if (!isRecord(parsed) || seenValues.has(parsed)) {
    return;
  }
  seenValues.add(parsed);

  const directRich = directRichDocument(parsed);
  if (directRich) {
    for (const child of directRich.content || []) {
      content.push(child);
    }
    return;
  }

  appendParagraph(
    content,
    firstNonEmptyText(parsed.title, parsed.text),
    seenText,
  );
  appendMediaFields(parsed, content, seenMedia);

  for (const key of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value",
  ]) {
    if (parsed[key] !== undefined) {
      collectProtocolNodes(
        parsed[key],
        content,
        seenValues,
        seenText,
        seenMedia,
        depth + 1,
      );
    }
  }
}

function appendMediaFields(
  row: Record<string, any>,
  content: any[],
  seen: Set<string>,
) {
  const fields = [
    { kind: "image", values: [row.image, row.image_url, row.imageUrl, row.images] },
    { kind: "video", values: [row.video, row.video_url, row.videoUrl, row.videos] },
    { kind: "audio", values: [row.audio, row.audio_url, row.audioUrl, row.audios] },
  ] as const;
  for (const field of fields) {
    for (const value of field.values) {
      for (const url of mediaURLs(value)) {
        const key = `${field.kind}:${url}`;
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        content.push({
          type: mediaNodeType(field.kind),
          attrs: { src: url },
        });
      }
    }
  }
}

function appendParagraph(content: any[], value: unknown, seen: Set<string>) {
  const text = String(value || "").trim();
  if (
    !text ||
    looksLikeURL(text) ||
    looksLikeStructuredJSON(text) ||
    seen.has(text)
  ) {
    return;
  }
  seen.add(text);
  content.push({
    type: "paragraph",
    content: [{ type: "text", text }],
  });
}

function mediaURLs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(mediaURLs);
  }
  if (typeof value === "string") {
    return looksLikeURL(value.trim()) ? [value.trim()] : [];
  }
  if (!isRecord(value)) {
    return [];
  }
  return [
    value.url,
    value.src,
    value.path,
    value.download_url,
    value.downloadUrl,
  ].flatMap(mediaURLs);
}

function fileValueFromOutput(value: unknown): NodeDetailFileValue | null {
  const parsed = parseMaybeJSON(value);
  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      const file = fileValueFromOutput(item);
      if (file) {
        return file;
      }
    }
    return null;
  }
  if (!isRecord(parsed)) {
    return null;
  }
  const url = firstURL(
    parsed.file,
    parsed.file_url,
    parsed.fileUrl,
    parsed.files,
  );
  if (url) {
    return {
      url,
      name:
        firstNonEmptyText(parsed.name, parsed.filename, parsed.title) ||
        fileName(url),
      description: firstNonEmptyText(
        parsed.description,
        parsed.text,
        parsed.summary,
      ),
    };
  }
  for (const key of ["content", "output", "result", "data", "body", "value"]) {
    if (parsed[key] !== undefined) {
      const file = fileValueFromOutput(parsed[key]);
      if (file) {
        return file;
      }
    }
  }
  return null;
}

function fileContent(file: NodeDetailFileValue) {
  return {
    type: "file",
    file_url: file.url,
    name: file.name || fileName(file.url),
    description: file.description.trim(),
  };
}

function directMediaOutput(kind: SpaceCanvasNode["kind"], value: unknown) {
  if (kind !== "image" && kind !== "video" && kind !== "audio") {
    return undefined;
  }
  const urls = mediaURLs(value);
  if (urls.length === 0) {
    return undefined;
  }
  return {
    [`${kind}s`]: urls,
  };
}

function markdownTextFromOutput(value: unknown): string {
  const parsed = parseMaybeJSON(value);
  if (typeof parsed === "string") {
    return looksLikeStructuredJSON(parsed) ? "" : parsed;
  }
  if (Array.isArray(parsed)) {
    return parsed.map(markdownTextFromOutput).filter(Boolean).join("\n\n");
  }
  if (!isRecord(parsed)) {
    return "";
  }
  const direct = firstNonEmptyText(
    parsed.text,
    parsed.summary,
    parsed.description,
  );
  if (direct) {
    return direct;
  }
  for (const key of ["content", "output", "result", "data", "body", "value"]) {
    if (parsed[key] !== undefined) {
      const text = markdownTextFromOutput(parsed[key]);
      if (text) {
        return text;
      }
    }
  }
  return "";
}

function directMarkdownText(value: unknown) {
  const parsed = parseMaybeJSON(value);
  if (typeof parsed === "string") {
    return looksLikeStructuredJSON(parsed) ? "" : parsed;
  }
  if (!isRecord(parsed)) {
    return "";
  }
  const format = String(parsed.format || "").trim().toLowerCase();
  return format === "markdown"
    ? firstNonEmptyText(parsed.text, parsed.markdown)
    : "";
}

function plainTextDocument(value: string) {
  const blocks = value.split(/\n{2,}/).map((block) => block.trim());
  return {
    type: "doc",
    content: (blocks.length ? blocks : [""]).map((block) => ({
      type: "paragraph",
      content: block ? [{ type: "text", text: block }] : [],
    })),
  };
}

function firstRichMediaURL(value: any): string {
  if (!value || typeof value !== "object") {
    return "";
  }
  if (
    ["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
      String(value.type || ""),
    )
  ) {
    return String(value.attrs?.src || "").trim();
  }
  for (const child of Array.isArray(value.content) ? value.content : []) {
    const url = firstRichMediaURL(child);
    if (url) {
      return url;
    }
  }
  return "";
}

function directRichDocument(value: unknown) {
  const parsed = parseMaybeJSON(value);
  if (!isRecord(parsed)) {
    return null;
  }
  if (String(parsed.type || "") === "doc") {
    return safeRichDocument(parsed);
  }
  const wrapperKeys = Object.keys(parsed).filter((key) => key !== "format");
  if (wrapperKeys.length === 1 && wrapperKeys[0] === "rich") {
    return safeRichDocument(parsed.rich);
  }
  if (String(parsed.format || "").trim().toLowerCase() === "rich_json") {
    return safeRichDocument(parsed.rich ?? parsed.content);
  }
  return null;
}

function isExplicitRichJSON(value: unknown) {
  const parsed = parseMaybeJSON(value);
  return (
    isRecord(parsed) &&
    String(parsed.format || "").trim().toLowerCase() === "rich_json"
  );
}

function mediaNodeType(kind: "image" | "video" | "audio") {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio",
  }[kind];
}

function firstURL(...values: unknown[]) {
  for (const value of values) {
    const url = mediaURLs(value)[0];
    if (url) {
      return url;
    }
  }
  return "";
}

function valueAtPath(value: unknown, ...path: string[]) {
  let current: any = value;
  for (const key of path) {
    if (!isRecord(current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function fileName(url: string) {
  const clean = url.split(/[?#]/)[0] || "";
  const name = clean.split("/").pop() || "";
  try {
    return decodeURIComponent(name) || "文件";
  } catch {
    return name || "文件";
  }
}

function summarizeText(value: string) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > 120 ? `${text.slice(0, 120)}…` : text || "暂无内容";
}

function looksLikeURL(value: string) {
  return /^(https?:\/\/|\/|data:)/i.test(value);
}

function looksLikeStructuredJSON(value: string) {
  const text = value.trim();
  return (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"))
  );
}
