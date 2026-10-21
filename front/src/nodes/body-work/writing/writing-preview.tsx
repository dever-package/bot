import { lazy, Suspense, useState, type ReactNode } from "react";
import { FileText, Loader2, Maximize2, RefreshCw, Square } from "lucide-react";
import { CanvasNodeRunTimingView } from "../space/space-node-run-timing";
import {
  isActiveRunningNode,
  type RunningNodeState,
} from "../space/space-node-runtime";
import type { CanvasRunRef } from "../space/space-runner";
import {
  useWritingPreview,
  type WritingInspirationEdit,
  type WritingPreviewInput,
} from "./use-writing-preview";
import {
  hasWritingWork,
  writingProfile,
  type WritingSnapshot,
} from "./writing-document";
import { canOpenWritingWorkspace } from "./writing-workspace";
import {
  WritingInspirations,
  WritingInspirationsSkeleton,
} from "./writing-inspirations";
import { projectWritingPreview } from "./writing-stream-projection";
import {
  writingPreviewState,
  writingStagePreview,
} from "./writing-preview-state";
import "./writing-preview.css";

const WritingDialog = lazy(() =>
  import("./writing-dialog").then((module) => ({
    default: module.WritingDialog,
  })),
);
const WritingInspirationDialog = lazy(() =>
  import("./writing-dialog").then((module) => ({
    default: module.WritingInspirationDialog,
  })),
);
type WritingPreviewProps = WritingPreviewInput & {
  onOpenDetail?: (snapshot?: WritingSnapshot | null) => void;
  canvasRun?: CanvasRunRef;
  runningNode?: RunningNodeState | null;
  canvasRunStopping?: boolean;
  onStopCanvasRun?: () => void;
  renderFrame: (
    content: ReactNode,
    timing: ReactNode,
    running: boolean,
  ) => ReactNode;
};

