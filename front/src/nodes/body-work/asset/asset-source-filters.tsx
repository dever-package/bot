import { ArchiveRestore, ArrowLeft, FolderOpen, Images } from "lucide-react";
import type { ReactNode } from "react";
import type {
  AssetFilterOptions,
  AssetFilters,
  AssetKind,
  AssetRole,
  AssetSourceType,
  AssetView,
} from "./asset-types";
import {
  assetKindSpecs,
  assetRoleSpecs,
  assetSourceSpecs,
  type AssetSourceLabels,
} from "./asset-contract";
import {
  defaultOfficialAssetKind,
  officialCategoriesForKind,
} from "./official-material";

const roleOptions: Array<{ key: "" | AssetRole; label: string }> = [
  { key: "", label: "全部" },
  ...assetRoleSpecs,
];

const kindOptions: Array<{ key: "" | AssetKind; label: string }> = [
  { key: "", label: "全部" },
  ...assetKindSpecs,
];

export function AssetSourceFilters({
  filters,
  options,
  scopeProjectID = 0,
  sourceLabels = {},
  allowedKinds = [],
  includeOfficial = true,
  view,
  collectionName,
  onCollectionBack,
  onChange,
  onViewChange,
}: {
  filters: AssetFilters;
  options: AssetFilterOptions;
  scopeProjectID?: number;
  sourceLabels?: AssetSourceLabels;
  allowedKinds?: AssetKind[];
  includeOfficial?: boolean;
  view: AssetView;
  collectionName?: string;
  onCollectionBack?: () => void;
  onChange: (filters: AssetFilters) => void;
  onViewChange: (view: AssetView) => void;
}) {
  const sourceOptions: Array<{ key: "" | AssetSourceType; label: string }> = [
    { key: "", label: "全部" },
    ...assetSourceSpecs
      .filter(
        (option) =>
          option.key !== "official" ||
          (includeOfficial &&
            options.materialLibrary.enabled &&
            Boolean(
              defaultOfficialAssetKind(options.materialLibrary, allowedKinds),
            )),
      )
      .map((option) => ({
        ...option,
        label: sourceLabels[option.key] || option.label,
      })),
  ];
  const hasAssetCates = options.assetCates.length > 0;
  const projectID = scopeProjectID || filters.projectID;
  const visibleCanvases = options.canvases.filter(
    (canvas) =>
      (!projectID || canvas.projectID === projectID) &&
      (!filters.assetCateID || canvas.assetCateID === filters.assetCateID),
  );
  const visibleKindOptions =
    filters.sourceType === "official"
      ? options.materialLibrary.kinds
          .filter(
            (option) =>
              allowedKinds.length === 0 ||
              allowedKinds.includes(option.assetKind),
          )
          .map((option) => ({ key: option.assetKind, label: option.name }))
      : allowedKinds.length > 0
        ? kindOptions.filter(
            (option) => option.key && allowedKinds.includes(option.key),
          )
        : kindOptions;
  const officialCategories = officialCategoriesForKind(
    options.materialLibrary,
    filters.kind,
  );
  function selectSource(sourceType: "" | AssetSourceType) {
    const projectID = sourceType === "project" ? scopeProjectID : 0;
    const officialKind =
      sourceType === "official"
        ? defaultOfficialAssetKind(options.materialLibrary, allowedKinds)
        : "";
    const kind =
      sourceType === "official"
        ? officialKind
        : filters.sourceType === "official"
          ? allowedKinds.length === 1
            ? allowedKinds[0]
            : ""
          : filters.kind;
    onChange({
      ...filters,
      sourceType,
      sourceID: projectID,
      projectID,
      assetCateID: 0,
      canvasID: sourceType === "project" ? filters.canvasID : 0,
      materialCateID: 0,
      nodeKey: "",
      role: "",
      kind,
    });
  }

  return (
    <div className="wb-asset-filters">
      {collectionName && onCollectionBack ? (
        <FilterRow label="集合">
          <button
            type="button"
            className="wb-asset-collection-back"
            onClick={onCollectionBack}
          >
            <ArrowLeft aria-hidden="true" />
            <FolderOpen aria-hidden="true" />
            <span>{collectionName}</span>
          </button>
        </FilterRow>
      ) : (
        <FilterRow label="来源">
          <SegmentedOptions
            options={sourceOptions}
            value={filters.sourceType}
            onChange={selectSource}
          />
          {filters.sourceType === "project" ? (
            <>
              {scopeProjectID > 0 ? null : (
                <FilterSelect
                  label={sourceLabels.project || "创作"}
                  value={filters.projectID}
                  options={options.projects}
                  onChange={(projectID) =>
                    onChange({
                      ...filters,
                      projectID,
                      sourceID: projectID,
                      canvasID: 0,
                      assetCateID: 0,
                      nodeKey: "",
                    })
                  }
                />
              )}
              {hasAssetCates ? (
                <FilterSelect
                  label="资产分类"
                  value={filters.assetCateID}
                  options={options.assetCates}
                  onChange={(assetCateID) =>
                    onChange({
                      ...filters,
                      assetCateID,
                      canvasID: 0,
                      nodeKey: "",
                    })
                  }
                />
              ) : null}
            </>
          ) : null}
          {filters.sourceType === "project" &&
          projectID > 0 &&
          visibleCanvases.length > 1 ? (
            <FilterSelect
              label="画布"
              value={filters.canvasID}
              options={visibleCanvases}
              onChange={(canvasID) => onChange({ ...filters, canvasID })}
            />
          ) : null}
          {filters.sourceType === "tool" ? (
            <FilterSelect
              label={sourceLabels.tool || "工具"}
              value={filters.sourceID}
              options={options.tools}
              onChange={(sourceID) => onChange({ ...filters, sourceID })}
            />
          ) : null}
          {filters.sourceType === "dialogue" ? (
            <FilterSelect
              label="角色"
              value={filters.sourceID}
              options={options.dialogues}
              onChange={(sourceID) => onChange({ ...filters, sourceID })}
            />
          ) : null}
        </FilterRow>
      )}

      {!collectionName && filters.sourceType === "project" && hasAssetCates ? (
        <FilterRow label="资产">
          <SegmentedOptions
            options={roleOptions}
            value={filters.role}
            onChange={(role) => onChange({ ...filters, role })}
          />
        </FilterRow>
      ) : null}

      <FilterRow
        label="类型"
        trailing={
          filters.sourceType === "official" ? undefined : (
            <AssetViewSwitch view={view} onChange={onViewChange} />
          )
        }
      >
        <SegmentedOptions
          options={visibleKindOptions}
          value={filters.kind}
          onChange={(kind) =>
            onChange({
              ...filters,
              kind,
              materialCateID:
                filters.sourceType === "official" ? 0 : filters.materialCateID,
            })
          }
        />
      </FilterRow>
      {filters.sourceType === "official" && officialCategories.length > 0 ? (
        <FilterRow label="分类">
          <SegmentedOptions
            options={[
              { key: 0, label: "全部" },
              ...officialCategories.map((category) => ({
                key: category.id,
                label: category.name,
              })),
            ]}
            value={filters.materialCateID}
            onChange={(materialCateID) =>
              onChange({ ...filters, materialCateID })
            }
          />
        </FilterRow>
      ) : null}
    </div>
  );
}

