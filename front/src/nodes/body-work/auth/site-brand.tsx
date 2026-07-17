import { type ReactNode, useEffect, useState } from "react";
import { SiteLogo } from "@dever/front-plugin";
import type { BodySiteConfig } from "./site-config";

export function BodySiteBrand({
  site,
  className = "",
  logoClassName = "",
  nameClassName = "",
}: {
  site: BodySiteConfig;
  className?: string;
  logoClassName?: string;
  nameClassName?: string;
}) {
  return (
    <span className={className} aria-label={site.siteName}>
      <BodyConfiguredImage
        src={site.logo}
        alt=""
        className={logoClassName}
        fallback={<SiteLogo className={logoClassName} />}
      />
      <span className={nameClassName}>{site.siteName}</span>
    </span>
  );
}

export function BodyConfiguredImage({
  src,
  alt,
  className = "",
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
}) {
  const [failedSource, setFailedSource] = useState("");

  useEffect(() => {
    setFailedSource("");
  }, [src]);

  if (!src || failedSource === src) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
}
