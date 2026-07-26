import {
  ChevronRight,
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
import { useMemo, useState, type ReactNode } from "react";
import {
  buildPowerMenu,
  type PowerMenu,
  type PowerMenuGroup,
} from "../shared/power-menu";
import { PowerIcon } from "./space-power-icon";
import { resolvePowerPresentation } from "./space-power-presentation";
import { SpaceTooltip } from "./space-tooltip";
import type {
  CanvasFunctionOption,
  PowerCategoryOption,
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

const ADD_MENU_WIDTH = 292;
const POWER_SUBMENU_OUTER_WIDTH = 248;

export function AddNodeMenu({
  menu,
  flows,
  powers,
  powerCategories,
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
  powerCategories: PowerCategoryOption[];
  roles: TeamRole[];
  onClose: () => void;
  onSelectFlow: (flow: TeamFlow) => void;
  onSelectFunction: (option: CanvasFunctionOption) => void;
  onSelectGroup: () => void;
  onSelectRole: (role: TeamRole) => void;
  onSelectPower: (power: PowerOption) => void;
}) {
  const point = clampMenuPoint(menu);
  const [openPowerGroupID, setOpenPowerGroupID] = useState(0);
  const powerMenu = useMemo(
    () =>
      buildPowerMenu(
        powers,
        powerCategories,
        (power) => power.cate_id,
      ),
    [powerCategories, powers],
  );
  const openPowerGroup =
    powerMenu.groups.find(
      (group) => group.category.id === openPowerGroupID,
    ) || null;
  const sections: ReactNode[] = [];

  if (powerMenu.basicPowers.length > 0 || powerMenu.groups.length > 0) {
    sections.push(
      renderPowerMenuSection(
        powerMenu,
        openPowerGroupID,
        setOpenPowerGroupID,
        onSelectPower,
      ),
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
        onMouseLeave={() => setOpenPowerGroupID(0)}
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
        {openPowerGroup ? (
          <PowerSubmenu
            group={openPowerGroup}
            side={powerSubmenuSide(point.x)}
            maxHeight={point.maxHeight}
            onSelect={onSelectPower}
          />
        ) : null}
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
  menu: PowerMenu<PowerOption>,
  openGroupID: number,
  setOpenGroupID: (groupID: number) => void,
  onSelect: (power: PowerOption) => void,
) {
  return (
    <div key="powers" className="ws-add-section">
      <div className="ws-add-section-title">能力</div>
      <div className="ws-add-menu-list">
        {menu.basicPowers.map((power) => (
          <PowerMenuItem
            key={power.key || power.id}
            power={power}
            onMouseEnter={() => setOpenGroupID(0)}
            onSelect={onSelect}
          />
        ))}
        {menu.groups.map((group) => (
          <button
            key={group.category.id}
            type="button"
            className={`ws-add-item is-power-group${
              openGroupID === group.category.id ? " is-open" : ""
            }`}
            aria-haspopup="menu"
            aria-expanded={openGroupID === group.category.id}
            onMouseEnter={() => setOpenGroupID(group.category.id)}
            onFocus={() => setOpenGroupID(group.category.id)}
            onClick={() =>
              setOpenGroupID(
                openGroupID === group.category.id ? 0 : group.category.id,
              )
            }
          >
            <span className="ws-add-icon">
              <FolderTree size={16} />
            </span>
            <span className="ws-add-copy">
              <span className="ws-add-label">{group.category.name}</span>
              <span className="ws-add-desc">{group.powers.length} 项能力</span>
            </span>
            <ChevronRight className="ws-add-submenu-arrow" size={15} />
          </button>
        ))}
      </div>
    </div>
  );
}

function PowerSubmenu({
  group,
  side,
  maxHeight,
  onSelect,
}: {
  group: PowerMenuGroup<PowerOption>;
  side: "left" | "right";
  maxHeight: number;
  onSelect: (power: PowerOption) => void;
}) {
  return (
    <aside
      className={`ws-add-submenu-panel is-${side} custom-scrollbar`}
      role="menu"
      aria-label={group.category.name}
      style={{ maxHeight }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="ws-add-submenu-head">
        <FolderTree size={15} />
        <strong>{group.category.name}</strong>
      </div>
      <div className="ws-add-menu-list">
        {group.powers.map((power) => (
          <PowerMenuItem
            key={power.key || power.id}
            power={power}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  );
}

function PowerMenuItem({
  power,
  onMouseEnter,
  onSelect,
}: {
  power: PowerOption;
  onMouseEnter?: () => void;
  onSelect: (power: PowerOption) => void;
}) {
  const description = resolvePowerPresentation(power).kindName;
  return (
    <SpaceTooltip label={`${power.name} · ${description}`}>
      <button
        type="button"
        className="ws-add-item is-power"
        role="menuitem"
        onMouseEnter={onMouseEnter}
        onFocus={onMouseEnter}
        onClick={() => onSelect(power)}
      >
        <span className="ws-add-icon">
          <PowerIcon power={power} size={16} />
        </span>
        <span className="ws-add-copy">
          <span className="ws-add-label">{power.name}</span>
          <span className="ws-add-desc">{description}</span>
        </span>
      </button>
    </SpaceTooltip>
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
          <SpaceTooltip
            key={itemKey(item)}
            label={
              itemDescription
                ? `${label(item)} · ${itemDescription}`
                : label(item)
            }
          >
            <button
              type="button"
              className={`ws-add-item ${className}`.trim()}
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
          </SpaceTooltip>
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
  const width = Math.min(ADD_MENU_WIDTH, window.innerWidth - margin * 2);
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

function powerSubmenuSide(menuX: number): "left" | "right" {
  if (typeof window === "undefined") {
    return "right";
  }
  return menuX + ADD_MENU_WIDTH + POWER_SUBMENU_OUTER_WIDTH > window.innerWidth
    ? "left"
    : "right";
}
