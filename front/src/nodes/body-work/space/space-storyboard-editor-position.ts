type Rect = { left: number; top: number; width: number; height: number };

export function storyboardEditorPosition(
  anchor: Rect,
  editor: { width: number; height: number },
  viewport: { width: number; height: number },
) {
  const margin = 16;
  const gap = 16;
  const width = Math.min(editor.width, Math.max(0, viewport.width - margin * 2));
  const centeredLeft = anchor.left + anchor.width / 2;
  const left = Math.min(
    Math.max(margin + width / 2, centeredLeft),
    viewport.width - margin - width / 2,
  );
  const below = anchor.top + anchor.height + gap;
  // 靠近屏幕底部时仅向内收拢固定的可操作空间，不随懒加载内容高度翻转。
  const minimumVisibleHeight = 240;
  const top = Math.min(
    Math.max(margin, below),
    Math.max(margin, viewport.height - margin - minimumVisibleHeight),
  );
  const maxHeight = Math.max(0, viewport.height - margin - top);
  return { left, top, maxHeight };
}
