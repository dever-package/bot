import { useCallback, useEffect, useRef, useState } from "react";
import type {
  RichTextSelection,
  RichTextSelectionActions,
} from "../shared/asset-text-content-editor";
import type { WritingAction, WritingCommand } from "./writing-api";
import type { WritingDraft, useWritingEditor } from "./use-writing-editor";
import {
  writingSelectionText,
  isWritingOutlineSection,
  updateWritingUnit,
  type WritingSelection,
} from "./writing-document";

type Editor = ReturnType<typeof useWritingEditor>;
type ProposalTarget = {
  selection: WritingSelection;
  text: string;
  range: RichTextSelection | null;
  runId: number;
  unitVersion: number;
};

export function writingTargetText(
  value: WritingDraft,
  selection?: WritingSelection,
): string {
  if (!selection || !value.document) return "";
  return writingSelectionText(value.document, selection, value.unit?.body);
}
function replaceTarget(
  value: WritingDraft,
  selection: WritingSelection,
  replacement: string,
): WritingDraft {
  const document = value.document!;
  if (selection.kind === "unit" && selection.tab === "plan")
    return {
      ...value,
      document: {
        ...document,
        units: updateWritingUnit(document.units, selection.id, {
          plan: replacement,
        }),
      },
    };
  if (selection.kind === "unit" && value.unit)
    return { ...value, unit: { ...value.unit, body: replacement } };
  if (selection.kind === "entity")
    return {
      ...value,
      document: {
        ...document,
        outline: {
          ...document.outline,
          [selection.section]: document.outline[selection.section].map(
            (entity) =>
              entity.id === selection.id
                ? { ...entity, description: replacement }
                : entity,
          ),
        },
      },
    };
  if (selection.kind === "section" && isWritingOutlineSection(selection.id))
    return {
      ...value,
      document: {
        ...document,
        outline: { ...document.outline, [selection.id]: replacement },
      },
    };
  return value;
}

