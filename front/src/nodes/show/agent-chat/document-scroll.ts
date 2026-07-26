import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const DOCUMENT_SCROLL_BOTTOM_THRESHOLD = 64;

export function useAgentChatDocumentAutoScroll({
  documentID,
  contentVersion,
  enabled,
  pending,
}: {
  documentID: number;
  contentVersion: string;
  enabled: boolean;
  pending: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const openDocumentRef = useRef("");
  const shouldFollowRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const [atBottom, setAtBottom] = useState(true);

  const updateBottomState = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) {
      return true;
    }
    const nextAtBottom =
      scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight <=
      DOCUMENT_SCROLL_BOTTOM_THRESHOLD;
    setAtBottom((current) =>
      current === nextAtBottom ? current : nextAtBottom,
    );
    return nextAtBottom;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const scroll = scrollRef.current;
    if (!scroll) {
      return;
    }
    shouldFollowRef.current = true;
    scroll.scrollTo({ top: scroll.scrollHeight, behavior });
    lastScrollTopRef.current = scroll.scrollTop;
    setAtBottom(true);
  }, []);

  const scheduleContentUpdate = useCallback(() => {
    if (frameRef.current != null) {
      window.cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      if (shouldFollowRef.current) {
        scrollToBottom();
        return;
      }
      updateBottomState();
    });
  }, [scrollToBottom, updateBottomState]);

  useEffect(() => {
    const openDocumentKey = enabled ? String(documentID) : "";
    if (!openDocumentKey) {
      openDocumentRef.current = "";
      shouldFollowRef.current = false;
      return;
    }
    if (openDocumentRef.current === openDocumentKey) {
      if (pending && updateBottomState()) {
        shouldFollowRef.current = true;
      }
      return;
    }
    openDocumentRef.current = openDocumentKey;
    shouldFollowRef.current = pending;
    const scroll = scrollRef.current;
    if (scroll && !pending) {
      scroll.scrollTop = 0;
    }
    lastScrollTopRef.current = scroll?.scrollTop || 0;
    scheduleContentUpdate();
  }, [documentID, enabled, pending, scheduleContentUpdate, updateBottomState]);

  useLayoutEffect(() => {
    if (enabled) {
      scheduleContentUpdate();
    }
  }, [contentVersion, enabled, scheduleContentUpdate]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const content = contentRef.current;
    if (!content) {
      return;
    }
    const observer = new ResizeObserver(scheduleContentUpdate);
    observer.observe(content);
    scheduleContentUpdate();
    return () => observer.disconnect();
  }, [documentID, enabled, scheduleContentUpdate]);

  useEffect(
    () => () => {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  const handleScroll = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) {
      return;
    }
    const movingUp = scroll.scrollTop < lastScrollTopRef.current - 1;
    const nextAtBottom = updateBottomState();
    if (movingUp) {
      shouldFollowRef.current = false;
    } else if (nextAtBottom) {
      shouldFollowRef.current = true;
    }
    lastScrollTopRef.current = scroll.scrollTop;
  }, [updateBottomState]);

  return {
    atBottom,
    contentRef,
    handleScroll,
    scrollRef,
    scrollToBottom,
  };
}
