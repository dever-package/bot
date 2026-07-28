import type { CanvasVideoComposition } from "./space-video-compose";
import type { PowerCategory } from "../shared/power-menu";

export type AssetKind =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "richtext"
  | "file"
  | string;
export type AssetCardinality = "single" | "multiple" | "ordered" | string;
export type AssetRole = "work" | "material" | string;
export type CanvasContentPreview = {
  text: string;
  imageUrl: string;
  videoUrl: string;
  audioUrl: string;
  fileUrl: string;
};
export type SpaceNodeType =
  | "asset"
  | "power"
  | "agent"
  | "flow"
  | "function"
  | "group";

export type WorkProject = {
  id: number;
  body_id: number;
  team_id: number;
  release_id: number;
  name: string;
  description: string;
  mode: string;
  team?: {
    id?: number;
    name?: string;
    version?: number;
  };
};

export type WorkTeam = {
  id: number;
  name: string;
  description: string;
};

export type WorkRelease = {
  id: number;
  team_id: number;
  version: number;
  status?: string;
};

export type AssetCate = {
  id: number;
  team_id: number;
  name: string;
  kind: AssetKind;
  cardinality: AssetCardinality;
  status: number;
  sort: number;
  virtual?: boolean;
};

export type TeamRole = {
  id: number;
  team_id: number;
  role_type: string;
  role_key: string;
  name: string;
  agent_id: number;
  assignment: string;
  create_status: number;
};

export type TeamFlow = {
  id: number;
  name: string;
  key: string;
  goal: string;
  config: Record<string, unknown>;
  status: number;
  sort: number;
};

export type TeamFlowNode = {
  id: number;
  node_key: string;
  name: string;
  type: string;
  role_id: number;
  role_key: string;
  agent_id: number;
  power_id: number;
  sub_team_id: number;
  asset_cate_id: number;
  config: Record<string, unknown>;
};

export type PowerOption = {
  id: number;
  cate_id: number;
  name: string;
  key: string;
  icon: string;
  outputType: string;
  output?: OutputTypeOption;
  kind: string;
  createStatus: number;
};

export type PowerCategoryOption = PowerCategory;

export type OutputTypeOption = {
  key: string;
  name: string;
  allowedKinds: string[];
  viewMode: string;
  defaultWidth: number;
  defaultHeight: number;
  structured: boolean;
  sort: number;
};

export type PowerKindOption = {
  id: string;
  value: string;
};

export type PowerParamOption = {
  id: number;
  name: string;
  value: string;
  native_value?: string;
  preview_url?: string;
  sort?: number;
};

export type PowerParam = {
  id: number;
  power_param_id?: number;
  name: string;
  key: string;
  icon?: string;
  type:
    | "input"
    | "textarea"
    | "switch"
    | "option"
    | "multi_option"
    | "file"
    | "files"
    | "hidden"
    | "description"
    | string;
  preview_type?: "none" | "image" | "audio" | "video" | string;
  usage?: number;
  value_type?: "string" | "number" | string;
  default_value?: string;
  required?: boolean;
  upload_rule_id?: number;
  max_files?: number;
  accepted_kinds?: AssetKind[];
  sort?: number;
  options?: PowerParamOption[];
  asset_kinds?: AssetKind[];
};

export type PowerParamSource = {
  id: number;
  target_id: number;
  service_id: number;
  service_name: string;
  provider_id?: number;
  provider_name?: string;
  name: string;
  sort?: number;
};

export type PowerForm = {
  release_id?: number;
  flow?: TeamFlow | Record<string, unknown>;
  power?: PowerOption;
  source_rule?: number;
  selected_target_id?: number;
  sources: PowerParamSource[];
  params: PowerParam[];
  primary_param_key?: string;
};

export type CanvasFunctionOption = {
  key: string;
  label: string;
  description: string;
};

export type AssetVersion = {
  id: number;
  asset_id: number;
  run_id?: number;
  node_run_id?: number;
  release_id?: number;
  request_id?: string;
  node_key?: string;
  source?: Record<string, unknown>;
  version: number;
  summary?: string;
  content?: unknown;
  created_at?: string;
  updated_at?: string;
};

