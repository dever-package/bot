import type {
  CanvasReferenceContent,
  CanvasStoryboardReference,
  CanvasStoryboardReferencePurpose,
  StoryboardReferencePurposeSpec,
  StoryboardWorkType,
  StoryboardWorkTypeSpec,
} from "./types";
import { isPlainRecord as isRecord } from "../shared/structured-json";

export type StoryboardReferenceAssetItem = {
  refId?: number;
  versionID?: number;
  title?: string;
  kind?: string;
};

export function normalizeStoryboardReferences(
  value: unknown,
): CanvasStoryboardReference[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const result: CanvasStoryboardReference[] = [];
  const usedKeys = new Set<string>();
  const usedAssets = new Set<number>();
  for (const raw of value) {
    if (!isRecord(raw)) {
      continue;
    }
    const assetID = positiveInteger(raw.asset_id ?? raw.assetId);
    const kind = normalizeReferenceKind(raw.kind);
    const purpose = normalizeStoryboardReferencePurpose(raw.purpose);
    if (!assetID || !kind || !purpose || usedAssets.has(assetID)) {
      continue;
    }
    let key = String(raw.key || "").trim() || storyboardReferenceKey(assetID);
    if (usedKeys.has(key)) {
      key = storyboardReferenceKey(assetID);
    }
    if (usedKeys.has(key)) {
      continue;
    }
    const versionID = positiveInteger(raw.version_id ?? raw.versionId);
    const label =
      String(raw.label || "").trim() || `参考素材 ${result.length + 1}`;
    result.push({
      key,
      asset_id: assetID,
      ...(versionID ? { version_id: versionID } : {}),
      label,
      kind,
      purpose,
    });
    usedKeys.add(key);
    usedAssets.add(assetID);
  }
  return result;
}

export function reconcileStoryboardReferenceState(
  content: CanvasReferenceContent | undefined,
  current: CanvasStoryboardReference[] | undefined,
  assets: StoryboardReferenceAssetItem[],
  _prompt: string,
  workType: StoryboardWorkType,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  const currentByAssetID = new Map(
    normalizeStoryboardReferences(current).map((reference) => [
      reference.asset_id,
      reference,
    ]),
  );
  const assetsByID = new Map(
    assets.flatMap((asset) => {
      const id = positiveInteger(asset.refId);
      return id ? [[id, asset] as const] : [];
    }),
  );
  const result: CanvasStoryboardReference[] = [];
  const parts = (content?.parts || []).map((part) => ({ ...part }));
  const usedAssets = new Set<number>();
  for (const [partIndex, part] of (content?.parts || []).entries()) {
    if (part.type !== "reference" || part.ref_type !== "asset") {
      continue;
    }
    const assetID = positiveInteger(part.ref_id);
    if (!assetID || usedAssets.has(assetID)) {
      continue;
    }
    const existing = currentByAssetID.get(assetID);
    const asset = assetsByID.get(assetID);
    const kind = normalizeReferenceKind(asset?.kind) || existing?.kind;
    if (!kind) {
      continue;
    }
    const versionID = positiveInteger(asset?.versionID || part.ref_version_id);
    const label =
      String(asset?.title || part.label || existing?.label || "").trim() ||
      `参考素材 ${result.length + 1}`;
    const purposeOptions = storyboardReferencePurposeOptions(
      kind,
      workType,
      purposeSpecs,
    );
    const requestedPurpose = normalizeStoryboardReferencePurpose(part.purpose);
    const existingPurpose = normalizeStoryboardReferencePurpose(
      existing?.purpose,
    );
    const purpose =
      [requestedPurpose, existingPurpose].find((candidate) =>
        purposeOptions.some((option) => option.value === candidate),
      ) ||
      defaultStoryboardReferencePurpose(kind, workType, purposeSpecs);
    const nextPart = parts[partIndex];
    if (nextPart?.type === "reference") {
      nextPart.purpose = purpose || undefined;
    }
    result.push({
      key: existing?.key || storyboardReferenceKey(assetID),
      asset_id: assetID,
      ...(versionID ? { version_id: versionID } : {}),
      label,
      kind,
      purpose,
    });
    usedAssets.add(assetID);
  }
  return {
    content: content ? { ...content, parts } : undefined,
    references: result,
  };
}

