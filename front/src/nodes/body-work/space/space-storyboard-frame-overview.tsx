import { ExternalLink, FileText, Loader2, Play, Square, X } from "lucide-react";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { isVideoComposePowerType } from "../shared/power-presentation";
import type { WorkspaceNodeData } from "./space-node-runtime";
import {
  CanvasNodeSettings,
  preloadCanvasNodeSettings,
} from "./space-optional-components";
import { SpaceTooltip } from "./space-tooltip";

export type StoryboardFrameResultData = {
  nodeId: string;
  status: "pending" | "running" | "waiting" | "complete" | "stale" | "error";
  node: WorkspaceNodeData;
  onOpen: () => void;
};

export type StoryboardFrameGroupData = {
  id: string;
  title: string;
  memberCount: number;
  runnableCount: number;
  completedCount: number;
  failedCount: number;
  staleCount: number;
  status: "idle" | "running" | "waiting" | "error";
  runBlockedReason: string;
  stopping: boolean;
  results: StoryboardFrameResultData[];
  onRun?: () => void;
  onStop?: () => void;
};

export function StoryboardFrameOverview({
  groups,
  renderNode,
}: {
  groups: StoryboardFrameGroupData[];
  renderNode: (node: WorkspaceNodeData) => ReactNode;
}) {
  const [selectedGroupId, setSelectedGroupId] = useState(
    () => groups.find(storyboardFrameGroupActive)?.id || groups[0]?.id || "",
  );
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [editorPosition, setEditorPosition] = useState<{
    left: number;
    top: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (groups.some((group) => group.id === selectedGroupId)) {
      return;
    }
    setSelectedGroupId(
      groups.find(storyboardFrameGroupActive)?.id || groups[0]?.id || "",
    );
  }, [groups, selectedGroupId]);

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) || groups[0];
  const selectedResult = selectedGroup?.results.find(
    (result) => result.nodeId === selectedNodeId,
  );

  useLayoutEffect(() => {
    if (!selectedResult || !anchorRef.current) return;
    const anchor = anchorRef.current;
    const updatePosition = () => {
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(640, window.innerWidth - 24);
      const left = Math.max(
        12,
        Math.min(
          rect.left + (rect.width - width) / 2,
          window.innerWidth - width - 12,
        ),
      );
      const top = Math.min(rect.bottom + 8, window.innerHeight - 80);
      const maxHeight = Math.max(60, window.innerHeight - top - 12);
      setEditorPosition((previous) =>
        previous?.left === left &&
        previous.top === top &&
        previous.width === width &&
        previous.maxHeight === maxHeight
          ? previous
          : { left, top, width, maxHeight },
      );
    };
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(anchor);
    if (editorRef.current) observer.observe(editorRef.current);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [
    selectedNodeId,
    selectedGroupId,
    Boolean(selectedResult),
    Boolean(editorPosition),
  ]);

  useEffect(() => {
    if (!selectedResult) return;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as globalThis.Node;
      if (
        !anchorRef.current?.contains(target) &&
        !editorRef.current?.contains(target)
      ) {
        setSelectedNodeId("");
      }
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSelectedNodeId("");
    };
    document.addEventListener("pointerdown", closeOutside, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedNodeId, selectedGroupId, Boolean(selectedResult)]);

  const openResult = (
    result: StoryboardFrameResultData,
    anchor: HTMLDivElement,
  ) => {
    if (
      result.node.type !== "power" ||
      isVideoComposePowerType(
        result.node.power,
        result.node.kind,
        result.node.outputType,
      )
    ) {
      result.onOpen();
      return;
    }
    anchorRef.current = anchor;
    setEditorPosition(null);
    setSelectedNodeId(result.nodeId);
    void preloadCanvasNodeSettings();
  };
  return (
    <div className="ws-storyboard-frame-overview nodrag nopan nowheel">
      <div className="ws-storyboard-frame-groups" aria-label="制作分组">
        {groups.map((group) => (
          <StoryboardFrameGroupRow
            key={group.id}
            group={group}
            selected={group.id === selectedGroup?.id}
            onSelect={() => {
              setSelectedNodeId("");
              setSelectedGroupId(group.id);
            }}
          />
        ))}
      </div>
      <StoryboardFrameResultList
        group={selectedGroup}
        renderNode={renderNode}
        selectedNodeId={selectedNodeId}
        onOpenResult={openResult}
      />
      {selectedResult && editorPosition
        ? createPortal(
            <div
              ref={editorRef}
              className="ws-storyboard-frame-editor nodrag nopan nowheel"
              style={editorPosition}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <header>
                <strong>{selectedResult.node.title}</strong>
                <span>
                  <SpaceTooltip label="打开详情">
                    <button
                      type="button"
                      aria-label="打开详情"
                      onClick={stopAnd(() => {
                        setSelectedNodeId("");
                        selectedResult.onOpen();
                      })}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </SpaceTooltip>
                  <SpaceTooltip label="关闭编辑器">
                    <button
                      type="button"
                      aria-label="关闭编辑器"
                      onClick={stopAnd(() => setSelectedNodeId(""))}
                    >
                      <X size={15} />
                    </button>
                  </SpaceTooltip>
                </span>
              </header>
              <Suspense
                fallback={
                  <div className="ws-storyboard-frame-editor-loading">
                    正在加载参数...
                  </div>
                }
              >
                <CanvasNodeSettings
                  key={selectedNodeId}
                  node={selectedResult.node}
                />
              </Suspense>
            </div>,
            anchorRef.current?.closest(".ws-page") || document.body,
          )
        : null}
    </div>
  );
}

