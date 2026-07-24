import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { BookOpenText, ExternalLink } from "lucide-react";
import type { BodyHomeMenuItem } from "../auth/site-config";
import type { BodyContentNavigation } from "../content/content-api";
import { ConfiguredMenuIcon } from "../shared/configured-icon";

export function WorkbenchContentMenu({
  menu,
  navigation,
  selectedLinkID,
  active,
  onSelectLink,
}: {
  menu: BodyHomeMenuItem;
  navigation: BodyContentNavigation;
  selectedLinkID: number;
  active: boolean;
  onSelectLink: (linkID: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItem = navigation.items[0];

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    function closeAfterOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeAfterOutsidePointer);
    return () => {
      document.removeEventListener("pointerdown", closeAfterOutsidePointer);
    };
  }, [open]);

  if (!firstItem) {
    return null;
  }

  function closeAfterFocusLeaves(event: FocusEvent<HTMLDivElement>) {
    if (!rootRef.current?.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  function selectLink(linkID: number) {
    setOpen(false);
    onSelectLink(linkID);
  }

  function closeOnEscape(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") {
      return;
    }
    event.preventDefault();
    setOpen(false);
    rootRef.current
      ?.querySelector<HTMLButtonElement>(".hb-rail-action")
      ?.focus();
  }

  function openContentMenu() {
    if (navigation.items.length === 1 && firstItem.type === "article") {
      selectLink(firstItem.id);
      return;
    }
    setOpen(true);
  }

  return (
    <div
      ref={rootRef}
      className="hb-content-menu-root"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={closeAfterFocusLeaves}
      onKeyDown={closeOnEscape}
    >
      <button
        type="button"
        className={`hb-rail-action ${active ? "is-active" : ""}`}
        title={menu.name}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={openContentMenu}
      >
        <ConfiguredMenuIcon
          iconName={menu.icon}
          iconImage={menu.iconImage}
          fallbackIcon={BookOpenText}
          className="hb-configured-menu-icon"
          strokeWidth={1.8}
        />
        <span>{menu.name}</span>
      </button>

      {open ? (
        <div className="hb-content-menu" role="menu" aria-label={menu.name}>
          <div className="hb-content-menu-header">
            {menu.name}
          </div>
          <div className="hb-content-menu-list">
            {navigation.items.map((item) =>
              item.type === "url" ? (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.target}
                  rel={
                    item.target === "_blank"
                      ? "noreferrer noopener"
                      : undefined
                  }
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  <ExternalLink size={15} />
                  <span>{item.name}</span>
                </a>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  className={
                    item.id === selectedLinkID ? "is-active" : undefined
                  }
                  role="menuitem"
                  aria-current={
                    item.id === selectedLinkID ? "page" : undefined
                  }
                  onClick={() => selectLink(item.id)}
                >
                  <BookOpenText size={15} />
                  <span>{item.name}</span>
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
