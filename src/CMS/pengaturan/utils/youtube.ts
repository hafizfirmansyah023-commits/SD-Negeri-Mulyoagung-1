export const getYoutubeId = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[1].length === 11) ? match[1] : '';
};
