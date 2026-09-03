export function stripHtml(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

export type DriveViewMode = 'grid' | 'list';

export function getGoogleDriveEmbedUrl(url: string, mode: DriveViewMode = 'grid'): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already an embed/preview URL
  if (trimmed.includes('/embeddedfolderview')) {
    const clean = trimmed.replace(/#grid|#list/g, '');
    return mode === 'grid' ? `${clean}#grid` : `${clean}#list`;
  }
  if (trimmed.includes('/preview')) {
    return trimmed;
  }

  // Folder matching: /folders/FOLDER_ID or id=FOLDER_ID
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (folderMatch && (trimmed.includes('folders') || trimmed.includes('drive/folders'))) {
    return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#${mode}`;
  }

  // File matching: /file/d/FILE_ID or /d/FILE_ID or id=FILE_ID
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  // Fallback for general drive IDs
  if (folderMatch) {
    return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#${mode}`;
  }

  return trimmed;
}
