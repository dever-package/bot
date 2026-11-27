import { ChevronDown, FileText, Image as ImageIcon, Link2, List, Loader2, Pencil, Play, Plus, Square, Users } from "lucide-react";
import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
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
  StoryboardWorkspaceData,
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
import { STORYBOARD_MATERIAL_LABELS } from "./space-storyboard-material";
import type { StoryboardMaterial, StoryboardMaterialType } from "./space-storyboard";

export const STORYBOARD_SCRIPT_SECTION_ID = "storyboard-script";
export const STORYBOARD_SETTING_SECTION_ID = "storyboard-setting";
const SETTING_SECTIONS = ["character", "scene", "prop"] as const;

type StoryboardWorkspaceProps = {
  activeSectionId: string;
  groups: StoryboardWorkspaceGroupData[];
  scriptContent: ReactNode;
  renderNode: (node: WorkspaceNodeData, selected: boolean) => ReactNode;
  onActiveSectionChange: (sectionId: string) => void;
  variant?: "canvas" | "detail";
  settingOnly?: boolean;
  onReplaceImage?: (nodeId: string) => void;
  onReferenceResult?: StoryboardWorkspaceData["onReferenceResult"];
  settingSource?: { title: string; onOpen: () => void };
  settings?: StoryboardWorkspaceSettings;
  /** 画面比例，如 "16:9"；未提供时卡片沿用节点尺寸比例。 */
  mediaAspect?: string;
};

export function StoryboardWorkspace({
  activeSectionId,
  groups,
  scriptContent,
  renderNode,
  onActiveSectionChange,
  variant = "canvas",
  settingOnly = false,
  onReplaceImage,
  onReferenceResult,
  settingSource,
  settings,
  mediaAspect,
}: StoryboardWorkspaceProps) {
  const selectedGroup = groups.find((group) => group.id === activeSectionId);
  const { selectedNodeId, openResult, closeEditor, editor } = useStoryboardResultEditor(
    (settingOnly || activeSectionId === STORYBOARD_SETTING_SECTION_ID
      ? groups.filter((group) => group.materialType)
      : selectedGroup ? [selectedGroup] : []
    ).flatMap((group) => group.results),
    onReplaceImage,
  );

  useEffect(() => {
    if (
      settingOnly ||
      activeSectionId === STORYBOARD_SCRIPT_SECTION_ID ||
      activeSectionId === STORYBOARD_SETTING_SECTION_ID ||
      groups.some((group) => !group.materialType && group.id === activeSectionId)
    ) {
      return;
    }
    onActiveSectionChange(STORYBOARD_SCRIPT_SECTION_ID);
  }, [activeSectionId, groups, onActiveSectionChange, settingOnly]);

  const selectSection = (sectionId: string) => {
    closeEditor();
    onActiveSectionChange(sectionId);
  };

  return (
    <div
      className={`ws-storyboard-workspace is-${variant}${settingOnly ? " is-setting-only" : ""} nodrag nopan nowheel`}
    >
      {settingOnly ? (
        <StoryboardSettingGallery groups={groups} variant={variant} runAction
          renderNode={renderNode} selectedNodeId={selectedNodeId} onOpenResult={openResult} onReferenceResult={onReferenceResult} {...settings} />
      ) : (
        <>
          <nav className="ws-storyboard-workspace-menu" aria-label="分镜制作菜单">
            <button
              type="button"
              className={`ws-storyboard-workspace-script ${
                activeSectionId === STORYBOARD_SCRIPT_SECTION_ID ? "is-selected" : ""
              }`}
              aria-current={activeSectionId === STORYBOARD_SCRIPT_SECTION_ID ? "page" : undefined}
              onClick={stopAnd(() => selectSection(STORYBOARD_SCRIPT_SECTION_ID))}
            >
              <span>
                <strong>{variant === "detail" ? "镜头列表" : "分镜脚本"}</strong>
              </span>
              {variant === "detail" ? <List size={14} /> : <FileText size={14} />}
            </button>
            <button
              type="button"
              className={"ws-storyboard-workspace-script " + (activeSectionId === STORYBOARD_SETTING_SECTION_ID ? "is-selected" : "")}
              aria-current={activeSectionId === STORYBOARD_SETTING_SECTION_ID ? "page" : undefined}
              onClick={stopAnd(() => selectSection(STORYBOARD_SETTING_SECTION_ID))}
            >
              <span><strong>设定</strong><small>{settingSource ? "共用设定" : "角色、场景、道具"}</small></span>
              <Users size={14} />
            </button>
            {groups.filter((group) => !group.materialType).map((group) => (
              <StoryboardWorkspaceGroupRow
                key={group.id}
                group={group}
                selected={group.id === activeSectionId}
                onSelect={() => selectSection(group.id)}
              />
            ))}
          </nav>

          {activeSectionId === STORYBOARD_SETTING_SECTION_ID ? (
            <section className="ws-storyboard-workspace-setting">
              {settingSource && <button type="button" className="ws-storyboard-setting-source"
                onClick={stopAnd(settingSource.onOpen)}>共用设定 · {settingSource.title} ↗</button>}
              <StoryboardSettingGallery groups={groups} variant={variant} runAction
                renderNode={renderNode} selectedNodeId={selectedNodeId} onOpenResult={openResult} onReferenceResult={onReferenceResult} {...settings} />
            </section>
          ) : activeSectionId === STORYBOARD_SCRIPT_SECTION_ID ? (
            <section key={STORYBOARD_SCRIPT_SECTION_ID} className="ws-storyboard-workspace-content is-script">
              {scriptContent}
            </section>
          ) : (
            <StoryboardWorkspaceResultList
              group={selectedGroup}
              mediaAspect={mediaAspect}
              renderNode={renderNode}
              selectedNodeId={selectedNodeId}
              onOpenResult={openResult}
            />
          )}
        </>
      )}

      {editor}
    </div>
  );
}

