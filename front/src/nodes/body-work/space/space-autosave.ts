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

export function useCanvasAutosave({
  projectId,
  enabled,
  canvases,
  setCanvases,
  onError,
}: UseCanvasAutosaveInput) {
  const canvasesRef = useRef(canvases);
  const revisionsRef = useRef<Record<string, number>>({});
  const savedRevisionsRef = useRef<Record<string, number>>({});
  const retryCountsRef = useRef<Record<string, number>>({});
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
      if (!enabled || !projectId || typeof window === "undefined") {
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
    async (
      key: string,
      generation: number,
      request?: CanvasSaveRequest,
    ) => {
      if (generation !== generationRef.current || !enabled || !projectId) {
        return;
      }

      while (inFlightRef.current.has(key)) {
        await inFlightRef.current.get(key);
        if (generation !== generationRef.current) {
          return;
        }
      }

      const revision = request?.revision ?? revisionsRef.current[key] ?? 0;
      if (revision <= (savedRevisionsRef.current[key] || 0)) {
        return;
      }
      const submittedCanvas = request?.canvas || canvasesRef.current[key];
      if (!submittedCanvas) {
        return;
      }

      const saving = (async () => {
        setStatusByCanvas((current) => ({ ...current, [key]: "saving" }));
        try {
          const saved = await saveSpaceCanvas(
            projectId,
            submittedCanvas.assetCateId,
            submittedCanvas,
          );
          if (generation !== generationRef.current) {
            return;
          }
          savedRevisionsRef.current[key] = Math.max(
            savedRevisionsRef.current[key] || 0,
            revision,
          );
          retryCountsRef.current[key] = 0;
          const isLatest = (revisionsRef.current[key] || 0) === revision;
          if (isLatest) {
            setCanvases((current) => {
              const currentCanvas = current[key];
              const updatedAt = saved.updatedAt || currentCanvas?.updatedAt;
              if (!currentCanvas || currentCanvas.updatedAt === updatedAt) {
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
          if (generation !== generationRef.current) {
            return;
          }
          const retryCount = (retryCountsRef.current[key] || 0) + 1;
          retryCountsRef.current[key] = retryCount;
          setStatusByCanvas((current) => ({ ...current, [key]: "error" }));
          if (retryCount === 1) {
            onError(error);
          }
          scheduleSave(
            key,
            Math.min(MAX_RETRY_DELAY, AUTOSAVE_DELAY * 2 ** retryCount),
          );
          throw error;
        } finally {
          if (
            generation === generationRef.current &&
            (revisionsRef.current[key] || 0) >
              (savedRevisionsRef.current[key] || 0) &&
            (retryCountsRef.current[key] || 0) === 0
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
    [enabled, onError, projectId, scheduleSave, setCanvases],
  );
  saveCanvasRef.current = saveCanvas;

  const flushCanvasSave = useCallback(
    async (canvas: SpaceCanvasState) => {
      if (!enabled || !projectId) {
        throw new Error("画布尚未就绪，无法开始运行");
      }
      const key = String(canvas.assetCateId);
      const generation = generationRef.current;
      const revision = (revisionsRef.current[key] || 0) + 1;
      revisionsRef.current[key] = revision;
      retryCountsRef.current[key] = 0;
      clearTimer(key);
      setStatusByCanvas((current) => ({ ...current, [key]: "dirty" }));
      await saveCanvas(key, generation, { canvas, revision });
      if (generation !== generationRef.current) {
        throw new Error("画布状态已更新，请重新运行");
      }
    },
    [clearTimer, enabled, projectId, saveCanvas],
  );

  const markDirty = useCallback((assetCateId: number) => {
    const key = String(assetCateId);
    revisionsRef.current[key] = (revisionsRef.current[key] || 0) + 1;
    retryCountsRef.current[key] = 0;
    setStatusByCanvas((current) => ({ ...current, [key]: "dirty" }));
    setScheduleVersion((current) => current + 1);
  }, []);

  const reset = useCallback(
    (nextCanvases: CanvasMap) => {
      generationRef.current += 1;
      for (const key of Object.keys(timersRef.current)) {
        clearTimer(key);
      }
      revisionsRef.current = {};
      savedRevisionsRef.current = {};
      retryCountsRef.current = {};
      inFlightRef.current.clear();
      const statuses: Record<string, CanvasSaveStatus> = {};
      for (const key of Object.keys(nextCanvases)) {
        statuses[key] = "saved";
      }
      setStatusByCanvas(statuses);
    },
    [clearTimer],
  );

  const adoptCanvasSnapshot = useCallback(
    (canvas: SpaceCanvasState) => {
      const key = String(canvas.assetCateId);
      clearTimer(key);
      const revision = (revisionsRef.current[key] || 0) + 1;
      revisionsRef.current[key] = revision;
      savedRevisionsRef.current[key] = revision;
      retryCountsRef.current[key] = 0;
      setStatusByCanvas((current) => ({ ...current, [key]: "saved" }));
    },
    [clearTimer],
  );

  useEffect(() => {
    for (const [key, revision] of Object.entries(revisionsRef.current)) {
      if (revision > (savedRevisionsRef.current[key] || 0)) {
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
    adoptCanvasSnapshot,
    resetCanvasAutosave: reset,
    canvasSaveStatus: statusByCanvas,
  };
}
