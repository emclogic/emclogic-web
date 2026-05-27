const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prepends the site base path to a root-relative URL. */
export function url(path: string): string {
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
}
