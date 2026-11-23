import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@dever/front-plugin";
import { ChevronDown, Clapperboard, Loader2, RotateCw } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { contentOutputMediaURLs } from "../shared/content-output";
import { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX, DetailDialogFrame, DetailDialogHeader } from "../shared/detail-dialog";
import type { StoryboardWorkspaceGroupData } from "./space-node-runtime";
import { storyboardVideoFrameBindings } from "./space-storyboard-frame-plan";
import { storyboardReferenceFieldPatch, withStoryboardShotPrompt } from "./space-storyboard-shot-edit";
import { fetchStoryboardVideoPrompt, type StoryboardPromptVersion } from "./space-storyboard-shot-request";
import {
  MIN_STORYBOARD_SHOT_DURATION,
  storyboardAutomaticShotPrompt,
  type StoryboardDocument,
  type StoryboardPromptPart,
  type StoryboardReferenceField,
  type StoryboardShot,
} from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";

type Props = {
  storyboard: StoryboardDocument;
  index: number;
  groups?: StoryboardWorkspaceGroupData[];
  promptVersion?: StoryboardPromptVersion;
  onSave?: (document: StoryboardDocument, baseline: StoryboardDocument) => void | Promise<void>;
  onGenerate?: (instruction: string) => Promise<void>;
  onCreateRevision?: () => void | Promise<void>;
  onClose: () => void;
};

const detailSections = [
  { key: "camera", label: "镜头语言" },
  { key: "image", label: "图片提示词" },
  { key: "video", label: "视频提示词" },
] as const;

