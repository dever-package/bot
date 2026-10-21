import { Plus, Pencil } from "lucide-react";
import { selectedWritingInspiration, type WritingDocument, type WritingSelection } from "./writing-document";
import { WritingStoryEntities } from "./writing-story-entities";
import { writingPreferencesSummary } from "./writing-preferences";
import { writingChapterIndex, writingChapterPage } from "./writing-chapter-index";
import { WritingChapterCards } from "./writing-chapter-cards";
import type { WritingChapterOrder } from "./use-writing-chapter-order";
import { useWritingStreamPage } from "./use-writing-stream-page";
import "./writing-outline.css";

export function WritingOutline({ document, readonly, navigationDisabled, onSelect, onAdd, onPreferences, onEditSection, chapterOrder, activeUnitId, streamTarget, following = false, onReadPage }: {
  document: WritingDocument;
  readonly: boolean;
  navigationDisabled: boolean;
  onSelect: (selection: WritingSelection) => void;
  onAdd: (selection: WritingSelection) => void;
  onPreferences: () => void;
  onEditSection: (id: "overview" | "world") => void;
  chapterOrder: WritingChapterOrder;
  activeUnitId?: string;
  streamTarget?: string | null;
  following?: boolean;
  onReadPage?: () => void;
}) {
  const inspiration = selectedWritingInspiration(document);
  const match = /^chapter:(\d+)$/.exec(streamTarget || "");
  const [page, setPage] = useWritingStreamPage(match ? Number(match[1]) : undefined, following, onReadPage);
  return <div className="story-outline-page">
    {inspiration && <section className="story-outline-inspiration" aria-label="已选灵感"><span>已选灵感</span><h2>{inspiration.title}</h2><p>{inspiration.content}</p></section>}
    <section className="story-outline-preferences" aria-label="写作设定" data-writing-stream-target="preferences"><div>
      <h3>写作设定</h3><p>{writingPreferencesSummary(document.preferences)}</p>
      {document.preferences.style_instructions && <p className="story-style-note">{document.preferences.style_instructions}</p>}
    </div><button disabled={readonly} onClick={onPreferences}>修改</button></section>
    <section className="story-outline-section" aria-label="故事走向">
      <div className="story-section-heading"><h2>故事走向</h2></div>
      <article className="story-text-card" data-writing-stream-target="outline:overview"><p>{document.outline.overview || "故事走向会在这里逐步展开。"}</p>
        <button disabled={readonly || navigationDisabled} aria-label="修改故事走向" onClick={() => onEditSection("overview")}><Pencil size={13} />修改</button>
      </article>
    </section>
    <WritingStoryEntities document={document} section="characters" readonly={readonly} navigationDisabled={navigationDisabled} onSelect={onSelect} onAdd={onAdd} streamTarget={streamTarget} following={following} onReadPage={onReadPage} />
    <section className="story-outline-section" aria-label="背景"><div className="story-section-heading"><h2>背景</h2></div>
      <article className="story-text-card" data-writing-stream-target="outline:world"><h3>环境与规则</h3><p>{document.outline.world || "暂无背景"}</p>
        <button disabled={readonly || navigationDisabled} aria-label="修改环境与规则" onClick={() => onEditSection("world")}><Pencil size={13} />修改</button>
      </article>
      {(["locations", "props"] as const).map((section) => <WritingStoryEntities key={section} document={document} section={section} readonly={readonly} navigationDisabled={navigationDisabled} onSelect={onSelect} onAdd={onAdd} streamTarget={streamTarget} following={following} onReadPage={onReadPage} />)}
    </section>
    <section className="story-outline-section" aria-label="剧情大纲"><div className="story-section-heading"><h2>剧情大纲</h2>
      <button disabled={readonly || navigationDisabled} onClick={() => onAdd({ kind: "section", id: "chapters" })}><Plus size={14} />添加章节</button>
    </div><WritingChapterCards page={writingChapterPage(writingChapterIndex(document.units).canonical, page)} onPage={setPage} onSelect={onSelect} readonly={readonly} navigationDisabled={navigationDisabled} chapterOrder={chapterOrder} activeUnitId={activeUnitId} activeOrdinal={match ? Number(match[1]) + 1 : undefined} /></section>
  </div>;
}
