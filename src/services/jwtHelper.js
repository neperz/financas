// Helper to extract Bearer JWT Token from raw text, cURL command, or headers
export function extractBearerToken(input = '') {
  if (!input || typeof input !== 'string') return '';

  const trimmed = input.trim();

  // Pattern 1: Match JWT starting with eyJ (Header: Bearer eyJ...)
  const bearerJwtMatch = /Bearer\s+(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/i.exec(trimmed);
  if (bearerJwtMatch && bearerJwtMatch[1]) {
    return bearerJwtMatch[1];
  }

  // Pattern 2: Direct JWT match starting with eyJ
  const directJwtMatch = /(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/.exec(trimmed);
  if (directJwtMatch && directJwtMatch[1]) {
    return directJwtMatch[1];
  }

  return trimmed;
}

// Decode basic JWT expiration & info
export function parseJwtPayload(token) {
  try {
    const clean = extractBearerToken(token);
    const base64Url = clean.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
