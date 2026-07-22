import { useEffect, useState } from "react";
import {
  getSiteConfig,
  joinSiteApi,
  request,
} from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";

export type BodySiteConfig = {
  siteName: string;
  logo: string;
  favicon: string;
  loginImage: string;
  loginTitle: string;
  loginDescription: string;
  homeMenu: BodyHomeMenuConfig;
  filing: BodyFilingInfo;
};

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
};

export type BodyFilingInfo = {
  companyName: string;
  companyAddress: string;
  businessLicenseURL: string;
  icpRecord: string;
  icpRecordURL: string;
  publicSecurityRecord: string;
  publicSecurityRecordURL: string;
};

export type BodyLoginLink = {
  id: number;
  name: string;
  url: string;
  target: "_self" | "_blank";
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
  accounts: BodyLoginAccount[];
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
] as const;

let cachedLoginConfig: BodyLoginConfig | null = null;
let pendingLoginConfig: Promise<BodyLoginConfig> | null = null;

export function useBodyLoginConfig() {
  const [config, setConfig] = useState<BodyLoginConfig>(() =>
    cachedLoginConfig || fallbackLoginConfig(),
  );

  useEffect(() => {
    let active = true;
    void loadBodyLoginConfig().then((next) => {
      if (active) {
        setConfig(next);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return config;
}

export function loadBodyLoginConfig() {
  if (cachedLoginConfig) {
    return Promise.resolve(cachedLoginConfig);
  }
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
    .catch(() => fallbackLoginConfig())
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
      homeMenu: normalizeHomeMenu(config.home_menu, fallback.site.homeMenu),
      filing: {
        companyName: textValue(config.company_name),
        companyAddress: textValue(config.company_address),
        businessLicenseURL: safeExternalURL(config.business_license_url),
        icpRecord: textValue(config.icp_record),
        icpRecordURL: safeExternalURL(config.icp_record_url),
        publicSecurityRecord: textValue(config.public_security_record),
        publicSecurityRecordURL: safeExternalURL(
          config.public_security_record_url,
        ),
      },
    },
    links: rowsValue(root.links).map(normalizeLink).filter(validLink),
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
      homeMenu: defaultHomeMenu(),
      filing: emptyFilingInfo(),
    },
    links: [],
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

function normalizeLink(value: unknown): BodyLoginLink {
  const row = recordValue(value);
  return {
    id: positiveNumber(row.id),
    name: textValue(row.name),
    url: safeLinkURL(row.url),
    target: textValue(row.target) === "_blank" ? "_blank" : "_self",
  };
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

function validLink(link: BodyLoginLink) {
  return Boolean(link.id && link.name && link.url);
}

function validAccount(account: BodyLoginAccount) {
  return Boolean(account.id && account.provider && account.name);
}

function safeLinkURL(value: unknown) {
  if (typeof window === "undefined") {
    return "";
  }
  return safeURL(
    value,
    ["http:", "https:", "mailto:"],
    window.location.origin,
  );
}

function safeExternalURL(value: unknown) {
  return safeURL(value, ["http:", "https:"]);
}

function safeURL(value: unknown, protocols: string[], base?: string) {
  const text = textValue(value);
  if (!text) {
    return "";
  }
  try {
    const url = base ? new URL(text, base) : new URL(text);
    return protocols.includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function emptyFilingInfo(): BodyFilingInfo {
  return {
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

function recordValue(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function rowsValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function finiteNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}

function booleanValue(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  return ["1", "true", "yes", "on"].includes(
    textValue(value).toLowerCase(),
  );
}
