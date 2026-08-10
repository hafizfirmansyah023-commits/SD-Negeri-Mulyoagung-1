/**
 * Utility functions for CMS module
 */

/**
 * Extracts unique non-empty string values from an array of objects for a given key.
 */
export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values: string[] = [];
  for (const item of items) {
    const val = item[key];
    if (typeof val === 'string' && val.trim().length > 0) {
      if (!values.includes(val)) {
        values.push(val);
      }
    }
  }
  return values;
}

/**
 * Formats date string to ID locale display string or YYYY-MM-DD format
 */
export function formatCmsDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
