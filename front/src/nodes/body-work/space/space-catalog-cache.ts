import type { PowerForm, PowerKindOption, PowerOption } from "./types";

export type PowerCatalog = {
  powers: PowerOption[];
  powerKinds: PowerKindOption[];
};

type CatalogEntry = {
  value?: PowerCatalog;
  loadedAt: number;
  inFlight?: Promise<PowerCatalog>;
};

type PowerFormEntry = {
  value?: PowerForm;
  inFlight?: Promise<PowerForm>;
};

const CATALOG_TTL = 60_000;
const MAX_POWER_FORMS = 60;

export class SpaceCatalogCache {
  private scopeKey = "";
  private catalogs = new Map<string, CatalogEntry>();
  private powerForms = new Map<string, PowerFormEntry>();

  setScope(projectId: number, releaseId: number) {
    const nextScope = scopeCacheKey(projectId, releaseId);
    if (this.scopeKey === nextScope) {
      return;
    }
    this.scopeKey = nextScope;
    this.catalogs.clear();
    this.powerForms.clear();
  }

  primeCatalog(projectId: number, releaseId: number, value: PowerCatalog) {
    this.setScope(projectId, releaseId);
    this.catalogs.set(this.scopeKey, {
      value,
      loadedAt: Date.now(),
    });
  }

  loadCatalog(
    projectId: number,
    releaseId: number,
    loader: () => Promise<PowerCatalog>,
    force = false,
  ) {
    this.setScope(projectId, releaseId);
    const scopeKey = this.scopeKey;
    const current = this.catalogs.get(scopeKey) || { loadedAt: 0 };
    if (
      !force &&
      current.value &&
      Date.now() - current.loadedAt < CATALOG_TTL
    ) {
      return Promise.resolve(current.value);
    }
    if (current.inFlight) {
      return current.inFlight;
    }
    const inFlight = loader()
      .then((value) => {
        if (this.scopeKey === scopeKey) {
          this.catalogs.set(scopeKey, { value, loadedAt: Date.now() });
        }
        return value;
      })
      .catch((error) => {
        if (this.scopeKey === scopeKey) {
          this.catalogs.set(scopeKey, {
            value: current.value,
            loadedAt: current.loadedAt,
          });
        }
        throw error;
      });
    this.catalogs.set(scopeKey, { ...current, inFlight });
    return inFlight;
  }

  loadPowerForm(
    input: {
      projectId: number;
      releaseId: number;
      flowId: number;
      powerId: number;
      powerKey: string;
      targetId: number;
    },
    loader: () => Promise<PowerForm>,
  ) {
    this.setScope(input.projectId, input.releaseId);
    const scopeKey = this.scopeKey;
    const key = powerFormCacheKey(input);
    const current = this.powerForms.get(key);
    if (current?.value) {
      this.touchPowerForm(key, current);
      return Promise.resolve(current.value);
    }
    if (current?.inFlight) {
      return current.inFlight;
    }
    const inFlight = loader()
      .then((value) => {
        if (this.scopeKey === scopeKey) {
          this.touchPowerForm(key, { value });
          this.trimPowerForms();
        }
        return value;
      })
      .catch((error) => {
        if (this.scopeKey === scopeKey) {
          this.powerForms.delete(key);
        }
        throw error;
      });
    this.touchPowerForm(key, { inFlight });
    this.trimPowerForms();
    return inFlight;
  }

  private touchPowerForm(key: string, entry: PowerFormEntry) {
    this.powerForms.delete(key);
    this.powerForms.set(key, entry);
  }

  private trimPowerForms() {
    while (this.powerForms.size > MAX_POWER_FORMS) {
      const oldestKey = this.powerForms.keys().next().value;
      if (!oldestKey) {
        return;
      }
      this.powerForms.delete(oldestKey);
    }
  }
}

function scopeCacheKey(projectId: number, releaseId: number) {
  return `${projectId || 0}:${releaseId || 0}`;
}

function powerFormCacheKey(input: {
  projectId: number;
  releaseId: number;
  flowId: number;
  powerId: number;
  powerKey: string;
  targetId: number;
}) {
  return [
    input.projectId || 0,
    input.releaseId || 0,
    input.flowId || 0,
    input.powerId || 0,
    input.powerKey || "",
    input.targetId || 0,
  ].join(":");
}
