import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { saveSpaceCanvas } from "./space-api";
import type { SpaceCanvasState } from "./types";

export type CanvasSaveStatus = "saved" | "dirty" | "saving" | "error";

type CanvasMap = Record<string, SpaceCanvasState>;

type CanvasSaveState = {
  baseline: string;
  revision: number;
  savedRevision: number;
  retryCount: number;
  conflict?: Error;
};

type CanvasSaveRequest = {
  canvas: SpaceCanvasState;
  revision: number;
};

type CanvasSaver = (
  key: string,
  generation: number,
  request?: CanvasSaveRequest,
) => Promise<void>;

type UseCanvasAutosaveInput = {
  projectId: number;
  enabled: boolean;
  canvases: CanvasMap;
  setCanvases: Dispatch<SetStateAction<CanvasMap>>;
  onError: (error: unknown) => void;
};

const AUTOSAVE_DELAY = 520;
const MAX_RETRY_DELAY = 8_000;

function canvasSaveState(canvas: SpaceCanvasState): CanvasSaveState {
  return {
    baseline: canvas.loadedBaseline ?? "",
    revision: 0,
    savedRevision: 0,
    retryCount: 0,
  };
}

export function useCanvasAutosave({
  projectId,
  enabled,
  canvases,
  setCanvases,
  onError,
}: UseCanvasAutosaveInput) {
  const canvasesRef = useRef(canvases);
  const savesRef = useRef(new Map<string, CanvasSaveState>());
  const inFlightRef = useRef<Map<string, Promise<void>>>(new Map());
  const timersRef = useRef<Record<string, number>>({});
  const generationRef = useRef(0);
  const saveCanvasRef = useRef<CanvasSaver | null>(null);
  const [scheduleVersion, setScheduleVersion] = useState(0);
  const [statusByCanvas, setStatusByCanvas] = useState<
    Record<string, CanvasSaveStatus>
  >({});

  useEffect(() => {
    canvasesRef.current = canvases;
  }, [canvases]);

  const clearTimer = useCallback((key: string) => {
    const timer = timersRef.current[key];
    if (timer != null) {
      window.clearTimeout(timer);
      delete timersRef.current[key];
    }
  }, []);

  const scheduleSave = useCallback(
    (key: string, delay = AUTOSAVE_DELAY) => {
      const state = savesRef.current.get(key);
      if (
        !enabled ||
        !projectId ||
        !state ||
        state.conflict ||
        typeof window === "undefined"
      ) {
        return;
      }
      clearTimer(key);
      const generation = generationRef.current;
      timersRef.current[key] = window.setTimeout(() => {
        delete timersRef.current[key];
        const pending = saveCanvasRef.current?.(key, generation);
        void pending?.catch(() => undefined);
      }, delay);
    },
    [clearTimer, enabled, projectId],
  );

  const saveCanvas = useCallback(
    async (key: string, generation: number, request?: CanvasSaveRequest) => {
      const state = savesRef.current.get(key);
      if (
        !state ||
        generation !== generationRef.current ||
        !enabled ||
        !projectId
      ) {
        return;
      }
      const isCurrent = () =>
        generation === generationRef.current &&
        savesRef.current.get(key) === state;
      if (state.conflict) {
        throw state.conflict;
      }

      while (inFlightRef.current.has(key)) {
        await inFlightRef.current.get(key);
        if (!isCurrent()) {
          return;
        }
      }

      const revision = request?.revision ?? state.revision;
      if (revision <= state.savedRevision) {
        return;
      }
      const submittedCanvas = request?.canvas || canvasesRef.current[key];
      if (!submittedCanvas) {
        return;
      }

      const saving = (async () => {
        setStatusByCanvas((current) => ({ ...current, [key]: "saving" }));
        try {
          const saved = await saveSpaceCanvas({
            projectId,
            canvasId: submittedCanvas.id,
            assetCateId: submittedCanvas.assetCateId,
            canvas: submittedCanvas,
            baseline: state.baseline,
          });
          if (!isCurrent()) {
            return;
          }
          state.baseline = saved.baseline;
          state.savedRevision = revision;
          state.retryCount = 0;
          const isLatest = state.revision === revision;
          if (isLatest) {
            setCanvases((current) => {
              const currentCanvas = current[key];
              const updatedAt = saved.updatedAt || currentCanvas?.updatedAt;
              if (
                !isCurrent() ||
                !currentCanvas ||
                currentCanvas.updatedAt === updatedAt
              ) {
                return current;
              }
              return {
                ...current,
                [key]: { ...currentCanvas, updatedAt },
              };
            });
            setStatusByCanvas((current) => ({
              ...current,
              [key]: "saved",
            }));
          } else {
            setStatusByCanvas((current) => ({
              ...current,
              [key]: "dirty",
            }));
          }
        } catch (error) {
          if (!isCurrent()) {
            return;
          }
          if (error instanceof Error && "code" in error && error.code === 409) {
            state.conflict = error;
            clearTimer(key);
            setStatusByCanvas((current) => ({ ...current, [key]: "dirty" }));
            onError(error);
            throw error;
          }
          state.retryCount += 1;
          setStatusByCanvas((current) => ({ ...current, [key]: "error" }));
          if (state.retryCount === 1) {
            onError(error);
          }
          scheduleSave(
            key,
            Math.min(MAX_RETRY_DELAY, AUTOSAVE_DELAY * 2 ** state.retryCount),
          );
          throw error;
        } finally {
          if (
            isCurrent() &&
            !state.conflict &&
            state.revision > state.savedRevision &&
            state.retryCount === 0
          ) {
            scheduleSave(key);
          }
        }
      })();

      inFlightRef.current.set(key, saving);
      try {
        await saving;
      } finally {
        if (inFlightRef.current.get(key) === saving) {
          inFlightRef.current.delete(key);
        }
      }
    },
    [clearTimer, enabled, onError, projectId, scheduleSave, setCanvases],
  );
  saveCanvasRef.current = saveCanvas;

  const flushCanvasSave = useCallback(
    async (canvas: SpaceCanvasState) => {
      const key = String(canvas.id);
      const state = savesRef.current.get(key);
      if (!state || !enabled || !projectId) {
        throw new Error("画布尚未就绪，无法开始运行");
      }
      if (state.conflict) {
        onError(state.conflict);
        throw state.conflict;
      }
      const generation = generationRef.current;
      const revision = ++state.revision;
      state.retryCount = 0;
      clearTimer(key);
      setStatusByCanvas((current) => ({ ...current, [key]: "dirty" }));
      await saveCanvas(key, generation, { canvas, revision });
      if (
        generation !== generationRef.current ||
        savesRef.current.get(key) !== state
      ) {
        throw new Error("画布状态已更新，请重新运行");
      }
    },
    [clearTimer, enabled, onError, projectId, saveCanvas],
  );

  const markDirty = useCallback((canvasId: number) => {
    const key = String(canvasId);
    const state = savesRef.current.get(key);
    if (!state) return;
    state.revision += 1;
    state.retryCount = 0;
    setStatusByCanvas((current) => ({ ...current, [key]: "dirty" }));
    if (!state.conflict) {
      setScheduleVersion((current) => current + 1);
    }
  }, []);

  const isPending = useCallback((key: string) => {
    const state = savesRef.current.get(key);
    return (
      state != null &&
      (inFlightRef.current.has(key) || state.revision > state.savedRevision)
    );
  }, []);

  const hasPendingCanvasSaves = useCallback(
    (canvasId?: number) =>
      canvasId == null
        ? [...savesRef.current.keys()].some(isPending)
        : isPending(String(canvasId)),
    [isPending],
  );

  const flushPendingCanvasSaves = useCallback(async () => {
    const generation = generationRef.current;
    // 等待期间仍可编辑；每轮重新读取 revision，直到所有已载画布都落盘。
    for (;;) {
      const keys = [...savesRef.current.keys()].filter(isPending);
      if (!keys.length) return;
      await Promise.all(
        keys.map(async (key) => {
          clearTimer(key);
          await saveCanvas(key, generation);
        }),
      );
      if (generation !== generationRef.current) {
        throw new Error("画布状态已更新，请重试");
      }
    }
  }, [clearTimer, isPending, saveCanvas]);

  const reset = useCallback(
    (nextCanvases: CanvasMap) => {
      generationRef.current += 1;
      canvasesRef.current = nextCanvases;
      for (const key of Object.keys(timersRef.current)) {
        clearTimer(key);
      }
      savesRef.current.clear();
      const statuses: Record<string, CanvasSaveStatus> = {};
      for (const [key, canvas] of Object.entries(nextCanvases)) {
        savesRef.current.set(key, canvasSaveState(canvas));
        statuses[key] = "saved";
      }
      setStatusByCanvas(statuses);
    },
    [clearTimer],
  );

  const adoptCanvasSnapshot = useCallback(
    (canvas: SpaceCanvasState) => {
      const key = String(canvas.id);
      if (
        savesRef.current.has(key) &&
        (canvas.loadedBaseline == null || canvasesRef.current[key] === canvas)
      ) {
        return;
      }
      clearTimer(key);
      canvasesRef.current = { ...canvasesRef.current, [key]: canvas };
      savesRef.current.set(key, canvasSaveState(canvas));
      setStatusByCanvas((current) => ({ ...current, [key]: "saved" }));
    },
    [clearTimer],
  );

  const forgetCanvasSnapshot = useCallback(
    (canvasId: number) => {
      const key = String(canvasId);
      clearTimer(key);
      savesRef.current.delete(key);
      setStatusByCanvas((current) => {
        if (!Object.prototype.hasOwnProperty.call(current, key)) {
          return current;
        }
        const next = { ...current };
        delete next[key];
        return next;
      });
    },
    [clearTimer],
  );

  useEffect(() => {
    for (const [key, state] of savesRef.current) {
      if (state.revision > state.savedRevision) {
        scheduleSave(key);
      }
    }
  }, [scheduleSave, scheduleVersion]);

  useEffect(
    () => () => {
      generationRef.current += 1;
      for (const timer of Object.values(timersRef.current)) {
        window.clearTimeout(timer);
      }
      timersRef.current = {};
    },
    [],
  );

  return {
    markCanvasDirty: markDirty,
    flushCanvasSave,
    flushPendingCanvasSaves,
    hasPendingCanvasSaves,
    adoptCanvasSnapshot,
    forgetCanvasSnapshot,
    resetCanvasAutosave: reset,
    canvasSaveStatus: statusByCanvas,
  };
}
