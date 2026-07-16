export async function copyTextToClipboard(value: string) {
  if (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    navigator.clipboard?.writeText
  ) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall through to the synchronous path while handling a user click.
    }
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard API is unavailable");
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  try {
    textarea.select();
    textarea.setSelectionRange(0, value.length);
    if (!document.execCommand("copy")) {
      throw new Error("copy failed");
    }
  } finally {
    textarea.remove();
  }
}
