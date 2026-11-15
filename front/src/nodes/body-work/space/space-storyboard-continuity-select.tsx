import { Link2 } from "lucide-react";
import { StoryboardSettingSelect } from "./space-storyboard-setting-select";
import type { StoryboardContinuity } from "./types";

const OPTIONS: { key: StoryboardContinuity; label: string }[] = [
  { key: "relay", label: "接力：接上一镜尾帧" },
  { key: "free", label: "自由分镜：按需切镜" },
];

// 接力让同一场戏的镜头首尾相接，只画每场戏的第一张图；自由分镜保留逐镜切换。
export function StoryboardContinuitySelect({
  value,
  disabled = false,
  openKey,
  onToggle,
  onChange,
}: {
  value: StoryboardContinuity;
  disabled?: boolean;
  openKey: string;
  onToggle: (key: string) => void;
  onChange: (value: StoryboardContinuity) => void;
}) {
  return (
    <StoryboardSettingSelect
      id="storyboard-continuity"
      ariaLabel="镜头衔接"
      label={value === "relay" ? "接力" : "自由分镜"}
      icon={<Link2 size={15} />}
      value={value}
      options={OPTIONS}
      disabled={disabled}
      openKey={openKey}
      onToggle={onToggle}
      onChange={onChange}
    />
  );
}
