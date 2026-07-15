import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
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
  type StoryboardShot,
} from "./space-storyboard";

export type StoryboardSaveStatus = "saved" | "typing" | "saving" | "error";

export function StoryboardView({
  storyboard,
  editable = false,
  disabled = false,
  onSave,
  onChange,
  saveStatus: externalSaveStatus,
  showSaveStatus = true,
  showMetrics = true,
}: {
  storyboard: StoryboardDocument;
  editable?: boolean;
  disabled?: boolean;
  onSave?: (storyboard: StoryboardDocument) => Promise<void>;
  onChange?: (storyboard: StoryboardDocument) => void;
  saveStatus?: StoryboardSaveStatus;
  showSaveStatus?: boolean;
  showMetrics?: boolean;
}) {
  const externalSignature = useMemo(
    () => JSON.stringify(storyboard),
    [storyboard],
  );
  const [internalDraft, setInternalDraft] = useState(storyboard);
  const [saveStatus, setSaveStatus] =
    useState<StoryboardSaveStatus>("saved");
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
    const next = normalizeStoryboardOrder(updater(current));
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

  const updateShot = (
    index: number,
    patch: Partial<StoryboardShot>,
  ) => {
    updateDraft((current) => ({
      ...current,
      shots: current.shots.map((shot, shotIndex) =>
        shotIndex === index ? { ...shot, ...patch } : shot,
      ),
    }));
  };

  const moveShot = (index: number, offset: -1 | 1) => {
    updateDraft((current) => {
      const targetIndex = index + offset;
      if (targetIndex < 0 || targetIndex >= current.shots.length) {
        return current;
      }
      const shots = [...current.shots];
      [shots[index], shots[targetIndex]] = [shots[targetIndex], shots[index]];
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
                {draft.shots.length} 个镜头 · {storyboardTotalDuration(draft)} 秒
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
              {canEdit ? <th className="is-actions" aria-label="操作" /> : null}
            </tr>
          </thead>
          <tbody>
            {draft.shots.map((shot, index) => (
              <tr key={shot.id || `shot-${index + 1}`}>
                <td className="is-order">
                  <span>{index + 1}</span>
                  {canEdit ? (
                    <div className="ws-storyboard-order-actions">
                      <StoryboardIconButton
                        label="上移镜头"
                        disabled={disabled || index === 0}
                        onClick={() => moveShot(index, -1)}
                      >
                        <ArrowUp size={12} />
                      </StoryboardIconButton>
                      <StoryboardIconButton
                        label="下移镜头"
                        disabled={disabled || index === draft.shots.length - 1}
                        onClick={() => moveShot(index, 1)}
                      >
                        <ArrowDown size={12} />
                      </StoryboardIconButton>
                    </div>
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
                    readOnly={!canEdit}
                    disabled={disabled}
                    placeholder="描述场景、人物、动作和镜头"
                    onChange={(visual) => updateShot(index, { visual })}
                  />
                </td>
                <td className="is-camera">
                  <StoryboardTextField
                    label={`镜头 ${index + 1} 运镜`}
                    value={shot.camera_movement}
                    readOnly={!canEdit}
                    disabled={disabled}
                    placeholder="景别、机位和运动方式"
                    onChange={(camera_movement) =>
                      updateShot(index, { camera_movement })
                    }
                  />
                </td>
                <td className="is-speech">
                  <div className="ws-storyboard-speech-fields">
                    <StoryboardTextField
                      label={`镜头 ${index + 1} 台词`}
                      value={shot.dialogue}
                      readOnly={!canEdit}
                      disabled={disabled}
                      placeholder="台词"
                      onChange={(dialogue) => updateShot(index, { dialogue })}
                    />
                    <StoryboardTextField
                      label={`镜头 ${index + 1} 旁白`}
                      value={shot.narration}
                      readOnly={!canEdit}
                      disabled={disabled}
                      placeholder="旁白"
                      onChange={(narration) => updateShot(index, { narration })}
                    />
                  </div>
                </td>
                <td className="is-sound">
                  <StoryboardTextField
                    label={`镜头 ${index + 1} 音效或配乐`}
                    value={shot.sound_music}
                    readOnly={!canEdit}
                    disabled={disabled}
                    placeholder="环境音、音效或配乐"
                    onChange={(sound_music) =>
                      updateShot(index, { sound_music })
                    }
                  />
                </td>
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

function StoryboardTextField({
  label,
  value,
  placeholder,
  readOnly,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  readOnly: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  if (readOnly) {
    return (
      <div className="ws-storyboard-readonly-field">
        {value || <span>{placeholder}</span>}
      </div>
    );
  }
  return (
    <textarea
      className="nodrag nopan nowheel"
      value={value}
      rows={2}
      aria-label={label}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    />
  );
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
