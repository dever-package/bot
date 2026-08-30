import {
  createPreloadableComponent,
  createPreloadableModule,
} from "../../shared/preloadable";

// Small renderers shared by common nodes stay synchronous. Specialized views
// below are loaded only when the active canvas contains their presentation mode.
export { AssetAudioPreview } from "../asset/asset-audio-preview";
export { StoryboardGridCanvasView } from "../shared/storyboard-grid-view";
export { CanvasGroupNodeView } from "./space-group-node";
export { CanvasResultView, hasResultPreviewMedia } from "./space-result-view";

const agentTools = createPreloadableModule(() => import("./space-agent-tools"));
const assetTools = createPreloadableModule(() => import("./space-asset-tools"));

const agentInteractionPanel = createPreloadableComponent(
  agentTools,
  (module) => module.AgentInteractionPanel,
);
export const AgentInteractionPanel = agentInteractionPanel.Component;

const addNodeMenu = createPreloadableComponent(
  createPreloadableModule(() => import("./space-add-node-menu")),
  (module) => module.AddNodeMenu,
);
export const AddNodeMenu = addNodeMenu.Component;
export const preloadAddNodeMenu = addNodeMenu.preload;

const assetBrowser = createPreloadableComponent(
  assetTools,
  (module) => module.AssetBrowser,
);
export const AssetBrowser = assetBrowser.Component;
export const preloadAssetBrowser = assetBrowser.preload;

const assetPickerDialog = createPreloadableComponent(
  assetTools,
  (module) => module.AssetPickerDialog,
);
export const AssetPickerDialog = assetPickerDialog.Component;
export const preloadAssetPickerDialog = assetPickerDialog.preload;

const canvasRunHistoryDrawer = createPreloadableComponent(
  createPreloadableModule(() => import("./space-run-history")),
  (module) => module.CanvasRunHistoryDrawer,
);
export const CanvasRunHistoryDrawer = canvasRunHistoryDrawer.Component;
export const preloadCanvasRunHistoryDrawer = canvasRunHistoryDrawer.preload;

const canvasManagerDialog = createPreloadableComponent(
  createPreloadableModule(() => import("./space-canvas-switcher")),
  (module) => module.SpaceCanvasManagerDialog,
);
export const SpaceCanvasManagerDialog = canvasManagerDialog.Component;

const canvasParamBindingDialog = createPreloadableComponent(
  createPreloadableModule(() => import("./space-param-binding-dialog")),
  (module) => module.CanvasParamBindingDialog,
);
export const CanvasParamBindingDialog = canvasParamBindingDialog.Component;

const spaceAssistant = createPreloadableComponent(
  createPreloadableModule(() => import("./space-assistant")),
  (module) => module.SpaceAssistant,
);
export const SpaceAssistant = spaceAssistant.Component;
export const preloadSpaceAssistant = spaceAssistant.preload;

const canvasAgentResultContent = createPreloadableComponent(
  agentTools,
  (module) => module.CanvasAgentResultContent,
);
export const CanvasAgentResultContent = canvasAgentResultContent.Component;

const nodeDetailDialog = createPreloadableComponent(
  createPreloadableModule(() => import("./node-detail/node-detail-dialog")),
  (module) => module.NodeDetailDialog,
);
export const NodeDetailDialog = nodeDetailDialog.Component;
export const preloadNodeDetailDialog = nodeDetailDialog.preload;

const canvasNodeSettings = createPreloadableComponent(
  createPreloadableModule(() => import("./space-node-settings")),
  (module) => module.CanvasNodeSettings,
);
export const CanvasNodeSettings = canvasNodeSettings.Component;
export const preloadCanvasNodeSettings = canvasNodeSettings.preload;

const storyboardNodeContent = createPreloadableComponent(
  createPreloadableModule(() => import("./space-storyboard-node")),
  (module) => module.StoryboardNodeContent,
);
export const StoryboardNodeContent = storyboardNodeContent.Component;

const videoComposeView = createPreloadableComponent(
  createPreloadableModule(() => import("./space-video-compose-view")),
  (module) => module.VideoComposeView,
);
export const VideoComposeView = videoComposeView.Component;
