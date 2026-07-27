import { BookOpenText, LoaderCircle, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BodyContentArticleView } from "./content-article-view";
import { BodyContentError } from "./content-state";
import { useBodyContentArticle } from "./use-content-article";
import "./content-page.css";

export function BodyContentArticleSheet({
  articleID,
  open,
  onOpenChange,
}: {
  articleID: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="body-content-sheet flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-[760px]"
      >
        {open ? <BodyContentArticleSheetBody articleID={articleID} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function BodyContentArticleSheetBody({ articleID }: { articleID: number }) {
  const state = useBodyContentArticle(articleID);

  return (
    <>
      <SheetHeader className="body-content-sheet-header flex h-14 shrink-0 flex-row items-center gap-3 px-5 py-0 text-start">
        <BookOpenText className="size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <SheetTitle className="truncate text-sm">
            {state.article?.title || "内容详情"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            查看内容文章详情
          </SheetDescription>
        </div>
        <SheetClose asChild>
          <button
            type="button"
            className="body-content-sheet-close"
            aria-label="关闭内容详情"
            title="关闭"
          >
            <X size={18} />
          </button>
        </SheetClose>
      </SheetHeader>

      <div className="body-content-sheet-scroll">
        {state.loading ? (
          <div className="body-content-sheet-loading" aria-live="polite">
            <LoaderCircle className="size-5 animate-spin" />
            <span>正在读取内容</span>
          </div>
        ) : null}
        {!state.loading && state.error ? (
          <BodyContentError message={state.error} onRetry={state.reload} />
        ) : null}
        {!state.loading && state.article ? (
          <BodyContentArticleView article={state.article} showTitle={false} />
        ) : null}
      </div>
    </>
  );
}
