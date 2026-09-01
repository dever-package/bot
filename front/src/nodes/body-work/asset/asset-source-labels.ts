import { useMemo } from "react";
import { useBodyLoginConfig } from "../auth/site-config";
import type {
  AssetSourceLabels,
  AssetSourceVisibility,
} from "./asset-contract";

export function useAssetSourceSettings(): {
  labels: AssetSourceLabels;
  visibility: AssetSourceVisibility;
} {
  const menu = useBodyLoginConfig().site.homeMenu;
  return useMemo(
    () => ({
      labels: {
        project: menu.works.name,
        tool: menu.function.name,
        dialogue: menu.dialogue.name,
        fallback: menu.assets.name,
      },
      visibility: {
        project: menu.works.enabled,
        tool: menu.function.enabled,
        dialogue: menu.dialogue.enabled,
      },
    }),
    [
      menu.assets.name,
      menu.dialogue.enabled,
      menu.dialogue.name,
      menu.function.enabled,
      menu.function.name,
      menu.works.enabled,
      menu.works.name,
    ],
  );
}

export function useAssetSourceLabels(): AssetSourceLabels {
  return useAssetSourceSettings().labels;
}
