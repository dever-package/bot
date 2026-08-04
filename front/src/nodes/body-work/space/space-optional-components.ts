import { lazy, type ComponentType } from "react";

// These renderers participate in normal canvas paint. Keeping them synchronous
// avoids an extra request and a visible fallback whenever their node type exists.
export { AssetAudioPreview } from "../asset/asset-audio-preview";
export { CanvasGroupNodeView } from "./space-group-node";
export {
  CanvasResultView,
  hasResultPreviewMedia,
} from "./space-result-view";
export { StoryboardInputReferenceEditor } from "./space-storyboard-reference-editor";
export { StoryboardNodeContent } from "./space-storyboard-node";

function createPreloadableComponent<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
) {
  let modulePromise: Promise<{ default: T }> | undefined;
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
    Component: lazy(load),
    preload: () =>
      load().then(
        () => undefined,
        () => undefined,
      ),
  };
}

const agentInteractionPanel = createPreloadableComponent(() =>
  import("@/components/agent/interaction-panel").then((module) => ({
    default: module.AgentInteractionPanel,
  })),
);
export const AgentInteractionPanel = agentInteractionPanel.Component;
export const preloadAgentInteractionPanel = agentInteractionPanel.preload;

const addNodeMenu = createPreloadableComponent(() =>
  import("./space-add-node-menu").then((module) => ({
    default: module.AddNodeMenu,
  })),
);
export const AddNodeMenu = addNodeMenu.Component;
export const preloadAddNodeMenu = addNodeMenu.preload;

const assetBrowser = createPreloadableComponent(() =>
  import("../asset/asset-browser").then((module) => ({
    default: module.AssetBrowser,
  })),
);
export const AssetBrowser = assetBrowser.Component;
export const preloadAssetBrowser = assetBrowser.preload;

const assetPickerDialog = createPreloadableComponent(() =>
  import("../asset/asset-picker-dialog").then((module) => ({
    default: module.AssetPickerDialog,
  })),
);
export const AssetPickerDialog = assetPickerDialog.Component;
export const preloadAssetPickerDialog = assetPickerDialog.preload;

const canvasRunHistoryDrawer = createPreloadableComponent(() =>
  import("./space-run-history").then((module) => ({
    default: module.CanvasRunHistoryDrawer,
  })),
);
export const CanvasRunHistoryDrawer = canvasRunHistoryDrawer.Component;
export const preloadCanvasRunHistoryDrawer = canvasRunHistoryDrawer.preload;

const canvasAgentResultContent = createPreloadableComponent(() =>
  import("./space-agent-result").then((module) => ({
    default: module.CanvasAgentResultContent,
  })),
);
export const CanvasAgentResultContent = canvasAgentResultContent.Component;
export const preloadCanvasAgentResultContent = canvasAgentResultContent.preload;

const nodeDetailDialog = createPreloadableComponent(() =>
  import("./node-detail/node-detail-dialog").then((module) => ({
    default: module.NodeDetailDialog,
  })),
);
export const NodeDetailDialog = nodeDetailDialog.Component;
export const preloadNodeDetailDialog = nodeDetailDialog.preload;

const promptComposer = createPreloadableComponent(() =>
  import("./space-prompt-composer").then((module) => ({
    default: module.PromptComposer,
  })),
);
export const PromptComposer = promptComposer.Component;
export const preloadPromptComposer = promptComposer.preload;

const videoComposeView = createPreloadableComponent(() =>
  import("./space-video-compose-view").then((module) => ({
    default: module.VideoComposeView,
  })),
);
export const VideoComposeView = videoComposeView.Component;
export const preloadVideoComposeView = videoComposeView.preload;
