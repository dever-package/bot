import { lazy } from "react";

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

export const AssetAudioPreview = lazy(() =>
  import("../asset/asset-audio-preview").then((module) => ({
    default: module.AssetAudioPreview,
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

export const CanvasGroupNodeView = lazy(() =>
  import("./space-group-node").then((module) => ({
    default: module.CanvasGroupNodeView,
  })),
);

export const CanvasResultView = lazy(() =>
  import("./space-result-view").then((module) => ({
    default: module.CanvasResultView,
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

export const StoryboardInputReferenceEditor = lazy(() =>
  import("./space-storyboard-reference-editor").then((module) => ({
    default: module.StoryboardInputReferenceEditor,
  })),
);

export const StoryboardNodeContent = lazy(() =>
  import("./space-storyboard-node").then((module) => ({
    default: module.StoryboardNodeContent,
  })),
);
