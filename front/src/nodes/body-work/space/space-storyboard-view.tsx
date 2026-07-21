import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowUp,
  BookOpenText,
  Check,
  Copy,
  Loader2,
  MessageSquareText,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  MIN_STORYBOARD_SHOT_DURATION,
  STORYBOARD_MATERIAL_LABELS,
  createStoryboardShot,
  createStoryboardSpeech,
  isStoryboardConfirmed,
  isStoryboardShotDurationValid,
  normalizeStoryboardOrder,
  storyboardSpeechCount,
  storyboardTotalDuration,
  storyboardVisibleSpeakerIds,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardReferenceField,
  type StoryboardShot,
  type StoryboardSpeech,
  type StoryboardSpeechKind,
} from "./space-storyboard";
import {
  moveOrderedItemById,
  orderItemsByIds,
  sameOrderedIds,
} from "./space-ordered-list";
import type { ComposerAssetItem } from "./space-prompt-composer";
import {
  reconcileCanvasReferenceContent,
  type CanvasReferenceTarget,
} from "./space-reference-content";
import type { CanvasReferenceContent } from "./types";
import {
  CanvasReferenceEditorWithAdapter,
  useCanvasReferenceAdapter,
  type CanvasReferenceAdapter,
} from "./space-reference-editor";
import { StoryboardShotCard } from "./space-storyboard-shot-card";
import { StoryboardMaterialDialog } from "./space-storyboard-material-dialog";
import "./space.css";

export type StoryboardSaveStatus = "saved" | "typing" | "saving" | "error";
export type StoryboardWorkflowAction = "" | "confirming" | "revising";

const EMPTY_REFERENCE_ITEMS: ComposerAssetItem[] = [];

