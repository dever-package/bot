type Rect = { left: number; top: number; width: number; height: number };

export function storyboardEditorPosition(
  anchor: Rect,
  editor: { width: number; height: number },
  viewport: { width: number; height: number },
) {
  const margin = 16;
  const gap = 16;
  const width = Math.min(editor.width, Math.max(0, viewport.width - margin * 2));
  const height = Math.min(editor.height, Math.max(0, viewport.height - margin * 2));
  const centeredLeft = anchor.left + anchor.width / 2;
  const left = Math.min(
    Math.max(margin + width / 2, centeredLeft),
    viewport.width - margin - width / 2,
  );
  const below = anchor.top + anchor.height + gap;
  const above = anchor.top - editor.height - gap;
  const preferredTop =
    below + editor.height <= viewport.height - margin || above < margin
      ? below
      : above;
  const top = Math.min(
    Math.max(margin, preferredTop),
    viewport.height - margin - height,
  );
  return { left, top };
}
