import { useCallback, useEffect, useRef, useState } from "react";
import { requestErrorMessage as errorText } from "../shared/api-response";
import type { AssetRecord } from "./asset-types";
import {
  createWebContentImport,
  loadActiveWebContentImports,
  loadWebContentImportTask,
  type WebContentImportTask,
} from "./web-content-import-api";
import {
  clearStoredWebContentImportTaskID,
  createWebContentImportRequestID,
  isActiveWebContentImport,
  readStoredWebContentImportTaskID,
  storeWebContentImportTaskID,
  webContentImportStorageKey,
} from "./web-content-import-state";

export function useWebContentImport({
  open,
  teamID,
  projectID,
  onClose,
  onImported,
  onTaskChange,
}: {
  open: boolean;
  teamID: number;
  projectID: number;
  onClose: () => void;
  onImported: (
    assets: AssetRecord[],
    warnings: string[],
    task: WebContentImportTask,
  ) => void;
  onTaskChange?: (task: WebContentImportTask | null) => void;
}) {
  const [source, setSource] = useState("");
  const [task, setTask] = useState<WebContentImportTask | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);
  const onImportedRef = useRef(onImported);
  const completedTaskIDs = useRef(new Set<number>());
  const pendingRequestRef = useRef<{
    source: string;
    requestID: string;
  } | null>(null);
  const storageKey = webContentImportStorageKey(teamID, projectID);
  const activeTaskID = isActiveWebContentImport(task) ? task?.id || 0 : 0;

  useEffect(() => {
    openRef.current = open;
    onCloseRef.current = onClose;
    onImportedRef.current = onImported;
  }, [onClose, onImported, open]);

  useEffect(() => {
    onTaskChange?.(task);
  }, [onTaskChange, task]);

  useEffect(() => {
    let disposed = false;
    completedTaskIDs.current.clear();
    setTask(null);
    setSource("");
    setError("");
    setSubmitting(false);
    pendingRequestRef.current = null;

    async function recover() {
      try {
        const storedTaskID = readStoredWebContentImportTaskID(storageKey);
        let recovered: WebContentImportTask | null = null;
        if (storedTaskID > 0) {
          try {
            recovered = await loadWebContentImportTask({
              teamID,
              projectID,
              taskID: storedTaskID,
            });
          } catch {
            clearStoredWebContentImportTaskID(storageKey);
          }
        }
        if (!recovered) {
          const active = await loadActiveWebContentImports({
            teamID,
            projectID,
          });
          recovered = active[0] || null;
        }
        if (disposed || !recovered) return;
        setSource(recovered.source);
        setTask(recovered);
        storeWebContentImportTaskID(storageKey, recovered.id);
      } catch {
        // A transient recovery failure must not block creating or reopening an import.
      }
    }

    void recover();
    return () => {
      disposed = true;
    };
  }, [projectID, storageKey, teamID]);

  useEffect(() => {
    if (activeTaskID <= 0) return;
    let disposed = false;
    let timer = 0;

    async function poll() {
      try {
        const current = await loadWebContentImportTask({
          teamID,
          projectID,
          taskID: activeTaskID,
        });
        if (disposed) return;
        setTask(current);
        setError("");
        if (!isActiveWebContentImport(current)) return;
        timer = window.setTimeout(poll, 1200);
      } catch (currentError) {
        if (disposed) return;
        if (openRef.current) {
          setError(errorText(currentError, "刷新导入进度失败"));
        }
        timer = window.setTimeout(poll, 2500);
      }
    }

    timer = window.setTimeout(poll, 700);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
    };
  }, [activeTaskID, projectID, teamID]);

  useEffect(() => {
    if (!task || isActiveWebContentImport(task)) return;
    clearStoredWebContentImportTaskID(storageKey);
    if (task.status === "failed") {
      setError(task.errorMessage || "网页内容导入失败");
      return;
    }
    if (completedTaskIDs.current.has(task.id)) return;
    if (task.assets.length === 0) {
      setError(task.errorMessage || "导入完成，但没有生成可用素材");
      return;
    }
    completedTaskIDs.current.add(task.id);
    pendingRequestRef.current = null;
    onImportedRef.current(task.assets, task.warnings, task);
    setTask(null);
    setSource("");
    if (openRef.current) onCloseRef.current();
  }, [storageKey, task]);

  const submit = useCallback(async () => {
    const value = source.trim();
    if (!value || submitting || isActiveWebContentImport(task)) return;
    setSubmitting(true);
    setError("");
    const pendingRequest =
      pendingRequestRef.current?.source === value
        ? pendingRequestRef.current
        : { source: value, requestID: createWebContentImportRequestID() };
    pendingRequestRef.current = pendingRequest;
    try {
      const created = await createWebContentImport({
        teamID,
        projectID,
        requestID: pendingRequest.requestID,
        source: value,
      });
      pendingRequestRef.current = null;
      setTask(created);
      storeWebContentImportTaskID(storageKey, created.id);
    } catch (currentError) {
      try {
        const active = await loadActiveWebContentImports({ teamID, projectID });
        const recovered = active.find((current) => current.source === value);
        if (recovered) {
          pendingRequestRef.current = null;
          setTask(recovered);
          storeWebContentImportTaskID(storageKey, recovered.id);
          return;
        }
      } catch {
        // Preserve the original create error when recovery also fails.
      }
      setError(errorText(currentError, "创建网页内容导入任务失败"));
    } finally {
      setSubmitting(false);
    }
  }, [projectID, source, storageKey, submitting, task, teamID]);

  const reset = useCallback(() => {
    if (isActiveWebContentImport(task)) return;
    clearStoredWebContentImportTaskID(storageKey);
    pendingRequestRef.current = null;
    setTask(null);
    setError("");
  }, [storageKey, task]);

  return {
    source,
    setSource,
    task,
    submitting,
    active: isActiveWebContentImport(task),
    error,
    submit,
    reset,
  };
}
