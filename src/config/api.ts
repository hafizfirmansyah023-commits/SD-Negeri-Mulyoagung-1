/**
 * Dynamic API Base URL configuration
 * Supports both local development (localhost / XAMPP) and production deployment (sdn1mulyoagung.sch.id).
 */

export const getApiBaseUrl = (): string => {
  // 1. If explicit env variable is defined in Vite (.env / .env.production)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2. Dynamic browser resolution
  if (typeof window !== 'undefined') {
    const { hostname, port, origin } = window.location;

    // Local development environment (Vite dev server on port 3000 / 5173)
    if (port === '3000' || port === '5173') {
      return `http://${hostname}/sd-negeri-mulyoagung-1`;
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return origin;
    }

    // Production environment (sdn1mulyoagung.sch.id or any custom domain)
    if (hostname === 'sdn1mulyoagung.sch.id' || hostname.endsWith('.sch.id')) {
      return origin;
    }

    // Default fallback to window origin
    return origin;
  }

  return 'https://sdn1mulyoagung.sch.id';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Returns full asset image URL handling local backend uploads and absolute URLs
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const base = getApiBaseUrl().replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${base}${path}`;
};
