import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@dever/front-plugin";
import { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX } from "../shared/detail-dialog";
import "../shared/detail-dialog.css";
// 弹窗样式与分镜编辑共用；设定节点单独打开时也需要带上。
import "./space-storyboard-view.css";
import { Check, Trash2, X } from "lucide-react";
import {
  STORYBOARD_MATERIAL_LABELS,
  type StoryboardMaterial,
  type StoryboardMaterialUsage,
} from "./space-storyboard";
import type { PowerParamOption } from "./types";
import { SpaceTooltip } from "./space-tooltip";

export function StoryboardMaterialDialog({
  material,
  creating = false,
  context = "storyboard",
  readonly,
  usage,
  existingNames = [],
  onSave,
  onRemove,
  onClose,
  loadVoiceOptions,
}: {
  material: StoryboardMaterial;
  creating?: boolean;
  context?: "storyboard" | "setting";
  readonly: boolean;
  usage?: StoryboardMaterialUsage;
  existingNames?: string[];
  onSave: (material: StoryboardMaterial) => void;
  onRemove?: (materialId: string) => void;
  onClose: () => void;
  loadVoiceOptions?: () => Promise<PowerParamOption[]>;
}) {
  const [name, setName] = useState(material.name);
  const [prompt, setPrompt] = useState(material.prompt);
  const [voice, setVoice] = useState(material.voice);
  const [voiceOptions, setVoiceOptions] = useState<PowerParamOption[] | null>(null);
  const [voiceError, setVoiceError] = useState("");
  const loadsVoice = material.type === "character" && Boolean(loadVoiceOptions);
  useEffect(() => {
    if (!loadsVoice || !loadVoiceOptions) return;
    let cancelled = false;
    loadVoiceOptions().then(
      (options) => { if (!cancelled) setVoiceOptions(options); },
      (cause) => { if (!cancelled) setVoiceError(cause instanceof Error ? cause.message : "读取音色失败"); },
    );
    return () => { cancelled = true; };
  }, [loadsVoice, loadVoiceOptions]);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [returnFocus] = useState(() =>
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const normalizedName = name.trim().replace(/^[@#]+/, "");
  const normalizedPrompt = prompt.trim();
  const nameConflict = existingNames.some(
    (existingName) =>
      existingName.trim().toLocaleLowerCase() ===
      normalizedName.toLocaleLowerCase(),
  );
  const usageCount =
    (usage?.shotIds.length || 0) + (usage?.speechIds.length || 0);
  const canRemove =
    !creating && !readonly && Boolean(onRemove) && usageCount === 0;
  const materialLabel = STORYBOARD_MATERIAL_LABELS[material.type];

  return (
    <Dialog open onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent
        className="ws-storyboard-shot-dialog ws-storyboard-material-dialog nodrag nopan nowheel"
        layerClassName="wb-detail-backdrop is-dialog-layer"
        layerZIndex={DETAIL_DIALOG_CHILD_LAYER_Z_INDEX + 20}
        showCloseButton={false}
        aria-describedby={undefined}
        onCloseAutoFocus={(event: Event) => {
          if (returnFocus?.isConnected) {
            event.preventDefault();
            returnFocus.focus({ preventScroll: true });
          }
        }}
      >
        <header>
          <div>
            <DialogTitle>
              {creating
                ? `新增${materialLabel}`
                : material.name || materialLabel}
            </DialogTitle>
            <span>
              {materialLabel}素材
              {readonly
                ? " · 当前版本只读"
                : creating
                  ? (context === "setting" ? " · 保存到共用设定" : " · 保存后加入当前分镜草稿")
                  : (context === "setting" ? " · 所连接的分镜共用此设定" : " · 修改会保存到当前分镜草稿")}
            </span>
          </div>
          <button type="button" aria-label="关闭" onClick={onClose}>
            <X size={18} />
          </button>
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
          {material.type === "character" && loadsVoice ? (
            <label>
              <span>配音音色</span>
              {voiceOptions && voiceOptions.length > 0 ? (
                <select value={voice} disabled={readonly} onChange={(event) => setVoice(event.target.value)}>
                  <option value="">暂不指定</option>
                  {voice && !voiceOptions.some((option) => option.value === voice) ? (
                    <option value={voice}>当前值：{voice}</option>
                  ) : null}
                  {voiceOptions.map((option) => (
                    <option key={option.id || option.value} value={option.value}>
                      {option.group ? `${option.group} · ${option.name}` : option.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select value={voice} disabled>
                  <option value={voice}>
                    {voiceError ? "读取音色失败" : voiceOptions ? (voice || "暂不指定") : "正在读取音色…"}
                  </option>
                </select>
              )}
              <small className={voiceError ? "ws-storyboard-form-error" : undefined}>
                {voiceError
                  ? voiceError
                  : voiceOptions && voiceOptions.length === 0
                    ? "当前没有可用的语音合成能力，配置后可在这里选择音色。"
                    : "角色对白自动配音时使用；不指定时可在配音节点里再选。"}
              </small>
            </label>
          ) : material.type === "character" ? (
            <label>
              <span>配音音色</span>
              <input
                value={voice}
                readOnly={readonly}
                placeholder="自动配音时必填"
                onChange={(event) => setVoice(event.target.value)}
              />
              <small>填写当前语音能力支持的音色值。</small>
            </label>
          ) : null}
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
            {context === "setting" ? "修改后保留旧形象，重新生成或上传替换后用于后续制作。" : "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。"}
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
                    voice: material.type === "character" ? voice.trim() : "",
                  })
                }
              >
                <Check size={14} />
                {creating ? "添加素材" : "确认修改"}
              </button>
            ) : null}
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
