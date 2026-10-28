import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { DetailDialogFrame } from "../shared/detail-dialog";
import { WritingEditorHeader } from "./writing-editor-header";
import { useWritingEditor } from "./use-writing-editor";
import { useWritingProposal } from "./use-writing-proposal";
import { useWritingVersions } from "./use-writing-versions";
import { WritingChapterRecovery } from "./writing-chapter-recovery";
import { WritingOutline } from "./writing-outline";
import { WritingPreferencesDialog } from "./writing-preferences-dialog";
import type { WritingPreferences } from "./writing-preferences";
import { WritingContent } from "./writing-content";
import { WritingEntryDialog } from "./writing-entry-dialog";
import { WritingControls } from "./writing-controls";
import { WritingFeedback } from "./writing-feedback";
import { WritingNavigation } from "./writing-navigation";
import { WritingRuns } from "./writing-runs";

import {
  canOpenWritingWorkspace,
  writingRetryCommand,
  writingProposalSelection,
  writingSelectionReason,
} from "./writing-workspace";
import { WritingDialog, WritingConfirmDialog } from "./writing-dialog";
import { useWritingChapterDirectory } from "./use-writing-chapter-directory";
import { writingChapterIndex } from "./writing-chapter-index";
import { useWritingChapterOrder } from "./use-writing-chapter-order";
import {
  isWritingOutlineSection,
  writingRecoverableChapterDraft,
  writingPreviewMatchesSnapshot,
  type WritingUnitEntry,
  type WritingDocument,
  writingProfile,
  writingSelectionTitle,
  type WritingSelection,
  type WritingOutlineSection,
} from "./writing-document";
import { projectWritingPreview } from "./writing-stream-projection";
import { writingStreamTarget } from "./writing-stream-target";
import { useWritingStreamScroll } from "./use-writing-stream-scroll";
import "./writing-editor.css";

export type WritingEditorProps = Parameters<typeof useWritingEditor>[0] & {
  onClose: () => void;
};

const emptyUnits: WritingUnitEntry[] = [];
type ScopeOrigin = {
  selection: WritingSelection;
  document: WritingDocument;
  top: number;
};

