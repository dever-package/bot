import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, List, Menu, X } from "lucide-react";
import { useTheme } from "@dever/front-plugin";
import { BodySiteBrand } from "../auth/site-brand";
import {
  applyBodySiteMetadata,
  type BodyLoginConfig,
  type BodyLoginLink,
  useBodyLoginConfigState,
} from "../auth/site-config";
import {
  BodyFilingContent,
  BodyFilingFallbackRows,
  hasBodyFilingInfo,
} from "../shared/body-filing";
import { bodySiteHomeHref } from "../shared/body-link";
import type { BodyRichTextOutlineItem } from "../shared/body-rich-text";
import {
  BodySiteLinkAnchor,
  BodySiteLinkList,
} from "../shared/body-site-link";
import { BodyToaster } from "../shared/body-toaster";
import "../shared/body-theme.css";
import { useBodyAppearance } from "../shared/use-body-appearance";
import { BodyContentArticleView } from "./content-article-view";
import { ContentOutline } from "./content-outline";
import { BodyContentError } from "./content-state";
import { useBodyContentArticle } from "./use-content-article";
import "./content-page.css";

export function StandaloneContentPage() {
  const { config, loaded: configLoaded } = useBodyLoginConfigState();
  const { resolvedTheme } = useTheme();
  const articleID = readContentArticleID();
  const state = useBodyContentArticle(articleID);
  const [outline, setOutline] = useState<BodyRichTextOutlineItem[]>([]);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const outlineVisible = outline.length >= 2;
  useBodyAppearance(config.site.appearance, resolvedTheme);

  const updateOutline = useCallback(
    (items: BodyRichTextOutlineItem[]) => setOutline(items),
    [],
  );
  const updateMobileOutline = useCallback(
    (open: boolean) => setMobileOutlineOpen(open),
    [],
  );

  useEffect(() => {
    if (!configLoaded) {
      return;
    }
    applyBodySiteMetadata(config.site);
    document.title = state.article?.title
      ? `${state.article.title} - ${config.site.siteName}`
      : config.site.siteName;
  }, [config.site, configLoaded, state.article?.title]);

  useEffect(() => {
    if (!outlineVisible) {
      setMobileOutlineOpen(false);
    }
  }, [outlineVisible]);

  useEffect(() => {
    if (!mobileNavigationOpen) {
      return;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavigationOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileNavigationOpen]);

  if (!configLoaded) {
    return (
      <main
        className="body-content-public-page body-content-public-page-loading"
        aria-busy="true"
      />
    );
  }

  return (
    <main className="body-content-public-page">
      <BodyToaster />
      <ContentHeader
        config={config}
        outlineVisible={outlineVisible}
        mobileOutlineOpen={mobileOutlineOpen}
        mobileNavigationOpen={mobileNavigationOpen}
        onCloseNavigation={() => setMobileNavigationOpen(false)}
        onToggleNavigation={() => {
          setMobileOutlineOpen(false);
          setMobileNavigationOpen((open) => !open);
        }}
        onOpenOutline={() => {
          setMobileNavigationOpen(false);
          setMobileOutlineOpen(true);
        }}
      />

      <div
        className="body-content-public-layout"
        data-outline={outlineVisible ? "visible" : undefined}
      >
        <section className="body-content-public-reader" aria-label="文章详情">
          {!state.loading && state.error ? (
            <BodyContentError message={state.error} onRetry={state.reload} />
          ) : null}
          {!state.loading && state.article ? (
            <>
              <BodyContentArticleView
                article={state.article}
                onOutlineChange={updateOutline}
              />
              <ContentFooter config={config} />
            </>
          ) : null}
        </section>

        <ContentOutline
          items={outline}
          mobileOpen={mobileOutlineOpen}
          onMobileOpenChange={updateMobileOutline}
        />
      </div>
    </main>
  );
}

function ContentHeader({
  config,
  outlineVisible,
  mobileOutlineOpen,
  mobileNavigationOpen,
  onCloseNavigation,
  onToggleNavigation,
  onOpenOutline,
}: {
  config: BodyLoginConfig;
  outlineVisible: boolean;
  mobileOutlineOpen: boolean;
  mobileNavigationOpen: boolean;
  onCloseNavigation: () => void;
  onToggleNavigation: () => void;
  onOpenOutline: () => void;
}) {
  const homeHref = bodySiteHomeHref();
  return (
    <header className="body-content-public-header">
      <div className="body-content-public-header-inner">
        <div className="body-content-public-brand">
          <BodySiteBrand
            site={config.site}
            logoClassName="body-content-public-brand-logo"
            nameClassName="body-content-public-brand-name"
          />
        </div>
        <BodySiteLinkList
          links={config.links}
          className="body-content-public-navigation"
          ariaLabel="站点链接"
        />
        <div className="body-content-public-actions">
          {config.links.length > 0 ? (
            <button
              type="button"
              className="body-content-navigation-trigger"
              aria-label={mobileNavigationOpen ? "关闭站点链接" : "打开站点链接"}
              title="站点导航"
              aria-controls="body-content-mobile-navigation"
              aria-expanded={mobileNavigationOpen}
              onClick={onToggleNavigation}
            >
              {mobileNavigationOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          ) : null}
          {outlineVisible ? (
            <button
              type="button"
              className="body-content-outline-trigger"
              aria-label="打开目录"
              title="目录"
              aria-controls="body-content-mobile-outline"
              aria-expanded={mobileOutlineOpen}
              onClick={onOpenOutline}
            >
              <List size={18} />
              <span>目录</span>
            </button>
          ) : null}
          <a className="body-content-public-back" href={homeHref}>
            <ArrowLeft size={17} />
            <span>返回站点</span>
          </a>
        </div>
      </div>
      {mobileNavigationOpen && config.links.length > 0 ? (
        <BodySiteLinkList
          id="body-content-mobile-navigation"
          links={config.links}
          className="body-content-public-mobile-navigation"
          ariaLabel="移动端站点链接"
          onLinkClick={onCloseNavigation}
        />
      ) : null}
    </header>
  );
}

function ContentFooter({ config }: { config: BodyLoginConfig }) {
  const legalLinks = [
    config.legalLinks.termsOfService,
    config.legalLinks.privacyPolicy,
  ].filter((link): link is BodyLoginLink => link != null);
  const filingVisible = hasBodyFilingInfo(config.site.filing);
  if (!filingVisible && legalLinks.length === 0) {
    return null;
  }

  return (
    <footer className="body-content-public-footer" aria-label="站点信息">
      {filingVisible ? (
        <BodyFilingContent
          filing={config.site.filing}
          className="body-content-public-filing"
          fallback={<BodyFilingFallbackRows filing={config.site.filing} />}
        />
      ) : null}
      {legalLinks.length > 0 ? (
        <nav className="body-content-public-legal" aria-label="协议条款">
          {legalLinks.map((link) => (
            <BodySiteLinkAnchor key={link.id} link={link} />
          ))}
        </nav>
      ) : null}
    </footer>
  );
}

function readContentArticleID() {
  if (typeof window === "undefined") {
    return 0;
  }
  const id = Number(new URLSearchParams(window.location.search).get("id") || 0);
  return Number.isFinite(id) && id > 0 ? id : 0;
}
