import { Clapperboard } from "lucide-react";
import { StoryboardSettingSelect } from "./space-storyboard-setting-select";
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
    <StoryboardSettingSelect
      id="storyboard-work-type"
      ariaLabel="作品类型"
      label={selected?.name || value}
      icon={<Clapperboard size={15} />}
      value={value}
      options={options.map((option) => ({
        key: option.key,
        label: option.name,
      }))}
      disabled={disabled}
      openKey={openKey}
      onToggle={onToggle}
      onChange={onChange}
    />
  );
}
