import { useCallback, useEffect, useRef, useState } from "react";
import { useContentDraft } from "../shared/use-content-draft";
import { fetchSpaceAssetVersionDetail } from "../space/space-api";
import type { ProjectAsset, SpaceCanvasNode } from "../space/types";
import {
  submitWritingCommand,
  type WritingAction,
  type WritingCommand,
} from "./writing-api";
import {
  parseWritingDocument,
  parseWritingUnit,
  addWritingEntry,
  writingEntitySection,
  writingSelectionExists,
  defaultWritingSelection,
  writingVersionRevision,
  type WritingDocument,
  type WritingSelection,
  type WritingSnapshot,
  type WritingUnit,
} from "./writing-document";
import {
  writingSelectionReason,
  writingActionReason,
} from "./writing-workspace";
import {
  createWritingUnitCache,
  writingDocumentFingerprint,
  writingDraftFingerprint,
  rememberWritingIdentities,
  resolveWritingIdentities,
} from "./writing-draft-state";
import { writingChapterIndex } from "./writing-chapter-index";
import { useWritingSnapshot } from "./use-writing-snapshot";

export type WritingNewEntry = {
  title: string;
  description: string;
};

export type WritingDraft = {
  document: WritingDocument | null;
  unit: WritingUnit | null;
};
type Baseline = {
  selection: WritingSelection;
  workVersion: number;
  workRevision: number;
  unitVersion: number;
  value: WritingDraft;
};
const emptyDraft: WritingDraft = { document: null, unit: null };

