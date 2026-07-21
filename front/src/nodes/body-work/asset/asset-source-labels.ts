import { useMemo } from "react";
import { useBodyLoginConfig } from "../auth/site-config";
import type { AssetSourceLabels } from "./asset-contract";

export function useAssetSourceLabels(): AssetSourceLabels {
  const menu = useBodyLoginConfig().site.homeMenu;
  return useMemo(
    () => ({
      project: menu.works.name,
      tool: menu.function.name,
      dialogue: menu.dialogue.name,
      fallback: menu.assets.name,
    }),
    [
      menu.assets.name,
      menu.dialogue.name,
      menu.function.name,
      menu.works.name,
    ],
  );
}
