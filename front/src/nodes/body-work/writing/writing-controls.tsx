import { useMemo, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { WritingAction, WritingCommand } from "./writing-api";
import {
  type WritingDocument,
  type WritingSelection,
} from "./writing-document";
import type { WritingChapterDirectory } from "./use-writing-chapter-directory";
import {
  writingChapterRange,
  writingContinuationBatch,
  writingChapterPlanBatchLimit,
  writingNextPlanBatch,
  writingPlanSyncRows,
} from "./writing-chapter-index";
import { WritingConfirmDialog } from "./writing-dialog";
import { writingActionReason, writingCommandImpact } from "./writing-workspace";
import { writingAITarget, writingAICommand } from "./writing-ai-command";

export function WritingControls({
  document,
  savedDocument,
  onConfirmationChange,
  selection,
  disabled,
  body,
  selectedCharacters,
  onClearSelection,
  onAction,
  proposalPending,
  proposalReady,
  proposalPreview,
  running,
  onApply,
  onDiscard,
  directory,
  activeBatchIds,
}: {
  document: WritingDocument;
  savedDocument: WritingDocument;
  onConfirmationChange: (open: boolean) => void;
  selection: WritingSelection;
  disabled: boolean;
  body?: string;
  selectedCharacters: number;
  onClearSelection: () => void;
  onAction: (
    action: WritingAction,
    extra?: Partial<WritingCommand>,
  ) => Promise<boolean>;
  proposalPending: boolean;
  proposalReady: boolean;
  proposalPreview: string;
  running: boolean;
  onApply: () => void;
  onDiscard: () => void;
  directory: WritingChapterDirectory;
  activeBatchIds?: string[];
}) {
  const [instruction, setInstruction] = useState("");
  const outline = selection.kind === "section" && selection.id !== "chapters";
  const [batchCount, setBatchCount] = useState(10);
  const [chapterCount, setChapterCount] = useState("");
  const pendingPlans = useMemo(() => writingPlanSyncRows(savedDocument.units), [savedDocument.units]);
  const syncBatch = pendingPlans.slice(0, writingChapterPlanBatchLimit);
  const automaticPlan = writingNextPlanBatch(savedDocument.units, savedDocument.preferences.planned_chapters);
  const nextPlan = writingNextPlanBatch(savedDocument.units, savedDocument.preferences.planned_chapters, chapterCount === "" ? undefined : Number(chapterCount));
  const appendReason = writingActionReason(savedDocument, "append", { count: nextPlan.count });
  const appendLabel = appendReason ? "规划后续章节" : `规划第 ${nextPlan.start}—${nextPlan.end} 章`;
  const continuation = useMemo(
    () =>
      running && activeBatchIds?.length
        ? activeBatchIds.flatMap((id) => {
            const row = directory.index.byId.get(id);
            return row ? [row] : [];
          })
        : writingContinuationBatch(savedDocument.units, batchCount),
    [savedDocument.units, batchCount, running, activeBatchIds, directory.index],
  );
  const [submitting, setSubmitting] = useState(false);
  const submitBusy = useRef(false);
  const [confirmation, setConfirmation] = useState<{
    action: WritingAction;
    extra: Partial<WritingCommand>;
    impact: string;
  } | null>(null);
  const [confirmationError, setConfirmationError] = useState("");
  const input = {
    document,
    savedDocument,
    selection,
    body,
    selectedCharacters,
  };
  const target = writingAITarget(input);
  const controlsDisabled = disabled || submitting || proposalPending;
  const runCommand = async (
    action: WritingAction,
    extra: Partial<WritingCommand> = {},
  ) => {
    if (controlsDisabled || submitBusy.current) return false;
    if (writingActionReason(savedDocument, action, extra)) return false;
    submitBusy.current = true;
    setSubmitting(true);
    try {
      const accepted = await onAction(action, {
        instruction: instruction.trim(),
        ...extra,
      });
      if (accepted) setInstruction("");
      return accepted;
    } finally {
      submitBusy.current = false;
      setSubmitting(false);
    }
  };
  const requestCommand = (
    action: WritingAction,
    extra: Partial<WritingCommand> = {},
  ) => {
    if (
      controlsDisabled ||
      submitBusy.current ||
      writingActionReason(savedDocument, action, extra)
    )
      return;
    const impact = writingCommandImpact(savedDocument, action, extra);
    if (impact) {
      setConfirmation({ action, extra, impact });
      setConfirmationError("");
      onConfirmationChange(true);
    } else void runCommand(action, extra);
  };
  const closeConfirmation = () => {
    setConfirmation(null);
    onConfirmationChange(false);
  };
  const submit = (continueWriting = false, quickInstruction = "") => {
    const { action, extra } = writingAICommand(
      input,
      [quickInstruction, instruction.trim()].filter(Boolean).join("\n"),
      continueWriting,
    );
    requestCommand(
      action,
      continueWriting ? { ...extra, count: batchCount } : extra,
    );
  };
  const showContinuation = outline || target.directory || (target.selected && !target.chapterPlan && target.hasContent);
  let nextStep: { label: string; action: WritingAction; extra: Partial<WritingCommand> } | undefined;
  if (!selectedCharacters && !target.chapterPlan && !target.entityList && !target.selected) {
    if (!savedDocument.units.length)
      nextStep = { label: "生成大纲与剧情", action: "generate_outline", extra: {} };
    else if (continuation.length && !continuation.some(({ unit }) => unit.plan_stale))
      nextStep = { label: "继续写正文", action: "generate_units", extra: { mode: "continue", count: batchCount } };
    else if (!pendingPlans.length && automaticPlan.count)
      nextStep = { label: appendLabel, action: "append", extra: { count: nextPlan.count } };
  }
  const nextReason = nextStep ? writingActionReason(savedDocument, nextStep.action, nextStep.extra) : "";
  return (
    <div className="writing-controls" role="group" aria-label="AI 创作">
      <h3>
        <Sparkles size={16} aria-hidden="true" />
        AI 创作
      </h3>
      {!selectedCharacters && (
        <p className="writing-ai-current" aria-label="当前 AI 目标">
          {target.label}
        </p>
      )}
      {selectedCharacters > 0 && (
        <div className="writing-ai-target">
          <span>修改选中文字</span>
          <div className="writing-row">
            <small>{selectedCharacters} 字</small>
            <button disabled={proposalPending} onClick={onClearSelection}>
              清除选区
            </button>
          </div>
        </div>
      )}
      {proposalPending ? (
        <section className="writing-proposal-preview" aria-label="AI 修改建议">
          <div className="writing-row">
            <h4>修改建议</h4>
            <span role="status">
              {proposalReady ? "等待应用" : running ? "正在生成…" : "未完成"}
            </span>
          </div>
          <div
            className="writing-proposal-text"
            aria-live="off"
            data-writing-stream-target="proposal"
          >
            {proposalPreview ||
              (running ? "正在准备内容…" : "生成未完成，原文已保留。")}
          </div>
          <div className="writing-proposal-actions">
            <button
              className="is-primary"
              disabled={disabled || !proposalReady}
              onClick={onApply}
            >
              应用修改
            </button>
            <button disabled={disabled} onClick={onDiscard}>
              丢弃建议
            </button>
          </div>
        </section>
      ) : (
        <>
          {pendingPlans.length > 0 && selection.kind !== "entity" && !target.chapterPlan && !selectedCharacters && <section className="writing-primary-action" aria-label="后续剧情同步">
            <p className="writing-ai-note">待同步：{writingChapterRange(pendingPlans)}</p>
            <button className="is-primary" disabled={controlsDisabled} onClick={() => requestCommand("generate_chapters", { unit_ids: syncBatch.map(({ unit }) => unit.id) })}>同步后续剧情 <ArrowRight size={15} /></button>
            <small className="writing-batch-range">本批 {writingChapterRange(syncBatch)}{pendingPlans.length > syncBatch.length ? ` · 其余 ${pendingPlans.length - syncBatch.length} 章下一批同步` : ""}</small>
            {savedDocument.units.some((unit) => unit.has_body) && <p className="writing-ai-note">已写正文保留；需要调整时，打开对应章节生成修改建议。</p>}
          </section>}
          {nextStep && !selectedCharacters && (
            <div className="writing-ai-actions writing-primary-action">
              <button
                className="is-primary"
                disabled={
                  controlsDisabled ||
                  Boolean(nextReason)
                }
                title={nextReason || undefined}
                onClick={() => requestCommand(nextStep.action, nextStep.extra)}
              >
                {nextStep.label}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
              {nextReason && <p className="writing-ai-note">{nextReason}</p>}
            </div>
          )}
          {target.selected?.has_body && (target.selected.continuity_status === "pending" || target.selected.dependency_stale) && (
            <div className="writing-primary-action"><p className="writing-ai-note">正文已保存，补充剧情衔接后再继续。</p><button className="is-primary" disabled={controlsDisabled} onClick={() => requestCommand("retry_continuity", { unit_id: target.selected!.id, expected_unit_version_id: target.selected!.version_id })}>整理本章衔接</button></div>
          )}
          <label>
            <span>
              修改要求 <small>可选</small>
            </span>
            <textarea
              aria-label="创作要求"
              rows={4}
              disabled={controlsDisabled}
              placeholder="希望怎么写，或怎么改？"
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
            />
          </label>
          {!target.directory && !target.entityList && target.hasContent && (
            <div className="writing-quick-actions" aria-label="快捷修改">
              {[
                { label: "润色", instruction: "润色表达，保留原意与事实。" },
                {
                  label: "扩写",
                  instruction: "扩写细节，保持人物和情节一致。",
                },
                { label: "精简", instruction: "精简冗余表达，保留关键信息。" },
              ].map((quick) => (
                <button
                  key={quick.label}
                  disabled={controlsDisabled || !target.available}
                  onClick={() => submit(false, quick.instruction)}
                >
                  {quick.label}
                </button>
              ))}
            </div>
          )}
          <div className="writing-ai-actions">
            {!target.directory && (!outline || target.hasContent) && <button
              className={nextStep && !selectedCharacters ? undefined : "is-primary"}
              disabled={controlsDisabled || !target.available}
              onClick={() => submit()}
            >
              <Sparkles size={15} aria-hidden="true" />
              {selectedCharacters
                ? "修改选中文字"
                : target.hasContent && !target.directory && !target.entityList
                  ? "生成修改建议"
                  : target.primaryLabel}
            </button>}
          </div>
          {!target.available && (
            <p className="writing-ai-note">{target.reason}</p>
          )}
          {(outline || target.directory) && savedDocument.units.length > 0 && <div className="writing-plan-more">
            <p className="writing-ai-note">已规划 1—{savedDocument.units.length} 章{savedDocument.preferences.planned_chapters ? ` / 计划 ${savedDocument.preferences.planned_chapters} 章` : ""}</p>
            {automaticPlan.count > 0 ? <><label className="writing-count-field"><span>本批剧情</span><input type="number" min={1} max={automaticPlan.count} aria-label="追加剧情章数" value={chapterCount} placeholder={String(automaticPlan.count)} disabled={controlsDisabled} onChange={(event) => setChapterCount(event.target.value)} /></label>
            {nextStep?.action !== "append" && <><button disabled={controlsDisabled || Boolean(appendReason)} title={appendReason || undefined} onClick={() => requestCommand("append", { count: nextPlan.count })}>{appendLabel}</button>{appendReason && <p className="writing-ai-note">{appendReason}</p>}</>}</> : <small className="writing-batch-range">已规划至计划总章数</small>}
          </div>}
          {showContinuation && (
            <div className="writing-continuation">
              <label className="writing-count-field">
                <span>本批正文</span>
                <select
                  aria-label="本批正文数量"
                  disabled={controlsDisabled}
                  value={batchCount}
                  onChange={(event) =>
                    setBatchCount(Number(event.target.value))
                  }
                >
                  {[1, 3, 5, 10].map((count) => (
                    <option key={count} value={count}>
                      最多 {count} 章
                    </option>
                  ))}
                </select>
              </label>
              {continuation.length > 0 && (
                <small className="writing-batch-range">
                  {writingChapterRange(continuation)}
                </small>
              )}
              {nextStep?.action !== "generate_units" && <button
                disabled={
                  controlsDisabled ||
                  !target.remaining ||
                  Boolean(
                    writingActionReason(savedDocument, "generate_units", {
                      mode: "continue",
                      count: batchCount,
                    }),
                  )
                }
                title={
                  writingActionReason(savedDocument, "generate_units", {
                    mode: "continue",
                    count: batchCount,
                  }) || undefined
                }
                onClick={() => submit(true)}
              >
                生成本批正文
                <ArrowRight size={14} aria-hidden="true" />
              </button>}
            </div>
          )}
        </>
      )}
      {confirmation && (
        <WritingConfirmDialog
          title="确认更新范围"
          description={confirmation.impact}
          confirmLabel="确认更新"
          pending={submitting}
          disabled={controlsDisabled}
          error={confirmationError}
          onClose={() => {
            if (!submitBusy.current) closeConfirmation();
          }}
          onConfirm={async () => {
            if (await runCommand(confirmation.action, confirmation.extra))
              closeConfirmation();
            else if (!submitBusy.current)
              setConfirmationError("更新未成功，原内容已保留，请重试。");
          }}
        />
      )}
    </div>
  );
}