export function useWritingEditor({
  projectId,
  canvasId,
  node,
  output,
  onAssetUpdated,
  readonly = false,
  running = false,
}: {
  projectId: number;
  canvasId: number;
  node: SpaceCanvasNode;
  output?: unknown;
  onAssetUpdated?: (asset: ProjectAsset) => void;
  readonly?: boolean;
  running?: boolean;
}) {
  const {
    snapshot,
    snapshotRef,
    mounted,
    acceptSnapshot,
    loadWork,
    command,
    stopRun,
    reportError,
    setError,
    error,
    generationTiming,
    preview,
    clearPreview,
    clearGenerationError,
  } = useWritingSnapshot({ projectId, canvasId, node, output, onAssetUpdated });
  const [historical, setHistorical] = useState<WritingSnapshot | null>(null);
  const historicalRef = useRef(historical);
  const viewSnapshot = historical || snapshot;
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const baselineRef = useRef(baseline);
  const [generation, setGeneration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const commandBusy = useRef(false);
  const accessRef = useRef({ readonly, running });
  accessRef.current = { readonly, running };
  const readSequence = useRef(0);
  const unitCache = useRef(createWritingUnitCache());
  const documentIdentities = useRef({
    workAssetId: 0,
    ids: new Map<string, string>(),
  });
  const automaticRead = useRef<{ version: number; revision: number } | null>(
    null,
  );
  useEffect(
    () => () => {
      readSequence.current += 1;
      // effect 重放会作废首轮读取，新的生命周期仍须允许自动初始化。
      automaticRead.current = null;
    },
    [],
  );

  const assertWritable = useCallback(() => {
    if (accessRef.current.readonly || historicalRef.current)
      throw new Error("当前作品只读，未保存内容已保留");
    if (
      accessRef.current.running ||
      snapshotRef.current?.document.status === "running"
    )
      throw new Error("生成期间暂不可修改作品，请先停止生成");
  }, []);
  const saveDraft = useCallback(
    async (value: WritingDraft) => {
      const base = baselineRef.current;
      if (!base) throw new Error("请等待内容加载完成");
      let workVersion = base.workVersion;
      let workRevision = base.workRevision;
      let unitVersion = base.unitVersion;
      const acceptSaved = (result: WritingSnapshot, saved: WritingDraft) => {
        acceptSnapshot(result);
        workVersion = result.work_version_id;
        workRevision = result.work_revision;
        unitVersion = value.unit
          ? result.document.units.find(
              (entry) => entry.id === value.unit!.unit_id,
            )?.version_id || 0
          : 0;
        // 每一步成功都推进基线，后续失败时仅重试尚未保存的内容。
        baselineRef.current = {
          ...base,
          selection: baselineRef.current?.selection || base.selection,
          workVersion,
          workRevision,
          unitVersion,
          value: saved,
        };
      };
      if (
        value.document &&
        writingDocumentFingerprint(value.document) !==
          writingDocumentFingerprint(base.value.document)
      ) {
        assertWritable();
        const workAssetId = snapshotRef.current!.work_asset_id;
        if (documentIdentities.current.workAssetId !== workAssetId)
          documentIdentities.current = { workAssetId, ids: new Map() };
        const identitySession = documentIdentities.current;
        const submitted = resolveWritingIdentities(
          value.document,
          identitySession.ids,
        );
        const result = await submitWritingCommand(
          command(
            "save_document",
            { document: submitted, expected_work_revision: workRevision },
            workVersion,
          ),
        );
        rememberWritingIdentities(
          submitted,
          result.document,
          identitySession.ids,
        );
        acceptSaved(result, { ...base.value, document: value.document });
      }
      if (value.unit && value.unit.body !== base.value.unit?.body) {
        assertWritable();
        const result = await submitWritingCommand(
          command(
            "save_unit",
            {
              unit_id: value.unit.unit_id,
              expected_unit_version_id: unitVersion,
              expected_work_revision: workRevision,
              body: value.unit.body,
            },
            workVersion,
          ),
        );
        acceptSaved(result, value);
        const savedUnit = result.document.units.find(
          (entry) => entry.id === value.unit!.unit_id,
        );
        if (savedUnit?.version_id)
          unitCache.current.delete(savedUnit.version_id);
      }
      setError("");
    },
    [acceptSnapshot, assertWritable, command, snapshotRef],
  );
  const draft = useContentDraft({
    value: baseline?.value || emptyDraft,
    resetKey: `${node.id}:${generation}`,
    fingerprint: writingDraftFingerprint,
    save: saveDraft,
    onError: reportError,
    autoSave: Boolean(
      baseline &&
      !historical &&
      !readonly &&
      !running &&
      snapshot?.document.status !== "running" &&
      !busy &&
      !loading,
    ),
    debounceMs: 1200,
  });
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const readSelection = useCallback(
    async (
      current: WritingSnapshot,
      selection: WritingSelection,
    ): Promise<Baseline> => {
      let unit: WritingUnit | null = null;
      let unitVersion = 0;
      if (selection.kind === "unit") {
        const entry = writingChapterIndex(current.document.units).byId.get(
          selection.id,
        )?.unit;
        if (!entry) throw new Error("该章节已移出目录，请重新选择");
        unitVersion = entry.version_id;
        if (entry.asset_id && entry.version_id) {
          unit = unitCache.current.get(entry.version_id) || null;
          if (!unit) {
            const version = await fetchSpaceAssetVersionDetail({
              projectId,
              assetId: entry.asset_id,
              versionId: entry.version_id,
              reportError: false,
            });
            unit = parseWritingUnit(version.content);
            if (
              !unit ||
              unit.unit_id !== entry.id ||
              unit.profile !== current.document.type
            )
              throw new Error("章节内容与目录不一致");
            unitCache.current.set(entry.version_id, unit);
          }
        } else {
          unit = {
            type: "writing_unit",
            schema_version: 1,
            profile: current.document.type,
            unit_id: entry.id,
            title: entry.title,
            body: "",
            synopsis: "",
            end_state: "",
            open_threads: "",
            ending: "",
            continuity_valid: false,
            predecessor_version_id: 0,
          };
        }
      }
      return {
        selection,
        workVersion: current.work_version_id,
        workRevision: current.work_revision,
        unitVersion,
        value: { document: current.document, unit },
      };
    },
    [projectId],
  );
  const commitSelection = useCallback(
    (next: Baseline) => {
      baselineRef.current = next;
      setBaseline(next);
      setGeneration((previous) => previous + 1);
      setError("");
    },
    [setError],
  );
  const openSelection = useCallback(
    async (selection: WritingSelection, flush = true) => {
      if (flush && (commandBusy.current || !(await draftRef.current.flush())))
        return false;
      const current = historicalRef.current || snapshotRef.current;
      if (!current || writingSelectionReason(current.document, selection))
        return false;
      const request = ++readSequence.current;
      setLoading(true);
      try {
        const next = await readSelection(current, selection);
        if (!mounted.current || request !== readSequence.current) return false;
        commitSelection(next);
        return true;
      } catch (cause) {
        if (mounted.current && request === readSequence.current)
          reportError(cause);
        return false;
      } finally {
        if (mounted.current && request === readSequence.current)
          setLoading(false);
      }
    },
    [commitSelection, mounted, readSelection, reportError, snapshotRef],
  );
  useEffect(() => {
    if (
      historical ||
      !snapshot ||
      loading ||
      draft.hasPendingChanges ||
      commandBusy.current
    )
      return;
    if (
      baseline &&
      baseline.workVersion === snapshot.work_version_id &&
      baseline.workRevision === snapshot.work_revision
    )
      return;
    if (
      automaticRead.current?.version === snapshot.work_version_id &&
      automaticRead.current.revision === snapshot.work_revision
    )
      return;
    // 同一权威修订只自动读取一次，失败后留给手动重试或后续修订恢复。
    automaticRead.current = {
      version: snapshot.work_version_id,
      revision: snapshot.work_revision,
    };
    const selection =
      baseline?.selection || defaultWritingSelection(snapshot.document);
    const available =
      writingSelectionExists(snapshot.document, selection) &&
      !writingSelectionReason(snapshot.document, selection);
    void openSelection(
      available ? selection : defaultWritingSelection(snapshot.document),
      false,
    );
  }, [
    baseline,
    historical,
    draft.hasPendingChanges,
    loading,
    openSelection,
    snapshot,
    busy,
  ]);
  const action = useCallback(
    async (
      actionName: WritingAction,
      extra: Partial<WritingCommand> = {},
      captureProposal?: (saved: Baseline) => boolean,
    ) => {
      if (commandBusy.current || accessRef.current.readonly) return false;
      commandBusy.current = true;
      setBusy(true);
      try {
        if (!(await draftRef.current.flush())) return false;
        if (actionName === "restore_document") {
          if (
            accessRef.current.readonly ||
            accessRef.current.running ||
            snapshotRef.current?.document.status === "running"
          )
            throw new Error("当前不可恢复版本");
        } else assertWritable();
        const reason = writingActionReason(
          snapshotRef.current!.document,
          actionName,
          extra,
        );
        if (reason) throw new Error(reason);
        // 与实际提交共用一次 flush；正文、选区和 pin 必须捕获同一个已保存基线。
        if (
          actionName === "propose_edit" &&
          captureProposal &&
          (!baselineRef.current || !captureProposal(baselineRef.current))
        )
          return false;
        clearPreview();
        clearGenerationError();
        const entry = extra.unit_id
          ? snapshotRef.current!.document.units.find(
              (unit) => unit.id === extra.unit_id,
            )
          : undefined;
        const result = await submitWritingCommand(
          command(actionName, {
            ...(entry && extra.section_id !== "chapter_plan"
              ? { expected_unit_version_id: entry.version_id }
              : {}),
            ...extra,
          }),
        );
        acceptSnapshot(result);
        if (actionName === "restore_document") {
          historicalRef.current = null;
          setHistorical(null);
        }
        setError("");
        return true;
      } catch (cause) {
        reportError(cause);
        return false;
      } finally {
        commandBusy.current = false;
        if (mounted.current) setBusy(false);
      }
    },
    [
      acceptSnapshot,
      assertWritable,
      clearGenerationError,
      clearPreview,
      command,
      reportError,
    ],
  );
  const stop = useCallback(async () => {
    const current = snapshotRef.current;
    if (
      !current?.run_id ||
      current.document.status !== "running" ||
      commandBusy.current ||
      accessRef.current.readonly
    )
      return;
    commandBusy.current = true;
    setBusy(true);
    try {
      await stopRun();
      setError("");
    } catch (cause) {
      reportError(cause);
    } finally {
      commandBusy.current = false;
      if (mounted.current) setBusy(false);
    }
  }, [stopRun, reportError]);
  const reload = useCallback(async () => {
    if (commandBusy.current || draftRef.current.status === "saving") return;
    commandBusy.current = true;
    setBusy(true);
    try {
      await loadWork();
      const selection = baselineRef.current?.selection;
      const exists =
        selection &&
        snapshotRef.current &&
        writingSelectionExists(snapshotRef.current.document, selection);
      await openSelection(
        exists && selection
          ? selection
          : defaultWritingSelection(snapshotRef.current!.document),
        false,
      );
    } catch (cause) {
      reportError(cause);
    } finally {
      commandBusy.current = false;
      if (mounted.current) setBusy(false);
    }
  }, [loadWork, openSelection, reportError]);
  const selectVersion = useCallback(
    async (versionId: number) => {
      if (commandBusy.current) return false;
      commandBusy.current = true;
      setBusy(true);
      let request = 0;
      try {
        if (!(await draftRef.current.flush())) return false;
        const current = snapshotRef.current;
        if (!current || !mounted.current) return false;
        request = ++readSequence.current;
        setLoading(true);
        let next: WritingSnapshot | null = null;
        if (versionId !== current.work_version_id) {
          const version = await fetchSpaceAssetVersionDetail({
            projectId,
            assetId: current.work_asset_id,
            versionId,
            reportError: false,
          });
          if (!mounted.current || request !== readSequence.current)
            return false;
          const document = parseWritingDocument(version.content);
          if (!document || document.type !== current.document.type)
            throw new Error("历史版本与当前作品不一致");
          next = {
            ...current,
            document,
            work_version_id: version.id,
            work_revision: writingVersionRevision(version),
            work_version: version.version,
            work_updated_at: version.updated_at || version.created_at,
            proposal: undefined,
          };
        }
        const target = next || current;
        const selection =
          baselineRef.current?.selection ||
          defaultWritingSelection(target.document);
        const available =
          writingSelectionExists(target.document, selection) &&
          !writingSelectionReason(target.document, selection);
        const loaded = await readSelection(
          target,
          available ? selection : defaultWritingSelection(target.document),
        );
        if (!mounted.current || request !== readSequence.current) return false;
        // 版本身份与正文全部就绪后一起提交，读取失败时保留原视图和草稿。
        historicalRef.current = next;
        setHistorical(next);
        commitSelection(loaded);
        return true;
      } catch (cause) {
        if (mounted.current && (!request || request === readSequence.current))
          reportError(cause);
        return false;
      } finally {
        commandBusy.current = false;
        if (mounted.current) {
          if (request && request === readSequence.current) setLoading(false);
          setBusy(false);
        }
      }
    },
    [
      commitSelection,
      mounted,
      projectId,
      readSelection,
      reportError,
      snapshotRef,
    ],
  );
  const addEntry = useCallback(
    async (selection: WritingSelection, fields: WritingNewEntry) => {
      if (commandBusy.current) return false;
      const document = draftRef.current.draft.document;
      if (!document) return false;
      const entitySection = writingEntitySection(selection);
      const next = addWritingEntry(document, selection, fields);
      if (!(await action("save_document", { document: next }))) return false;
      const saved = snapshotRef.current!.document;
      if (entitySection) {
        const entities = saved.outline[entitySection];
        const entity = entities[entities.length - 1];
        if (entity)
          await openSelection(
            { kind: "entity", section: entitySection, id: entity.id },
            false,
          );
      } else {
        const units = saved.units;
        const unit = units?.[units.length - 1];
        if (unit)
          await openSelection(
            { kind: "unit", id: unit.id, tab: "body" },
            false,
          );
      }
      return true;
    },
    [action, openSelection],
  );
  // 已提交的章节进度立即展示；历史与未保存草稿仍保留各自的内容。
  const document =
    !historical &&
    snapshot?.document.status === "running" &&
    !draft.hasPendingChanges
      ? snapshot.document
      : draft.draft.document || viewSnapshot?.document;
  return {
    snapshot,
    viewSnapshot,
    document,
    historical: Boolean(historical),
    selectVersion,
    preview,
    getSnapshot: () => snapshotRef.current,
    generationTiming,
    selection: baseline?.selection,
    draft,
    loading,
    busy,
    error,
    conflicted: Boolean(
      draft.hasPendingChanges &&
      !busy &&
      draft.status !== "saving" &&
      baseline &&
      snapshot &&
      (baselineRef.current?.workVersion !== snapshot.work_version_id ||
        baselineRef.current.workRevision !== snapshot.work_revision),
    ),
    action,
    stop,
    openSelection,
    addEntry,
    reload,
  };
}
