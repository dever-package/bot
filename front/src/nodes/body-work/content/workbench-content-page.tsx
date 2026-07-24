import { BodyContentArticleView } from "./content-article-view";
import { BodyContentError, BodyContentLoading } from "./content-state";
import { useBodyContentArticle } from "./use-content-article";
import "./content-page.css";

export function WorkbenchContentPage({ linkID }: { linkID: number }) {
  const state = useBodyContentArticle(linkID, "workbench");
  return (
    <section className="body-content-workbench" aria-label="内容详情">
      <div className="body-content-workbench-reader">
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
