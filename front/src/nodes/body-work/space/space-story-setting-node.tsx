import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AlertCircle, ChevronDown, Loader2, Play, Square, Users } from "lucide-react";
import { settingNodeDocument } from "./space-setting-model";
import { StoryboardMaterialDialog } from "./space-storyboard-material-dialog";
import { STORYBOARD_MATERIAL_LABELS } from "./space-storyboard-material";
import { createStoryboardMaterial, type StoryboardMaterial } from "./space-storyboard";
import type {
  StoryboardWorkspaceData,
  StoryboardWorkspaceGroupData,
  WorkspaceNodeData,
} from "./space-node-runtime";
import { StoryboardSettingGallery, useStoryboardResultEditor } from "./space-storyboard-workspace";
import "./space-story-setting-node.css";

const SETTING_TYPES = ["character", "scene", "prop"] as const;

export function StorySettingNodeContent({ workspace, readonly, node }: {
  workspace?: StoryboardWorkspaceData;
  readonly: boolean;
  node: WorkspaceNodeData;
}) {
  const [editing, setEditing] = useState<{ material: StoryboardMaterial; creating: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const document = settingNodeDocument(node);
  const groups = workspace?.groups || [];
  const running = Boolean(workspace?.running);
  const onReplaceImage = readonly || running ? undefined : node.onReplaceSettingImage;
  const { selectedNodeId, openResult, editor } = useStoryboardResultEditor(
    groups.flatMap((group) => group.results),
    onReplaceImage,
  );
  const pending = workspace ? workspace.workNodeCount - workspace.completedCount : 0;

  const saveMaterial = async (material: StoryboardMaterial, creating: boolean) => {
    if (!document) return;
    setSaving(true);
    setError("");
    try {
      await node.onSettingMaterials(node.id, creating
        ? [...document.materials, material]
        : document.materials.map((entry) => entry.id === material.id ? material : entry));
      setEditing(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "保存设定失败");
    } finally {
      setSaving(false);
    }
  };

  const status = running
    ? { text: workspace?.currentNodeTitle ? `正在生成 ${workspace.currentNodeTitle}…` : "正在生成形象…", tone: "running" }
    : error
      ? { text: error, tone: "error" }
      : workspace?.runBlockedReason && pending > 0
        ? { text: workspace.runBlockedReason, tone: "muted" }
        : null;

  return (
    <section className="ws-story-setting nodrag-content" aria-label="设定">
      <header className="ws-story-setting-header">
        <span className="ws-story-setting-title">
          <Users size={15} aria-hidden="true" />
          <strong>设定</strong>
          {workspace && workspace.workNodeCount > 0 ? (
            <small>{workspace.completedCount}/{workspace.workNodeCount} 已生成</small>
          ) : null}
        </span>
        {workspace ? (
          <StorySettingRunAction workspace={workspace} groups={groups} pending={pending} readonly={readonly} />
        ) : null}
      </header>

      {status ? (
        <p className={`ws-story-setting-status is-${status.tone}`} role={status.tone === "error" ? "alert" : "status"}>
          {status.tone === "running" ? <Loader2 size={12} className="ws-spin" /> : null}
          {status.tone === "error" ? <AlertCircle size={12} /> : null}
          <span>{status.text}</span>
        </p>
      ) : null}

      {!document && !workspace ? (
        <div className="ws-story-setting-empty">
          <Users size={20} aria-hidden="true" />
          <strong>还没有设定</strong>
          <span>在下方描述人物、场景和道具，AI 会整理设定并生成形象</span>
        </div>
      ) : (
        <StoryboardSettingGallery
          groups={groups}
          variant="canvas"
          mediaAspect={document?.aspect_ratio}
          renderNode={workspace?.renderNode || (() => null)}
          selectedNodeId={selectedNodeId}
          onOpenResult={openResult}
          materials={document?.materials}
          materialActions={document && !readonly ? {
            disabled: running || saving,
            onEdit: (material) => setEditing({ material, creating: false }),
            onAdd: (type) => setEditing({ material: createStoryboardMaterial(document.materials, type), creating: true }),
          } : undefined}
        />
      )}

      {editing && document ? (
        <StoryboardMaterialDialog material={editing.material} creating={editing.creating}
          readonly={readonly || saving} context="setting"
          loadVoiceOptions={node.onLoadVoiceOptions}
          existingNames={document.materials.filter((material) => material.id !== editing.material.id).map((material) => material.name)}
          onClose={() => setEditing(null)}
          onSave={(material) => void saveMaterial(material, editing.creating)} />
      ) : null}
      {editor}
    </section>
  );
}

// 设定节点的整体执行：有未生成的形象时一次生成全部，全部完成后按分类重做。
function StorySettingRunAction({ workspace, groups, pending, readonly }: {
  workspace: StoryboardWorkspaceData;
  groups: StoryboardWorkspaceGroupData[];
  pending: number;
  readonly: boolean;
}) {
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

  if (workspace.running) {
    return (
      <button type="button" className="ws-setting-gallery-action nodrag nopan"
        disabled={readonly || workspace.stopping || !workspace.onStop}
        onClick={stopAnd(() => workspace.onStop?.())}>
        {workspace.stopping ? <Loader2 size={13} className="ws-spin" /> : <Square size={11} fill="currentColor" />}
        {workspace.stopping ? "停止中" : "停止"}
      </button>
    );
  }
  if (pending > 0) {
    return (
      <button type="button" className="ws-setting-gallery-action is-primary nodrag nopan"
        disabled={readonly || Boolean(workspace.runBlockedReason)}
        title={workspace.runBlockedReason || undefined}
        onClick={stopAnd(workspace.onRun)}>
        <Play size={11} fill="currentColor" />生成形象
      </button>
    );
  }
  const regenerable = SETTING_TYPES.flatMap((type) => {
    const onRun = groups.find((entry) => entry.materialType === type)?.onRun;
    return onRun ? [{ type, onRun }] : [];
  });
  if (regenerable.length === 0) return null;
  return (
    <div ref={menuRef} className="ws-setting-gallery-menu nodrag nopan">
      <button type="button" className="ws-setting-gallery-action" disabled={readonly}
        aria-expanded={menuOpen} onClick={stopAnd(() => setMenuOpen((open) => !open))}>
        重新生成<ChevronDown size={12} />
      </button>
      {menuOpen ? (
        <div role="menu">
          {regenerable.map(({ type, onRun }) => (
            <button key={type} type="button" role="menuitem"
              onClick={stopAnd(() => { setMenuOpen(false); onRun(); })}>
              重做全部{STORYBOARD_MATERIAL_LABELS[type]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
