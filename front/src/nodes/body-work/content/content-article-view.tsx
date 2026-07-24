import { BodyRichTextView } from "../shared/body-rich-text";
import type { BodyContentArticle } from "./content-api";

export function BodyContentArticleView({
  article,
}: {
  article: BodyContentArticle;
}) {
  return (
    <article className="body-content-article">
      <header className="body-content-article-header">
        <h1>{article.title}</h1>
      </header>
      <BodyRichTextView
        value={article.content}
        className="body-content-rich"
        fallback={
          <p className="body-content-empty-copy">这篇文章暂时没有正文。</p>
        }
      />
    </article>
  );
}
