import { ChevronRight, Copy, Loader2, Plus, Trash2 } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import type { StoryboardWorkspaceGroupData } from "./space-node-runtime";
import type { StoryboardReadableShot } from "./space-storyboard-preview";
import { StoryboardShotDialog } from "./space-storyboard-shot-dialog";
import type { StoryboardPromptVersion } from "./space-storyboard-shot-request";
import { MAX_STORYBOARD_SHOTS, type StoryboardDocument } from "./space-storyboard";
import { SequenceCard } from "./space-sequence-card";
import "./space-storyboard-shot-card.css";

type ShotRowActions = {
  onDuplicate?: () => void;
  onRemove?: () => void;
  onDragStart?: () => void;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
  dragging?: boolean;
  dropPlacement?: "before" | "after";
};

export function StoryboardShotList<Shot extends StoryboardReadableShot>({
  shots, storyboard, groups, promptVersion, onGenerate, onSave, onCreateRevision, onBusyChange,
  disabled = false, rowActions,
}: {
  shots: readonly Shot[];
  storyboard?: StoryboardDocument;
  groups?: StoryboardWorkspaceGroupData[];
  promptVersion?: StoryboardPromptVersion;
  onGenerate?: (shotId: string, instruction: string) => Promise<void>;
  onSave?: (document: StoryboardDocument, baseline: StoryboardDocument) => void | Promise<void>;
  onCreateRevision?: () => void | Promise<void>;
  onBusyChange?: (busy: boolean) => void;
  disabled?: boolean;
  rowActions?: (shot: Shot) => ShotRowActions;
}) {
  const [activeShotId, setActiveShotId] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [pendingShot, setPendingShot] = useState<string | null>(null);
  const [error, setError] = useState("");
  const busyRef = useRef(false);
  const busy = disabled || pendingShot !== null;
  const activeIndex = activeShotId ? storyboard?.shots.findIndex((shot) => shot.id === activeShotId) ?? -1 : -1;
  const allowAdd = Boolean((onGenerate || pendingShot === "") && shots.length < MAX_STORYBOARD_SHOTS);

  const run = async (id: string, operation: () => void | Promise<void>) => {
    if (busy || busyRef.current) throw new Error("另一个镜头操作正在进行");
    busyRef.current = true;
    setPendingShot(id);
    setError("");
    onBusyChange?.(true);
    try {
      await operation();
    } finally {
      busyRef.current = false;
      setPendingShot(null);
      onBusyChange?.(false);
    }
  };
  const add = async () => {
    if (!onGenerate || !instruction.trim()) return;
    try {
      await run("", () => onGenerate("", instruction.trim()));
      setShowAdd(false);
      setInstruction("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "镜头生成失败，请重试");
    }
  };

  return (
    <div className="ws-storyboard-shot-list nodrag nopan" aria-busy={busy || undefined}>
      <ol className="ws-storyboard-shot-grid" aria-label="镜头列表">
        {shots.map((shot, index) => {
          const actions = busy ? undefined : rowActions?.(shot);
          const number = String(index + 1).padStart(2, "0");
          const label = "镜头 " + number;
          const generating = pendingShot === shot.id;
          const openLabel = onSave ? "微调" : "提示词";
          const open = storyboard && !busy ? () => setActiveShotId(shot.id) : () => undefined;
          return (
            <li key={shot.id} className="ws-storyboard-shot-item">
              <SequenceCard
                itemId={shot.id}
                index={index}
                durationLabel={shot.duration + " 秒"}
                className="ws-storyboard-shot-row"
                dragClassName="ws-storyboard-shot-grip"
                readonly={!actions?.onDragStart}
                wholeCardDraggable
                dragging={actions?.dragging}
                dropPlacement={actions?.dropPlacement}
                ariaLabel={label}
                onSelect={open}
                onDragStart={actions?.onDragStart ?? (() => undefined)}
                onDragOver={actions?.onDragOver ?? (() => undefined)}
                onDrop={actions?.onDrop ?? (() => undefined)}
                onDragEnd={actions?.onDragEnd ?? (() => undefined)}
                headerActions={actions?.onRemove ? (
                  <button type="button" className="ws-storyboard-shot-remove" aria-label={"删除" + label} title="删除镜头"
                    onClick={(event) => { event.stopPropagation(); actions.onRemove?.(); }}><Trash2 size={12} /></button>
                ) : undefined}
              >
                <div className="ws-storyboard-shot-body">
                  <span className="ws-storyboard-shot-description">{shot.description.trim() || shot.beat.trim() || "暂无镜头描述"}</span>
                </div>
                {storyboard ? (
                  <footer>
                    <button type="button" aria-label={label + "，" + openLabel} aria-haspopup="dialog" disabled={busy}
                      onClick={(event) => { event.stopPropagation(); setActiveShotId(shot.id); }}>
                      {openLabel}<ChevronRight size={12} />
                    </button>
                    {generating ? <small role="status"><Loader2 size={12} className="ws-spin" />处理中</small> : null}
                    {actions?.onDuplicate ? (
                      <button type="button" className="ws-storyboard-shot-copy" aria-label={"复制" + label} title="复制镜头"
                        onClick={(event) => { event.stopPropagation(); actions.onDuplicate?.(); }}>
                        <Copy size={13} />
                      </button>
                    ) : null}
                  </footer>
                ) : null}
              </SequenceCard>
            </li>
          );
        })}
      </ol>
      {allowAdd && !showAdd ? (
        <button type="button" className="ws-storyboard-shot-action ws-storyboard-add-shot-button" disabled={busy}
          onClick={() => { setError(""); setShowAdd(true); }}>
          <Plus size={15} aria-hidden="true" />添加镜头
        </button>
      ) : null}
      {!shots.length && !allowAdd ? <p className="ws-storyboard-shot-list-empty">暂无镜头</p> : null}
      {allowAdd && showAdd ? <form className="ws-storyboard-add-shot" onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void add();
      }}>
        <input type="text" autoFocus value={instruction} aria-label="新镜头的一句话描述" placeholder="用一句话描述新镜头"
          onChange={(event) => setInstruction(event.target.value)} onKeyDown={(event) => event.stopPropagation()} readOnly={busy} />
        <button type="submit" className="ws-storyboard-shot-action is-primary" disabled={busy || !instruction.trim()}>
          {pendingShot === "" ? <Loader2 size={14} className="ws-spin" /> : null}
          {pendingShot === "" ? "生成中" : "生成镜头"}
        </button>
        <button type="button" className="ws-storyboard-shot-action" disabled={busy} onClick={() => setShowAdd(false)}>取消</button>
      </form> : null}
      {activeIndex >= 0 && storyboard ? (
        <StoryboardShotDialog key={activeShotId + ":" + (promptVersion?.versionId || 0) + ":" + activeIndex} storyboard={storyboard} index={activeIndex} groups={groups} promptVersion={promptVersion}
          onGenerate={onGenerate ? (prompt) => run(activeShotId, () => onGenerate(activeShotId, prompt)) : undefined}
          onSave={onSave ? (document, baseline) => run(activeShotId, () => onSave(document, baseline)) : undefined}
          onCreateRevision={onCreateRevision} onClose={() => setActiveShotId("")} />
      ) : null}
      {error ? <p className="ws-storyboard-shot-list-error" role="alert">{error}</p> : null}
    </div>
  );
}
