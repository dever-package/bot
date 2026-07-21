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

export function orderItemsByIds<T>(
  items: T[],
  orderedIds: string[],
  itemId: (item: T) => string,
) {
  if (!orderedIds.length) {
    return items;
  }
  const itemsById = new Map(items.map((item) => [itemId(item), item]));
  const orderedItems: T[] = [];
  for (const id of orderedIds) {
    if (itemsById.has(id)) {
      orderedItems.push(itemsById.get(id) as T);
    }
  }
  const includedIds = new Set(orderedItems.map(itemId));
  return [
    ...orderedItems,
    ...items.filter((item) => !includedIds.has(itemId(item))),
  ];
}

export function sameOrderedIds(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((itemId, index) => itemId === right[index])
  );
}