function StoryboardFrameGroupRow({
  group,
  selected,
  onSelect,
}: {
  group: StoryboardFrameGroupData;
  selected: boolean;
  onSelect: () => void;
}) {
  const active = storyboardFrameGroupActive(group);
  const status = storyboardFrameGroupStatus(group);
  const action = active ? group.onStop : group.onRun;
  const actionLabel = active
    ? group.stopping
      ? "正在停止"
      : group.onStop
        ? `停止${group.title}`
        : `${group.title}正在执行`
    : group.runBlockedReason || storyboardFrameGroupRunLabel(group);
  return (
    <div
      className={`ws-storyboard-frame-group ${selected ? "is-selected" : ""} ${
        active ? "is-running" : ""
      } ${group.status === "error" ? "is-error" : ""}`}
    >
      <button
        type="button"
        className="ws-storyboard-frame-group-select nodrag nopan"
        onClick={stopAnd(onSelect)}
      >
        <span>
          <strong>{group.title}</strong>
          <small>{status}</small>
        </span>
        <em>
          {group.completedCount}/{group.runnableCount || group.memberCount}
        </em>
      </button>
      <SpaceTooltip label={actionLabel}>
        <button
          type="button"
          className={`ws-storyboard-frame-group-action nodrag nopan ${
            active ? "is-stop" : ""
          }`}
          aria-label={actionLabel}
          disabled={
            group.stopping ||
            !action ||
            (!active && Boolean(group.runBlockedReason))
          }
          onClick={
            action
              ? stopAnd(() => {
                  onSelect();
                  action();
                })
              : undefined
          }
        >
          {group.stopping || (active && !group.onStop) ? (
            <Loader2 size={13} className="ws-spin" />
          ) : active ? (
            <Square size={12} fill="currentColor" />
          ) : (
            <Play size={13} fill="currentColor" />
          )}
        </button>
      </SpaceTooltip>
    </div>
  );
}

function StoryboardFrameResultList({
  group,
  renderNode,
  selectedNodeId,
  onOpenResult,
}: {
  group?: StoryboardFrameGroupData;
  renderNode: (node: WorkspaceNodeData) => ReactNode;
  selectedNodeId: string;
  onOpenResult: (
    result: StoryboardFrameResultData,
    anchor: HTMLDivElement,
  ) => void;
}) {
  if (!group) {
    return (
      <div className="ws-storyboard-frame-results is-empty">暂无制作分组</div>
    );
  }
  return (
    <section className="ws-storyboard-frame-results">
      <header>
        <strong>{group.title}</strong>
        <span>{group.results.length} 项结果</span>
      </header>
      {group.results.length > 0 ? (
        <div className="ws-storyboard-frame-result-grid">
          {group.results.map((result) => (
            <div
              key={result.nodeId}
              role="button"
              tabIndex={0}
              className={`ws-storyboard-frame-result is-${result.status} ${selectedNodeId === result.nodeId ? "is-selected" : ""} nodrag nopan`}
              style={{
                aspectRatio: `${Math.max(1, result.node.width)} / ${Math.max(1, result.node.height)}`,
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (
                  (event.target as HTMLElement).closest(
                    "button, a, video, input, textarea, select, [contenteditable]",
                  )
                )
                  return;
                onOpenResult(result, event.currentTarget);
              }}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                if (event.target !== event.currentTarget) return;
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                onOpenResult(result, event.currentTarget);
              }}
              aria-label={`编辑${result.node.title || "制作节点"}`}
            >
              {renderNode(result.node)}
            </div>
          ))}
        </div>
      ) : (
        <div className="ws-storyboard-frame-result-empty">
          <FileText size={18} />
          <span>当前分组暂无结果节点</span>
        </div>
      )}
    </section>
  );
}

function storyboardFrameGroupActive(group: StoryboardFrameGroupData) {
  return group.status === "running" || group.status === "waiting";
}

function storyboardFrameGroupRunLabel(group: StoryboardFrameGroupData) {
  if (
    group.runnableCount > 0 &&
    group.completedCount >= group.runnableCount &&
    group.staleCount === 0
  ) {
    return `重新执行${group.title}`;
  }
  return group.completedCount > 0
    ? `继续执行${group.title}`
    : `执行${group.title}`;
}

function storyboardFrameGroupStatus(group: StoryboardFrameGroupData) {
  if (group.stopping) return "停止中";
  if (group.status === "running") return "执行中";
  if (group.status === "waiting") return "等待反馈";
  if (group.status === "error") {
    return group.failedCount > 0 ? `失败 ${group.failedCount}` : "执行失败";
  }
  if (group.runBlockedReason) return "等待前置";
  if (group.staleCount > 0) return `${group.staleCount} 项待更新`;
  if (group.runnableCount > 0 && group.completedCount >= group.runnableCount) {
    return "已完成";
  }
  return group.completedCount > 0 ? "部分完成" : "待执行";
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
