export function cleanString(value: unknown, max: number, required = true) {
  const cleaned = typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
  if (required && !cleaned) throw new Error('Missing required text.');
  return cleaned;
}

export function cleanLongText(value: unknown, max: number, required = true) {
  const cleaned = typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim().slice(0, max) : '';
  if (required && !cleaned) throw new Error('Missing required text.');
  return cleaned;
}

export function cleanUrl(value: unknown, max = 500, required = true) {
  const cleaned = cleanString(value, max, required);
  if (!cleaned) return cleaned;
  if (cleaned.startsWith('/')) {
    if (cleaned.startsWith('//') || cleaned.includes('\\')) throw new Error('Invalid URL.');
    return cleaned;
  }
  const url = new URL(cleaned);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid URL.');
  return url.toString();
}

export function stringArray(value: unknown, maxItems: number, itemMax = 160) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => cleanString(item, itemMax, false)).filter(Boolean);
}

export function jsonObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function uuid(value: unknown) {
  const cleaned = cleanString(value, 40);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleaned)) {
    throw new Error('Invalid identifier.');
  }
  return cleaned;
}

export function numberOrder(value: unknown) {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return 100;
  return Math.max(1, Math.min(10000, Math.round(number)));
}

export function email(value: unknown) {
  const cleaned = cleanString(value, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) throw new Error('Invalid email address.');
  return cleaned;
}
