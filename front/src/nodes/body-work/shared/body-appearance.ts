import type { CSSProperties } from "react";

export type BodyLoginTemplate = "minimal" | "split" | "focus" | "showcase";
export type BodyWorkbenchTemplate = "rail" | "sidebar" | "topbar";
export type BodyColorMode = "light" | "dark";
export type BodyBackgroundScope = "login" | "workbench";

export type BodyAppearanceConfig = {
  baseColor: string;
  brandPrimaryColor: string;
  loginTemplate: BodyLoginTemplate;
  loginTextColor: string;
  loginBackgroundColor: string;
  loginBackgroundImage: string;
  workbenchTemplate: BodyWorkbenchTemplate;
  workbenchBackgroundColor: string;
  workbenchBackgroundImage: string;
};

export const DEFAULT_BODY_APPEARANCE: BodyAppearanceConfig = {
  baseColor: "#96a29c",
  brandPrimaryColor: "",
  loginTemplate: "minimal",
  loginTextColor: "",
  loginBackgroundColor: "",
  loginBackgroundImage: "",
  workbenchTemplate: "rail",
  workbenchBackgroundColor: "",
  workbenchBackgroundImage: "",
};

const loginTemplates = new Set<BodyLoginTemplate>([
  "minimal",
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
const lightCanvasMinimumLightness = 0.82;
const lightCanvasWhiteRatio = 0.82;
const lightSurfaceWhiteRatio = 0.55;
const lightRaisedSurfaceWhiteRatio = 0.82;
const darkRaisedSurfaceTextRatio = 0.06;

export function normalizeBodyAppearance(
  value: {
    baseColor?: unknown;
    brandPrimaryColor?: unknown;
    loginTemplate?: unknown;
    loginTextColor?: unknown;
    loginBackgroundColor?: unknown;
    loginBackgroundImage?: unknown;
    workbenchTemplate?: unknown;
    workbenchBackgroundColor?: unknown;
    workbenchBackgroundImage?: unknown;
  },
  fallback: BodyAppearanceConfig = DEFAULT_BODY_APPEARANCE,
): BodyAppearanceConfig {
  return {
    baseColor: normalizeBodyAppearanceColor(
      value.baseColor,
      fallback.baseColor,
    ),
    brandPrimaryColor: normalizeBodyAppearanceColor(
      value.brandPrimaryColor,
      fallback.brandPrimaryColor,
    ),
    loginTemplate: allowedValue(
      value.loginTemplate,
      loginTemplates,
      fallback.loginTemplate,
    ),
    loginTextColor: normalizeBodyAppearanceColor(
      value.loginTextColor,
      fallback.loginTextColor,
    ),
    loginBackgroundColor: normalizeBodyAppearanceColor(
      value.loginBackgroundColor,
      fallback.loginBackgroundColor,
    ),
    loginBackgroundImage:
      normalizeBodyBackgroundImage(value.loginBackgroundImage) ||
      fallback.loginBackgroundImage,
    workbenchTemplate: allowedValue(
      value.workbenchTemplate,
      workbenchTemplates,
      fallback.workbenchTemplate,
    ),
    workbenchBackgroundColor: normalizeBodyAppearanceColor(
      value.workbenchBackgroundColor,
      fallback.workbenchBackgroundColor,
    ),
    workbenchBackgroundImage:
      normalizeBodyBackgroundImage(value.workbenchBackgroundImage) ||
      fallback.workbenchBackgroundImage,
  };
}

export function bodyAppearanceStyle(
  appearance: BodyAppearanceConfig,
  mode: BodyColorMode,
): CSSProperties {
  const lightMode = mode !== "dark";
  const baseColor =
    normalizeHexColor(appearance.baseColor) ||
    DEFAULT_BODY_APPEARANCE.baseColor;
  const customColor = normalizeHexColor(appearance.brandPrimaryColor);
  const baseStyle = bodyBaseColorStyle(baseColor, lightMode);

  if (!customColor) {
    return baseStyle;
  }
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
    ...baseStyle,
    "--body-work-primary": primary,
    "--body-work-primary-strong": primaryStrong,
    "--body-work-primary-bright": primaryBright,
    "--body-work-primary-soft": primarySoft,
    "--body-work-on-primary": readableForeground(primary, primaryStrong),
    "--body-work-ring": hexColorAlpha(primary, 0.2),
  } as CSSProperties;
}

function bodyBaseColorStyle(
  baseColor: string,
  lightMode: boolean,
): CSSProperties {
  const lightCanvas =
    colorLightness(baseColor) < lightCanvasMinimumLightness
      ? mixHexColor(baseColor, "#ffffff", lightCanvasWhiteRatio)
      : baseColor;
  const canvas = lightMode
    ? lightCanvas
    : mixHexColor(baseColor, "#111513", 0.95);
  const text = lightMode
    ? mixHexColor(canvas, "#111513", 0.96)
    : mixHexColor(baseColor, "#f2f5f3", 0.9);
  const surface = lightMode
    ? mixHexColor(canvas, "#ffffff", lightSurfaceWhiteRatio)
    : mixHexColor(baseColor, "#171c19", 0.94);
  const surfaceRaised = lightMode
    ? mixHexColor(canvas, "#ffffff", lightRaisedSurfaceWhiteRatio)
    : mixHexColor(surface, text, darkRaisedSurfaceTextRatio);
  const background = lightMode
    ? mixHexColor(canvas, text, 0.035)
    : mixHexColor(baseColor, "#0c0f0e", 0.96);
  const muted = mixHexColor(text, background, lightMode ? 0.4 : 0.42);
  const line = mixHexColor(canvas, text, lightMode ? 0.12 : 0.08);
  const active = mixHexColor(canvas, text, lightMode ? 0.09 : 0.06);

  return {
    "--body-work-bg": background,
    "--body-work-canvas": canvas,
    "--body-work-surface": surface,
    "--body-work-surface-raised": surfaceRaised,
    "--body-work-text": text,
    "--body-work-muted": muted,
    "--body-work-line": line,
    "--body-work-active": active,
    "--body-work-shadow": lightMode
      ? `0 14px 34px ${hexColorAlpha(text, 0.08)}`
      : "0 18px 42px rgba(0, 0, 0, 0.28)",
  } as CSSProperties;
}

export function bodyPageBackgroundStyle(
  appearance: BodyAppearanceConfig,
  scope: BodyBackgroundScope,
): CSSProperties {
  const { color, image } = resolveBodyPageBackground(appearance, scope);
  const loginTextColor =
    scope === "login"
      ? normalizeHexColor(appearance.loginTextColor) ||
        (image ? "#ffffff" : "")
      : "";

  return {
    ...(color ? { backgroundColor: color } : {}),
    ...(image ? { backgroundImage: `url(${JSON.stringify(image)})` } : {}),
    ...(loginTextColor ? { "--login-copy-color": loginTextColor } : {}),
  } as CSSProperties;
}

export function hasBodyPageBackground(
  appearance: BodyAppearanceConfig,
  scope: BodyBackgroundScope,
) {
  const { color, image } = resolveBodyPageBackground(appearance, scope);
  return Boolean(color || image);
}

function normalizeHexColor(value: unknown) {
  const color = String(value || "").trim().toLowerCase();
  return hexColorPattern.test(color) ? color : "";
}

function normalizeBodyAppearanceColor(value: unknown, fallback: string) {
  return normalizeHexColor(value) || normalizeHexColor(fallback);
}

function normalizeBodyBackgroundImage(value: unknown) {
  return String(value || "").trim();
}

function resolveBodyPageBackground(
  appearance: BodyAppearanceConfig,
  scope: BodyBackgroundScope,
) {
  return scope === "login"
    ? {
        color: appearance.loginBackgroundColor,
        image: appearance.loginBackgroundImage,
      }
    : {
        color: appearance.workbenchBackgroundColor,
        image: appearance.workbenchBackgroundImage,
      };
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

function readableForeground(...backgrounds: string[]) {
  const candidates = ["#111513", "#ffffff"];
  return candidates.reduce((best, candidate) =>
    minimumContrast(backgrounds, candidate) > minimumContrast(backgrounds, best)
      ? candidate
      : best,
  );
}

function minimumContrast(backgrounds: string[], foreground: string) {
  return Math.min(
    ...backgrounds.map((background) => contrastRatio(background, foreground)),
  );
}

function contrastRatio(left: string, right: string) {
  const leftLuminance = colorLuminance(left);
  const rightLuminance = colorLuminance(right);
  return (
    (Math.max(leftLuminance, rightLuminance) + 0.05) /
    (Math.min(leftLuminance, rightLuminance) + 0.05)
  );
}

function colorLuminance(color: string) {
  const { red, green, blue } = hexColorRGB(color);
  return (
    0.2126 * linearChannel(red) +
    0.7152 * linearChannel(green) +
    0.0722 * linearChannel(blue)
  );
}

function colorLightness(color: string) {
  const { red, green, blue } = hexColorRGB(color);
  return (Math.max(red, green, blue) + Math.min(red, green, blue)) / 510;
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
