import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { ComposerMenu } from "./space-prompt-composer";

export function StoryboardSettingSelect<T extends string | number>({
  id,
  label,
  ariaLabel,
  icon,
  value,
  options,
  disabled = false,
  openKey,
  onToggle,
  onChange,
}: {
  id: string;
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  value: T;
  options: Array<{ key: T; label: string }>;
  disabled?: boolean;
  openKey: string;
  onToggle: (key: string) => void;
  onChange: (value: T) => void;
}) {
  if (options.length === 0) {
    return null;
  }
  return (
    <ComposerMenu
      id={id}
      openKey={openKey}
      label={label}
      icon={icon}
      disabled={disabled}
      onToggle={onToggle}
    >
      <div className="ws-prompt-menu-list" role="menu" aria-label={ariaLabel}>
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`ws-prompt-menu-item ${option.key === value ? "is-active" : ""}`}
            disabled={disabled}
            role="menuitemradio"
            aria-checked={option.key === value}
            onClick={() => {
              onChange(option.key);
              onToggle("");
            }}
          >
            <span>{option.label}</span>
            {option.key === value ? <CheckCircle2 size={14} /> : null}
          </button>
        ))}
      </div>
    </ComposerMenu>
  );
}
