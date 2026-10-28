import { ArrowUpRight, Pencil } from "lucide-react";
import { WritingChapterHandle } from "./writing-chapter-handle";
import {
  writingChapterRange,
  type WritingChapterRow,
} from "./writing-chapter-index";
import { writingUnitStatus, type WritingSelection } from "./writing-document";
import type { WritingChapterOrder } from "./use-writing-chapter-order";

type Page = {
  rows: WritingChapterRow[];
  page: number;
  pages: number;
  total: number;
};

/** 大纲和章节目录共用真实章节身份；仅页面顺序由调用方决定。 */
export function WritingChapterCards({
  page,
  onPage,
  onSelect,
  readonly,
  navigationDisabled,
  chapterOrder,
  activeUnitId,
  activeOrdinal,
}: {
  page: Page;
  onPage: (page: number) => void;
  onSelect: (selection: WritingSelection) => void;
  readonly: boolean;
  navigationDisabled: boolean;
  chapterOrder: WritingChapterOrder;
  activeUnitId?: string;
  activeOrdinal?: number;
}) {
  return (
    <>
      <div className="writing-chapter-pagination" aria-label="剧情分页">
        <span>
          {writingChapterRange(page.rows) || "0 章"} / 共 {page.total} 章
        </span>
        <div>
          <button
            disabled={navigationDisabled || !page.page}
            onClick={() => onPage(page.page - 1)}
          >
            上一页
          </button>
          <span>
            {page.page + 1} / {page.pages}
          </span>
          <button
            disabled={navigationDisabled || page.page + 1 >= page.pages}
            onClick={() => onPage(page.page + 1)}
          >
            下一页
          </button>
        </div>
      </div>
      <ul className="writing-directory writing-chapter-grid">
        {page.rows.map(({ unit, label, ordinal }) => {
          const streaming =
            !unit.id || activeUnitId === unit.id || activeOrdinal === ordinal;
          return (
            <li
              key={unit.id || `preview:${ordinal}`}
              className={`writing-outline-card writing-chapter-card${streaming ? " is-streaming" : ""}`}
              data-unit-id={unit.id}
              data-writing-stream-target={`chapter:${ordinal - 1}`}
              {...chapterOrder.itemProps(unit.id, "canonical")}
            >
              <div className="writing-card-top">
                <span className="writing-card-meta">
                  <small className="writing-card-ordinal">{label}</small>
                  <small className="writing-card-status">
                    {streaming ? "生成中" : writingUnitStatus(unit)}
                  </small>
                </span>
                <div className="writing-chapter-card-tools">
                  <button
                    data-writing-drag-ignore
                    className="writing-card-edit"
                    aria-label={`修改剧情：${unit.title}`}
                    disabled={readonly || navigationDisabled || !unit.id}
                    onClick={() =>
                      onSelect({ kind: "unit", id: unit.id, tab: "plan" })
                    }
                  >
                    <Pencil size={13} />
                  </button>
                  <WritingChapterHandle
                    order={chapterOrder}
                    id={unit.id}
                    title={unit.title}
                    view="canonical"
                  />
                </div>
              </div>
              <button
                className="writing-entity-card"
                disabled={navigationDisabled || !unit.id}
                onClick={() =>
                  onSelect({ kind: "unit", id: unit.id, tab: "body" })
                }
              >
                <strong className="writing-card-title">
                  {unit.title || (!unit.id ? "正在规划…" : "未命名章节")}
                </strong>
                <span className="writing-list-preview">
                  {unit.plan || (!unit.id ? "正在展开剧情…" : "暂无剧情")}
                </span>
                <span className="writing-entity-footer">
                  {unit.has_body ? "打开正文" : "进入正文"}
                  <ArrowUpRight size={15} />
                </span>
              </button>
            </li>
          );
        })}
        {!page.total && <li className="writing-material-empty">暂无章节</li>}
      </ul>
    </>
  );
}
