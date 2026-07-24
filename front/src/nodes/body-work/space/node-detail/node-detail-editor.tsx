import type { ComponentType } from "react";
import { Download, FileText } from "lucide-react";
import { getCompatModule } from "@dever/front-plugin";
import {
  StoryboardView,
  type StoryboardWorkflowAction,
} from "../space-storyboard-view";
import type {
  StoryboardDocument,
  StoryboardEditorFocus,
} from "../space-storyboard";
import type { ComposerAssetItem } from "../space-prompt-composer";
import {
  CanvasNodeContentView,
  type CanvasContentMediaKind,
} from "../space-content-view";
import { AssetPreview } from "../../asset/asset-preview";
import { SpaceTooltip } from "../space-tooltip";
import {
  nodeDetailContentWithValue,
  type NodeDetailEditableContent,
  type NodeDetailFileValue,
} from "./node-detail-content";

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
  storyboardFocus,
  storyboardWorkflowAction,
  onConfirmStoryboard,
  onReviewStoryboard,
  onCreateStoryboardRevision,
  onChange,
}: {
  content: NodeDetailEditableContent;
  mediaOutput?: unknown;
  mediaKind?: CanvasContentMediaKind;
  mediaPrompt?: string;
  readonly: boolean;
  referenceItems?: ComposerAssetItem[];
  storyboardFocus?: StoryboardEditorFocus;
  storyboardWorkflowAction?: StoryboardWorkflowAction;
  onConfirmStoryboard?: (
    storyboard: StoryboardDocument,
  ) => void | Promise<void>;
  onReviewStoryboard?: (
    storyboard: StoryboardDocument,
  ) => void | Promise<void>;
  onCreateStoryboardRevision?: () => void | Promise<void>;
  onChange: (content: NodeDetailEditableContent) => void;
}) {
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

  if (content.mode === "storyboard") {
    return (
      <div className="ws-node-detail-storyboard">
        <StoryboardView
          storyboard={content.value as StoryboardDocument}
          editable={!readonly}
          referenceItems={referenceItems}
          focus={storyboardFocus}
          workflowAction={storyboardWorkflowAction}
          onConfirm={onConfirmStoryboard}
          onReview={onReviewStoryboard}
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
