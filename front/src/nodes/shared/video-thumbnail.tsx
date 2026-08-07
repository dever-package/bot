import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { FirstFrameVideo } from "./first-frame-video";

const QINIU_FIRST_FRAME_OPERATION = "vframe/jpg/offset/0/w/640";
const FIRST_FRAME_OFFSET_SECONDS = 0.01;
const MAX_CAPTURE_CONCURRENCY = 2;
const MAX_CAPTURE_CACHE_SIZE = 80;
const MAX_FAILURE_CACHE_SIZE = 160;
const CAPTURE_TIMEOUT_MS = 15_000;

type CapturedVideoThumbnail = {
  blob: Blob;
  width: number;
  height: number;
};

type CaptureQueueTask = {
  src: string;
  resolve: (result: CapturedVideoThumbnail) => void;
  reject: (error: Error) => void;
};

type VideoThumbnailProps = {
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
const captureRequests = new Map<string, Promise<CapturedVideoThumbnail>>();
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
  const [captured, setCaptured] = useState<{
    src: string;
    result: CapturedVideoThumbnail;
  }>();
  const [failedCaptureSrc, setFailedCaptureSrc] = useState("");
  const [capturedURL, setCapturedURL] = useState("");
  const remoteURL = poster.trim() || qiniuVideoFirstFrameURL(src);
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
    const element = visibilityRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setActive(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    if (!active || !remoteFailed || captureResult || captureFailed || !src) {
      return;
    }
    let cancelled = false;
    void requestCapturedVideoThumbnail(src).then(
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
    return <img {...commonImageProps} />;
  }
  if (!remoteFailed) {
    return (
      <img
        {...commonImageProps}
        src={remoteURL}
        loading="lazy"
        decoding="async"
        onLoad={(event) => {
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
        decoding="async"
        onLoad={() => {
          onMediaSize?.(captureResult.width, captureResult.height);
          onLoad?.();
        }}
        onError={() => setFailedCaptureSrc(src)}
      />
    );
  }
  if (!captureFailed) {
    return <img {...commonImageProps} />;
  }
  return (
    <FirstFrameVideo
      src={src}
      className={className}
      style={style}
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
      onFirstFrameReady={onLoad}
      onError={onError}
    />
  );
}

export function qiniuVideoFirstFrameURL(src: string) {
  const value = String(src || "").trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }
    if (url.search.includes("vframe/")) {
      return value;
    }
    const hash = url.hash;
    url.hash = "";
    return `${url.toString()}${url.search ? "&" : "?"}${QINIU_FIRST_FRAME_OPERATION}${hash}`;
  } catch {
    return "";
  }
}

function requestCapturedVideoThumbnail(src: string) {
  const cached = captureCache.get(src);
  if (cached) {
    touchCapturedThumbnail(src, cached);
    return Promise.resolve(cached);
  }
  if (failedCaptureURLs.has(src)) {
    return Promise.reject(new Error("视频首帧无法缓存"));
  }
  const pending = captureRequests.get(src);
  if (pending) return pending;

  const request = new Promise<CapturedVideoThumbnail>((resolve, reject) => {
    captureQueue.push({ src, resolve, reject });
    drainCaptureQueue();
  }).finally(() => {
    captureRequests.delete(src);
  });
  captureRequests.set(src, request);
  return request;
}

function drainCaptureQueue() {
  while (
    activeCaptureCount < MAX_CAPTURE_CONCURRENCY &&
    captureQueue.length > 0
  ) {
    const task = captureQueue.shift();
    if (!task) return;
    activeCaptureCount += 1;
    void captureVideoThumbnail(task.src)
      .then((result) => {
        touchCapturedThumbnail(task.src, result);
        task.resolve(result);
      })
      .catch((error: unknown) => {
        rememberFailedURL(failedCaptureURLs, task.src);
        task.reject(
          error instanceof Error ? error : new Error("视频首帧提取失败"),
        );
      })
      .finally(() => {
        activeCaptureCount -= 1;
        drainCaptureQueue();
      });
  }
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

function captureVideoThumbnail(src: string) {
  return new Promise<CapturedVideoThumbnail>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("当前环境无法提取视频首帧"));
      return;
    }

    const video = document.createElement("video");
    let settled = false;
    let captureStarted = false;
    const timeout = window.setTimeout(
      () => fail(new Error("视频首帧提取超时")),
      CAPTURE_TIMEOUT_MS,
    );

    const cleanup = () => {
      window.clearTimeout(timeout);
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

    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.addEventListener("error", () => fail(new Error("视频首帧加载失败")));
    video.addEventListener("loadeddata", capture);
    video.addEventListener("seeked", capture);
    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;
      const target =
        Number.isFinite(duration) && duration > 0
          ? Math.min(FIRST_FRAME_OFFSET_SECONDS, duration / 2)
          : FIRST_FRAME_OFFSET_SECONDS;
      try {
        video.currentTime = target;
      } catch {
        capture();
      }
    });
    video.src = src;
    video.load();
  });
}
