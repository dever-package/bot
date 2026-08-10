import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { FirstFrameVideo } from "@/components/media/first-frame-video";

const FIRST_FRAME_OFFSET_SECONDS = 0.01;
const MAX_CAPTURE_CONCURRENCY = 2;
const MAX_CAPTURE_CACHE_SIZE = 48;
const MAX_FAILURE_CACHE_SIZE = 160;
const CAPTURE_TIMEOUT_MS = 10_000;

type CapturedVideoThumbnail = {
  blob: Blob;
  width: number;
  height: number;
};

type CaptureQueueTask = {
  src: string;
  consumers: number;
  state: "queued" | "active" | "settled";
  promise: Promise<CapturedVideoThumbnail>;
  resolve: (result: CapturedVideoThumbnail) => void;
  reject: (error: Error) => void;
  cancelCapture?: () => void;
};

type CapturedVideoThumbnailLease = {
  promise: Promise<CapturedVideoThumbnail>;
  release: () => void;
};

type VideoThumbnailCapture = {
  promise: Promise<CapturedVideoThumbnail>;
  cancel: () => void;
};

export type VideoThumbnailProps = {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  draggable?: boolean;
  ariaLabel?: string;
  ariaHidden?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  onMediaSize?: (width: number, height: number) => void;
};

const captureCache = new Map<string, CapturedVideoThumbnail>();
const captureRequests = new Map<string, CaptureQueueTask>();
const failedRemoteThumbnailURLs = new Set<string>();
const failedCaptureURLs = new Set<string>();
const captureQueue: CaptureQueueTask[] = [];
let activeCaptureCount = 0;

export function VideoThumbnail({
  src,
  poster = "",
  alt = "",
  className,
  style,
  title,
  draggable = false,
  ariaLabel,
  ariaHidden,
  onLoad,
  onError,
  onMediaSize,
}: VideoThumbnailProps) {
  const visibilityRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(false);
  const [failedRemoteURL, setFailedRemoteURL] = useState("");
  const [loadedRemoteURL, setLoadedRemoteURL] = useState("");
  const [captured, setCaptured] = useState<{
    src: string;
    result: CapturedVideoThumbnail;
  }>();
  const [failedCaptureSrc, setFailedCaptureSrc] = useState("");
  const [capturedURL, setCapturedURL] = useState("");
  const [loadedCapturedURL, setLoadedCapturedURL] = useState("");
  const [loadedFallbackSrc, setLoadedFallbackSrc] = useState("");
  const remoteURL = poster.trim() || explicitVideoPreviewURL(src);
  const remoteFailed =
    !remoteURL ||
    failedRemoteURL === remoteURL ||
    failedRemoteThumbnailURLs.has(remoteURL);
  const captureResult = captured?.src === src ? captured.result : undefined;
  const captureFailed = failedCaptureSrc === src;
  useEffect(() => {
    if (
      !captureResult ||
      captureFailed ||
      typeof window === "undefined" ||
      typeof window.URL?.createObjectURL !== "function"
    ) {
      setCapturedURL("");
      return;
    }
    const nextURL = window.URL.createObjectURL(captureResult.blob);
    setCapturedURL(nextURL);
    return () => {
      if (typeof window.URL?.revokeObjectURL === "function") {
        window.URL.revokeObjectURL(nextURL);
      }
    };
  }, [captureFailed, captureResult]);

  useEffect(() => {
    if (captureFailed) {
      setActive(true);
      return;
    }
    const element = visibilityRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((item) => item.target === element);
        if (entry) {
          setActive(entry.isIntersecting);
        }
      },
      { rootMargin: "80px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [captureFailed, src]);

  useEffect(() => {
    if (!active || !remoteFailed || captureResult || captureFailed || !src) {
      return;
    }
    let cancelled = false;
    const lease = acquireCapturedVideoThumbnail(src);
    void lease.promise.then(
      (result) => {
        if (!cancelled) {
          setCaptured({ src, result });
        }
      },
      () => {
        if (!cancelled) {
          setFailedCaptureSrc(src);
        }
      },
    );
    return () => {
      cancelled = true;
      lease.release();
    };
  }, [active, captureFailed, captureResult, remoteFailed, src]);

  const commonImageProps = {
    ref: visibilityRef,
    alt,
    className,
    style,
    title,
    draggable,
    "aria-label": ariaLabel,
    "aria-hidden": ariaHidden ? true : undefined,
  };

  if (!active) {
    return <img {...commonImageProps} style={previewStyle(style, false)} />;
  }
  if (!remoteFailed) {
    return (
      <img
        {...commonImageProps}
        src={remoteURL}
        style={previewStyle(style, loadedRemoteURL === remoteURL)}
        loading="lazy"
        decoding="async"
        onLoad={(event) => {
          setLoadedRemoteURL(remoteURL);
          onMediaSize?.(
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight,
          );
          onLoad?.();
        }}
        onError={() => {
          rememberFailedURL(failedRemoteThumbnailURLs, remoteURL);
          setFailedRemoteURL(remoteURL);
        }}
      />
    );
  }
  if (captureResult && capturedURL && !captureFailed) {
    return (
      <img
        {...commonImageProps}
        src={capturedURL}
        style={previewStyle(style, loadedCapturedURL === capturedURL)}
        decoding="async"
        onLoad={() => {
          setLoadedCapturedURL(capturedURL);
          onMediaSize?.(captureResult.width, captureResult.height);
          onLoad?.();
        }}
        onError={() => setFailedCaptureSrc(src)}
      />
    );
  }
  if (!captureFailed) {
    return <img {...commonImageProps} style={previewStyle(style, false)} />;
  }
  return (
    <FirstFrameVideo
      src={src}
      className={className}
      style={previewStyle(style, loadedFallbackSrc === src)}
      title={title}
      muted
      playsInline
      preload="metadata"
      draggable={draggable}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ? true : undefined}
      onLoadedMetadata={(event) =>
        onMediaSize?.(
          event.currentTarget.videoWidth,
          event.currentTarget.videoHeight,
        )
      }
      onFirstFrameReady={() => {
        setLoadedFallbackSrc(src);
        onLoad?.();
      }}
      onError={onError}
    />
  );
}

function explicitVideoPreviewURL(src: string) {
  const value = String(src || "").trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }
    return url.search.includes("vframe/") ? value : "";
  } catch {
    return "";
  }
}

