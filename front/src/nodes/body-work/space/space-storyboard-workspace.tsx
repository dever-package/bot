import { FileText, Loader2, Play, Square } from "lucide-react";
import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { isVideoComposePowerType } from "../shared/power-presentation";
import type {
  StoryboardWorkspaceGroupData,
  StoryboardWorkspaceResultData,
  WorkspaceNodeData,
} from "./space-node-runtime";
import {
  CanvasNodeSettings,
  preloadCanvasNodeSettings,
} from "./space-optional-components";
import { SpaceTooltip } from "./space-tooltip";
import { storyboardEditorPosition } from "./space-storyboard-editor-position";
import {
  CanvasNodeVisibilityProvider,
  useCanvasNodeVisibility,
} from "./space-node-visibility";
import "./space-storyboard-workspace.css";

export const STORYBOARD_SCRIPT_SECTION_ID = "storyboard-script";

type StoryboardWorkspaceProps = {
  activeSectionId: string;
  groups: StoryboardWorkspaceGroupData[];
  scriptContent: ReactNode;
  scriptMeta: string;
  renderNode: (node: WorkspaceNodeData, selected: boolean) => ReactNode;
  onActiveSectionChange: (sectionId: string) => void;
  variant?: "canvas" | "detail";
};

export function StoryboardWorkspace({
  activeSectionId,
  groups,
  scriptContent,
  scriptMeta,
  renderNode,
  onActiveSectionChange,
  variant = "canvas",
}: StoryboardWorkspaceProps) {
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [editorPosition, setEditorPosition] = useState<{
    left: number;
    top: number;
    maxHeight: number;
  } | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      activeSectionId === STORYBOARD_SCRIPT_SECTION_ID ||
      groups.some((group) => group.id === activeSectionId)
    ) {
      return;
    }
    onActiveSectionChange(STORYBOARD_SCRIPT_SECTION_ID);
  }, [activeSectionId, groups, onActiveSectionChange]);

  const selectedGroup = groups.find((group) => group.id === activeSectionId);
  const selectedResult = selectedGroup?.results.find(
    (result) => result.nodeId === selectedNodeId,
  );

  useLayoutEffect(() => {
    if (!selectedResult || !anchorRef.current) return;
    const anchor = anchorRef.current;
    const updatePosition = () => {
      const rect = anchor.getBoundingClientRect();
      const editor = editorRef.current?.firstElementChild as HTMLElement | null;
      const editorRect = editor?.getBoundingClientRect();
      const next = storyboardEditorPosition(
        rect,
        { width: editorRect?.width || 640, height: editorRect?.height || 240 },
        { width: window.innerWidth, height: window.innerHeight },
      );
      setEditorPosition((current) =>
        current?.left === next.left && current.top === next.top &&
        current.maxHeight === next.maxHeight
          ? current
          : next,
      );
    };
    const observer = new ResizeObserver(updatePosition);
    observer.observe(anchor);
    let observedEditor: Element | null = null;
    const observeEditor = () => {
      const editor = editorRef.current?.firstElementChild || null;
      if (editor !== observedEditor) {
        if (observedEditor) observer.unobserve(observedEditor);
        if (editor) observer.observe(editor);
        observedEditor = editor;
      }
      updatePosition();
    };
    const mutationObserver = new MutationObserver(observeEditor);
    if (editorRef.current) {
      mutationObserver.observe(editorRef.current, { childList: true });
    }
    observeEditor();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [selectedResult, editorPosition !== null]);

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
      if (event.key !== "Escape") return;
      // 内层选择器先处理，编辑器接住 Escape，避免同一次按键关闭父详情。
      event.stopPropagation();
      if (event.defaultPrevented) return;
      const innerPopup =
        event.target instanceof Element
          ? event.target.closest(
              '[role="dialog"], [role="menu"], [role="listbox"]',
            )
          : null;
      if (innerPopup && editorRef.current?.contains(innerPopup)) return;
      event.preventDefault();
      setSelectedNodeId("");
    };
    document.addEventListener("pointerdown", closeOutside, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedResult]);

  const selectSection = (sectionId: string) => {
    setSelectedNodeId("");
    onActiveSectionChange(sectionId);
  };

  const openResult = useCallback(
    (result: StoryboardWorkspaceResultData, anchor: HTMLDivElement) => {
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
    },
    [],
  );

  return (
    <div
      className={`ws-storyboard-workspace is-${variant} nodrag nopan nowheel`}
    >
      <nav className="ws-storyboard-workspace-menu" aria-label="分镜制作菜单">
        <button
          type="button"
          className={`ws-storyboard-workspace-script ${
            activeSectionId === STORYBOARD_SCRIPT_SECTION_ID
              ? "is-selected"
              : ""
          }`}
          aria-current={
            activeSectionId === STORYBOARD_SCRIPT_SECTION_ID
              ? "page"
              : undefined
          }
          onClick={stopAnd(() => selectSection(STORYBOARD_SCRIPT_SECTION_ID))}
        >
          <span>
            <strong>分镜脚本</strong>
            <small>{scriptMeta}</small>
          </span>
          <FileText size={14} />
        </button>
        {groups.map((group) => (
          <StoryboardWorkspaceGroupRow
            key={group.id}
            group={group}
            selected={group.id === activeSectionId}
            onSelect={() => selectSection(group.id)}
          />
        ))}
      </nav>

      {activeSectionId === STORYBOARD_SCRIPT_SECTION_ID ? (
        <section className="ws-storyboard-workspace-content is-script">
          {scriptContent}
        </section>
      ) : (
        <StoryboardWorkspaceResultList
          group={selectedGroup}
          variant={variant}
          renderNode={renderNode}
          selectedNodeId={selectedNodeId}
          onOpenResult={openResult}
        />
      )}

      {selectedResult && editorPosition
        ? createPortal(
            <div
              ref={editorRef}
              className="ws-storyboard-workspace-editor-anchor nodrag nopan nowheel"
              style={{
                left: editorPosition.left,
                top: editorPosition.top,
                "--ws-storyboard-editor-max-height": `${editorPosition.maxHeight}px`,
              } as CSSProperties}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Suspense
                fallback={
                  <div className="ws-storyboard-workspace-editor-loading">
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
            anchorRef.current?.closest(".wb-detail-backdrop") ||
              anchorRef.current?.closest(".ws-page") ||
              document.body,
          )
        : null}
    </div>
  );
}

