import { createContext } from "react";
import type { WorkbenchReferenceProvider } from "../asset/asset-reference-provider";

export const CanvasAssetReferenceProviderContext = createContext<
  WorkbenchReferenceProvider | undefined
>(undefined);