export function WritingEditor(props: WritingEditorProps) {
  const editor = useWritingEditor(props);
  const {
    snapshot,
    viewSnapshot,
    document,
    historical,
    generationTiming,
    selection,
    draft,
    loading,
    busy,
    error,
    conflicted,
    reload,
    action,
    stop,
    openSelection,
    addEntry,
  } = editor;
  const ai = useWritingProposal(editor);
  const versions = useWritingVersions(
    props.projectId,
    snapshot?.work_asset_id || 0,
    snapshot?.work_version_id || 0,
  );
  const [scopeOrigin, setScopeOrigin] = useState<ScopeOrigin | null>(null);
  const restoringOrigin = useRef<number | null>(null);
  const [editingSection, setEditingSection] = useState<WritingOutlineSection | null>(null);
  const [recoveringChapters, setRecoveringChapters] = useState(false);
  const [showRuns, setShowRuns] = useState(false);
  const [adding, setAdding] = useState<WritingSelection | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const closing = useRef(false);
  const openingScope = useRef(false);
  const deleting = useRef(false);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const profile = writingProfile;
  const running =
    snapshot?.document.status === "running" || Boolean(props.running);
  const saving = draft.status === "saving";
  const mutationDisabled = Boolean(
    props.readonly || historical || running || busy || loading,
  );
  const editorModalOpen = Boolean(
    showRuns || adding || deletingEntry || showPreferences || recoveringChapters,
  );
  const planEditing = selection?.kind === "unit" && selection.tab === "plan";
  const scopedEditing = selection?.kind === "entity" || planEditing || Boolean(editingSection);
  const modalOpen = editorModalOpen || confirmationOpen || scopedEditing;
  const { cancelBodyFollow } = editor;
  useLayoutEffect(() => {
    if (modalOpen) cancelBodyFollow();
  }, [modalOpen, cancelBodyFollow]);
  const readonly = mutationDisabled || editorModalOpen;
  const savedDocument = viewSnapshot?.document;
  const chapterDraft = !historical ? writingRecoverableChapterDraft(snapshot) : undefined;
  const orderReason =
    readonly || conflicted || modalOpen
      ? "当前状态不能调整章节顺序"
      : ai.pending
        ? "请先应用或丢弃修改建议"
        : draft.hasPendingChanges || saving
          ? "请先保存当前修改"
          : "";
  const chapterOrder = useWritingChapterOrder({
    disabled: Boolean(orderReason),
    reason: orderReason,
    getDocument: () => editor.getSnapshot()?.document,
    flush: draft.flush,
    onSave: (next) => action("save_document", { document: next }),
  });
  const navigationDisabled =
    modalOpen ||
    busy ||
    loading ||
    saving ||
    ai.pending ||
    chapterOrder.pending;
  const readingSelection = scopeOrigin?.selection || selection;
  const showChapters =
    readingSelection?.kind === "unit" ||
    (readingSelection?.kind === "section" && readingSelection.id === "chapters");
  const selectedUnit =
    selection?.kind === "unit" && document
      ? writingChapterIndex(document.units).byId.get(selection.id)?.unit
      : undefined;
  const entityEditing = selection?.kind === "entity";
  const deleteUnit =
    document && deletingEntry
      ? document.units.find((unit) => unit.id === deletingEntry)
      : undefined;
  const { flush } = draft;
  const { onClose } = props;
  const close = useCallback(async () => {
    if (modalOpen || busy || loading || chapterOrder.pending || closing.current)
      return;
    closing.current = true;
    try {
      if (await flush()) onClose();
    } finally {
      closing.current = false;
    }
  }, [modalOpen, busy, loading, chapterOrder.pending, flush, onClose]);
  useEffect(() => {
    if (!draft.hasPendingChanges && !adding) return;
    const preventLoss = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", preventLoss);
    return () => window.removeEventListener("beforeunload", preventLoss);
  }, [adding, draft.hasPendingChanges]);
  const openScopedSelection = async (next: WritingSelection) => {
    if (openingScope.current) return false;
    openingScope.current = true;
    try {
      // openSelection 内的异步读取可能先提交新 selection，先固定背景以保留原 AI 输入。
      const origin = captureOrigin();
      if (origin) setScopeOrigin(origin);
      const accepted = await openSelection(next);
      if (!accepted) setScopeOrigin(null);
      return accepted;
    } finally {
      openingScope.current = false;
    }
  };
  const select = async (next: WritingSelection) => {
    if (
      navigationDisabled ||
      !savedDocument ||
      writingSelectionReason(savedDocument, next)
    )
      return;
    const scoped = next.kind === "entity" || (next.kind === "unit" && next.tab === "plan");
    if (await (scoped ? openScopedSelection(next) : openSelection(next)))
      ai.discard();
  };
  const selectVersion = async (id: number) => {
    if (navigationDisabled) return;
    if (await editor.selectVersion(id)) ai.discard();
  };
  const beginAdd = async (next: WritingSelection) => {
    if (!readonly && !navigationDisabled && (await draft.flush())) {
      ai.discard();
      setAdding(next);
    }
  };
  const deleteChapter = async () => {
    if (
      !deletingEntry ||
      mutationDisabled ||
      conflicted ||
      ai.pending ||
      deleting.current
    )
      return;
    deleting.current = true;
    setDeletePending(true);
    setDeleteError("");
    try {
      if (!(await draft.flush())) return;
      const saved = editor.getSnapshot()?.document;
      if (!saved || !saved.units.some((unit) => unit.id === deletingEntry))
        return;
      if (
        await action("save_document", {
          document: {
            ...saved,
            units: saved.units.filter((unit) => unit.id !== deletingEntry),
          },
        })
      ) {
        setDeletingEntry(null);
        ai.discard();
        await openSelection({ kind: "section", id: "chapters" });
      } else setDeleteError("删除未成功，章节和原内容已保留，请重试。");
    } finally {
      deleting.current = false;
      setDeletePending(false);
    }
  };
  const closeEntity = async () => {
    if (busy || loading || ai.pending || !(await draft.flush())) return;
    const origin = scopeOrigin;
    if (await openSelection(origin?.selection || { kind: "section", id: "overview" })) {
      restoringOrigin.current = origin?.top ?? null;
      setScopeOrigin(null);
      setEditingSection(null);
      ai.discard();
    }
  };
  const deleteEntity = async () => {
    if (!document || selection?.kind !== "entity" || readonly || ai.pending)
      return;
    if (!(await draft.flush())) return;
    const current = editor.getSnapshot()?.document;
    if (!current) return;
    const outline = {
      ...current.outline,
      [selection.section]: current.outline[selection.section].filter(
        (entity) => entity.id !== selection.id,
      ),
    };
    if (await action("save_document", { document: { ...current, outline } })) {
      ai.discard();
      if (await openSelection(scopeOrigin?.selection || { kind: "section", id: "overview" }, false)) {
        restoringOrigin.current = scopeOrigin?.top ?? null;
        setScopeOrigin(null);
      }
    }
  };
  const savePreferences = async (preferences: WritingPreferences) => {
    if (mutationDisabled || conflicted || ai.pending || !(await draft.flush()))
      return false;
    const current = editor.getSnapshot()?.document;
    if (!current) return false;
    if (JSON.stringify(current.preferences) === JSON.stringify(preferences))
      return true;
    return action("save_document", { document: { ...current, preferences } });
  };
  const activePreview =
    writingPreviewMatchesSnapshot(editor.preview, snapshot) &&
    running
      ? editor.preview
      : null;
  const visiblePreview =
    !historical &&
    !loading &&
    !editorModalOpen &&
    activePreview?.work_asset_id === snapshot?.work_asset_id
      ? activePreview
      : null;
  const displayedDocument = useMemo(() => {
    if (!document || !running || ai.pending || !visiblePreview) return document;
    // 正文/提案前缀独立展示，不为每个字克隆整本目录。
    const documentFields = Object.keys(visiblePreview.fields).some(
      (field) =>
        /^(preferences|inspirations|units|outline|entities)[.[]/.test(
          field,
        ) ||
        (field === "plan" && visiblePreview.section_id === "chapter_plan") ||
        (field === "content" &&
          Boolean(
            visiblePreview.section_id &&
            isWritingOutlineSection(visiblePreview.section_id),
          )),
    );
    return documentFields
      ? projectWritingPreview(
          document,
          visiblePreview,
          snapshot?.checkpoint?.action,
          snapshot?.checkpoint?.unit_ids,
        )
      : document;
  }, [
    document,
    running,
    ai.pending,
    visiblePreview,
    snapshot?.checkpoint?.action,
    snapshot?.checkpoint?.unit_ids,
  ]);
  const chapters = useWritingChapterDirectory(
    displayedDocument?.units || emptyUnits,
    selection,
  );
  const runAI = ai.run;
  const streamedBody =
    visiblePreview?.fields.body !== undefined &&
    selectedUnit?.id === visiblePreview.unit_id &&
    !draft.draft.unit?.body
      ? visiblePreview.fields.body
      : "";
  const streamScope = `${snapshot?.work_asset_id}:${snapshot?.run_id}:${snapshot?.request_id}`;
  const contentStreamTarget =
    savedDocument &&
    selection &&
    !scopedEditing &&
    !ai.pending &&
    !(selection.kind === "unit" && selection.tab !== "plan" && !streamedBody)
      ? writingStreamTarget(
          savedDocument,
          selection,
          visiblePreview,
          snapshot?.checkpoint,
        )
      : null;
  const contentScroll = useWritingStreamScroll({
    scope: streamScope,
    target: contentStreamTarget,
    revision: visiblePreview?.fields || snapshot?.checkpoint,
    enabled: running && !historical && !loading && !modalOpen && !ai.pending,
    forceFollow: Boolean(running && snapshot?.checkpoint?.action === "generate_outline" && !showChapters && !scopedEditing),
  });
  const captureOrigin = (): ScopeOrigin | null => selection && document
    ? { selection, document, top: contentScroll.viewportRef.current?.scrollTop || 0 }
    : null;
  const proposalScroll = useWritingStreamScroll({
    scope: streamScope,
    target:
      visiblePreview &&
      ai.pending &&
      visiblePreview.fields.replacement !== undefined &&
      ai.preview === visiblePreview.fields.replacement
        ? "proposal"
        : null,
    revision: ai.preview,
  });
  useLayoutEffect(() => {
    if (scopedEditing || restoringOrigin.current === null) return;
    const viewport = contentScroll.viewportRef.current;
    if (viewport) viewport.scrollTop = restoringOrigin.current;
    restoringOrigin.current = null;
  }, [scopedEditing, scopeOrigin, selection, contentScroll.viewportRef]);
  const feedback = (
    <WritingFeedback
      inline
      snapshot={snapshot}
      preview={visiblePreview}
      generationTiming={generationTiming}
      running={running}
      busy={busy || saving || loading || chapterOrder.pending}
      readonly={Boolean(props.readonly || historical)}
      error={error || ai.error || (!document ? props.node.runError : "") || ""}
      conflicted={conflicted}
      reloadDisabled={Boolean(
        modalOpen || busy || loading || saving || draft.hasPendingChanges,
      )}
      onReload={reload}
      onRetry={async () => {
        const command = writingRetryCommand(editor.getSnapshot());
        if (!command) return;
        if (command.action === "propose_edit") {
          const target = writingProposalSelection(command.extra);
          if (await openSelection(target))
            await ai.retry(command.extra, target);
        } else await runAI(command.action, command.extra);
      }}
      onStop={stop}
    />
  );
  // 背景保留原阅读目标及本地输入；仅弹窗控制器拥有活动提案和动作。
  const renderControls = (controlSelection: WritingSelection | undefined, active: boolean) => controlSelection && document && savedDocument && (
    <WritingControls
      key={`${controlSelection.kind}:${controlSelection.id}:${controlSelection.kind === "unit" ? controlSelection.tab || "body" : ""}`}
      document={active ? document : scopeOrigin?.document || document}
      savedDocument={savedDocument}
      directory={chapters}
      activeBatchIds={
        snapshot?.checkpoint?.action === "generate_units"
          ? snapshot.checkpoint.unit_ids
          : undefined
      }
      onConfirmationChange={setConfirmationOpen}
      selection={controlSelection}
      disabled={!active || readonly || conflicted || chapterOrder.pending}
      body={draft.draft.unit?.body}
      selectedCharacters={active ? ai.textSelection?.text.length || 0 : 0}
      onClearSelection={ai.clearSelection}
      onAction={runAI}
      proposalPending={active && ai.pending}
      proposalReady={active && ai.ready}
      proposalPreview={active ? ai.preview : ""}
      running={running}
      onApply={() => void ai.apply()}
      onDiscard={ai.discard}
    />
  );
  const renderDetail = (contentSelection: WritingSelection | undefined, active: boolean) => contentSelection && displayedDocument && savedDocument && (
    <WritingContent
      key={`${contentSelection.kind}:${contentSelection.id}:${contentSelection.kind === "unit" ? contentSelection.tab || "body" : ""}:${historical ? viewSnapshot?.work_version_id : "current"}`}
      document={active ? displayedDocument : scopeOrigin?.document || displayedDocument}
      recoverableDraft={!historical && !running && contentSelection.kind === "unit" && snapshot?.checkpoint?.draft?.unit_id === contentSelection.id ? snapshot.checkpoint.draft.body : undefined}
      savedDocument={savedDocument}
      selection={contentSelection}
      value={
        streamedBody && draft.draft.unit
          ? {
              ...draft.draft,
              unit: { ...draft.draft.unit, body: streamedBody },
            }
          : draft.draft
      }
      readonly={readonly || chapterOrder.pending || !active}
      onChange={draft.setDraft}
      onSelect={(next) => void select(next)}
      chapterOrder={chapterOrder}
      directory={chapters}
      navigationDisabled={navigationDisabled}
      onDeleteChapter={(id) => {
        if (!orderReason && !chapterOrder.pending) {
          setDeleteError("");
          setDeletingEntry(id);
        }
      }}
      scoped={active && scopedEditing}
      onTextSelectionChange={active ? ai.onTextSelectionChange : undefined}
      selectionActionsRef={active ? ai.selectionActionsRef : undefined}
    />
  );
  const detailContent = renderDetail(selection, true);
  const readingContent = renderDetail(readingSelection, !scopedEditing);
  const content = (
    <>
      <section
        className="writing-editor nodrag nopan nowheel is-detail"
        aria-label={`${profile.title}编辑器`}
      >
        {historical && (
          <div className="writing-history-bar">
            <span>正在查看历史版本，内容只读。</span>
            <button
              disabled={busy || loading}
              onClick={() => void selectVersion(snapshot!.work_version_id)}
            >
              返回当前版本
            </button>
            <button
              disabled={props.readonly || running || busy || loading}
              onClick={async () => {
                if (
                  await action("restore_document", {
                    source_work_version_id: viewSnapshot!.work_version_id,
                  })
                )
                  ai.discard();
              }}
            >
              恢复此版本
            </button>
            {error && <span role="alert">{error}</span>}
          </div>
        )}
        {!document ||
        !savedDocument ||
        !canOpenWritingWorkspace(savedDocument) ? (
          <div className="writing-empty">
            请先在画布选用一个灵感，再进入创作工作区。
          </div>
        ) : (
          <>
            <div className="writing-layout">
              <WritingNavigation
                document={savedDocument}
                selection={readingSelection}
                disabled={navigationDisabled}
                mutationDisabled={
                  readonly || entityEditing || chapterOrder.pending
                }
                onSelect={(next) => void select(next)}
                onAdd={(next) => void beginAdd(next)}
                chapterOrder={chapterOrder}
                directory={chapters}
              />
              <div className="writing-workspace-content">
                <div className="writing-chapter-layout">
                  {showChapters ? (
                    <main className="writing-main">
                      <div
                        className="writing-content-scroll"
                        ref={contentScroll.viewportRef}
                      >
                        <div
                          className="writing-page"
                          ref={contentScroll.contentRef}
                        >
                          {readingContent}
                        </div>
                      </div>
                    </main>
                  ) : (
                    <main className="writing-main">
                      <div className="writing-content-scroll" ref={contentScroll.viewportRef}>
                        <div ref={contentScroll.contentRef}>
                          <WritingOutline
                            document={scopeOrigin?.document || displayedDocument!}
                            readonly={readonly || conflicted || chapterOrder.pending || Boolean(ai.pending)}
                            navigationDisabled={navigationDisabled}
                            onSelect={(next) => void select(next)}
                            onAdd={(next) => void beginAdd(next)}
                            onPreferences={() => setShowPreferences(true)}
                            onEditSection={async (id) => {
                              if (await openScopedSelection({ kind: "section", id })) {
                                ai.discard();
                                setEditingSection(id);
                              }
                            }}
                            chapterOrder={chapterOrder}
                            chapterRecovery={
                              chapterDraft && snapshot && (
                                <WritingChapterRecovery
                                  key={`${chapterDraft.run_id}:${chapterDraft.request_id}`}
                                  draft={chapterDraft}
                                  snapshot={snapshot}
                                  disabled={
                                    mutationDisabled || conflicted ||
                                    Boolean(ai.pending) || chapterOrder.pending
                                  }
                                  open={recoveringChapters}
                                  onOpen={() => setRecoveringChapters(true)}
                                  onClose={() => setRecoveringChapters(false)}
                                  onSave={async (units) => {
                                    let failure: unknown;
                                    const accepted = await action(
                                      "apply_chapter_draft",
                                      {
                                        units,
                                        source_run_id: chapterDraft.run_id,
                                        source_request_id: chapterDraft.request_id,
                                      },
                                      undefined,
                                      (cause) => { failure = cause; },
                                    );
                                    if (!accepted) {
                                      throw failure || new Error("保存未成功，草稿已保留");
                                    }
                                    setRecoveringChapters(false);
                                  }}
                                />
                              )
                            }
                            activeUnitId={running ? snapshot?.checkpoint?.unit_id : undefined}
                            streamTarget={contentStreamTarget}
                            generatingBackground={Boolean(
                              running && !historical && !scopedEditing &&
                              snapshot?.checkpoint?.action === "generate_outline" &&
                              snapshot.checkpoint.phase === "background"
                            )}
                            following={contentScroll.following}
                            onReadPage={contentScroll.pauseFollowing}
                          />
                        </div>
                      </div>
                    </main>
                  )}
                  <aside
                      className="writing-ai-rail"
                      aria-label="创作助手"
                      ref={!scopedEditing ? proposalScroll.viewportRef : undefined}
                      inert={scopedEditing}
                      aria-hidden={scopedEditing || undefined}
                    >
                      <div ref={!scopedEditing ? proposalScroll.contentRef : undefined}>{renderControls(readingSelection, !scopedEditing)}</div>
                    </aside>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
      {showPreferences && document && (
        <WritingPreferencesDialog
          preferences={document.preferences}
          disabled={
            mutationDisabled || conflicted || ai.pending || chapterOrder.pending
          }
          onSave={savePreferences}
          onClose={() => setShowPreferences(false)}
        />
      )}
      {scopedEditing && selection && document && (
        <WritingDialog
          title={planEditing ? "修改本章剧情" : writingSelectionTitle(document, selection)}
          titleStatus={!historical ? feedback : undefined}
          className="writing-outline-entity-dialog"
          closeDisabled={busy || loading || saving || ai.pending}
          onClose={closeEntity}
        >
          <div className="writing-entity-dialog-layout">
            <div className="writing-dialog-scroll">
              {detailContent}
            </div>
            <aside
              className="writing-ai-rail"
              aria-label="创作助手"
              ref={proposalScroll.viewportRef}
            >
              <div ref={proposalScroll.contentRef}>{renderControls(selection, true)}</div>
            </aside>
          </div>
          <footer className="writing-actions writing-entity-dialog-actions">
            {entityEditing && <button className="is-danger" disabled={readonly || ai.pending} onClick={() => void deleteEntity()}><Trash2 size={14} />删除</button>}
            <button
              className="is-primary"
              disabled={busy || loading || saving || ai.pending}
              onClick={() => void closeEntity()}
            >
              {props.readonly || historical ? "返回大纲" : "保存并返回"}
            </button>
          </footer>
        </WritingDialog>
      )}
      {showRuns && snapshot && (
        <WritingRuns
          projectId={props.projectId}
          canvasId={props.canvasId}
          workAssetId={snapshot.work_asset_id}
          activeRunId={snapshot.run_id}
          busy={busy}
          readonly={Boolean(props.readonly || historical)}
          commandError={error}
          onStop={stop}
          onClose={() => setShowRuns(false)}
        />
      )}
      {adding && document && (
        <WritingEntryDialog
          document={document}
          selection={adding}
          disabled={mutationDisabled}
          closeDisabled={busy || saving}
          onClose={() => setAdding(null)}
          onSave={async (fields) => {
            const origin = captureOrigin();
            const scoped = adding.kind === "section" && adding.id !== "chapters";
            if (scoped && origin) setScopeOrigin(origin);
            const accepted = await addEntry(adding, fields);
            if (accepted) setAdding(null);
            else if (scoped) setScopeOrigin(null);
            return accepted;
          }}
        />
      )}
      {deleteUnit && (
        <WritingConfirmDialog
          title="删除章节"
          description={`删除「${deleteUnit.title}」及当前正文？历史版本仍可查看。`}
          confirmLabel="确认删除"
          pending={deletePending}
          disabled={mutationDisabled || conflicted || ai.pending}
          error={deleteError}
          onClose={() => {
            if (!deleting.current) setDeletingEntry(null);
          }}
          onConfirm={deleteChapter}
        />
      )}
    </>
  );
  return (
    <DetailDialogFrame
      ariaLabel={`${props.node.title || "节点"}详情`}
      onRequestClose={close}
      header={
        <WritingEditorHeader
          editor={editor}
          titleStatus={!historical && !scopedEditing ? feedback : undefined}
          versions={versions}
          node={props.node}
          navigationDisabled={navigationDisabled}
          mutationDisabled={readonly || entityEditing || chapterOrder.pending}
          previewReadonly={Boolean(props.readonly || historical)}
          onClose={() => void close()}
          onRuns={() => setShowRuns(true)}
          onSelectVersion={selectVersion}
        />
      }
    >
      {content}
    </DetailDialogFrame>
  );
}
