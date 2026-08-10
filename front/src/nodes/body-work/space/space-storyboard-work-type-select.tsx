import { CheckCircle2, Clapperboard } from "lucide-react";
import { ComposerMenu } from "./space-prompt-composer";
import { isStoryboardWorkTypeKey } from "./space-storyboard-work-type";
import type { StoryboardWorkType, StoryboardWorkTypeSpec } from "./types";

export function StoryboardWorkTypeSelect({
  value,
  options,
  disabled = false,
  openKey,
  onToggle,
  onChange,
}: {
  value: StoryboardWorkType;
  options: StoryboardWorkTypeSpec[];
  disabled?: boolean;
  openKey: string;
  onToggle: (key: string) => void;
  onChange: (value: StoryboardWorkType) => void;
}) {
  const selected = options.find((option) => option.key === value);
  if (options.length === 0) {
    return null;
  }
  return (
    <ComposerMenu
      id="storyboard-work-type"
      openKey={openKey}
      label={selected?.name || value}
      icon={<Clapperboard size={15} />}
      disabled={disabled}
      onToggle={onToggle}
    >
      <div className="ws-prompt-menu-list" role="menu" aria-label="作品类型">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`ws-prompt-menu-item ${option.key === value ? "is-active" : ""}`}
            disabled={disabled}
            role="menuitemradio"
            aria-checked={option.key === value}
            onClick={() => {
              if (isStoryboardWorkTypeKey(option.key)) {
                onChange(option.key);
                onToggle("");
              }
            }}
          >
            <span>{option.name}</span>
            {option.key === value ? <CheckCircle2 size={14} /> : null}
          </button>
        ))}
      </div>
    </ComposerMenu>
  );
}
