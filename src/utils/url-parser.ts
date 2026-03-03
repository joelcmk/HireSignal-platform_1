/**
 * Extracts a readable company name from a URL string.
 */
export function getCompanyNameFromUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    let hostname = url.hostname;
    hostname = hostname.replace(/^(www\.|careers\.|jobs\.)/, '');
    let name = hostname.split('.')[0];
    const commonJobBoards = ['lever', 'greenhouse', 'ashbyhq', 'workable', 'breezy'];
    if (commonJobBoards.includes(name.toLowerCase())) {
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      if (pathParts.length > 0) name = pathParts[0];
    }
    return name.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  } catch (e) {
    return 'Unknown Company';
  }
}

/**
 * Extracts filters from a URL hash.
 * Format: #filter:title=XYZ&location=ABC
 */
export function parseFiltersFromUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    const hash = url.hash;
    if (!hash.startsWith('#filter:')) return { title: null, location: null };
    const params = new URLSearchParams(hash.replace('#filter:', ''));
    return {
      title: params.get('title'),
      location: params.get('location')
    };
  } catch (e) {
    return { title: null, location: null };
  }
}

/**
 * Removes the filter hash from a URL.
 */
export function getCleanUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    url.hash = '';
    return url.toString();
  } catch (e) {
    return urlString;
  }
}

export function getCompanyEmoji(companyName: string): string {
  const name = companyName.toLowerCase();
  if (name.includes('google')) return '🔍';
  if (name.includes('apple')) return '🍎';
  if (name.includes('meta') || name.includes('facebook')) return '👥';
  if (name.includes('amazon')) return '📦';
  if (name.includes('ai')) return '🤖';
  return '🏢';
}

export function getFaviconUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch (e) {
    return '';
  }
}
