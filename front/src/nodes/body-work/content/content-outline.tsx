import { useEffect, useState, type MouseEvent } from "react";
import { X } from "lucide-react";
import type { BodyRichTextOutlineItem } from "../shared/body-rich-text";

export function ContentOutline({
  items,
  mobileOpen,
  onMobileOpenChange,
}: {
  items: BodyRichTextOutlineItem[];
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}) {
  const activeID = useActiveHeading(items);
  const visible = items.length >= 2;

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMobileOpenChange(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen, onMobileOpenChange]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <aside className="body-content-outline-desktop" aria-label="文章目录">
        <div className="body-content-outline-sticky">
          <span className="body-content-outline-title">目录</span>
          <OutlineLinks items={items} activeID={activeID} />
        </div>
      </aside>

      {mobileOpen ? (
        <div
          className="body-content-outline-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onMobileOpenChange(false);
            }
          }}
        >
          <aside
            id="body-content-mobile-outline"
            className="body-content-outline-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="文章目录"
          >
            <header>
              <span>目录</span>
              <button
                type="button"
                autoFocus
                aria-label="关闭目录"
                title="关闭目录"
                onClick={() => onMobileOpenChange(false)}
              >
                <X size={19} />
              </button>
            </header>
            <OutlineLinks
              items={items}
              activeID={activeID}
              onSelect={() => onMobileOpenChange(false)}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function OutlineLinks({
  items,
  activeID,
  onSelect,
}: {
  items: BodyRichTextOutlineItem[];
  activeID: string;
  onSelect?: () => void;
}) {
  return (
    <nav className="body-content-outline-links">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={item.level === 3 ? "is-child" : undefined}
          aria-current={activeID === item.id ? "location" : undefined}
          onClick={(event) => {
            scrollToHeading(event, item.id);
            onSelect?.();
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

function useActiveHeading(items: BodyRichTextOutlineItem[]) {
  const [activeID, setActiveID] = useState("");
  const itemIDs = items.map((item) => item.id).join("|");

  useEffect(() => {
    if (items.length === 0) {
      setActiveID("");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = 104;
      let currentID = items[0].id;
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (!heading || heading.getBoundingClientRect().top > threshold) {
          break;
        }
        currentID = item.id;
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        currentID = items[items.length - 1].id;
      }
      setActiveID((current) => (current === currentID ? current : currentID));
    };
    const scheduleUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const hashID = decodedHashID(window.location.hash);
    if (items.some((item) => item.id === hashID)) {
      window.requestAnimationFrame(() => {
        document.getElementById(hashID)?.scrollIntoView();
      });
    }
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [itemIDs, items]);

  return activeID;
}

function scrollToHeading(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const heading = document.getElementById(id);
  if (!heading) {
    return;
  }
  event.preventDefault();
  const url = new URL(window.location.href);
  url.hash = id;
  window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  heading.scrollIntoView({ behavior: "smooth", block: "start" });
}

function decodedHashID(value: string) {
  try {
    return decodeURIComponent(value.replace(/^#/, ""));
  } catch {
    return "";
  }
}
