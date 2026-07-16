import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileAudio,
  FileSearch,
  Film,
  Image as ImageIcon,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  canvasAssetNodeTypeLabel,
  canvasAssetNodeTypeOptions,
  type CanvasAssetEntry,
  type CanvasAssetNodeType,
} from "./space-asset-index";
import type { AssetCate, ProjectAsset, SpaceCanvasNode } from "./types";

export type AssetViewerMode = "browse" | "select" | "detail";

type AssetWorkspacePanelProps = {
  activeCate: AssetCate;
  hasAssetCates: boolean;
  entries: CanvasAssetEntry[];
  onClose: () => void;
  onOpenNode: (node: SpaceCanvasNode) => void;
  onOpenAsset: (asset: ProjectAsset) => void;
  renderAssetDetail: (input: AssetDetailRenderInput) => ReactNode;
};

export type AssetDetailRenderInput = {
  activeCate: AssetCate;
  asset: ProjectAsset | null;
  mode: AssetViewerMode;
  onPickAsset?: () => void;
};

const MATERIAL_PAGE_SIZE = 24;
const CONTENT_PAGE_SIZE = 18;

export function AssetWorkspacePanel(props: AssetWorkspacePanelProps) {
  return (
    <WorkspaceSurface className="ws-asset-workspace">
      <AssetCenter {...props} />
    </WorkspaceSurface>
  );
}

export function WorkspaceSurface({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`ws-workspace-overlay ${className || ""}`.trim()}>
      {children}
    </div>
  );
}

function AssetCenter({
  activeCate,
  hasAssetCates,
  entries,
  onClose,
  onOpenNode,
  onOpenAsset,
  renderAssetDetail,
}: AssetWorkspacePanelProps) {
  const contents = useMemo(
    () => entries.filter((entry) => entry.role === "content"),
    [entries],
  );
  const materials = useMemo(
    () => entries.filter((entry) => entry.role === "material"),
    [entries],
  );
  const [tab, setTab] = useState<"content" | "material">(
    hasAssetCates ? "content" : "material",
  );

  useEffect(() => {
    setTab(hasAssetCates ? "content" : "material");
  }, [activeCate.id, hasAssetCates]);

  const singleContent = activeCate.cardinality === "single";

  return (
    <section className="ws-asset-center">
      <header className="ws-asset-center-head">
        <div className="ws-asset-center-title">
          <strong>资产</strong>
          <span>{activeCate.name || "当前画布"}</span>
        </div>
        {hasAssetCates ? (
          <div className="ws-asset-primary-tabs" role="tablist">
            <button
              type="button"
              className={tab === "content" ? "is-active" : ""}
              onClick={() => setTab("content")}
            >
              内容
              <small>{contents.length}</small>
            </button>
            <button
              type="button"
              className={tab === "material" ? "is-active" : ""}
              onClick={() => setTab("material")}
            >
              素材
              <small>{materials.length}</small>
            </button>
          </div>
        ) : (
          <strong className="ws-asset-material-heading">素材</strong>
        )}
        <button
          type="button"
          className="ws-asset-center-close"
          onClick={onClose}
          aria-label="关闭资产中心"
        >
          <X size={19} />
        </button>
      </header>

      <div className="ws-asset-center-body">
        {tab === "content" && hasAssetCates ? (
          singleContent ? (
            renderAssetDetail({
              activeCate,
              asset: contents[0]?.asset || null,
              mode: "browse",
            })
          ) : (
            <ContentAssetGrid
              entries={contents}
              onOpen={(entry) => entry.asset && onOpenAsset(entry.asset)}
            />
          )
        ) : (
          <MaterialAssetGrid entries={materials} onOpenNode={onOpenNode} />
        )}
      </div>
    </section>
  );
}

function ContentAssetGrid({
  entries,
  onOpen,
}: {
  entries: CanvasAssetEntry[];
  onOpen: (entry: CanvasAssetEntry) => void;
}) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(entries.length / CONTENT_PAGE_SIZE));
  const pageEntries = entries.slice(
    (page - 1) * CONTENT_PAGE_SIZE,
    page * CONTENT_PAGE_SIZE,
  );
  useEffect(() => setPage(1), [entries.length]);
  return (
    <div className="ws-asset-browser">
      <div className="ws-asset-browser-summary">
        <strong>最终内容</strong>
        <span>{entries.length} 项</span>
      </div>
      {pageEntries.length ? (
        <div className="ws-asset-card-grid">
          {pageEntries.map((entry) => (
            <AssetCard
              key={entry.key}
              entry={entry}
              onClick={() => onOpen(entry)}
            />
          ))}
        </div>
      ) : (
        <AssetGridEmpty
          title="暂无最终内容"
          description="保存节点生成的内容会显示在这里。"
        />
      )}
      <AssetPagination page={page} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}

