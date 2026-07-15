export function parseMaybeJSON(value: unknown): any {
  if (typeof value !== "string") {
    return value;
  }
  const text = value.trim();
  if (!looksLikeJSONContainer(text)) {
    return value;
  }
  try {
    return JSON.parse(text);
  } catch {
    return value;
  }
}

export function parseStructuredJSONText(value: string): unknown {
  const text = String(value || "").trim();
  const repaired = repairJSONControlChars(text);
  const unescaped = unescapeEscapedJSONQuotes(repaired);
  for (const source of uniqueStrings([text, repaired, unescaped])) {
    const parsed = parseMaybeJSON(source);
    if (parsed !== source) {
      return parsed;
    }
    const encoded = parseJSONEncodedString(source);
    if (encoded !== source) {
      return encoded;
    }
  }
  return value;
}

export function parseMaybeEmbeddedJSON(value: string): unknown {
  const text = String(value || "").trim();
  for (const candidate of structuredJSONTextCandidates(text)) {
    const parsed = parseStructuredJSONText(candidate);
    if (parsed !== candidate) {
      return parsed;
    }
  }
  return value;
}

export function embeddedJSONValues(value: string): unknown[] {
  const result: unknown[] = [];
  for (const candidate of structuredJSONTextCandidates(
    String(value || "").trim(),
  )) {
    const parsed = parseStructuredJSONText(candidate);
    if (parsed !== candidate) {
      result.push(parsed);
    }
  }
  return result;
}

export function repairJSONControlChars(value: string) {
  let result = "";
  let inString = false;
  let escaped = false;
  for (const char of value) {
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      result += char;
      escaped = inString;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    if (inString && char.charCodeAt(0) < 32) {
      result += escapeJSONControlChar(char);
      continue;
    }
    result += char;
  }
  return result;
}

function structuredJSONTextCandidates(value: string) {
  const result = [value];
  for (const match of value.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi)) {
    result.push(String(match[1] || "").trim());
  }
  result.push(...extractJSONContainers(value));
  return uniqueStrings(result);
}

function extractJSONContainers(value: string) {
  const result: string[] = [];
  for (let start = 0; start < value.length; start += 1) {
    const opener = value[start];
    if (opener !== "{" && opener !== "[") {
      continue;
    }
    const candidate = balancedJSONContainer(value, start);
    if (candidate) {
      result.push(candidate);
      start += candidate.length - 1;
    }
  }
  return result;
}

function balancedJSONContainer(value: string, start: number) {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  for (let index = start; index < value.length; index += 1) {
    const char = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (inString && char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }
    if (char !== "}" && char !== "]") {
      continue;
    }
    const expected = char === "}" ? "{" : "[";
    if (stack.pop() !== expected) {
      return "";
    }
    if (stack.length === 0) {
      return value.slice(start, index + 1).trim();
    }
  }
  return "";
}

function looksLikeJSONContainer(value: string) {
  return (
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith("[") && value.endsWith("]"))
  );
}

function parseJSONEncodedString(value: string) {
  if (!value.startsWith('"') || !value.endsWith('"')) {
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "string" ? parsed : value;
  } catch {
    return value;
  }
}

function escapeJSONControlChar(value: string) {
  switch (value) {
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\t":
      return "\\t";
    default:
      return `\\u${value.charCodeAt(0).toString(16).padStart(4, "0")}`;
  }
}

function unescapeEscapedJSONQuotes(value: string) {
  const text = value.trim();
  if (
    !text.includes('\\"') ||
    (!text.startsWith("{") && !text.startsWith("["))
  ) {
    return value;
  }
  return text.replace(/\\"/g, '"');
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const text = String(value || "").trim();
    if (!text || seen.has(text)) {
      return false;
    }
    seen.add(text);
    return true;
  });
}
