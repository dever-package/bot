import type {
  AssetKind,
  AssetLibraryType,
  AssetRecord,
  OfficialMaterialCatalog,
  OfficialMaterialCategory,
  OfficialMaterialKind,
} from "./asset-types";

const materialKindToAssetKind: Record<OfficialMaterialKind, AssetKind> = {
  prompt: "text",
  image: "image",
  audio: "audio",
  video: "video",
};

const assetKindToMaterialKind: Partial<
  Record<AssetKind, OfficialMaterialKind>
> = {
  text: "prompt",
  image: "image",
  audio: "audio",
  video: "video",
};

export function normalizeOfficialMaterialCatalog(
  value: any,
): OfficialMaterialCatalog {
  const kinds = rows(value?.kinds).flatMap((item) => {
    const id = normalizeMaterialKind(item?.id);
    if (!id) return [];
    return [
      {
        id,
        name: text(item?.name) || materialKindLabel(id),
        assetKind: materialKindToAssetKind[id],
      },
    ];
  });
  const supportedKinds = new Set(kinds.map((item) => item.id));
  const categories = rows(value?.categories).flatMap((item) => {
    const id = positiveNumber(item?.id);
    const kind = normalizeMaterialKind(item?.kind);
    if (!id || !kind || !supportedKinds.has(kind)) return [];
    return [{ id, name: text(item?.name) || "未命名分类", kind }];
  });
  return {
    enabled: Boolean(value?.enabled) && kinds.length > 0,
    pack: {
      id: positiveNumber(value?.pack?.id),
      name: text(value?.pack?.name),
      description: text(value?.pack?.description),
    },
    kinds,
    categories,
  };
}

export function defaultOfficialAssetKind(
  catalog: OfficialMaterialCatalog,
  allowedKinds: AssetKind[],
): AssetKind | "" {
  const allowed = new Set(allowedKinds);
  const available = catalog.kinds
    .map((item) => item.assetKind)
    .filter((kind) => allowed.size === 0 || allowed.has(kind));
  return available.includes("text") ? "text" : available[0] || "";
}

export function officialCategoriesForKind(
  catalog: OfficialMaterialCatalog,
  assetKind: AssetKind | "",
): OfficialMaterialCategory[] {
  const materialKind = materialKindForAssetKind(assetKind);
  return materialKind
    ? catalog.categories.filter((item) => item.kind === materialKind)
    : [];
}

export function materialKindForAssetKind(
  assetKind: AssetKind | "",
): OfficialMaterialKind | "" {
  return assetKindToMaterialKind[assetKind as AssetKind] || "";
}

export function normalizeOfficialMaterial(value: any): AssetRecord {
  const id = positiveNumber(value?.id);
  const materialKind = normalizeMaterialKind(value?.kind) || "prompt";
  const kind = materialKindToAssetKind[materialKind];
  const resourceURL = text(value?.resource_url);
  const content =
    materialKind === "prompt"
      ? { text: text(value?.content) }
      : { [`${materialKind}s`]: resourceURL ? [resourceURL] : [] };
  const summary = text(value?.description);
  const createdAt = text(value?.created_at);
  return {
    libraryType: "material",
    id,
    projectID: 0,
    bodyID: 0,
    teamID: 0,
    flowID: 0,
    canvasID: 0,
    assetCateID: 0,
    collectionID: 0,
    nodeKey: "",
    sourceType: "official",
    sourceID: 0,
    sourceName: "素材库",
    materialCateID: positiveNumber(value?.cate_id),
    materialCateName: text(value?.cate_name),
    materialKind,
    name: text(value?.name) || "未命名素材",
    nameMode: "manual",
    kind,
    role: "material",
    versionID: 0,
    status: "current",
    summary,
    collectionCount: 0,
    collectionPreviews: [],
    createdAt,
    deletedAt: "",
    version: {
      id: 0,
      assetID: id,
      runID: 0,
      nodeRunID: 0,
      releaseID: 0,
      requestID: "",
      nodeKey: "",
      source: { material_kind: materialKind },
      version: 1,
      content,
      summary,
      createdAt,
      updatedAt: createdAt,
    },
  };
}

export function assetLibraryKey(asset: {
  id: number;
  libraryType?: AssetLibraryType;
}) {
  return `${asset.libraryType === "material" ? "material" : "asset"}:${asset.id}`;
}

function normalizeMaterialKind(value: unknown): OfficialMaterialKind | "" {
  const kind = text(value) as OfficialMaterialKind;
  return Object.prototype.hasOwnProperty.call(materialKindToAssetKind, kind)
    ? kind
    : "";
}

function materialKindLabel(kind: OfficialMaterialKind) {
  return { prompt: "提示词", image: "图片", audio: "音频", video: "视频" }[
    kind
  ];
}

function rows(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? Math.trunc(number) : 0;
}