/** 结果卡片的参数弹层：点击卡片在旁边打开节点参数，点外部或 Esc 关闭。 */
export function useStoryboardResultEditor(
  results: StoryboardWorkspaceResultData[],
  onReplaceImage?: (nodeId: string) => void,
) {
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [editorPosition, setEditorPosition] = useState<{
    left: number;
    top: number;
    maxHeight: number;
  } | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const selectedResult = results.find((result) => result.nodeId === selectedNodeId);

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
  const closeEditor = useCallback(() => setSelectedNodeId(""), []);
  const editor = selectedResult && editorPosition
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
                  onReplaceImage={onReplaceImage ? () => {
                    onReplaceImage(selectedResult.nodeId);
                    setSelectedNodeId("");
                  } : undefined}
                />
              </Suspense>
            </div>,
            anchorRef.current?.closest(".wb-detail-backdrop") ||
              anchorRef.current?.closest(".ws-page") ||
              document.body,
          )
        : null;
  return { selectedNodeId, openResult, closeEditor, editor };
}

export function SettingWorkspace({ groups, renderNode, variant = "canvas", onReplaceImage, onReferenceResult, settings }: Pick<StoryboardWorkspaceProps, "groups" | "renderNode" | "variant" | "onReplaceImage" | "onReferenceResult" | "settings">) {
  return <StoryboardWorkspace settingOnly onReplaceImage={onReplaceImage} onReferenceResult={onReferenceResult} groups={groups} renderNode={renderNode} settings={settings}
    variant={variant} activeSectionId="" onActiveSectionChange={() => undefined}
    scriptContent={null} />;
}

type ResultOpener = (result: StoryboardWorkspaceResultData, anchor: HTMLDivElement) => void;

export type SettingGalleryMaterialActions = {
  disabled: boolean;
  onEdit: (material: StoryboardMaterial) => void;
  onAdd: (type: StoryboardMaterialType) => void;
};

const EMPTY_MATERIALS: StoryboardMaterial[] = [];

