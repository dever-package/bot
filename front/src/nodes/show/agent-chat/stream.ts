export type StreamTextBuffer = {
  readonly text: string;
  append: (delta: string) => void;
  reset: (text?: string) => void;
  flush: () => void;
  dispose: () => void;
};

const DEFAULT_FLUSH_INTERVAL = 32;

export function createStreamTextBuffer(
  initialText: string,
  onFlush: (text: string) => void,
  interval = DEFAULT_FLUSH_INTERVAL,
): StreamTextBuffer {
  let text = initialText;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let firstDelta = true;
  let lastFlushAt = 0;

  const clearTimer = () => {
    if (timer == null) {
      return;
    }
    clearTimeout(timer);
    timer = null;
  };

  const flush = () => {
    clearTimer();
    lastFlushAt = now();
    onFlush(text);
  };

  const schedule = () => {
    if (timer != null) {
      return;
    }
    const elapsed = now() - lastFlushAt;
    const delay = Math.max(0, interval - elapsed);
    timer = setTimeout(flush, delay);
  };

  return {
    get text() {
      return text;
    },
    append(delta) {
      if (!delta) {
        return;
      }
      text += delta;
      if (firstDelta) {
        firstDelta = false;
        flush();
        return;
      }
      schedule();
    },
    reset(nextText = "") {
      clearTimer();
      text = nextText;
      firstDelta = true;
      lastFlushAt = 0;
    },
    flush,
    dispose() {
      clearTimer();
    },
  };
}

function now() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}
