import { useRef, useState } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findFloatingLayerContainer } from "@/lib/floating-layer";
import type { PowerCategory } from "../../body-work/shared/power-menu";
import { PowerIcon } from "../../body-work/shared/power-icon";
import { PowerPickerMenu } from "../../body-work/shared/power-picker-menu";
import "./execution-controls.css";

export type AgentChatExecutionTool = {
  id: number;
  powerID: number;
  cateID: number;
  name: string;
  key: string;
  icon: string;
  kind: string;
  outputType: string;
};

export type AgentChatExecutionSelection = number | "auto";

export function AgentChatExecutionPowerPicker({
  value,
  powers,
  categories,
  onValueChange,
}: {
  value: AgentChatExecutionSelection;
  powers: AgentChatExecutionTool[];
  categories: PowerCategory[];
  onValueChange: (value: AgentChatExecutionSelection) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const selectedPower = powers.find(
    (power) => typeof value === "number" && power.id === value,
  );
  const selectedLabel =
    value === "auto" ? "自动选择" : selectedPower?.name || "选择";

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setPortalContainer(findFloatingLayerContainer(triggerRef.current));
        }
        setOpen(open);
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="agent-chat-execution-trigger"
          aria-label="选择工具"
        >
          <span className="agent-chat-execution-trigger-content">
            {value === "auto" ? (
              <Sparkles aria-hidden="true" />
            ) : selectedPower ? (
              <PowerIcon power={selectedPower} size={15} />
            ) : null}
            <span>{selectedLabel}</span>
          </span>
          <ChevronDown className="agent-chat-execution-chevron" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        container={portalContainer}
        className="agent-chat-execution-menu"
      >
        <DropdownMenuItem
          className={`agent-chat-execution-menu-item agent-chat-execution-power-item${
            value === "auto" ? " is-selected" : ""
          }`}
          onSelect={() => onValueChange("auto")}
        >
          <Sparkles aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">自动选择</span>
          {value === "auto" ? <Check aria-hidden="true" /> : null}
        </DropdownMenuItem>
        {powers.length > 0 ? <DropdownMenuSeparator /> : null}
        <PowerPickerMenu
          open={open}
          value={typeof value === "number" ? value : null}
          powers={powers}
          categories={categories}
          appearance="agent"
          portalContainer={portalContainer}
          onValueChange={onValueChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AgentChatExecutionSourcePicker({
  value,
  options,
  ariaLabel,
  onValueChange,
}: {
  value: number;
  options: Array<{ id: number; name: string }>;
  ariaLabel: string;
  onValueChange: (value: number) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  return (
    <Select
      value={String(value)}
      onValueChange={(nextValue) => onValueChange(Number(nextValue))}
      onOpenChange={(open) => {
        if (open) {
          setPortalContainer(findFloatingLayerContainer(triggerRef.current));
        }
      }}
    >
      <SelectTrigger
        ref={triggerRef}
        aria-label={ariaLabel}
        className="agent-chat-execution-trigger agent-chat-execution-source-trigger"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        align="start"
        container={portalContainer}
        className="agent-chat-execution-menu"
      >
        {options.map((option) => (
          <SelectItem
            key={option.id}
            className="agent-chat-execution-menu-item"
            value={String(option.id)}
          >
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
