import { useRef, useState } from "react";
import { WritingDialog } from "./writing-dialog";
import {
  writingModes,
  writingStyles,
  writingViewpoints,
  type WritingPreferences,
} from "./writing-preferences";

/** 临时表单只在确认后进入原作品保存路径，取消不改文档草稿。 */
export function WritingPreferencesDialog({
  preferences,
  disabled,
  onSave,
  onClose,
}: {
  preferences: WritingPreferences;
  disabled: boolean;
  onSave: (preferences: WritingPreferences) => Promise<boolean>;
  onClose: () => void;
}) {
  const [fields, setFields] = useState(() => ({ ...preferences }));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const locked = disabled || pending;
  return (
    <WritingDialog
      title="写作设定"
      className="writing-preferences-dialog"
      closeDisabled={pending}
      onClose={onClose}
    >
      <form
        className="writing-dialog-scroll writing-preferences-form"
        onSubmit={async (event) => {
          event.preventDefault();
          if (disabled || submitting.current) return;
          submitting.current = true;
          setPending(true);
          setError("");
          try {
            if (
              await onSave({
                ...fields,
                genre: fields.genre.trim(),
                style_instructions: fields.style_instructions.trim(),
              })
            )
              onClose();
            else setError("未能保存，请重试。设置已保留。");
          } catch (cause) {
            setError(
              cause instanceof Error ? cause.message : "保存失败，设置已保留。",
            );
          } finally {
            submitting.current = false;
            setPending(false);
          }
        }}
      >
        <label className="writing-preferences-full">
          题材
          <input
            aria-label="题材"
            placeholder="沿用创作要求"
            disabled={locked}
            value={fields.genre}
            onChange={(event) =>
              setFields({ ...fields, genre: event.target.value })
            }
          />
          <span className="writing-genre-shortcuts">
            {["悬疑", "都市", "奇幻", "言情", "日常"].map((genre) => (
              <button
                key={genre}
                type="button"
                aria-pressed={fields.genre === genre}
                disabled={locked}
                onClick={() => setFields({ ...fields, genre })}
              >
                {genre}
              </button>
            ))}
          </span>
        </label>
        {[
          { key: "style", label: "文风", options: writingStyles },
          { key: "pov", label: "叙事视角", options: writingViewpoints },
          { key: "mode", label: "写作模式", options: writingModes },
        ].map(({ key, label, options }) => (
          <label key={key}>
            {label}
            <select
              aria-label={label}
              disabled={locked}
              value={fields[key as "style" | "pov" | "mode"]}
              onChange={(event) =>
                setFields({ ...fields, [key]: event.target.value })
              }
            >
              <option value="">沿用创作要求</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        {(
          [
            {
              key: "chapter_words",
              label: "每章目标字数",
              placeholder: "不限定",
            },
            {
              key: "planned_chapters",
              label: "计划总章数",
              placeholder: "暂不确定",
            },
          ] as const
        ).map(({ key, label, placeholder }) => (
          <label key={key}>
            {label}
            <input
              aria-label={label}
              type="number"
              min={1}
              step={1}
              max={Number.MAX_SAFE_INTEGER}
              placeholder={placeholder}
              disabled={locked}
              value={fields[key] || ""}
              onChange={(event) =>
                setFields({
                  ...fields,
                  [key]:
                    event.target.value === "" ? 0 : Number(event.target.value),
                })
              }
            />
          </label>
        ))}
        <label className="writing-preferences-full">
          自定义文风要求
          <textarea
            aria-label="自定义文风要求"
            rows={3}
            placeholder="例如：少用比喻，通过对话和动作表现情绪"
            disabled={locked}
            value={fields.style_instructions}
            onChange={(event) =>
              setFields({ ...fields, style_instructions: event.target.value })
            }
          />
        </label>
        {error && (
          <p
            role="alert"
            className="writing-preferences-full writing-inspiration-form-error"
          >
            {error}
          </p>
        )}
        <div className="writing-preferences-full writing-actions">
          <button type="button" disabled={pending} onClick={onClose}>
            取消
          </button>
          <button type="submit" className="is-primary" disabled={locked}>
            {pending ? "保存中…" : "保存"}
          </button>
        </div>
      </form>
    </WritingDialog>
  );
}
