import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import {
  STORYBOARD_MATERIAL_LABELS,
  type StoryboardMaterial,
} from "./space-storyboard";

export function StoryboardMaterialDialog({
  material,
  readonly,
  portalContainer,
  onSave,
  onClose,
}: {
  material: StoryboardMaterial;
  readonly: boolean;
  portalContainer: Element | null;
  onSave: (material: StoryboardMaterial) => void;
  onClose: () => void;
}) {
  const [prompt, setPrompt] = useState(material.prompt);
  const normalizedPrompt = prompt.trim();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const dialog = (
    <div
      className="ws-storyboard-shot-backdrop ws-storyboard-material-backdrop"
      onMouseDown={onClose}
    >
      <section
        className="ws-storyboard-shot-dialog ws-storyboard-material-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${readonly ? "查看" : "编辑"}${STORYBOARD_MATERIAL_LABELS[material.type]}素材 ${material.name}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <strong>{material.name}</strong>
            <span>
              {STORYBOARD_MATERIAL_LABELS[material.type]}素材
              {readonly ? " · 当前版本只读" : " · 修改会保存到当前分镜草稿"}
            </span>
          </div>
          <button
            type="button"
            title="关闭"
            aria-label="关闭"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className="ws-storyboard-material-form nowheel">
          <label>
            <span>生成提示词</span>
            <textarea
              value={prompt}
              readOnly={readonly}
              autoFocus={!readonly}
              placeholder={`描述${material.name}的外观、结构、材质与风格`}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </label>
          <p>
            保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。
          </p>
        </div>

        <footer>
          <button type="button" onClick={onClose}>
            {readonly ? "关闭" : "取消"}
          </button>
          {!readonly ? (
            <button
              type="button"
              className="is-primary"
              disabled={!normalizedPrompt}
              onClick={() =>
                onSave({
                  ...material,
                  prompt: normalizedPrompt,
                })
              }
            >
              <Check size={14} />
              确认修改
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  );

  return typeof document === "undefined"
    ? null
    : createPortal(dialog, portalContainer || document.body);
}