/** 卡面保持画布选择与拖动；只有实际操作按钮隔离事件。 */
export function WritingPreview(props: WritingPreviewProps) {
  const editor = useWritingPreview(props);
  const { snapshot, generationTiming, busy, error, stop } = editor;
  const [errorOpen, setErrorOpen] = useState(false);
  const [inspirationEdit, setInspirationEdit] =
    useState<WritingInspirationEdit | null>(null);
  const document = snapshot?.document;
  const workExists = Boolean(document) || hasWritingWork(props.node);
  const profile = writingProfile;
  // 详情可能正在执行较新的写作 Run；旧画布 Run 的停止状态不能影响它。
  const canvasRun =
    document?.status === "running" &&
    (snapshot?.run_id !== props.canvasRun?.run_id ||
      snapshot?.request_id !== props.canvasRun?.request_id)
      ? undefined
      : props.canvasRun;
  const canvasStopping = Boolean(canvasRun && props.canvasRunStopping);
  const state = writingPreviewState({
    snapshot,
    canvasRun,
    runningNode: props.runningNode,
    running: Boolean(props.running || busy),
    loading: false,
    failure: error || (!document ? props.node.runError : "") || "",
    stopping: canvasStopping || editor.stopping,
  });
  const timing =
    generationTiming &&
    generationTiming.workAssetId === snapshot?.work_asset_id &&
    generationTiming.runId === snapshot.run_id &&
    generationTiming.requestId === snapshot.request_id
      ? generationTiming
      : props.node.resultRef?.run_id === snapshot?.run_id
        ? props.node.runTiming
        : undefined;
  // 初次提交用画布时钟；已存在的写作 Run 只认自身时钟，避免上次规划用时混进正文任务。
  const useWritingTiming = Boolean(
    snapshot?.run_id && (!state.active || state.usesWritingRun),
  );
  const awaitingCanvasTiming =
    state.active && !isActiveRunningNode(props.runningNode);
  const canvasTiming = canvasRun
    ? canvasRun.node_runs?.find((entry) => entry.node_key === props.node.id)
        ?.runTiming ||
      canvasRun.node_results?.find((entry) => entry.node_key === props.node.id)
        ?.runTiming ||
      (props.node.resultRef?.run_id &&
      props.node.resultRef.run_id === canvasRun.run_id
        ? props.node.runTiming
        : undefined)
    : props.node.runTiming;
  const clock = useWritingTiming ? (
    <CanvasNodeRunTimingView
      runTiming={timing}
      active={state.usesWritingRun}
      observed={
        timing === generationTiming && generationTiming?.source === "observed"
      }
      showEstimate={false}
    />
  ) : (
    <CanvasNodeRunTimingView
      runTiming={awaitingCanvasTiming ? undefined : canvasTiming}
      active={
        awaitingCanvasTiming
          ? true
          : !state.active && canvasRun
            ? false
            : undefined
      }
      runningNode={props.runningNode}
      showEstimate={false}
    />
  );
  const canStopWriting = Boolean(snapshot?.run_id && state.usesWritingRun);
  const canStopCanvas = Boolean(state.canvasActive && props.onStopCanvasRun);
  const canStop = state.active && (canStopWriting || canStopCanvas);
  const inspirationStage = !document?.selected_inspiration_id;
  const displayDocument =
    document && inspirationStage && state.active
      ? projectWritingPreview(
          document,
          editor.preview,
          snapshot?.checkpoint?.action,
        )
      : document;
  const showingInspirations = Boolean(
    displayDocument &&
    !displayDocument.selected_inspiration_id &&
    displayDocument.inspirations.length,
  );
  const stage = writingStagePreview(document);
  const errorButton = state.failure && (
    <button
      type="button"
      className="writing-preview-error nodrag nopan"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        setErrorOpen(true);
      }}
    >
      查看错误
    </button>
  );
  const status = (
    <span
      className={`writing-preview-status${state.failure ? " is-error" : ""}`}
      role="status"
    >
      {state.active && (
        <Loader2 size={13} className="ws-spin" aria-hidden="true" />
      )}
      <span title={state.label}>
        {showingInspirations && !state.active && !state.failure
          ? "选择一个灵感"
          : state.label}
      </span>
      {stage.leaves > 0 && (
        <span className="writing-preview-count">
          已写 {stage.completed}/{stage.leaves} 章
          {state.active && state.target > 1
            ? ` · 本次 ${state.committed}/${state.target}`
            : ""}
        </span>
      )}
    </span>
  );
  const taskActions = (
    <>
      {errorButton}
      {canStop && (
        <button
          type="button"
          className="nodrag nopan"
          disabled={busy || props.readonly || canvasStopping}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            if (canStopCanvas) props.onStopCanvasRun?.();
            else void stop();
          }}
        >
          <Square size={12} />
          停止
        </button>
      )}
    </>
  );
  const content = (
    <section className="writing-preview" aria-label={`${profile.title}预览`}>
      <header className="writing-preview-header">
        {inspirationStage ? (
          status
        ) : (
          <span className="writing-preview-eyebrow">已选灵感</span>
        )}
        <div className="writing-preview-actions">
          {inspirationStage && taskActions}
          {showingInspirations && !state.active && (
            <button
              type="button"
              className="writing-preview-batch nodrag nopan"
              disabled={busy || Boolean(props.readonly)}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                void editor.action("generate_inspirations");
              }}
            >
              <RefreshCw size={13} />
              换一批
            </button>
          )}
          {canOpenWritingWorkspace(document) && (
            <button
              type="button"
              className="nodrag nopan"
              disabled={!props.onOpenDetail}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                props.onOpenDetail?.(editor.snapshotRef.current);
              }}
            >
              <Maximize2 size={13} />
              打开工作区
            </button>
          )}
        </div>
      </header>
      <div className="writing-preview-content">
        {displayDocument && showingInspirations ? (
          <WritingInspirations
            pending={state.active}
            document={displayDocument}
            disabled={state.active || busy || Boolean(props.readonly)}
            onEdit={(id) => setInspirationEdit(editor.beginInspirationEdit(id))}
            onRegenerate={(id) =>
              void editor.action(
                "generate_inspirations",
                id ? { inspiration_id: id } : {},
              )
            }
            onSelect={async (id) => {
              if (
                await editor.action("select_inspiration", {
                  inspiration_id: id,
                })
              )
                props.onOpenDetail?.(editor.snapshotRef.current);
            }}
          />
        ) : stage.inspiration ? (
          <div className="writing-preview-selected">
            <h3>{stage.inspiration.title}</h3>
            <p>{stage.inspiration.content}</p>
          </div>
        ) : state.active && inspirationStage ? (
          <WritingInspirationsSkeleton />
        ) : (
          <div className="writing-preview-empty">
            <FileText size={24} strokeWidth={1.3} aria-hidden="true" />
            <p>
              {workExists
                ? "暂无内容，打开工作区继续创作"
                : "填写提示词，开始创作"}
            </p>
          </div>
        )}
      </div>
      {!inspirationStage && (
        <footer className="writing-preview-footer">
          {status}
          <div className="writing-preview-actions">{taskActions}</div>
        </footer>
      )}
    </section>
  );
  return (
    <>
      {props.renderFrame(content, clock, state.active)}
      {errorOpen && (
        <Suspense fallback={null}>
          <WritingDialog title="生成错误" onClose={() => setErrorOpen(false)}>
            <div className="writing-preview-error-detail" role="alert">
              {state.failure || error}
            </div>
          </WritingDialog>
        </Suspense>
      )}
      {inspirationEdit && (
        <Suspense fallback={null}>
          <WritingInspirationDialog
            edit={inspirationEdit}
            disabled={state.active || busy || Boolean(props.readonly)}
            onSave={(fields) => editor.saveInspiration(inspirationEdit, fields)}
            onRegenerate={() => editor.regenerateInspiration(inspirationEdit)}
            onClose={() => setInspirationEdit(null)}
          />
        </Suspense>
      )}
    </>
  );
}
