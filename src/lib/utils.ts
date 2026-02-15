export function resolveAsset(path: string): string {
    if (!path) return '';
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    let cleanPath = path.startsWith('/') ? path : `/${path}`;

    // In production, we use .webp versions of images if they are standard image formats
    if (import.meta.env.PROD && (cleanPath.endsWith('.png') || cleanPath.endsWith('.jpg') || cleanPath.endsWith('.jpeg'))) {
        cleanPath = cleanPath.replace(/\.(png|jpg|jpeg)$/, '.webp');
    }

    return `${base}${cleanPath}`;
}
