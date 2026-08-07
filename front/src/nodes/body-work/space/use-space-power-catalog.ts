import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { fetchSpacePowers } from "./space-api";
import { SpaceCatalogCache } from "./space-catalog-cache";
import { isStoryboardPowerType } from "../shared/power-presentation";
import { parseStoryboardOutput } from "./space-storyboard";
import type {
  PowerCategoryOption,
  PowerOption,
  SpaceBootstrap,
  SpaceCanvasState,
  TeamRole,
} from "./types";

type UseSpacePowerCatalogInput = {
  space: SpaceBootstrap | null;
  canvases: Record<string, SpaceCanvasState>;
  cache: SpaceCatalogCache;
};

export function useSpacePowerCatalog({
  space,
  canvases,
  cache,
}: UseSpacePowerCatalogInput) {
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [powers, setPowers] = useState<PowerOption[]>([]);
  const [powerCategories, setPowerCategories] = useState<
    PowerCategoryOption[]
  >([]);
  const [loaded, setLoaded] = useState(false);
  const scopeKey = `${space?.project.id || 0}:${space?.release.id || space?.project.release_id || 0}`;
  const scopeKeyRef = useRef(scopeKey);
  const required = useMemo(
    () => loaded || canvasNeedsPowerCatalog(canvases),
    [canvases, loaded],
  );

  useEffect(() => {
    scopeKeyRef.current = scopeKey;
    setRoles([]);
    setPowers([]);
    setPowerCategories([]);
    setLoaded(false);
  }, [scopeKey]);

  const load = useCallback(
    async (force = false) => {
      if (!space) {
        return false;
      }
      const requestScopeKey = scopeKey;
      try {
        const catalog = await cache.loadCatalog(
          space.project.id,
          Number(space.release?.id || space.project.release_id || 0),
          () => fetchSpacePowers(space.project.id),
          force,
        );
        if (scopeKeyRef.current !== requestScopeKey) {
          return false;
        }
        setRoles(catalog.roles);
        setPowers(catalog.powers);
        setPowerCategories(catalog.powerCategories);
        setLoaded(true);
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "加载能力列表失败");
        return false;
      }
    },
    [cache, scopeKey, space],
  );

  useEffect(() => {
    if (!space || !required || loaded) {
      return;
    }
    void load();
  }, [load, loaded, required, space]);

  return {
    roles,
    powers,
    powerCategories,
    loaded,
    required,
    load,
  };
}

function canvasNeedsPowerCatalog(canvases: Record<string, SpaceCanvasState>) {
  return Object.values(canvases).some((canvas) =>
    canvas.nodes.some((node) => {
      if (node.type !== "power") {
        return false;
      }
      if (node.storyboardItem && !node.power) {
        return true;
      }
      if (!isStoryboardPowerType(node.power, node.kind, node.outputType)) {
        return false;
      }
      return Boolean(
        parseStoryboardOutput([
          node.asset?.version?.content,
          node.resultOutput,
        ]),
      );
    }),
  );
}
