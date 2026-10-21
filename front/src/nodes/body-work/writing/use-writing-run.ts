import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { observeWritingRun } from "./writing-run-observer";
import { normalizeCanvasNodeRunTiming } from "../space/space-run-timing";
import {
  writingSnapshotFromOutput,
  writingPreviewFromOutput,
  writingPreviewMatchesSnapshot,
  type WritingSnapshot,
  type WritingPreview,
} from "./writing-document";
import type { WritingGenerationTiming } from "./writing-generation-progress";

type WritingRunInput = {
  observeCompletedRuns?: boolean;
  projectId: number;
  snapshot: WritingSnapshot | null;
  snapshotRef: MutableRefObject<WritingSnapshot | null>;
  workAssetIdRef: MutableRefObject<number | undefined>;
  scopeRef: MutableRefObject<string>;
  scope: string;
  mounted: MutableRefObject<boolean>;
  acceptSnapshot: (snapshot: WritingSnapshot) => WritingSnapshot;
  loadWork: () => Promise<void>;
  reportError: (cause: unknown) => void;
};

/** Run 身份、计时和可读流共享一个生命周期，草稿与持久化不进入此层。 */
export function useWritingRun({
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
  observeCompletedRuns = true,
}: WritingRunInput) {
  const [generationError, setGenerationError] = useState("");
  const [generationTiming, setGenerationTiming] =
    useState<WritingGenerationTiming | null>(null);
  const [preview, setPreview] = useState<WritingPreview | null>(null);
  const previewStep = useRef("");
  const retiredSteps = useRef(new Set<string>());
  const clearPreview = useCallback(() => {
    setPreview(null);
    previewStep.current = "";
    retiredSteps.current.clear();
  }, []);
  const clearGenerationError = useCallback(() => setGenerationError(""), []);
  useEffect(() => {
    const current = snapshotRef.current;
    if (
      !current?.run_id ||
      !current.request_id ||
      (!observeCompletedRuns && current.document.status !== "running") ||
      (workAssetIdRef.current &&
        current.work_asset_id !== workAssetIdRef.current)
    )
      return;
    const currentScope = scopeRef.current;
    let canceled = false;
    const sameRun = (value: WritingSnapshot | null) =>
      Boolean(
        value &&
        value.work_asset_id === current.work_asset_id &&
        value.run_id === current.run_id &&
        value.request_id === current.request_id,
      );
    const active = () =>
      !canceled &&
      mounted.current &&
      scopeRef.current === currentScope &&
      sameRun(snapshotRef.current);
    const identity = {
      workAssetId: current.work_asset_id,
      runId: current.run_id,
      requestId: current.request_id,
    };
    const observedAt = Date.now();
    const retainObservedTiming = () =>
      setGenerationTiming((previous) => {
        const same =
          previous?.runId === current.run_id &&
          previous?.requestId === current.request_id &&
          previous?.workAssetId === current.work_asset_id;
        const timing = same
          ? previous
          : { ...identity, startedAt: observedAt, source: "observed" as const };
        return snapshotRef.current?.document.status === "running"
          ? timing
          : { ...timing, finishedAt: timing.finishedAt || Date.now() };
      });
    previewStep.current = "";
    retiredSteps.current.clear();
    retainObservedTiming();
    const unsubscribe = observeWritingRun(
      {
        ...identity,
        projectId,
        running: current.document.status === "running",
      },
      {
        onStatus: (run) => {
          if (!active()) return;
          const incoming = writingSnapshotFromOutput(run.output);
          if (incoming && sameRun(incoming)) acceptSnapshot(incoming);
          const timing = normalizeCanvasNodeRunTiming(run);
          if (timing)
            setGenerationTiming((previous) => ({
              ...identity,
              ...timing,
              source: "server",
              ...(snapshotRef.current?.document.status !== "running"
                ? {
                    finishedAt:
                      timing.finishedAt || previous?.finishedAt || Date.now(),
                  }
                : {}),
            }));
          else retainObservedTiming();
          if (
            run.status === "fail" ||
            snapshotRef.current?.document.status === "failed"
          )
            setGenerationError(
              String(run.error || "生成失败，已完成内容已保留"),
            );
        },
        onFrame: (frame) => {
          if (!active()) return;
          const partial = writingPreviewFromOutput(frame.output);
          if (
            writingPreviewMatchesSnapshot(partial, snapshotRef.current)
          ) {
            if (retiredSteps.current.has(partial.step_request_id)) return;
            const changedStep = previewStep.current !== partial.step_request_id;
            if (changedStep && previewStep.current)
              retiredSteps.current.add(previewStep.current);
            previewStep.current = partial.step_request_id;
            setPreview(partial);
          }
          const next = writingSnapshotFromOutput(frame.output);
          if (next && sameRun(next)) acceptSnapshot(next);
          if (frame.type === "result" && Number(frame.status) === 2)
            setGenerationError(frame.msg || "生成中断，已完成内容已保留");
        },
        onEnd: () => {
          if (active())
            void loadWork().catch((cause) => {
              if (active()) reportError(cause);
            });
        },
        onError: (cause) => {
          if (!active()) return;
          retainObservedTiming();
          reportError(cause);
        },
      },
    );
    return () => {
      canceled = true;
      unsubscribe();
    };
  }, [
    acceptSnapshot,
    mounted,
    scopeRef,
    snapshotRef,
    workAssetIdRef,
    loadWork,
    projectId,
    reportError,
    scope,
    observeCompletedRuns,
    snapshot?.work_asset_id,
    snapshot?.run_id,
    snapshot?.request_id,
  ]);
  return {
    generationError:
      snapshot?.document.status === "running" ||
      snapshot?.document.status === "ready"
        ? ""
        : generationError,
    generationTiming,
    preview:
      writingPreviewMatchesSnapshot(preview, snapshot)
        ? preview
        : null,
    clearPreview,
    clearGenerationError,
  };
}
