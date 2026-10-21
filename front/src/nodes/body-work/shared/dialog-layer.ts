export function isTopDialogLayer(element: Element | null) {
  if (!element) return false;
  // 沿用现有弹窗层标记，最后插入的层优先处理键盘关闭。
  const layers = document.querySelectorAll('[data-slot="dialog-layer"]');
  return layers.item(layers.length - 1)?.contains(element) || false;
}
