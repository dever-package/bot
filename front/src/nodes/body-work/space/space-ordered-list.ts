export function moveOrderedItemById<T>(
  items: T[],
  sourceId: string,
  targetId: string,
  placement: "before" | "after",
  itemId: (item: T) => string,
) {
  if (!sourceId || !targetId || sourceId === targetId) {
    return items;
  }
  const sourceIndex = items.findIndex((item) => itemId(item) === sourceId);
  if (sourceIndex < 0) {
    return items;
  }
  const next = [...items];
  const [source] = next.splice(sourceIndex, 1);
  const targetIndex = next.findIndex((item) => itemId(item) === targetId);
  if (targetIndex < 0) {
    return items;
  }
  next.splice(targetIndex + (placement === "after" ? 1 : 0), 0, source);
  return next;
}
