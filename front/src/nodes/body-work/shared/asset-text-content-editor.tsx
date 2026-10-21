import { getCompatModule } from "@dever/front-plugin";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentType,
  type MutableRefObject,
} from "react";
import {
  assetTextContentEditorValue,
  type AssetTextContentDraft,
} from "./asset-text-content";
import { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX } from "./detail-dialog";
import "./asset-text-content-editor.css";

export type RichTextSelection = {
  from: number;
  to: number;
  text: string;
  content: string;
};
export type RichTextSelectionActions = {
  replaceSelection: (
    selection: RichTextSelection,
    replacement: string,
  ) => boolean;
  clearSelection: () => void;
};
export type TextSelectionProps = {
  onTextSelectionChange?: (selection: RichTextSelection | null) => void;
  selectionActionsRef?: MutableRefObject<RichTextSelectionActions | null>;
};

const { RichTextEditor } = getCompatModule("@/components/rich-text-editor") as {
  RichTextEditor?: ComponentType<
    TextSelectionProps & {
      value: unknown;
      onChange: (value: string) => void;
      contentFormat?: AssetTextContentDraft["contentFormat"];
      placeholder?: string;
      minHeight?: number;
      maxHeight?: number;
      controlClassName?: string;
      floatingLayerZIndex?: number;
      disabled?: boolean;
    }
  >;
};

export function AssetTextContentEditor({
  kind,
  value,
  contentFormat,
  readonly = false,
  onChange,
  onTextSelectionChange,
  selectionActionsRef,
}: TextSelectionProps & {
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
        onTextSelectionChange={onTextSelectionChange}
        selectionActionsRef={selectionActionsRef}
      />
    );
  }

  return (
    <RichTextEditor
      value={editorValue}
      onChange={onChange}
      onTextSelectionChange={onTextSelectionChange}
      selectionActionsRef={selectionActionsRef}
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
  onTextSelectionChange,
  selectionActionsRef,
}: TextSelectionProps & {
  value: string;
  readonly: boolean;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const current = useRef({ value, readonly, onChange, onTextSelectionChange });
  useLayoutEffect(() => {
    current.current = { value, readonly, onChange, onTextSelectionChange };
  }, [value, readonly, onChange, onTextSelectionChange]);
  useLayoutEffect(() => {
    if (!selectionActionsRef) return;
    selectionActionsRef.current = {
      replaceSelection(selection, replacement) {
        const state = current.current;
        if (
          state.readonly ||
          state.value !== selection.content ||
          selection.from < 0 ||
          selection.to > state.value.length ||
          selection.from >= selection.to ||
          state.value.slice(selection.from, selection.to) !== selection.text
        )
          return false;
        state.onChange(
          state.value.slice(0, selection.from) +
            replacement +
            state.value.slice(selection.to),
        );
        state.onTextSelectionChange?.(null);
        return true;
      },
      clearSelection() {
        const editor = editorRef.current;
        if (editor)
          editor.setSelectionRange(editor.selectionEnd, editor.selectionEnd);
        current.current.onTextSelectionChange?.(null);
      },
    };
    return () => {
      selectionActionsRef.current = null;
    };
  }, [selectionActionsRef]);
  useLayoutEffect(() => {
    current.current.onTextSelectionChange?.(null);
  }, [value]);

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
      onSelect={(event) => {
        const editor = event.currentTarget;
        // 点击右侧 AI 时保留最后的正文选区；正文内收起选区才清空。
        if (document.activeElement !== editor) return;
        const from = editor.selectionStart;
        const to = editor.selectionEnd;
        onTextSelectionChange?.(
          from < to
            ? { from, to, text: value.slice(from, to), content: value }
            : null,
        );
      }}
      placeholder="编辑内容"
    />
  );
}
