import { type ReactNode } from "react";
import { BodyRichTextView, hasBodyRichText } from "./body-rich-text";

export type BodyFilingInfo = {
  content: string;
  companyName: string;
  companyAddress: string;
  businessLicenseURL: string;
  icpRecord: string;
  icpRecordURL: string;
  publicSecurityRecord: string;
  publicSecurityRecordURL: string;
};

export type BodyFilingRow = {
  key: string;
  label: string;
  url?: string;
};

export function BodyFilingContent({
  filing,
  className,
  fallback,
}: {
  filing: BodyFilingInfo;
  className?: string;
  fallback?: ReactNode;
}) {
  return (
    <BodyRichTextView
      value={filing.content}
      className={className}
      fallback={fallback}
    />
  );
}

export function createBodyFilingRows(filing: BodyFilingInfo) {
  const rows: BodyFilingRow[] = [];
  if (filing.businessLicenseURL) {
    rows.push({
      key: "business-license",
      label: "营业执照",
      url: filing.businessLicenseURL,
    });
  }
  if (filing.icpRecord) {
    rows.push({
      key: "icp-record",
      label: filing.icpRecord,
      url: filing.icpRecordURL,
    });
  }
  if (filing.publicSecurityRecord) {
    rows.push({
      key: "public-security-record",
      label: filing.publicSecurityRecord,
      url: filing.publicSecurityRecordURL,
    });
  }
  if (filing.companyName) {
    rows.push({ key: "company-name", label: filing.companyName });
  }
  if (filing.companyAddress) {
    rows.push({ key: "company-address", label: filing.companyAddress });
  }
  return rows;
}

export function BodyFilingFallbackRows({
  filing,
  itemClassName,
}: {
  filing: BodyFilingInfo;
  itemClassName?: string;
}) {
  return createBodyFilingRows(filing).map((row) => (
    <span key={row.key} className={itemClassName}>
      {row.url ? (
        <a href={row.url} target="_blank" rel="noreferrer noopener">
          {row.label}
        </a>
      ) : (
        row.label
      )}
    </span>
  ));
}

export function hasBodyFilingInfo(filing: BodyFilingInfo) {
  return (
    hasBodyFilingRichContent(filing.content) ||
    createBodyFilingRows(filing).length > 0
  );
}

export function hasBodyFilingRichContent(value: unknown) {
  return hasBodyRichText(value);
}
