import type { ReactNode } from "react";
import { Plus, Pencil } from "lucide-react";
import { BodyContentView } from "../shared/content-view";
import {
  selectedWritingInspiration,
  type WritingDocument,
  type WritingSelection,
} from "./writing-document";
import { WritingStoryEntities } from "./writing-story-entities";
import {
  writingModes,
  writingStyles,
  writingViewpoints,
} from "./writing-preferences";
import {
  writingChapterIndex,
  writingChapterPage,
} from "./writing-chapter-index";
import { WritingChapterCards } from "./writing-chapter-cards";
import type { WritingChapterOrder } from "./use-writing-chapter-order";
import { useWritingStreamPage } from "./use-writing-stream-page";
import "./writing-outline.css";

export function WritingOutline({
  document,
  readonly,
  navigationDisabled,
  onSelect,
  onAdd,
  onPreferences,
  onEditSection,
  chapterOrder,
  activeUnitId,
  streamTarget,
  generatingBackground = false,
  following = false,
  onReadPage,
  chapterRecovery,
}: {
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
  generatingBackground?: boolean;
  following?: boolean;
  onReadPage?: () => void;
  chapterRecovery?: ReactNode;
}) {
  const inspiration = selectedWritingInspiration(document);
  const { preferences } = document;
  // 背景先显示已到达的内容；阶段结束后恢复空项的手工编辑入口。
  const showWorld =
    !generatingBackground ||
    Boolean(document.outline.world) ||
    streamTarget === "outline:world";
  const preferenceFields = [
    { label: "题材", value: preferences.genre },
    {
      label: "文风",
      value:
        writingStyles.find((option) => option.value === preferences.style)
          ?.label || (preferences.style_instructions ? "自定文风" : ""),
    },
    {
      label: "叙事视角",
      value: writingViewpoints.find(
        (option) => option.value === preferences.pov,
      )?.label,
    },
    {
      label: "写作模式",
      value: writingModes.find((option) => option.value === preferences.mode)
        ?.label,
    },
    {
      label: "计划章数",
      value: preferences.planned_chapters
        ? `${preferences.planned_chapters} 章`
        : "",
    },
    {
      label: "每章字数",
      value: preferences.chapter_words
        ? `约 ${preferences.chapter_words} 字`
        : "",
    },
  ];
  const match = /^chapter:(\d+)$/.exec(streamTarget || "");
  const [page, setPage] = useWritingStreamPage(
    match ? Number(match[1]) : undefined,
    following,
    onReadPage,
  );
  return (
    <div className="story-outline-page">
      {inspiration && (
        <section className="story-outline-inspiration" aria-label="已选灵感">
          <span>已选灵感</span>
          <h2>{inspiration.title}</h2>
          <p>{inspiration.content}</p>
        </section>
      )}
      <section
        className="story-outline-preferences"
        aria-label="写作设定"
        data-writing-stream-target="preferences"
      >
        <div className="story-section-heading">
          <h2 data-writing-stream-target="phase:preferences">写作设定</h2>
          <button
            disabled={readonly || navigationDisabled}
            aria-label="修改写作设定"
            onClick={onPreferences}
          >
            <Pencil size={13} />
            修改
          </button>
        </div>
        <dl className="story-preference-fields">
          {preferenceFields.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={!value ? "is-unset" : undefined}>
                {value || "待确定"}
              </dd>
            </div>
          ))}
        </dl>
        {preferences.style_instructions && (
          <div className="story-style-note">
            <span>文风要求</span>
            <p>{preferences.style_instructions}</p>
          </div>
        )}
      </section>
      <section className="story-outline-section" aria-label="故事总纲">
        <div className="story-section-heading">
          <h2 data-writing-stream-target="phase:direction">故事总纲</h2>
          <button
            disabled={readonly || navigationDisabled}
            aria-label="修改故事总纲"
            onClick={() => onEditSection("overview")}
          >
            <Pencil size={13} />
            修改
          </button>
        </div>
        <article
          className="story-text-card"
          data-writing-stream-target="outline:overview"
        >
          <BodyContentView
            fallback={document.outline.overview || "暂无故事总纲"}
            className="story-outline-prose"
            markdownClassName="story-outline-markdown"
          />
        </article>
      </section>
      <WritingStoryEntities
        document={document}
        section="characters"
        readonly={readonly}
        navigationDisabled={navigationDisabled}
        onSelect={onSelect}
        onAdd={onAdd}
        streamTarget={streamTarget}
        following={following}
        onReadPage={onReadPage}
      />
      <section className="story-outline-section" aria-label="背景">
        <div className="story-section-heading">
          <h2 data-writing-stream-target="phase:background">背景</h2>
        </div>
        {showWorld && (
          <article
            className="story-text-card"
            data-writing-stream-target="outline:world"
          >
            <h3>环境与规则</h3>
            <BodyContentView
              fallback={document.outline.world || "暂无背景"}
              className="story-outline-prose"
              markdownClassName="story-outline-markdown"
            />
            <button
              disabled={readonly || navigationDisabled}
              aria-label="修改环境与规则"
              onClick={() => onEditSection("world")}
            >
              <Pencil size={13} />
              修改
            </button>
          </article>
        )}
        {(["locations", "props"] as const).filter(
          (section) => !generatingBackground || document.outline[section].length > 0,
        ).map((section) => (
          <WritingStoryEntities
            key={section}
            document={document}
            section={section}
            readonly={readonly}
            navigationDisabled={navigationDisabled}
            onSelect={onSelect}
            onAdd={onAdd}
            streamTarget={streamTarget}
            following={following}
            onReadPage={onReadPage}
          />
        ))}
      </section>
      <section className="story-outline-section" aria-label="章节剧情">
        <div className="story-section-heading">
          <h2 data-writing-stream-target="phase:chapters">章节剧情</h2>
          <button
            disabled={readonly || navigationDisabled}
            onClick={() => onAdd({ kind: "section", id: "chapters" })}
          >
            <Plus size={14} />
            添加章节
          </button>
        </div>
        {chapterRecovery}
        <WritingChapterCards
          page={writingChapterPage(
            writingChapterIndex(document.units).canonical,
            page,
          )}
          onPage={setPage}
          onSelect={onSelect}
          readonly={readonly}
          navigationDisabled={navigationDisabled}
          chapterOrder={chapterOrder}
          activeUnitId={activeUnitId}
          activeOrdinal={match ? Number(match[1]) + 1 : undefined}
        />
      </section>
    </div>
  );
}
