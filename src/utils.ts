export function roundMoney(value: number): number {
  // Round to 2 decimals (normal monetary rounding)
  return Math.round(value * 100) / 100;
}

export function truncateTime(value: number): number {
  // Truncate (cut off) to 2 decimals to match common challenge outputs.
  return Math.floor(value * 100) / 100;
}

export function fmtMoney(value: number): string {
  return roundMoney(value).toFixed(2);
}

export function fmtTime(value: number | undefined): string {
  if (value === undefined) return '';
  return truncateTime(value).toFixed(2);
}
