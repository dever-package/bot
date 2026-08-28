import { getCompatModule } from "@dever/front-plugin";
import { useLayoutEffect, useMemo, useRef, type ComponentType } from "react";
import {
  assetTextContentEditorValue,
  type AssetTextContentDraft,
} from "./asset-text-content";
import { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX } from "./detail-dialog";
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
    floatingLayerZIndex?: number;
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
  const editorValue = useMemo(
    () => assetTextContentEditorValue({ kind, value, contentFormat }),
    [contentFormat, kind, value],
  );

  if (kind === "text" || !RichTextEditor) {
    return (
      <PlainTextContentEditor
        value={value}
        readonly={readonly}
        onChange={onChange}
      />
    );
  }

  return (
    <RichTextEditor
      value={editorValue}
      onChange={onChange}
      contentFormat={contentFormat}
      placeholder="编辑内容"
      disabled={readonly}
      minHeight={0}
      maxHeight={2400}
      controlClassName="wb-asset-rich-content-editor"
      floatingLayerZIndex={DETAIL_DIALOG_CHILD_LAYER_Z_INDEX}
    />
  );
}

function PlainTextContentEditor({
  value,
  readonly,
  onChange,
}: {
  value: string;
  readonly: boolean;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const resizeToContent = () => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.style.height = "auto";
      editor.style.height = `${editor.scrollHeight}px`;
    };

    resizeToContent();
    window.addEventListener("resize", resizeToContent);
    return () => window.removeEventListener("resize", resizeToContent);
  }, [value]);

  return (
    <textarea
      ref={editorRef}
      className="wb-asset-plain-content-editor"
      readOnly={readonly}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="编辑内容"
    />
  );
}
