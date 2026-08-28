import { getCompatModule } from "@dever/front-plugin";
import type { ComponentType } from "react";
import type { AssetTextContentDraft } from "./asset-text-content";
import "./asset-text-content-editor.css";

const { RichTextEditor } = getCompatModule("@/components/rich-text-editor") as {
  RichTextEditor?: ComponentType<{
    value: unknown;
    onChange: (value: string) => void;
    contentFormat?: AssetTextContentDraft["contentFormat"];
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    controlClassName?: string;
    disabled?: boolean;
  }>;
};

export function AssetTextContentEditor({
  kind,
  value,
  contentFormat,
  readonly = false,
  onChange,
}: {
  kind: AssetTextContentDraft["kind"];
  value: string;
  contentFormat: AssetTextContentDraft["contentFormat"];
  readonly?: boolean;
  onChange: (value: string) => void;
}) {
  if (kind === "text" || !RichTextEditor) {
    return (
      <textarea
        className="wb-asset-plain-content-editor"
        readOnly={readonly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="编辑内容"
      />
    );
  }

  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      contentFormat={contentFormat}
      placeholder="编辑内容"
      disabled={readonly}
      minHeight={0}
      maxHeight={2400}
      controlClassName="wb-asset-rich-content-editor"
    />
  );
}
