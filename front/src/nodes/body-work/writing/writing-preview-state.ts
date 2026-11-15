import {
  normalizeRuntimeRunStatus,
  isRuntimeRunActive,
  isRuntimeRunBlocking,
} from "../../../runtime/team-run/normalize";
import type { RunningNodeState } from "../space/space-node-runtime";
import type { CanvasRunRef } from "../space/space-runner";
import { generationTaskTitle } from "./writing-run-labels";
import {
  selectedWritingInspiration,
  writingStage,
  type WritingDocument,
  type WritingSnapshot,
} from "./writing-document";

/** 卡面展示故事摘要及已保存进度，创作操作归工作区。 */
export function writingStagePreview(document?: WritingDocument) {
  const stage = document ? writingStage(document) : "inspiration";
  const leaves = document ? document.units : [];
  const completed = leaves.filter((unit) => unit.has_body).length;
  const inspiration = document ? selectedWritingInspiration(document) : undefined;
  const summary = document ? {
    title: document.title || inspiration?.title || "未命名故事",
    content: inspiration?.content || document.outline.overview.trim() ||
      leaves.map((unit) => unit.plan.trim()).filter(Boolean).join("\n") ||
      leaves.map((unit) => unit.title).join(" · "),
  } : undefined;
  let bodyLabel = "剧情已规划";
  if (leaves.length > 0 && completed === leaves.length) {
    bodyLabel = "正文完成";
    if ((document?.preferences.planned_chapters || 0) > leaves.length)
      bodyLabel = "本批正文完成，待继续规划";
    else if (document?.preferences.mode === "serial")
      bodyLabel = "本批正文完成";
  }
  const labels = {
    inspiration: "选择灵感",
    outline: "准备大纲",
    chapters: "大纲完成",
    body: bodyLabel,
  };
  return {
    label: labels[stage],
    inspiration,
    summary,
    leaves: leaves.length,
    completed,
  };
}

/** 只使用当前任务的 checkpoint；提交下一次规划时不沿用上次进度。 */
export function writingPreviewState({
  snapshot,
  canvasRun,
  runningNode,
  running,
  loading,
  failure,
  stopping,
}: {
  snapshot: WritingSnapshot | null;
  canvasRun?: CanvasRunRef;
  runningNode?: RunningNodeState | null;
  running: boolean;
  loading: boolean;
  failure: string;
  stopping: boolean;
}) {
  const document = snapshot?.document;
  const canvasActive = Boolean(
    canvasRun?.status &&
    (isRuntimeRunActive(canvasRun.status) ||
      isRuntimeRunBlocking(canvasRun.status)),
  );
  const current = document?.status === "running" ? snapshot : null;
  const active = Boolean(running || current || canvasActive);
  const canvasStatus = canvasRun
    ? normalizeRuntimeRunStatus(canvasRun.status)
    : "";
  const stage = writingStagePreview(document);
  const checkpoint = current?.checkpoint;
  const bodyTask = checkpoint && checkpoint.action === "generate_units";
  const target = bodyTask ? Math.max(0, checkpoint.target || 0) : 0;
  const committed = Math.max(0, Math.min(target, checkpoint?.completed || 0));
  let label = "待创作";
  if (active) {
    if (stopping) label = "正在停止";
    else if (current) label = generationTaskTitle(current);
    else if (!canvasActive) label = "提交中";
    else if (runningNode?.status === "waiting" || canvasStatus === "pending")
      label = "排队中";
    else label = "正在生成灵感";
  } else if (
    failure ||
    document?.status === "failed" ||
    (!document && canvasStatus === "fail")
  )
    label = "生成未完成";
  else if (
    document?.status === "stopped" ||
    (!document && canvasStatus === "canceled")
  )
    label = "已停止";
  else if (document) label = stage.label;
  else if (loading) label = "正在读取";
  return {
    active,
    canvasActive,
    usesWritingRun: Boolean(current),
    label,
    target,
    committed,
    // 有新任务时旧错误不覆盖内容；终态错误完整文本只进系统弹窗。
    failure: active ? "" : failure || (!document ? canvasRun?.error || "" : ""),
  };
}