function FilterRow({
  label,
  children,
  trailing,
}: {
  label: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="wb-asset-filter-row">
      <strong>{label}</strong>
      <div className="wb-asset-filter-controls">
        {children}
        {trailing}
      </div>
    </div>
  );
}

function AssetViewSwitch({
  view,
  onChange,
}: {
  view: AssetView;
  onChange: (view: AssetView) => void;
}) {
  return (
    <div className="wb-asset-view-switch" role="tablist" aria-label="资产视图">
      <button
        type="button"
        role="tab"
        aria-selected={view === "assets"}
        className={view === "assets" ? "is-active" : ""}
        onClick={() => onChange("assets")}
      >
        <Images aria-hidden="true" />
        <span>资产</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === "trash"}
        className={view === "trash" ? "is-active" : ""}
        onClick={() => onChange("trash")}
      >
        <ArchiveRestore aria-hidden="true" />
        <span>回收站</span>
      </button>
    </div>
  );
}

function SegmentedOptions<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: Array<{ key: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="wb-asset-segments">
      {options.map((option) => (
        <button
          key={option.key || "all"}
          type="button"
          className={value === option.key ? "is-active" : ""}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: Array<{ id: number; name: string }>;
  onChange: (value: number) => void;
}) {
  return (
    <label className="wb-asset-select">
      <span className="sr-only">{label}</span>
      <select
        value={value || ""}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        <option value="">全部{label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