function StoryboardWorkspaceGroupRow({
  group,
  selected,
  onSelect,
}: {
  group: StoryboardWorkspaceGroupData;
  selected: boolean;
  onSelect: () => void;
}) {
  const active = storyboardWorkspaceGroupActive(group);
  const status = storyboardWorkspaceGroupStatus(group);
  return (
    <div
      className={`ws-storyboard-workspace-group ${
        selected ? "is-selected" : ""
      } ${active ? "is-running" : ""} ${
        group.status === "error" ? "is-error" : ""
      }`}
    >
      <button
        type="button"
        className="ws-storyboard-workspace-group-select nodrag nopan"
        aria-current={selected ? "page" : undefined}
        onClick={stopAnd(onSelect)}
      >
        <span>
          <strong>{group.title}</strong>
          <small role="status">{status}</small>
        </span>
        <em>
          {group.completedCount}/{group.runnableCount || group.memberCount}
        </em>
      </button>
      <StoryboardWorkspaceGroupAction group={group} onBeforeAction={onSelect} />
    </div>
  );
}

function StoryboardWorkspaceGroupAction({
  group,
  onBeforeAction,
}: {
  group: StoryboardWorkspaceGroupData;
  onBeforeAction?: () => void;
}) {
  const active = storyboardWorkspaceGroupActive(group);
  const action = active ? group.onStop : group.onRun;
  const actionLabel = active
    ? group.stopping
      ? "正在停止"
      : group.onStop
        ? `停止${group.title}`
        : `${group.title}正在执行`
    : group.runBlockedReason || storyboardWorkspaceGroupRunLabel(group);
  return (
    <SpaceTooltip label={actionLabel}>
      <button
        type="button"
        className={`ws-storyboard-workspace-group-action nodrag nopan ${
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
                onBeforeAction?.();
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
  );
}

function StoryboardWorkspaceResultList({
  group,
  variant,
  renderNode,
  selectedNodeId,
  onOpenResult,
}: {
  group?: StoryboardWorkspaceGroupData;
  variant: "canvas" | "detail";
  renderNode: (node: WorkspaceNodeData, selected: boolean) => ReactNode;
  selectedNodeId: string;
  onOpenResult: (
    result: StoryboardWorkspaceResultData,
    anchor: HTMLDivElement,
  ) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef(new Map<string, number>());
  const groupId = group?.id;
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || !groupId) return;
    grid.scrollTop = scrollPositions.current.get(groupId) || 0;
  }, [groupId]);

  if (!group) {
    return (
      <div className="ws-storyboard-workspace-results is-empty">
        暂无制作分组
      </div>
    );
  }
  return (
    <section
      className="ws-storyboard-workspace-results"
      aria-label={group.title}
    >
      {group.runBlockedReason && !storyboardWorkspaceGroupActive(group) ? (
        <p className="ws-storyboard-workspace-blocked">
          {group.runBlockedReason}
        </p>
      ) : null}
      {group.results.length > 0 ? (
        <div
          ref={gridRef}
          className="ws-storyboard-workspace-result-grid"
          onScroll={(event) => {
            if (groupId)
              scrollPositions.current.set(
                groupId,
                event.currentTarget.scrollTop,
              );
          }}
        >
          <CanvasNodeVisibilityProvider root={gridRef} rootMargin="160px">
            {group.results.map((result) => (
              <StoryboardWorkspaceResult
                key={result.nodeId}
                result={result}
                variant={variant}
                selected={selectedNodeId === result.nodeId}
                renderNode={renderNode}
                onOpenResult={onOpenResult}
              />
            ))}
          </CanvasNodeVisibilityProvider>
        </div>
      ) : (
        <div className="ws-storyboard-workspace-result-empty">
          <FileText size={18} />
          <span>当前分组暂无结果节点</span>
        </div>
      )}
    </section>
  );
}

const StoryboardWorkspaceResult = memo(function StoryboardWorkspaceResult({
  result,
  variant,
  selected,
  renderNode,
  onOpenResult,
}: {
  result: StoryboardWorkspaceResultData;
  variant: "canvas" | "detail";
  selected: boolean;
  renderNode: StoryboardWorkspaceProps["renderNode"];
  onOpenResult: (
    result: StoryboardWorkspaceResultData,
    anchor: HTMLDivElement,
  ) => void;
}) {
  const { ref, visible } = useCanvasNodeVisibility(false);
  const [focused, setFocused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playingMedia = useRef(new Set<HTMLMediaElement>());
  useLayoutEffect(() => {
    for (const media of playingMedia.current) {
      if (!ref.current?.contains(media) || media.paused || media.ended) {
        playingMedia.current.delete(media);
      }
    }
    setPlaying(playingMedia.current.size > 0);
  }, [ref, result.node]);
  const stopPlaying = (event: { target: EventTarget }) => {
    playingMedia.current.delete(event.target as HTMLMediaElement);
    setPlaying(playingMedia.current.size > 0);
  };
  const videoCompose = isVideoComposePowerType(
    result.node.power,
    result.node.kind,
    result.node.outputType,
  );
  const width = Math.max(1, result.node.width);
  const height = Math.max(1, result.node.height);
  return (
    <div
      ref={ref}
      role="group"
      tabIndex={0}
      className={`ws-storyboard-workspace-result${videoCompose ? " is-video-compose" : ""} is-${result.status} ${
        selected ? "is-selected" : ""
      } nodrag nopan`}
      style={
        variant === "detail"
          ? { width, height }
          : videoCompose
            ? { height }
            : { aspectRatio: `${width} / ${height}` }
      }
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      onPlayCapture={(event) => {
        playingMedia.current.add(event.target as HTMLMediaElement);
        setPlaying(true);
      }}
      onPauseCapture={stopPlaying}
      onEndedCapture={stopPlaying}
      onClick={(event) => {
        event.stopPropagation();
        if (
          (event.target as HTMLElement).closest(
            "button, a, video, input, textarea, select, [contenteditable]",
          )
        ) {
          return;
        }
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
      {visible || selected || focused || playing
        ? renderNode(result.node, selected)
        : null}
    </div>
  );
});

function storyboardWorkspaceGroupActive(group: StoryboardWorkspaceGroupData) {
  return group.status === "running" || group.status === "waiting";
}

function storyboardWorkspaceGroupRunLabel(group: StoryboardWorkspaceGroupData) {
  if (group.runnableCount > 0 && group.completedCount >= group.runnableCount) {
    return `重新执行${group.title}`;
  }
  return group.completedCount > 0
    ? `继续执行${group.title}`
    : `执行${group.title}`;
}

function storyboardWorkspaceGroupStatus(group: StoryboardWorkspaceGroupData) {
  if (group.stopping) return "停止中";
  if (group.status === "running") return "执行中";
  if (group.status === "waiting") return "等待反馈";
  if (group.status === "error") {
    return group.failedCount > 0 ? `失败 ${group.failedCount}` : "执行失败";
  }
  if (group.runBlockedReason) return "等待前置";
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
