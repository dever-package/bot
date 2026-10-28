import { useRef, useState } from "react";
import { AssetTextContentEditor } from "../shared/asset-text-content-editor";
import { useContentDraft } from "../shared/use-content-draft";
import { WritingDialog } from "./writing-dialog";
import type {
  WritingSnapshot,
  WritingStreamDraft,
  WritingUnitEntry,
} from "./writing-document";

/** 原 Run 草稿与已保存目录分开；只有人工确认后才调用原批次的严格提交。 */
export function WritingChapterRecovery({
  draft,
  snapshot,
  disabled,
  open,
  onOpen,
  onClose,
  onSave,
}: {
  draft: WritingStreamDraft;
  snapshot: WritingSnapshot;
  disabled: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSave: (units: WritingUnitEntry[]) => Promise<void>;
}) {
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitBusy = useRef(false);
  const checkpoint = snapshot.checkpoint!;
  const baselineChanged =
    checkpoint.work_asset_id !== snapshot.work_asset_id ||
    checkpoint.work_version_id !== snapshot.work_version_id ||
    checkpoint.work_revision !== snapshot.work_revision;
  const persist = async (units: WritingUnitEntry[]) => {
    await onSave(units);
  };
  const edit = useContentDraft({
    value: draft.units!,
    resetKey: `${draft.run_id}:${draft.request_id}`,
    fingerprint: JSON.stringify,
    autoSave: false,
    save: persist,
    onError: (cause) =>
      setError(
        cause instanceof Error ? cause.message : "保存未成功，草稿已保留",
      ),
  });
  const units = edit.draft;
  const position = Math.min(selected, units.length - 1);
  const unit = units[position];
  const update = (patch: Partial<Pick<WritingUnitEntry, "title" | "plan">>) =>
    edit.setDraft(
      units.map((entry, index) =>
        index === position ? { ...entry, ...patch } : entry,
      ),
    );
  const addChapter = () => {
    const id = checkpoint.unit_ids[units.length] || "";
    const title =
      snapshot.document.units.find((entry) => entry.id === id)?.title || "";
    edit.setDraft([
      ...units,
      {
        id,
        unit_type: "chapter",
        title,
        plan: "",
        children: [],
        asset_id: 0,
        version_id: 0,
        has_body: false,
        continuity_valid: false,
        dependency_stale: false,
      },
    ]);
    setSelected(units.length);
  };
  const canSave =
    units.length === draft.expected_count &&
    units.every((entry) => entry.title.trim() && entry.plan.trim());
  const save = async () => {
    if (disabled || baselineChanged || !canSave || submitBusy.current) return;
    submitBusy.current = true;
    setSubmitting(true);
    setError("");
    try {
      if (edit.hasPendingChanges) {
        if (!(await edit.flush())) return;
      } else await persist(units);
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "保存未成功，草稿已保留",
      );
    } finally {
      submitBusy.current = false;
      setSubmitting(false);
    }
  };
  return (
    <section className="writing-draft-recovery" aria-label="未保存章纲草稿">
      <p>
        章纲草稿已保留：{draft.units!.length} 章，本批要求{" "}
        {draft.expected_count} 章
        {draft.complete ? "。" : "；生成已中断，仅包含完整收到的章节。"}
      </p>
      <button disabled={disabled && !open} onClick={onOpen}>
        查看并调整草稿
      </button>
      {open && (
        <WritingDialog
          title="调整章纲草稿"
          onClose={onClose}
          closeDisabled={submitting}
          className="writing-chapter-recovery-dialog"
        >
          <div className="writing-chapter-recovery-layout">
            <nav
              className="writing-chapter-recovery-list"
              aria-label="草稿章节"
            >
              {units.map((entry, index) => (
                <button
                  type="button"
                  key={`${index}:${entry.id}`}
                  aria-current={index === position ? "true" : undefined}
                  disabled={submitting}
                  onClick={() => setSelected(index)}
                >
                  <small>第 {index + 1} 章</small>
                  <strong>{entry.title || "未命名章节"}</strong>
                </button>
              ))}
              <button
                type="button"
                disabled={submitting || units.length >= draft.expected_count!}
                onClick={addChapter}
              >
                {checkpoint.unit_ids.length ? "补充下一章草稿" : "添加章节"}
              </button>
            </nav>
            <div className="writing-dialog-scroll">
              <p className="writing-chapter-recovery-note">
                当前 {units.length} 章 · 本批需 {draft.expected_count}{" "}
                章；调整后保存，计划总章数保持不变。
              </p>
              {baselineChanged && (
                <p role="alert">
                  作品已有新修改，原草稿可查看，不能覆盖当前内容。
                </p>
              )}
              {unit && (
                <>
                  <label className="writing-title-field">
                    <span className="writing-sr-only">草稿章节标题</span>
                    <input
                      aria-label="草稿章节标题"
                      value={unit.title}
                      readOnly={submitting}
                      onChange={(event) =>
                        update({ title: event.target.value })
                      }
                    />
                  </label>
                  <div className="writing-body">
                    <AssetTextContentEditor
                      kind="richtext"
                      contentFormat="markdown"
                      value={unit.plan}
                      readonly={submitting}
                      onChange={(plan) => update({ plan })}
                    />
                  </div>
                  {!checkpoint.unit_ids.length && (
                    <button
                      type="button"
                      className="is-danger"
                      disabled={submitting}
                      onClick={() =>
                        edit.setDraft(
                          units.filter((_, index) => index !== position),
                        )
                      }
                    >
                      移除此章草稿
                    </button>
                  )}
                </>
              )}
              {error && (
                <p role="alert" className="writing-error">
                  {error}
                </p>
              )}
            </div>
          </div>
          <footer className="writing-actions writing-entity-dialog-actions">
            <button disabled={submitting} onClick={onClose}>
              返回大纲
            </button>
            <button
              className="is-primary"
              disabled={disabled || submitting || baselineChanged || !canSave}
              onClick={() => void save()}
            >
              {submitting ? "正在保存…" : `保存本批 ${draft.expected_count} 章`}
            </button>
          </footer>
        </WritingDialog>
      )}
    </section>
  );
}
