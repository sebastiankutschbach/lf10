export function resolveAsset(path: string): string {
    if (!path) return '';
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
}
