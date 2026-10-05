import { FileText, Loader2, Play, Square } from "lucide-react";
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
  } | null>(null);
  const [editorOverflowing, setEditorOverflowing] = useState(false);
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
      setEditorOverflowing(
        Boolean(editor && editor.scrollHeight > window.innerHeight - 32),
      );
      const next = storyboardEditorPosition(
        rect,
        { width: editorRect?.width || 640, height: editorRect?.height || 240 },
        { width: window.innerWidth, height: window.innerHeight },
      );
      setEditorPosition((current) =>
        current?.left === next.left && current.top === next.top ? current : next,
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
      if (event.key === "Escape") setSelectedNodeId("");
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

  const openResult = (
    result: StoryboardWorkspaceResultData,
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
    setEditorOverflowing(false);
    setSelectedNodeId(result.nodeId);
    void preloadCanvasNodeSettings();
  };

  return (
    <div
      className={`ws-storyboard-workspace is-${variant} nodrag nopan nowheel`}
    >
      <nav
        className="ws-storyboard-workspace-menu"
        aria-label="分镜制作菜单"
      >
        <button
          type="button"
          className={`ws-storyboard-workspace-script ${
            activeSectionId === STORYBOARD_SCRIPT_SECTION_ID
              ? "is-selected"
              : ""
          }`}
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
          renderNode={renderNode}
          selectedNodeId={selectedNodeId}
          onOpenResult={openResult}
        />
      )}

      {selectedResult && editorPosition
        ? createPortal(
            <div
              ref={editorRef}
              className={`ws-storyboard-workspace-editor-anchor nodrag nopan nowheel${editorOverflowing ? " is-overflowing" : ""}`}
              style={editorPosition}
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
  const action = active ? group.onStop : group.onRun;
  const actionLabel = active
    ? group.stopping
      ? "正在停止"
      : group.onStop
        ? `停止${group.title}`
        : `${group.title}正在执行`
    : group.runBlockedReason || storyboardWorkspaceGroupRunLabel(group);
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

function StoryboardWorkspaceResultList({
  group,
  renderNode,
  selectedNodeId,
  onOpenResult,
}: {
  group?: StoryboardWorkspaceGroupData;
  renderNode: (node: WorkspaceNodeData, selected: boolean) => ReactNode;
  selectedNodeId: string;
  onOpenResult: (
    result: StoryboardWorkspaceResultData,
    anchor: HTMLDivElement,
  ) => void;
}) {
  if (!group) {
    return (
      <div className="ws-storyboard-workspace-results is-empty">
        暂无制作分组
      </div>
    );
  }
  return (
    <section className="ws-storyboard-workspace-results">
      <header>
        <strong>{group.title}</strong>
        <span>{group.results.length} 项结果</span>
      </header>
      {group.results.length > 0 ? (
        <div className="ws-storyboard-workspace-result-grid">
          {group.results.map((result) => (
            <div
              key={result.nodeId}
              role="group"
              tabIndex={0}
              className={`ws-storyboard-workspace-result is-${result.status} ${
                selectedNodeId === result.nodeId ? "is-selected" : ""
              } nodrag nopan`}
              style={{
                width: Math.max(1, result.node.width),
                height: Math.max(1, result.node.height),
              }}
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
              {renderNode(result.node, selectedNodeId === result.nodeId)}
            </div>
          ))}
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

function storyboardWorkspaceGroupActive(group: StoryboardWorkspaceGroupData) {
  return group.status === "running" || group.status === "waiting";
}

function storyboardWorkspaceGroupRunLabel(
  group: StoryboardWorkspaceGroupData,
) {
  if (
    group.runnableCount > 0 &&
    group.completedCount >= group.runnableCount
  ) {
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
