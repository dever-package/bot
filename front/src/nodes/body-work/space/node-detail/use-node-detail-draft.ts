import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";

export type NodeDetailDraftStatus =
  | "saved"
  | "dirty"
  | "saving"
  | "error";

type UseNodeDetailDraftOptions<T> = {
  value: T;
  resetKey: string;
  fingerprint: (value: T) => string;
  save: (value: T) => Promise<void>;
  onError?: (error: unknown) => void;
  debounceMs?: number;
};

export function useNodeDetailDraft<T>({
  value,
  resetKey,
  fingerprint,
  save,
  onError,
  debounceMs = 1200,
}: UseNodeDetailDraftOptions<T>) {
  const [draft, setDraftState] = useState(value);
  const [status, setStatus] = useState<NodeDetailDraftStatus>("saved");
  const valueRef = useRef(value);
  const draftRef = useRef(value);
  const fingerprintRef = useRef(fingerprint);
  const saveRef = useRef(save);
  const onErrorRef = useRef(onError);
  const savedFingerprintRef = useRef(fingerprint(value));
  const revisionRef = useRef(0);
  const generationRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const inFlightRef = useRef<Promise<boolean> | null>(null);
  const persistRef = useRef<
    (targetRevision?: number, flushLatest?: boolean) => Promise<boolean>
  >(async () => false);
  const autoSaveBlockedRef = useRef(false);
  const mountedRef = useRef(true);

  valueRef.current = value;
  fingerprintRef.current = fingerprint;
  saveRef.current = save;
  onErrorRef.current = onError;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const persist = useCallback(
    async (targetRevision?: number, flushLatest = false): Promise<boolean> => {
      clearTimer();
      const generation = generationRef.current;

      while (mountedRef.current && generation === generationRef.current) {
        if (inFlightRef.current) {
          const previousSucceeded = await inFlightRef.current;
          if (!previousSucceeded || generation !== generationRef.current) {
            return false;
          }
        }

        if (
          !flushLatest &&
          targetRevision !== undefined &&
          targetRevision !== revisionRef.current
        ) {
          return true;
        }

        const snapshot = draftRef.current;
        const snapshotFingerprint = fingerprintRef.current(snapshot);
        if (snapshotFingerprint === savedFingerprintRef.current) {
          autoSaveBlockedRef.current = false;
          if (mountedRef.current) {
            setStatus("saved");
          }
          return true;
        }

        const snapshotRevision = revisionRef.current;
        if (mountedRef.current) {
          setStatus("saving");
        }
        const request = saveRef.current(snapshot)
          .then(() => {
            if (
              !mountedRef.current ||
              generation !== generationRef.current
            ) {
              return false;
            }
            savedFingerprintRef.current = snapshotFingerprint;
            autoSaveBlockedRef.current = false;
            const currentFingerprint = fingerprintRef.current(draftRef.current);
            setStatus(
              currentFingerprint === snapshotFingerprint ? "saved" : "dirty",
            );
            return true;
          })
          .catch((error) => {
            if (
              mountedRef.current &&
              generation === generationRef.current
            ) {
              clearTimer();
              autoSaveBlockedRef.current = true;
              setStatus("error");
              onErrorRef.current?.(error);
            }
            return false;
          });
        inFlightRef.current = request;
        const succeeded = await request;
        if (inFlightRef.current === request) {
          inFlightRef.current = null;
        }
        if (!succeeded) {
          return false;
        }
        if (
          !flushLatest &&
          snapshotRevision !== revisionRef.current &&
          timerRef.current === null &&
          !autoSaveBlockedRef.current
        ) {
          const latestRevision = revisionRef.current;
          timerRef.current = window.setTimeout(() => {
            timerRef.current = null;
            void persistRef.current(latestRevision);
          }, debounceMs);
        }
        if (!flushLatest || snapshotRevision === revisionRef.current) {
          return true;
        }
      }
      return false;
    },
    [clearTimer, debounceMs],
  );
  persistRef.current = persist;

  const scheduleSave = useCallback(
    (revision: number) => {
      clearTimer();
      if (autoSaveBlockedRef.current) {
        return;
      }
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        void persist(revision);
      }, debounceMs);
    },
    [clearTimer, debounceMs, persist],
  );

  const setDraft = useCallback(
    (nextValue: SetStateAction<T>) => {
      const next =
        typeof nextValue === "function"
          ? (nextValue as (current: T) => T)(draftRef.current)
          : nextValue;
      const nextFingerprint = fingerprintRef.current(next);
      draftRef.current = next;
      setDraftState(next);
      revisionRef.current += 1;

      if (nextFingerprint === savedFingerprintRef.current) {
        clearTimer();
        autoSaveBlockedRef.current = false;
        setStatus("saved");
        return;
      }

      if (autoSaveBlockedRef.current) {
        setStatus("error");
        return;
      }
      setStatus("dirty");
      scheduleSave(revisionRef.current);
    },
    [clearTimer, scheduleSave],
  );

  const flush = useCallback(async () => persist(undefined, true), [persist]);

  const retry = useCallback(async () => {
    autoSaveBlockedRef.current = false;
    return persist(undefined, true);
  }, [persist]);

  useEffect(() => {
    const next = valueRef.current;
    generationRef.current += 1;
    revisionRef.current = 0;
    draftRef.current = next;
    savedFingerprintRef.current = fingerprintRef.current(next);
    autoSaveBlockedRef.current = false;
    inFlightRef.current = null;
    clearTimer();
    setDraftState(next);
    setStatus("saved");
  }, [clearTimer, resetKey]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
      clearTimer();
    };
  }, [clearTimer]);

  return {
    draft,
    status,
    setDraft,
    flush,
    retry,
    hasPendingChanges: status !== "saved",
  };
}
