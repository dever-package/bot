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
import {
  bodyResolvedLinkHref,
  type BodyResolvedLink,
} from "../shared/body-link";
import { ConfiguredMenuIcon } from "../shared/configured-icon";

export function WorkbenchContentMenu({
  menu,
  navigation,
}: {
  menu: BodyHomeMenuItem;
  navigation: BodyContentNavigation;
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

  if (navigation.items.length === 1) {
    const target = contentLinkTarget(firstItem);
    return (
      <a
        className="hb-rail-action"
        title={menu.name}
        href={bodyResolvedLinkHref(firstItem)}
        target={target}
        rel={target === "_blank" ? "noreferrer noopener" : undefined}
      >
        <ConfiguredMenuIcon
          iconName={menu.icon}
          iconImage={menu.iconImage}
          fallbackIcon={BookOpenText}
          className="hb-configured-menu-icon"
          strokeWidth={1.8}
        />
        <span>{menu.name}</span>
      </a>
    );
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
        className="hb-rail-action"
        title={menu.name}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
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
          <div className="hb-content-menu-header">{menu.name}</div>
          <div className="hb-content-menu-list">
            {navigation.items.map((item) => {
              const target = contentLinkTarget(item);
              const ItemIcon =
                item.type === "url" ? ExternalLink : BookOpenText;
              return (
                <a
                  key={item.id}
                  href={bodyResolvedLinkHref(item)}
                  target={target}
                  rel={target === "_blank" ? "noreferrer noopener" : undefined}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  <ItemIcon size={15} />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function contentLinkTarget(link: BodyResolvedLink) {
  return link.type === "article" ? "_blank" : link.target;
}
