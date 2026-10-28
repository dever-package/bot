import { WritingChapterCards } from "./writing-chapter-cards";
import { writingChapterIndex } from "./writing-chapter-index";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import {
  AssetTextContentEditor,
  type TextSelectionProps,
} from "../shared/asset-text-content-editor";
import { type WritingChapterOrder } from "./use-writing-chapter-order";
import type { WritingChapterDirectory } from "./use-writing-chapter-directory";
import type { WritingDraft } from "./use-writing-editor";
import {
  writingEntitySection,
  isWritingOutlineSection,
  writingSections,
  updateWritingUnit,
  type WritingDocument,
  type WritingSelection,
} from "./writing-document";

export function WritingContent({
  document,
  recoverableDraft,
  selection,
  value,
  readonly,
  onChange,
  onSelect,
  chapterOrder,
  onDeleteChapter,
  directory,
  navigationDisabled,
  onTextSelectionChange,
  selectionActionsRef,
  scoped = false,
}: TextSelectionProps & {
  document: WritingDocument;
  recoverableDraft?: string;
  savedDocument: WritingDocument;
  selection: WritingSelection;
  value: WritingDraft;
  readonly: boolean;
  onChange: (value: WritingDraft) => void;
  onSelect: (selection: WritingSelection) => void;
  chapterOrder: WritingChapterOrder;
  onDeleteChapter: (id: string) => void;
  directory: WritingChapterDirectory;
  navigationDisabled: boolean;
  scoped?: boolean;
}) {
  const updateDocument = (next: WritingDocument) =>
    onChange({ ...value, document: next });
  const textEditor = (
    label: string,
    text: string,
    change: (text: string) => void,
  ) => (
    <div
      className="writing-body"
      aria-label={label}
      data-writing-stream-target={
        selection.kind === "unit"
          ? `unit:${selection.id}:${selection.tab === "plan" ? "plan" : "body"}`
          : undefined
      }
    >
      <AssetTextContentEditor
        kind="richtext"
        contentFormat="markdown"
        value={text}
        readonly={readonly}
        onTextSelectionChange={onTextSelectionChange}
        selectionActionsRef={selectionActionsRef}
        onChange={change}
      />
    </div>
  );
  if (selection.kind === "unit") {
    const index = writingChapterIndex(document.units);
    const row = index.byId.get(selection.id);
    const selected = row?.unit;
    if (!selected) return null;
    const plan = selection.tab === "plan";
    return (
      <>
        <div className="writing-manuscript-heading">
          <span className="writing-manuscript-ordinal">{row!.label}</span>
          <label className="writing-title-field">
            <span className="writing-sr-only">标题</span>
            <input
              aria-label="标题"
              value={selected.title}
              readOnly={readonly}
              onChange={(event) =>
                updateDocument({
                  ...document,
                  units: updateWritingUnit(document.units, selected.id, {
                    title: event.target.value,
                  }),
                })
              }
            />
          </label>
          {!scoped && <button
            type="button"
            className="writing-delete-chapter is-danger"
            disabled={
              readonly || chapterOrder.handleProps(selected.id).disabled
            }
            onClick={() => onDeleteChapter(selected.id)}
          >
            <Trash2 size={14} />
            删除章节
          </button>}
        </div>
        {!scoped && <div className="writing-chapter-neighbors" aria-label="切换章节">
          {[
            { offset: -1, label: "上一章", Icon: ArrowLeft },
            { offset: 1, label: "下一章", Icon: ArrowRight },
          ].map(({ offset, label, Icon }) => {
            const neighbor =
              index.canonical[row!.ordinal - 1 + offset];
            return (
              <button
                key={label}
                type="button"
                disabled={navigationDisabled || !neighbor}
                title={
                  neighbor
                    ? `${neighbor.label}：${neighbor.unit.title}`
                    : undefined
                }
                onClick={() =>
                  neighbor &&
                  onSelect({
                    kind: "unit",
                    id: neighbor.unit.id,
                    tab: "body",
                  })
                }
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>}
        {!plan && <section className="writing-plan-reference" aria-label="本章剧情">
          <div className="writing-row"><h3>本章剧情</h3><button disabled={readonly || navigationDisabled} onClick={() => onSelect({ ...selection, tab: "plan" })}>修改</button></div>
          <p>{selected.plan}</p>
        </section>}
        {!plan && recoverableDraft && !value.unit?.body && <section className="writing-draft-recovery" aria-label="未完成正文草稿">
          <p>上次生成已中断，正文草稿已保留。</p><button disabled={readonly} onClick={() => value.unit && onChange({ ...value, unit: { ...value.unit, body: recoverableDraft } })}>恢复草稿</button>
        </section>}
        {!plan && selected.has_body && selected.continuity_status === "raw_pending" && !selected.dependency_stale && <p className="writing-continuity-note" role="status">正文已保存，记忆待补充。</p>}
        {!plan && selected.has_body && (selected.continuity_status === "pending" || selected.dependency_stale) && <p className="writing-continuity-note" role="status">正文已保存，剧情衔接待整理。</p>}

        {plan
          ? textEditor("章纲", selected.plan, (text) =>
              updateDocument({
                ...document,
                units: updateWritingUnit(document.units, selected.id, {
                  plan: text,
                }),
              }),
            )
          : value.unit &&
            textEditor(
              "正文",
              value.unit.body,
              (body) => onChange({ ...value, unit: { ...value.unit!, body } }),
            )}
      </>
    );
  }
  if (selection.kind === "section" && selection.id === "chapters")
    return <WritingChapterCards page={directory.page} onPage={directory.setPage} onSelect={onSelect} readonly={readonly} navigationDisabled={navigationDisabled} chapterOrder={chapterOrder} />;
  if (selection.kind === "section" && isWritingOutlineSection(selection.id)) {
    const section = selection.id;
    return textEditor("内容", document.outline[section], (text) => updateDocument({ ...document, outline: { ...document.outline, [section]: text } }));
  }

  const kind = writingEntitySection(selection);
  if (!kind) return null;
  const label = writingSections.find((section) => section.id === kind)!.label;
  const entities = document.outline[kind];
  if (selection.kind !== "entity") return null;
  const entity = entities.find((entry) => entry.id === selection.id);
  if (!entity) return null;
  const changeEntity = (patch: Partial<typeof entity>) =>
    updateDocument({
      ...document,
      outline: {
        ...document.outline,
        [kind]: entities.map((entry) =>
          entry.id === entity.id ? { ...entry, ...patch } : entry,
        ),
      },
    });
  return (
    <>
      <label className="writing-title-field">
        <span className="writing-sr-only">{label}名称</span>
        <input
          aria-label={`${label}名称`}
          value={entity.name}
          readOnly={readonly}
          onChange={(event) => changeEntity({ name: event.target.value })}
        />
      </label>
      {textEditor(`${label}描述`, entity.description, (description) =>
        changeEntity({ description }),
      )}
    </>
  );
}
