import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type VisibilityListener = (visible: boolean) => void;
type VisibilityRegistry = {
  observe: (element: Element, listener: VisibilityListener) => () => void;
};

const CanvasNodeVisibilityContext = createContext<VisibilityRegistry | null>(
  null,
);

/** 一个观察器负责画布里的预览，不让每个节点订阅整份平移/缩放状态。 */
export function CanvasNodeVisibilityProvider({
  root,
  children,
  rootMargin = "0px",
}: {
  root: RefObject<HTMLElement | null>;
  children: ReactNode;
  rootMargin?: string;
}) {
  const listeners = useRef(new Map<Element, VisibilityListener>());
  const observer = useRef<IntersectionObserver | null>(null);
  const registry = useMemo<VisibilityRegistry>(
    () => ({
      observe(element, listener) {
        listeners.current.set(element, listener);
        observer.current?.observe(element);
        return () => {
          observer.current?.unobserve(element);
          listeners.current.delete(element);
        };
      },
    }),
    [],
  );
  useLayoutEffect(() => {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          listeners.current.get(entry.target)?.(
            entry.isIntersecting && entry.intersectionRatio > 0,
          );
        }
      },
      { root: root.current, rootMargin },
    );
    observer.current = visibilityObserver;
    for (const element of listeners.current.keys())
      visibilityObserver.observe(element);
    return () => {
      visibilityObserver.disconnect();
      observer.current = null;
    };
  }, [root, rootMargin]);
  return (
    <CanvasNodeVisibilityContext.Provider value={registry}>
      {children}
    </CanvasNodeVisibilityContext.Provider>
  );
}

export function useCanvasNodeVisibility(retainVisible = true) {
  const registry = useContext(CanvasNodeVisibilityContext);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useLayoutEffect(() => {
    if (!ref.current || !registry) return;
    // 普通画布交给 ReactFlow 卸载；内部滚动列表可回收内容并自行保留编辑/播放。
    return registry.observe(ref.current, (intersects) => {
      if (intersects || !retainVisible) setVisible(intersects);
    });
  }, [registry, retainVisible]);
  return { ref, visible };
}
