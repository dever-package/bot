import type { CanvasReferenceContent } from "./types";

export type CanvasReferenceTarget = {
  refType: "asset";
  refId: number;
  label: string;
  trigger?: "@" | "#";
  versionId?: number;
};

type CanvasReferenceMatch = CanvasReferenceTarget & {
  mention: string;
};

export function canvasReferenceContentFromText(
  value: string,
  targets: CanvasReferenceTarget[],
): CanvasReferenceContent {
  const text = String(value || "");
  const matches = referenceMatches(targets);
  if (!text || matches.length === 0) {
    return {
      version: 1,
      parts: text ? [{ type: "text", text }] : [],
    };
  }

  const parts: CanvasReferenceContent["parts"] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const match = nextReferenceMatch(text, cursor, matches);
    if (!match) {
      appendReferenceText(parts, text.slice(cursor));
      break;
    }
    if (match.index > cursor) {
      appendReferenceText(parts, text.slice(cursor, match.index));
    }
    parts.push({
      type: "reference",
      ref_type: match.target.refType,
      ref_id: match.target.refId,
      label: match.target.mention,
      ref_trigger: match.target.trigger || "@",
      ref_version_id: match.target.versionId,
    });
    cursor = match.index + match.target.mention.length;
  }
  return { version: 1, parts };
}

export function canvasReferenceContentHasReferences(
  content: CanvasReferenceContent | undefined,
) {
  return Boolean(
    content?.parts.some((part) => part.type === "reference"),
  );
}

export function reconcileCanvasReferenceContent(
  value: string,
  content: CanvasReferenceContent | undefined,
  targets: CanvasReferenceTarget[],
) {
  if (!content || (!value.includes("@") && !value.includes("#"))) {
    return content;
  }
  const derived = canvasReferenceContentFromText(value, [
    ...targets,
    ...canvasReferenceTargetsFromContent(content),
  ]);
  return canvasReferenceContentHasReferences(derived) ? derived : content;
}

export function canvasReferenceTargetsFromContent(
  content: CanvasReferenceContent | undefined,
) {
  if (!content) {
    return [];
  }
  return content.parts
    .filter((part) => part.type === "reference")
    .map(
      (part): CanvasReferenceTarget => ({
        refType: part.ref_type,
        refId: part.ref_id,
        label: part.label,
        trigger: part.ref_trigger === "#" ? "#" : "@",
        versionId: part.ref_version_id,
      }),
    );
}

function referenceMatches(targets: CanvasReferenceTarget[]) {
  const matches = new Map<string, CanvasReferenceMatch>();
  for (const target of targets) {
    if (target.refId <= 0) {
      continue;
    }
    const trigger = target.trigger || "@";
    const label = target.label.trim().replace(/^[@#]+/, "");
    if (!label) {
      continue;
    }
    const mention = `${trigger}${label}`;
    if (!matches.has(mention)) {
      matches.set(mention, { ...target, mention });
    }
  }
  return [...matches.values()].sort(
    (left, right) => right.mention.length - left.mention.length,
  );
}

function nextReferenceMatch(
  text: string,
  cursor: number,
  matches: CanvasReferenceMatch[],
) {
  let selected:
    | { index: number; target: CanvasReferenceMatch }
    | undefined;
  for (const target of matches) {
    const index = text.indexOf(target.mention, cursor);
    if (index < 0) {
      continue;
    }
    if (
      !selected ||
      index < selected.index ||
      (index === selected.index &&
        target.mention.length > selected.target.mention.length)
    ) {
      selected = { index, target };
    }
  }
  return selected;
}

function appendReferenceText(
  parts: CanvasReferenceContent["parts"],
  text: string,
) {
  if (!text) {
    return;
  }
  const previous = parts[parts.length - 1];
  if (previous?.type === "text") {
    previous.text += text;
    return;
  }
  parts.push({ type: "text", text });
}
