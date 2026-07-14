type PlainRichNode = {
  type?: unknown;
  text?: unknown;
  marks?: unknown;
  content?: PlainRichNode[];
};

type PlainRichDocument = PlainRichNode & {
  content: PlainRichNode[];
};

export function plainMarkdownTextFromRichOutput(value: unknown) {
  const rich = plainRichDocument(value);
  if (!rich || !isPlainMarkdownRichNode(rich)) {
    return "";
  }
  return rich.content
    .map(plainMarkdownRichNodeText)
    .join("\n\n")
    .trim();
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

function isPlainMarkdownRichNode(node: unknown): boolean {
  if (!isPlainRecord(node)) {
    return false;
  }
  if (node.type === "text") {
    return !Array.isArray(node.marks) || node.marks.length === 0;
  }
  if (node.type === "hardBreak") {
    return true;
  }
  if (node.type !== "doc" && node.type !== "paragraph") {
    return false;
  }
  return (
    Array.isArray(node.content) &&
    node.content.every(isPlainMarkdownRichNode)
  );
}

function plainMarkdownRichNodeText(node: PlainRichNode): string {
  if (node.type === "text") {
    return String(node.text || "");
  }
  if (node.type === "hardBreak") {
    return "\n";
  }
  return Array.isArray(node.content)
    ? node.content.map(plainMarkdownRichNodeText).join("")
    : "";
}

function isPlainRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
