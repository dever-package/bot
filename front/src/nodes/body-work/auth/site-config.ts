import { useEffect, useState } from "react";
import {
  getSiteConfig,
  joinSiteApi,
  request,
} from "@dever/front-plugin";
import {
  asResponseRecord as recordValue,
  asResponseRows as rowsValue,
  isSuccessResponse,
  responsePositiveNumber as positiveNumber,
  responseText as textValue,
} from "../shared/api-response";
import type { BodyFilingInfo } from "../shared/body-filing";
import {
  DEFAULT_BODY_APPEARANCE,
  normalizeBodyAppearance,
  type BodyAppearanceConfig,
} from "../shared/body-appearance";
import { safeBodyExternalURL } from "../shared/safe-body-url";
import {
  isValidBodyResolvedLink,
  normalizeBodyResolvedLink,
  type BodyResolvedLink,
} from "../shared/body-link";

export type BodySiteConfig = {
  siteName: string;
  logo: string;
  favicon: string;
  loginImage: string;
  loginTitle: string;
  loginDescription: string;
  registerEnabled: boolean;
  appearance: BodyAppearanceConfig;
  homeMenu: BodyHomeMenuConfig;
  filing: BodyFilingInfo;
};

export type { BodyFilingInfo } from "../shared/body-filing";

export type BodyHomeMenuItem = {
  name: string;
  icon: string;
  iconImage: string;
  enabled: boolean;
  sort: number;
};

export type BodyHomeMenuConfig = {
  works: BodyHomeMenuItem;
  dialogue: BodyHomeMenuItem;
  function: BodyHomeMenuItem;
  assets: BodyHomeMenuItem;
  points: BodyHomeMenuItem;
  messages: BodyHomeMenuItem;
  content: BodyHomeMenuItem;
};

export type BodyLoginLink = BodyResolvedLink;
export type { BodyLinkScene } from "../shared/body-link";

export type BodyLoginLegalLinks = {
  termsOfService: BodyLoginLink | null;
  privacyPolicy: BodyLoginLink | null;
};

export type BodyLoginAccount = {
  id: number;
  provider: string;
  name: string;
  icon: string;
  appID: string;
  configured: boolean;
};

export type BodyLoginConfig = {
  site: BodySiteConfig;
  links: BodyLoginLink[];
  legalLinks: BodyLoginLegalLinks;
  accounts: BodyLoginAccount[];
};

export type BodyLoginConfigState = {
  config: BodyLoginConfig;
  loaded: boolean;
};

const DEFAULT_LOGIN_TITLE = "把想法变成作品";
const DEFAULT_LOGIN_DESCRIPTION =
  "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。";
const HOME_MENU_DEFAULTS = [
  ["works", "创作", "file-stack"],
  ["dialogue", "对话", "messages-square"],
  ["function", "工具", "zap"],
  ["assets", "资产", "archive"],
  ["points", "积分", "sparkles"],
  ["messages", "消息", "bell"],
  ["content", "内容", "book-open-text"],
] as const;

let cachedLoginConfig: BodyLoginConfig | null = null;
let pendingLoginConfig: Promise<BodyLoginConfig> | null = null;

export function useBodyLoginConfig() {
  return useBodyLoginConfigState().config;
}

