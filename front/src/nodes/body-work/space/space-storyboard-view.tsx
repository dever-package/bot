import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  Check,
  GripVertical,
  Loader2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import {
  createStoryboardShot,
  normalizeStoryboardOrder,
  storyboardTotalDuration,
  type StoryboardDocument,
  type StoryboardReferenceField,
  type StoryboardShot,
} from "./space-storyboard";
import type { ComposerAssetItem } from "./space-prompt-composer";
import {
  reconcileCanvasReferenceContent,
  type CanvasReferenceTarget,
} from "./space-reference-content";
import type { CanvasReferenceContent } from "./types";
import {
  CanvasReferenceEditorWithAdapter,
  CanvasReferenceTextWithAdapter,
  useCanvasReferenceAdapter,
  type CanvasReferenceAdapter,
} from "./space-reference-editor";

export type StoryboardSaveStatus = "saved" | "typing" | "saving" | "error";

const EMPTY_REFERENCE_ITEMS: ComposerAssetItem[] = [];

export function StoryboardView({
  storyboard,
  editable = false,
  disabled = false,
  onSave,
  onChange,
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
  const [activeFieldId, setActiveFieldId] = useState("");
  const [draggedShotId, setDraggedShotId] = useState("");
  const [dragOverShotId, setDragOverShotId] = useState("");
  const [dragPlacement, setDragPlacement] = useState<"before" | "after">(
    "before",
  );
  const draftRef = useRef(storyboard);
  const dirtyRef = useRef(false);
  const revisionRef = useRef(0);
  const externalSignatureRef = useRef(externalSignature);
  const saveTimerRef = useRef<number | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const mountedRef = useRef(true);
  const controlled = Boolean(onChange);
  const draft = controlled ? storyboard : internalDraft;
  const canAutoSave = editable && !disabled && !controlled && Boolean(onSave);
  const canEdit = editable && !disabled && Boolean(onChange || onSave);
  const referenceAdapter = useCanvasReferenceAdapter(referenceItems);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

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

  const updateShot = (index: number, patch: Partial<StoryboardShot>) => {
    updateDraft((current) => ({
      ...current,
      shots: current.shots.map((shot, shotIndex) =>
        shotIndex === index ? { ...shot, ...patch } : shot,
      ),
    }));
  };

  const reorderShot = (
    sourceId: string,
    targetId: string,
    placement: "before" | "after",
  ) => {
    if (!sourceId || !targetId || sourceId === targetId) {
      return;
    }
    updateDraft((current) => {
      const sourceIndex = current.shots.findIndex(
        (shot) => shot.id === sourceId,
      );
      if (sourceIndex < 0) {
        return current;
      }
      const shots = [...current.shots];
      const [source] = shots.splice(sourceIndex, 1);
      const targetIndex = shots.findIndex((shot) => shot.id === targetId);
      if (targetIndex < 0) {
        return current;
      }
      shots.splice(targetIndex + (placement === "after" ? 1 : 0), 0, source);
      return { ...current, shots };
    });
  };

  const removeShot = (index: number) => {
    updateDraft((current) => ({
      ...current,
      shots: current.shots.filter((_, shotIndex) => shotIndex !== index),
    }));
  };

  const addShot = () => {
    updateDraft((current) => ({
      ...current,
      shots: [...current.shots, createUniqueShot(current.shots)],
    }));
  };

  return (
    <section
      className={`ws-storyboard ${canEdit ? "is-editable" : "is-readonly"}`}
      aria-label="分镜脚本"
    >
      <header className="ws-storyboard-head">
        {canEdit ? (
          <input
            className="ws-storyboard-title nodrag nopan"
            value={draft.title}
            placeholder="分镜脚本标题"
            disabled={disabled}
            onChange={(event) =>
              updateDraft((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        ) : (
          <strong>{draft.title || "分镜脚本"}</strong>
        )}
        {showMetrics || (canEdit && showSaveStatus) ? (
          <div className="ws-storyboard-head-meta">
            {showMetrics ? (
              <span>
                {draft.shots.length} 个镜头 · {storyboardTotalDuration(draft)}{" "}
                秒
              </span>
            ) : null}
            {canEdit && showSaveStatus ? (
              <StoryboardSaveState
                status={controlled ? externalSaveStatus || "saved" : saveStatus}
              />
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="ws-storyboard-table-wrap nowheel">
        <table className="ws-storyboard-table">
          <thead>
            <tr>
              <th className="is-order">序号</th>
              <th className="is-duration">时长</th>
              <th className="is-visual">画面描述</th>
              <th className="is-camera">运镜</th>
              <th className="is-speech">台词 / 旁白</th>
              <th className="is-sound">音效 / 配乐</th>
              {canEdit ? <th className="is-prompt">视频提示词</th> : null}
              {canEdit ? <th className="is-actions" aria-label="操作" /> : null}
            </tr>
          </thead>
          <tbody>
            {draft.shots.map((shot, index) => (
              <tr
                key={shot.id || `shot-${index + 1}`}
                className={`${draggedShotId === shot.id ? "is-dragging" : ""} ${dragOverShotId === shot.id ? `is-drag-over-${dragPlacement}` : ""}`.trim()}
                onDragOver={
                  canEdit && !disabled
                    ? (event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        setDragOverShotId(shot.id);
                        const bounds =
                          event.currentTarget.getBoundingClientRect();
                        setDragPlacement(
                          event.clientY < bounds.top + bounds.height / 2
                            ? "before"
                            : "after",
                        );
                      }
                    : undefined
                }
                onDrop={
                  canEdit && !disabled
                    ? (event) => {
                        event.preventDefault();
                        reorderShot(draggedShotId, shot.id, dragPlacement);
                        setDraggedShotId("");
                        setDragOverShotId("");
                        setDragPlacement("before");
                      }
                    : undefined
                }
              >
                <td className="is-order">
                  <span>{index + 1}</span>
                  {canEdit ? (
                    <button
                      type="button"
                      className="ws-storyboard-drag-handle nodrag nopan"
                      draggable={!disabled}
                      disabled={disabled}
                      aria-label={`拖动镜头 ${index + 1} 排序`}
                      title="拖动排序"
                      onDragStart={(event) => {
                        setDraggedShotId(shot.id);
                        setDragOverShotId(shot.id);
                        setDragPlacement("before");
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", shot.id);
                      }}
                      onDragEnd={() => {
                        setDraggedShotId("");
                        setDragOverShotId("");
                        setDragPlacement("before");
                      }}
                    >
                      <GripVertical size={14} />
                    </button>
                  ) : null}
                </td>
                <td className="is-duration">
                  {canEdit ? (
                    <div className="ws-storyboard-duration">
                      <StoryboardIconButton
                        label="减少时长"
                        disabled={disabled || shot.duration <= 1}
                        onClick={() =>
                          updateShot(index, {
                            duration: Math.max(1, shot.duration - 1),
                          })
                        }
                      >
                        <Minus size={12} />
                      </StoryboardIconButton>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={shot.duration}
                        disabled={disabled}
                        aria-label={`镜头 ${index + 1} 时长`}
                        onChange={(event) =>
                          updateShot(index, {
                            duration: positiveDuration(event, shot.duration),
                          })
                        }
                      />
                      <span>秒</span>
                      <StoryboardIconButton
                        label="增加时长"
                        disabled={disabled}
                        onClick={() =>
                          updateShot(index, { duration: shot.duration + 1 })
                        }
                      >
                        <Plus size={12} />
                      </StoryboardIconButton>
                    </div>
                  ) : (
                    <span>{shot.duration} 秒</span>
                  )}
                </td>
                <td className="is-visual">
                  <StoryboardTextField
                    label={`镜头 ${index + 1} 画面描述`}
                    value={shot.visual}
                    content={shot.reference_contents?.visual}
                    readOnly={!canEdit}
                    disabled={disabled}
                    placeholder="描述场景、人物、动作和镜头"
                    fieldId={`${shot.id}:visual`}
                    activeFieldId={activeFieldId}
                    referenceAdapter={referenceAdapter}
                    onActivate={setActiveFieldId}
                    onChange={(visual, content) =>
                      updateShot(
                        index,
                        storyboardReferenceFieldPatch(
                          shot,
                          "visual",
                          visual,
                          content,
                        ),
                      )
                    }
                  />
                </td>
                <td className="is-camera">
                  <StoryboardTextField
                    label={`镜头 ${index + 1} 运镜`}
                    value={shot.camera_movement}
                    content={shot.reference_contents?.camera_movement}
                    readOnly={!canEdit}
                    disabled={disabled}
                    placeholder="景别、机位和运动方式"
                    fieldId={`${shot.id}:camera`}
                    activeFieldId={activeFieldId}
                    referenceAdapter={referenceAdapter}
                    onActivate={setActiveFieldId}
                    onChange={(camera_movement, content) =>
                      updateShot(
                        index,
                        storyboardReferenceFieldPatch(
                          shot,
                          "camera_movement",
                          camera_movement,
                          content,
                        ),
                      )
                    }
                  />
                </td>
                <td className="is-speech">
                  <div className="ws-storyboard-speech-fields">
                    <StoryboardTextField
                      label={`镜头 ${index + 1} 台词`}
                      value={shot.dialogue}
                      content={shot.reference_contents?.dialogue}
                      readOnly={!canEdit}
                      disabled={disabled}
                      placeholder="台词"
                      fieldId={`${shot.id}:dialogue`}
                      activeFieldId={activeFieldId}
                      referenceAdapter={referenceAdapter}
                      onActivate={setActiveFieldId}
                      onChange={(dialogue, content) =>
                        updateShot(
                          index,
                          storyboardReferenceFieldPatch(
                            shot,
                            "dialogue",
                            dialogue,
                            content,
                          ),
                        )
                      }
                    />
                    <StoryboardTextField
                      label={`镜头 ${index + 1} 旁白`}
                      value={shot.narration}
                      content={shot.reference_contents?.narration}
                      readOnly={!canEdit}
                      disabled={disabled}
                      placeholder="旁白"
                      fieldId={`${shot.id}:narration`}
                      activeFieldId={activeFieldId}
                      referenceAdapter={referenceAdapter}
                      onActivate={setActiveFieldId}
                      onChange={(narration, content) =>
                        updateShot(
                          index,
                          storyboardReferenceFieldPatch(
                            shot,
                            "narration",
                            narration,
                            content,
                          ),
                        )
                      }
                    />
                  </div>
                </td>
                <td className="is-sound">
                  <StoryboardTextField
                    label={`镜头 ${index + 1} 音效或配乐`}
                    value={shot.sound_music}
                    content={shot.reference_contents?.sound_music}
                    readOnly={!canEdit}
                    disabled={disabled}
                    placeholder="环境音、音效或配乐"
                    fieldId={`${shot.id}:sound`}
                    activeFieldId={activeFieldId}
                    referenceAdapter={referenceAdapter}
                    onActivate={setActiveFieldId}
                    onChange={(sound_music, content) =>
                      updateShot(
                        index,
                        storyboardReferenceFieldPatch(
                          shot,
                          "sound_music",
                          sound_music,
                          content,
                        ),
                      )
                    }
                  />
                </td>
                {canEdit ? (
                  <td className="is-prompt">
                    <StoryboardTextField
                      label={`镜头 ${index + 1} 视频提示词`}
                      value={shot.prompt}
                      content={shot.reference_contents?.prompt}
                      readOnly={false}
                      disabled={disabled}
                      placeholder="完整描述画面、动作、运镜、光线与风格"
                      fieldId={`${shot.id}:prompt`}
                      activeFieldId={activeFieldId}
                      referenceAdapter={referenceAdapter}
                      onActivate={setActiveFieldId}
                      onChange={(prompt, content) =>
                        updateShot(
                          index,
                          storyboardReferenceFieldPatch(
                            shot,
                            "prompt",
                            prompt,
                            content,
                          ),
                        )
                      }
                    />
                  </td>
                ) : null}
                {canEdit ? (
                  <td className="is-actions">
                    <StoryboardIconButton
                      label="删除镜头"
                      disabled={disabled}
                      danger
                      onClick={() => removeShot(index)}
                    >
                      <Trash2 size={13} />
                    </StoryboardIconButton>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        {draft.shots.length === 0 ? (
          <div className="ws-storyboard-empty">暂无镜头</div>
        ) : null}
      </div>

      {canEdit ? (
        <footer className="ws-storyboard-footer">
          <button
            type="button"
            className="nodrag nopan"
            disabled={disabled}
            onClick={addShot}
          >
            <Plus size={14} />
            <span>添加镜头</span>
          </button>
        </footer>
      ) : null}
    </section>
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
  "visual",
  "camera_movement",
  "dialogue",
  "narration",
  "sound_music",
  "prompt",
];

function StoryboardTextField({
  label,
  value,
  content,
  placeholder,
  readOnly,
  disabled,
  fieldId,
  activeFieldId,
  referenceAdapter,
  onActivate,
  onChange,
}: {
  label: string;
  value: string;
  content?: CanvasReferenceContent;
  placeholder: string;
  readOnly: boolean;
  disabled: boolean;
  fieldId: string;
  activeFieldId: string;
  referenceAdapter: CanvasReferenceAdapter;
  onActivate: (fieldId: string) => void;
  onChange: (value: string, content?: CanvasReferenceContent) => void;
}) {
  if (readOnly) {
    return (
      <div className="ws-storyboard-readonly-field">
        <CanvasReferenceTextWithAdapter
          value={value}
          content={content}
          placeholder={placeholder}
          adapter={referenceAdapter}
        />
      </div>
    );
  }
  if (activeFieldId !== fieldId) {
    return (
      <div
        className="ws-storyboard-edit-field nodrag nopan"
        role="textbox"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-readonly="false"
        onClick={(event) => {
          if (
            disabled ||
            (event.target as HTMLElement).closest("[data-reference-tag]")
          ) {
            return;
          }
          onActivate(fieldId);
        }}
        onKeyDown={(event) => {
          if (
            !disabled &&
            !(event.target as HTMLElement).closest("[data-reference-tag]") &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            onActivate(fieldId);
          }
        }}
      >
        <CanvasReferenceTextWithAdapter
          value={value}
          content={content}
          placeholder={placeholder}
          adapter={referenceAdapter}
        />
      </div>
    );
  }
  return (
    <CanvasReferenceEditorWithAdapter
      className="ws-storyboard-reference-editor nodrag nopan nowheel"
      value={value}
      content={content}
      adapter={referenceAdapter}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus
      layerZIndex={2600}
      onChange={onChange}
    />
  );
}

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

function positiveDuration(
  event: ChangeEvent<HTMLInputElement>,
  fallback: number,
) {
  const value = Number.parseInt(event.target.value, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
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