export function StoryboardView({
  storyboard,
  editable = false,
  disabled = false,
  onSave,
  onChange,
  onConfirm,
  onCreateRevision,
  workflowAction = "",
  lipSyncEnabled = false,
  saveStatus: externalSaveStatus,
  showSaveStatus = true,
  showMetrics = true,
  referenceItems = EMPTY_REFERENCE_ITEMS,
}: {
  storyboard: StoryboardDocument;
  editable?: boolean;
  disabled?: boolean;
  onSave?: (storyboard: StoryboardDocument) => Promise<void>;
  onChange?: (storyboard: StoryboardDocument) => void;
  onConfirm?: (storyboard: StoryboardDocument) => void | Promise<void>;
  onCreateRevision?: () => void | Promise<void>;
  workflowAction?: StoryboardWorkflowAction;
  lipSyncEnabled?: boolean;
  saveStatus?: StoryboardSaveStatus;
  showSaveStatus?: boolean;
  showMetrics?: boolean;
  referenceItems?: ComposerAssetItem[];
}) {
  const externalSignature = useMemo(
    () => JSON.stringify(storyboard),
    [storyboard],
  );
  const [internalDraft, setInternalDraft] = useState(storyboard);
  const [saveStatus, setSaveStatus] = useState<StoryboardSaveStatus>("saved");
  const [editingShotId, setEditingShotId] = useState("");
  const [editingMaterialId, setEditingMaterialId] = useState("");
  const [draggedShotId, setDraggedShotId] = useState("");
  const [dragOverShotId, setDragOverShotId] = useState("");
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [dragPlacement, setDragPlacement] = useState<"before" | "after">(
    "before",
  );
  const storyboardRootRef = useRef<HTMLElement>(null);
  const draggedShotIdRef = useRef("");
  const dragOrderRef = useRef<string[]>([]);
  const shotRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const reorderAnimationsRef = useRef<Map<string, Animation>>(new Map());
  const draftRef = useRef(storyboard);
  const dirtyRef = useRef(false);
  const revisionRef = useRef(0);
  const externalSignatureRef = useRef(externalSignature);
  const saveTimerRef = useRef<number | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const mountedRef = useRef(true);
  const controlled = Boolean(onChange);
  const draft = controlled ? storyboard : internalDraft;
  const confirmed = isStoryboardConfirmed(draft);
  const canEdit =
    editable &&
    !disabled &&
    !confirmed &&
    !workflowAction &&
    Boolean(onChange || onSave);
  const canAutoSave = canEdit && !controlled && Boolean(onSave);
  const referenceAdapter = useCanvasReferenceAdapter(referenceItems);
  const editingShot = draft.shots.find((shot) => shot.id === editingShotId);
  const editingMaterial = draft.materials.find(
    (material) => material.id === editingMaterialId,
  );
  const visibleShots = useMemo(
    () => orderItemsByIds(draft.shots, dragOrder, (shot) => shot.id),
    [draft.shots, dragOrder],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(
    () => () => {
      for (const animation of reorderAnimationsRef.current.values()) {
        animation.cancel();
      }
      reorderAnimationsRef.current.clear();
    },
    [],
  );

  useLayoutEffect(() => {
    const previousRects = shotRectsRef.current;
    const root = storyboardRootRef.current;
    if (!root || previousRects.size === 0) {
      return;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    root
      .querySelectorAll<HTMLElement>(
        ".ws-storyboard-card[data-sequence-item-id]",
      )
      .forEach((element) => {
        if (element.classList.contains("is-dragging")) {
          return;
        }
        const itemId = element.dataset.sequenceItemId || "";
        const previous = previousRects.get(itemId);
        if (!previous || reduceMotion) {
          return;
        }
        const current = element.getBoundingClientRect();
        const offsetX = previous.left - current.left;
        const offsetY = previous.top - current.top;
        if (Math.abs(offsetX) < 1 && Math.abs(offsetY) < 1) {
          return;
        }
        reorderAnimationsRef.current.get(itemId)?.cancel();
        const animation = element.animate(
          [
            { transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` },
            { transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: 190,
            easing: "cubic-bezier(0.2, 0.75, 0.25, 1)",
          },
        );
        reorderAnimationsRef.current.set(itemId, animation);
        animation.onfinish = () => {
          if (reorderAnimationsRef.current.get(itemId) === animation) {
            reorderAnimationsRef.current.delete(itemId);
          }
        };
      });
    previousRects.clear();
  }, [dragOrder]);

  useEffect(() => {
    if (externalSignatureRef.current === externalSignature) {
      return;
    }
    externalSignatureRef.current = externalSignature;
    if (dirtyRef.current) {
      return;
    }
    draftRef.current = storyboard;
    setInternalDraft(storyboard);
    setSaveStatus("saved");
  }, [externalSignature, storyboard]);

  useEffect(() => {
    if (editingShotId && !editingShot) {
      setEditingShotId("");
    }
  }, [editingShot, editingShotId]);

  useEffect(() => {
    if (editingMaterialId && !editingMaterial) {
      setEditingMaterialId("");
    }
  }, [editingMaterial, editingMaterialId]);

  useEffect(() => {
    if (!canAutoSave || !dirtyRef.current || !onSave) {
      return;
    }
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }
    const nextStoryboard = draft;
    const revision = revisionRef.current;
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null;
      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (mountedRef.current && revision === revisionRef.current) {
            setSaveStatus("saving");
          }
          try {
            await onSave(nextStoryboard);
            if (!mountedRef.current || revision !== revisionRef.current) {
              return;
            }
            dirtyRef.current = false;
            setSaveStatus("saved");
          } catch {
            if (!mountedRef.current || revision !== revisionRef.current) {
              return;
            }
            setSaveStatus("error");
          }
        });
    }, 800);
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [canAutoSave, draft, onSave]);

  const updateDraft = (
    updater: (current: StoryboardDocument) => StoryboardDocument,
  ) => {
    if (!canEdit) {
      return;
    }
    const current = controlled ? storyboard : draftRef.current;
    const next = withStoryboardReferenceContents(
      normalizeStoryboardOrder(updater(current)),
      referenceAdapter.options,
    );
    draftRef.current = next;
    if (controlled) {
      onChange?.(next);
      return;
    }
    dirtyRef.current = true;
    revisionRef.current += 1;
    setInternalDraft(next);
    setSaveStatus("typing");
  };

  const captureShotRects = () => {
    const root = storyboardRootRef.current;
    if (!root) {
      return;
    }
    const rects = new Map<string, DOMRect>();
    root
      .querySelectorAll<HTMLElement>(
        ".ws-storyboard-card[data-sequence-item-id]",
      )
      .forEach((element) => {
        const itemId = element.dataset.sequenceItemId || "";
        if (itemId) {
          rects.set(itemId, element.getBoundingClientRect());
        }
      });
    shotRectsRef.current = rects;
  };

  const beginShotDrag = (shotId: string) => {
    const order = draft.shots.map((shot) => shot.id);
    draggedShotIdRef.current = shotId;
    dragOrderRef.current = order;
    setDraggedShotId(shotId);
    setDragOverShotId("");
    setDragOrder(order);
  };

  const previewShotOrder = (
    targetId: string,
    event: DragEvent<HTMLElement>,
  ) => {
    const sourceId = draggedShotIdRef.current;
    const currentOrder = dragOrderRef.current;
    if (
      !sourceId ||
      !targetId ||
      sourceId === targetId ||
      !currentOrder.length
    ) {
      return;
    }
    if (!currentOrder.includes(sourceId) || !currentOrder.includes(targetId)) {
      return;
    }
    const targetRect = event.currentTarget.getBoundingClientRect();
    const gridRect = event.currentTarget.parentElement?.getBoundingClientRect();
    const hasMultipleColumns = Boolean(
      gridRect && targetRect.width * 1.5 < gridRect.width,
    );
    const placement = hasMultipleColumns
      ? event.clientX < targetRect.left + targetRect.width / 2
        ? "before"
        : "after"
      : event.clientY < targetRect.top + targetRect.height / 2
        ? "before"
        : "after";
    const nextOrder = moveOrderedItemById(
      currentOrder,
      sourceId,
      targetId,
      placement,
      (itemId) => itemId,
    );
    setDragOverShotId(targetId);
    setDragPlacement(placement);
    if (sameOrderedIds(currentOrder, nextOrder)) {
      return;
    }
    captureShotRects();
    dragOrderRef.current = nextOrder;
    setDragOrder(nextOrder);
  };

  const resetShotDrag = () => {
    const currentOrder = dragOrderRef.current;
    const savedOrder = draft.shots.map((shot) => shot.id);
    if (currentOrder.length > 0 && !sameOrderedIds(currentOrder, savedOrder)) {
      captureShotRects();
    }
    draggedShotIdRef.current = "";
    dragOrderRef.current = [];
    setDraggedShotId("");
    setDragOverShotId("");
    setDragOrder([]);
  };

  const commitShotOrder = () => {
    const order = dragOrderRef.current;
    if (order.length > 0) {
      updateDraft((current) => {
        const shots = orderItemsByIds(current.shots, order, (shot) => shot.id);
        return sameOrderedIds(
          current.shots.map((shot) => shot.id),
          shots.map((shot) => shot.id),
        )
          ? current
          : { ...current, shots };
      });
    }
    resetShotDrag();
  };

  const saveShot = (shot: StoryboardShot) => {
    updateDraft((current) => ({
      ...current,
      shots: current.shots.map((item) => (item.id === shot.id ? shot : item)),
    }));
    setEditingShotId("");
  };

  const saveMaterial = (material: StoryboardMaterial) => {
    updateDraft((current) => ({
      ...current,
      materials: current.materials.map((item) =>
        item.id === material.id ? material : item,
      ),
    }));
    setEditingMaterialId("");
  };

  const removeShot = (shotId: string) => {
    updateDraft((current) => ({
      ...current,
      shots: current.shots.filter((shot) => shot.id !== shotId),
    }));
  };

  const duplicateShot = (shot: StoryboardShot) => {
    updateDraft((current) => {
      const duplicate = duplicateStoryboardShot(current.shots, shot);
      const index = current.shots.findIndex((item) => item.id === shot.id);
      const shots = [...current.shots];
      shots.splice(index + 1, 0, duplicate);
      return { ...current, shots };
    });
  };

  const addShot = () => {
    updateDraft((current) => ({
      ...current,
      shots: [...current.shots, createUniqueShot(current.shots)],
    }));
  };

  return (
    <section
      ref={storyboardRootRef}
      className={`ws-storyboard ${canEdit ? "is-editable" : "is-readonly"}`}
      aria-label="分镜脚本"
    >
      <header className="ws-storyboard-toolbar">
        <div className="ws-storyboard-style">
          <strong>统一视觉风格</strong>
          {canEdit ? (
            <input
              className="nodrag nopan"
              value={draft.style_prompt}
              placeholder="整部作品保持一致的画面风格"
              disabled={disabled}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  style_prompt: event.target.value,
                }))
              }
            />
          ) : (
            <span title={draft.style_prompt}>
              {draft.style_prompt || "未设置统一视觉风格"}
            </span>
          )}
        </div>
        <div className="ws-storyboard-toolbar-end">
          {showMetrics || (canEdit && showSaveStatus) ? (
            <div className="ws-storyboard-toolbar-meta">
              {showMetrics ? (
                <span>
                  {draft.shots.length} 个镜头 · {storyboardTotalDuration(draft)}{" "}
                  秒 · {storyboardSpeechCount(draft)} 条语音
                </span>
              ) : null}
              {canEdit && showSaveStatus ? (
                <StoryboardSaveState
                  status={
                    controlled ? externalSaveStatus || "saved" : saveStatus
                  }
                />
              ) : null}
            </div>
          ) : null}
          {canEdit ? (
            <button
              type="button"
              className="ws-storyboard-command nodrag nopan"
              disabled={disabled}
              onClick={addShot}
            >
              <Plus size={13} />
              <span>添加镜头</span>
            </button>
          ) : null}
          {confirmed && onCreateRevision ? (
            <button
              type="button"
              className="ws-storyboard-command"
              disabled={disabled || Boolean(workflowAction)}
              onClick={() => void onCreateRevision()}
            >
              {workflowAction === "revising" ? (
                <Loader2 size={13} className="ws-spin" />
              ) : (
                <Copy size={13} />
              )}
              {workflowAction === "revising" ? "创建中" : "创建修订稿"}
            </button>
          ) : !confirmed && canEdit && onConfirm ? (
            <button
              type="button"
              className="ws-storyboard-command is-primary"
              disabled={
                disabled || Boolean(workflowAction) || !draft.shots.length
              }
              onClick={() => void onConfirm(draft)}
            >
              {workflowAction === "confirming" ? (
                <Loader2 size={13} className="ws-spin" />
              ) : (
                <Check size={13} />
              )}
              {workflowAction === "confirming" ? "确认中" : "确认脚本"}
            </button>
          ) : null}
        </div>
      </header>

      {draft.materials.length ? (
        <StoryboardMaterialSettings
          materials={draft.materials}
          editable={canEdit}
          onOpen={setEditingMaterialId}
        />
      ) : null}

      <div className="ws-storyboard-grid nowheel">
        {draft.shots.length ? (
          visibleShots.map((shot, index) => (
            <StoryboardShotCard
              key={shot.id}
              shot={shot}
              index={index}
              storyboard={draft}
              selected={editingShotId === shot.id}
              editable={canEdit}
              dragging={draggedShotId === shot.id}
              dropPlacement={
                dragOverShotId === shot.id && draggedShotId !== shot.id
                  ? dragPlacement
                  : undefined
              }
              lipSyncEnabled={lipSyncEnabled}
              onOpen={() => setEditingShotId(shot.id)}
              onDuplicate={() => duplicateShot(shot)}
              onRemove={() => removeShot(shot.id)}
              onDragStart={() => beginShotDrag(shot.id)}
              onDragOver={(event) => previewShotOrder(shot.id, event)}
              onDrop={commitShotOrder}
              onDragEnd={resetShotDrag}
            />
          ))
        ) : (
          <div className="ws-storyboard-empty">
            <BookOpenText size={26} />
            <strong>暂无镜头</strong>
            <span>添加第一个镜头后开始编排脚本</span>
          </div>
        )}
      </div>

      {editingShot ? (
        <StoryboardShotDialog
          key={editingShot.id}
          shot={editingShot}
          index={draft.shots.findIndex((shot) => shot.id === editingShot.id)}
          materials={draft.materials}
          lipSyncEnabled={lipSyncEnabled}
          readonly={!canEdit}
          referenceAdapter={referenceAdapter}
          portalContainer={
            storyboardRootRef.current?.closest(
              ".wb-detail-backdrop, .ws-page",
            ) || null
          }
          onEditMaterial={setEditingMaterialId}
          onSave={saveShot}
          onClose={() => setEditingShotId("")}
        />
      ) : null}

      {editingMaterial ? (
        <StoryboardMaterialDialog
          key={editingMaterial.id}
          material={editingMaterial}
          readonly={!canEdit}
          portalContainer={
            storyboardRootRef.current?.closest(
              ".wb-detail-backdrop, .ws-page",
            ) || null
          }
          onSave={saveMaterial}
          onClose={() => setEditingMaterialId("")}
        />
      ) : null}
    </section>
  );
}

function StoryboardMaterialSettings({
  materials,
  editable,
  onOpen,
}: {
  materials: StoryboardMaterial[];
  editable: boolean;
  onOpen: (materialId: string) => void;
}) {
  return (
    <section className="ws-storyboard-material-settings" aria-label="素材设定">
      <strong>素材设定</strong>
      <div>
        {(["character", "scene", "prop"] as const).map((type) => {
          const typedMaterials = materials.filter(
            (material) => material.type === type,
          );
          if (!typedMaterials.length) {
            return null;
          }
          return (
            <div className="ws-storyboard-material-setting-group" key={type}>
              <span>{STORYBOARD_MATERIAL_LABELS[type]}</span>
              {typedMaterials.map((material) => (
                <button
                  type="button"
                  className="nodrag nopan"
                  key={material.id}
                  title={`${editable ? "编辑" : "查看"}${STORYBOARD_MATERIAL_LABELS[type]}提示词：${material.name}`}
                  onClick={() => onOpen(material.id)}
                >
                  <span>{material.name}</span>
                  {editable ? <Pencil size={11} /> : null}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StoryboardShotDialog({
  shot,
  index,
  materials,
  lipSyncEnabled,
  readonly,
  referenceAdapter,
  portalContainer,
  onEditMaterial,
  onSave,
  onClose,
}: {
  shot: StoryboardShot;
  index: number;
  materials: StoryboardMaterial[];
  lipSyncEnabled: boolean;
  readonly: boolean;
  referenceAdapter: CanvasReferenceAdapter;
  portalContainer: Element | null;
  onEditMaterial: (materialId: string) => void;
  onSave: (shot: StoryboardShot) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(() => cloneStoryboardShot(shot));
  const characters = materials.filter(
    (material) => material.type === "character",
  );
  const speechCharacterIDs = new Set(
    draft.speech
      .filter((speech) => speech.kind === "dialogue")
      .map((speech) => speech.character_id || "")
      .filter(Boolean),
  );
  const visibleSpeakers = storyboardVisibleSpeakerIds(draft);
  const invalidStartTimes = draft.speech.some(
    (speech) => speech.start_time < 0 || speech.start_time >= draft.duration,
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
  const updateSpeech = (speechId: string, patch: Partial<StoryboardSpeech>) => {
    setDraft((current) => {
      const speech = current.speech.map((item) =>
        item.id === speechId ? normalizeSpeechPatch(item, patch) : item,
      );
      const characterIDs = speech
        .filter((item) => item.kind === "dialogue")
        .map((item) => item.character_id || "")
        .filter(Boolean);
      return {
        ...current,
        material_ids: [...new Set([...current.material_ids, ...characterIDs])],
        speech,
      };
    });
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
  const moveSpeech = (speechId: string, offset: number) => {
    setDraft((current) => {
      const index = current.speech.findIndex(
        (speech) => speech.id === speechId,
      );
      const target = index + offset;
      if (index < 0 || target < 0 || target >= current.speech.length) {
        return current;
      }
      const speech = [...current.speech];
      const [moved] = speech.splice(index, 1);
      speech.splice(target, 0, moved);
      return { ...current, speech };
    });
  };
  const dialog = (
    <div className="ws-storyboard-shot-backdrop" onMouseDown={onClose}>
      <section
        className="ws-storyboard-shot-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${readonly ? "查看" : "编辑"}镜头 ${index + 1}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <strong>
              {readonly ? "查看镜头" : "编辑镜头"}{" "}
              {String(index + 1).padStart(2, "0")}
            </strong>
            <span>
              {readonly ? "当前分镜已经确认" : "修改会保存到当前分镜草稿"}
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

        <div className="ws-storyboard-shot-form nowheel">
          <section className="ws-storyboard-shot-section">
            <div className="ws-storyboard-shot-section-head">
              <strong>镜头内容</strong>
              <div>
                <label className="ws-storyboard-continuity-input">
                  <input
                    type="checkbox"
                    checked={index > 0 && draft.continue_previous}
                    disabled={readonly || index === 0}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        continue_previous: index > 0 && event.target.checked,
                      }))
                    }
                  />
                  承接上一镜头
                </label>
                <label>
                  时长
                  <input
                    type="number"
                    min={MIN_STORYBOARD_SHOT_DURATION}
                    step={1}
                    value={draft.duration}
                    disabled={readonly}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        duration: storyboardDurationFromInput(
                          event,
                          current.duration,
                        ),
                      }))
                    }
                  />
                  秒
                </label>
              </div>
            </div>
            <div className="ws-storyboard-shot-field-row is-single">
              <StoryboardDialogField
                label="镜头描述"
                value={draft.description}
                content={draft.reference_contents?.description}
                placeholder="描述开场状态、核心内容或动作，以及结束状态"
                readonly={readonly}
                referenceAdapter={referenceAdapter}
                onChange={(value, content) =>
                  updateField("description", value, content)
                }
              />
            </div>
            <div className="ws-storyboard-shot-field-row">
              <StoryboardDialogField
                label="镜头语言"
                value={draft.camera_instruction}
                content={draft.reference_contents?.camera_instruction}
                placeholder="景别、机位和运动方式"
                readonly={readonly}
                referenceAdapter={referenceAdapter}
                onChange={(value, content) =>
                  updateField("camera_instruction", value, content)
                }
              />
              <StoryboardDialogField
                label="视频提示词"
                value={draft.video_prompt}
                content={draft.reference_contents?.video_prompt}
                placeholder="完整描述动作、运镜、光线与风格"
                readonly={readonly}
                referenceAdapter={referenceAdapter}
                onChange={(value, content) =>
                  updateField("video_prompt", value, content)
                }
              />
            </div>
          </section>

          <section className="ws-storyboard-shot-section">
            <div className="ws-storyboard-shot-section-head">
              <div>
                <strong>关联素材</strong>
                <span>{draft.material_ids.length} 个素材</span>
              </div>
            </div>
            {materials.length ? (
              <div className="ws-storyboard-material-groups">
                {(["character", "scene", "prop"] as const).map((type) => {
                  const typedMaterials = materials.filter(
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
                          const required = speechCharacterIDs.has(material.id);
                          return (
                            <div
                              className="ws-storyboard-material-option"
                              key={material.id}
                            >
                              <label
                                title={
                                  selected && required
                                    ? "该角色已用于对白，不能取消关联"
                                    : selected
                                      ? "取消关联"
                                      : "关联素材"
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  disabled={readonly || (selected && required)}
                                  onChange={() => toggleMaterial(material.id)}
                                />
                                <span className="sr-only">
                                  关联 {material.name}
                                </span>
                              </label>
                              <button
                                type="button"
                                title={`${readonly ? "查看" : "编辑"}${STORYBOARD_MATERIAL_LABELS[type]}提示词：${material.name}`}
                                onClick={() => onEditMaterial(material.id)}
                              >
                                <span>{material.name}</span>
                                {!readonly ? <Pencil size={11} /> : null}
                              </button>
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

          <section className="ws-storyboard-shot-section">
            <div className="ws-storyboard-shot-section-head">
              <div>
                <strong>角色配音与旁白</strong>
                <span>{draft.speech.length} 条语音</span>
              </div>
              {!readonly ? (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        speech: [
                          ...current.speech,
                          createStoryboardSpeech(current, "dialogue"),
                        ],
                      }))
                    }
                  >
                    <Plus size={13} />
                    添加对白
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        speech: [
                          ...current.speech,
                          createStoryboardSpeech(current, "narration"),
                        ],
                      }))
                    }
                  >
                    <Plus size={13} />
                    添加旁白
                  </button>
                </div>
              ) : null}
            </div>

            <div className="ws-storyboard-speech-list">
              {draft.speech.length ? (
                draft.speech.map((speech, speechIndex) => (
                  <div className="ws-storyboard-speech-row" key={speech.id}>
                    <div className="ws-storyboard-speech-row-head">
                      <strong>语音 {speechIndex + 1}</strong>
                      {!readonly ? (
                        <div>
                          <StoryboardIconButton
                            label="上移语音"
                            disabled={speechIndex === 0}
                            onClick={() => moveSpeech(speech.id, -1)}
                          >
                            <ArrowUp size={13} />
                          </StoryboardIconButton>
                          <StoryboardIconButton
                            label="下移语音"
                            disabled={speechIndex === draft.speech.length - 1}
                            onClick={() => moveSpeech(speech.id, 1)}
                          >
                            <ArrowDown size={13} />
                          </StoryboardIconButton>
                          <StoryboardIconButton
                            label="删除语音"
                            danger
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                speech: current.speech.filter(
                                  (item) => item.id !== speech.id,
                                ),
                              }))
                            }
                          >
                            <Trash2 size={13} />
                          </StoryboardIconButton>
                        </div>
                      ) : null}
                    </div>
                    <div className="ws-storyboard-speech-fields">
                      <label>
                        类型
                        <select
                          value={speech.kind}
                          disabled={readonly}
                          onChange={(event) =>
                            updateSpeech(speech.id, {
                              kind: event.target.value as StoryboardSpeechKind,
                            })
                          }
                        >
                          <option value="dialogue">角色对白</option>
                          <option value="narration">旁白</option>
                        </select>
                      </label>
                      {speech.kind === "dialogue" ? (
                        <>
                          <label>
                            角色
                            <select
                              value={speech.character_id || ""}
                              disabled={readonly}
                              onChange={(event) =>
                                updateSpeech(speech.id, {
                                  character_id: event.target.value,
                                })
                              }
                            >
                              <option value="">请选择角色</option>
                              {characters.map((character) => (
                                <option key={character.id} value={character.id}>
                                  {character.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            说话方式
                            <select
                              value={speech.speaker_mode || "offscreen"}
                              disabled={readonly}
                              onChange={(event) =>
                                updateSpeech(speech.id, {
                                  speaker_mode:
                                    event.target.value === "visible"
                                      ? "visible"
                                      : "offscreen",
                                })
                              }
                            >
                              <option value="visible">出镜对白</option>
                              <option value="offscreen">画外音</option>
                            </select>
                          </label>
                        </>
                      ) : null}
                      <label>
                        开始时间
                        <span className="ws-storyboard-time-input">
                          <input
                            type="number"
                            min={0}
                            max={Math.max(0, draft.duration - 0.01)}
                            step={0.1}
                            value={speech.start_time}
                            disabled={readonly}
                            onChange={(event) =>
                              updateSpeech(speech.id, {
                                start_time: nonNegativeTime(event),
                              })
                            }
                          />
                          秒
                        </span>
                      </label>
                    </div>
                    <label className="ws-storyboard-speech-text">
                      文本
                      <textarea
                        value={speech.text}
                        readOnly={readonly}
                        placeholder={
                          speech.kind === "narration" ? "输入旁白" : "输入对白"
                        }
                        onChange={(event) =>
                          updateSpeech(speech.id, { text: event.target.value })
                        }
                      />
                    </label>
                  </div>
                ))
              ) : (
                <div className="ws-storyboard-speech-empty">
                  <MessageSquareText size={24} />
                  <span>当前镜头没有对白或旁白</span>
                </div>
              )}
            </div>
            {visibleSpeakers.size > 1 ? (
              <p className="ws-storyboard-form-error">
                一个镜头最多只能有一个出镜说话角色，请拆分镜头或改为画外音
                {lipSyncEnabled ? "，否则无法确定对口型角色" : ""}。
              </p>
            ) : null}
            {invalidStartTimes ? (
              <p className="ws-storyboard-form-error">
                语音开始时间必须小于当前镜头时长。
              </p>
            ) : null}
          </section>
        </div>

        <footer>
          <button type="button" onClick={onClose}>
            {readonly ? "关闭" : "取消"}
          </button>
          {!readonly ? (
            <button
              type="button"
              className="is-primary"
              disabled={visibleSpeakers.size > 1 || invalidStartTimes}
              onClick={() => onSave(draft)}
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
        layerZIndex={2700}
        onChange={onChange}
      />
    </label>
  );
}

function withStoryboardReferenceContents(
  storyboard: StoryboardDocument,
  targets: CanvasReferenceTarget[],
): StoryboardDocument {
  return {
    ...storyboard,
    shots: storyboard.shots.map((shot) => {
      const referenceContents = { ...(shot.reference_contents || {}) };
      for (const field of STORYBOARD_REFERENCE_FIELDS) {
        const content = reconcileCanvasReferenceContent(
          shot[field],
          referenceContents[field],
          targets,
        );
        if (content) {
          referenceContents[field] = content;
        } else {
          delete referenceContents[field];
        }
      }
      return { ...shot, reference_contents: referenceContents };
    }),
  };
}

const STORYBOARD_REFERENCE_FIELDS: StoryboardReferenceField[] = [
  "description",
  "camera_instruction",
  "video_prompt",
];

function storyboardReferenceFieldPatch(
  shot: StoryboardShot,
  field: StoryboardReferenceField,
  value: string,
  content?: CanvasReferenceContent,
): Partial<StoryboardShot> {
  const referenceContents = { ...(shot.reference_contents || {}) };
  if (content) {
    referenceContents[field] = content;
  } else {
    delete referenceContents[field];
  }
  return {
    [field]: value,
    reference_contents: referenceContents,
  };
}

function StoryboardIconButton({
  label,
  disabled,
  danger = false,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`ws-storyboard-icon-button nodrag nopan ${danger ? "is-danger" : ""}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StoryboardSaveState({ status }: { status: StoryboardSaveStatus }) {
  return (
    <span className={`ws-storyboard-save-state is-${status}`}>
      {status === "saving" ? (
        <Loader2 size={12} className="ws-spin" />
      ) : status === "saved" ? (
        <Check size={12} />
      ) : null}
      {status === "typing"
        ? "编辑中"
        : status === "saving"
          ? "保存中"
          : status === "error"
            ? "保存失败"
            : "已保存"}
    </span>
  );
}

function normalizeSpeechPatch(
  speech: StoryboardSpeech,
  patch: Partial<StoryboardSpeech>,
) {
  const next = { ...speech, ...patch };
  if (next.kind === "dialogue") {
    next.character_id ||= "";
    next.speaker_mode ||= "offscreen";
  } else {
    delete next.character_id;
    delete next.speaker_mode;
  }
  return next;
}

function storyboardDurationFromInput(
  event: ChangeEvent<HTMLInputElement>,
  fallback: number,
) {
  const value = Number(event.target.value);
  return isStoryboardShotDurationValid(value) ? value : fallback;
}

function nonNegativeTime(event: ChangeEvent<HTMLInputElement>) {
  const value = Number.parseFloat(event.target.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function createUniqueShot(shots: StoryboardShot[]) {
  const usedIds = new Set(shots.map((shot) => shot.id));
  let index = shots.length;
  let shot = createStoryboardShot(index);
  while (usedIds.has(shot.id)) {
    index += 1;
    shot = createStoryboardShot(index);
  }
  return shot;
}

function duplicateStoryboardShot(
  shots: StoryboardShot[],
  shot: StoryboardShot,
) {
  const duplicate = createUniqueShot(shots);
  return {
    ...cloneStoryboardShot(shot),
    id: duplicate.id,
    order: duplicate.order,
    speech: shot.speech.map((speech, index) => ({
      ...speech,
      id: `${duplicate.id}-speech-${index + 1}`,
    })),
  };
}

function cloneStoryboardShot(shot: StoryboardShot): StoryboardShot {
  return {
    ...shot,
    material_ids: [...shot.material_ids],
    speech: shot.speech.map((speech) => ({ ...speech })),
    reference_contents: { ...(shot.reference_contents || {}) },
  };
}
