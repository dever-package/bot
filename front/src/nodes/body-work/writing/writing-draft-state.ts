import type { WritingDocument, WritingUnit } from "./writing-document";

const documentFingerprints = new WeakMap<WritingDocument, string>();

export function writingDocumentFingerprint(document: WritingDocument | null) {
  if (!document) return "null";
  let fingerprint = documentFingerprints.get(document);
  if (fingerprint === undefined) {
    fingerprint = JSON.stringify(document);
    documentFingerprints.set(document, fingerprint);
  }
  return fingerprint;
}

export function writingDraftFingerprint(value: {
  document: WritingDocument | null;
  unit: WritingUnit | null;
}) {
  return `${writingDocumentFingerprint(value.document)}\n${JSON.stringify(value.unit)}`;
}

/** 仅缓存已保存正文版本；未保存草稿仍由 useContentDraft 独占。 */
export function createWritingUnitCache(limit = 20) {
  const versions = new Map<number, WritingUnit>();
  return {
    get(version: number) {
      const unit = versions.get(version);
      if (unit) {
        versions.delete(version);
        versions.set(version, unit);
      }
      return unit;
    },
    delete(version: number) {
      versions.delete(version);
    },
    set(version: number, unit: WritingUnit) {
      versions.delete(version);
      versions.set(version, unit);
      if (versions.size > limit) versions.delete(versions.keys().next().value!);
    },
  };
}

/** 只接收本次保存按提交顺序返回的服务器身份，不覆盖保存期间新输入。 */
export function rememberWritingIdentities(
  submitted: WritingDocument,
  saved: WritingDocument,
  identities: Map<string, string>,
) {
  const groups = (document: WritingDocument) => [
    document.outline.characters,
    document.outline.locations,
    document.outline.props,
    document.units,
  ];
  const accepted = groups(saved);
  groups(submitted).forEach((entries, group) => {
    entries.forEach((entry, index) => {
      if (entry.id.startsWith("new:"))
        identities.set(`${group}:${entry.id}`, accepted[group][index].id);
    });
  });
}

export function resolveWritingIdentities(
  document: WritingDocument,
  identities: ReadonlyMap<string, string>,
): WritingDocument {
  if (!identities.size) return document;
  const resolve = <T extends { id: string }>(entries: T[], group: number) =>
    entries.map((entry) => ({
      ...entry,
      id: identities.get(`${group}:${entry.id}`) || entry.id,
    }));
  return {
    ...document,
    outline: {
      ...document.outline,
      characters: resolve(document.outline.characters, 0),
      locations: resolve(document.outline.locations, 1),
      props: resolve(document.outline.props, 2),
    },
    units: resolve(document.units, 3),
  };
}