function previewStyle(style: CSSProperties | undefined, ready: boolean) {
  return ready ? style : { ...style, visibility: "hidden" as const };
}

function acquireCapturedVideoThumbnail(
  src: string,
): CapturedVideoThumbnailLease {
  const cached = captureCache.get(src);
  if (cached) {
    touchCapturedThumbnail(src, cached);
    return { promise: Promise.resolve(cached), release: () => undefined };
  }
  if (failedCaptureURLs.has(src)) {
    return {
      promise: Promise.reject(new Error("视频首帧无法缓存")),
      release: () => undefined,
    };
  }
  let task = captureRequests.get(src);
  if (!task) {
    let resolveRequest!: (result: CapturedVideoThumbnail) => void;
    let rejectRequest!: (error: Error) => void;
    const promise = new Promise<CapturedVideoThumbnail>((resolve, reject) => {
      resolveRequest = resolve;
      rejectRequest = reject;
    });
    task = {
      src,
      consumers: 0,
      state: "queued",
      promise,
      resolve: resolveRequest,
      reject: rejectRequest,
    };
    captureRequests.set(src, task);
    captureQueue.push(task);
  }
  task.consumers += 1;
  drainCaptureQueue();
  let released = false;
  return {
    promise: task.promise,
    release: () => {
      if (released) return;
      released = true;
      releaseCapturedVideoThumbnail(task);
    },
  };
}

function releaseCapturedVideoThumbnail(task: CaptureQueueTask) {
  task.consumers = Math.max(0, task.consumers - 1);
  if (task.consumers > 0 || task.state === "settled") {
    return;
  }
  if (task.state === "active") {
    const cancelCapture = task.cancelCapture;
    settleCaptureTask(task);
    task.reject(captureAbortError());
    cancelCapture?.();
    return;
  }
  const queuedIndex = captureQueue.indexOf(task);
  if (queuedIndex >= 0) {
    captureQueue.splice(queuedIndex, 1);
  }
  settleCaptureTask(task);
  task.reject(captureAbortError());
  drainCaptureQueue();
}

