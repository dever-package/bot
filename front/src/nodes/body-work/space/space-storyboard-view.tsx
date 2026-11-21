import { ScreenplayScenes } from "./space-screenplay";
import { storyboardSettingSource } from "./space-story-setting-reference";
import type { SpaceCanvasEdge } from "./types";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import { BookOpenText, Check, Copy, Loader2 } from "lucide-react";
import {
  MAX_STORYBOARD_SHOTS,
  STORYBOARD_ASPECT_RATIOS,
  STORYBOARD_VISUAL_MODES,
  STORYBOARD_VISUAL_MODE_LABELS,
  createStoryboardMaterial,
  createStoryboardShot,
  isStoryboardConfirmed,
  normalizeStoryboardOrder,
  reconcileStoryboardContinuity,
  storyboardContentSummary,
  storyboardMaterialUsage,
  storyboardTotalDuration,
  withStoryboardStylePrompt,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardMaterialType,
  type StoryboardEditorFocus,
  type StoryboardShot,
} from "./space-storyboard";
import {
  moveOrderedItemById,
  orderItemsByIds,
  sameOrderedIds,
} from "./space-ordered-list";
import {
  reconcileCanvasReferenceContent,
  type CanvasReferenceTarget,
} from "./space-reference-content";
import type {
  ComposerAssetItem,
  SpaceCanvasNode,
  StoryboardReferencePurposeSpec,
  StoryboardWorkTypeSpec,
} from "./types";
import { useCanvasReferenceAdapter } from "./space-reference-editor";
import { StoryboardShotList } from "./space-storyboard-shot-card";
import type { StoryboardPromptVersion } from "./space-storyboard-shot-request";
import type { StoryboardWorkspaceGroupData } from "./space-node-runtime";
import { StoryboardMaterialDialog } from "./space-storyboard-material-dialog";
import { StoryboardReferencePanel } from "./space-storyboard-reference-panel";
import { SpaceTooltip } from "./space-tooltip";
import {
  cloneStoryboardShot,
  STORYBOARD_REFERENCE_FIELDS,
} from "./space-storyboard-shot-edit";
import "./space-storyboard-view.css";
import type { StoryboardWorkspaceSettings } from "./space-storyboard-workspace";

export type StoryboardSaveStatus = "saved" | "typing" | "saving" | "error";
export type StoryboardWorkflowAction = "" | "confirming" | "revising" | "generating_shot";

const EMPTY_REFERENCE_ITEMS: ComposerAssetItem[] = [];
const EMPTY_CANVAS_NODES: SpaceCanvasNode[] = [];
const EMPTY_WORK_TYPE_SPECS: StoryboardWorkTypeSpec[] = [];
const EMPTY_PURPOSE_SPECS: StoryboardReferencePurposeSpec[] = [];

