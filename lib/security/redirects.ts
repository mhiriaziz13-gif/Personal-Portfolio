export function safeRedirectPath(value: unknown, fallback = '/admin') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 300) return fallback;

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//')) return fallback;
  if (decoded.startsWith('/\\') || decoded.includes('\0')) return fallback;
  if (/^[a-z][a-z0-9+.-]*:/i.test(decoded)) return fallback;
  if (decoded.includes('\\')) return fallback;

  return decoded;
}