export type StoryboardWorkspaceSettings = {
  defaultType?: StoryboardMaterialType;
  materials?: StoryboardMaterial[];
  materialActions?: SettingGalleryMaterialActions;
};

const VIEWPORT_ROOT = { current: null };

const EMPTY_GROUPS: StoryboardWorkspaceGroupData[] = [];

type SettingGalleryItem = {
  key: string;
  name: string;
  material?: StoryboardMaterial;
  result?: StoryboardWorkspaceResultData;
};

export function StoryboardSettingGallery({
  groups,
  variant,
  renderNode,
  selectedNodeId,
  onOpenResult,
  onReferenceResult,
  materials = EMPTY_MATERIALS,
  materialActions,
  runAction = false,
  defaultType = "character",
}: {
  groups: StoryboardWorkspaceGroupData[];
  variant: "canvas" | "detail";
  renderNode: StoryboardWorkspaceProps["renderNode"];
  selectedNodeId: string;
  onOpenResult: ResultOpener;
  onReferenceResult?: StoryboardWorkspaceData["onReferenceResult"];
  materials?: StoryboardMaterial[];
  materialActions?: SettingGalleryMaterialActions;
  runAction?: boolean;
  defaultType?: StoryboardMaterialType;
}) {
  const [activeType, setActiveType] = useState<StoryboardMaterialType>(defaultType);
  const gridRef = useRef<HTMLDivElement>(null);
  const typeGroup = (type: StoryboardMaterialType) => groups.find((group) => group.materialType === type);
  const activeGroup = typeGroup(activeType);
  const items = settingGalleryItems(materials.filter((material) => material.type === activeType), activeGroup);
  const category = STORYBOARD_MATERIAL_LABELS[activeType];
  return (
    <div className={`ws-setting-gallery is-${variant}`}>
      <div className="ws-setting-gallery-bar">
        <nav className="ws-setting-gallery-tabs nodrag nopan" aria-label="设定分类">
          {SETTING_SECTIONS.map((type) => {
            const group = typeGroup(type);
            const count = materials.filter((material) => material.type === type).length || group?.memberCount || 0;
            return (
              <button key={type} type="button" aria-pressed={activeType === type} data-storyboard-material-type={type}
                className={group?.status === "error" ? "is-error" : storyboardWorkspaceGroupActiveOrUndefined(group) ? "is-running" : undefined}
                onClick={stopAnd(() => setActiveType(type))}>
                {STORYBOARD_MATERIAL_LABELS[type]}
                <em>{group ? `${group.completedCount}/${group.runnableCount || group.memberCount}` : count}</em>
              </button>
            );
          })}
        </nav>
        {materialActions || runAction ? (
          <div className="ws-setting-gallery-actions">
            {materialActions ? (
              <button type="button" className="ws-setting-gallery-action nodrag nopan" disabled={materialActions.disabled}
                onClick={stopAnd(() => materialActions.onAdd(activeType))}>
                <Plus size={14} aria-hidden="true" />
                添加{category}
              </button>
            ) : null}
            {runAction ? <SettingGalleryRunAction groups={groups} /> : null}
          </div>
        ) : null}
      </div>
      {activeGroup?.runBlockedReason && !storyboardWorkspaceGroupActive(activeGroup) ? (
        <p className="ws-setting-gallery-note">{activeGroup.runBlockedReason}</p>
      ) : null}
      <div ref={gridRef} className="ws-setting-gallery-grid nodrag nopan nowheel">
        <CanvasNodeVisibilityProvider root={gridRef} rootMargin="160px">
          <div className="ws-setting-gallery-cards">
            {items.map(({ key, name, material, result }) => (
              <StoryboardPictureCard
                key={key}
                name={name}
                result={result}
                selected={selectedNodeId === result?.nodeId}
                renderNode={renderNode}
                onOpenResult={onOpenResult}
                actions={<>
                  {result && onReferenceResult ? (
                    <SpaceTooltip label="引用该素材生成">
                      <button type="button" className="ws-setting-gallery-edit nodrag nopan" aria-label={"引用" + name + "生成"}
                        onClick={(event) => {
                          event.stopPropagation();
                          const rect = event.currentTarget.getBoundingClientRect();
                          onReferenceResult(result.nodeId, { x: rect.right, y: rect.bottom });
                        }}>
                        <Link2 size={14} aria-hidden="true" />
                      </button>
                    </SpaceTooltip>
                  ) : null}
                  {material && materialActions ? (
                  <button type="button" className="ws-setting-gallery-edit nodrag nopan" aria-label={"编辑" + name + "的描述"}
                    disabled={materialActions.disabled}
                    onClick={stopAnd(() => materialActions.onEdit(material))}>
                    <Pencil size={12} aria-hidden="true" />
                    编辑
                  </button>
                  ) : null}
                </>}
              />
            ))}
            {items.length === 0 ? <p className="ws-setting-gallery-empty">暂无{category}</p> : null}
          </div>
        </CanvasNodeVisibilityProvider>
      </div>
    </div>
  );
}

