import type {
  CanvasReferenceContent,
  CanvasStoryboardReference,
  CanvasStoryboardReferencePurpose,
} from "./types";
import { isPlainRecord as isRecord } from "../shared/structured-json";

export const STORYBOARD_REFERENCE_PURPOSES = [
  "visual_style",
  "motion_style",
  "character",
  "scene",
  "prop",
  "shot",
] as const;

export const STORYBOARD_REFERENCE_PURPOSE_LABELS: Record<
  CanvasStoryboardReferencePurpose,
  string
> = {
  visual_style: "视觉风格",
  motion_style: "动态风格",
  character: "角色参考",
  scene: "场景参考",
  prop: "道具参考",
  shot: "镜头参考",
};

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
    if (
      !assetID ||
      !kind ||
      !purpose ||
      !storyboardReferencePurposeSupportsKind(kind, purpose) ||
      usedAssets.has(assetID)
    ) {
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
      instruction: String(raw.instruction || "").trim(),
    });
    usedKeys.add(key);
    usedAssets.add(assetID);
  }
  return result;
}

export function reconcileStoryboardReferences(
  content: CanvasReferenceContent | undefined,
  current: CanvasStoryboardReference[] | undefined,
  assets: StoryboardReferenceAssetItem[],
  prompt: string,
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
  const usedAssets = new Set<number>();
  for (const part of content?.parts || []) {
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
    result.push({
      key: existing?.key || storyboardReferenceKey(assetID),
      asset_id: assetID,
      ...(versionID ? { version_id: versionID } : {}),
      label,
      kind,
      purpose:
        existing?.purpose || inferStoryboardReferencePurpose(prompt, label, kind),
      instruction: existing?.instruction || "",
    });
    usedAssets.add(assetID);
  }
  return result;
}

export function storyboardReferencePurposeOptions(
  kind: CanvasStoryboardReference["kind"],
) {
  const purposes: CanvasStoryboardReferencePurpose[] =
    kind === "video"
      ? ["motion_style", "visual_style", "shot"]
      : ["visual_style", "character", "scene", "prop", "shot"];
  return purposes.map((value) => ({
    value,
    label: STORYBOARD_REFERENCE_PURPOSE_LABELS[value],
  }));
}

function storyboardReferencePurposeSupportsKind(
  kind: CanvasStoryboardReference["kind"],
  purpose: CanvasStoryboardReferencePurpose,
) {
  return storyboardReferencePurposeOptions(kind).some(
    (option) => option.value === purpose,
  );
}

export function storyboardReferenceKey(assetID: number) {
  return `ref-${assetID}`;
}

export function normalizeStoryboardReferencePurpose(
  value: unknown,
): CanvasStoryboardReferencePurpose | undefined {
  const purpose = String(value || "") as CanvasStoryboardReferencePurpose;
  return STORYBOARD_REFERENCE_PURPOSES.includes(purpose)
    ? purpose
    : undefined;
}

function inferStoryboardReferencePurpose(
  prompt: string,
  label: string,
  kind: CanvasStoryboardReference["kind"],
): CanvasStoryboardReferencePurpose {
  const context = storyboardReferenceContext(prompt, label);
  if (/角色|人物|主角|外貌|长相|形象/.test(context) && kind === "image") {
    return "character";
  }
  if (/场景|环境|地点|空间/.test(context) && kind === "image") {
    return "scene";
  }
  if (/道具|产品|商品|物品/.test(context) && kind === "image") {
    return "prop";
  }
  if (/镜头|构图|画面/.test(context)) {
    return "shot";
  }
  if (/运镜|节奏|动作|转场|剪辑/.test(context) && kind === "video") {
    return "motion_style";
  }
  if (/风格|画风|色调|光线|质感|视觉/.test(context)) {
    return "visual_style";
  }
  return kind === "video" ? "motion_style" : "visual_style";
}

function storyboardReferenceContext(prompt: string, label: string) {
  const mention = `@${String(label || "").replace(/^@+/, "")}`;
  const index = prompt.indexOf(mention);
  if (index < 0) {
    return prompt;
  }
  return prompt.slice(Math.max(0, index - 24), index + mention.length + 32);
}

function normalizeReferenceKind(
  value: unknown,
): CanvasStoryboardReference["kind"] | undefined {
  const kind = String(value || "").trim().toLowerCase();
  return kind === "image" || kind === "video" ? kind : undefined;
}

function positiveInteger(value: unknown) {
  const number = Number(value || 0);
  return Number.isInteger(number) && number > 0 ? number : 0;
}
