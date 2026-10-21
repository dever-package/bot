import type { Dispatch, SetStateAction, ChangeEvent, ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpenText,
  MessageSquareText,
  Plus,
  Trash2,
} from "lucide-react";
import {
  createStoryboardCaption,
  createStoryboardSpeech,
  type StoryboardCaption,
  type StoryboardCaptionType,
  type StoryboardMaterial,
  type StoryboardShot,
  type StoryboardSpeech,
  type StoryboardSpeechKind,
} from "./space-storyboard";
import { SpaceTooltip } from "./space-tooltip";

export function StoryboardShotSpeechEditor({
  shot: draft,
  materials,
  readonly,
  onChange: setDraft,
}: {
  shot: StoryboardShot;
  materials: StoryboardMaterial[];
  readonly: boolean;
  onChange: Dispatch<SetStateAction<StoryboardShot>>;
}) {
  const characters = materials.filter(
    (material) => material.type === "character",
  );
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
  const updateCaption = (
    captionId: string,
    patch: Partial<StoryboardCaption>,
  ) => {
    setDraft((current) => ({
      ...current,
      captions: current.captions.map((caption) =>
        caption.id === captionId ? { ...caption, ...patch } : caption,
      ),
    }));
  };
  const moveCaption = (captionId: string, offset: number) => {
    setDraft((current) => {
      const index = current.captions.findIndex(
        (caption) => caption.id === captionId,
      );
      const target = index + offset;
      if (index < 0 || target < 0 || target >= current.captions.length) {
        return current;
      }
      const captions = [...current.captions];
      const [moved] = captions.splice(index, 1);
      captions.splice(target, 0, moved);
      return { ...current, captions };
    });
  };
  return (
    <>
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
                      updateSpeech(speech.id, {
                        text: event.target.value,
                      })
                    }
                  />
                </label>
                <div className="ws-storyboard-speech-subtitle">
                  <label>
                    <input
                      type="checkbox"
                      checked={speech.subtitle_enabled}
                      disabled={readonly}
                      onChange={(event) =>
                        updateSpeech(speech.id, {
                          subtitle_enabled: event.target.checked,
                        })
                      }
                    />
                    加入字幕
                  </label>
                  {speech.subtitle_enabled ? (
                    <input
                      value={speech.subtitle_text}
                      readOnly={readonly}
                      placeholder="可选：填写精简字幕；留空使用原文"
                      onChange={(event) =>
                        updateSpeech(speech.id, {
                          subtitle_text: event.target.value,
                        })
                      }
                    />
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="ws-storyboard-speech-empty">
              <MessageSquareText size={24} />
              <span>当前镜头没有对白或旁白</span>
            </div>
          )}
        </div>
      </section>

      <section className="ws-storyboard-shot-section">
        <div className="ws-storyboard-shot-section-head">
          <div>
            <strong>附加字幕文案</strong>
            <span>{draft.captions.length} 条文案</span>
          </div>
          {!readonly ? (
            <button
              type="button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  captions: [
                    ...current.captions,
                    createStoryboardCaption(current),
                  ],
                }))
              }
            >
              <Plus size={13} />
              添加文案
            </button>
          ) : null}
        </div>
        <div className="ws-storyboard-speech-list">
          {draft.captions.length ? (
            draft.captions.map((caption, captionIndex) => (
              <div className="ws-storyboard-speech-row" key={caption.id}>
                <div className="ws-storyboard-speech-row-head">
                  <strong>文案 {captionIndex + 1}</strong>
                  {!readonly ? (
                    <div>
                      <StoryboardIconButton
                        label="上移文案"
                        disabled={captionIndex === 0}
                        onClick={() => moveCaption(caption.id, -1)}
                      >
                        <ArrowUp size={13} />
                      </StoryboardIconButton>
                      <StoryboardIconButton
                        label="下移文案"
                        disabled={captionIndex === draft.captions.length - 1}
                        onClick={() => moveCaption(caption.id, 1)}
                      >
                        <ArrowDown size={13} />
                      </StoryboardIconButton>
                      <StoryboardIconButton
                        label="删除文案"
                        danger
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            captions: current.captions.filter(
                              (item) => item.id !== caption.id,
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
                      value={caption.type}
                      disabled={readonly}
                      onChange={(event) =>
                        updateCaption(caption.id, {
                          type: event.target.value as StoryboardCaptionType,
                        })
                      }
                    >
                      <option value="caption">说明</option>
                      <option value="title">标题</option>
                      <option value="highlight">重点</option>
                    </select>
                  </label>
                  <label>
                    开始时间
                    <span className="ws-storyboard-time-input">
                      <input
                        type="number"
                        min={0}
                        max={draft.duration}
                        step={0.1}
                        value={caption.start_time}
                        disabled={readonly}
                        onChange={(event) =>
                          updateCaption(caption.id, {
                            start_time: nonNegativeTime(event),
                          })
                        }
                      />
                      秒
                    </span>
                  </label>
                  <label>
                    结束时间
                    <span className="ws-storyboard-time-input">
                      <input
                        type="number"
                        min={0.1}
                        max={draft.duration}
                        step={0.1}
                        value={caption.end_time}
                        disabled={readonly}
                        onChange={(event) =>
                          updateCaption(caption.id, {
                            end_time: nonNegativeTime(event),
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
                    value={caption.text}
                    readOnly={readonly}
                    placeholder="输入不对应语音的标题、说明或重点文字"
                    onChange={(event) =>
                      updateCaption(caption.id, {
                        text: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
            ))
          ) : (
            <div className="ws-storyboard-speech-empty">
              <BookOpenText size={24} />
              <span>当前镜头没有附加字幕文案</span>
            </div>
          )}
        </div>
      </section>
    </>
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
    <SpaceTooltip label={label}>
      <button
        type="button"
        className={`ws-storyboard-icon-button nodrag nopan ${danger ? "is-danger" : ""}`}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    </SpaceTooltip>
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
  next.subtitle_enabled = Boolean(next.subtitle_enabled);
  next.subtitle_text ||= "";
  return next;
}

function nonNegativeTime(event: ChangeEvent<HTMLInputElement>) {
  const value = Number.parseFloat(event.target.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}
