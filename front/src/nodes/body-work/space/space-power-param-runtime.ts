import type { ComponentType } from "react";
import { getCompatModule } from "@dever/front-plugin";
import type { PowerParam } from "./types";

const streamRequestParamsModule = getCompatModule(
  "@/components/agent/stream-request-params",
);

export const filterActivePowerParams =
  (streamRequestParamsModule.filterActivePowerParams as
    | ((params: PowerParam[], values: Record<string, unknown>) => PowerParam[])
    | undefined) || ((params: PowerParam[]) => params);

export const isPowerParamConditionController =
  (streamRequestParamsModule.isPowerParamConditionController as
    | ((param: PowerParam, params: PowerParam[]) => boolean)
    | undefined) || (() => false);

export const shouldDisplayPowerParam =
  (streamRequestParamsModule.shouldDisplayPowerParam as
    | ((param: PowerParam, params: PowerParam[]) => boolean)
    | undefined) || (() => true);

export type PowerParamPreviewType = "none" | "image" | "audio" | "video";

export type PowerParamOptionDialogProps = {
  open: boolean;
  title: string;
  previewType: PowerParamPreviewType;
  options: NonNullable<PowerParam["options"]>;
  value: unknown;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: string) => void;
};

export const PowerParamOptionDialog =
  streamRequestParamsModule.PowerParamOptionDialog as ComponentType<
    PowerParamOptionDialogProps
  >;

export const normalizePowerParamPreviewType =
  streamRequestParamsModule.normalizeParamPreviewType as (
    value: unknown,
  ) => PowerParamPreviewType;
