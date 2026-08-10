import { getCompatModule } from "@dever/front-plugin";
import { STORYBOARD_GRID_MAX_IMAGES } from "./storyboard-grid-layout";
import { embeddedJSONValues, isPlainRecord } from "./structured-json";
import {
  collectMediaContent,
  createMediaContentIndex,
  pairOrderedAudioCoverItems,
  type MediaContentIndex,
  type MediaContentItem,
} from "./media-content";

type PlainRichNode = {
  type?: unknown;
  text?: unknown;
  marks?: unknown;
  attrs?: Record<string, unknown>;
  content?: PlainRichNode[];
};

type PlainRichDocument = PlainRichNode & {
  content: PlainRichNode[];
};

export type ContentMediaKind = "image" | "video" | "audio";

export type ContentMediaItem = MediaContentItem;

export type ContentSupplementalText = {
  label: "歌词" | "创作内容";
  text: string;
};

export type StoryboardGridFrame = {
  id: string;
  order: number;
  title: string;
  description: string;
  prompt: string;
  status: string;
  image: string;
  error: string;
  assetID: number;
  assetVersionID: number;
};

export type StoryboardGridDocument = {
  type: "storyboard_grid";
  version: number;
  title: string;
  summary: string;
  frames: StoryboardGridFrame[];
};

const CONTENT_MEDIA_KINDS: ContentMediaKind[] = ["image", "video", "audio"];

type ContentOutputMediaIndex = MediaContentIndex<ContentMediaKind>;

type ContentOutputCache<T> = {
  objects: WeakMap<object, T>;
  strings: Map<string, T>;
};

const CONTENT_OUTPUT_STRING_CACHE_LIMIT = 64;
const CONTENT_OUTPUT_MAX_CACHEABLE_STRING_LENGTH = 128 * 1024;
const CONTENT_OUTPUT_CACHE_MISS = Symbol("content-output-cache-miss");
const contentMediaIndexCache = createContentOutputCache<ContentOutputMediaIndex>();
const storyboardGridCache =
  createContentOutputCache<StoryboardGridDocument | null>();

type ContentOutputModule = {
  normalizeEnergonOutput?: (output: any) => any[];
};

const contentOutputModule = getCompatModule(
  "@/components/energon/content-view",
) as ContentOutputModule;

export const normalizeEnergonOutput =
  contentOutputModule.normalizeEnergonOutput;

export function firstNonEmptyText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

export function contentOutputSupplementalText(
  value: unknown,
): ContentSupplementalText | null {
  const lyrics = firstNamedContentText(
    value,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    new Set<object>(),
    0,
  );
  if (lyrics) {
    return { label: "歌词", text: lyrics };
  }
  const text = firstNamedContentText(
    value,
    ["text"],
    new Set<object>(),
    0,
  );
  return text ? { label: "创作内容", text } : null;
}

function firstNamedContentText(
  value: unknown,
  keys: readonly string[],
  seen: Set<object>,
  depth: number,
): string {
  if (value == null || depth > 12) {
    return "";
  }
  if (typeof value === "string") {
    for (const parsed of embeddedJSONValues(value)) {
      const text = firstNamedContentText(parsed, keys, seen, depth + 1);
      if (text) {
        return text;
      }
    }
    return "";
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = firstNamedContentText(item, keys, seen, depth + 1);
      if (text) {
        return text;
      }
    }
    return "";
  }
  if (!isPlainRecord(value) || seen.has(value)) {
    return "";
  }
  seen.add(value);
  for (const key of keys) {
    const text = normalizedSupplementalText(value[key], depth + 1);
    if (text) {
      return text;
    }
  }
  for (const key of [
    "output",
    "result",
    "data",
    "body",
    "value",
    "json",
    "rich",
    "content",
  ]) {
    const text = firstNamedContentText(value[key], keys, seen, depth + 1);
    if (text) {
      return text;
    }
  }
  return "";
}

function normalizedSupplementalText(value: unknown, depth: number): string {
  if (value == null || depth > 12) {
    return "";
  }
  if (typeof value === "string") {
    const text = value.trim();
    if (!text || /^(https?:\/\/|\/|data:|blob:)/i.test(text)) {
      return "";
    }
    const embedded = embeddedJSONValues(text);
    if (embedded.length > 0) {
      return embedded
        .map((item) => normalizedSupplementalText(item, depth + 1))
        .filter(Boolean)
        .join("\n");
    }
    return text;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizedSupplementalText(item, depth + 1))
      .filter(Boolean)
      .join("\n");
  }
  if (!isPlainRecord(value)) {
    return "";
  }
  for (const key of ["text", "content", "line", "lines", "value"]) {
    const text = normalizedSupplementalText(value[key], depth + 1);
    if (text) {
      return text;
    }
  }
  return "";
}