export type AssetVersionPage = {
  items: AssetVersion[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type SpaceAssetDetail = {
  asset: ProjectAsset;
  versions: AssetVersion[];
  versionTotal: number;
  hasMore: boolean;
};

export type ProjectAsset = {
  id: number;
  project_id: number;
  body_id: number;
  team_id: number;
  flow_id: number;
  asset_cate_id: number;
  node_key?: string;
  name: string;
  kind: AssetKind;
  role?: AssetRole;
  version_id: number;
  status?: string;
  sort: number;
  created_at?: string;
  version?: AssetVersion;
  versions?: AssetVersion[];
};

export type CanvasResultRef = {
  execution_id?: number;
  run_id?: number;
  request_id?: string;
  flow_run_id?: number;
  node_run_id?: number;
  asset_id?: number;
  version_id?: number;
  release_id?: number;
  role?: string;
  status?: string;
  updated_at?: string;
};

export type CanvasResultSourceRef = {
  sourceRunId?: number;
  sourceNodeRunId?: number;
  sourceAssetId?: number;
  sourceVersionId?: number;
  sourceReleaseId?: number;
  sourceRequestId?: string;
  sourceNodeKey?: string;
  sourceNodeType?: string;
  sourceStatus?: string;
  sourceKey?: string;
};

export type SpaceBootstrap = {
  project: WorkProject;
  team: WorkTeam;
  release: WorkRelease;
  assetCates: AssetCate[];
  roles: TeamRole[];
  flows: TeamFlow[];
  nodesByFlow: Record<string, TeamFlowNode[]>;
  canvases: Record<string, SpaceCanvasState>;
  assets: ProjectAsset[];
  powers: PowerOption[];
  powerCategories: PowerCategoryOption[];
  powerKinds: PowerKindOption[];
  outputTypes: OutputTypeOption[];
  initialAssetCateId: number;
};

export type CanvasResultViewState = {
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};

export type CanvasGroupConfig = {
  origin?: "manual" | "script" | string;
  sourceNodeId?: string;
  syncKey?: string;
  layoutKey?: string;
};

export type CanvasComposerDraft = {
  prompt?: string;
  promptContent?: CanvasReferenceContent;
  paramValues?: Record<string, unknown>;
  selectedTargetId?: number;
  videoComposition?: CanvasVideoComposition;
  storyboardReferences?: CanvasStoryboardReference[];
};

export type CanvasReferenceContent = {
  version: 1;
  parts: Array<
    | { type: "text"; text: string }
    | {
        type: "reference";
        ref_type: "asset";
        ref_id: number;
        label: string;
        usage?: string;
        ref_trigger?: string;
        ref_version_id?: number;
      }
  >;
};

export type CanvasStoryboardReferencePurpose =
  | "visual_style"
  | "motion_style"
  | "character"
  | "scene"
  | "prop"
  | "shot";

export type CanvasStoryboardReference = {
  key: string;
  asset_id: number;
  version_id?: number;
  label: string;
  kind: "image" | "video";
  purpose: CanvasStoryboardReferencePurpose;
  instruction: string;
};

export type CanvasStoryboardItemType =
  | "character"
  | "scene"
  | "prop"
  | "shot_image"
  | "shot"
  | "speech"
  | "subtitle"
  | "lip_sync"
  | "video_compose";

export type CanvasStoryboardItemConfig = {
  sourceNodeId: string;
  itemType: CanvasStoryboardItemType;
  itemId: string;
  generatedPrompt: string;
  dependencyNodeIds?: string[];
  referenceNodeIds?: string[];
  externalReferenceAssetIds?: number[];
  shotId?: string;
  speechId?: string;
  speechIds?: string[];
  characterId?: string;
  speechKind?: "dialogue" | "narration";
  speakerMode?: "visible" | "offscreen";
  startTime?: number;
  shotDuration?: number;
  continuityAnchor?: string;
  optional?: boolean;
  sourceSignature?: string;
  resultSourceSignature?: string;
  stale?: boolean;
};

export type SpaceCanvasNode = {
  [key: string]: unknown;
  id: string;
  nodeNo?: number;
  type: SpaceNodeType;
  title: string;
  titleMode?: "auto" | "manual";
  subtitle: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  groupId?: string;
  group?: CanvasGroupConfig;
  storyboardItem?: CanvasStoryboardItemConfig;
  assetCateId?: number;
  kind?: AssetKind;
  outputType?: string;
  cardinality?: AssetCardinality;
  count?: number;
  flow?: TeamFlow;
  role?: TeamRole;
  asset?: ProjectAsset;
  power?: PowerOption;
  functionOption?: CanvasFunctionOption;
  composerDraft?: CanvasComposerDraft;
  resultRef?: CanvasResultRef;
  resultOutput?: unknown;
  resultView?: CanvasResultViewState;
  runError?: string;
  local?: boolean;
};

export type SpaceCanvasEdge = {
  id: string;
  from: string;
  to: string;
  logicalFrom?: string;
  logicalTo?: string;
  executionMode?: "auto" | "manual";
  mediaUsage?: string;
};

export type SpaceCanvasViewport = {
  x?: number;
  y?: number;
  zoom?: number;
};

export type SpaceCanvasState = {
  assetCateId: number;
  nextNodeNo: number;
  nodes: SpaceCanvasNode[];
  edges: SpaceCanvasEdge[];
  viewport: SpaceCanvasViewport;
  updatedAt?: string;
};
