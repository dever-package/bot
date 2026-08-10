import type { ComponentType } from "react";
import { getCompatModule } from "@dever/front-plugin";
import {
  nodeDetailContentWithValue,
  type NodeDetailEditableContent,
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

export function NodeDetailRichEditor({
  content,
  readonly,
  onChange,
}: {
  content: NodeDetailEditableContent;
  readonly: boolean;
  onChange: (content: NodeDetailEditableContent) => void;
}) {
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