export function plainMarkdownTextFromRichOutput(value: unknown) {
  const content = markdownCompatibleRichContent(value);
  if (!content || content.hasMedia) {
    return "";
  }
  return content.markdown;
}

export function markdownCompatibleRichContent(value: unknown) {
  const rich = plainRichDocument(value);
  if (!rich || !isMarkdownCompatibleRichNode(rich)) {
    return null;
  }
  return {
    markdown: rich.content
      .map(markdownCompatibleRichNodeText)
      .join("\n\n")
      .trim(),
    plainText: rich.content
      .map(markdownCompatibleRichNodePlainText)
      .join("\n\n")
      .trim(),
    hasMedia: richNodeHasMedia(rich),
  };
}

export function looksLikeMarkdownSyntax(value: string) {
  return (
    /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(value) ||
    /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(value)
  );
}

export function contentOutputHasMedia(output: unknown) {
  return contentOutputMediaKinds(output).length > 0;
}

export function contentOutputMediaKinds(output: unknown) {
  const media = contentOutputMediaIndex(output);
  return CONTENT_MEDIA_KINDS.filter((kind) => media[kind].size > 0);
}

export function contentOutputMediaCount(output: unknown) {
  const media = contentOutputMediaIndex(output);
  return CONTENT_MEDIA_KINDS.reduce(
    (total, kind) => total + media[kind].size,
    0,
  );
}

export function contentOutputMediaURLs(
  output: unknown,
  kind: ContentMediaKind,
) {
  return Array.from(contentOutputMediaIndex(output)[kind].keys());
}

export function contentOutputMediaItems(
  output: unknown,
  kind: ContentMediaKind,
) {
  return Array.from(contentOutputMediaIndex(output)[kind].values());
}

export function storyboardGridImageURLs(value: unknown) {
  const grid = parseStoryboardGridOutput(value);
  if (!grid) {
    return [];
  }
  return Array.from(
    new Set(grid.frames.map((frame) => frame.image.trim()).filter(Boolean)),
  );
}

export function parseStoryboardGridOutput(
  value: unknown,
): StoryboardGridDocument | null {
  const cached = readContentOutputCache(storyboardGridCache, value);
  if (cached !== CONTENT_OUTPUT_CACHE_MISS) {
    return cached;
  }
  return writeContentOutputCache(
    storyboardGridCache,
    value,
    findStoryboardGrid(value, new Set<object>(), 0),
  );
}

export function contentOutputHasType(value: unknown, expectedType: string) {
  const normalizedType = expectedType.trim().toLowerCase();
  return normalizedType
    ? findContentOutputType(value, normalizedType, new Set<object>(), 0)
    : false;
}

export function preferRicherMediaOutput(...values: unknown[]) {
  let fallback: unknown;
  let selected: unknown;
  let selectedMediaCount = 0;
  for (const value of values) {
    if (!hasContentOutput(value)) {
      continue;
    }
    if (fallback === undefined) {
      fallback = value;
    }
    const mediaCount = contentOutputMediaCount(value);
    if (mediaCount > selectedMediaCount) {
      selected = value;
      selectedMediaCount = mediaCount;
    }
  }
  return selectedMediaCount > 0 ? selected : fallback;
}

