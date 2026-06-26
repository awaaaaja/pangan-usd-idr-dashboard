export function formatInteger(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function formatDecimal(
  value: number | null | undefined,
  maximumFractionDigits = 3,
) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(
  value: number | null | undefined,
  maximumFractionDigits = 2,
) {
  if (value === null || value === undefined) return "-";
  return `${formatDecimal(value, maximumFractionDigits)}%`;
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatIsoDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toISOString().slice(0, 10);
}

export function artifactUrl(sourceFile: string) {
  return `/api/research-artifacts/${sourceFile.replace(/^research-artifacts\//, "")}`;
}
