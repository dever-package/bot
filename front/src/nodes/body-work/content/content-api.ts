import { joinSiteApi, request } from "@dever/front-plugin";
import {
  asResponseRecord as recordValue,
  asResponseRows as rowsValue,
  responsePositiveNumber as positiveNumber,
  responseText as textValue,
  successfulResponseData as responseData,
} from "../shared/api-response";
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
const publicDetailRequest = createInFlightRequestLoader<BodyContentArticle>();

export function loadBodyContentNavigation() {
  return navigationRequest("content", async () => {
    const result = await request(joinSiteApi("content/list"), "get");
    return normalizeContentNavigation(responseData(result, "加载内容列表失败"));
  });
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