export function useBodyLoginConfigState() {
  const [state, setState] = useState<BodyLoginConfigState>(() => ({
    config: cachedLoginConfig || fallbackLoginConfig(),
    loaded: false,
  }));

  useEffect(() => {
    let active = true;
    void loadBodyLoginConfig().then((config) => {
      if (active) {
        setState({ config, loaded: true });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function loadBodyLoginConfig() {
  if (pendingLoginConfig) {
    return pendingLoginConfig;
  }

  pendingLoginConfig = request(joinSiteApi("login/config"), "get")
    .then((result: any) => {
      if (!isSuccessResponse(result)) {
        throw new Error(String(result?.message || result?.msg || "读取登录配置失败"));
      }
      cachedLoginConfig = normalizeLoginConfig(result?.data);
      return cachedLoginConfig;
    })
    .catch(() => cachedLoginConfig || fallbackLoginConfig())
    .finally(() => {
      pendingLoginConfig = null;
    });

  return pendingLoginConfig;
}

export function applyBodySiteMetadata(site: BodySiteConfig) {
  if (typeof document === "undefined") {
    return;
  }

  if (site.siteName) {
    document.title = site.siteName;
  }
  if (!site.favicon) {
    return;
  }

  let favicon = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = site.favicon;
}

function normalizeLoginConfig(value: unknown): BodyLoginConfig {
  const fallback = fallbackLoginConfig();
  const root = recordValue(value);
  const config = recordValue(root.config);
  const normalizedLinks = rowsValue(root.links)
    .map(normalizeBodyResolvedLink)
    .filter(isValidBodyResolvedLink);

  return {
    site: {
      siteName: textValue(config.site_name) || fallback.site.siteName,
      logo: mediaURL(config.logo) || fallback.site.logo,
      favicon: mediaURL(config.favicon) || fallback.site.favicon,
      loginImage: mediaURL(config.login_image) || fallback.site.loginImage,
      loginTitle: textValue(config.login_title) || fallback.site.loginTitle,
      loginDescription: Object.prototype.hasOwnProperty.call(
        config,
        "login_description",
      )
        ? textValue(config.login_description)
        : fallback.site.loginDescription,
      registerEnabled:
        config.register_enabled == null
          ? fallback.site.registerEnabled
          : booleanValue(config.register_enabled),
      appearance: normalizeBodyAppearance(
        {
          baseColor: config.base_color,
          brandPrimaryColor: config.brand_primary_color,
          loginTemplate: config.login_template,
          loginTextColor: config.login_text_color,
          loginBackgroundColor: config.login_background_color,
          loginBackgroundImage: mediaURL(config.login_background_image),
          workbenchTemplate: config.workbench_template,
          workbenchBackgroundColor: config.workbench_background_color,
          workbenchBackgroundImage: mediaURL(
            config.workbench_background_image,
          ),
        },
        fallback.site.appearance,
      ),
      homeMenu: normalizeHomeMenu(config.home_menu, fallback.site.homeMenu),
      filing: {
        content: textValue(config.filing_content),
        contentConfigured: Object.prototype.hasOwnProperty.call(
          config,
          "filing_content",
        ),
        companyName: textValue(config.company_name),
        companyAddress: textValue(config.company_address),
        businessLicenseURL: safeBodyExternalURL(config.business_license_url),
        icpRecord: textValue(config.icp_record),
        icpRecordURL: safeBodyExternalURL(config.icp_record_url),
        publicSecurityRecord: textValue(config.public_security_record),
        publicSecurityRecordURL: safeBodyExternalURL(
          config.public_security_record_url,
        ),
      },
    },
    links: normalizedLinks.filter(isLoginNavigationLink),
    legalLinks: {
      termsOfService: findLoginLinkByCode(
        normalizedLinks,
        "terms_of_service",
      ),
      privacyPolicy: findLoginLinkByCode(
        normalizedLinks,
        "privacy_policy",
      ),
    },
    accounts: rowsValue(root.accounts)
      .map(normalizeAccount)
      .filter(validAccount),
  };
}

function fallbackLoginConfig(): BodyLoginConfig {
  const site = getSiteConfig?.() || {};
  return {
    site: {
      siteName: textValue(site.name) || "神创工作台",
      logo: mediaURL(site.logo),
      favicon: mediaURL(site.favicon),
      loginImage: "",
      loginTitle: DEFAULT_LOGIN_TITLE,
      loginDescription: DEFAULT_LOGIN_DESCRIPTION,
      registerEnabled: true,
      appearance: DEFAULT_BODY_APPEARANCE,
      homeMenu: defaultHomeMenu(),
      filing: emptyFilingInfo(),
    },
    links: [],
    legalLinks: {
      termsOfService: null,
      privacyPolicy: null,
    },
    accounts: [
      {
        id: 1,
        provider: "feishu",
        name: "使用飞书账户继续",
        icon: "",
        appID: "",
        configured: false,
      },
    ],
  };
}

function normalizeHomeMenu(
  value: unknown,
  fallback: BodyHomeMenuConfig,
): BodyHomeMenuConfig {
  const root = recordValue(value);
  return Object.fromEntries(
    HOME_MENU_DEFAULTS.map(([key]) => {
      const current = recordValue(root[key]);
      return [
        key,
        {
          name: textValue(current.name) || fallback[key].name,
          icon: textValue(current.icon) || fallback[key].icon,
          iconImage: mediaURL(current.icon_image),
          enabled:
            current.enabled == null
              ? fallback[key].enabled
              : booleanValue(current.enabled),
          sort: finiteNumber(current.sort, fallback[key].sort),
        },
      ];
    }),
  ) as BodyHomeMenuConfig;
}

function defaultHomeMenu(): BodyHomeMenuConfig {
  return Object.fromEntries(
    HOME_MENU_DEFAULTS.map(([key, name, icon], index) => [
      key,
      { name, icon, iconImage: "", enabled: true, sort: (index + 1) * 10 },
    ]),
  ) as BodyHomeMenuConfig;
}

function isLoginNavigationLink(link: BodyLoginLink) {
  if (link.scenes.includes("navigation")) {
    return true;
  }
  return !link.code && link.scenes.length === 0;
}

function findLoginLinkByCode(links: BodyLoginLink[], code: string) {
  return links.find((link) => link.code === code) || null;
}

function normalizeAccount(value: unknown): BodyLoginAccount {
  const row = recordValue(value);
  return {
    id: positiveNumber(row.id),
    provider: textValue(row.provider).toLowerCase(),
    name: textValue(row.name),
    icon: mediaURL(row.icon),
    appID: textValue(row.app_id || row.appId),
    configured: booleanValue(row.configured),
  };
}

function validAccount(account: BodyLoginAccount) {
  return Boolean(account.id && account.provider && account.name);
}

function emptyFilingInfo(): BodyFilingInfo {
  return {
    content: "",
    contentConfigured: false,
    companyName: "",
    companyAddress: "",
    businessLicenseURL: "",
    icpRecord: "",
    icpRecordURL: "",
    publicSecurityRecord: "",
    publicSecurityRecordURL: "",
  };
}

function mediaURL(value: unknown): string {
  if (Array.isArray(value)) {
    return mediaURL(value[0]);
  }
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    return textValue(row.url || row.src || row.path || row.open_url);
  }

  const text = textValue(value);
  if (!text || (!text.startsWith("[") && !text.startsWith("{"))) {
    return text;
  }
  try {
    return mediaURL(JSON.parse(text));
  } catch {
    return text;
  }
}

function finiteNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function booleanValue(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  return ["1", "true", "yes", "on"].includes(
    textValue(value).toLowerCase(),
  );
}
