import { plainMarkdownTextFromRichOutput } from "./content-output";
import { documentText, safeRichDocument } from "./rich-document";
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
      value: safeJSONString(rich),
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
  return safeJSONString(serializeAssetTextContent(draft));
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
