import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Trash2, X } from "lucide-react";
import {
  STORYBOARD_MATERIAL_LABELS,
  type StoryboardMaterial,
  type StoryboardMaterialUsage,
} from "./space-storyboard";
import { SpaceTooltip } from "./space-tooltip";

export function StoryboardMaterialDialog({
  material,
  creating = false,
  readonly,
  usage,
  existingNames = [],
  portalContainer,
  onSave,
  onRemove,
  onClose,
}: {
  material: StoryboardMaterial;
  creating?: boolean;
  readonly: boolean;
  usage?: StoryboardMaterialUsage;
  existingNames?: string[];
  portalContainer: Element | null;
  onSave: (material: StoryboardMaterial) => void;
  onRemove?: (materialId: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(material.name);
  const [prompt, setPrompt] = useState(material.prompt);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const normalizedName = name.trim().replace(/^[@#]+/, "");
  const normalizedPrompt = prompt.trim();
  const nameConflict = existingNames.some(
    (existingName) =>
      existingName.trim().toLocaleLowerCase() ===
      normalizedName.toLocaleLowerCase(),
  );
  const usageCount = (usage?.shotIds.length || 0) + (usage?.speechIds.length || 0);
  const canRemove = !creating && !readonly && Boolean(onRemove) && usageCount === 0;
  const materialLabel = STORYBOARD_MATERIAL_LABELS[material.type];

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
        aria-label={`${creating ? "新增" : readonly ? "查看" : "编辑"}${materialLabel}素材 ${material.name}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <strong>
              {creating ? `新增${materialLabel}` : material.name || materialLabel}
            </strong>
            <span>
              {materialLabel}素材
              {readonly
                ? " · 当前版本只读"
                : creating
                  ? " · 保存后加入当前分镜草稿"
                  : " · 修改会保存到当前分镜草稿"}
            </span>
          </div>
          <SpaceTooltip label="关闭">
            <button type="button" aria-label="关闭" onClick={onClose}>
              <X size={18} />
            </button>
          </SpaceTooltip>
        </header>

        <div className="ws-storyboard-material-form nowheel">
          <label>
            <span>素材名称</span>
            <input
              value={name}
              readOnly={readonly}
              autoFocus={!readonly}
              placeholder={`例如：${material.type === "character" ? "主角" : material.type === "scene" ? "咖啡馆" : "红色雨伞"}`}
              onChange={(event) => setName(event.target.value)}
            />
            {nameConflict ? (
              <small className="ws-storyboard-form-error">
                素材名称不能重复，否则画布引用无法准确定位。
              </small>
            ) : null}
          </label>
          <label>
            <span>生成提示词</span>
            <textarea
              value={prompt}
              readOnly={readonly}
              placeholder={`描述${normalizedName || materialLabel}的外观、结构、材质与风格`}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </label>
          {!creating && usageCount > 0 ? (
            <div className="ws-storyboard-material-usage" role="note">
              <strong>当前素材正在使用</strong>
              <span>
                {usage?.shotIds.length || 0} 个镜头
                {usage?.speechIds.length
                  ? ` · ${usage.speechIds.length} 条对白`
                  : ""}
                。请先在对应镜头中取消关联或更换对白角色，再删除素材。
              </span>
            </div>
          ) : null}
          <p>
            保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。
          </p>
        </div>

        <footer>
          <div>
            {!readonly && !creating && onRemove ? (
              <SpaceTooltip
                label={
                  usageCount > 0
                    ? "该素材仍被镜头或对白引用"
                    : confirmRemove
                      ? "再次点击确认删除"
                      : "删除素材"
                }
              >
                <button
                  type="button"
                  className="is-danger"
                  disabled={!canRemove}
                  onClick={() => {
                    if (!confirmRemove) {
                      setConfirmRemove(true);
                      return;
                    }
                    onRemove(material.id);
                  }}
                >
                  <Trash2 size={14} />
                  {confirmRemove ? "确认删除" : "删除素材"}
                </button>
              </SpaceTooltip>
            ) : null}
          </div>
          <div>
            <button type="button" onClick={onClose}>
              {readonly ? "关闭" : "取消"}
            </button>
            {!readonly ? (
              <button
                type="button"
                className="is-primary"
                disabled={!normalizedName || !normalizedPrompt || nameConflict}
                onClick={() =>
                  onSave({
                    ...material,
                    name: normalizedName,
                    prompt: normalizedPrompt,
                  })
                }
              >
                <Check size={14} />
                {creating ? "添加素材" : "确认修改"}
              </button>
            ) : null}
          </div>
        </footer>
      </section>
    </div>
  );

  return typeof document === "undefined"
    ? null
    : createPortal(dialog, portalContainer || document.body);
}