export function storyboardReferenceUsageOptions(
  workType: StoryboardWorkType,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  return purposeSpecs
    .filter(
      (spec) =>
        spec.work_types.length === 0 || spec.work_types.includes(workType),
    )
    .map((spec) => ({
      key: spec.key,
      label: spec.name,
      acceptedKinds: [...spec.media_kinds],
    }));
}

export function storyboardReferencePurposeOptions(
  kind: CanvasStoryboardReference["kind"],
  workType: StoryboardWorkType,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  return purposeSpecs
    .filter(
      (spec) =>
        spec.media_kinds.includes(kind) &&
        (spec.work_types.length === 0 || spec.work_types.includes(workType)),
    )
    .map((spec) => ({ value: spec.key, label: spec.name }));
}

export function storyboardReferencePurposeSpec(
  purpose: string,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  return purposeSpecs.find((spec) => spec.key === purpose);
}

export function storyboardReferencePurposeLabel(
  purpose: string,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  return storyboardReferencePurposeSpec(purpose, purposeSpecs)?.name || purpose;
}

export function storyboardReferenceValidationError(
  references: CanvasStoryboardReference[],
  workType: StoryboardWorkType,
  workTypeSpecs: StoryboardWorkTypeSpec[],
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  const workTypeSpec = workTypeSpecs.find((spec) => spec.key === workType);
  if (!workTypeSpec || purposeSpecs.length === 0) {
    return "分镜作品类型或参考用途配置无效";
  }
  const purposeCounts = new Map<string, number>();
  for (const reference of references) {
    const purposeSpec = storyboardReferencePurposeSpec(
      reference.purpose,
      purposeSpecs,
    );
    if (!purposeSpec) {
      return `参考素材“${reference.label}”的用途无效`;
    }
    if (!purposeSpec.media_kinds.includes(reference.kind)) {
      return `参考素材“${reference.label}”的类型不支持用途“${purposeSpec.name}”`;
    }
    if (
      purposeSpec.work_types.length > 0 &&
      !purposeSpec.work_types.includes(workType)
    ) {
      return `当前作品类型不支持“${reference.label}”的用途“${purposeSpec.name}”`;
    }
    const count = (purposeCounts.get(reference.purpose) || 0) + 1;
    purposeCounts.set(reference.purpose, count);
    if (purposeSpec.max_count > 0 && count > purposeSpec.max_count) {
      return `用途“${purposeSpec.name}”最多只能选择 ${purposeSpec.max_count} 个素材`;
    }
  }
  for (const purpose of workTypeSpec.required_reference_purposes) {
    if (!purposeCounts.get(purpose)) {
      return `${workTypeSpec.name}必须添加“${storyboardReferencePurposeLabel(
        purpose,
        purposeSpecs,
      )}”`;
    }
  }
  return "";
}

export function storyboardReferenceKey(assetID: number) {
  return `ref-${assetID}`;
}

export function normalizeStoryboardReferencePurpose(
  value: unknown,
): CanvasStoryboardReferencePurpose | undefined {
  const purpose = String(value || "").trim();
  return purpose
    ? (purpose as CanvasStoryboardReferencePurpose)
    : undefined;
}

function defaultStoryboardReferencePurpose(
  kind: CanvasStoryboardReference["kind"],
  workType: StoryboardWorkType,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  const options = storyboardReferencePurposeOptions(kind, workType, purposeSpecs);
  const defaultSpec = purposeSpecs.find(
    (spec) =>
      spec.default_media_kinds.includes(kind) &&
      (spec.work_types.length === 0 || spec.work_types.includes(workType)),
  );
  return defaultSpec?.key || options[0]?.value || "";
}

function normalizeReferenceKind(
  value: unknown,
): CanvasStoryboardReference["kind"] | undefined {
  const kind = String(value || "").trim().toLowerCase();
  return kind === "image" || kind === "video" || kind === "audio"
    ? kind
    : undefined;
}

function positiveInteger(value: unknown) {
  const number = Number(value || 0);
  return Number.isInteger(number) && number > 0 ? number : 0;
}
