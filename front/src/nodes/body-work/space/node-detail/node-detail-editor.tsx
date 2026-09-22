import { Suspense } from "react";
import { FileText } from "lucide-react";
import type { StoryboardWorkflowAction } from "../space-storyboard-view";
import type {
  StoryboardDocument,
  StoryboardEditorFocus,
  StoryboardShotGeneration,
} from "../space-storyboard";
import type {
  ComposerAssetItem,
  AssetKind,
  SpaceCanvasNode,
  StoryboardReferencePurposeSpec,
  StoryboardWorkTypeSpec,
} from "../types";
import { CanvasNodeContentView } from "../space-content-view";
import {
  contentOutputMediaItems,
  contentOutputMediaURLs,
  contentOutputSupplementalText,
  type ContentMediaKind,
  type StoryboardGridDocument,
} from "../../shared/content-output";
import type { ReferenceProvider } from "../../../show/agent-chat/reference";
import { AssetAudioPreview } from "../../asset/asset-audio-preview";
import { ResourceDownloadButton } from "../../../shared/resource-download-button";
import { MediaInspector } from "../../../shared/media-inspector-gallery";
import {
  createPreloadableComponent,
  createPreloadableModule,
} from "../../../shared/preloadable";
import { SpaceTooltip } from "../space-tooltip";
import {
  nodeDetailContentWithValue,
  type NodeDetailEditableContent,
  type NodeDetailFileValue,
} from "./node-detail-content";
import { CanvasModuleLoading } from "../space-loading";

const storyboardViewModule = createPreloadableModule(
  () => import("../space-storyboard-view"),
);
const storyboardView = createPreloadableComponent(
  storyboardViewModule,
  (module) => module.StoryboardView,
);
const StoryboardView = storyboardView.Component;

const storyboardGridModule = createPreloadableModule(
  () => import("./node-detail-storyboard-grid"),
);
const nodeDetailStoryboardGrid = createPreloadableComponent(
  storyboardGridModule,
  (module) => module.NodeDetailStoryboardGrid,
);
const NodeDetailStoryboardGrid = nodeDetailStoryboardGrid.Component;

const richEditorModule = createPreloadableModule(
  () => import("./node-detail-rich-editor"),
);
const nodeDetailRichEditor = createPreloadableComponent(
  richEditorModule,
  (module) => module.NodeDetailRichEditor,
);
const NodeDetailRichEditor = nodeDetailRichEditor.Component;

