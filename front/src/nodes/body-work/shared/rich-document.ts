import {
  isPlainRecord as isRecord,
  looksLikeJSONContainer,
} from "./structured-json";

export type RichDocumentNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichDocumentNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
};

const richMediaAliases: Record<string, string> = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo",
};

const richWrapperKeys = [
  "rich",
  "value",
  "doc",
  "document",
  "content",
  "data",
  "output",
  "result",
  "body",
] as const;

export function documentPreview(content: unknown): string {
  const text = documentText(content);
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

export function documentText(content: unknown): string {
  return collectDocumentText(content).replace(/\s+/g, " ").trim();
}

export function looseRichJSONText(content: unknown): string {
  if (typeof content !== "string") {
    return "";
  }
  const text = content.trim();
  if (!isLikelyRichJSONSnippet(text)) {
    return "";
  }
  const richStart = text.search(/"rich"\s*:/);
  const source = richStart >= 0 ? text.slice(richStart) : text;
  const pieces: string[] = [];
  const textField = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let match: RegExpExecArray | null = null;
  while ((match = textField.exec(source)) !== null) {
    const value = decodeJSONStringFragment(match[1]).trim();
    if (value) {
      pieces.push(value);
    }
  }
  return pieces.join(" ").replace(/\s+/g, " ").trim();
}

export function richDocument(content: unknown): RichDocumentNode | null {
  const doc = findRichDocument(content, new Set());
  return hasVisibleRichDocument(doc) ? doc : null;
}

export function safeDocumentText(content: unknown) {
  try {
    return documentText(content);
  } catch {
    return "";
  }
}

export function safeRichDocument(content: unknown) {
  try {
    return richDocument(content);
  } catch {
    return null;
  }
}

function collectDocumentText(value: unknown): string {
  if (typeof value === "string") {
    const text = value.trim();
    if (looksLikeJSONContainer(text)) {
      const parsed = parseJSONValue(text);
      if (parsed !== undefined) {
        return collectDocumentText(parsed).trim();
      }
    }
    return looseRichJSONText(text) || value;
  }
  if (Array.isArray(value)) {
    return value.map(collectDocumentText).filter(Boolean).join(" ");
  }
  if (!isRecord(value)) {
    return "";
  }
  const rich = richDocument(value);
  if (rich) {
    return collectRichDocumentText(rich);
  }
  const pieces = [
    typeof value.text === "string" ? value.text : "",
    typeof value.markdown === "string" ? value.markdown : "",
  ];
  for (const key of richWrapperKeys) {
    if (value[key] != null) {
      pieces.push(collectDocumentText(value[key]));
    }
  }
  return pieces.filter(Boolean).join(" ");
}

function findRichDocument(
  value: unknown,
  seen: Set<unknown>,
): RichDocumentNode | null {
  if (typeof value === "string") {
    const text = value.trim();
    if (!looksLikeJSONContainer(text)) {
      return null;
    }
    const parsed = parseJSONValue(text);
    return parsed === undefined ? null : findRichDocument(parsed, seen);
  }
  if (Array.isArray(value)) {
    const doc = normalizeRichDocument({ type: "doc", content: value });
    if (hasVisibleRichDocument(doc)) {
      return doc;
    }
    for (const item of value) {
      const nested = findRichDocument(item, seen);
      if (nested) {
        return nested;
      }
    }
    return null;
  }
  if (!isRecord(value) || seen.has(value)) {
    return null;
  }
  seen.add(value);

  const direct = normalizeRichDocument(value);
  if (direct) {
    return direct;
  }
  if (
    String(value.format || "").toLowerCase() === "rich_json" &&
    value.rich != null
  ) {
    const rich = findRichDocument(value.rich, seen);
    if (rich) {
      return rich;
    }
  }
  for (const key of richWrapperKeys) {
    if (value[key] == null) {
      continue;
    }
    const rich = findRichDocument(value[key], seen);
    if (rich) {
      return rich;
    }
  }
  return null;
}

function normalizeRichDocument(value: unknown): RichDocumentNode | null {
  if (!isRecord(value) || normalizeRichNodeType(value.type) !== "doc") {
    return null;
  }
  return {
    type: "doc",
    attrs: isRecord(value.attrs) ? value.attrs : undefined,
    content: normalizeRichContent(value.content),
  };
}

function normalizeRichContent(content: unknown): RichDocumentNode[] {
  if (!Array.isArray(content)) {
    return [];
  }
  return content
    .map(normalizeRichNode)
    .filter((node): node is RichDocumentNode => Boolean(node));
}

function normalizeRichNode(value: unknown): RichDocumentNode | null {
  if (!isRecord(value)) {
    return null;
  }
  const type = normalizeRichNodeType(value.type) || inferRichNodeType(value);
  if (!type) {
    return null;
  }
  const node: RichDocumentNode = { type };
  const attrs = isRecord(value.attrs) ? { ...value.attrs } : {};
  if (type === "heading" && numberValue(attrs.level) <= 0) {
    const level = numberValue(value.level);
    if (level > 0) {
      attrs.level = level;
    }
  }
  if (Object.keys(attrs).length > 0) {
    node.attrs = attrs;
  }
  const marks = normalizeRichMarks(value.marks);
  if (marks.length > 0) {
    node.marks = marks;
  }
  if (type === "text") {
    const text = stringValue(value.text);
    if (!text) {
      return null;
    }
    node.text = text;
    return node;
  }
  const children = normalizeRichContent(value.content);
  if (children.length > 0) {
    node.content = children;
  }
  return node;
}

function inferRichNodeType(value: Record<string, unknown>) {
  if (typeof value.text === "string") {
    return "text";
  }
  const attrs = isRecord(value.attrs) ? value.attrs : {};
  return numberValue(attrs.level) > 0 || numberValue(value.level) > 0
    ? "heading"
    : "";
}

function normalizeRichMarks(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((mark) => {
      if (!isRecord(mark)) {
        return null;
      }
      const type = stringValue(mark.type);
      return type
        ? {
            type,
            attrs: isRecord(mark.attrs) ? mark.attrs : undefined,
          }
        : null;
    })
    .filter((mark): mark is { type: string; attrs?: Record<string, unknown> } =>
      Boolean(mark),
    );
}

function normalizeRichNodeType(value: unknown) {
  const type = stringValue(value);
  return richMediaAliases[type] || type;
}

function collectRichDocumentText(node: RichDocumentNode | null): string {
  if (!node) {
    return "";
  }
  if (node.type === "text") {
    return node.text || "";
  }
  if (
    node.type === "editorMediaImage" ||
    node.type === "editorMediaVideo" ||
    node.type === "editorMediaAudio"
  ) {
    return stringValue(node.attrs?.alt || node.attrs?.title || node.attrs?.src);
  }
  return (node.content || [])
    .map(collectRichDocumentText)
    .filter(Boolean)
    .join(" ");
}

function hasVisibleRichDocument(node: RichDocumentNode | null): boolean {
  if (!node) {
    return false;
  }
  if (node.type === "text") {
    return Boolean(stringValue(node.text));
  }
  if (
    node.type === "editorMediaImage" ||
    node.type === "editorMediaVideo" ||
    node.type === "editorMediaAudio"
  ) {
    return Boolean(stringValue(node.attrs?.src));
  }
  return (node.content || []).some(hasVisibleRichDocument);
}

function parseJSONValue(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function isLikelyRichJSONSnippet(value: string) {
  return (
    value.includes("rich_json") ||
    value.includes('"rich"') ||
    value.includes("agent_run_id") ||
    value.includes("node_run_id")
  );
}

function decodeJSONStringFragment(value: string) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\");
  }
}

function numberValue(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function stringValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
