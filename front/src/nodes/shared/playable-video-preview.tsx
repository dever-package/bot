import { Loader2, Pause, Play } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { FirstFrameVideo } from "@/components/media/first-frame-video";
import {
  VideoThumbnail,
  type VideoThumbnailProps,
} from "./video-thumbnail";

type PlayableVideoPreviewProps = Omit<VideoThumbnailProps, "ariaHidden"> & {
  objectFit?: CSSProperties["objectFit"];
  allowDragFromVideo?: boolean;
  playButtonOnly?: boolean;
};

const VIDEO_CONTROL_MAX_HEIGHT = 56;

export function isVideoControlRegion(
  video: HTMLVideoElement,
  clientY: number,
) {
  const bounds = video.getBoundingClientRect();
  const controlHeight = Math.min(
    VIDEO_CONTROL_MAX_HEIGHT,
    bounds.height * 0.25,
  );
  return clientY >= bounds.bottom - controlHeight;
}

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
  allowDragFromVideo = false,
  playButtonOnly = false,
}: PlayableVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [requestedSrc, setRequestedSrc] = useState("");
  const [readySrc, setReadySrc] = useState("");
  const [playingSrc, setPlayingSrc] = useState("");
  const [previewReadySrc, setPreviewReadySrc] = useState("");
  const [previewFailedSrc, setPreviewFailedSrc] = useState("");
  const requested = requestedSrc === src;
  const ready = readySrc === src;
  const playing = playingSrc === src;
  const previewLoading =
    previewReadySrc !== src && previewFailedSrc !== src;
  const showPlaybackButton = playButtonOnly || (!ready && !requested);
  const showLoadingIndicator = !playButtonOnly && requested && !ready;
  const playbackButtonPosition = playButtonOnly
    ? "bottom-2 left-2"
    : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

  // React Flow starts dragging from native mouse/touch events on an ancestor.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allowDragFromVideo || playButtonOnly) return;

    const stopMouseControlDrag = (event: MouseEvent) => {
      if (isVideoControlRegion(video, event.clientY)) {
        event.stopPropagation();
      }
    };
    const stopTouchControlDrag = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch && isVideoControlRegion(video, touch.clientY)) {
        event.stopPropagation();
      }
    };

    video.addEventListener("mousedown", stopMouseControlDrag);
    video.addEventListener("touchstart", stopTouchControlDrag, {
      passive: true,
    });
    return () => {
      video.removeEventListener("mousedown", stopMouseControlDrag);
      video.removeEventListener("touchstart", stopTouchControlDrag);
    };
  }, [allowDragFromVideo, playButtonOnly]);

  function stopMediaEvent(event: ReactMouseEvent | ReactPointerEvent) {
    event.stopPropagation();
  }

  function resetPlayback() {
    setRequestedSrc((current) => (current === src ? "" : current));
    setReadySrc((current) => (current === src ? "" : current));
    setPlayingSrc((current) => (current === src ? "" : current));
  }

  function togglePlayback(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      setPlayingSrc((current) => (current === src ? "" : current));
      video.pause();
      return;
    }

    setRequestedSrc(src);
    setPlayingSrc(src);
    if (!ready) {
      setReadySrc("");
    }
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
        controls={requested && !playButtonOnly}
        playsInline
        preload="none"
        draggable={draggable}
        aria-hidden={ready ? undefined : true}
        className={[
          allowDragFromVideo ? "" : "nodrag",
          "nopan nowheel absolute inset-0 block h-full w-full",
          ready ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        style={{ objectFit }}
        onPointerDown={
          playButtonOnly || allowDragFromVideo ? undefined : stopMediaEvent
        }
        onClick={playButtonOnly ? undefined : stopMediaEvent}
        onLoadedMetadata={(event) =>
          onMediaSize?.(
            event.currentTarget.videoWidth,
            event.currentTarget.videoHeight,
          )
        }
        onPlaying={() => {
          setReadySrc(src);
          setPlayingSrc(src);
        }}
        onPause={() =>
          setPlayingSrc((current) => (current === src ? "" : current))
        }
        onEnded={() =>
          setPlayingSrc((current) => (current === src ? "" : current))
        }
        onError={() => {
          resetPlayback();
          onError?.();
        }}
      />
      {!ready ? (
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
      ) : null}
      {showPlaybackButton ? (
        <button
          type="button"
          className={`nodrag nopan nowheel absolute z-[2] inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${playbackButtonPosition}`}
          aria-label={
            playing
              ? "暂停视频"
              : ariaLabel
                ? `播放${ariaLabel}`
                : "播放视频"
          }
          aria-pressed={playing}
          onPointerDown={stopMediaEvent}
          onClick={togglePlayback}
        >
          {playing ? (
            <Pause size={16} className="fill-current" aria-hidden="true" />
          ) : previewLoading && !ready ? (
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
        </button>
      ) : showLoadingIndicator ? (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm"
          role="status"
          aria-label="正在加载视频"
        >
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        </span>
      ) : null}
    </div>
  );
}
