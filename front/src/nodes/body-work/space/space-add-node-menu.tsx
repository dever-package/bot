import {
  Eye,
  FolderTree,
  Play,
  Save,
  Upload,
  UserCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { PowerIcon } from "./space-power-icon";
import { resolvePowerPresentation } from "./space-power-presentation";
import type {
  CanvasFunctionOption,
  PowerOption,
  TeamFlow,
  TeamRole,
} from "./types";

export const canvasFunctionOptions: CanvasFunctionOption[] = [
  {
    key: "start",
    label: "开始",
    description: "启动连接的创作节点，直到保存或展示。",
  },
  { key: "import", label: "导入", description: "导入资产并连接到当前节点。" },
  {
    key: "save",
    label: "保存",
    description: "将上游结果保存为当前资产类型的资产。",
  },
  { key: "display", label: "展示", description: "展示上游节点的结果。" },
];

type AddNodeMenuModel = {
  x: number;
  y: number;
  connection?: { nodeId: string };
};

export function AddNodeMenu({
  menu,
  flows,
  powers,
  roles,
  onClose,
  onSelectFlow,
  onSelectFunction,
  onSelectGroup,
  onSelectRole,
  onSelectPower,
}: {
  menu: AddNodeMenuModel;
  flows: TeamFlow[];
  powers: PowerOption[];
  roles: TeamRole[];
  onClose: () => void;
  onSelectFlow: (flow: TeamFlow) => void;
  onSelectFunction: (option: CanvasFunctionOption) => void;
  onSelectGroup: () => void;
  onSelectRole: (role: TeamRole) => void;
  onSelectPower: (power: PowerOption) => void;
}) {
  const point = clampMenuPoint(menu);
  const sections: ReactNode[] = [];

  if (powers.length > 0) {
    sections.push(
      renderPowerMenuSection(powers, onSelectPower),
    );
  }
  if (roles.length > 0) {
    sections.push(
      renderMenuSection({
        sectionKey: "roles",
        title: "智能体",
        items: roles,
        itemKey: (role) => String(role.id || role.role_key || role.name),
        itemClassName: "is-agent",
        label: (role) => role.name,
        icon: () => <UserCheck size={16} />,
        onSelect: onSelectRole,
      }),
    );
  }
  if (flows.length > 0) {
    sections.push(
      renderMenuSection({
        sectionKey: "flows",
        title: "流程",
        items: flows,
        itemKey: (flow) => String(flow.id || flow.key || flow.name),
        itemClassName: "is-flow",
        label: (flow) => flow.name,
        icon: () => <Workflow size={16} />,
        onSelect: onSelectFlow,
      }),
    );
  }
  sections.push(renderFunctionMenuSection(onSelectFunction, onSelectGroup));

  return (
    <>
      <div
        className="ws-add-menu-backdrop"
        onMouseDown={onClose}
        onContextMenu={(event) => {
          event.preventDefault();
          onClose();
        }}
      />
      <section
        className="ws-add-menu custom-scrollbar"
        style={{ left: point.x, top: point.y, maxHeight: point.maxHeight }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ws-add-menu-head">
          <strong>{menu.connection ? "引用该节点生成" : "添加节点"}</strong>
        </div>
        <div className="ws-add-menu-body">
          {sections.map((section, index) => (
            <div key={index}>
              {section}
              {index < sections.length - 1 ? (
                <div className="ws-add-divider" />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function renderMenuSection<T>({
  sectionKey,
  title,
  items,
  itemKey,
  itemClassName,
  label,
  description,
  icon,
  onSelect,
}: {
  sectionKey: string;
  title: string;
  items: T[];
  itemKey: (item: T) => string;
  itemClassName: string | ((item: T) => string);
  label: (item: T) => string;
  description?: (item: T) => string;
  icon: (item: T) => ReactNode;
  onSelect: (item: T) => void;
}) {
  return (
    <div key={sectionKey} className="ws-add-section">
      <div className="ws-add-section-title">{title}</div>
      {renderMenuItems({
        items,
        itemKey,
        itemClassName,
        label,
        description,
        icon,
        onSelect,
      })}
    </div>
  );
}

function renderPowerMenuSection(
  powers: PowerOption[],
  onSelect: (power: PowerOption) => void,
) {
  return (
    <div key="powers" className="ws-add-section">
      <div className="ws-add-section-title">能力</div>
      {renderMenuItems({
        items: powers,
        itemKey: (power) => String(power.key || power.id),
        itemClassName: "is-power",
        label: (power) => power.name,
        description: (power) => resolvePowerPresentation(power).kindName,
        icon: (power) => <PowerIcon power={power} size={16} />,
        onSelect,
      })}
    </div>
  );
}

function renderFunctionMenuSection(
  onSelectFunction: (option: CanvasFunctionOption) => void,
  onSelectGroup: () => void,
) {
  const items = [
    ...canvasFunctionOptions.map((option) => ({
      key: option.key,
      label: option.label,
      description: option.description,
      className:
        option.key === "import" ? "is-function is-import" : "is-function",
      Icon: functionIcon(option.key),
      select: () => onSelectFunction(option),
    })),
    {
      key: "group",
      label: "分组",
      description: "组织并统一运行一组节点",
      className: "is-group",
      Icon: FolderTree,
      select: onSelectGroup,
    },
  ];
  return (
    <div key="functions" className="ws-add-section">
      <div className="ws-add-section-title">功能</div>
      {renderMenuItems({
        items,
        itemKey: (item) => item.key,
        itemClassName: (item) => item.className,
        label: (item) => item.label,
        description: (item) => item.description,
        icon: (item) => {
          const Icon = item.Icon;
          return <Icon size={16} />;
        },
        onSelect: (item) => item.select(),
      })}
    </div>
  );
}

function renderMenuItems<T>({
  items,
  itemKey,
  itemClassName,
  label,
  description,
  icon,
  onSelect,
}: {
  items: T[];
  itemKey: (item: T) => string;
  itemClassName: string | ((item: T) => string);
  label: (item: T) => string;
  description?: (item: T) => string;
  icon: (item: T) => ReactNode;
  onSelect: (item: T) => void;
}) {
  return (
    <div className="ws-add-menu-list">
      {items.map((item) => {
        const className =
          typeof itemClassName === "function"
            ? itemClassName(item)
            : itemClassName;
        const itemDescription = description?.(item) || "";
        return (
          <button
            key={itemKey(item)}
            type="button"
            className={`ws-add-item ${className}`.trim()}
            title={
              itemDescription
                ? `${label(item)} · ${itemDescription}`
                : label(item)
            }
            onClick={() => onSelect(item)}
          >
            <span className="ws-add-icon">{icon(item)}</span>
            <span className="ws-add-copy">
              <span className="ws-add-label">{label(item)}</span>
              {itemDescription ? (
                <span className="ws-add-desc">{itemDescription}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function functionIcon(key: string): LucideIcon {
  if (key === "start") return Play;
  if (key === "import") return Upload;
  if (key === "save") return Save;
  if (key === "display") return Eye;
  return Zap;
}

function clampMenuPoint(menu: AddNodeMenuModel) {
  if (typeof window === "undefined") {
    return { x: menu.x, y: menu.y, maxHeight: 520 };
  }
  const margin = 14;
  const minTop = 62;
  const width = Math.min(292, window.innerWidth - margin * 2);
  const maxHeight = Math.min(
    520,
    Math.max(180, window.innerHeight - minTop - margin),
  );
  const preferredY =
    menu.y + maxHeight > window.innerHeight - margin
      ? menu.y - maxHeight
      : menu.y;
  return {
    x: Math.min(
      Math.max(margin, menu.x),
      Math.max(margin, window.innerWidth - width - margin),
    ),
    y: Math.min(
      Math.max(minTop, preferredY),
      Math.max(minTop, window.innerHeight - maxHeight - margin),
    ),
    maxHeight,
  };
}
