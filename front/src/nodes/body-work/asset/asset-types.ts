export type AssetSourceType =
  | "project"
  | "tool"
  | "dialogue"
  | "upload"
  | "official";
export type AssetLibraryType = "asset" | "material";
export type AssetView = "assets" | "trash";
export type AssetContentMode = "preview" | "full";
export type AssetRole = "work" | "material";
export type AssetKind =
  | "collection"
  | "text"
  | "image"
  | "audio"
  | "video"
  | "richtext"
  | "file";

export type AssetVersion = {
  id: number;
  assetID: number;
  runID: number;
  nodeRunID: number;
  releaseID: number;
  requestID: string;
  nodeKey: string;
  source: Record<string, unknown>;
  version: number;
  content?: unknown;
  summary: string;
  createdAt: string;
  updatedAt: string;
};

export type AssetRecord = {
  libraryType: AssetLibraryType;
  id: number;
  projectID: number;
  bodyID: number;
  teamID: number;
  flowID: number;
  assetCateID: number;
  collectionID: number;
  nodeKey: string;
  sourceType: AssetSourceType;
  sourceID: number;
  sourceName: string;
  materialCateID: number;
  materialCateName: string;
  materialKind: OfficialMaterialKind | "";
  name: string;
  nameMode: "auto" | "manual";
  kind: AssetKind;
  role: AssetRole;
  versionID: number;
  status: string;
  summary: string;
  collectionCount: number;
  collectionPreviews: AssetCollectionPreview[];
  createdAt: string;
  deletedAt: string;
  version: AssetVersion | null;
};

export type AssetCollectionPreview = {
  id: number;
  kind: "image" | "video";
  content: unknown;
};

export type AssetFilters = {
  sourceType: "" | AssetSourceType;
  sourceID: number;
  projectID: number;
  assetCateID: number;
  materialCateID: number;
  nodeKey: string;
  role: "" | AssetRole;
  kind: "" | AssetKind;
};

export type AssetFilterOption = {
  id: number;
  name: string;
};

export type AssetCateOption = AssetFilterOption & {
  kind: AssetKind;
  cardinality: string;
};

export type AssetFilterOptions = {
  projects: AssetFilterOption[];
  tools: AssetFilterOption[];
  dialogues: AssetFilterOption[];
  assetCates: AssetCateOption[];
  materialLibrary: OfficialMaterialCatalog;
};

export type OfficialMaterialKind = "prompt" | "image" | "audio" | "video";

export type OfficialMaterialKindOption = {
  id: OfficialMaterialKind;
  name: string;
  assetKind: AssetKind;
};

export type OfficialMaterialCategory = AssetFilterOption & {
  kind: OfficialMaterialKind;
};

export type OfficialMaterialCatalog = {
  enabled: boolean;
  pack: AssetFilterOption & { description: string };
  kinds: OfficialMaterialKindOption[];
  categories: OfficialMaterialCategory[];
};

export type AssetCatalogOptions = Pick<
  AssetFilterOptions,
  "tools" | "dialogues" | "assetCates"
>;

export type AssetPage = {
  items: AssetRecord[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type AssetDetail = {
  asset: AssetRecord;
  versions: AssetVersion[];
  versionTotal: number;
  hasMore: boolean;
};

export const emptyAssetFilters: AssetFilters = {
  sourceType: "",
  sourceID: 0,
  projectID: 0,
  assetCateID: 0,
  materialCateID: 0,
  nodeKey: "",
  role: "",
  kind: "",
};