export function StoryboardView({
  storyboard,
  editable = false,
  disabled = false,
  onSave,
  onChange,
  onConfirm,
  onCreateRevision,
  onGenerateShot,
  onSaveShotEdit,
  promptVersion,
  productionGroups,
  workflowAction = "",
  saveStatus: externalSaveStatus,
  showSaveStatus = true,
  showMetrics = true,
  referenceItems = EMPTY_REFERENCE_ITEMS,
  storyboardSourceNodeId = "",
  canvasNodes = EMPTY_CANVAS_NODES,
  canvasEdges = [],
  workTypeSpecs = EMPTY_WORK_TYPE_SPECS,
  purposeSpecs = EMPTY_PURPOSE_SPECS,
  focus,
  renderWorkspace,
}: {
  storyboard: StoryboardDocument;
  editable?: boolean;
  disabled?: boolean;
  onSave?: (storyboard: StoryboardDocument) => Promise<void>;
  onChange?: (storyboard: StoryboardDocument) => void;
  onConfirm?: () => void | Promise<void>;
  onCreateRevision?: () => void | Promise<void>;
  onGenerateShot?: (
    storyboard: StoryboardDocument,
    shotId: string,
    instruction: string,
  ) => Promise<void>;
  onSaveShotEdit?: (storyboard: StoryboardDocument) => Promise<void>;
  promptVersion?: StoryboardPromptVersion;
  productionGroups?: StoryboardWorkspaceGroupData[];
  workflowAction?: StoryboardWorkflowAction;
  saveStatus?: StoryboardSaveStatus;
  showSaveStatus?: boolean;
  showMetrics?: boolean;
  referenceItems?: ComposerAssetItem[];
  storyboardSourceNodeId?: string;
  canvasNodes?: SpaceCanvasNode[];
  canvasEdges?: SpaceCanvasEdge[];
  workTypeSpecs?: StoryboardWorkTypeSpec[];
  purposeSpecs?: StoryboardReferencePurposeSpec[];
  focus?: StoryboardEditorFocus;
  renderWorkspace?: (script: ReactNode, settings: StoryboardWorkspaceSettings, overview: ReactNode) => ReactNode;
}) {
  const externalSignature = useMemo(
    () => JSON.stringify(storyboard),
    [storyboard],
  );
  const [internalDraft, setInternalDraft] = useState(storyboard);
  const [saveStatus, setSaveStatus] = useState<StoryboardSaveStatus>("saved");
  const [editingMaterialId, setEditingMaterialId] = useState("");
  const [creatingMaterial, setCreatingMaterial] =
    useState<StoryboardMaterial | null>(null);
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
  const workTypeName = workTypeSpecs.find(
    (spec) => spec.key === draft.work_type,
  )?.name;
  const confirmed = isStoryboardConfirmed(draft);
  const sharedSetting = storyboardSettingSource(canvasNodes, canvasEdges, storyboardSourceNodeId);
  const canEditScript =
    editable &&
    !disabled &&
    !confirmed &&
    Boolean(onChange || onSave);
  const canEdit = canEditScript && !workflowAction;
  const canAutoSave = canEdit && !controlled && Boolean(onSave);
  const referenceAdapter = useCanvasReferenceAdapter(referenceItems);
  const editingMaterial = draft.materials.find(
    (material) => material.id === editingMaterialId,
  );
  const activeMaterial = editingMaterial || creatingMaterial;
  const activeMaterialUsage = activeMaterial
    ? storyboardMaterialUsage(draft, activeMaterial.id)
    : undefined;
  const visibleShots = useMemo(
    () => orderItemsByIds(draft.shots, dragOrder, (shot) => shot.id),
    [draft.shots, dragOrder],
  );
  const hasNarration = useMemo(
    () =>
      draft.shots.some((shot) =>
        shot.speech.some(
          (speech) =>
            speech.kind === "narration" && Boolean(speech.text.trim()),
        ),
      ),
    [draft.shots],
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
        ".ws-storyboard-shot-row[data-sequence-item-id]",
      )
      .forEach((element) => {
        if (element.dataset.dragging === "true") {
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
    if (editingMaterialId && !editingMaterial) {
      setEditingMaterialId("");
    }
  }, [editingMaterial, editingMaterialId]);

  useEffect(() => {
    if (!focus) {
      return;
    }
    if (
      focus.materialId &&
      draft.materials.some((material) => material.id === focus.materialId)
    ) {
      setCreatingMaterial(null);
      setEditingMaterialId(focus.materialId);
      return;
    }
    if (focus.addMaterial && focus.materialType && canEdit && !sharedSetting) {
      setEditingMaterialId("");
      setCreatingMaterial(createStoryboardMaterial(draft.materials, focus.materialType));
      return;
    }
    if (focus.section === "materials") return;
    const frame = window.requestAnimationFrame(() => {
      const selector = focus.shotId
        ? '[data-sequence-item-id="' + CSS.escape(focus.shotId) + '"]'
        : ".ws-storyboard-shot-list";
      storyboardRootRef.current
        ?.querySelector<HTMLElement>(selector)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focus?.addMaterial, focus?.materialId, focus?.materialType, focus?.section, focus?.shotId]);

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

  const prepareDraft = (current: StoryboardDocument, updated: StoryboardDocument) =>
    withStoryboardReferenceContents(
      normalizeStoryboardOrder(reconcileStoryboardContinuity(current, updated)),
      referenceAdapter.options,
    );

  const updateDraft = (
    updater: (current: StoryboardDocument) => StoryboardDocument,
  ) => {
    if (!canEdit) {
      return;
    }
    const current = controlled ? storyboard : draftRef.current;
    const next = prepareDraft(current, updater(current));
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
        ".ws-storyboard-shot-row[data-sequence-item-id]",
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
    const fitsMultipleCards = (event.currentTarget.parentElement?.clientWidth || 0) > targetRect.width * 2;
    const before = fitsMultipleCards
      ? event.clientX < targetRect.left + targetRect.width / 2
      : event.clientY < targetRect.top + targetRect.height / 2;
    const placement = before ? "before" : "after";
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

  const saveMaterial = (material: StoryboardMaterial) => {
    updateDraft((current) => {
      const exists = current.materials.some((item) => item.id === material.id);
      return {
        ...current,
        materials: exists
          ? current.materials.map((item) =>
              item.id === material.id ? material : item,
            )
          : [...current.materials, material],
      };
    });
    setEditingMaterialId("");
    setCreatingMaterial(null);
  };

  const addMaterial = (type: StoryboardMaterialType) => {
    setEditingMaterialId("");
    setCreatingMaterial(createStoryboardMaterial(draft.materials, type));
  };

  const removeMaterial = (materialId: string) => {
    const usage = storyboardMaterialUsage(draft, materialId);
    if (usage.shotIds.length || usage.speechIds.length) {
      return;
    }
    updateDraft((current) => ({
      ...current,
      materials: current.materials.filter((item) => item.id !== materialId),
    }));
    setEditingMaterialId("");
    setCreatingMaterial(null);
  };

  const removeShot = (shotId: string) => {
    updateDraft((current) => {
      if (current.shots.length <= 1) {
        return current;
      }
      return {
        ...current,
        shots: current.shots.filter((shot) => shot.id !== shotId),
      };
    });
  };

  const duplicateShot = (shot: StoryboardShot) => {
    updateDraft((current) => {
      if (current.shots.length >= MAX_STORYBOARD_SHOTS) {
        return current;
      }
      const duplicate = duplicateStoryboardShot(current.shots, shot);
      const index = current.shots.findIndex((item) => item.id === shot.id);
      const shots = [...current.shots];
      shots.splice(index + 1, 0, duplicate);
      return { ...current, shots };
    });
  };

  if (draft.screenplay && !draft.shots.length) {
    return (
      <section className="ws-storyboard is-editable" aria-label="章节剧本">
        <header className="ws-storyboard-toolbar">
          <strong>{draft.title} · 剧本</strong>
          <StoryboardSaveState
            status={controlled ? externalSaveStatus || "saved" : saveStatus}
          />
          {canEdit && onConfirm && (
            <button
              type="button"
              className="ws-storyboard-command is-primary"
              disabled={
                disabled || Boolean(workflowAction)
              }
              onClick={() => void onConfirm()}
            >
              继续生成分镜
            </button>
          )}
        </header>
        <ScreenplayScenes
          storyboard={draft}
          editable={canEdit && !disabled}
          onChange={(next) => updateDraft(() => next)}
        />
      </section>
    );
  }

  const chapter = draft.screenplay ? (
    <details className="ws-storyboard-chapter">
      <summary>本章剧本</summary>
      <ScreenplayScenes storyboard={draft} editable={false} />
    </details>
  ) : null;
  const summary = (
    <div className="ws-storyboard-summary" aria-label="脚本基本信息">
      <section className="ws-storyboard-overview">
        <header>
          <BookOpenText size={14} />
          <strong>内容简介</strong>
          {workTypeName ? (
            <span className="ws-storyboard-work-type">{workTypeName}</span>
          ) : null}
        </header>
        <p>{storyboardContentSummary(draft)}</p>
      </section>

      <div className="ws-storyboard-creative-settings">
        <StoryboardReferencePanel
          storyboard={draft}
          referenceItems={referenceItems}
          editable={canEdit}
          disabled={disabled}
          workType={draft.work_type}
          purposeSpecs={purposeSpecs}
          onChange={(next) => updateDraft(() => next)}
        />

        <section className="ws-storyboard-basic-settings">
          {renderWorkspace && <h3 className="ws-storyboard-visual-settings-title">画面设置</h3>}
          {sharedSetting && <p>画风、画幅及人物形象由画布上的“设定”统一管理，各章共用。</p>}
          <div className="ws-storyboard-global-settings">
            <label>
              <strong>
                <SpaceTooltip label="写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等">
                  <span>画面类型</span>
                </SpaceTooltip>
              </strong>
              {canEdit && !sharedSetting ? (
                <select
                  className="nodrag nopan"
                  value={draft.visual_mode}
                  disabled={disabled}
                  onChange={(event) =>
                    updateDraft((current) => ({
                      ...current,
                      visual_mode: event.target
                        .value as StoryboardDocument["visual_mode"],
                    }))
                  }
                >
                  {STORYBOARD_VISUAL_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {STORYBOARD_VISUAL_MODE_LABELS[mode]}
                    </option>
                  ))}
                </select>
              ) : (
                <span>
                  {STORYBOARD_VISUAL_MODE_LABELS[draft.visual_mode]}
                </span>
              )}
            </label>
            <label>
              <strong>画幅</strong>
              {canEdit && !sharedSetting ? (
                <select
                  className="nodrag nopan"
                  value={draft.aspect_ratio}
                  disabled={disabled}
                  onChange={(event) =>
                    updateDraft((current) => ({
                      ...current,
                      aspect_ratio: event.target
                        .value as StoryboardDocument["aspect_ratio"],
                    }))
                  }
                >
                  {STORYBOARD_ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio} value={ratio}>
                      {ratio}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{draft.aspect_ratio}</span>
              )}
            </label>
            {hasNarration || Boolean(draft.narrator_voice) ? (
              <label className="ws-storyboard-setting-wide">
                <strong>旁白音色</strong>
                {canEdit ? (
                  <input
                    className="nodrag nopan"
                    value={draft.narrator_voice}
                    placeholder="自动配音时必填"
                    disabled={disabled}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        narrator_voice: event.target.value,
                      }))
                    }
                  />
                ) : (
                  <span>{draft.narrator_voice || "未配置"}</span>
                )}
              </label>
            ) : null}
            <div className="ws-storyboard-style">
              <strong>统一视觉风格</strong>
              {canEdit && !sharedSetting ? (
                <textarea
                  className="nodrag nopan nowheel"
                  aria-label="统一视觉风格"
                  rows={3}
                  value={draft.style_prompt}
                  placeholder="可选，整部作品保持一致的画面风格"
                  disabled={disabled}
                  onChange={(event) =>
                    updateDraft((current) =>
                      withStoryboardStylePrompt(
                        current,
                        event.target.value,
                      ),
                    )
                  }
                />
              ) : (
                <SpaceTooltip label={draft.style_prompt}>
                  <span>{draft.style_prompt || "未设置统一视觉风格"}</span>
                </SpaceTooltip>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const script = (
    <section
      ref={storyboardRootRef}
      className={`ws-storyboard ${canEdit ? "is-editable" : "is-readonly"}`}
      aria-label="分镜脚本"
    >
      <div className="ws-storyboard-layout">
        {!renderWorkspace && summary}

        <div className="ws-storyboard-main">
          <header className="ws-storyboard-toolbar">
            <div className="ws-storyboard-toolbar-end">
              {renderWorkspace && <h2 className="ws-storyboard-list-title">镜头列表</h2>}
              {showMetrics || (canEdit && showSaveStatus) ? (
                <div className="ws-storyboard-toolbar-meta">
                  {showMetrics ? (
                    <span>
                      {draft.shots.length} 个镜头 ·{" "}
                      {storyboardTotalDuration(draft)} 秒 · {draft.aspect_ratio}
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
                  onClick={() => void onConfirm()}
                >
                  <Check size={13} />
                  确认脚本
                </button>
              ) : null}
            </div>
          </header>

          {!renderWorkspace && chapter}
          <StoryboardShotList
            shots={visibleShots}
            storyboard={draft}
            groups={productionGroups}
            promptVersion={promptVersion}
            onSave={canEdit ? async (edited, baseline) => {
              if (JSON.stringify(draft) !== JSON.stringify(baseline)) {
                throw new Error("分镜已有新改动，请重新打开此镜");
              }
              if (onSaveShotEdit) await onSaveShotEdit(prepareDraft(draft, edited));
              else updateDraft(() => edited);
            } : undefined}
            onCreateRevision={confirmed ? onCreateRevision : undefined}
            onGenerate={canEditScript && onGenerateShot && (!workflowAction || workflowAction === "generating_shot")
              ? (shotId, instruction) => onGenerateShot(draft, shotId, instruction)
              : undefined}
            rowActions={canEdit ? (shot) => ({
              dragging: draggedShotId === shot.id,
              dropPlacement: dragOverShotId === shot.id && draggedShotId !== shot.id ? dragPlacement : undefined,
              onDuplicate: draft.shots.length < MAX_STORYBOARD_SHOTS
                ? () => duplicateShot(shot)
                : undefined,
              onRemove: draft.shots.length > 1 ? () => removeShot(shot.id) : undefined,
              onDragStart: () => beginShotDrag(shot.id),
              onDragOver: (event) => previewShotOrder(shot.id, event),
              onDrop: commitShotOrder,
              onDragEnd: resetShotDrag,
            }) : undefined}
          />
        </div>
      </div>

    </section>
  );

  const settings: StoryboardWorkspaceSettings = {
    defaultType: focus?.materialType,
    materials: sharedSetting ? undefined : draft.materials,
    materialActions: canEdit && !sharedSetting ? {
      disabled,
      onEdit: (material) => setEditingMaterialId(material.id),
      onAdd: addMaterial,
    } : undefined,
  };
  const overview = (
    <div className="ws-storyboard ws-storyboard-layout">
      {summary}
      {chapter}
    </div>
  );
  return (
    <>
      {renderWorkspace ? renderWorkspace(script, settings, overview) : script}
      {activeMaterial ? (
        <StoryboardMaterialDialog
          key={`${creatingMaterial ? "create" : "edit"}:${activeMaterial.id}`}
          material={activeMaterial}
          creating={Boolean(creatingMaterial)}
          readonly={!canEdit || Boolean(sharedSetting)}
          usage={activeMaterialUsage}
          existingNames={draft.materials
            .filter((material) => material.id !== activeMaterial.id)
            .map((material) => material.name)}
          onSave={saveMaterial}
          onRemove={removeMaterial}
          onClose={() => {
            setEditingMaterialId("");
            setCreatingMaterial(null);
          }}
        />
      ) : null}
    </>
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
          shot[field] || "",
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
    captions: shot.captions.map((caption, index) => ({
      ...caption,
      id: `${duplicate.id}-caption-${index + 1}`,
    })),
  };
}
