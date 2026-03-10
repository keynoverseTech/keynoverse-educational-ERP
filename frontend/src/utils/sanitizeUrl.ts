export function sanitizeUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  let s = value.trim();
  s = s.replace(/^`+|`+$/g, '');
  s = s.replace(/^"+|"+$/g, '');
  s = s.replace(/^'+|'+$/g, '');
  return s.trim();
}

export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

