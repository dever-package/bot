import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadBodyContentArticleByLink,
  loadPublicBodyContentArticle,
  type BodyContentArticle,
} from "./content-api";

export type BodyContentAccess = "workbench" | "public";

export function useBodyContentArticle(
  referenceID: number,
  access: BodyContentAccess,
) {
  const [article, setArticle] = useState<BodyContentArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestID = ++requestRef.current;
    setLoading(true);
    setError("");
    try {
      const next = await (access === "public"
        ? loadPublicBodyContentArticle(referenceID)
        : loadBodyContentArticleByLink(referenceID));
      if (requestID === requestRef.current) {
        setArticle(next);
      }
    } catch (currentError: unknown) {
      if (requestID === requestRef.current) {
        setArticle(null);
        setError(
          currentError instanceof Error
            ? currentError.message
            : "加载文章失败",
        );
      }
    } finally {
      if (requestID === requestRef.current) {
        setLoading(false);
      }
    }
  }, [access, referenceID]);

  useEffect(() => {
    void load();
    return () => {
      requestRef.current += 1;
    };
  }, [load]);

  return { article, loading, error, reload: load };
}
