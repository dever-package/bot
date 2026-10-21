import { useEffect, useRef, useState } from "react";
import {
  writingChapterRowHeight,
  writingChapterWindow,
} from "./writing-chapter-index";
import type { WritingChapterDirectory } from "./use-writing-chapter-directory";
import { WritingChapterHandle } from "./writing-chapter-handle";
import { ListTree, Plus } from "lucide-react";
import {
  writingPlanningComplete,
  writingProfile,
  writingUnitStatus,
  type WritingDocument,
  type WritingSelection,
} from "./writing-document";

import { type WritingChapterOrder } from "./use-writing-chapter-order";
import { writingSelectionReason } from "./writing-workspace";

export function WritingNavigation({
  document,
  selection,
  disabled,
  mutationDisabled,
  onSelect,
  onAdd,
  chapterOrder,
  directory: chapters,
}: {
  document: WritingDocument;
  selection?: WritingSelection;
  disabled: boolean;
  mutationDisabled: boolean;
  onSelect: (selection: WritingSelection) => void;
  onAdd: (selection: WritingSelection) => void;
  chapterOrder: WritingChapterOrder;
  directory: WritingChapterDirectory;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(400);
  const [jump, setJump] = useState("");
  const [jumpError, setJumpError] = useState("");
  const focusRow = chapters.index.byId.get(chapters.focus.id);
  const focusOffset = focusRow
    ? chapters.index.canonical.length - focusRow.ordinal
    : 0;
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.clientHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!viewport.current) return;
    viewport.current.scrollTop = 0;
  }, [chapters.query]);
  useEffect(() => {
    if (!viewport.current) return;
    viewport.current.scrollTop = focusOffset * writingChapterRowHeight;
  }, [chapters.focus, focusOffset]);
  const window = writingChapterWindow(chapters.rows.length, scrollTop, height);
  const profile = writingProfile;
  const directory: WritingSelection = { kind: "section", id: "chapters" };
  return (
    <nav className="writing-nav" aria-label="创作目录">
      <button
        disabled={disabled}
        aria-current={
          selection?.kind !== "unit" &&
          !(selection?.kind === "section" && selection.id === "chapters")
            ? "page"
            : undefined
        }
        onClick={() => onSelect({ kind: "section", id: "overview" })}
      >
        <ListTree size={16} />
        <span>大纲</span>
      </button>
      <div className="writing-unit-nav" aria-label={profile.directory}>
        <div className="writing-directory-heading">
          <button
            className="writing-directory-link"
            disabled={
              disabled || Boolean(writingSelectionReason(document, directory))
            }
            title={writingSelectionReason(document, directory) || undefined}
            aria-current={
              selection?.kind === "section" && selection.id === "chapters"
                ? "page"
                : undefined
            }
            onClick={() => onSelect(directory)}
          >
            <span>{profile.directory}</span>
            <small>{chapters.index.canonical.length}</small>
          </button>
          <button
            className="writing-add-unit"
            aria-label={`添加${profile.append}`}
            title={`添加${profile.append}`}
            disabled={
              disabled || mutationDisabled || !writingPlanningComplete(document)
            }
            onClick={() => onAdd(directory)}
          >
            <Plus size={15} />
          </button>
        </div>
        <div className="writing-chapter-tools">
          <input
            aria-label="搜索章节标题"
            placeholder="搜索章节标题"
            value={chapters.query}
            disabled={disabled}
            onChange={(event) => chapters.search(event.target.value)}
          />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const row = chapters.byNumber(jump);
              if (!row) {
                setJumpError("请输入有效章号");
                return;
              }
              setJumpError("");
              // 新章节只在保存和读取成功后随 selection 定位，失败仍留在原章。
              if (selection?.kind === "unit" && selection.id === row.unit.id)
                chapters.locate(row.unit.id);
              onSelect({
                kind: "unit",
                id: row.unit.id,
                tab: "body",
              });
            }}
          >
            <input
              aria-label="跳转章号"
              inputMode="numeric"
              placeholder="章号"
              value={jump}
              disabled={disabled}
              onChange={(event) => {
                setJump(event.target.value);
                setJumpError("");
              }}
            />
            <button type="submit" disabled={disabled || !jump.trim()}>
              跳转
            </button>
          </form>
          {jumpError && <small role="alert">{jumpError}</small>}
          {chapters.query && <small>{chapters.rows.length} 个匹配章节</small>}
        </div>
        <div
          ref={viewport}
          className="writing-chapter-viewport"
          aria-label="章节目录列表"
          role="list"
          tabIndex={0}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          onKeyDown={(event) => {
            if (
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              !chapters.rows.length
            )
              return;
            const position =
              event.target instanceof Element
                ? Number(
                    event.target.closest<HTMLElement>("[data-chapter-index]")
                      ?.dataset.chapterIndex ?? -1,
                  )
                : -1;
            const current =
              position < 0
                ? Math.floor(scrollTop / writingChapterRowHeight)
                : position;
            const pageRows = Math.max(
              1,
              Math.floor(height / writingChapterRowHeight),
            );
            const destinations: Record<string, number> = {
              ArrowUp: current - 1,
              ArrowDown: current + 1,
              Home: 0,
              End: chapters.rows.length - 1,
              PageUp: current - pageRows,
              PageDown: current + pageRows,
            };
            if (!(event.key in destinations)) return;
            event.preventDefault();
            const next = Math.max(
              0,
              Math.min(chapters.rows.length - 1, destinations[event.key]),
            );
            event.currentTarget.scrollTop = next * writingChapterRowHeight;
            setScrollTop(event.currentTarget.scrollTop);
            requestAnimationFrame(() => {
              viewport.current
                ?.querySelector<HTMLButtonElement>(
                  `[data-chapter-index="${next}"] > button:first-child`,
                )
                ?.focus();
            });
          }}
        >
          <div
            className="writing-chapter-window"
            style={{ height: window.height }}
          >
            {chapters.rows
              .slice(window.start, window.end)
              .map((row, offset) => {
                const { unit } = row;
                const target: WritingSelection = {
                  kind: "unit",
                  id: unit.id,
                  tab: "body",
                };
                const reason = writingSelectionReason(document, target);
                return (
                  <div
                    key={unit.id || row.ordinal}
                    className="writing-nav-entry"
                    role="listitem"
                    aria-posinset={window.start + offset + 1}
                    aria-setsize={chapters.rows.length}
                    data-chapter-index={window.start + offset}
                    style={{
                      position: "absolute",
                      top: (window.start + offset) * writingChapterRowHeight,
                      height: writingChapterRowHeight,
                    }}
                    {...chapterOrder.itemProps(unit.id)}
                  >
                    <button
                      disabled={disabled || Boolean(reason)}
                      title={reason || undefined}
                      aria-label={`${row.label}：${unit.title}`}
                      aria-current={
                        selection?.kind === "unit" && selection.id === unit.id
                          ? "page"
                          : undefined
                      }
                      onClick={() => onSelect(target)}
                    >
                      <span>
                        <small>{row.label}</small>
                        <strong title={unit.title}>{unit.title}</strong>
                      </span>
                      <small
                        className={unit.has_body ? "is-written" : undefined}
                      >
                        {writingUnitStatus(unit)}
                      </small>
                    </button>
                    <WritingChapterHandle
                      order={chapterOrder}
                      id={unit.id}
                      title={unit.title}
                    />
                  </div>
                );
              })}
          </div>
          {!chapters.rows.length && (
            <p className="writing-chapter-empty">
              {chapters.query ? "没有匹配的章节" : "暂无章节"}
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}
