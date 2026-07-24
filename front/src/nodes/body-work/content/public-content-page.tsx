import { ArrowLeft } from "lucide-react";
import { BodyContentArticleView } from "./content-article-view";
import { BodyContentError, BodyContentLoading } from "./content-state";
import { useBodyContentArticle } from "./use-content-article";
import "./content-page.css";

export function PublicContentPage({
  articleID,
  backHref,
}: {
  articleID: number;
  backHref: string;
}) {
  const state = useBodyContentArticle(articleID, "public");
  return (
    <section className="body-content-public-stage" aria-label="文章详情">
      <div className="body-content-public-reader">
        <div className="body-content-public-toolbar">
          <a href={backHref}>
            <ArrowLeft size={16} />
            <span>返回登录</span>
          </a>
        </div>
        {state.loading ? <BodyContentLoading /> : null}
        {!state.loading && state.error ? (
          <BodyContentError message={state.error} onRetry={state.reload} />
        ) : null}
        {!state.loading && state.article ? (
          <BodyContentArticleView article={state.article} />
        ) : null}
      </div>
    </section>
  );
}
