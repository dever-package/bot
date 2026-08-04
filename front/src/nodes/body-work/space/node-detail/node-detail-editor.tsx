import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { Download, FileText } from "lucide-react";
import { getCompatModule } from "@dever/front-plugin";
import {
  StoryboardView,
  type StoryboardWorkflowAction,
} from "../space-storyboard-view";
import type {
  StoryboardDocument,
  StoryboardEditorFocus,
  StoryboardProductionPlan,
} from "../space-storyboard";
import type { ComposerAssetItem } from "../space-prompt-composer";
import type { SpaceCanvasNode } from "../types";
import { CanvasNodeContentView } from "../space-content-view";
import {
  contentOutputMediaURLs,
  type ContentMediaKind,
  type StoryboardGridDocument,
} from "../../shared/content-output";
import type { ReferenceProvider } from "../../../show/agent-chat/reference";
import { AssetPreview } from "../../asset/asset-preview";
import { MediaInspectorGallery } from "../../../shared/media-inspector-gallery";
import { SpaceTooltip } from "../space-tooltip";
import {
  nodeDetailContentWithValue,
  type NodeDetailEditableContent,
  type NodeDetailFileValue,
} from "./node-detail-content";
import { NodeDetailStoryboardGrid } from "./node-detail-storyboard-grid";

const { RichTextEditor } = getCompatModule("@/components/rich-text-editor") as {
  RichTextEditor?: ComponentType<{
    value: unknown;
    onChange: (value: string) => void;
    contentFormat?: "json" | "markdown";
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    className?: string;
    controlClassName?: string;
    disabled?: boolean;
  }>;
};

export function NodeDetailEditor({
  content,
  mediaOutput,
  mediaKind,
  mediaPrompt,
  readonly,
  referenceItems,
  canvasNodes,
  storyboardSourceNodeId,
  storyboardFocus,
  storyboardWorkflowAction,
  referenceProvider,
  onConfirmStoryboard,
  onCreateStoryboardRevision,
  onChange,
}: {
  content: NodeDetailEditableContent;
  mediaOutput?: unknown;
  mediaKind?: ContentMediaKind;
  mediaPrompt?: string;
  readonly: boolean;
  referenceItems?: ComposerAssetItem[];
  canvasNodes?: SpaceCanvasNode[];
  storyboardSourceNodeId?: string;
  storyboardFocus?: StoryboardEditorFocus;
  storyboardWorkflowAction?: StoryboardWorkflowAction;
  referenceProvider?: ReferenceProvider;
  onConfirmStoryboard?: (
    storyboard: StoryboardDocument,
    productionPlan: StoryboardProductionPlan,
  ) => boolean | Promise<boolean>;
  onCreateStoryboardRevision?: () => void | Promise<void>;
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
      <div className="wb-detail-readonly-content is-audio">
        <AssetPreview kind="audio" content={mediaOutput} prompt={mediaPrompt} />
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
      <NodeDetailStoryboardGrid
        grid={content.value as StoryboardGridDocument}
        readonly={readonly}
        referenceProvider={referenceProvider}
        onChange={(grid) =>
          onChange(nodeDetailContentWithValue(content, grid))
        }
      />
    );
  }

  if (content.mode === "storyboard") {
    return (
      <div className="ws-node-detail-storyboard">
        <StoryboardView
          storyboard={content.value as StoryboardDocument}
          layout="split"
          editable={!readonly}
          referenceItems={referenceItems}
          canvasNodes={canvasNodes}
          storyboardSourceNodeId={storyboardSourceNodeId}
          focus={storyboardFocus}
          workflowAction={storyboardWorkflowAction}
          onConfirm={onConfirmStoryboard}
          onCreateRevision={onCreateStoryboardRevision}
          onChange={(storyboard) =>
            onChange(nodeDetailContentWithValue(content, storyboard))
          }
          showSaveStatus={false}
        />
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

  const value = String(content.value || "");
  return (
    <div className="ws-node-detail-editor">
      {RichTextEditor ? (
        <RichTextEditor
          value={value}
          onChange={(nextValue) =>
            onChange(nodeDetailContentWithValue(content, nextValue))
          }
          contentFormat={content.format}
          placeholder="编辑内容"
          disabled={readonly}
          minHeight={0}
          maxHeight={2400}
          controlClassName="ws-node-detail-rich-editor"
        />
      ) : (
        <textarea
          className="ws-node-detail-fallback-editor"
          readOnly={readonly}
          value={value}
          onChange={(event) =>
            onChange(nodeDetailContentWithValue(content, event.target.value))
          }
          placeholder="编辑内容"
        />
      )}
    </div>
  );
}

function NodeDetailMediaGallery({
  kind,
  output,
}: {
  kind: "image" | "video";
  output: unknown;
}) {
  const urls = useMemo(
    () => contentOutputMediaURLs(output, kind),
    [kind, output],
  );
  const items = useMemo(
    () =>
      urls.map((url, index) => ({
        id: url,
        name: mediaItemName(url, kind, index),
        url,
      })),
    [kind, urls],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const mediaIdentity = urls.join("\n");

  useEffect(() => {
    setActiveIndex(0);
  }, [mediaIdentity]);

  if (items.length === 0) {
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
    <MediaInspectorGallery
      kind={kind}
      items={items}
      activeIndex={Math.min(activeIndex, items.length - 1)}
      className="ws-node-detail-media-gallery"
      onSelect={setActiveIndex}
    />
  );
}

function mediaItemName(url: string, kind: "image" | "video", index: number) {
  const path = url.split(/[?#]/, 1)[0];
  const encodedName = path.slice(path.lastIndexOf("/") + 1);
  if (encodedName) {
    try {
      return decodeURIComponent(encodedName);
    } catch {
      return encodedName;
    }
  }
  return `${kind === "image" ? "图片" : "视频"} ${index + 1}`;
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
          <a href={file.url} download aria-label="下载文件">
            <Download size={17} />
          </a>
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
