import { useRef, useState } from "react";
import { submitWritingCommand, type WritingCommand } from "./writing-api";
import type { WritingDocument, WritingInspiration } from "./writing-document";
import {
  useWritingSnapshot,
  type WritingWorkInput,
} from "./use-writing-snapshot";

export type WritingPreviewInput = WritingWorkInput & {
  readonly?: boolean;
  running?: boolean;
};

export type WritingInspirationEdit = {
  command: WritingCommand & { document: WritingDocument };
  inspiration: WritingInspiration;
};

/** 卡面的命令只操作已保存作品，不挂载草稿、正文编辑器和版本列表。 */
export function useWritingPreview(props: WritingPreviewInput) {
  const work = useWritingSnapshot({ ...props, readOnMount: false });
  const commandBusy = useRef(false);
  const [busy, setBusy] = useState(false);
  const [stopping, setStopping] = useState(false);
  const accessRef = useRef(props);
  accessRef.current = props;
  const writable = () => {
    const current = work.snapshotRef.current;
    return Boolean(
      current &&
      !accessRef.current.readonly &&
      !accessRef.current.running &&
      current.document.status !== "running",
    );
  };
  const runCommand = async <T>(operation: () => Promise<T>): Promise<T> => {
    if (commandBusy.current) throw new Error("正在处理其他操作，请稍后再试");
    commandBusy.current = true;
    setBusy(true);
    try {
      return await operation();
    } finally {
      commandBusy.current = false;
      if (work.mounted.current) setBusy(false);
    }
  };
  const action = async (
    actionName: "select_inspiration" | "generate_inspirations",
    extra: Pick<WritingCommand, "inspiration_id"> = {},
  ) => {
    if (!writable() || commandBusy.current) return false;
    if (work.snapshotRef.current?.document.selected_inspiration_id)
      return false;
    try {
      return await runCommand(async () => {
        work.clearPreview();
        work.clearGenerationError();
        const snapshot = await submitWritingCommand(
          work.command(actionName, extra),
        );
        // 命令已由后端持久化；离开的卡面不能再打开旧节点的工作区。
        if (!work.mounted.current) return false;
        work.acceptSnapshot(snapshot);
        work.setError("");
        return true;
      });
    } catch (cause) {
      if (work.mounted.current) work.reportError(cause);
      return false;
    }
  };
  const assertBaseline = (baseline: WritingCommand) => {
    const current = work.snapshotRef.current!;
    if (
      baseline.project_id !== accessRef.current.projectId ||
      baseline.canvas_id !== accessRef.current.canvasId ||
      baseline.work_asset_id !== current.work_asset_id ||
      baseline.expected_work_version_id !== current.work_version_id ||
      baseline.expected_work_revision !== current.work_revision
    )
      throw new Error("作品已更新，请关闭弹窗后重新操作；当前内容已保留");
  };
  const generateFromBaseline = async (baseline: WritingCommand) => {
    if (!writable()) throw new Error("当前作品只读或正在生成，请稍后重试");
    assertBaseline(baseline);
    if (work.snapshotRef.current?.document.selected_inspiration_id)
      throw new Error("选定灵感后不能修改或重新生成");
    await runCommand(async () => {
      const snapshot = await submitWritingCommand(baseline);
      work.clearPreview();
      work.clearGenerationError();
      work.acceptSnapshot(snapshot);
      work.setError("");
    });
  };
  const beginInspirationEdit = (id: string): WritingInspirationEdit | null => {
    if (
      !writable() ||
      commandBusy.current ||
      work.snapshotRef.current?.document.selected_inspiration_id
    )
      return null;
    const document = work.snapshotRef.current!.document;
    const inspiration = document.inspirations.find((entry) => entry.id === id);
    if (!inspiration) return null;
    return {
      command: { ...work.command("save_document"), document },
      inspiration,
    };
  };
  const saveInspiration = async (
    edit: WritingInspirationEdit,
    fields: Pick<WritingInspiration, "title" | "content">,
  ) => {
    if (!writable()) throw new Error("当前作品只读或正在生成，输入内容已保留");
    if (work.snapshotRef.current?.document.selected_inspiration_id)
      throw new Error("选定灵感后不能修改");
    const baseline = edit.command;
    // 小弹窗保留打开时的完整基线，不能把旧文档套上最新修订后覆盖。
    assertBaseline(baseline);
    if (
      fields.title === edit.inspiration.title &&
      fields.content === edit.inspiration.content
    )
      return;
    await runCommand(async () => {
      const document = {
        ...baseline.document,
        inspirations: baseline.document.inspirations.map((entry) =>
          entry.id === edit.inspiration.id ? { ...entry, ...fields } : entry,
        ),
      };
      work.acceptSnapshot(
        await submitWritingCommand({ ...baseline, document }),
      );
      work.setError("");
    });
  };
  const regenerateInspiration = async (edit: WritingInspirationEdit) => {
    if (!edit.inspiration.id) throw new Error("当前灵感尚未保存，请稍后重试");
    const { document: _document, ...baseline } = edit.command;
    await generateFromBaseline({
      ...baseline,
      action: "generate_inspirations",
      inspiration_id: edit.inspiration.id,
    });
  };
  const stop = async () => {
    const current = work.snapshotRef.current;
    if (
      !current?.run_id ||
      current.document.status !== "running" ||
      commandBusy.current ||
      accessRef.current.readonly
    )
      return;
    try {
      await runCommand(async () => {
        setStopping(true);
        try {
          await work.stopRun();
          work.setError("");
        } finally {
          if (work.mounted.current) setStopping(false);
        }
      });
    } catch (cause) {
      work.reportError(cause);
    }
  };
  return {
    ...work,
    busy,
    stopping,
    action,
    stop,
    beginInspirationEdit,
    saveInspiration,
    regenerateInspiration,
  };
}
