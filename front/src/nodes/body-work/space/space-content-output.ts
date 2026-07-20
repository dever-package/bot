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
    /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(
      value,
    )
  );
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

function isPlainRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
