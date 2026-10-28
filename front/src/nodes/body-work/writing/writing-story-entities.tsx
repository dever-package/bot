import { ArrowUpRight, Plus } from "lucide-react";
import { writingChapterPageSize } from "./writing-chapter-index";
import type { WritingDocument, WritingEntitySection, WritingSelection } from "./writing-document";
import { useWritingStreamPage } from "./use-writing-stream-page";

export function WritingStoryEntities({ document, section, readonly, navigationDisabled, onSelect, onAdd, streamTarget, following = false, onReadPage }: {
  document: WritingDocument;
  section: WritingEntitySection;
  readonly: boolean;
  navigationDisabled: boolean;
  onSelect: (selection: WritingSelection) => void;
  onAdd: (selection: WritingSelection) => void;
  streamTarget?: string | null;
  following?: boolean;
  onReadPage?: () => void;
}) {
  const match = new RegExp(`^outline:${section}:(\\d+)$`).exec(streamTarget || "");
  const [requestedPage, setPage] = useWritingStreamPage(match ? Number(match[1]) : undefined, following, onReadPage);
  const entries = document.outline[section];
  const pages = Math.max(1, Math.ceil(entries.length / writingChapterPageSize));
  const page = Math.min(requestedPage, pages - 1);
  const label = { characters: "人物", locations: "地点", props: "必要道具" }[section];
  return <section className="story-entities-page" aria-label={label} data-writing-stream-target={`outline:${section}`}>
    <div className="story-section-heading"><h2 data-writing-stream-target={section === "characters" ? "phase:characters" : undefined}>{label}</h2>
      <button disabled={readonly || navigationDisabled} onClick={() => onAdd({ kind: "section", id: section })}><Plus size={14} />添加{label}</button>
    </div>
    <div className="story-entity-cards">
      {entries.slice(page * writingChapterPageSize, (page + 1) * writingChapterPageSize).map((entity, index) => <button
        className={`writing-outline-card story-entity-card${streamTarget === `outline:${section}:${page * writingChapterPageSize + index}` ? " is-streaming" : ""}`} key={entity.id || `preview:${index}`}
        disabled={navigationDisabled || !entity.id || entity.id.startsWith("preview:")}
        data-writing-stream-target={`outline:${section}:${page * writingChapterPageSize + index}`}
        onClick={() => onSelect({ kind: "entity", section, id: entity.id })}>
        <span className="writing-card-top"><small>{label}</small></span>
        <strong className="writing-card-title">{entity.name || "正在构思…"}</strong>
        <p className="writing-list-preview">{entity.description || "暂无资料"}</p>
        <span className="writing-entity-footer">查看与编辑<ArrowUpRight size={15} /></span>
      </button>)}
    </div>
    {!entries.length && <p className="story-outline-empty">暂无{label}</p>}
    {pages > 1 && <div className="story-reading-pagination">
      <button disabled={navigationDisabled || !page} onClick={() => setPage(page - 1)}>上一页</button><span>{page + 1} / {pages}</span>
      <button disabled={navigationDisabled || page + 1 >= pages} onClick={() => setPage(page + 1)}>下一页</button>
    </div>}
  </section>;
}
