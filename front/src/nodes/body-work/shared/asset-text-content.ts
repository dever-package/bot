import { plainMarkdownTextFromRichOutput } from "./content-output";
import {
  documentText,
  safeRichDocument,
  type RichDocumentNode,
} from "./rich-document";
import {
  isPlainRecord,
  parseMaybeJSON,
  safeJSONString,
} from "./structured-json";

export type AssetTextContentDraft = {
  kind: "text" | "richtext";
  contentFormat: "json" | "markdown";
  value: string;
};

export function resolveAssetTextContentDraft(
  kind: AssetTextContentDraft["kind"],
  content: unknown,
): AssetTextContentDraft {
  if (kind === "text") {
    return {
      kind,
      contentFormat: "markdown",
      value: editablePlainText(content),
    };
  }

  const rich = safeRichDocument(content);
  if (rich) {
    return {
      kind,
      contentFormat: "json",
      value: safeJSONString(withCompactParagraphBoundaries(rich)),
    };
  }
  return {
    kind,
    contentFormat: "markdown",
    value: markdownEnvelopeText(content) || documentText(content),
  };
}

export function assetTextContentWithValue(
  draft: AssetTextContentDraft,
  value: string,
): AssetTextContentDraft {
  return { ...draft, value };
}

export function assetTextContentEditorValue(draft: AssetTextContentDraft) {
  if (draft.kind !== "richtext" || draft.contentFormat !== "json") {
    return draft.value;
  }
  const document = safeRichDocument(parseMaybeJSON(draft.value));
  return document
    ? safeJSONString(
        withAssetEditorMediaDefaults(withCompactParagraphBoundaries(document)),
      )
    : draft.value;
}

export function serializeAssetTextContent(draft: AssetTextContentDraft) {
  if (draft.contentFormat === "markdown") {
    return { format: "markdown", text: draft.value };
  }
  return (
    safeRichDocument(parseMaybeJSON(draft.value)) || {
      type: "doc",
      content: [],
    }
  );
}

export function assetTextContentFingerprint(draft: AssetTextContentDraft) {
  const content = serializeAssetTextContent(draft);
  if (draft.kind !== "richtext" || draft.contentFormat !== "json") {
    return stableJSONString(content);
  }
  const document = safeRichDocument(content);
  return stableJSONString(
    document
      ? withoutEditorDefaultAttributes(withAssetEditorMediaDefaults(document))
      : content,
  );
}

function editablePlainText(content: unknown) {
  return (
    markdownEnvelopeText(content) ||
    plainMarkdownTextFromRichOutput(content) ||
    documentText(content)
  );
}

function markdownEnvelopeText(content: unknown) {
  const parsed = parseMaybeJSON(content);
  if (!isPlainRecord(parsed)) {
    return typeof parsed === "string" ? parsed : "";
  }
  if (
    String(parsed.format || "")
      .trim()
      .toLowerCase() !== "markdown"
  ) {
    return "";
  }
  return String(parsed.text || parsed.markdown || "");
}

function withAssetEditorMediaDefaults(
  node: RichDocumentNode,
): RichDocumentNode {
  const next: RichDocumentNode = { ...node };
  if (node.content) {
    next.content = node.content.map(withAssetEditorMediaDefaults);
  }
  if (
    (node.type === "editorMediaImage" || node.type === "editorMediaVideo") &&
    !String(node.attrs?.maxWidth || "").trim()
  ) {
    next.attrs = { ...(node.attrs || {}), maxWidth: "100%" };
  }
  return next;
}

function withCompactParagraphBoundaries(
  node: RichDocumentNode,
): RichDocumentNode {
  const next: RichDocumentNode = { ...node };
  if (!node.content) return next;

  const content =
    node.type === "doc"
      ? node.content.filter((child) => !isImportedSpacerParagraph(child))
      : node.content;
  next.content = content.map(withCompactParagraphBoundaries);
  if (node.type === "paragraph") {
    while (next.content.at(-1)?.type === "hardBreak") {
      next.content.pop();
    }
  }
  return next;
}

function isImportedSpacerParagraph(node: RichDocumentNode) {
  return (
    node.type === "paragraph" &&
    Boolean(node.content?.length) &&
    node.content?.every(
      (child) =>
        child.type === "hardBreak" ||
        (child.type === "text" && !String(child.text || "").trim()),
    )
  );
}

function withoutEditorDefaultAttributes(
  node: RichDocumentNode,
): RichDocumentNode {
  const next: RichDocumentNode = { type: node.type };
  const attrs = nonEmptyAttributes(node.attrs);
  if (attrs) next.attrs = attrs;
  if (node.content) {
    next.content = node.content.map(withoutEditorDefaultAttributes);
  }
  if (node.marks) {
    next.marks = node.marks.map((mark) => {
      const markAttrs = nonEmptyAttributes(mark.attrs);
      return markAttrs ? { ...mark, attrs: markAttrs } : { type: mark.type };
    });
  }
  if (node.text != null) next.text = node.text;
  return next;
}

function nonEmptyAttributes(attrs?: Record<string, unknown>) {
  if (!attrs) return undefined;
  const entries = Object.entries(attrs).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function stableJSONString(value: unknown) {
  return safeJSONString(withStableObjectKeys(value));
}

function withStableObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(withStableObjectKeys);
  }
  if (!isPlainRecord(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, withStableObjectKeys(value[key])]),
  );
}
