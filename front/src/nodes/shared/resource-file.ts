export function resourceNameFromURL(url: string, fallback = "") {
  if (!url || /^(?:data|blob):/i.test(url)) return fallback;
  let path = url.split(/[?#]/, 1)[0];
  try {
    path = new URL(url, "http://resource.local").pathname;
  } catch {
    // Relative and malformed URLs are handled by the string fallback.
  }
  const encodedName = path.slice(path.lastIndexOf("/") + 1);
  if (!encodedName) return fallback;
  try {
    return decodeURIComponent(encodedName) || fallback;
  } catch {
    return encodedName;
  }
}

export function resourceDownloadName(url: string, suggestedName?: string) {
  const preferredName = safeDownloadName(suggestedName || "");
  const sourceName = safeDownloadName(resourceNameFromURL(url));
  if (fileExtension(preferredName)) return preferredName;
  const extension = fileExtension(sourceName);
  if (preferredName) return `${preferredName}${extension}`;
  return sourceName || "file";
}

function safeDownloadName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]+/g, "-");
}

function fileExtension(name: string) {
  return name.match(/\.[a-z0-9]{1,12}$/i)?.[0] || "";
}
