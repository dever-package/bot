import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSpaceAssetDetail, stopSpaceCanvasRun } from "../space/space-api";
import type { ProjectAsset, SpaceCanvasNode } from "../space/types";
import {
  mergeWritingSnapshot,
  parseWritingDocument,
  writingSnapshotFromNode,
  writingVersionRevision,
  type WritingSnapshot,
} from "./writing-document";
import { useWritingRun } from "./use-writing-run";
import type { WritingAction, WritingCommand } from "./writing-api";

export type WritingWorkInput = {
  projectId: number;
  canvasId: number;
  node: SpaceCanvasNode;
  output?: unknown;
  onAssetUpdated?: (asset: ProjectAsset) => void;
};

/** 卡面读取已保存快照；详情才主动读取作品，二者共用运行恢复与流式生命周期。 */
export function useWritingSnapshot({
  projectId,
  canvasId,
  node,
  output,
  onAssetUpdated,
  readOnMount = true,
}: WritingWorkInput & { readOnMount?: boolean }) {
  const [snapshot, setSnapshot] = useState<WritingSnapshot | null>(() =>
    writingSnapshotFromNode(node, output),
  );
  const snapshotRef = useRef(snapshot);
  const workAssetId = node.asset?.id || node.resultRef?.asset_id;
  const scope = `${projectId}:${canvasId}:${node.id}:${workAssetId || 0}`;
  const scopeRef = useRef(scope);
  const workAssetIdRef = useRef(workAssetId);
  const assetRef = useRef(node.asset);
  const callbackRef = useRef(onAssetUpdated);
  const workReadSequence = useRef(0);
  const mounted = useRef(true);
  const [error, setError] = useState("");
  const reportError = useCallback(
    (cause: unknown) =>
      setError(cause instanceof Error ? cause.message : "创作操作失败"),
    [],
  );
  useEffect(() => {
    scopeRef.current = scope;
    workAssetIdRef.current = workAssetId;
    // 空画布会先挂载卡面，首次生成后才收到资产；命令回写必须使用当前资产。
    assetRef.current = node.asset;
    callbackRef.current = onAssetUpdated;
  }, [scope, workAssetId, node.asset, onAssetUpdated]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const acceptSnapshot = useCallback((incoming: WritingSnapshot) => {
    if (
      !mounted.current ||
      (workAssetIdRef.current &&
        incoming.work_asset_id !== workAssetIdRef.current)
    )
      return incoming;
    const next = mergeWritingSnapshot(snapshotRef.current, incoming);
    snapshotRef.current = next;
    setSnapshot(next);
    if (assetRef.current?.id === next.work_asset_id && next === incoming) {
      const previous = assetRef.current;
      const asset: ProjectAsset = {
        ...previous,
        name: next.document.title,
        version_id: next.work_version_id,
        version: {
          ...previous.version,
          id: next.work_version_id,
          asset_id: next.work_asset_id,
          version: next.work_version || previous.version?.version || 1,
          updated_at: next.work_updated_at,
          content: {
            json: next.document,
            writing_revision: next.work_revision,
          },
        },
      };
      assetRef.current = asset;
      callbackRef.current?.(asset);
    }
    return next;
  }, []);
  const loadWork = useCallback(async () => {
    const currentScope = scopeRef.current;
    const assetId =
      node.asset?.id ||
      node.resultRef?.asset_id ||
      snapshotRef.current?.work_asset_id;
    if (!assetId) return;
    const read = ++workReadSequence.current;
    const detail = await fetchSpaceAssetDetail({
      projectId,
      assetId,
      currentOnly: true,
      reportError: false,
    });
    if (
      !mounted.current ||
      read !== workReadSequence.current ||
      scopeRef.current !== currentScope
    )
      return;
    const document = parseWritingDocument(detail.asset.version?.content);
    if (!document) throw new Error("作品内容格式不正确");
    assetRef.current = detail.asset;
    const previous = snapshotRef.current;
    acceptSnapshot({
      work_asset_id: assetId,
      work_version_id: detail.asset.version_id,
      work_revision: writingVersionRevision(detail.asset.version),
      work_version: detail.asset.version?.version,
      work_updated_at:
        detail.asset.version?.updated_at || detail.asset.version?.created_at,
      document,
      run_id: document.active_run_id,
      request_id: document.active_request_id,
      status: document.status,
      checkpoint:
        previous?.run_id === document.active_run_id &&
        previous.work_revision === writingVersionRevision(detail.asset.version)
          ? previous.checkpoint
          : undefined,
      proposal:
        previous?.run_id === document.active_run_id &&
        previous.work_revision === writingVersionRevision(detail.asset.version)
          ? previous.proposal
          : undefined,
    });
  }, [acceptSnapshot, node.asset?.id, node.resultRef?.asset_id, projectId]);
  useEffect(() => {
    if (readOnMount) void loadWork().catch(reportError);
  }, [loadWork, readOnMount, reportError]);
  useEffect(() => {
    const assetId = node.asset?.id || node.resultRef?.asset_id;
    const versionId = node.asset?.version_id || node.resultRef?.version_id;
    const current = snapshotRef.current;
    if (
      readOnMount &&
      current &&
      current.work_asset_id === assetId &&
      versionId &&
      versionId > current.work_version_id
    ) {
      void loadWork().catch(reportError);
    }
  }, [
    loadWork,
    readOnMount,
    node.asset?.id,
    node.asset?.version_id,
    node.resultRef?.asset_id,
    node.resultRef?.version_id,
    reportError,
  ]);
  useEffect(() => {
    const incoming = writingSnapshotFromNode(node, output, snapshotRef.current);
    if (incoming) acceptSnapshot(incoming);
  }, [acceptSnapshot, node, output]);

  const {
    generationTiming,
    generationError,
    preview,
    clearPreview,
    clearGenerationError,
  } = useWritingRun({
    projectId,
    snapshot,
    snapshotRef,
    workAssetIdRef,
    scopeRef,
    scope,
    mounted,
    acceptSnapshot,
    loadWork,
    reportError,
    observeCompletedRuns: readOnMount,
  });

  const command = useCallback(
    (
      action: WritingAction,
      extra: Partial<WritingCommand> = {},
      workVersion?: number,
    ): WritingCommand => {
      const current = snapshotRef.current;
      if (!current) throw new Error("请等待作品加载完成");
      return {
        project_id: projectId,
        canvas_id: canvasId,
        work_asset_id: current.work_asset_id,
        expected_work_version_id: workVersion ?? current.work_version_id,
        expected_work_revision: current.work_revision,
        action,
        ...extra,
      };
    },
    [canvasId, projectId],
  );
  const stopRun = useCallback(async () => {
    const current = snapshotRef.current;
    if (!current?.run_id || current.document.status !== "running") return;
    await stopSpaceCanvasRun({
      projectId,
      runId: current.run_id,
      requestId: current.request_id,
      reportError: false,
    });
    await loadWork();
  }, [loadWork, projectId]);

  return {
    snapshot,
    snapshotRef,
    mounted,
    acceptSnapshot,
    loadWork,
    command,
    stopRun,
    reportError,
    setError,
    error:
      error ||
      generationError ||
      (!snapshot && node.asset?.version?.content != null
        ? "作品内容格式不正确"
        : ""),
    generationTiming,
    preview,
    clearPreview,
    clearGenerationError,
  };
}