export function StoryboardShotDialog({ storyboard, index, groups, promptVersion, onSave, onGenerate, onCreateRevision, onClose }: Props) {
  const [draft, setDraft] = useState(storyboard);
  const [baseline] = useState(storyboard);
  const [instruction, setInstruction] = useState("");
  const [detailSection, setDetailSection] = useState<(typeof detailSections)[number]["key"]>("camera");
  const id = useId();
  const original = baseline.shots[index];
  const shot = draft.shots[index];
  const [duration, setDuration] = useState(String(shot.duration));
  const [pending, setPending] = useState<"save" | "generate" | "revision" | "">("");
  const [error, setError] = useState("");
  const [discardOpen, setDiscardOpen] = useState(false);
  const discardReturnFocus = useRef<HTMLElement | null>(null);
  const readonly = !onSave;
  const title = shotLabel(index);
  const dirty = duration !== String(original.duration) || JSON.stringify(draft.shots) !== JSON.stringify(baseline.shots);
  const durationValue = Number(duration);
  const minDuration = Math.max(MIN_STORYBOARD_SHOT_DURATION, ...shot.captions.map((entry) => Math.ceil(entry.end_time)));
  const validDuration = Number.isSafeInteger(durationValue) && durationValue >= minDuration;
  const { start, end } = storyboardVideoFrameBindings(draft.shots, index, draft.chapter_boundary?.connection === "continue");
  const sharedWithNext = draft.shots[index + 1]?.continue_previous;
  const results = groups?.flatMap((group) => group.results) || [];
  const videoNode = results.find(({ node }) => node.storyboardItem?.itemType === "shot" && node.storyboardItem.shotId === shot.id)?.node;

  useEffect(() => {
    const trigger = document.activeElement;
    return () => {
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  const update = (shotIndex: number, apply: (value: StoryboardShot) => StoryboardShot) => {
    setDraft((current) => ({ ...current, shots: current.shots.map((value, i) => i === shotIndex ? apply(value) : value) }));
  };
  const setText = (field: StoryboardReferenceField, value: string) => {
    update(index, (current) => ({ ...current, ...storyboardReferenceFieldPatch(current, field, value) }));
  };
  const busy = Boolean(pending);
  const run = async (action: typeof pending, fn: () => void | Promise<void>) => {
    if (busy) return;
    setPending(action);
    setError("");
    try {
      await fn();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "操作失败，请重试");
    } finally {
      setPending("");
    }
  };
  const closeLocked = pending === "save" || pending === "revision";
  const close = () => {
    if (closeLocked) return;
    if (!dirty) {
      onClose();
      return;
    }
    discardReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDiscardOpen(true);
  };
  const text = (label: string, value: string, change: (value: string) => void, rows = 3): ReactNode => (
    <label className="ws-storyboard-shot-field">
      <span>{label}</span>
      <textarea rows={rows} value={value} readOnly={readonly || busy} onChange={(event) => change(event.target.value)} />
    </label>
  );
  const prompt = (label: string, shotIndex: number, part: StoryboardPromptPart, hint?: string) => {
    const source = draft.shots[shotIndex];
    return (
      <div className="ws-storyboard-shot-prompt">
        {hint ? <small>{hint}</small> : null}
        <label className="ws-storyboard-shot-field">
          <span>{label}</span>
          <textarea rows={4} value={source.prompt_overrides?.[part] ?? storyboardAutomaticShotPrompt(source, part)} readOnly={readonly || busy}
            onChange={(event) => {
              const value = event.target.value;
              update(shotIndex, (current) => {
                // Keep in-progress spaces/newlines while typing. Save normalizes once.
                return { ...current, prompt_overrides: { ...current.prompt_overrides, [part]: value } };
              });
            }} />
        </label>
        {!readonly && source.prompt_overrides?.[part] !== undefined ? (
          <button type="button" className="ws-storyboard-shot-action" disabled={busy}
            onClick={() => update(shotIndex, (current) => withStoryboardShotPrompt(current, part, storyboardAutomaticShotPrompt(current, part)))}>
            恢复自动
          </button>
        ) : null}
      </div>
    );
  };
  const setState = (key: "entry" | "exit", value: string) => {
    const frame = key === "entry" ? start : end;
    if (!frame) return;
    update(frame.shotIndex, (current) => ({ ...current, continuity_state: {
      ...current.continuity_state, [frame.role === "start" ? "entry" : "exit"]: value,
    } }));
  };
  const save = () => {
    if (!onSave || !dirty || !validDuration) return;
    void run("save", async () => {
      const shots = draft.shots.map((value, shotIndex) => {
        let next = shotIndex === index ? {
          ...value, duration: durationValue,
          capture_duration: value.capture_duration != null && value.capture_duration >= durationValue
            ? value.capture_duration : undefined,
        } : value;
        for (const part of ["start", "end", "video"] as const) {
          if (next.prompt_overrides?.[part] !== undefined) next = withStoryboardShotPrompt(next, part, next.prompt_overrides[part]!);
        }
        return next;
      });
      await onSave({ ...draft, shots }, baseline);
    });
  };

  return (
    <DetailDialogFrame ariaLabel={title + "编辑"} layer="nested" className="ws-storyboard-shot-edit-layer" onRequestClose={close}
      header={<DetailDialogHeader icon={<Clapperboard size={16} />} title={title} subtitle={readonly ? shot.duration + " 秒" : "微调镜头"} onClose={close} />}>
      <div className="ws-storyboard-shot-editor">
        <div className="ws-storyboard-shot-editor-body">
          <section className="ws-storyboard-shot-brief" aria-label="镜头概况">
            <div className="ws-storyboard-shot-brief-head">
              {readonly ? <span>镜头描述</span> : <label htmlFor={id + "-description"}>镜头描述</label>}
              {!readonly ? (
                <label className="ws-storyboard-shot-duration">
                  时长
                  <input type="number" aria-label="时长（秒）" min={minDuration} step={1} value={duration} disabled={busy}
                    onChange={(event) => setDuration(event.target.value)} />
                  秒
                </label>
              ) : null}
            </div>
            {readonly ? <p>{shot.description}</p> : (
              <textarea id={id + "-description"} rows={3} value={shot.description} readOnly={busy}
                onChange={(event) => setText("description", event.target.value)} />
            )}
          </section>
          {onGenerate ? (
            <form className="ws-storyboard-shot-rewrite" onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!dirty) void run("generate", () => onGenerate(instruction.trim()));
            }}>
              <label htmlFor={id + "-instruction"}>用一句话改这一镜</label>
              <div className="ws-storyboard-shot-rewrite-row">
                <input id={id + "-instruction"} placeholder="例如：沿着纸船平稳跟拍" value={instruction} disabled={busy}
                  onChange={(event) => setInstruction(event.target.value)} />
                <button type="submit" className="ws-storyboard-shot-action" disabled={busy || dirty}>
                  {pending === "generate" ? <Loader2 size={14} className="ws-spin" aria-hidden="true" /> : <RotateCw size={14} aria-hidden="true" />}
                  {pending === "generate" ? "编排中…" : "重新编排"}
                </button>
              </div>
              <small>{dirty ? "先保存手动改动，再重新编排。" : "只重写这一镜的脚本。"}</small>
            </form>
          ) : null}
          <details className="ws-storyboard-shot-edit-options" open>
            <summary>
              <span>精细调整</span>
              <small>运镜、图片和视频提示词</small>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="ws-storyboard-shot-section-picker" role="radiogroup" aria-label="选择微调内容">
              {detailSections.map(({ key, label }) => (
                <label key={key}>
                  <input type="radio" name={id + "-section"} checked={detailSection === key} aria-controls={id + "-" + key}
                    onChange={() => setDetailSection(key)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div id={id + "-camera"} className="ws-storyboard-shot-detail-fields" hidden={detailSection !== "camera"}>
              {text("机位与运镜", shot.camera_instruction, (value) => setText("camera_instruction", value))}
              {text("场内位置与空间关系", shot.spatial_layout, (value) => setText("spatial_layout", value))}
              {start ? text("开场状态", draft.shots[start.shotIndex].continuity_state[start.role === "end" ? "exit" : "entry"], (value) => setState("entry", value)) : <small>开场承接上一章节的尾帧。</small>}
              {text("结束状态", shot.continuity_state.exit, (value) => setState("exit", value))}
            </div>
            <div id={id + "-image"} className="ws-storyboard-shot-detail-fields" hidden={detailSection !== "image"}>
              {start ? prompt("首帧构图", start.shotIndex, start.role,
                start.shotIndex !== index ? "与" + shotLabel(start.shotIndex) + "的尾帧共用同一张图。" : undefined)
                : <small>首帧使用上一章节的尾帧。</small>}
              {prompt("尾帧构图", index, "end", sharedWithNext ? "此尾帧也是" + shotLabel(index + 1) + "的首帧。" : undefined)}
            </div>
            <div id={id + "-video"} className="ws-storyboard-shot-detail-fields" hidden={detailSection !== "video"}>
              {prompt("镜内动作、速度与声音", index, "video")}
              <div className="ws-storyboard-shot-bindings" aria-label="绑定的参考图">
                {([start, end] as const).map((frame, i) => {
                  const roleName = i === 0 ? "首帧" : "尾帧";
                  const result = frame && results.find(({ node }) => node.storyboardItem?.itemType === "shot_image" &&
                    node.storyboardItem.shotId === frame.shotId && node.storyboardItem.frameRole === frame.role);
                  const thumb = result?.status === "complete" ? contentOutputMediaURLs(result.node.resultOutput ?? result.node.asset?.version?.content, "image")[0] : "";
                  const label = frame ? shotLabel(frame.shotIndex) + "的" + (frame.role === "start" ? "首帧" : "尾帧") : "上一章节的尾帧";
                  return <div key={roleName}>{thumb ? <img src={thumb} alt="" loading="lazy" /> : null}<span>{roleName}<small>{label}</small></span></div>;
                })}
              </div>
              {promptVersion ? <StoryboardVideoPromptPreview version={promptVersion} shotId={shot.id} node={videoNode} dirty={dirty} /> : null}
            </div>
          </details>
          {error ? <p role="alert" className="ws-storyboard-shot-list-error">{error}</p> : null}
        </div>
        <footer className="ws-storyboard-shot-editor-footer">
          <button type="button" className="ws-storyboard-shot-action" onClick={close} disabled={closeLocked}>{readonly ? "关闭" : "取消"}</button>
          {onSave ? <button type="button" className="ws-storyboard-shot-action is-primary" onClick={save} disabled={!dirty || !validDuration || busy}>
            {pending === "save" ? "保存中" : "保存微调"}
          </button> : onCreateRevision ? <button type="button" className="ws-storyboard-shot-action is-primary" disabled={busy} onClick={() => void run("revision", onCreateRevision)}>
            {pending === "revision" ? "创建中" : "创建修订稿"}
          </button> : null}
        </footer>
      </div>
      {discardOpen ? (
        <Dialog open onOpenChange={(open: boolean) => !open && setDiscardOpen(false)}>
          <DialogContent
            role="alertdialog"
            className="ws-storyboard-shot-discard nodrag nopan nowheel"
            layerClassName="wb-detail-backdrop is-dialog-layer"
            layerZIndex={DETAIL_DIALOG_CHILD_LAYER_Z_INDEX}
            showCloseButton={false}
            onCloseAutoFocus={(event: Event) => {
              event.preventDefault();
              if (discardReturnFocus.current?.isConnected) discardReturnFocus.current.focus({ preventScroll: true });
            }}
          >
            <DialogTitle>镜头修改尚未保存</DialogTitle>
            <DialogDescription>放弃后，本次微调不会保存。</DialogDescription>
            <footer>
              <button type="button" className="ws-storyboard-shot-action is-primary" onClick={() => setDiscardOpen(false)}>继续编辑</button>
              <button type="button" className="ws-storyboard-shot-action is-danger" onClick={onClose}>放弃修改</button>
            </footer>
          </DialogContent>
        </Dialog>
      ) : null}
    </DetailDialogFrame>
  );
}

function StoryboardVideoPromptPreview({ version, shotId, node, dirty }: {
  version: StoryboardPromptVersion; shotId: string; node?: SpaceCanvasNode; dirty: boolean;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setText(await fetchStoryboardVideoPrompt(version, shotId, node));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "读取制作提示词失败");
    } finally {
      setLoading(false);
    }
  };
  return (
    <details className="ws-storyboard-shot-request-preview" onToggle={(event) => {
      if (event.currentTarget.open && !dirty && !text && !error && !loading) void load();
    }}>
      <summary>查看完整制作提示词</summary>
      {dirty ? <p>保存微调后可查看更新后的提示词。</p> : loading ? <p role="status">正在读取提示词…</p> : error ? (
        <div><p role="alert">{error}</p><button type="button" className="ws-storyboard-shot-action" onClick={() => void load()}>重试</button></div>
      ) : text ? <pre>{text}</pre> : null}
    </details>
  );
}

function shotLabel(index: number) {
  return "镜头 " + String(index + 1).padStart(2, "0");
}
