import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";

export type AgentChatDocumentOutlineItem = {
  id: string;
  level: number;
  title: string;
};

export function useAgentChatDocumentOutline({
  documentID,
  enabled,
  contentRef,
  scrollRef,
}: {
  documentID: number;
  enabled: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const [items, setItems] = useState<AgentChatDocumentOutlineItem[]>([]);
  const [activeID, setActiveID] = useState("");
  const observedHeadingIDs = items.map((item) => item.id).join("\n");

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const content = contentRef.current;
    if (!content) {
      return;
    }

    let frame = 0;
    const refresh = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextItems = collectDocumentOutline(content, documentID);
        setItems((current) =>
          sameDocumentOutline(current, nextItems) ? current : nextItems,
        );
        setActiveID((current) =>
          nextItems.some((item) => item.id === current)
            ? current
            : nextItems[0]?.id || "",
        );
      });
    };

    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(content, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [contentRef, documentID, enabled]);

  useEffect(() => {
    if (!enabled || !observedHeadingIDs) {
      return;
    }
    const scrollRoot = scrollRef.current;
    const content = contentRef.current;
    if (!scrollRoot || !content) {
      return;
    }

    const visibleHeadings = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleHeadings.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        }
        const current = Array.from(visibleHeadings.entries()).sort(
          (left, right) => left[1] - right[1],
        )[0];
        if (current) {
          setActiveID(current[0]);
        }
      },
      {
        root: scrollRoot,
        rootMargin: "-24px 0px -68% 0px",
        threshold: [0, 1],
      },
    );

    for (const id of observedHeadingIDs.split("\n")) {
      const heading = document.getElementById(id);
      if (heading && content.contains(heading)) {
        observer.observe(heading);
      }
    }
    return () => observer.disconnect();
  }, [contentRef, enabled, observedHeadingIDs, scrollRef]);

  const selectItem = useCallback(
    (id: string) => {
      const scrollRoot = scrollRef.current;
      const content = contentRef.current;
      const heading = document.getElementById(id);
      if (!scrollRoot || !content || !heading || !content.contains(heading)) {
        return;
      }
      const rootTop = scrollRoot.getBoundingClientRect().top;
      const headingTop = heading.getBoundingClientRect().top;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      scrollRoot.scrollTo({
        top: scrollRoot.scrollTop + headingTop - rootTop - 24,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setActiveID(id);
    },
    [contentRef, scrollRef],
  );

  return { items, activeID, selectItem };
}

export function AgentChatDocumentOutline({
  items,
  activeID,
  className,
  onSelect,
}: {
  items: AgentChatDocumentOutlineItem[];
  activeID: string;
  className?: string;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return null;
  }
  const baseLevel = Math.min(...items.map((item) => item.level));
  return (
    <nav aria-label="文档目录" className={cn("py-1", className)}>
      {items.map((item) => {
        const active = item.id === activeID;
        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              "block w-full border-l-2 py-1.5 pr-3 text-left text-sm leading-5 transition-colors",
              active
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
            )}
            style={{
              paddingLeft:
                12 + Math.min(item.level - baseLevel, 2) * 12,
            }}
            title={item.title}
            aria-current={active ? "location" : undefined}
            onClick={() => onSelect(item.id)}
          >
            <span className="line-clamp-2">{item.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

function collectDocumentOutline(
  content: HTMLElement,
  documentID: number,
): AgentChatDocumentOutlineItem[] {
  const blockHeadingCounts = new Map<string, number>();
  return Array.from(
    content.querySelectorAll<HTMLElement>(
      "[data-agent-document-block-id] h1, [data-agent-document-block-id] h2, [data-agent-document-block-id] h3, [data-agent-document-block-id] h4",
    ),
  ).flatMap((heading) => {
    const title = String(heading.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    const block = heading.closest<HTMLElement>(
      "[data-agent-document-block-id]",
    );
    const blockID = block?.dataset.agentDocumentBlockId || "";
    if (!title || !blockID) {
      return [];
    }
    const headingIndex = blockHeadingCounts.get(blockID) || 0;
    blockHeadingCounts.set(blockID, headingIndex + 1);
    const id = `agent-document-${documentID}-block-${blockID}-heading-${headingIndex}`;
    heading.id = id;
    heading.dataset.agentDocumentHeading = "true";
    return [
      {
        id,
        level: Number(heading.tagName.slice(1)) || 2,
        title,
      },
    ];
  });
}

function sameDocumentOutline(
  current: AgentChatDocumentOutlineItem[],
  incoming: AgentChatDocumentOutlineItem[],
) {
  return (
    current.length === incoming.length &&
    current.every(
      (item, index) =>
        item.id === incoming[index]?.id &&
        item.level === incoming[index]?.level &&
        item.title === incoming[index]?.title,
    )
  );
}
