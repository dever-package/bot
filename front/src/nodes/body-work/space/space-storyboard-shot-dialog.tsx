import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Dialog, DialogContent, DialogTitle } from "@dever/front-plugin";
import { Check, ChevronLeft, ChevronRight, Loader2, Pencil, Sparkles, X } from "lucide-react";
import {
  MIN_STORYBOARD_SHOT_DURATION,
  STORYBOARD_MATERIAL_LABELS,
  STORYBOARD_TRANSITION_LABELS,
  STORYBOARD_TRANSITION_TYPES,
  storyboardMaterialUsage,
  storyboardShotLinksPreviousState,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardReferenceField,
  type StoryboardShot,
  type StoryboardShotGeneration,
  type StoryboardTransitionType,
} from "./space-storyboard";
import {
  STORYBOARD_SHOT_IMAGE_MODE_LABELS,
  normalizeStoryboardShotImageMode,
  storyboardShotImagePlan,
  storyboardShotImageModesForShot,
} from "./space-storyboard-frame-plan";
import {
  CanvasReferenceEditorWithAdapter,
  type CanvasReferenceAdapter,
} from "./space-reference-editor";
import type { CanvasReferenceContent } from "./types";
import type { StoryboardFrame } from "./space-storyboard-media";
import { SpaceTooltip } from "./space-tooltip";
import {
  applyGeneratedStoryboardShot,
  cloneStoryboardShot,
  storyboardReferenceFieldPatch,
  storyboardShotDraftIssues,
} from "./space-storyboard-shot-edit";
import { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX } from "../shared/detail-dialog";
import "../shared/detail-dialog.css";
import { StoryboardMaterialDialog } from "./space-storyboard-material-dialog";
import { StoryboardShotSpeechEditor } from "./space-storyboard-shot-speech";
import "./space-storyboard-view.css";

type StoryboardContinuityMode = "independent" | "match" | "continue";
const STORYBOARD_CONTINUITY_MODES = [
  { value: "continue", label: "接上一镜", description: "从上一镜最后一帧继续" },
  { value: "match", label: "同场换机位", description: "同一场戏，换个角度" },
  { value: "independent", label: "换场", description: "新场景或全新构图" },
] as const;

