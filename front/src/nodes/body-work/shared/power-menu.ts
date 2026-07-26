export const POWER_CATEGORY_TYPE_BASIC = 1;
export const POWER_CATEGORY_TYPE_GROUP = 2;

export type PowerCategory = {
  id: number;
  name: string;
  type: number;
  status: number;
  sort: number;
};

export type PowerMenuGroup<T> = {
  category: PowerCategory;
  powers: T[];
};

export type PowerMenu<T> = {
  basicPowers: T[];
  groups: PowerMenuGroup<T>[];
};

export function normalizePowerCategory(value: unknown): PowerCategory {
  const category = isRecord(value) ? value : {};
  return {
    id: numberValue(category.id),
    name: textValue(category.name || category.value) || "未命名分组",
    type:
      numberValue(category.type) === POWER_CATEGORY_TYPE_GROUP
        ? POWER_CATEGORY_TYPE_GROUP
        : POWER_CATEGORY_TYPE_BASIC,
    status: numberValue(category.status) === 2 ? 2 : 1,
    sort: numberValue(category.sort, 100),
  };
}

export function buildPowerMenu<T>(
  powers: T[],
  categories: PowerCategory[],
  categoryID: (power: T) => number,
): PowerMenu<T> {
  const categoryByID = new Map(
    categories
      .filter((category) => category.id > 0)
      .map((category) => [category.id, category]),
  );
  const powersByGroupID = new Map<number, T[]>();
  const basicPowers: T[] = [];

  for (const power of powers) {
    const category = categoryByID.get(categoryID(power));
    if (
      category?.status !== 2 &&
      category?.type === POWER_CATEGORY_TYPE_GROUP
    ) {
      const groupedPowers = powersByGroupID.get(category.id) || [];
      groupedPowers.push(power);
      powersByGroupID.set(category.id, groupedPowers);
      continue;
    }
    basicPowers.push(power);
  }

  const groups = categories
    .filter(
      (category) =>
        category.status !== 2 &&
        category.type === POWER_CATEGORY_TYPE_GROUP &&
        (powersByGroupID.get(category.id)?.length || 0) > 0,
    )
    .sort((left, right) => left.sort - right.sort || left.id - right.id)
    .map((category) => ({
      category,
      powers: powersByGroupID.get(category.id) || [],
    }));

  return { basicPowers, groups };
}

export function flattenPowerMenu<T>(menu: PowerMenu<T>): T[] {
  return [
    ...menu.basicPowers,
    ...menu.groups.flatMap((group) => group.powers),
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
