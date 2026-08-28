import { Timer } from "lucide-react";
import { StoryboardSettingSelect } from "./space-storyboard-setting-select";
import type { StoryboardShotDurationSpec } from "./types";

export function StoryboardDurationSelect({
  value,
  options,
  disabled = false,
  openKey,
  onToggle,
  onChange,
}: {
  value: number;
  options: StoryboardShotDurationSpec[];
  disabled?: boolean;
  openKey: string;
  onToggle: (key: string) => void;
  onChange: (value: number) => void;
}) {
  const selected = options.find((option) => option.seconds === value);
  return (
    <StoryboardSettingSelect
      id="storyboard-min-shot-duration"
      ariaLabel="单镜最短时长"
      label={`单镜最短 ${selected?.name || `${value}秒`}`}
      icon={<Timer size={15} />}
      value={value}
      options={options.map((option) => ({
        key: option.seconds,
        label: option.name,
      }))}
      disabled={disabled}
      openKey={openKey}
      onToggle={onToggle}
      onChange={onChange}
    />
  );
}
