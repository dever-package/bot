import { lazy, type ComponentType } from "react";

// Small renderers shared by common nodes stay synchronous. Specialized views
// below are loaded only when the active canvas contains their presentation mode.
export { AssetAudioPreview } from "../asset/asset-audio-preview";
export { CanvasGroupNodeView } from "./space-group-node";
export {
  CanvasResultView,
  hasResultPreviewMedia,
} from "./space-result-view";

function createPreloadableComponent<
  TModule,
  T extends ComponentType<any>,
>(
  moduleLoader: PreloadableModule<TModule>,
  select: (module: TModule) => T,
) {
  return {
    Component: lazy(() =>
      moduleLoader.load().then((module) => ({ default: select(module) })),
    ),
    preload: moduleLoader.preload,
  };
}

type PreloadableModule<T> = {
  load: () => Promise<T>;
  preload: () => Promise<void>;
};

function createPreloadableModule<T>(loader: () => Promise<T>) {
  let modulePromise: Promise<T> | undefined;
  const load = () => {
    if (!modulePromise) {
      modulePromise = loader().catch((error) => {
        modulePromise = undefined;
        throw error;
      });
    }
    return modulePromise;
  };
  return {
    load,
    preload: () => load().then(() => undefined, () => undefined),
  } satisfies PreloadableModule<T>;
}

const agentTools = createPreloadableModule(() => import("./space-agent-tools"));
const assetTools = createPreloadableModule(() => import("./space-asset-tools"));

const agentInteractionPanel = createPreloadableComponent(
  agentTools,
  (module) => module.AgentInteractionPanel,
);
export const AgentInteractionPanel = agentInteractionPanel.Component;
export const preloadAgentInteractionPanel = agentInteractionPanel.preload;

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

const canvasAgentResultContent = createPreloadableComponent(
  agentTools,
  (module) => module.CanvasAgentResultContent,
);
export const CanvasAgentResultContent = canvasAgentResultContent.Component;
export const preloadCanvasAgentResultContent = canvasAgentResultContent.preload;

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

const storyboardGridCanvasView = createPreloadableComponent(
  createPreloadableModule(() => import("../shared/storyboard-grid-view")),
  (module) => module.StoryboardGridCanvasView,
);
export const StoryboardGridCanvasView = storyboardGridCanvasView.Component;

const videoComposeView = createPreloadableComponent(
  createPreloadableModule(() => import("./space-video-compose-view")),
  (module) => module.VideoComposeView,
);
export const VideoComposeView = videoComposeView.Component;
