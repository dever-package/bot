import type { WebContentImportTask } from "./web-content-import-api";

const storagePrefix = "shemic:web-content-import";

export function isActiveWebContentImport(
  task: WebContentImportTask | null | undefined,
): task is WebContentImportTask {
  return Boolean(
    task &&
    (task.status === "pending" ||
      task.status === "discovering" ||
      task.status === "running"),
  );
}

export function webContentImportStorageKey(teamID: number, projectID: number) {
  return `${storagePrefix}:${teamID}:${projectID}`;
}

export function readStoredWebContentImportTaskID(key: string) {
  if (typeof window === "undefined") return 0;
  try {
    const taskID = Number(window.localStorage.getItem(key) || 0);
    return Number.isFinite(taskID) && taskID > 0 ? taskID : 0;
  } catch {
    return 0;
  }
}

export function storeWebContentImportTaskID(key: string, taskID: number) {
  if (typeof window === "undefined" || taskID <= 0) return;
  try {
    window.localStorage.setItem(key, String(taskID));
  } catch {
    // Persistent recovery is best-effort; server-side active-task lookup remains available.
  }
}

export function clearStoredWebContentImportTaskID(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore unavailable browser storage.
  }
}

export function createWebContentImportRequestID() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
