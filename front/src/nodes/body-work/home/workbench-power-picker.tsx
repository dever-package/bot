import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PowerCategory } from "../shared/power-menu";
import { PowerIcon } from "../shared/power-icon";
import { PowerPickerMenu } from "../shared/power-picker-menu";
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
  const [open, setOpen] = useState(false);
  const selectedPower = powers.find((power) => power.id === value);

  return (
    <div className="workbench-picker workbench-power-picker">
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
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
          <PowerPickerMenu
            open={open}
            value={value}
            powers={powers}
            categories={categories}
            appearance="workbench"
            onValueChange={onValueChange}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
