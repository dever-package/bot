import { useMemo } from "react";
import { useStore } from "zustand";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveLucideIcon } from "@/lib/icon";
import type { NodeItemProps } from "@/page/nodes";

const HOME_MENU_ROWS = [
  { key: "works", label: "创作" },
  { key: "dialogue", label: "对话" },
  { key: "function", label: "工具" },
  { key: "assets", label: "资产" },
  { key: "points", label: "积分" },
  { key: "messages", label: "消息" },
] as const;

const HOME_MENU_GRID_CLASS =
  "grid grid-cols-[minmax(7rem,0.65fr)_minmax(13rem,1.35fr)_minmax(13rem,1.15fr)_5rem] items-center gap-4";

const MENU_ICON_OPTIONS = [
  "file-stack",
  "messages-square",
  "zap",
  "archive",
  "sparkles",
  "bell",
  "house",
  "layout-grid",
  "panels-top-left",
  "folder",
  "folder-open",
  "briefcase-business",
  "bot",
  "message-circle",
  "send",
  "wand-sparkles",
  "image",
  "video",
  "music",
  "file-text",
  "database",
  "coins",
  "wallet-cards",
  "megaphone",
  "circle-user-round",
  "settings",
  "search",
  "compass",
  "rocket",
] as const;

export function BodyHomeMenuEditor({ store }: NodeItemProps) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div className="min-w-[700px] overflow-hidden rounded-md border border-border bg-background">
        <div
          className={`${HOME_MENU_GRID_CLASS} border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground`}
        >
          <span>固定入口</span>
          <span>显示名称</span>
          <span>菜单图标</span>
          <span className="text-center">显示</span>
        </div>
        {HOME_MENU_ROWS.map((row) => (
          <HomeMenuRow key={row.key} store={store} row={row} />
        ))}
      </div>
    </div>
  );
}

function HomeMenuRow({
  store,
  row,
}: {
  store: NodeItemProps["store"];
  row: (typeof HOME_MENU_ROWS)[number];
}) {
  const namePath = `form.home_${row.key}_name`;
  const iconPath = `form.home_${row.key}_icon`;
  const statusPath = `form.home_${row.key}_status`;
  const name = useStore(store, (state) => state.getValueByPath(namePath));
  const icon = useStore(store, (state) => state.getValueByPath(iconPath));
  const status = useStore(store, (state) => state.getValueByPath(statusPath));
  const iconName = icon == null ? "" : String(icon);
  const iconOptions = useMemo(
    () => Array.from(new Set([iconName, ...MENU_ICON_OPTIONS])).filter(Boolean),
    [iconName],
  );

  return (
    <div
      className={`${HOME_MENU_GRID_CLASS} border-b border-border px-4 py-3 last:border-b-0`}
    >
      <strong className="text-sm font-medium text-foreground">
        {row.label}
      </strong>
      <Input
        value={name == null ? "" : String(name)}
        maxLength={64}
        aria-label={`${row.label}菜单名称`}
        className="h-9 rounded-md shadow-none"
        onChange={(event) =>
          store.getState().setValueByPath(namePath, event.target.value)
        }
      />
      <MenuIconSelect
        value={iconName}
        options={iconOptions}
        label={`${row.label}菜单图标`}
        onChange={(nextIcon) =>
          store.getState().setValueByPath(iconPath, nextIcon)
        }
      />
      <div className="flex justify-center">
        <MenuVisibilitySwitch
          checked={status == null || Number(status) === 1}
          label={`显示${row.label}菜单`}
          onChange={(checked) =>
            store.getState().setValueByPath(statusPath, checked ? 1 : 2)
          }
        />
      </div>
    </div>
  );
}

function MenuIconSelect({
  value,
  options,
  label,
  onChange,
}: {
  value: string;
  options: string[];
  label: string;
  onChange: (value: string) => void;
}) {
  const CurrentIcon = resolveLucideIcon(value);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-full rounded-md shadow-none" aria-label={label}>
        <span className="flex min-w-0 items-center gap-2">
          {CurrentIcon ? <CurrentIcon className="size-4 shrink-0" /> : null}
          <SelectValue placeholder="选择图标" />
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((iconName) => {
          const Icon = resolveLucideIcon(iconName);
          return (
            <SelectItem key={iconName} value={iconName}>
              <span className="flex items-center gap-2">
                {Icon ? <Icon className="size-4" /> : null}
                <span>{iconName}</span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function MenuVisibilitySwitch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-input"
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
