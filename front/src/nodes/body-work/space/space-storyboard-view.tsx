import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowUp,
  BookOpenText,
  Check,
  Copy,
  Edit3,
  Loader2,
  MessageSquareText,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  createStoryboardShot,
  createStoryboardSpeech,
  isStoryboardConfirmed,
  normalizeStoryboardOrder,
  storyboardHasVisibleDialogue,
  storyboardSpeechCount,
  storyboardSpeechLabel,
  storyboardTotalDuration,
  storyboardVisibleSpeakerIds,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardReferenceField,
  type StoryboardShot,
  type StoryboardSpeech,
  type StoryboardSpeechKind,
} from "./space-storyboard";
import { moveOrderedItemById } from "./space-ordered-list";
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
import { SequenceCard } from "./space-sequence-card";
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
  const [draggedShotId, setDraggedShotId] = useState("");
  const [dragPlacement, setDragPlacement] = useState<"before" | "after">(
    "before",
  );
  const storyboardRootRef = useRef<HTMLElement>(null);
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
    if (editingShotId && !editingShot) {
      setEditingShotId("");
    }
  }, [editingShot, editingShotId]);

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

  const reorderShot = (
    sourceId: string,
    targetId: string,
    placement: "before" | "after",
  ) => {
    if (!sourceId || !targetId || sourceId === targetId) {
      return;
    }
    updateDraft((current) => {
      const shots = moveOrderedItemById(
        current.shots,
        sourceId,
        targetId,
        placement,
        (shot) => shot.id,
      );
      return shots === current.shots ? current : { ...current, shots };
    });
  };

  const saveShot = (shot: StoryboardShot) => {
    updateDraft((current) => ({
      ...current,
      shots: current.shots.map((item) => (item.id === shot.id ? shot : item)),
    }));
    setEditingShotId("");
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
      <header className="ws-storyboard-head">
        <div className="ws-storyboard-heading">
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
          <span className={`ws-storyboard-workflow is-${draft.workflow.status}`}>
            {confirmed ? "已确认" : "草稿"}
          </span>
        </div>
        <div className="ws-storyboard-head-end">
          {showMetrics || (canEdit && showSaveStatus) ? (
            <div className="ws-storyboard-head-meta">
              {showMetrics ? (
                <span>
                  {draft.shots.length} 个镜头 · {storyboardTotalDuration(draft)} 秒
                  {storyboardSpeechCount(draft) > 0
                    ? ` · ${storyboardSpeechCount(draft)} 条语音`
                    : ""}
                </span>
              ) : null}
              {canEdit && showSaveStatus ? (
                <StoryboardSaveState
                  status={controlled ? externalSaveStatus || "saved" : saveStatus}
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
              disabled={disabled || Boolean(workflowAction) || !draft.shots.length}
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

      <div className="ws-storyboard-grid nowheel">
        {draft.shots.length ? (
          draft.shots.map((shot, index) => (
            <StoryboardShotCard
              key={shot.id}
              shot={shot}
              index={index}
              storyboard={draft}
              selected={editingShotId === shot.id}
              editable={canEdit}
              lipSyncEnabled={lipSyncEnabled}
              onOpen={() => setEditingShotId(shot.id)}
              onDuplicate={() => duplicateShot(shot)}
              onRemove={() => removeShot(shot.id)}
              onDragStart={() => setDraggedShotId(shot.id)}
              onDragOver={(event) => {
                event.preventDefault();
                const bounds = event.currentTarget.getBoundingClientRect();
                const horizontal =
                  Math.abs(event.clientY - (bounds.top + bounds.height / 2)) <
                  bounds.height / 3;
                setDragPlacement(
                  horizontal
                    ? event.clientX < bounds.left + bounds.width / 2
                      ? "before"
                      : "after"
                    : event.clientY < bounds.top + bounds.height / 2
                      ? "before"
                      : "after",
                );
              }}
              onDrop={() => {
                reorderShot(draggedShotId, shot.id, dragPlacement);
                setDraggedShotId("");
              }}
              onDragEnd={() => setDraggedShotId("")}
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

      {editingShot ? (
        <StoryboardShotDialog
          key={editingShot.id}
          shot={editingShot}
          index={draft.shots.findIndex((shot) => shot.id === editingShot.id)}
          characters={draft.materials?.characters || []}
          lipSyncEnabled={lipSyncEnabled}
          readonly={!canEdit}
          referenceAdapter={referenceAdapter}
          portalContainer={
            storyboardRootRef.current?.closest(
              ".wb-detail-backdrop, .ws-page",
            ) || null
          }
          onSave={saveShot}
          onClose={() => setEditingShotId("")}
        />
      ) : null}
    </section>
  );
}

function StoryboardShotCard({
  shot,
  index,
  storyboard,
  selected,
  editable,
  lipSyncEnabled,
  onOpen,
  onDuplicate,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  shot: StoryboardShot;
  index: number;
  storyboard: StoryboardDocument;
  selected: boolean;
  editable: boolean;
  lipSyncEnabled: boolean;
  onOpen: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: ComponentProps<typeof SequenceCard>["onDragOver"];
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const speech = shot.speech.filter((item) => item.text.trim());
  const primarySpeech = speech[0];
  const characterNames = new Map(
    (storyboard.materials?.characters || []).map((item) => [item.id, item.name]),
  );
  const labels = [...new Set(speech.map(storyboardSpeechLabel))];
  const lipSyncCandidate = lipSyncEnabled && storyboardHasVisibleDialogue(shot);
  return (
    <SequenceCard
      itemId={shot.id}
      index={index}
      durationLabel={`${shot.duration}秒`}
      className="ws-storyboard-card"
      dragClassName="ws-storyboard-card-drag"
      selected={selected}
      readonly={!editable}
      ariaLabel={`镜头 ${index + 1}`}
      onSelect={onOpen}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      headerActions={
        <span className="ws-storyboard-card-count">
          {speech.length ? `${speech.length} 条语音` : "无语音"}
        </span>
      }
    >
      <div className="ws-storyboard-card-preview">
        <span>镜头 {String(index + 1).padStart(2, "0")}</span>
        <p>
          首帧：{shot.visual || "等待补充"}；尾帧：
          {shot.end_visual || "等待补充"}
        </p>
      </div>
      <div className="ws-storyboard-card-body">
        <div className="ws-storyboard-card-tags">
          {labels.length ? (
            labels.map((label) => <span key={label}>{label}</span>)
          ) : (
            <span>无语音</span>
          )}
          {lipSyncCandidate ? <span className="is-lip-sync">口型候选</span> : null}
        </div>
        <p className="ws-storyboard-card-camera">
          {shot.camera_movement || "未设置运镜"}
        </p>
        {primarySpeech ? (
          <p className="ws-storyboard-card-speech">
            {primarySpeech.kind === "dialogue" ? (
              <UserRound size={12} />
            ) : (
              <BookOpenText size={12} />
            )}
            <strong>
              {primarySpeech.kind === "dialogue"
                ? characterNames.get(primarySpeech.character_id || "") || "待选角色"
                : "旁白"}
            </strong>
            <span>{primarySpeech.text}</span>
          </p>
        ) : (
          <p className="ws-storyboard-card-speech is-empty">
            <MessageSquareText size={12} />
            当前镜头没有对白或旁白
          </p>
        )}
      </div>
      <footer>
        <button type="button" title={editable ? "编辑镜头" : "查看镜头"} onClick={stopAnd(onOpen)}>
          <Edit3 size={13} />
          {editable ? "编辑" : "查看"}
        </button>
        {editable ? (
          <>
            <button type="button" title="复制镜头" onClick={stopAnd(onDuplicate)}>
              <Copy size={13} />
              复制
            </button>
            <button
              type="button"
              className="is-danger"
              title="删除镜头"
              onClick={stopAnd(onRemove)}
            >
              <Trash2 size={13} />
              删除
            </button>
          </>
        ) : null}
      </footer>
    </SequenceCard>
  );
}

function StoryboardShotDialog({
  shot,
  index,
  characters,
  lipSyncEnabled,
  readonly,
  referenceAdapter,
  portalContainer,
  onSave,
  onClose,
}: {
  shot: StoryboardShot;
  index: number;
  characters: StoryboardMaterial[];
  lipSyncEnabled: boolean;
  readonly: boolean;
  referenceAdapter: CanvasReferenceAdapter;
  portalContainer: Element | null;
  onSave: (shot: StoryboardShot) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(() => cloneStoryboardShot(shot));
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
    setDraft((current) => ({
      ...current,
      speech: current.speech.map((speech) =>
        speech.id === speechId ? normalizeSpeechPatch(speech, patch) : speech,
      ),
    }));
  };
  const moveSpeech = (speechId: string, offset: number) => {
    setDraft((current) => {
      const index = current.speech.findIndex((speech) => speech.id === speechId);
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
            <strong>{readonly ? "查看镜头" : "编辑镜头"} {String(index + 1).padStart(2, "0")}</strong>
            <span>{readonly ? "当前分镜已经确认" : "修改会保存到当前分镜草稿"}</span>
          </div>
          <button type="button" title="关闭" aria-label="关闭" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="ws-storyboard-shot-form nowheel">
          <section className="ws-storyboard-shot-section">
            <div className="ws-storyboard-shot-section-head">
              <strong>镜头内容</strong>
              <label>
                时长
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={draft.duration}
                  disabled={readonly}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      duration: positiveDuration(event, current.duration),
                    }))
                  }
                />
                秒
              </label>
            </div>
            <div className="ws-storyboard-shot-field-row">
              <StoryboardDialogField
                label="首帧画面"
                value={draft.visual}
                content={draft.reference_contents?.visual}
                placeholder="描述镜头开始时的场景、人物、动作和构图"
                readonly={readonly}
                referenceAdapter={referenceAdapter}
                onChange={(value, content) =>
                  updateField("visual", value, content)
                }
              />
              <StoryboardDialogField
                label="尾帧画面"
                value={draft.end_visual}
                content={draft.reference_contents?.end_visual}
                placeholder="描述镜头结束时的场景、人物、动作和构图"
                readonly={readonly}
                referenceAdapter={referenceAdapter}
                onChange={(value, content) =>
                  updateField("end_visual", value, content)
                }
              />
            </div>
            <div className="ws-storyboard-shot-field-row">
              <StoryboardDialogField
                label="运镜"
                value={draft.camera_movement}
                content={draft.reference_contents?.camera_movement}
                placeholder="景别、机位和运动方式"
                readonly={readonly}
                referenceAdapter={referenceAdapter}
                onChange={(value, content) =>
                  updateField("camera_movement", value, content)
                }
              />
              <StoryboardDialogField
                label="视频提示词"
                value={draft.prompt}
                content={draft.reference_contents?.prompt}
                placeholder="完整描述动作、运镜、光线与风格"
                readonly={readonly}
                referenceAdapter={referenceAdapter}
                onChange={(value, content) => updateField("prompt", value, content)}
              />
            </div>
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
  "visual",
  "end_visual",
  "camera_movement",
  "prompt",
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

function positiveDuration(
  event: ChangeEvent<HTMLInputElement>,
  fallback: number,
) {
  const value = Number.parseInt(event.target.value, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
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

function duplicateStoryboardShot(shots: StoryboardShot[], shot: StoryboardShot) {
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
    speech: shot.speech.map((speech) => ({ ...speech })),
    reference_contents: { ...(shot.reference_contents || {}) },
  };
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    action();
  };
}
