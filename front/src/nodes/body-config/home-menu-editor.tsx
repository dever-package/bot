import { useMemo, useState } from "react";
import { useStore } from "zustand";
import { Pencil } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dever/front-plugin";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

type HomeMenuRowSpec = (typeof HOME_MENU_ROWS)[number];

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
  const [editingRow, setEditingRow] = useState<HomeMenuRowSpec | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[18%] px-4">固定入口</TableHead>
            <TableHead className="w-[24%] px-4">显示名称</TableHead>
            <TableHead className="px-4">菜单图标</TableHead>
            <TableHead className="w-24 px-4 text-center">状态</TableHead>
            <TableHead className="w-20 px-4 text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {HOME_MENU_ROWS.map((row) => (
            <HomeMenuRow
              key={row.key}
              store={store}
              row={row}
              onEdit={() => setEditingRow(row)}
            />
          ))}
        </TableBody>
      </Table>

      {editingRow ? (
        <HomeMenuEditDialog
          key={editingRow.key}
          store={store}
          row={editingRow}
          onClose={() => setEditingRow(null)}
        />
      ) : null}
    </>
  );
}

function HomeMenuRow({
  store,
  row,
  onEdit,
}: {
  store: NodeItemProps["store"];
  row: HomeMenuRowSpec;
  onEdit: () => void;
}) {
  const namePath = `form.home_${row.key}_name`;
  const iconPath = `form.home_${row.key}_icon`;
  const statusPath = `form.home_${row.key}_status`;
  const name = useStore(store, (state) => state.getValueByPath(namePath));
  const icon = useStore(store, (state) => state.getValueByPath(iconPath));
  const status = useStore(store, (state) => state.getValueByPath(statusPath));
  const iconName = icon == null ? "" : String(icon);
  const CurrentIcon = resolveLucideIcon(iconName);

  return (
    <TableRow className="h-12">
      <TableCell className="px-4 font-medium text-foreground">
        {row.label}
      </TableCell>
      <TableCell className="px-4 text-foreground">
        {name == null || String(name).trim() === "" ? row.label : String(name)}
      </TableCell>
      <TableCell className="px-4 text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          {CurrentIcon ? <CurrentIcon className="size-4 shrink-0" /> : null}
          <span>{iconName || "未设置"}</span>
        </span>
      </TableCell>
      <TableCell className="px-4 text-center">
        <Switch
          checked={status == null || Number(status) === 1}
          aria-label={`显示${row.label}菜单`}
          onCheckedChange={(checked) =>
            store.getState().setValueByPath(statusPath, checked ? 1 : 2)
          }
        />
      </TableCell>
      <TableCell className="px-4 text-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          title={`编辑${row.label}菜单`}
          aria-label={`编辑${row.label}菜单`}
          className="size-8"
          onClick={onEdit}
        >
          <Pencil className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function HomeMenuEditDialog({
  store,
  row,
  onClose,
}: {
  store: NodeItemProps["store"];
  row: HomeMenuRowSpec;
  onClose: () => void;
}) {
  const namePath = `form.home_${row.key}_name`;
  const iconPath = `form.home_${row.key}_icon`;
  const storedName = useStore(store, (state) => state.getValueByPath(namePath));
  const storedIcon = useStore(store, (state) => state.getValueByPath(iconPath));
  const [name, setName] = useState(
    storedName == null ? row.label : String(storedName),
  );
  const [icon, setIcon] = useState(
    storedIcon == null ? "" : String(storedIcon),
  );
  const [error, setError] = useState("");
  const iconOptions = useMemo(
    () => Array.from(new Set([icon, ...MENU_ICON_OPTIONS])).filter(Boolean),
    [icon],
  );

  function applyChanges() {
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError("显示名称不能为空。");
      return;
    }
    if (!icon) {
      setError("请选择菜单图标。");
      return;
    }
    store.getState().setValueByPath(namePath, normalizedName);
    store.getState().setValueByPath(iconPath, icon);
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>编辑{row.label}菜单</DialogTitle>
          <DialogDescription>
            修改首页菜单中的显示名称和图标。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-2">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            显示名称
            <Input
              value={name}
              maxLength={64}
              placeholder={row.label}
              aria-invalid={Boolean(error && !name.trim())}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
            />
          </label>
          <div className="grid gap-2 text-sm font-medium text-foreground">
            <span>菜单图标</span>
            <MenuIconSelect
              value={icon}
              options={iconOptions}
              label={`${row.label}菜单图标`}
              onChange={(nextIcon) => {
                setIcon(nextIcon);
                setError("");
              }}
            />
          </div>
          {error ? <p className="m-0 text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="button" onClick={applyChanges}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
