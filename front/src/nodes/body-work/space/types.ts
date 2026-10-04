import type { CanvasVideoComposition } from "./space-video-compose";
import type { StoryboardGridLayout } from "../shared/storyboard-grid-layout";
import type { PowerCategory } from "../shared/power-menu";
import type { StoryboardWorkType } from "./space-storyboard-work-type";
import type {
  StoryboardFrameMediaItem,
  StoryboardFrameRole,
  StoryboardImageSequenceFrame,
  StoryboardShotImageMode,
} from "./space-storyboard-frame-plan";

export type { StoryboardWorkType } from "./space-storyboard-work-type";

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
export type CanvasLibraryReferenceType = "asset" | "material";
export type CanvasContentPreview = {
  text: string;
  imageUrl: string;
  videoUrl: string;
  videoPosterUrl?: string;
  audioUrl: string;
  fileUrl: string;
};
export type ComposerAssetItem = {
  id: string;
  title: string;
  kind: string;
  role?: AssetRole;
  source: "current" | CanvasLibraryReferenceType;
  refType?: CanvasLibraryReferenceType;
  refId?: number;
  versionID?: number;
  output?: unknown;
  preview: CanvasContentPreview;
  asset?: unknown;
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

export type CanvasAssistant = {
  available: boolean;
  reason: string;
  releaseID: number;
  roleID: number;
  roleType: string;
  name: string;
  assignment: string;
  agentID: number;
  agentKey: string;
  contextKey: string;
  openingEnabled: boolean;
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
  output_asset_cate_ids: number[];
};

export type PowerOption = {
  id: number;
  cate_id: number;
  name: string;
  key: string;
  icon: string;
  description: string;
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
  supported_options?: Record<string, string[]>;
};

export type StoryboardShotDurationSpec = {
  seconds: number;
  name: string;
  sort: number;
};

export type StoryboardWorkTypeSpec = {
  key: StoryboardWorkType;
  name: string;
  sort: number;
  required_reference_purposes: string[];
};

export type StoryboardReferencePurposeScope =
  | "global"
  | "material"
  | "shot"
  | "composition"
  | "context";

export type StoryboardReferencePurposeSpec = {
  key: CanvasStoryboardReferencePurpose;
  name: string;
  media_kinds: CanvasStoryboardReference["kind"][];
  work_types: StoryboardWorkType[];
  scope: StoryboardReferencePurposeScope;
  material_type: "" | "character" | "scene" | "prop";
  default_media_kinds: CanvasStoryboardReference["kind"][];
  max_count: number;
  sort: number;
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
  storyboard_work_types: StoryboardWorkTypeSpec[];
  storyboard_reference_purposes: StoryboardReferencePurposeSpec[];
  storyboard_min_shot_durations: StoryboardShotDurationSpec[];
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
  canvas_id: number;
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
  flows: TeamFlow[];
  canvasList: CanvasSummary[];
  canvases: Record<string, SpaceCanvasState>;
  assets: ProjectAsset[];
  assistant: CanvasAssistant;
  initialCanvasId: number;
  initialAssetCateId: number;
};

export type CanvasSummary = {
  id: number;
  projectId: number;
  assetCateId: number;
  name: string;
  sort: number;
  status: number;
  updatedAt?: string;
  deletedAt?: string;
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

export type CanvasMultiImageMode = "per_image" | "shared_reference";

export type CanvasParamBinding = {
  sourceNodeId: string;
  sourceOutput: "primary_text";
};

export type CanvasParamBindings = Record<string, CanvasParamBinding>;

export type CanvasReferenceMediaItem = {
  url: string;
  index: number;
  usage?: string;
};

export type CanvasComposerDraft = {
  prompt?: string;
  promptContent?: CanvasReferenceContent;
  paramValues?: Record<string, unknown>;
  paramBindings?: CanvasParamBindings;
  selectedTargetId?: number;
  videoComposition?: CanvasVideoComposition;
  storyboardReferences?: CanvasStoryboardReference[];
  storyboardWorkType?: StoryboardWorkType;
  storyboardLyricsSourceNodeId?: string;
  minShotDuration?: number;
  storyboardRangeStartMs?: number;
  storyboardRangeEndMs?: number;
  storyboardGridLayout?: StoryboardGridLayout;
  multiImageMode?: CanvasMultiImageMode;
};

export type CanvasReferenceContent = {
  version: 1;
  parts: Array<
    | { type: "text"; text: string }
    | {
        type: "reference";
        ref_type: CanvasLibraryReferenceType;
        ref_id: number;
        label: string;
        usage?: string;
        purpose?: string;
        ref_trigger?: string;
        ref_version_id?: number;
        ref_origin?: string;
        ref_origin_id?: string;
        ref_media_count?: number;
        ref_media_index?: number;
        ref_media_url?: string;
        ref_media_items?: CanvasReferenceMediaItem[];
      }
  >;
};

export type CanvasStoryboardReferencePurpose = string;

export type CanvasStoryboardReference = {
  key: string;
  asset_id: number;
  version_id?: number;
  label: string;
  kind: "image" | "video" | "audio";
  purpose: CanvasStoryboardReferencePurpose;
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
  shotImageMode?: StoryboardShotImageMode;
  frameRole?: StoryboardFrameRole;
  frameMediaItems?: StoryboardFrameMediaItem[];
  imageSequenceFrames?: StoryboardImageSequenceFrame[];
  speechId?: string;
  speechIds?: string[];
  characterId?: string;
  speechKind?: "dialogue" | "narration";
  speakerMode?: "visible" | "offscreen";
  startTime?: number;
  shotDuration?: number;
  requiredDurationValues?: number[];
  continuityAnchor?: string;
  optional?: boolean;
  sourceSignature?: string;
  resultSourceSignature?: string;
  stale?: boolean;
};

export type CanvasNodeRunTiming = {
  startedAt: number;
  finishedAt?: number;
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
  storyboardMaterializedSignature?: string;
  storyboardFramePlanVersion?: number;
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
  runTiming?: CanvasNodeRunTiming;
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
  purpose?: "media" | "structure" | "dependency";
  executionMode?: "auto" | "manual";
  mediaUsage?: string;
};

export type SpaceCanvasViewport = {
  x?: number;
  y?: number;
  zoom?: number;
};

export type SpaceCanvasState = {
  id: number;
  name: string;
  sort: number;
  status: number;
  assetCateId: number;
  nextNodeNo: number;
  nodes: SpaceCanvasNode[];
  edges: SpaceCanvasEdge[];
  viewport: SpaceCanvasViewport;
  updatedAt?: string;
};
