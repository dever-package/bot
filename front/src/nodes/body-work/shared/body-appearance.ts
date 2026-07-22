import type { CSSProperties } from "react";

export type BodyThemePreset = "forest" | "ocean" | "graphite";
export type BodyLoginTemplate = "split" | "focus" | "showcase";
export type BodyWorkbenchTemplate = "rail" | "sidebar" | "topbar";
export type BodyColorMode = "light" | "dark";

export type BodyAppearanceConfig = {
  themePreset: BodyThemePreset;
  brandPrimaryColor: string;
  loginTemplate: BodyLoginTemplate;
  workbenchTemplate: BodyWorkbenchTemplate;
};

export const DEFAULT_BODY_APPEARANCE: BodyAppearanceConfig = {
  themePreset: "forest",
  brandPrimaryColor: "",
  loginTemplate: "split",
  workbenchTemplate: "rail",
};

const themePresets = new Set<BodyThemePreset>([
  "forest",
  "ocean",
  "graphite",
]);
const loginTemplates = new Set<BodyLoginTemplate>([
  "split",
  "focus",
  "showcase",
]);
const workbenchTemplates = new Set<BodyWorkbenchTemplate>([
  "rail",
  "sidebar",
  "topbar",
]);
const hexColorPattern = /^#[0-9a-f]{6}$/i;

export function normalizeBodyAppearance(
  value: {
    themePreset?: unknown;
    brandPrimaryColor?: unknown;
    loginTemplate?: unknown;
    workbenchTemplate?: unknown;
  },
  fallback: BodyAppearanceConfig = DEFAULT_BODY_APPEARANCE,
): BodyAppearanceConfig {
  return {
    themePreset: allowedValue(
      value.themePreset,
      themePresets,
      fallback.themePreset,
    ),
    brandPrimaryColor:
      normalizeBodyBrandColor(value.brandPrimaryColor) ||
      fallback.brandPrimaryColor,
    loginTemplate: allowedValue(
      value.loginTemplate,
      loginTemplates,
      fallback.loginTemplate,
    ),
    workbenchTemplate: allowedValue(
      value.workbenchTemplate,
      workbenchTemplates,
      fallback.workbenchTemplate,
    ),
  };
}

export function bodyAppearanceStyle(
  appearance: BodyAppearanceConfig,
  mode?: BodyColorMode,
): CSSProperties {
  const customColor = normalizeBodyBrandColor(appearance.brandPrimaryColor);
  if (!customColor) {
    return {};
  }

  const lightMode = mode !== "dark";
  const primary = lightMode
    ? customColor
    : mixHexColor(customColor, "#ffffff", 0.32);
  const primaryStrong = lightMode
    ? mixHexColor(customColor, "#000000", 0.2)
    : mixHexColor(customColor, "#ffffff", 0.18);
  const primaryBright = mixHexColor(
    customColor,
    "#ffffff",
    lightMode ? 0.14 : 0.44,
  );
  const primarySoft = mixHexColor(
    customColor,
    lightMode ? "#ffffff" : "#111513",
    lightMode ? 0.88 : 0.76,
  );

  return {
    "--body-work-primary": primary,
    "--body-work-primary-strong": primaryStrong,
    "--body-work-primary-bright": primaryBright,
    "--body-work-primary-soft": primarySoft,
    "--body-work-on-primary": readableForeground(primaryStrong),
    "--body-work-ring": hexColorAlpha(primary, 0.2),
  } as CSSProperties;
}

export function normalizeBodyBrandColor(value: unknown) {
  const color = String(value || "").trim().toLowerCase();
  return hexColorPattern.test(color) ? color : "";
}

function allowedValue<T extends string>(
  value: unknown,
  allowed: ReadonlySet<T>,
  fallback: T,
) {
  const current = String(value || "").trim() as T;
  return allowed.has(current) ? current : fallback;
}

function mixHexColor(source: string, target: string, targetRatio: number) {
  const sourceRGB = hexColorRGB(source);
  const targetRGB = hexColorRGB(target);
  const mix = (channel: keyof typeof sourceRGB) =>
    Math.round(
      sourceRGB[channel] +
        (targetRGB[channel] - sourceRGB[channel]) * targetRatio,
    );
  return rgbHex(mix("red"), mix("green"), mix("blue"));
}

function readableForeground(color: string) {
  const { red, green, blue } = hexColorRGB(color);
  const luminance =
    0.2126 * linearChannel(red) +
    0.7152 * linearChannel(green) +
    0.0722 * linearChannel(blue);
  return luminance > 0.48 ? "#111513" : "#ffffff";
}

function linearChannel(channel: number) {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function hexColorAlpha(color: string, alpha: number) {
  const { red, green, blue } = hexColorRGB(color);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function hexColorRGB(color: string) {
  return {
    red: Number.parseInt(color.slice(1, 3), 16),
    green: Number.parseInt(color.slice(3, 5), 16),
    blue: Number.parseInt(color.slice(5, 7), 16),
  };
}

function rgbHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}
