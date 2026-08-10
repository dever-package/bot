import {
  lazy,
  useCallback,
  useEffect,
  useRef,
  type ComponentType,
} from "react";

export type PreloadableModule<T> = {
  load: () => Promise<T>;
  preload: () => Promise<void>;
};

export function createPreloadableModule<T>(loader: () => Promise<T>) {
  let modulePromise: Promise<T> | undefined;
  const load = () => {
    if (!modulePromise) {
      modulePromise = loader().catch((error) => {
        modulePromise = undefined;
        throw error;
      });
    }
    return modulePromise;
  };
  return {
    load,
    preload: () =>
      load().then(
        () => undefined,
        () => undefined,
      ),
  } satisfies PreloadableModule<T>;
}

export function createPreloadableComponent<
  TModule,
  T extends ComponentType<any>,
>(moduleLoader: PreloadableModule<TModule>, select: (module: TModule) => T) {
  return {
    Component: lazy(() =>
      moduleLoader.load().then((module) => ({ default: select(module) })),
    ),
    preload: moduleLoader.preload,
  };
}

export function useDeferredPreloadIntent(
  preload: (() => unknown) | undefined,
  delay = 140,
) {
  const timerRef = useRef(0);
  const preloadRef = useRef(preload);
  preloadRef.current = preload;

  const cancel = useCallback(() => {
    if (!timerRef.current) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = 0;
  }, []);
  const preloadNow = useCallback(() => {
    cancel();
    void preloadRef.current?.();
  }, [cancel]);
  const schedule = useCallback(() => {
    cancel();
    if (!preloadRef.current) return;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = 0;
      void preloadRef.current?.();
    }, delay);
  }, [cancel, delay]);

  useEffect(() => cancel, [cancel]);
  return { schedule, cancel, preloadNow };
}