export function StoryboardShotDialog({
  shot,
  index,
  previousShot,
  storyboard,
  materials,
  readonly,
  referenceAdapter,
  frame,
  onGenerate,
  onNavigate,
  onSave,
  onClose,
}: {
  shot: StoryboardShot;
  index: number;
  previousShot?: StoryboardShot;
  storyboard: StoryboardDocument;
  materials: StoryboardMaterial[];
  readonly: boolean;
  referenceAdapter: CanvasReferenceAdapter;
  frame?: StoryboardFrame;
  onNavigate?: (shotId: string) => void;
  onGenerate?: (
    storyboard: StoryboardDocument,
    shotId: string,
    instruction: string,
  ) => Promise<StoryboardShotGeneration>;
  onSave: (shot: StoryboardShot, materials: StoryboardMaterial[]) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(() => cloneStoryboardShot(shot));
  const [dialogMaterials, setDialogMaterials] = useState(() =>
    materials.map((material) => ({ ...material })),
  );
  const [initialState] = useState(() => JSON.stringify([draft, dialogMaterials]));
  const [editingMaterialId, setEditingMaterialId] = useState("");
  const editingMaterial = dialogMaterials.find(
    (material) => material.id === editingMaterialId,
  );
  const [generating, setGenerating] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const closeDialog = () => {
    mountedRef.current = false;
    onClose();
  };
  const [instruction, setInstruction] = useState("");
  const [endFramingOpen, setEndFramingOpen] = useState(false);
  const [returnFocus] = useState(() =>
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const [generationError, setGenerationError] = useState("");
  const persistedMaterialIDs = new Set(
    materials.map((material) => material.id),
  );
  const speechCharacterIDs = new Set(
    draft.speech
      .filter((speech) => speech.kind === "dialogue")
      .map((speech) => speech.character_id || "")
      .filter(Boolean),
  );
  const entryStateLinked = storyboardShotLinksPreviousState(draft, index);
  const sharedEndShot = storyboard.shots.find(
    (entry) => entry.id === draft.shared_end_shot_id,
  );
  const continuityMode = storyboardContinuityMode(draft);
  const showEndFraming =
    endFramingOpen ||
    Boolean(
      draft.end_framing?.trim() &&
        draft.end_framing.trim() !== (draft.start_framing || "").trim(),
    );
  const previewURL = [frame?.start, frame?.end, ...(frame?.references || [])]
    .find((entry) => entry?.imageURL)?.imageURL;
  // 切换镜头只在没有未保存修改时可用，避免静默丢弃草稿。
  const dirty = JSON.stringify([draft, dialogMaterials]) !== initialState;
  const navigateTo = (target?: StoryboardShot) =>
    target && onNavigate && !generating && !dirty ? () => onNavigate(target.id) : undefined;
  const previousTarget = navigateTo(storyboard.shots[index - 1]);
  const nextTarget = navigateTo(storyboard.shots[index + 1]);
  const draftIssues = storyboardShotDraftIssues(
    storyboard,
    draft,
    dialogMaterials,
  );
  const updateField = (
    field: StoryboardReferenceField,
    value: string,
    content?: CanvasReferenceContent,
  ) => {
    setDraft((current) => ({
      ...current,
      ...storyboardReferenceFieldPatch(current, field, value, content),
    }));
  };
  const toggleMaterial = (materialID: string) => {
    setDraft((current) => {
      if (current.material_ids.includes(materialID)) {
        if (speechCharacterIDs.has(materialID)) {
          return current;
        }
        return {
          ...current,
          material_ids: current.material_ids.filter((id) => id !== materialID),
        };
      }
      return {
        ...current,
        material_ids: [...current.material_ids, materialID],
      };
    });
  };
  const generateShot = async (instruction: string) => {
    if (!onGenerate || generating) {
      return false;
    }
    setGenerationError("");
    setGenerating(true);
    try {
      const context: StoryboardDocument = {
        ...storyboard,
        materials: dialogMaterials,
        shots: storyboard.shots.map((item) =>
          item.id === draft.id ? draft : item,
        ),
      };
      const generation = await onGenerate(
        context,
        draft.id,
        instruction.trim(),
      );
      const validated = applyGeneratedStoryboardShot(
        context,
        draft,
        generation,
      );
      if (!mountedRef.current) return false;
      setDialogMaterials(validated.materials);
      setDraft(validated.shot);
      setInstruction("");
      return true;
    } catch (error) {
      if (!mountedRef.current) return false;
      setGenerationError(
        error instanceof Error ? error.message : "生成镜头失败，请重试",
      );
      return false;
    } finally {
      if (mountedRef.current) setGenerating(false);
    }
  };
  return (
    <>
      <Dialog open onOpenChange={(open: boolean) => !open && closeDialog()}>
        <DialogContent
          className="ws-storyboard-shot-dialog ws-storyboard-shot-editor nodrag nopan nowheel"
          layerClassName="wb-detail-backdrop is-dialog-layer"
          layerZIndex={DETAIL_DIALOG_CHILD_LAYER_Z_INDEX}
          showCloseButton={false}
          aria-describedby={undefined}
          aria-busy={generating}
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
                {readonly ? "查看镜头" : "编辑镜头"}{" "}
                {String(index + 1).padStart(2, "0")}
              </DialogTitle>
              <span>
                {readonly ? "当前分镜已经确认" : "修改会保存到当前分镜草稿"}
              </span>
            </div>
            {onNavigate && storyboard.shots.length > 1 ? (
              <SpaceTooltip label={dirty ? "先保存或取消当前修改再切换" : "切换镜头"}>
                <div className="ws-storyboard-shot-nav">
                  <button type="button" aria-label="上一镜" disabled={!previousTarget} onClick={previousTarget}>
                    <ChevronLeft size={16} />
                  </button>
                  <span>{index + 1}/{storyboard.shots.length}</span>
                  <button type="button" aria-label="下一镜" disabled={!nextTarget} onClick={nextTarget}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </SpaceTooltip>
            ) : null}
            <button type="button" aria-label="关闭" onClick={closeDialog}>
              <X size={18} />
            </button>
          </header>

          <div className="ws-storyboard-shot-editor-body">
            <fieldset
              className="ws-storyboard-shot-form nowheel"
              disabled={generating}
            >
              {previewURL ? (
                <figure
                  className="ws-storyboard-shot-preview"
                  style={{ aspectRatio: storyboard.aspect_ratio?.replace(":", " / ") }}
                >
                  <img src={previewURL} alt={`镜头 ${index + 1} 画面`} decoding="async" />
                </figure>
              ) : null}
              <section className="ws-storyboard-shot-section">
                <div className="ws-storyboard-shot-section-head">
                  <strong>镜头内容</strong>
                  <div>
                    <label>
                      时长
                      <input
                        type="number"
                        min={MIN_STORYBOARD_SHOT_DURATION}
                        step={1}
                        value={draft.duration || ""}
                        disabled={readonly}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            duration: storyboardDurationFromInput(event),
                          }))
                        }
                      />
                      秒
                    </label>
                  </div>
                </div>
                {index > 0 ? (
                  <div className="ws-storyboard-continuity-modes" role="radiogroup" aria-label="与上一镜关系">
                    {STORYBOARD_CONTINUITY_MODES.map((option) => (
                      <label
                        key={option.value}
                        className={`ws-storyboard-continuity-input${
                          continuityMode === option.value ? " is-selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`storyboard-continuity-${shot.id}`}
                          value={option.value}
                          checked={continuityMode === option.value}
                          disabled={readonly}
                          onChange={() =>
                            setDraft((current) =>
                              withStoryboardContinuityMode(current, option.value, previousShot),
                            )
                          }
                        />
                        <span>
                          <strong>{option.label}</strong>
                          <small>{option.description}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
                <div className="ws-storyboard-shot-field-row is-single">
                  <StoryboardDialogField
                    label="画面描述"
                    value={draft.description}
                    content={draft.reference_contents?.description}
                    placeholder="画面里有谁、在哪、是什么环境"
                    readonly={readonly || generating}
                    referenceAdapter={referenceAdapter}
                    onChange={(value, content) =>
                      updateField("description", value, content)
                    }
                  />
                </div>
                <div className="ws-storyboard-shot-field-row is-single">
                  <StoryboardPlainField
                    label="动作与变化"
                    value={draft.beat}
                    placeholder="这一镜发生了什么：动作、结果或关系变化"
                    readonly={readonly || generating}
                    onChange={(value) =>
                      setDraft((current) => ({ ...current, beat: value }))
                    }
                  />
                </div>
              </section>

              <section className="ws-storyboard-shot-section">
                <div className="ws-storyboard-shot-section-head">
                  <strong>镜头与构图</strong>
                </div>
                <div className="ws-storyboard-shot-field-row">
                  <StoryboardDialogField
                    label="景别与运镜"
                    value={draft.camera_instruction}
                    content={draft.reference_contents?.camera_instruction}
                    placeholder="例如：中景，缓慢推近"
                    readonly={readonly || generating}
                    referenceAdapter={referenceAdapter}
                    onChange={(value, content) =>
                      updateField("camera_instruction", value, content)
                    }
                  />
                  <StoryboardDialogField
                    label={showEndFraming ? "起始构图" : "构图"}
                    value={draft.start_framing || ""}
                    content={draft.reference_contents?.start_framing}
                    placeholder="主体在画面中的位置、景深与焦点"
                    readonly={readonly || generating}
                    referenceAdapter={referenceAdapter}
                    onChange={(value, content) =>
                      updateField("start_framing", value, content)
                    }
                  />
                </div>
                {showEndFraming ? (
                  <div className="ws-storyboard-shot-field-row is-single">
                    <StoryboardDialogField
                      label="结束构图"
                      value={draft.end_framing || ""}
                      content={draft.reference_contents?.end_framing}
                      placeholder="动作结束时的景别、主体位置、景深与焦点"
                      readonly={readonly || generating}
                      referenceAdapter={referenceAdapter}
                      onChange={(value, content) =>
                        updateField("end_framing", value, content)
                      }
                    />
                  </div>
                ) : !readonly ? (
                  <button
                    type="button"
                    className="ws-storyboard-shot-inline-action"
                    onClick={() => setEndFramingOpen(true)}
                  >
                    结束时构图不同？单独填写
                  </button>
                ) : null}
              </section>

              <section className="ws-storyboard-shot-section">
                <div className="ws-storyboard-shot-section-head">
                  <div>
                    <strong>出场素材</strong>
                    <span>{draft.material_ids.length} 个</span>
                  </div>
                </div>
                {dialogMaterials.length ? (
                  <div className="ws-storyboard-material-groups">
                    {(["character", "scene", "prop"] as const).map((type) => {
                      const typedMaterials = dialogMaterials.filter(
                        (material) => material.type === type,
                      );
                      if (!typedMaterials.length) {
                        return null;
                      }
                      return (
                        <fieldset key={type}>
                          <legend>{STORYBOARD_MATERIAL_LABELS[type]}</legend>
                          <div>
                            {typedMaterials.map((material) => {
                              const selected = draft.material_ids.includes(
                                material.id,
                              );
                              const required = speechCharacterIDs.has(
                                material.id,
                              );
                              return (
                                <div
                                  className="ws-storyboard-material-option"
                                  key={material.id}
                                >
                                  <SpaceTooltip
                                    label={
                                      selected && required
                                        ? "该角色已用于对白，不能取消关联"
                                        : selected
                                          ? "取消关联"
                                          : "关联素材"
                                    }
                                  >
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={selected}
                                        disabled={
                                          readonly || (selected && required)
                                        }
                                        onChange={() =>
                                          toggleMaterial(material.id)
                                        }
                                      />
                                      <span className="sr-only">
                                        关联 {material.name}
                                      </span>
                                    </label>
                                  </SpaceTooltip>
                                  <SpaceTooltip
                                    label={`${readonly ? "查看" : "编辑"}${STORYBOARD_MATERIAL_LABELS[type]}提示词：${material.name}`}
                                  >
                                    <button
                                      type="button"
                                      disabled={generating}
                                      onClick={() =>
                                        setEditingMaterialId(material.id)
                                      }
                                    >
                                      <span>{material.name}</span>
                                      {!readonly ? <Pencil size={11} /> : null}
                                    </button>
                                  </SpaceTooltip>
                                </div>
                              );
                            })}
                          </div>
                        </fieldset>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ws-storyboard-material-empty">
                    当前脚本没有角色、场景或道具素材
                  </div>
                )}
              </section>

              <StoryboardShotSpeechEditor
                shot={draft}
                materials={dialogMaterials}
                readonly={readonly || generating}
                onChange={setDraft}
              />

              <details className="ws-storyboard-shot-advanced">
                <summary>
                  <strong>高级设置</strong>
                  <span>系统生成，一般不用改</span>
                </summary>
                <div className="ws-storyboard-shot-field-row is-single">
                  <StoryboardDialogField
                    label="空间关系"
                    value={draft.spatial_layout}
                    content={draft.reference_contents?.spatial_layout}
                    placeholder="主体、环境和物件的前后左右、接触或承载关系，以及真实相对尺度"
                    readonly={readonly || generating}
                    referenceAdapter={referenceAdapter}
                    onChange={(value, content) =>
                      updateField("spatial_layout", value, content)
                    }
                  />
                </div>
                <div className="ws-storyboard-shot-field-row is-single">
                  <StoryboardDialogField
                    label="视频提示词"
                    value={draft.video_prompt}
                    content={draft.reference_contents?.video_prompt}
                    placeholder="补充视频制作要求；与动作、构图和运镜保持一致"
                    readonly={readonly || generating}
                    referenceAdapter={referenceAdapter}
                    onChange={(value, content) =>
                      updateField("video_prompt", value, content)
                    }
                  />
                </div>
                {index > 0 ? (
                  <div className="ws-storyboard-shot-field-row is-single">
                    <StoryboardPlainField
                      label="与上镜关系说明"
                      value={draft.transition}
                      placeholder="上一镜头的什么结果触发本镜，或通过什么明确方式转场"
                      readonly={readonly || generating}
                      onChange={(value) =>
                        setDraft((current) => ({ ...current, transition: value }))
                      }
                    />
                  </div>
                ) : null}
                  {index > 0 && draft.continue_previous ? (
                    <label className="ws-storyboard-continuity-anchor">
                      <span>连续性锚点</span>
                      <textarea
                        value={draft.continuity_anchor}
                        readOnly={readonly}
                        placeholder="写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线"
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            continuity_anchor: event.target.value,
                          }))
                        }
                      />
                    </label>
                  ) : null}
                  <div className="ws-storyboard-shot-field-row">
                    <StoryboardPlainField
                      label="入镜状态"
                      value={draft.continuity_state.entry}
                      placeholder="主体位置、姿态、服装、道具状态、时间、光线和运动方向"
                      readonly={readonly || generating || entryStateLinked}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          continuity_state: {
                            ...current.continuity_state,
                            entry: value,
                          },
                        }))
                      }
                    />
                    <StoryboardPlainField
                      label="出镜状态"
                      value={draft.continuity_state.exit}
                      placeholder="本镜主要动作完成后，主体和环境停在什么可见状态"
                      readonly={readonly || generating}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          continuity_state: {
                            ...current.continuity_state,
                            exit: value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="ws-storyboard-shot-field-row is-single">
                    <label>
                      <span>镜头图片</span>
                      <select
                        value={draft.shot_image_mode}
                        disabled={readonly}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            shot_image_mode: normalizeStoryboardShotImageMode(
                              event.target.value,
                            ),
                            shared_end_shot_id:
                              event.target.value === "next_first"
                                ? storyboard.shots[index + 1]?.id || ""
                                : "",
                          }))
                        }
                      >
                        {storyboardShotImageModesForShot(draft)
                          .filter(
                            (mode) =>
                              mode !== "next_first" ||
                              (!draft.continue_previous &&
                                Boolean(storyboard.shots[index + 1])),
                          )
                          .map((mode) => (
                            <option key={mode} value={mode}>
                              {mode === "first_frame" && draft.continue_previous
                                ? "首帧（沿用上镜尾帧）"
                                : mode === "last_frame" && draft.continue_previous
                                  ? "尾帧（首帧沿用上镜）"
                                  : STORYBOARD_SHOT_IMAGE_MODE_LABELS[mode]}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                  {draft.shot_image_mode === "next_first" ? (
                    <p>
                      {sharedEndShot
                        ? `结束画面：镜头 ${sharedEndShot.order} 首帧`
                        : "共享来源已移除"}
                    </p>
                  ) : null}
                  {index > 0 ? (
                    <div className="ws-storyboard-shot-field-row">
                      <label>
                        <span>剪辑转场</span>
                        <select
                          value={draft.transition_type}
                          disabled={readonly}
                          onChange={(event) =>
                            setDraft((current) => {
                              const transitionType = event.target
                                .value as StoryboardTransitionType;
                              return {
                                ...current,
                                transition_type: transitionType,
                                transition_duration_ms:
                                  transitionType === "none"
                                    ? 0
                                    : Math.max(
                                        500,
                                        current.transition_duration_ms,
                                      ),
                              };
                            })
                          }
                        >
                          {STORYBOARD_TRANSITION_TYPES.map((transitionType) => (
                            <option key={transitionType} value={transitionType}>
                              {STORYBOARD_TRANSITION_LABELS[transitionType]}
                            </option>
                          ))}
                        </select>
                      </label>
                      {draft.transition_type !== "none" ? (
                        <label>
                          <span>转场时长</span>
                          <input
                            type="number"
                            min={100}
                            max={5000}
                            step={100}
                            value={draft.transition_duration_ms}
                            disabled={readonly}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                transition_duration_ms: Math.min(
                                  5000,
                                  positiveIntegerFromInput(
                                    event,
                                    current.transition_duration_ms,
                                    100,
                                  ),
                                ),
                              }))
                            }
                          />
                        </label>
                      ) : null}
                    </div>
                  ) : null}
              </details>

              {draftIssues.length ? (
                <div className="ws-storyboard-form-error" role="alert">
                  {draftIssues.map((issue) => (
                    <p key={issue.id}>{issue.message}</p>
                  ))}
                </div>
              ) : null}
            </fieldset>
            {!readonly && onGenerate ? (
              <aside className="ws-storyboard-shot-ai">
                <strong>
                  <Sparkles size={15} />
                  AI 修改
                </strong>
                <label>
                  <span>修改要求</span>
                  <textarea
                    value={instruction}
                    disabled={generating}
                    placeholder="例如：改成手部特写，保留人物和道具，调整动作与前后镜头的衔接"
                    onChange={(event) => {
                      setInstruction(event.target.value);
                      setGenerationError("");
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={generating || !instruction.trim()}
                  onClick={() => void generateShot(instruction)}
                >
                  {generating ? (
                    <Loader2 size={14} className="ws-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {generating ? "正在修改" : "修改当前镜头"}
                </button>
                <p>生成后直接更新左侧草稿，检查后保存。取消会保留原镜头。</p>
                {generationError ? (
                  <p className="ws-storyboard-form-error" role="alert">
                    {generationError}
                  </p>
                ) : null}
              </aside>
            ) : null}
          </div>

          <footer>
            <button type="button" onClick={closeDialog}>
              {readonly ? "关闭" : "取消"}
            </button>
            {!readonly ? (
              <button
                type="button"
                className="is-primary"
                disabled={generating || draftIssues.length > 0}
                onClick={() =>
                  onSave(
                    draft,
                    dialogMaterials.filter(
                      (material) =>
                        persistedMaterialIDs.has(material.id) ||
                        draft.material_ids.includes(material.id),
                    ),
                  )
                }
              >
                <Check size={14} />
                保存镜头
              </button>
            ) : null}
          </footer>
        </DialogContent>
      </Dialog>
      {editingMaterial ? (
        <StoryboardMaterialDialog
          material={editingMaterial}
          readonly={readonly || generating}
          usage={storyboardMaterialUsage(
            {
              ...storyboard,
              materials: dialogMaterials,
              shots: storyboard.shots.map((entry) =>
                entry.id === draft.id ? draft : entry,
              ),
            },
            editingMaterial.id,
          )}
          existingNames={dialogMaterials
            .filter((material) => material.id !== editingMaterial.id)
            .map((material) => material.name)}
          onSave={(material) => {
            setDialogMaterials((current) =>
              current.map((entry) =>
                entry.id === material.id ? material : entry,
              ),
            );
            setEditingMaterialId("");
          }}
          onClose={() => setEditingMaterialId("")}
        />
      ) : null}
    </>
  );
}

function StoryboardDialogField({
  label,
  value,
  content,
  placeholder,
  readonly,
  referenceAdapter,
  onChange,
}: {
  label: string;
  value: string;
  content?: CanvasReferenceContent;
  placeholder: string;
  readonly: boolean;
  referenceAdapter: CanvasReferenceAdapter;
  onChange: (value: string, content?: CanvasReferenceContent) => void;
}) {
  return (
    <label className="ws-storyboard-shot-field">
      <span>{label}</span>
      <CanvasReferenceEditorWithAdapter
        className="ws-storyboard-reference-editor nodrag nopan nowheel"
        value={value}
        content={content}
        adapter={referenceAdapter}
        placeholder={placeholder}
        disabled={readonly}
        layerZIndex={DETAIL_DIALOG_CHILD_LAYER_Z_INDEX + 40}
        onChange={onChange}
      />
    </label>
  );
}

function StoryboardPlainField({
  label,
  value,
  placeholder,
  readonly,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  readonly: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="ws-storyboard-shot-field">
      <span>{label}</span>
      <textarea
        className="nodrag nopan nowheel ws-storyboard-plain-field"
        value={value}
        rows={3}
        placeholder={placeholder}
        readOnly={readonly}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function storyboardContinuityMode(
  shot: StoryboardShot,
): StoryboardContinuityMode {
  if (shot.continue_previous) return "continue";
  if (shot.match_previous) return "match";
  return "independent";
}

function withStoryboardContinuityMode(
  shot: StoryboardShot,
  mode: StoryboardContinuityMode,
  previousShot?: StoryboardShot,
): StoryboardShot {
  const linksPrevious = mode !== "independent";
  const continuesPrevious = mode === "continue";
  return {
    ...shot,
    match_previous: mode === "match",
    continue_previous: continuesPrevious,
    shot_image_mode: storyboardShotImagePlan({
      ...shot,
      match_previous: mode === "match",
      continue_previous: continuesPrevious,
    }).mode,
    continuity_anchor: continuesPrevious ? shot.continuity_anchor : "",
    continuity_state: linksPrevious
      ? {
          ...shot.continuity_state,
          entry:
            previousShot?.continuity_state.exit || shot.continuity_state.entry,
        }
      : shot.continuity_state,
  };
}

function storyboardDurationFromInput(event: ChangeEvent<HTMLInputElement>) {
  const value = Number(event.target.value);
  return Number.isFinite(value) ? value : 0;
}

function positiveIntegerFromInput(
  event: ChangeEvent<HTMLInputElement>,
  fallback: number,
  minimum: number,
) {
  const value = Number(event.target.value);
  return Number.isInteger(value) && value >= minimum ? value : fallback;
}
