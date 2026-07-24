export function safeBodyLinkURL(value: unknown) {
  if (typeof window === "undefined") {
    return "";
  }
  return safeBodyURL(
    value,
    ["http:", "https:", "mailto:"],
    window.location.origin,
  );
}

export function safeBodyExternalURL(value: unknown) {
  return safeBodyURL(value, ["http:", "https:"]);
}

function safeBodyURL(value: unknown, protocols: string[], base?: string) {
  const text = value == null ? "" : String(value).trim();
  if (!text) {
    return "";
  }
  try {
    const url = base ? new URL(text, base) : new URL(text);
    return protocols.includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
