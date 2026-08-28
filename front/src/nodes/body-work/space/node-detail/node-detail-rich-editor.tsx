import { AssetTextContentEditor } from "../../shared/asset-text-content-editor";
import {
  nodeDetailContentWithValue,
  type NodeDetailEditableContent,
} from "./node-detail-content";

export function NodeDetailRichEditor({
  content,
  kind,
  readonly,
  onChange,
}: {
  content: NodeDetailEditableContent;
  kind: "text" | "richtext";
  readonly: boolean;
  onChange: (content: NodeDetailEditableContent) => void;
}) {
  const value = String(content.value || "");
  return (
    <div className="ws-node-detail-editor">
      <AssetTextContentEditor
        kind={kind}
        value={value}
        contentFormat={content.format}
        readonly={readonly}
        onChange={(nextValue) =>
          onChange(nodeDetailContentWithValue(content, nextValue))
        }
      />
    </div>
  );
}
