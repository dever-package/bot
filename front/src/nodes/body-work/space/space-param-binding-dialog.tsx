import { useEffect, useRef } from "react";
import { ArrowRight, Check, Music2, TextCursorInput, X } from "lucide-react";
import { canvasTextParamLabel } from "./space-param-binding";
import type { PowerParam } from "./types";
import { SpaceTooltip } from "./space-tooltip";

export function CanvasParamBindingDialog({
  sourceTitle,
  targetTitle,
  params,
  selectedParamKey,
  lyricsAvailable = false,
  lyricsSelected = false,
  editing = false,
  onSelect,
  onSelectLyrics,
  onClose,
}: {
  sourceTitle: string;
  targetTitle: string;
  params: PowerParam[];
  selectedParamKey?: string;
  lyricsAvailable?: boolean;
  lyricsSelected?: boolean;
  editing?: boolean;
  onSelect: (targetParamKey: string) => void;
  onSelectLyrics?: () => void;
  onClose: () => void;
}) {
  const firstOptionRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    firstOptionRef.current?.focus();
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="ws-param-binding-backdrop" onMouseDown={onClose}>
      <section
        className="ws-param-binding-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ws-param-binding-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <h3 id="ws-param-binding-title">
              {lyricsAvailable
                ? "选择文本用途"
                : editing
                  ? "调整参数连接"
                  : "传给哪个参数"}
            </h3>
            <p>
              <span>{sourceTitle || "上游节点"}</span>
              <ArrowRight size={13} aria-hidden="true" />
              <span>{targetTitle || "下游能力"}</span>
            </p>
          </div>
          <SpaceTooltip label={editing ? "关闭" : "取消连接"}>
            <button
              type="button"
              aria-label={editing ? "关闭" : "取消连接"}
              onClick={onClose}
            >
              <X size={17} />
            </button>
          </SpaceTooltip>
        </header>

        <div
          className="ws-param-binding-options"
          aria-label={lyricsAvailable ? "文本用途" : "目标参数"}
        >
          {params.map((param, index) => {
            const selected = selectedParamKey === param.key;
            return (
              <button
                key={param.key}
                ref={index === 0 ? firstOptionRef : undefined}
                type="button"
                className={selected ? "is-selected" : ""}
                aria-pressed={selected}
                onClick={() => onSelect(param.key)}
              >
                <TextCursorInput size={17} aria-hidden="true" />
                <span>
                  <strong>{canvasTextParamLabel(param)}</strong>
                </span>
                {selected ? (
                  <Check className="ws-param-binding-check" size={16} />
                ) : null}
              </button>
            );
          })}
          {lyricsAvailable ? (
            <button
              ref={params.length === 0 ? firstOptionRef : undefined}
              type="button"
              className={lyricsSelected ? "is-selected" : ""}
              aria-pressed={lyricsSelected}
              onClick={onSelectLyrics}
            >
              <Music2 size={17} aria-hidden="true" />
              <span>
                <strong>歌词</strong>
              </span>
              {lyricsSelected ? (
                <Check className="ws-param-binding-check" size={16} />
              ) : null}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
