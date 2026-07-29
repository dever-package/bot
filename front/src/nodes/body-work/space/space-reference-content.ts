import type { CanvasReferenceContent } from "./types";

export type CanvasReferenceTarget = {
  refType: "asset";
  refId: number;
  label: string;
  usage?: string;
  trigger?: "@" | "#";
  versionId?: number;
  origin?: string;
  originID?: string;
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
      label: normalizeCanvasReferenceLabel(match.target.label),
      usage: match.target.usage,
      ref_trigger: match.target.trigger || "@",
      ref_version_id: match.target.versionId,
      ref_origin: match.target.origin,
      ref_origin_id: match.target.originID,
    });
    cursor = match.index + match.target.mention.length;
  }
  return { version: 1, parts };
}

export function canvasReferenceContentFromUnambiguousText(
  value: string,
  targets: CanvasReferenceTarget[],
) {
  return canvasReferenceContentFromText(
    value,
    unambiguousReferenceTargets(targets),
  );
}

export function canvasReferenceContentFromTargets(
  value: string,
  targets: CanvasReferenceTarget[],
): CanvasReferenceContent {
  const selected = uniqueReferenceTargets(
    targets,
    canvasReferenceContentTargetKey,
  );
  const content = canvasReferenceContentFromText(value, selected);
  const referencedTargets = new Set(
    canvasReferenceTargetsFromContent(content).map(
      canvasReferenceContentTargetKey,
    ),
  );
  const missingTargets = selected.filter(
    (target) => !referencedTargets.has(canvasReferenceContentTargetKey(target)),
  );
  if (!missingTargets.length) {
    return content;
  }

  const parts: CanvasReferenceContent["parts"] = [];
  for (let index = 0; index < missingTargets.length; index += 1) {
    appendReferenceTargetWithTrailingSpace(
      parts,
      missingTargets[index],
      index === missingTargets.length - 1 ? content.parts[0] : undefined,
    );
  }
  return { version: 1, parts: [...parts, ...content.parts] };
}

export function canvasReferenceContentHasReferences(
  content: CanvasReferenceContent | undefined,
) {
  return Boolean(content?.parts.some((part) => part.type === "reference"));
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
    ...canvasReferenceTargetsFromContent(content),
    ...targets,
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
        label: normalizeCanvasReferenceLabel(part.label),
        usage: part.usage,
        trigger: part.ref_trigger === "#" ? "#" : "@",
        versionId: part.ref_version_id,
        origin: part.ref_origin,
        originID: part.ref_origin_id,
      }),
    );
}

export function canvasReferenceContentText(
  content: CanvasReferenceContent | undefined,
) {
  if (!content) {
    return "";
  }
  return content.parts
    .map((part) =>
      part.type === "text"
        ? part.text
        : `${part.ref_trigger === "#" ? "#" : "@"}${normalizeCanvasReferenceLabel(part.label)}`,
    )
    .join("");
}

export function reconcileConnectedCanvasReferences(
  value: string,
  content: CanvasReferenceContent | undefined,
  targets: CanvasReferenceTarget[],
) {
  const connectedTargets = uniqueReferenceTargets(
    targets.filter(
      (target) => target.origin === "edge" && Boolean(target.originID),
    ),
    (target) => String(target.originID || ""),
  );
  const targetByOriginID = new Map(
    connectedTargets.map((target) => [String(target.originID), target]),
  );
  const sourceParts =
    content?.version === 1
      ? content.parts
      : value
        ? ([{ type: "text", text: value }] as CanvasReferenceContent["parts"])
        : [];
  const parts: CanvasReferenceContent["parts"] = [];
  const retainedOriginIDs = new Set<string>();
  let removedConnectedReference = false;

  for (const sourcePart of sourceParts) {
    if (
      sourcePart.type === "reference" &&
      sourcePart.ref_origin === "edge" &&
      sourcePart.ref_origin_id
    ) {
      const target = targetByOriginID.get(sourcePart.ref_origin_id);
      if (!target) {
        removedConnectedReference = true;
        continue;
      }
      appendReferenceTarget(parts, target);
      retainedOriginIDs.add(sourcePart.ref_origin_id);
      removedConnectedReference = false;
      continue;
    }

    if (sourcePart.type === "text") {
      let text = sourcePart.text;
      if (removedConnectedReference && /^\s/.test(text)) {
        const previous = parts[parts.length - 1];
        if (!previous || (previous.type === "text" && /\s$/.test(previous.text))) {
          text = text.slice(1);
        }
      }
      appendReferenceText(parts, text);
      removedConnectedReference = false;
      continue;
    }

    parts.push({ ...sourcePart });
    removedConnectedReference = false;
  }

  const missingTargets = connectedTargets.filter(
    (target) => !retainedOriginIDs.has(String(target.originID)),
  );
  if (missingTargets.length > 0) {
    const prefix: CanvasReferenceContent["parts"] = [];
    missingTargets.forEach((target, index) => {
      appendReferenceTarget(prefix, target);
      appendReferenceTrailingSpace(
        prefix,
        index === missingTargets.length - 1 ? parts[0] : undefined,
      );
    });
    parts.unshift(...prefix);
  }

  const nextContent: CanvasReferenceContent = { version: 1, parts };
  return {
    value: canvasReferenceContentText(nextContent),
    content: nextContent,
  };
}

