import { useLayoutEffect } from "react";
import {
  bodyAppearanceStyle,
  type BodyAppearanceConfig,
  type BodyColorMode,
} from "./body-appearance";

const appearanceProperties = [
  "--body-work-bg",
  "--body-work-canvas",
  "--body-work-surface",
  "--body-work-surface-raised",
  "--body-work-text",
  "--body-work-muted",
  "--body-work-line",
  "--body-work-active",
  "--body-work-shadow",
  "--body-work-primary",
  "--body-work-primary-strong",
  "--body-work-primary-bright",
  "--body-work-primary-soft",
  "--body-work-on-primary",
  "--body-work-ring",
] as const;

export function useBodyAppearance(
  appearance: BodyAppearanceConfig,
  mode: BodyColorMode,
) {
  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const previousAppearance = root.getAttribute("data-body-appearance");
    const previousProperties = appearanceProperties.map((property) => ({
      property,
      value: root.style.getPropertyValue(property),
      priority: root.style.getPropertyPriority(property),
    }));
    const nextStyle = bodyAppearanceStyle(appearance, mode) as Record<
      string,
      string
    >;

    root.setAttribute("data-body-appearance", "active");
    for (const property of appearanceProperties) {
      const value = nextStyle[property];
      if (value) {
        root.style.setProperty(property, value);
      } else {
        root.style.removeProperty(property);
      }
    }

    return () => {
      if (previousAppearance == null) {
        root.removeAttribute("data-body-appearance");
      } else {
        root.setAttribute("data-body-appearance", previousAppearance);
      }
      for (const { property, value, priority } of previousProperties) {
        if (value) {
          root.style.setProperty(property, value, priority);
        } else {
          root.style.removeProperty(property);
        }
      }
    };
  }, [appearance, mode]);
}
