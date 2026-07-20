export type AssetSourceType = "project" | "tool" | "dialogue" | "upload";
export type AssetRole = "work" | "material";
export type AssetKind =
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
  id: number;
  projectID: number;
  bodyID: number;
  teamID: number;
  flowID: number;
  assetCateID: number;
  nodeKey: string;
  sourceType: AssetSourceType;
  sourceID: number;
  sourceName: string;
  name: string;
  nameMode: "auto" | "manual";
  kind: AssetKind;
  role: AssetRole;
  versionID: number;
  status: string;
  summary: string;
  createdAt: string;
  version: AssetVersion | null;
};

export type AssetFilters = {
  sourceType: "" | AssetSourceType;
  sourceID: number;
  projectID: number;
  assetCateID: number;
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

export type AssetNodeOption = {
  projectID: number;
  assetCateID: number;
  nodeKey: string;
  name: string;
};

export type AssetFilterOptions = {
  projects: AssetFilterOption[];
  tools: AssetFilterOption[];
  dialogues: AssetFilterOption[];
  assetCates: AssetCateOption[];
  nodes: AssetNodeOption[];
};

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
  nodeKey: "",
  role: "",
  kind: "",
};
