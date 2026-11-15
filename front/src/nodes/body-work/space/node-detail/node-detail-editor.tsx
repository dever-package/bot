import { Suspense, useEffect, useState, type ReactNode } from "react";
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
import { extractMediaContentItems } from "../../shared/media-content";
import type { ReferenceProvider } from "../../../show/agent-chat/reference";
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
import type { StoryboardWorkspaceData } from "../space-node-runtime";
import { parseSettingOutput } from "../space-setting-model";
import {
  STORYBOARD_SCRIPT_SECTION_ID,
  StoryboardWorkspace,
  StoryboardWorkspaceSlotsProvider,
  SettingWorkspace,
} from "../space-storyboard-workspace";

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

const textEditorModule = createPreloadableModule(
  () => import("../../shared/asset-text-content-editor"),
);
const textEditor = createPreloadableComponent(
  textEditorModule,
  (module) => module.AssetTextContentEditor,
);
const AssetTextContentEditor = textEditor.Component;

export function NodeDetailEditor({
  content,
  assetKind,
  mediaOutput,
  mediaKind,
  mediaPrompt,
  readonly,
  referenceItems,
  canvasNodes,
  canvasEdges,
  storyboardSourceNodeId,
  storyboardFocus,
  storyboardInitialSectionId,
  storyboardWorkspace,
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
  canvasEdges?: import("../types").SpaceCanvasEdge[];
  storyboardSourceNodeId?: string;
  storyboardFocus?: StoryboardEditorFocus;
  storyboardInitialSectionId?: string;
  storyboardWorkspace?: StoryboardWorkspaceData;
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
    return (
      <NodeDetailMediaGallery
        kind="audio"
        output={mediaOutput}
        prompt={mediaPrompt}
      />
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

  if (content.mode === "setting") {
    return <SettingWorkspace groups={storyboardWorkspace?.groups || []}
      mediaAspect={parseSettingOutput(content.value)?.aspect_ratio}
      renderNode={storyboardWorkspace?.renderNode || (() => null)} variant="detail" />;
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
    const storyboard = content.value as StoryboardDocument;
    const storyboardEditor = (
      <div className="ws-node-detail-storyboard">
        <Suspense fallback={<CanvasModuleLoading label="正在加载分镜内容" />}>
          <StoryboardWorkspaceSlotsProvider workspace={storyboardWorkspace}>
          {(workspaceSlots) => <StoryboardView
            storyboard={storyboard}
            editable={!readonly}
            referenceItems={referenceItems}
            canvasNodes={canvasNodes}
            canvasEdges={canvasEdges}
            storyboardSourceNodeId={storyboardSourceNodeId}
            workTypeSpecs={storyboardWorkTypes}
            purposeSpecs={storyboardReferencePurposes}
            focus={storyboardFocus}
            workspaceSlots={workspaceSlots}
            workflowAction={storyboardWorkflowAction}
            onConfirm={onConfirmStoryboard}
            onCreateRevision={onCreateStoryboardRevision}
            onGenerateShot={onGenerateStoryboardShot}
            onChange={(nextStoryboard) =>
              onChange(nodeDetailContentWithValue(content, nextStoryboard))
            }
            showSaveStatus={false}
          />}
          </StoryboardWorkspaceSlotsProvider>
        </Suspense>
      </div>
    );
    if (storyboardWorkspace) {
      return (
        <StoryboardDetailWorkspace
          initialSectionId={storyboardInitialSectionId}
          storyboardWorkspace={storyboardWorkspace}
          scriptMeta={`${storyboard.shots.length} 个镜头`}
          mediaAspect={storyboard.aspect_ratio}
          scriptContent={storyboardEditor}
        />
      );
    }
    return storyboardEditor;
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
      <div className="ws-node-detail-editor">
        <AssetTextContentEditor
          kind={assetKind === "richtext" ? "richtext" : "text"}
          value={String(content.value || "")}
          contentFormat={content.format}
          readonly={readonly}
          onChange={(nextValue) =>
            onChange(nodeDetailContentWithValue(content, nextValue))
          }
        />
      </div>
    </Suspense>
  );
}

function StoryboardDetailWorkspace({
  initialSectionId,
  storyboardWorkspace,
  scriptMeta,
  mediaAspect,
  scriptContent,
}: {
  initialSectionId?: string;
  storyboardWorkspace: StoryboardWorkspaceData;
  scriptMeta: string;
  mediaAspect?: string;
  scriptContent: ReactNode;
}) {
  const [activeSectionId, setActiveSectionId] = useState(
    initialSectionId || STORYBOARD_SCRIPT_SECTION_ID,
  );

  useEffect(() => {
    setActiveSectionId(initialSectionId || STORYBOARD_SCRIPT_SECTION_ID);
  }, [initialSectionId]);

  return (
    <StoryboardWorkspace
      variant="detail"
      activeSectionId={activeSectionId}
      groups={storyboardWorkspace.groups}
      settingSource={storyboardWorkspace.settingSource}
      scriptMeta={scriptMeta}
      mediaAspect={mediaAspect}
      scriptContent={scriptContent}
      renderNode={storyboardWorkspace.renderNode}
      onActiveSectionChange={setActiveSectionId}
    />
  );
}

function NodeDetailMediaGallery({
  kind,
  output,
  prompt,
}: {
  kind: ContentMediaKind;
  output: unknown;
  prompt?: string;
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
          kind === "audio"
            ? contentOutputSupplementalText(output) ||
              (prompt ? { label: "语音文本", text: prompt } : null)
            : null
        }
        attachmentUrls={extractMediaContentItems(output, "file").map(
          (item) => item.url,
        )}
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