function MaterialAssetGrid({
  entries,
  onOpenNode,
}: {
  entries: CanvasAssetEntry[];
  onOpenNode: (node: SpaceCanvasNode) => void;
}) {
  const [type, setType] = useState<"all" | CanvasAssetNodeType>("all");
  const [groupId, setGroupId] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const groups = useMemo(() => {
    const values = new Map<string, string>();
    entries.forEach((entry) => {
      if (entry.groupId)
        values.set(entry.groupId, entry.groupTitle || "未命名分组");
    });
    return [...values.entries()];
  }, [entries]);
  const filtered = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return entries.filter((entry) => {
      if (type !== "all" && entry.nodeType !== type) return false;
      if (groupId === "ungrouped" && entry.groupId) return false;
      if (
        groupId !== "all" &&
        groupId !== "ungrouped" &&
        entry.groupId !== groupId
      )
        return false;
      return (
        !search ||
        `${entry.title} ${entry.sourcePath || ""}`
          .toLowerCase()
          .includes(search)
      );
    });
  }, [entries, groupId, keyword, type]);
  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / MATERIAL_PAGE_SIZE),
  );
  const pageEntries = filtered.slice(
    (page - 1) * MATERIAL_PAGE_SIZE,
    page * MATERIAL_PAGE_SIZE,
  );

  useEffect(() => setPage(1), [groupId, keyword, type]);

  return (
    <div className="ws-asset-browser">
      <div className="ws-asset-filter-row">
        <div className="ws-asset-type-tabs" role="tablist">
          {canvasAssetNodeTypeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={type === option.key ? "is-active" : ""}
              onClick={() => setType(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="ws-asset-filter-actions">
          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
          >
            <option value="all">全部分组</option>
            <option value="ungrouped">未分组</option>
            {groups.map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
          <label className="ws-asset-search">
            <Search size={16} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索节点素材"
            />
          </label>
        </div>
      </div>
      <div className="ws-asset-browser-summary">
        <strong>
          {type === "all" ? "全部素材" : canvasAssetNodeTypeLabel(type)}
        </strong>
        <span>{filtered.length} 个节点</span>
      </div>
      {pageEntries.length ? (
        <div className="ws-asset-card-grid">
          {pageEntries.map((entry) => (
            <AssetCard
              key={entry.key}
              entry={entry}
              onClick={() => entry.node && onOpenNode(entry.node)}
            />
          ))}
        </div>
      ) : (
        <AssetGridEmpty
          title="没有匹配的素材"
          description="调整节点类型、分组或搜索关键词。"
        />
      )}
      <AssetPagination page={page} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}

function AssetCard({
  entry,
  onClick,
}: {
  entry: CanvasAssetEntry;
  onClick: () => void;
}) {
  return (
    <button type="button" className="ws-asset-card" onClick={onClick}>
      <div className="ws-asset-card-preview">
        {entry.preview.imageUrl ? (
          <img src={entry.preview.imageUrl} alt={entry.title} />
        ) : entry.preview.videoUrl ? (
          <video
            src={entry.preview.videoUrl}
            muted
            playsInline
            preload="metadata"
          />
        ) : entry.preview.audioUrl ? (
          <div className="ws-asset-card-placeholder is-audio">
            <FileAudio size={30} />
          </div>
        ) : entry.preview.text ? (
          <p>{entry.preview.text}</p>
        ) : (
          <div className="ws-asset-card-placeholder">
            {entry.nodeType === "image" ? (
              <ImageIcon size={30} />
            ) : entry.nodeType === "video" ? (
              <Film size={30} />
            ) : (
              <Sparkles size={30} />
            )}
            <span>等待生成</span>
          </div>
        )}
        <AssetStatus status={entry.status} />
      </div>
      <div className="ws-asset-card-meta">
        <strong>{entry.title}</strong>
        <span>
          {entry.sourcePath ||
            (entry.nodeNo
              ? `节点 ${entry.nodeNo}`
              : canvasAssetNodeTypeLabel(entry.nodeType))}
        </span>
      </div>
      <small className="ws-asset-card-kind">
        {canvasAssetNodeTypeLabel(entry.nodeType)}
      </small>
    </button>
  );
}

function AssetStatus({ status }: { status: CanvasAssetEntry["status"] }) {
  if (status === "ready")
    return (
      <span className="ws-asset-card-status is-ready">
        <CheckCircle2 size={13} />
        已生成
      </span>
    );
  if (status === "running")
    return (
      <span className="ws-asset-card-status is-running">
        <Loader2 size={13} />
        生成中
      </span>
    );
  if (status === "failed")
    return (
      <span className="ws-asset-card-status is-failed">
        <CircleAlert size={13} />
        失败
      </span>
    );
  return <span className="ws-asset-card-status">未生成</span>;
}

function AssetGridEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="ws-asset-grid-empty">
      <FileSearch size={34} />
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}

function AssetPagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="ws-asset-pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="上一页"
      >
        <ChevronLeft size={17} />
      </button>
      <span>
        {page} / {pageCount}
      </span>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        aria-label="下一页"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

export function assetRoleForView(
  asset: ProjectAsset | null | undefined,
  activeCate: AssetCate,
): "content" | "material" {
  const role = String(asset?.role || "").toLowerCase();
  if (role === "content" || role === "material") return role;
  if (!asset) return "material";
  return String(activeCate.kind || "").toLowerCase() ===
    String(asset.kind || "").toLowerCase()
    ? "content"
    : "material";
}

export function EmptyAssetDetail({
  activeCate,
  text = "暂无可查看内容",
}: {
  activeCate: AssetCate;
  text?: string;
}) {
  return (
    <AssetGridEmpty
      title={text || `暂无${activeCate.name}内容`}
      description="保存节点生成的最终内容会显示在这里。"
    />
  );
}

export function AssetPickerButton({
  onPickAsset,
}: {
  onPickAsset: () => void;
}) {
  return (
    <button type="button" onClick={onPickAsset}>
      <CheckCircle2 size={14} />
      <span>使用</span>
    </button>
  );
}
