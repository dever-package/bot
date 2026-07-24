import { joinSiteApi, request } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";
import { createInFlightRequestLoader } from "../shared/in-flight-request";
import {
  isValidBodyResolvedLink,
  normalizeBodyResolvedLink,
  type BodyResolvedLink,
} from "../shared/body-link";

export type BodyContentNavigationItem = BodyResolvedLink;

export type BodyContentNavigation = {
  items: BodyContentNavigationItem[];
};

export type BodyContentArticle = {
  id: number;
  categoryID: number;
  title: string;
  content: string;
};

const navigationRequest = createInFlightRequestLoader<BodyContentNavigation>();
const detailRequest = createInFlightRequestLoader<BodyContentArticle>();
const publicDetailRequest = createInFlightRequestLoader<BodyContentArticle>();

export function loadBodyContentNavigation() {
  return navigationRequest("content", async () => {
    const result = await request(joinSiteApi("content/list"), "get");
    return normalizeContentNavigation(
      responseData(result, "加载内容列表失败"),
    );
  });
}

export function loadBodyContentArticleByLink(linkID: number) {
  return detailRequest(String(linkID), () =>
    requestContentArticle("content/detail", linkID),
  );
}

export function loadPublicBodyContentArticle(articleID: number) {
  return publicDetailRequest(String(articleID), () =>
    requestContentArticle("content/public", articleID),
  );
}

async function requestContentArticle(path: string, referenceID: number) {
  if (referenceID <= 0) {
    throw new Error("文章不存在");
  }
  const result = await request(joinSiteApi(path), "get", { id: referenceID });
  const data = responseData(result, "加载文章失败");
  const article = normalizeContentArticle(data.article);
  if (!article.id || !article.title) {
    throw new Error("文章内容为空");
  }
  return article;
}

function normalizeContentNavigation(value: unknown): BodyContentNavigation {
  const root = recordValue(value);
  return {
    items: rowsValue(root.items)
      .map(normalizeBodyResolvedLink)
      .filter(isValidBodyResolvedLink),
  };
}

function normalizeContentArticle(value: unknown): BodyContentArticle {
  const row = recordValue(value);
  return {
    id: positiveNumber(row.id),
    categoryID: positiveNumber(row.category_id),
    title: textValue(row.title),
    content: textValue(row.content),
  };
}

function responseData(result: unknown, fallback: string) {
  const response = recordValue(result);
  if (!isSuccessResponse(response)) {
    throw new Error(textValue(response.message || response.msg) || fallback);
  }
  return recordValue(response.data);
}

function rowsValue(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function recordValue(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function positiveNumber(value: unknown) {
  const result = Number(value || 0);
  return Number.isFinite(result) && result > 0 ? result : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
