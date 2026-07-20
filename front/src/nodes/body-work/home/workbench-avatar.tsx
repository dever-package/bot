import { useEffect, useState } from "react";

export function WorkbenchAvatar({
  src,
  name,
  account,
  className = "",
}: {
  src?: string;
  name?: string;
  account?: string;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  return (
    <span className={`hb-workbench-avatar ${className}`.trim()}>
      {src && !imageFailed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{avatarText(name || account)}</span>
      )}
    </span>
  );
}

function avatarText(value: unknown) {
  const text = String(value || "用").trim();
  return (text || "用").slice(0, 1).toUpperCase();
}
