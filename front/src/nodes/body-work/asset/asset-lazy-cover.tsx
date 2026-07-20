import { useEffect, useRef, useState } from "react";

type AssetCoverKind = "image" | "video";

export function AssetLazyCover({
  kind,
  src,
}: {
  kind: AssetCoverKind;
  src: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSrc, setActiveSrc] = useState("");
  const [loadedSrc, setLoadedSrc] = useState("");
  const [failedSrc, setFailedSrc] = useState("");
  const active = activeSrc === src;
  const loaded = loadedSrc === src;
  const failed = failedSrc === src;

  useEffect(() => {
    const container = containerRef.current;
    if (!src || !container || typeof IntersectionObserver === "undefined") {
      setActiveSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setActiveSrc(src);
        observer.disconnect();
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [src]);

  function markLoaded() {
    setLoadedSrc(src);
    setFailedSrc("");
  }

  function markFailed() {
    setLoadedSrc("");
    setFailedSrc(src);
  }

  return (
    <div
      ref={containerRef}
      className={[
        "wb-asset-lazy-cover",
        `is-${kind}`,
        loaded ? "is-loaded" : "is-pending",
        failed ? "is-failed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {active && !failed ? (
        kind === "image" ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={markLoaded}
            onError={markFailed}
          />
        ) : (
          <video
            src={src}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            onLoadedMetadata={markLoaded}
            onLoadedData={markLoaded}
            onError={markFailed}
          />
        )
      ) : null}
      {failed ? <span>封面加载失败</span> : null}
    </div>
  );
}
