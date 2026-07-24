import { safeBodyLinkURL } from "./safe-body-url";

export type BodyLinkScene = "navigation" | "workbench_content";

export type BodyResolvedLink = {
  id: number;
  code: string;
  name: string;
  type: "url" | "article";
  articleID: number;
  url: string;
  target: "_self" | "_blank";
  scenes: BodyLinkScene[];
};

export function normalizeBodyResolvedLink(value: unknown): BodyResolvedLink {
  const row = recordValue(value);
  const type = textValue(row.type) === "article" ? "article" : "url";
  return {
    id: positiveNumber(row.id),
    code: textValue(row.code).toLowerCase(),
    name: textValue(row.name),
    type,
    articleID: type === "article" ? positiveNumber(row.article_id) : 0,
    url: type === "url" ? safeBodyLinkURL(row.url) : "",
    target:
      type === "url" && textValue(row.target) === "_blank"
        ? "_blank"
        : "_self",
    scenes: rowsValue(row.scenes)
      .map(normalizeBodyLinkScene)
      .filter((scene): scene is BodyLinkScene => Boolean(scene)),
  };
}

export function isValidBodyResolvedLink(link: BodyResolvedLink) {
  return Boolean(
    link.id &&
      link.name &&
      (link.type === "article" ? link.articleID : link.url),
  );
}

function normalizeBodyLinkScene(value: unknown): BodyLinkScene | null {
  const scene = textValue(value).toLowerCase();
  return scene === "navigation" || scene === "workbench_content"
    ? scene
    : null;
}

function rowsValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function recordValue(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