export function hasContentOutput(value: unknown) {
  if (value == null || value === "") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

function contentOutputMediaIndex(output: unknown) {
  const cached = readContentOutputCache(contentMediaIndexCache, output);
  if (cached !== CONTENT_OUTPUT_CACHE_MISS) {
    return cached;
  }
  const media = createMediaContentIndex(CONTENT_MEDIA_KINDS);
  const storyboardGridImages = storyboardGridImageURLs(output);
  const seen = new Set<object>();
  for (const item of normalizeContentOutputItems(output)) {
    collectMediaContent(media, item, { seen });
  }
  // Normalizers may reuse nested object references while flattening media to
  // URLs. Revisit the raw payload with a fresh seen-set so thumbnail metadata
  // can upgrade an already indexed URL instead of being skipped.
  collectMediaContent(media, output);
  pairOrderedAudioCoverItems(media);
  if (storyboardGridImages.length > 0) {
    // The ordered frames are the image source of truth for a grid document.
    // Parent covers and nested planning payloads must not become extra inputs.
    media.image = new Map(
      storyboardGridImages.map((url) => [url, { url, thumbnail: url }]),
    );
  }
  return writeContentOutputCache(contentMediaIndexCache, output, media);
}

function createContentOutputCache<T>(): ContentOutputCache<T> {
  return {
    objects: new WeakMap<object, T>(),
    strings: new Map<string, T>(),
  };
}

function readContentOutputCache<T>(
  cache: ContentOutputCache<T>,
  value: unknown,
): T | typeof CONTENT_OUTPUT_CACHE_MISS {
  if (value && typeof value === "object") {
    return cache.objects.has(value)
      ? (cache.objects.get(value) as T)
      : CONTENT_OUTPUT_CACHE_MISS;
  }
  if (!isCacheableContentOutputString(value) || !cache.strings.has(value)) {
    return CONTENT_OUTPUT_CACHE_MISS;
  }
  const cached = cache.strings.get(value) as T;
  cache.strings.delete(value);
  cache.strings.set(value, cached);
  return cached;
}

function writeContentOutputCache<T>(
  cache: ContentOutputCache<T>,
  value: unknown,
  result: T,
) {
  if (value && typeof value === "object") {
    cache.objects.set(value, result);
    return result;
  }
  if (!isCacheableContentOutputString(value)) {
    return result;
  }
  cache.strings.delete(value);
  cache.strings.set(value, result);
  while (cache.strings.size > CONTENT_OUTPUT_STRING_CACHE_LIMIT) {
    const oldestKey = cache.strings.keys().next().value;
    if (typeof oldestKey !== "string") {
      break;
    }
    cache.strings.delete(oldestKey);
  }
  return result;
}

function isCacheableContentOutputString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= CONTENT_OUTPUT_MAX_CACHEABLE_STRING_LENGTH
  );
}

export function normalizeContentOutputItems(output: unknown): unknown[] {
  if (!hasContentOutput(output)) {
    return [];
  }
  const normalized = normalizeEnergonOutput?.(output);
  if (Array.isArray(normalized) && normalized.length > 0) {
    return normalized;
  }
  return Array.isArray(output) ? output : [output];
}

function findContentOutputType(
  value: unknown,
  expectedType: string,
  seen: Set<object>,
  depth: number,
): boolean {
  if (value == null || depth > 12) {
    return false;
  }
  if (typeof value === "string") {
    return embeddedJSONValues(value).some((parsed) =>
      findContentOutputType(parsed, expectedType, seen, depth + 1),
    );
  }
  if (Array.isArray(value)) {
    return value.some((item) =>
      findContentOutputType(item, expectedType, seen, depth + 1),
    );
  }
  if (!isPlainRecord(value) || seen.has(value)) {
    return false;
  }
  seen.add(value);
  if (
    String(value.type || "")
      .trim()
      .toLowerCase() === expectedType
  ) {
    return true;
  }
  return [
    value.json,
    value.output,
    value.result,
    value.data,
    value.content,
    value.body,
    value.value,
    value.text,
    value.finalOutput,
    value.final_output,
    value.rich,
  ].some((nested) =>
    findContentOutputType(nested, expectedType, seen, depth + 1),
  );
}

function findStoryboardGrid(
  value: unknown,
  seen: Set<object>,
  depth: number,
): StoryboardGridDocument | null {
  if (value == null || depth > 12) {
    return null;
  }
  if (typeof value === "string") {
    const text = value.trim();
    if (!text || (!text.startsWith("{") && !text.startsWith("["))) {
      return null;
    }
    try {
      return findStoryboardGrid(JSON.parse(text), seen, depth + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const grid = findStoryboardGrid(item, seen, depth + 1);
      if (grid) {
        return grid;
      }
    }
    return null;
  }
  if (!isPlainRecord(value) || seen.has(value)) {
    return null;
  }
  seen.add(value);

  const direct = normalizeStoryboardGridDocument(value);
  if (direct) {
    return direct;
  }
  for (const key of [
    "json",
    "storyboard_grid",
    "output",
    "result",
    "data",
    "content",
    "body",
    "value",
    "text",
    "rich",
  ]) {
    const grid = findStoryboardGrid(value[key], seen, depth + 1);
    if (grid) {
      return grid;
    }
  }
  return null;
}

function normalizeStoryboardGridDocument(
  value: Record<string, unknown>,
): StoryboardGridDocument | null {
  if (
    String(value.type || "")
      .trim()
      .toLowerCase() !== "storyboard_grid" ||
    !Array.isArray(value.frames)
  ) {
    return null;
  }
  const frames = value.frames
    .map(normalizeStoryboardGridFrame)
    .filter((frame): frame is StoryboardGridFrame => Boolean(frame))
    .sort((left, right) => left.order - right.order);
  if (frames.length < 2 || frames.length > STORYBOARD_GRID_MAX_IMAGES) {
    return null;
  }
  return {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(value.version) || 1)),
    title: firstNonEmptyText(value.title, "宫格图片"),
    summary: firstNonEmptyText(value.summary),
    frames,
  };
}