export function NodeDetailEditor({
  content,
  assetKind,
  mediaOutput,
  mediaKind,
  mediaPrompt,
  readonly,
  referenceItems,
  canvasNodes,
  storyboardSourceNodeId,
  storyboardFocus,
  storyboardWorkflowAction,
  storyboardWorkTypes,
  storyboardReferencePurposes,
  referenceProvider,
  onConfirmStoryboard,
  onCreateStoryboardRevision,
  onGenerateStoryboardShot,
  onChange,
}: {
  content: NodeDetailEditableContent;
  assetKind?: AssetKind;
  mediaOutput?: unknown;
  mediaKind?: ContentMediaKind;
  mediaPrompt?: string;
  readonly: boolean;
  referenceItems?: ComposerAssetItem[];
  canvasNodes?: SpaceCanvasNode[];
  storyboardSourceNodeId?: string;
  storyboardFocus?: StoryboardEditorFocus;
  storyboardWorkflowAction?: StoryboardWorkflowAction;
  storyboardWorkTypes?: StoryboardWorkTypeSpec[];
  storyboardReferencePurposes?: StoryboardReferencePurposeSpec[];
  referenceProvider?: ReferenceProvider;
  onConfirmStoryboard?: () => void | Promise<void>;
  onCreateStoryboardRevision?: () => void | Promise<void>;
  onGenerateStoryboardShot?: (
    storyboard: StoryboardDocument,
    shotId: string,
    instruction: string,
  ) => Promise<StoryboardShotGeneration>;
  onChange: (content: NodeDetailEditableContent) => void;
}) {
  if (
    mediaOutput !== undefined &&
    (mediaKind === "image" || mediaKind === "video")
  ) {
    return <NodeDetailMediaGallery kind={mediaKind} output={mediaOutput} />;
  }

  if (mediaOutput !== undefined && mediaKind === "audio") {
    const audioItems = contentOutputMediaItems(mediaOutput, "audio");
    if (
      audioItems.length > 0 &&
      (audioItems.length > 1 || Boolean(audioItems[0]?.thumbnail))
    ) {
      return <NodeDetailMediaGallery kind="audio" output={mediaOutput} />;
    }
    const audioURL = audioItems[0]?.url || "";
    return (
      <div className="wb-detail-readonly-content is-audio">
        <AssetAudioPreview src={audioURL} prompt={mediaPrompt} detailed />
      </div>
    );
  }

  if (mediaOutput !== undefined) {
    return (
      <CanvasNodeContentView
        className="ws-node-detail-media"
        output={mediaOutput}
        emptyText="暂无媒体内容"
        mediaLayout="chat"
      />
    );
  }

  if (content.mode === "storyboard_grid") {
    return (
      <Suspense fallback={<CanvasModuleLoading label="正在加载分镜宫格" />}>
        <NodeDetailStoryboardGrid
          grid={content.value as StoryboardGridDocument}
          readonly={readonly}
          referenceProvider={referenceProvider}
          onChange={(grid) =>
            onChange(nodeDetailContentWithValue(content, grid))
          }
        />
      </Suspense>
    );
  }

  if (content.mode === "storyboard") {
    return (
      <div className="ws-node-detail-storyboard">
        <Suspense fallback={<CanvasModuleLoading label="正在加载分镜内容" />}>
          <StoryboardView
            storyboard={content.value as StoryboardDocument}
            layout="split"
            editable={!readonly}
            referenceItems={referenceItems}
            canvasNodes={canvasNodes}
            storyboardSourceNodeId={storyboardSourceNodeId}
            workTypeSpecs={storyboardWorkTypes}
            purposeSpecs={storyboardReferencePurposes}
            focus={storyboardFocus}
            workflowAction={storyboardWorkflowAction}
            onConfirm={onConfirmStoryboard}
            onCreateRevision={onCreateStoryboardRevision}
            onGenerateShot={onGenerateStoryboardShot}
            onChange={(storyboard) =>
              onChange(nodeDetailContentWithValue(content, storyboard))
            }
            showSaveStatus={false}
          />
        </Suspense>
      </div>
    );
  }

  if (content.mode === "file") {
    return (
      <FileDetailEditor
        content={content}
        readonly={readonly}
        onChange={onChange}
      />
    );
  }

  return (
    <Suspense fallback={<CanvasModuleLoading label="正在加载内容编辑器" />}>
      <NodeDetailRichEditor
        content={content}
        kind={assetKind === "richtext" ? "richtext" : "text"}
        readonly={readonly}
        onChange={onChange}
      />
    </Suspense>
  );
}

function NodeDetailMediaGallery({
  kind,
  output,
}: {
  kind: ContentMediaKind;
  output: unknown;
}) {
  const urls = contentOutputMediaURLs(output, kind);
  if (urls.length === 0) {
    return (
      <CanvasNodeContentView
        className="ws-node-detail-media"
        output={output}
        emptyText="暂无媒体内容"
        mediaLayout="chat"
      />
    );
  }

  return (
    <Suspense fallback={<CanvasModuleLoading label="正在加载媒体预览" />}>
      <MediaInspector
        kind={kind}
        mediaItems={contentOutputMediaItems(output, kind)}
        downloadable
        className="ws-node-detail-media-gallery"
        supplementalText={
          kind === "audio" ? contentOutputSupplementalText(output) : null
        }
      />
    </Suspense>
  );
}

function FileDetailEditor({
  content,
  readonly,
  onChange,
}: {
  content: NodeDetailEditableContent;
  readonly: boolean;
  onChange: (content: NodeDetailEditableContent) => void;
}) {
  const file = content.value as NodeDetailFileValue;
  const updateFile = (patch: Partial<NodeDetailFileValue>) => {
    onChange(nodeDetailContentWithValue(content, { ...file, ...patch }));
  };

  return (
    <div className="ws-node-detail-file-editor">
      <div className="ws-node-detail-file-block">
        <span aria-hidden="true">
          <FileText size={24} />
        </span>
        <div>
          {readonly ? (
            <strong>{file.name || "文件"}</strong>
          ) : (
            <input
              value={file.name}
              aria-label="文件名称"
              placeholder="文件名称"
              onChange={(event) => updateFile({ name: event.target.value })}
            />
          )}
          <small>{file.url}</small>
        </div>
        <SpaceTooltip label="下载文件">
          <ResourceDownloadButton
            url={file.url}
            name={file.name}
            label="下载文件"
          />
        </SpaceTooltip>
      </div>
      {readonly ? (
        <p>{file.description || "暂无文件说明"}</p>
      ) : (
        <textarea
          value={file.description}
          rows={8}
          placeholder="补充文件说明"
          onChange={(event) => updateFile({ description: event.target.value })}
        />
      )}
    </div>
  );
}
