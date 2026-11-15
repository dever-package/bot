import { lazy, Suspense, useState, type ReactNode } from "react";
import {
  FileText,
  Loader2,
  Maximize2,
  RefreshCw,
  Square,
} from "lucide-react";
import { submitWritingCommand } from "./writing-api";
import { fetchSpaceAssetDetail } from "../space/space-api";
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
  hasWritingDirection,
  writingProfile,
  type WritingSnapshot,
} from "./writing-document";
import { canOpenWritingWorkspace, writingRetryCommand } from "./writing-workspace";
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
  onCreateStoryboards?: (unitIds: string[]) => void;
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
  const [creating, setCreating] = useState(false);
  const [selectingChapters, setSelectingChapters] = useState(false);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [createError, setCreateError] = useState("");
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
  const inspirationStage = !hasWritingDirection(document);
  const retry = writingRetryCommand(snapshot);
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
  const readyChapters = document?.units.filter(
    (unit) => unit.has_body && unit.asset_id && unit.version_id,
  ) || [];
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
      {inspirationStage && !state.active && retry?.action === "retry_generation" && (
        <button
          type="button"
          className="nodrag nopan"
          disabled={busy || Boolean(props.readonly)}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            void editor.action("retry_generation");
          }}
        >
          <RefreshCw size={12} />
          重试生成
        </button>
      )}
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
          <span className="writing-preview-eyebrow">{stage.label} · 正文 {readyChapters.length}/{document?.units.length || 0} 章</span>
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
              编辑故事
            </button>
          )}
          {!inspirationStage && readyChapters.length > 0 && props.onCreateStoryboards && (
            <button
              title="为选中的章节创建分镜节点，自动带上本章正文和设定"
              type="button"
              className="nodrag nopan"
              disabled={Boolean(props.readonly) || state.active}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                const ids = readyChapters.map((unit) => unit.id);
                if (ids.length === 1) {
                  props.onCreateStoryboards?.(ids);
                } else {
                  setSelectedChapterIds(ids);
                  setSelectingChapters(true);
                }
              }}
            >
              <FileText size={13} />
              制作分镜
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
        ) : !inspirationStage && stage.summary ? (
          <div className="writing-preview-selected">
            <h3>{stage.summary.title}</h3>
            <p>{stage.summary.content}</p>
          </div>
        ) : state.active && inspirationStage ? (
          <WritingInspirationsSkeleton />
        ) : (
          <div className="writing-preview-empty">
            <FileText size={24} strokeWidth={1.3} aria-hidden="true" />
            <p>
              {workExists
                ? inspirationStage
                  ? "暂无灵感，可重试生成"
                  : readyChapters.length ? `${readyChapters.length} 章正文已保存，可以继续编辑故事或制作分镜。` : "编辑故事，直接写作或粘贴已有小说"
                : "填写提示词，开始创作"}
            </p>
            {!workExists && !state.active && <button className="nodrag nopan" disabled={creating || props.readonly} onPointerDown={(event) => event.stopPropagation()} onClick={async (event) => {
              event.stopPropagation(); setCreating(true); setCreateError("");
              try {
                const work = await submitWritingCommand({ project_id: props.projectId, canvas_id: props.canvasId, action: "create", node_key: props.node.id, title: props.node.title || "新的小说", work_asset_id: 0, expected_work_version_id: 0, expected_work_revision: 0 });
                const detail = await fetchSpaceAssetDetail({ projectId: props.projectId, assetId: work.work_asset_id, currentOnly: true });
                props.onAssetUpdated?.(detail.asset); props.onOpenDetail?.(work);
              } catch(cause) { setCreateError(String((cause as Error)?.message || cause)); } finally { setCreating(false); }
            }}>{creating ? "正在创建…" : "直接开始写／带入已有小说"}</button>}
            {createError && <p role="alert">{createError}</p>}
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
      {selectingChapters && (
        <Suspense fallback={null}>
          <WritingDialog title="选择制作章节" onClose={() => setSelectingChapters(false)}>
            <div className="writing-dialog-scroll writing-chapter-selection">
              <p>选择要制作的章节，人物、场景和道具会自动共用。</p>
              {readyChapters.map((unit) => (
                <label key={unit.id}>
                  <input
                    type="checkbox"
                    checked={selectedChapterIds.includes(unit.id)}
                    onChange={(event) =>
                      setSelectedChapterIds((ids) =>
                        event.target.checked
                          ? [...ids, unit.id]
                          : ids.filter((id) => id !== unit.id),
                      )
                    }
                  />
                  {unit.title}
                </label>
              ))}
              <button
                type="button"
                disabled={Boolean(props.readonly) || state.active || !selectedChapterIds.length}
                onClick={() => {
                  props.onCreateStoryboards?.(selectedChapterIds);
                  setSelectingChapters(false);
                }}
              >
                创建分镜
              </button>
            </div>
          </WritingDialog>
        </Suspense>
      )}
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
