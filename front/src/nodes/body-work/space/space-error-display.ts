import {
  isPlainRecord,
  parseMaybeEmbeddedJSON,
  trimmedString,
} from "../shared/structured-json";

// 只投影展示文本，运行记录和重放判定继续使用原始错误。
export function canvasErrorDisplay(error: string) {
  const details = redactCanvasErrorText(error.trim());
  const response = parseMaybeEmbeddedJSON(details);
  const reason = canvasErrorReason(response);
  const status = details.match(/\bstatus=(\d{3})\b/);
  const message =
    reason ||
    (status && details.includes("body=")
      ? `请求失败（HTTP ${status[1]}），请打开详情查看原因`
      : details) ||
    "节点运行失败";
  const summary = message.replace(/\s+/g, " ").trim();
  return {
    summary: summary.length > 96 ? `${summary.slice(0, 95)}…` : summary,
    details,
  };
}

function canvasErrorReason(value: unknown): string {
  if (!isPlainRecord(value)) return "";
  return (
    canvasErrorReason(value.error) ||
    trimmedString(value.message) ||
    trimmedString(value.msg) ||
    trimmedString(value.detail) ||
    trimmedString(value.details) ||
    trimmedString(value.error)
  );
}

function redactCanvasErrorText(text: string) {
  return text
    .replace(
      /\b((?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
      "$1REDACTED",
    )
    .replace(/https?:\/\/[^\s"<>]+/gi, (address) => {
      return address
        .replace(/^(https?:\/\/)[^/]*@/i, "$1REDACTED@")
        .replace(/[?#].*$/, "?REDACTED");
    })
    .replace(
      /((?:["']?)(?:authorization|cookie|set-cookie|(?:access[_-]?|refresh[_-]?)?token|api[_-]?key|password|passwd|pwd|secret)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|(?:Bearer|Basic)\s+[^\s,;}]+|[^\s,;}]+)/gi,
      '$1"REDACTED"',
    )
    .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9+/_=.-]+/gi, "$1 REDACTED");
}
