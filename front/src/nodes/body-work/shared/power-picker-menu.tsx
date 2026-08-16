import { useEffect, useMemo, useState } from "react";
import { Check, FolderTree, Search } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { PowerIcon, type PowerIconSource } from "./power-icon";
import {
  buildPowerMenu,
  type PowerCategory,
  type PowerMenuGroup,
} from "./power-menu";

const POWER_SEARCH_THRESHOLD = 12;

export type PowerPickerOption = PowerIconSource & {
  id: number;
  cateID: number;
  name: string;
  key?: string;
};

type PowerPickerAppearance = "agent" | "workbench";

export function PowerPickerMenu<T extends PowerPickerOption>({
  open,
  value,
  powers,
  categories,
  appearance,
  portalContainer,
  onValueChange,
}: {
  open: boolean;
  value: number | null;
  powers: T[];
  categories: PowerCategory[];
  appearance: PowerPickerAppearance;
  portalContainer?: HTMLElement | null;
  onValueChange: (value: number) => void;
}) {
  const [query, setQuery] = useState("");
  const menu = useMemo(
    () => buildPowerMenu(powers, categories, (power) => power.cateID),
    [categories, powers],
  );
  const searchablePowers = useMemo(
    () => powerSearchEntries(menu.basicPowers, menu.groups),
    [menu.basicPowers, menu.groups],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const searchResults = useMemo(
    () =>
      normalizedQuery
        ? searchablePowers.filter((entry) =>
            [entry.power.name, entry.power.key, entry.categoryName]
              .filter(Boolean)
              .join(" ")
              .toLocaleLowerCase()
              .includes(normalizedQuery),
          )
        : [],
    [normalizedQuery, searchablePowers],
  );

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <>
      {powers.length > POWER_SEARCH_THRESHOLD ? (
        <div className="mx-0.5 mb-1.5 mt-0.5 flex h-9 items-center gap-2 border-b border-border px-2 text-muted-foreground [&>svg]:size-3.5 [&>svg]:shrink-0">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder="搜索能力"
            aria-label="搜索能力"
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent text-xs text-foreground outline-none [letter-spacing:0] placeholder:text-muted-foreground"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Escape") event.stopPropagation();
            }}
          />
        </div>
      ) : null}
      {normalizedQuery ? (
        searchResults.length > 0 ? (
          searchResults.map((entry) => (
            <PowerPickerItem
              key={entry.power.id}
              power={entry.power}
              categoryName={entry.categoryName}
              selected={entry.power.id === value}
              appearance={appearance}
              onSelect={onValueChange}
            />
          ))
        ) : (
          <div className="px-2.5 py-4 text-center text-xs text-muted-foreground">
            没有匹配的能力
          </div>
        )
      ) : (
        <>
          {menu.basicPowers.map((power) => (
            <PowerPickerItem
              key={power.id}
              power={power}
              selected={power.id === value}
              appearance={appearance}
              onSelect={onValueChange}
            />
          ))}
          {menu.groups.map((group) => (
            <DropdownMenuSub key={group.category.id}>
              <DropdownMenuSubTrigger
                className={powerGroupClassName(appearance)}
              >
                <FolderTree aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">
                  {group.category.name}
                </span>
                <small>{group.powers.length}</small>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal container={portalContainer}>
                <DropdownMenuSubContent
                  className={powerSubContentClassName(appearance)}
                >
                  {group.powers.map((power) => (
                    <PowerPickerItem
                      key={power.id}
                      power={power}
                      selected={power.id === value}
                      appearance={appearance}
                      onSelect={onValueChange}
                    />
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </>
      )}
    </>
  );
}

function PowerPickerItem<T extends PowerPickerOption>({
  power,
  categoryName,
  selected,
  appearance,
  onSelect,
}: {
  power: T;
  categoryName?: string;
  selected: boolean;
  appearance: PowerPickerAppearance;
  onSelect: (value: number) => void;
}) {
  return (
    <DropdownMenuItem
      className={powerItemClassName(appearance, selected)}
      onSelect={() => onSelect(power.id)}
    >
      <PowerIcon power={power} size={14} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate">
        {categoryName ? `${categoryName} / ` : ""}
        {power.name}
      </span>
      {selected ? <Check aria-hidden="true" /> : null}
    </DropdownMenuItem>
  );
}

function powerSearchEntries<T extends PowerPickerOption>(
  basicPowers: T[],
  groups: PowerMenuGroup<T>[],
) {
  return [
    ...basicPowers.map((power) => ({ power, categoryName: "" })),
    ...groups.flatMap((group) =>
      group.powers.map((power) => ({
        power,
        categoryName: group.category.name,
      })),
    ),
  ];
}

function powerItemClassName(
  appearance: PowerPickerAppearance,
  selected: boolean,
) {
  const base =
    appearance === "workbench"
      ? "workbench-picker-item workbench-power-picker-item"
      : "agent-chat-execution-menu-item agent-chat-execution-power-item";
  return `${base}${selected ? " is-selected" : ""}`;
}

function powerGroupClassName(appearance: PowerPickerAppearance) {
  return appearance === "workbench"
    ? "workbench-picker-item workbench-power-group-trigger"
    : "agent-chat-execution-menu-item agent-chat-execution-group-trigger";
}

function powerSubContentClassName(appearance: PowerPickerAppearance) {
  return appearance === "workbench"
    ? "workbench-picker-content workbench-power-picker-subcontent"
    : "agent-chat-execution-menu agent-chat-execution-submenu";
}
