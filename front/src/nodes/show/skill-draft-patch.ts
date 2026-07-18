import { streamValueText as valueText } from "@/lib/stream";

export type SkillDraftPatchPayload = {
  id?: number;
  pack_id?: number;
  cate_id?: number;
  patch: Record<string, unknown>;
};

export function resolveSkillDraftPatchPayload(
  output: Record<string, unknown>,
): SkillDraftPatchPayload | null {
  const source = skillDraftPatchSource(output);
  const patchSource = source ? skillDraftPatchPayloadSource(source) : null;
  if (!source || !patchSource) {
    return null;
  }
  const patch = isPlainRecord(patchSource.patch)
    ? patchSource.patch
    : isPlainRecord(patchSource.draft)
      ? patchSource.draft
      : null;
  if (!patch) {
    return null;
  }
  const draftID =
    positiveRecordNumber(patchSource, "draft_id", "draftId", "id") ||
    positiveRecordNumber(source, "draft_id", "draftId", "id");
  const packID =
    positiveRecordNumber(patchSource, "pack_id", "packId") ||
    positiveRecordNumber(source, "pack_id", "packId");
  const cateID =
    positiveRecordNumber(patchSource, "cate_id", "cateId") ||
    positiveRecordNumber(source, "cate_id", "cateId");
  return {
    ...(draftID > 0 ? { id: draftID } : {}),
    ...(packID > 0 ? { pack_id: packID } : {}),
    ...(cateID > 0 ? { cate_id: cateID } : {}),
    patch,
  };
}

function skillDraftPatchPayloadSource(source: Record<string, unknown>) {
  const result = isPlainRecord(source.result) ? source.result : null;
  const content = isPlainRecord(source.content) ? source.content : null;
  const candidates = [
    source,
    isPlainRecord(source.json) ? source.json : null,
    content && isPlainRecord(content.json) ? content.json : null,
    result,
    result && isPlainRecord(result.json) ? result.json : null,
  ];
  return (
    candidates.find(
      (candidate): candidate is Record<string, unknown> =>
        isPlainRecord(candidate) &&
        (isPlainRecord(candidate.patch) || isPlainRecord(candidate.draft)),
    ) || null
  );
}

function skillDraftPatchSource(output: Record<string, unknown>) {
  const candidates = [
    output,
    isPlainRecord(output.json) ? output.json : null,
    isPlainRecord(output.content) && isPlainRecord(output.content.json)
      ? output.content.json
      : null,
    isPlainRecord(output.result) ? output.result : null,
    isPlainRecord(output.result) && isPlainRecord(output.result.json)
      ? output.result.json
      : null,
  ];
  for (const candidate of candidates) {
    if (isPlainRecord(candidate) && isSkillDraftPatchObject(candidate)) {
      return candidate;
    }
  }
  for (const text of skillDraftPatchTextCandidates(output)) {
    for (const block of extractJSONBlocks(text)) {
      const parsed = parseSkillDraftPatchJSON(block);
      if (parsed) {
        return parsed;
      }
    }
  }
  return null;
}

function isSkillDraftPatchObject(candidate: Record<string, unknown>) {
  const kind = valueText(candidate.kind || candidate.type || candidate.event)
    .trim()
    .toLowerCase();
  return (
    kind === "skill_draft_patch" ||
    isPlainRecord(candidate.patch) ||
    isPlainRecord(candidate.draft)
  );
}

function skillDraftPatchTextCandidates(output: Record<string, unknown>) {
  const candidates: string[] = [];
  const pushText = (value: unknown) => {
    const text = valueText(value).trim();
    if (text && !candidates.includes(text)) {
      candidates.push(text);
    }
  };
  pushText(output.text);
  pushText(output.markdown);
  pushText(output.message);
  const content = isPlainRecord(output.content) ? output.content : null;
  if (content) {
    pushText(content.text);
    pushText(content.markdown);
    pushText(content.message);
  }
  return candidates;
}

function extractJSONBlocks(text: string) {
  const blocks: string[] = [];
  for (const match of text.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const block = match[1]?.trim();
    if (block) {
      blocks.push(block);
    }
  }
  blocks.push(...extractBalancedJSONObjects(text));
  if (blocks.length === 0) {
    blocks.push(text);
  }
  return [...new Set(blocks)];
}

function extractBalancedJSONObjects(text: string) {
  const results: string[] = [];
  for (let start = 0; start < text.length; start += 1) {
    if (text[start] !== "{") {
      continue;
    }
    const block = readBalancedJSONObject(text, start);
    if (block) {
      results.push(block);
      start += block.length - 1;
    }
  }
  return results;
}

function readBalancedJSONObject(text: string, start: number) {
  let depth = 0;
  let inString = false;
  let escaping = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString && escaping) {
      escaping = false;
      continue;
    }
    if (inString && char === "\\") {
      escaping = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }
  return "";
}

function parseSkillDraftPatchJSON(text: string) {
  try {
    const parsed: unknown = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return (
        parsed.find(
          (item): item is Record<string, unknown> =>
            isPlainRecord(item) && isSkillDraftPatchObject(item),
        ) || null
      );
    }
    if (isPlainRecord(parsed) && isSkillDraftPatchObject(parsed)) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

function positiveRecordNumber(
  value: Record<string, unknown>,
  ...keys: string[]
) {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      continue;
    }
    const number = Number(value[key] || 0);
    if (Number.isFinite(number) && number > 0) {
      return number;
    }
  }
  return 0;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
