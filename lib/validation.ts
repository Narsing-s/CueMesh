export function cleanText(value: unknown, max = 5000): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length && text.length <= max ? text : null;
}
export function safeDate(value: unknown): Date | null {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
