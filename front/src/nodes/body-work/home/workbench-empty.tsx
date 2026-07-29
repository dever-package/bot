import type { LucideIcon } from "lucide-react";

export function WorkbenchEmpty({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-white px-6 text-center">
      <div>
        <Icon className="mx-auto mb-3 size-6 text-[#8b9691]" />
        <p className="m-0 text-sm font-medium text-[#4f5a55]">{title}</p>
      </div>
    </div>
  );
}