// 按分类执行：有分组在执行时显示停止，否则下拉选择生成或重做哪一类。
function SettingGalleryRunAction({ groups }: { groups: StoryboardWorkspaceGroupData[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as globalThis.Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close, true);
    return () => document.removeEventListener("pointerdown", close, true);
  }, [menuOpen]);
  const settingGroups = SETTING_SECTIONS.flatMap((type) => {
    const group = groups.find((entry) => entry.materialType === type);
    return group ? [{ type, group }] : [];
  });
  const active = settingGroups.find(({ group }) => storyboardWorkspaceGroupActive(group))?.group;
  if (active) {
    return (
      <button type="button" className="ws-setting-gallery-action nodrag nopan"
        disabled={active.stopping || !active.onStop} onClick={stopAnd(() => active.onStop?.())}>
        {active.stopping || !active.onStop ? <Loader2 size={13} className="ws-spin" /> : <Square size={11} fill="currentColor" />}
        {active.stopping ? "停止中" : active.onStop ? "停止" : "执行中"}
      </button>
    );
  }
  if (settingGroups.length === 0) return null;
  const incomplete = settingGroups.some(({ group }) => group.completedCount < (group.runnableCount || group.memberCount));
  return (
    <div ref={menuRef} className="ws-setting-gallery-menu nodrag nopan">
      <button type="button" className={`ws-setting-gallery-action${incomplete ? " is-primary" : ""}`}
        aria-expanded={menuOpen} onClick={stopAnd(() => setMenuOpen((open) => !open))}>
        {incomplete ? <Play size={11} fill="currentColor" /> : null}
        {incomplete ? "生成形象" : "重新生成"}<ChevronDown size={12} />
      </button>
      {menuOpen ? (
        <div role="menu">
          {settingGroups.map(({ type, group }) => (
            <SpaceTooltip key={type} label={group.runBlockedReason || storyboardWorkspaceGroupRunLabel({ ...group, title: STORYBOARD_MATERIAL_LABELS[type] })}>
              <button type="button" role="menuitem" disabled={!group.onRun}
                onClick={stopAnd(() => { setMenuOpen(false); group.onRun?.(); })}>
                {settingGalleryRunText(group, STORYBOARD_MATERIAL_LABELS[type])}
              </button>
            </SpaceTooltip>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function settingGalleryRunText(group: StoryboardWorkspaceGroupData, label: string) {
  const total = group.runnableCount || group.memberCount;
  if (total > 0 && group.completedCount >= total) return `重做全部${label}`;
  return group.completedCount > 0 ? `继续生成${label}` : `生成${label}`;
}

function storyboardWorkspaceGroupActiveOrUndefined(group?: StoryboardWorkspaceGroupData) {
  return group ? storyboardWorkspaceGroupActive(group) : false;
}

// 以设定文字中的素材为准排列，形象节点按条目 ID 对上；尚未生成的素材显示为待生成。
function settingGalleryItems(materials: StoryboardMaterial[], group?: StoryboardWorkspaceGroupData): SettingGalleryItem[] {
  const results = group?.results || [];
  const matched = new Set<string>();
  const items: SettingGalleryItem[] = materials.map((material) => {
    const result = results.find((entry) => entry.node.storyboardItem?.itemId === material.id);
    if (result) matched.add(result.nodeId);
    return { key: material.id, name: material.name || "未命名", material, result };
  });
  for (const result of results) {
    if (!matched.has(result.nodeId)) items.push({ key: result.nodeId, name: result.node.title || "未命名", result });
  }
  return items;
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
  const total = group.runnableCount || group.memberCount;
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
        aria-label={`${group.title}，已完成 ${group.completedCount}/${total}${status ? `，${status}` : ""}`}
        aria-current={selected ? "page" : undefined}
        onClick={stopAnd(onSelect)}
      >
        <span>
          <strong>{group.title}</strong>
          {status ? <small role="status">{status}</small> : null}
        </span>
        <em>
          {group.completedCount}/{total}
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

export function StoryboardWorkspaceResultList({
  group,
  mediaAspect,
  renderNode,
  selectedNodeId,
  onOpenResult,
}: {
  group?: StoryboardWorkspaceGroupData;
  mediaAspect?: string;
  renderNode: (node: WorkspaceNodeData, selected: boolean) => ReactNode;
  selectedNodeId: string;
  onOpenResult: ResultOpener;
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
            <div className="ws-storyboard-preview-grid">
              {group.results.map((result) => (
                <StoryboardWorkspaceResult
                  key={result.nodeId}
                  result={result}
                  mediaAspect={mediaAspect}
                  selected={selectedNodeId === result.nodeId}
                  renderNode={renderNode}
                  onOpenResult={onOpenResult}
                />
              ))}
            </div>
          </CanvasNodeVisibilityProvider>
        </div>
      ) : (
        <div className="ws-storyboard-workspace-result-empty">
          <FileText size={18} />
          <span>这一组还没有内容</span>
          <small>确认分镜脚本后会自动生成镜头图和视频</small>
        </div>
      )}
    </section>
  );
}

const PICTURE_STATUS_LABELS = {
  pending: "待生成",
  running: "生成中",
  waiting: "等待反馈",
  complete: "",
  error: "生成失败",
} as const;

function StoryboardPictureCard({
  name,
  result,
  mediaAspect,
  selected,
  renderNode,
  onOpenResult,
  actions,
}: {
  name: string;
  result?: StoryboardWorkspaceResultData;
  mediaAspect?: string;
  selected: boolean;
  renderNode: StoryboardWorkspaceProps["renderNode"];
  onOpenResult: ResultOpener;
  actions?: ReactNode;
}) {
  const status = result?.status ?? "pending";
  const statusLabel = PICTURE_STATUS_LABELS[status];
  return (
    <div className="ws-storyboard-picture-card" data-status={status}>
      {result ? (
        <StoryboardWorkspaceResult result={result} mediaAspect={mediaAspect} selected={selected}
          renderNode={renderNode} onOpenResult={onOpenResult} />
      ) : (
        <div className="ws-storyboard-picture-placeholder" aria-hidden="true"><ImageIcon size={20} /></div>
      )}
      <div className="ws-storyboard-picture-caption">
        <div>
          <strong>{name}</strong>
          {statusLabel ? <small>{statusLabel}</small> : null}
        </div>
        {actions}
      </div>
    </div>
  );
}

const StoryboardWorkspaceResult = memo(function StoryboardWorkspaceResult({
  result,
  mediaAspect,
  selected,
  renderNode,
  onOpenResult,
}: {
  result: StoryboardWorkspaceResultData;
  mediaAspect?: string;
  selected: boolean;
  renderNode: StoryboardWorkspaceProps["renderNode"];
  onOpenResult: ResultOpener;
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
      style={videoCompose ? { height } : {
        aspectRatio: `var(--ws-storyboard-preview-aspect, ${
          mediaAspect?.includes(":") ? mediaAspect.replace(":", " / ") : `${width} / ${height}`
        })`,
      }}
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
  return "";
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
