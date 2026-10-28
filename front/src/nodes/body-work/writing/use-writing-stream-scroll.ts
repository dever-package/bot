import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** 同一任务保留用户的滚动意图；文字增长不能反过来决定是否跟随。 */
export function useWritingStreamScroll({
  scope,
  target,
  revision,
  enabled = target !== null,
  forceFollow = false,
}: {
  scope: string;
  target: string | null;
  revision: unknown;
  enabled?: boolean;
  forceFollow?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const intent = useRef({ scope: "", following: true });
  const [followingIntent, setFollowingIntent] = useState({ scope: "", following: true });
  const setFollowing = useCallback((following: boolean) => {
    if (intent.current.following === following) return;
    intent.current = { ...intent.current, following };
    setFollowingIntent(intent.current);
  }, []);
  const pauseFollowing = useCallback(() => {
    if (!forceFollow) setFollowing(false);
  }, [forceFollow, setFollowing]);
  const currentTarget = useRef(target);
  const update = useRef<(() => void) | null>(null);
  const active = enabled;

  useLayoutEffect(() => {
    currentTarget.current = target;
    update.current?.();
  }, [target, revision]);

  useLayoutEffect(() => {
    if (intent.current.scope !== scope) {
      intent.current = { scope, following: true };
      setFollowingIntent(intent.current);
    }
    if (!active) return;
    if (forceFollow) setFollowing(true);
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    let owner: HTMLElement | null = null;
    let originalAnchor = "";
    let originalOverflowY = "";
    let originalGutter = "";
    let frame: number | null = null;
    let lastTop = 0;
    let lastHeight = 0;
    let touchY: number | null = null;
    const findOwner = () => {
      // 整份大纲锁定中间视口；隐藏滚动条后仍由脚本驱动该视口。
      if (forceFollow) return viewport;
      // 窄屏提案栏没有独立滚动，使用其实际可滚动祖先。
      let element: HTMLElement | null = viewport;
      while (
        element &&
        !/auto|scroll/.test(getComputedStyle(element).overflowY)
      )
        element = element.parentElement;
      return element;
    };
    const findTarget = () => {
      const id = currentTarget.current;
      return id === null
        ? null
        : content.querySelector<HTMLElement>(
            `[data-writing-stream-target="${CSS.escape(id)}"]`,
          );
    };
    const targetBottom = () => {
      const element = findTarget();
      if (!element || !owner) return null;
      return Math.max(
        0,
        Math.min(
          owner.scrollHeight - owner.clientHeight,
          owner.scrollTop +
            element.getBoundingClientRect().bottom -
            owner.getBoundingClientRect().top -
            owner.clientTop -
            owner.clientHeight +
            20,
        ),
      );
    };
    const schedule = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        bindOwner();
        if (!owner || (!forceFollow && !intent.current.following)) return;
        const bottom = targetBottom();
        if (bottom === null) return;
        owner.scrollTop = bottom;
        lastTop = owner.scrollTop;
        lastHeight = owner.scrollHeight;
      });
    };
    const pause = () => {
      setFollowing(false);
    };
    const resumeAtEnd = () => {
      if (!owner) return;
      const bottom = targetBottom();
      if (
        (bottom !== null && Math.abs(owner.scrollTop - bottom) <= 2) ||
        owner.scrollHeight - owner.clientHeight - owner.scrollTop <= 2
      ) {
        setFollowing(true);
        schedule();
      }
    };
    const onScroll = () => {
      if (owner !== findOwner()) {
        bindOwner();
        return;
      }
      if (!owner) return;
      if (forceFollow) {
        schedule();
        return;
      }
      const top = owner.scrollTop;
      const height = owner.scrollHeight;
      // 阶段提交或自动翻页会缩短内容并夹逼 scrollTop，不代表读者向上滚动。
      const clamped = height < lastHeight && top < lastTop &&
        Math.abs(top - Math.max(0, height - owner.clientHeight)) <= 2;
      if (top < lastTop && !clamped) pause();
      else if (top > lastTop) resumeAtEnd();
      if (clamped && intent.current.following) schedule();
      lastTop = top;
      lastHeight = height;
    };
    const onWheel = (event: WheelEvent) => {
      if (forceFollow) {
        if (!event.ctrlKey) event.preventDefault();
        return;
      }
      if (event.deltaY < 0) pause();
      else if (event.deltaY > 0) resumeAtEnd();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (forceFollow) {
        event.preventDefault();
        return;
      }
      const y = event.touches[0]?.clientY;
      if (y !== undefined && touchY !== null && y > touchY) pause();
      else if (y !== undefined && touchY !== null && y < touchY) resumeAtEnd();
      touchY = y ?? null;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (forceFollow) {
        const editable = event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true]");
        if (!editable && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(event.key))
          event.preventDefault();
        return;
      }
      if (
        ["ArrowUp", "PageUp", "Home"].includes(event.key) ||
        (event.key === " " && event.shiftKey)
      )
        pause();
      else if (["ArrowDown", "PageDown", "End", " "].includes(event.key))
        resumeAtEnd();
    };
    const detachOwner = () => {
      if (!owner) return;
      owner.removeEventListener("scroll", onScroll);
      owner.removeEventListener("wheel", onWheel);
      owner.removeEventListener("touchstart", onTouchStart);
      owner.removeEventListener("touchmove", onTouchMove);
      owner.removeEventListener("keydown", onKeyDown);
      owner.style.overflowAnchor = originalAnchor;
      if (forceFollow) {
        owner.style.overflowY = originalOverflowY;
        owner.style.scrollbarGutter = originalGutter;
      }
      if (owner !== viewport) observer.unobserve(owner);
    };
    const bindOwner = () => {
      const next = findOwner();
      if (next === owner) return;
      detachOwner();
      owner = next;
      if (!owner) return;
      lastTop = owner.scrollTop;
      lastHeight = owner.scrollHeight;
      originalAnchor = owner.style.overflowAnchor;
      owner.style.overflowAnchor = "none";
      if (forceFollow) {
        originalOverflowY = owner.style.overflowY;
        originalGutter = owner.style.scrollbarGutter;
        owner.style.scrollbarGutter = "stable";
        owner.style.overflowY = "hidden";
      }
      owner.addEventListener("scroll", onScroll, { passive: true });
      owner.addEventListener("wheel", onWheel, { passive: !forceFollow });
      owner.addEventListener("touchstart", onTouchStart, { passive: true });
      owner.addEventListener("touchmove", onTouchMove, { passive: !forceFollow });
      owner.addEventListener("keydown", onKeyDown);
      observer.observe(owner);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(content);
    observer.observe(viewport);
    bindOwner();
    update.current = () => {
      const previous = owner;
      bindOwner();
      // 纯文本自增高会先设 height:auto，浏览器可能在中间布局夹逼阅读位置。
      if (owner && owner === previous && !intent.current.following)
        owner.scrollTop = lastTop;
      // 自增高的中间布局也可能暂时缩短总高度；该夹逼不是用户向上滚动。
      if (owner) lastTop = owner.scrollTop;
      schedule();
    };
    schedule();
    return () => {
      update.current = null;
      detachOwner();
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [scope, active, forceFollow, setFollowing]);

  return { viewportRef, contentRef, following: forceFollow || followingIntent.scope !== scope || followingIntent.following, pauseFollowing };
}