export function normalizeCanvasReferenceLabel(value: string) {
  return value
    .trim()
    .replace(/^[@#]+/, "")
    .trim();
}

function referenceMatches(targets: CanvasReferenceTarget[]) {
  const matches = new Map<string, CanvasReferenceMatch>();
  for (const target of targets) {
    if (target.refId <= 0) {
      continue;
    }
    const trigger = target.trigger || "@";
    const label = normalizeCanvasReferenceLabel(target.label);
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
  let selected: { index: number; target: CanvasReferenceMatch } | undefined;
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

function uniqueReferenceTargets(
  targets: CanvasReferenceTarget[],
  targetKey: (
    target: CanvasReferenceTarget,
  ) => string = canvasReferenceTargetKey,
) {
  const result: CanvasReferenceTarget[] = [];
  const seen = new Set<string>();
  for (const target of targets) {
    if (target.refId <= 0 || !normalizeCanvasReferenceLabel(target.label)) {
      continue;
    }
    const key = targetKey(target);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(target);
  }
  return result;
}

function unambiguousReferenceTargets(targets: CanvasReferenceTarget[]) {
  const targetsByMention = new Map<
    string,
    {
      target: CanvasReferenceTarget;
      targetKey: string;
      ambiguous: boolean;
    }
  >();
  for (const target of targets) {
    const label = normalizeCanvasReferenceLabel(target.label);
    if (target.refId <= 0 || !label) {
      continue;
    }
    const mention = `${target.trigger || "@"}${label}`;
    const targetKey = canvasReferenceContentTargetKey(target);
    const current = targetsByMention.get(mention);
    if (!current) {
      targetsByMention.set(mention, {
        target,
        targetKey,
        ambiguous: false,
      });
      continue;
    }
    if (current.targetKey !== targetKey) {
      current.ambiguous = true;
    }
  }
  return [...targetsByMention.values()]
    .filter((entry) => !entry.ambiguous)
    .map((entry) => entry.target);
}

function canvasReferenceContentTargetKey(target: CanvasReferenceTarget) {
  return `${canvasReferenceTargetKey(target)}:${target.usage || ""}`;
}

function canvasReferenceTargetKey(target: CanvasReferenceTarget) {
  return target.originID
    ? `${target.refType}:${target.refId}:${target.origin || ""}:${target.originID}`
    : `${target.refType}:${target.refId}`;
}

function appendReferenceTarget(
  parts: CanvasReferenceContent["parts"],
  target: CanvasReferenceTarget,
) {
  parts.push({
    type: "reference",
    ref_type: target.refType,
    ref_id: target.refId,
    label: normalizeCanvasReferenceLabel(target.label),
    usage: target.usage,
    ref_trigger: target.trigger || "@",
    ref_version_id: target.versionId,
    ref_origin: target.origin,
    ref_origin_id: target.originID,
  });
}

function appendReferenceTargetWithTrailingSpace(
  parts: CanvasReferenceContent["parts"],
  target: CanvasReferenceTarget,
  followingPart?: CanvasReferenceContent["parts"][number],
) {
  appendReferenceTarget(parts, target);
  appendReferenceTrailingSpace(parts, followingPart);
}

function appendReferenceTrailingSpace(
  parts: CanvasReferenceContent["parts"],
  followingPart?: CanvasReferenceContent["parts"][number],
) {
  if (followingPart?.type === "text" && /^\s/.test(followingPart.text)) {
    return;
  }
  appendReferenceText(parts, " ");
}
