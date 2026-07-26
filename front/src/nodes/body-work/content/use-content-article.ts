import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadPublicBodyContentArticle,
  type BodyContentArticle,
} from "./content-api";

export function useBodyContentArticle(articleID: number) {
  const [article, setArticle] = useState<BodyContentArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestID = ++requestRef.current;
    setLoading(true);
    setError("");
    try {
      const next = await loadPublicBodyContentArticle(articleID);
      if (requestID === requestRef.current) {
        setArticle(next);
      }
    } catch (currentError: unknown) {
      if (requestID === requestRef.current) {
        setArticle(null);
        setError(
          currentError instanceof Error ? currentError.message : "加载文章失败",
        );
      }
    } finally {
      if (requestID === requestRef.current) {
        setLoading(false);
      }
    }
  }, [articleID]);

  useEffect(() => {
    void load();
    return () => {
      requestRef.current += 1;
    };
  }, [load]);

  return { article, loading, error, reload: load };
}
