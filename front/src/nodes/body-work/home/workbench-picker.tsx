import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type WorkbenchPickerOption = {
  id: number;
  name: string;
};

export function WorkbenchPicker({
  value,
  options,
  ariaLabel,
  onValueChange,
}: {
  value: number;
  options: WorkbenchPickerOption[];
  ariaLabel: string;
  onValueChange: (value: number) => void;
}) {
  return (
    <div className="workbench-picker">
      <Select
        value={String(value)}
        onValueChange={(nextValue) => onValueChange(Number(nextValue))}
      >
        <SelectTrigger
          aria-label={ariaLabel}
          className="workbench-picker-trigger"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" className="workbench-picker-content">
          {options.map((option) => (
            <SelectItem
              key={option.id}
              className="workbench-picker-item"
              value={String(option.id)}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
