import { lazy } from "react";

// These renderers are part of the normal canvas paint path. Splitting each of
// them into its own async entry creates extra requests and visible fallbacks
// without deferring a meaningful amount of work.
export { AssetAudioPreview } from "../asset/asset-audio-preview";
export { CanvasGroupNodeView } from "./space-group-node";
export { CanvasResultView } from "./space-result-view";
export { StoryboardInputReferenceEditor } from "./space-storyboard-reference-editor";
export { StoryboardNodeContent } from "./space-storyboard-node";

export const AgentInteractionPanel = lazy(() =>
  import("@/components/agent/interaction-panel").then((module) => ({
    default: module.AgentInteractionPanel,
  })),
);

export const AddNodeMenu = lazy(() =>
  import("./space-add-node-menu").then((module) => ({
    default: module.AddNodeMenu,
  })),
);

export const AssetBrowser = lazy(() =>
  import("../asset/asset-browser").then((module) => ({
    default: module.AssetBrowser,
  })),
);

export const AssetPickerDialog = lazy(() =>
  import("../asset/asset-picker-dialog").then((module) => ({
    default: module.AssetPickerDialog,
  })),
);

export const CanvasRunHistoryDrawer = lazy(() =>
  import("./space-run-history").then((module) => ({
    default: module.CanvasRunHistoryDrawer,
  })),
);

export const CanvasAgentResultContent = lazy(() =>
  import("./space-agent-result").then((module) => ({
    default: module.CanvasAgentResultContent,
  })),
);

export const NodeDetailDialog = lazy(() =>
  import("./node-detail/node-detail-dialog").then((module) => ({
    default: module.NodeDetailDialog,
  })),
);

export const VideoComposeView = lazy(() =>
  import("./space-video-compose-view").then((module) => ({
    default: module.VideoComposeView,
  })),
);