/** 提案保留捕获时的编辑范围与正文；提交、预览和应用均不扩大目标。 */
export function useWritingProposal(editor: Editor) {
  const [textSelection, setTextSelection] = useState<RichTextSelection | null>(
    null,
  );
  const selectionActionsRef = useRef<RichTextSelectionActions | null>(null);
  const [target, setTarget] = useState<ProposalTarget | null>(null);
  const retryTarget = useRef<ProposalTarget | null>(null);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const applying = useRef(false);
  const following = useRef(false);
  const clear = useCallback(() => {
    selectionActionsRef.current?.clearSelection();
    setTextSelection(null);
  }, []);
  const discard = useCallback(() => {
    following.current = false;
    setTarget(null);
    setError("");
    clear();
  }, [clear]);
  const proposal = editor.snapshot?.proposal;
  const ready = Boolean(
    target &&
    proposal &&
    proposal.run_id === target.runId &&
    editor.snapshot?.document.status === "ready",
  );
  const preview =
    target &&
    editor.preview?.run_id === target.runId &&
    editor.preview.fields.replacement !== undefined
      ? editor.preview.fields.replacement
      : "";
  const submitProposal = async (
    extra: Partial<WritingCommand>,
    selection: WritingSelection,
    range: RichTextSelection | null,
    selectedSource?: string,
  ) => {
    let captured: Omit<ProposalTarget, "runId"> | undefined;
    const accepted = await editor.action(
      "propose_edit",
      { ...extra, ...(range ? { selected_text: range.text } : {}) },
      (saved) => {
        if (JSON.stringify(saved.selection) !== JSON.stringify(selection)) {
          setError("编辑目标已变化，请重新选择后生成修改建议。");
          return false;
        }
        const text = writingTargetText(saved.value, selection);
        if (range && text !== selectedSource) {
          setError("原文已变化，请重新选择后生成修改建议。");
          return false;
        }
        captured = {
          selection,
          text,
          range,
          unitVersion:
            selection.kind === "unit" && selection.tab !== "plan"
              ? saved.unitVersion
              : 0,
        };
        return true;
      },
    );
    if (!accepted || !captured) return false;
    const next = { ...captured, runId: editor.getSnapshot()!.run_id };
    retryTarget.current = next;
    setTarget(next);
    setError("");
    return true;
  };
  const run = async (
    action: WritingAction,
    extra: Partial<WritingCommand> = {},
  ) => {
    if (submitting.current) return false;
    submitting.current = true;
    setError("");
    try {
      if (action !== "propose_edit") {
        setTarget(null);
        clear();
        if (action === "generate_units") {
          const current = editor.getSnapshot();
          const units = current ? current.document.units : [];
          const next = units.find(
            (unit) =>
              !unit.has_body &&
              (!extra.unit_ids || extra.unit_ids.includes(unit.id)),
          );
          if (
            next &&
            !(await editor.openSelection({ kind: "unit", id: next.id }))
          )
            return false;
          following.current = true;
        }
        const accepted = await editor.action(action, extra);
        if (!accepted) following.current = false;
        return accepted;
      }
      const selection = editor.selection;
      if (!selection) return false;
      return await submitProposal(
        extra,
        selection,
        textSelection,
        writingTargetText(editor.draft.draft, selection),
      );
    } finally {
      submitting.current = false;
    }
  };
  const retry = async (
    extra: Partial<WritingCommand>,
    selection: WritingSelection,
  ) => {
    if (submitting.current) return false;
    const previous = retryTarget.current;
    const range =
      previous && previous.runId === editor.getSnapshot()?.run_id
        ? previous.range
        : null;
    if ((extra.selected_text || "") !== (range?.text || "")) {
      setError("原选区无法恢复，请重新选择原文后生成修改建议。");
      return false;
    }
    submitting.current = true;
    try {
      return await submitProposal(extra, selection, range, previous?.text);
    } finally {
      submitting.current = false;
    }
  };
  const currentPreview = editor.preview;
  const { openSelection, snapshot, loading } = editor;
  useEffect(() => {
    if (
      !following.current ||
      loading ||
      snapshot?.document.status !== "running" ||
      currentPreview?.run_id !== snapshot.run_id ||
      currentPreview?.fields.body === undefined ||
      !currentPreview.unit_id
    )
      return;
    if (
      editor.selection?.kind === "unit" &&
      editor.selection.id === currentPreview.unit_id
    )
      return;
    void openSelection({ kind: "unit", id: currentPreview.unit_id });
  }, [
    currentPreview?.run_id,
    currentPreview?.fields.body,
    currentPreview?.unit_id,
    editor.selection,
    loading,
    openSelection,
    snapshot?.run_id,
    snapshot?.document.status,
  ]);
  const apply = async () => {
    if (
      applying.current ||
      !ready ||
      !target ||
      !proposal ||
      editor.historical ||
      editor.busy ||
      editor.loading
    )
      return;
    const current = editor.getSnapshot();
    const sameSelection =
      JSON.stringify(editor.selection) === JSON.stringify(target.selection);
    const sameTarget =
      proposal.unit_id ===
        (target.selection.kind === "unit" ? target.selection.id : undefined) &&
      proposal.section_id ===
        (target.selection.kind === "unit" && target.selection.tab === "plan"
          ? "chapter_plan"
          : target.selection.kind === "entity"
            ? target.selection.section
            : target.selection.kind === "section"
              ? target.selection.id
              : undefined) &&
      proposal.entity_id ===
        (target.selection.kind === "entity"
          ? target.selection.id
          : undefined) &&
      proposal.inspiration_id === undefined &&
      (proposal.selected_text || "") === (target.range?.text || "");
    if (
      !sameSelection ||
      !sameTarget ||
      current?.work_version_id !== proposal.work_version_id ||
      current.work_revision !== proposal.work_revision ||
      current.work_asset_id !== proposal.work_asset_id ||
      writingTargetText(editor.draft.draft, editor.selection) !== target.text ||
      (target.selection.kind === "unit" &&
        target.selection.tab !== "plan" &&
        proposal.unit_version_id !== target.unitVersion)
    ) {
      setError("内容或版本已变化，请丢弃此建议后重新生成。");
      return;
    }
    applying.current = true;
    try {
      if (target.range) {
        if (
          !selectionActionsRef.current?.replaceSelection(
            target.range,
            proposal.replacement,
          )
        ) {
          setError("选区已变化，请重新选择后生成。");
          return;
        }
      } else
        editor.draft.setDraft(
          replaceTarget(
            editor.draft.draft,
            target.selection,
            proposal.replacement,
          ),
        );
      // 应用后的草稿先交给统一保存流程；保存失败仍保留草稿供重试。
      setTarget(null);
      clear();
      await editor.draft.flush();
    } finally {
      applying.current = false;
    }
  };
  return {
    textSelection,
    onTextSelectionChange: setTextSelection,
    selectionActionsRef,
    clearSelection: clear,
    discard,
    run,
    retry,
    apply,
    ready,
    pending: Boolean(target),
    preview: ready ? proposal!.replacement : preview,
    error,
  };
}