function drainCaptureQueue() {
  while (
    activeCaptureCount < MAX_CAPTURE_CONCURRENCY &&
    captureQueue.length > 0
  ) {
    const task = captureQueue.shift();
    if (!task) return;
    if (task.state !== "queued" || task.consumers === 0) {
      continue;
    }
    task.state = "active";
    activeCaptureCount += 1;
    const capture = captureVideoThumbnail(task.src);
    task.cancelCapture = capture.cancel;
    void capture.promise
      .then((result) => {
        if (task.state === "settled") return;
        touchCapturedThumbnail(task.src, result);
        settleCaptureTask(task);
        task.resolve(result);
      })
      .catch((error: unknown) => {
        if (task.state === "settled") return;
        const normalizedError =
          error instanceof Error ? error : new Error("视频首帧提取失败");
        if (normalizedError.name !== "AbortError") {
          rememberFailedURL(failedCaptureURLs, task.src);
        }
        settleCaptureTask(task);
        task.reject(normalizedError);
      })
      .finally(() => {
        activeCaptureCount -= 1;
        drainCaptureQueue();
      });
  }
}

function settleCaptureTask(task: CaptureQueueTask) {
  task.state = "settled";
  task.cancelCapture = undefined;
  if (captureRequests.get(task.src) === task) {
    captureRequests.delete(task.src);
  }
}

function captureAbortError() {
  const error = new Error("视频首帧提取已取消");
  error.name = "AbortError";
  return error;
}

function touchCapturedThumbnail(src: string, result: CapturedVideoThumbnail) {
  captureCache.delete(src);
  captureCache.set(src, result);
  while (captureCache.size > MAX_CAPTURE_CACHE_SIZE) {
    const oldest = captureCache.keys().next().value as string | undefined;
    if (!oldest) return;
    captureCache.delete(oldest);
  }
}

function rememberFailedURL(cache: Set<string>, url: string) {
  cache.delete(url);
  cache.add(url);
  while (cache.size > MAX_FAILURE_CACHE_SIZE) {
    const oldest = cache.values().next().value as string | undefined;
    if (!oldest) return;
    cache.delete(oldest);
  }
}

function captureVideoThumbnail(src: string): VideoThumbnailCapture {
  let cancel: () => void = () => undefined;
  const promise = new Promise<CapturedVideoThumbnail>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("当前环境无法提取视频首帧"));
      return;
    }

    const video = document.createElement("video");
    let settled = false;
    let captureStarted = false;
    let seekRequested = false;
    let seekTarget = FIRST_FRAME_OFFSET_SECONDS;
    let timeout = 0;

    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const capture = () => {
      if (
        settled ||
        captureStarted ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
        video.videoWidth <= 0 ||
        video.videoHeight <= 0
      ) {
        return;
      }
      captureStarted = true;
      try {
        const width = Math.min(640, video.videoWidth);
        const height = Math.max(
          1,
          Math.round((video.videoHeight / video.videoWidth) * width),
        );
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          fail(new Error("浏览器无法创建首帧画布"));
          return;
        }
        context.drawImage(video, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (settled) return;
            if (!blob) {
              fail(new Error("浏览器无法编码视频首帧"));
              return;
            }
            settled = true;
            cleanup();
            resolve({ blob, width, height });
          },
          "image/jpeg",
          0.82,
        );
      } catch (error) {
        fail(error instanceof Error ? error : new Error("视频首帧提取失败"));
      }
    };
    const handleError = () => fail(new Error("视频首帧加载失败"));
    const handleLoadedData = () => {
      if (
        !seekRequested ||
        Math.abs(video.currentTime - seekTarget) < 0.001
      ) {
        capture();
      }
    };
    const handleSeeked = () => capture();
    const handleLoadedMetadata = () => {
      const duration = video.duration;
      seekTarget =
        Number.isFinite(duration) && duration > 0
          ? Math.min(FIRST_FRAME_OFFSET_SECONDS, duration / 2)
          : FIRST_FRAME_OFFSET_SECONDS;
      try {
        seekRequested = true;
        video.currentTime = seekTarget;
      } catch {
        seekRequested = false;
        capture();
      }
    };

    cancel = () => fail(captureAbortError());
    timeout = window.setTimeout(
      () => fail(new Error("视频首帧提取超时")),
      CAPTURE_TIMEOUT_MS,
    );

    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.addEventListener("error", handleError);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.src = src;
    video.load();
  });
  return { promise, cancel: () => cancel() };
}