function normalizeStoryboardGridFrame(
  value: unknown,
  index: number,
): StoryboardGridFrame | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  const order = Math.max(1, Math.trunc(Number(value.order) || index + 1));
  return {
    id: firstNonEmptyText(value.id, `frame-${String(order).padStart(2, "0")}`),
    order,
    title: firstNonEmptyText(
      value.title,
      `画面 ${String(order).padStart(2, "0")}`,
    ),
    description: firstNonEmptyText(value.description),
    prompt: firstNonEmptyText(value.prompt),
    status: firstNonEmptyText(value.status),
    image: firstStoryboardGridFrameImage(
      value.image,
      value.image_url,
      value.imageUrl,
    ),
    error: firstNonEmptyText(value.error),
    assetID: positiveInteger(value.asset_id, value.assetId, value.assetID),
    assetVersionID: positiveInteger(
      value.asset_version_id,
      value.assetVersionId,
      value.assetVersionID,
    ),
  };
}

function firstStoryboardGridFrameImage(...values: unknown[]) {
  for (const value of values) {
    const media = createMediaContentIndex(["image"] as const);
    collectMediaContent(media, value, { kind: "image" });
    const image = media.image.values().next().value;
    if (image?.url) {
      return image.url;
    }
  }
  return "";
}

function positiveInteger(...values: unknown[]) {
  for (const value of values) {
    const number = Math.trunc(Number(value) || 0);
    if (number > 0) {
      return number;
    }
  }
  return 0;
}

function plainRichDocument(value: unknown): PlainRichDocument | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  if (value.type === "doc" && Array.isArray(value.content)) {
    return value as PlainRichDocument;
  }
  return isPlainRecord(value.rich) &&
    value.rich.type === "doc" &&
    Array.isArray(value.rich.content)
    ? (value.rich as PlainRichDocument)
    : null;
}

function isMarkdownCompatibleRichNode(node: unknown): boolean {
  if (!isPlainRecord(node)) {
    return false;
  }
  if (node.type === "text") {
    return !Array.isArray(node.marks) || node.marks.length === 0;
  }
  if (node.type === "hardBreak") {
    return true;
  }
  if (isRichImageNode(node)) {
    return Boolean(imageSource(node));
  }
  if (node.type !== "doc" && node.type !== "paragraph") {
    return false;
  }
  return (
    Array.isArray(node.content) &&
    node.content.every(isMarkdownCompatibleRichNode)
  );
}

function markdownCompatibleRichNodeText(node: PlainRichNode): string {
  if (node.type === "text") {
    return String(node.text || "");
  }
  if (node.type === "hardBreak") {
    return "\n";
  }
  if (isRichImageNode(node)) {
    const alt = escapeMarkdownImageAlt(
      String(node.attrs?.alt || node.attrs?.caption || "图片"),
    );
    return `![${alt}](<${escapeMarkdownImageSource(imageSource(node))}>)`;
  }
  return Array.isArray(node.content)
    ? node.content.map(markdownCompatibleRichNodeText).join("")
    : "";
}

function markdownCompatibleRichNodePlainText(node: PlainRichNode): string {
  if (node.type === "text") {
    return String(node.text || "");
  }
  if (node.type === "hardBreak") {
    return "\n";
  }
  if (isRichImageNode(node)) {
    return "";
  }
  return Array.isArray(node.content)
    ? node.content.map(markdownCompatibleRichNodePlainText).join("")
    : "";
}

function richNodeHasMedia(node: PlainRichNode): boolean {
  return (
    isRichImageNode(node) ||
    Boolean(node.content?.some((child) => richNodeHasMedia(child)))
  );
}

function isRichImageNode(node: PlainRichNode) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(node.type || ""),
  );
}

function imageSource(node: PlainRichNode) {
  return String(node.attrs?.src || "").trim();
}

function escapeMarkdownImageAlt(value: string) {
  return value.replace(/([\\\[\]])/g, "\\$1");
}

function escapeMarkdownImageSource(value: string) {
  return value.replace(/</g, "%3C").replace(/>/g, "%3E");
}
