import { Loader2, Play } from "lucide-react";
import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { FirstFrameVideo } from "@/components/media/first-frame-video";
import {
  VideoThumbnail,
  type VideoThumbnailProps,
} from "./video-thumbnail";

type PlayableVideoPreviewProps = Omit<VideoThumbnailProps, "ariaHidden"> & {
  objectFit?: CSSProperties["objectFit"];
};

export function PlayableVideoPreview({
  src,
  poster = "",
  alt = "",
  className,
  style,
  title,
  draggable = false,
  ariaLabel,
  onLoad,
  onError,
  onMediaSize,
  objectFit = "cover",
}: PlayableVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [requestedSrc, setRequestedSrc] = useState("");
  const [readySrc, setReadySrc] = useState("");
  const [previewReadySrc, setPreviewReadySrc] = useState("");
  const [previewFailedSrc, setPreviewFailedSrc] = useState("");
  const requested = requestedSrc === src;
  const ready = readySrc === src;
  const previewLoading =
    previewReadySrc !== src && previewFailedSrc !== src;

  function stopMediaEvent(event: MouseEvent | PointerEvent) {
    event.stopPropagation();
  }

  function resetPlayback() {
    setRequestedSrc((current) => (current === src ? "" : current));
    setReadySrc((current) => (current === src ? "" : current));
  }

  function startPlayback(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    setRequestedSrc(src);
    setReadySrc("");
    void video.play().catch(() => {
      resetPlayback();
      onError?.();
    });
  }

  return (
    <div
      className={[
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      title={title}
      draggable={draggable}
    >
      <FirstFrameVideo
        videoRef={videoRef}
        src={src}
        poster={poster || undefined}
        controls={requested}
        playsInline
        preload="none"
        draggable={draggable}
        aria-hidden={ready ? undefined : true}
        className={[
          "nodrag nopan nowheel absolute inset-0 block h-full w-full",
          ready ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        style={{ objectFit }}
        onPointerDown={stopMediaEvent}
        onClick={stopMediaEvent}
        onLoadedMetadata={(event) =>
          onMediaSize?.(
            event.currentTarget.videoWidth,
            event.currentTarget.videoHeight,
          )
        }
        onPlaying={() => setReadySrc(src)}
        onError={() => {
          resetPlayback();
          onError?.();
        }}
      />
      {!ready ? (
        <>
          <VideoThumbnail
            src={src}
            poster={poster}
            alt={alt}
            className="pointer-events-none absolute inset-0 z-[1] block h-full w-full"
            style={{ objectFit }}
            draggable={draggable}
            ariaHidden
            onLoad={() => {
              setPreviewReadySrc(src);
              onLoad?.();
            }}
            onError={() => {
              setPreviewFailedSrc(src);
              onError?.();
            }}
            onMediaSize={onMediaSize}
          />
          {!requested ? (
            <button
              type="button"
              className="nodrag nopan nowheel absolute inset-0 z-[2] cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/80"
              aria-label={ariaLabel ? `播放${ariaLabel}` : "播放视频"}
              onPointerDown={stopMediaEvent}
              onClick={startPlayback}
            >
              <span
                className="absolute left-1/2 top-1/2 inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm"
              >
                {previewLoading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Play
                    size={16}
                    className="translate-x-px fill-current"
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
          ) : (
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm"
              role="status"
              aria-label="正在加载视频"
            >
              <Loader2
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            </span>
          )}
        </>
      ) : null}
    </div>
  );
}
