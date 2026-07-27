import { useMemo } from "react";
import { Check, ChevronDown, FolderTree } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildPowerMenu, type PowerCategory } from "../shared/power-menu";
import { PowerIcon } from "../space/space-power-icon";
import type { WorkbenchPower } from "./workbench-api";

export function WorkbenchPowerPicker({
  value,
  powers,
  categories,
  onValueChange,
}: {
  value: number;
  powers: WorkbenchPower[];
  categories: PowerCategory[];
  onValueChange: (value: number) => void;
}) {
  const selectedPower = powers.find((power) => power.id === value);
  const menu = useMemo(
    () => buildPowerMenu(powers, categories, (power) => power.cateID),
    [categories, powers],
  );

  return (
    <div className="workbench-picker workbench-power-picker">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="workbench-picker-trigger workbench-power-picker-trigger"
            aria-label="选择工具"
          >
            <span className="flex min-w-0 items-center gap-2">
              {selectedPower ? (
                <PowerIcon
                  power={selectedPower}
                  size={15}
                  className="shrink-0"
                />
              ) : null}
              <span className="truncate">
                {selectedPower?.name || "选择工具"}
              </span>
            </span>
            <ChevronDown className="workbench-power-picker-chevron" size={15} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="workbench-picker-content workbench-power-picker-content"
        >
          {menu.basicPowers.map((power) => (
            <PowerPickerItem
              key={power.id}
              power={power}
              selected={power.id === value}
              onSelect={onValueChange}
            />
          ))}
          {menu.groups.map((group) => (
            <DropdownMenuSub key={group.category.id}>
              <DropdownMenuSubTrigger className="workbench-picker-item workbench-power-group-trigger">
                <FolderTree size={15} />
                <span className="truncate">{group.category.name}</span>
                <small>{group.powers.length}</small>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="workbench-picker-content workbench-power-picker-subcontent">
                {group.powers.map((power) => (
                  <PowerPickerItem
                    key={power.id}
                    power={power}
                    selected={power.id === value}
                    onSelect={onValueChange}
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function PowerPickerItem({
  power,
  selected,
  onSelect,
}: {
  power: WorkbenchPower;
  selected: boolean;
  onSelect: (value: number) => void;
}) {
  return (
    <DropdownMenuItem
      className={`workbench-picker-item workbench-power-picker-item${
        selected ? " is-selected" : ""
      }`}
      onSelect={() => onSelect(power.id)}
    >
      <PowerIcon power={power} size={14} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate">{power.name}</span>
      {selected ? <Check size={14} /> : null}
    </DropdownMenuItem>
  );
}
