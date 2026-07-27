import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { BookOpenText, ExternalLink } from "lucide-react";
import type { BodyHomeMenuItem } from "../auth/site-config";
import type { BodyContentNavigation } from "../content/content-api";
import { BodyContentArticleSheet } from "../content/content-article-sheet";
import {
  bodyLinkOpensArticleSheet,
  type BodyResolvedLink,
} from "../shared/body-link";
import { BodySiteLinkAnchor } from "../shared/body-site-link";
import { ConfiguredMenuIcon } from "../shared/configured-icon";

export function WorkbenchContentMenu({
  menu,
  navigation,
}: {
  menu: BodyHomeMenuItem;
  navigation: BodyContentNavigation;
}) {
  const [open, setOpen] = useState(false);
  const [articleID, setArticleID] = useState(0);
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

  function openContentLink(
    event: MouseEvent<HTMLAnchorElement>,
    link: BodyResolvedLink,
  ) {
    setOpen(false);
    if (!bodyLinkOpensArticleSheet(link) || !isPlainPrimaryClick(event)) {
      return;
    }
    event.preventDefault();
    setArticleID(link.articleID);
  }

  const articleSheet = (
    <BodyContentArticleSheet
      articleID={articleID}
      open={articleID > 0}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setArticleID(0);
        }
      }}
    />
  );

  if (navigation.items.length === 1) {
    return (
      <>
        <BodySiteLinkAnchor
          link={firstItem}
          className="hb-rail-action"
          title={menu.name}
          ariaHasPopup={
            bodyLinkOpensArticleSheet(firstItem) ? "dialog" : undefined
          }
          onClick={(event) => openContentLink(event, firstItem)}
        >
          <ConfiguredMenuIcon
            iconName={menu.icon}
            iconImage={menu.iconImage}
            fallbackIcon={BookOpenText}
            className="hb-configured-menu-icon"
            strokeWidth={1.8}
          />
          <span>{menu.name}</span>
        </BodySiteLinkAnchor>
        {articleSheet}
      </>
    );
  }

  return (
    <>
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
                const ItemIcon =
                  item.type === "url" ? ExternalLink : BookOpenText;
                return (
                  <BodySiteLinkAnchor
                    key={item.id}
                    link={item}
                    role="menuitem"
                    ariaHasPopup={
                      bodyLinkOpensArticleSheet(item) ? "dialog" : undefined
                    }
                    onClick={(event) => openContentLink(event, item)}
                  >
                    <ItemIcon size={15} />
                    <span>{item.name}</span>
                  </BodySiteLinkAnchor>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      {articleSheet}
    </>
  );
}

function isPlainPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
