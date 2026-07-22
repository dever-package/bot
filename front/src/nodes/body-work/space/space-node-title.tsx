import { useEffect, useRef, useState } from "react";
import { SpaceTooltip } from "./space-tooltip";

export function EditableCanvasNodeTitle({
  title,
  className,
  fallback = "未命名节点",
  onRename,
}: {
  title: string;
  className?: string;
  fallback?: string;
  onRename?: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(title);
    }
  }, [editing, title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const finish = () => {
    const nextTitle = draft.trim() || fallback;
    setEditing(false);
    setDraft(nextTitle);
    if (nextTitle !== title) {
      onRename?.(nextTitle);
    }
  };

  if (editing && onRename) {
    return (
      <input
        ref={inputRef}
        className={`ws-canvas-node-title-input nodrag nowheel ${className || ""}`.trim()}
        value={draft}
        maxLength={64}
        aria-label="节点名称"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={finish}
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "Enter") {
            event.preventDefault();
            finish();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setDraft(title);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <SpaceTooltip label={onRename ? "双击重命名" : title}>
      <span
        className={className}
        onDoubleClick={
          onRename
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
                setEditing(true);
              }
            : undefined
        }
      >
        {title || fallback}
      </span>
    </SpaceTooltip>
  );
}
