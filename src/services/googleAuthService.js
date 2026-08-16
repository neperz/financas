// Google OAuth 2.0 & Auth0 Service for meu.pluggy.ai

const PLUGGY_DIRECT_LOGIN_URL = 'https://meu.pluggy.ai/api/auth/login?connection=google-oauth2';

// Open Native Google Login Window / Tab for meu.pluggy.ai
export function loginWithGooglePluggy() {
  const width = 540;
  const height = 680;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    PLUGGY_DIRECT_LOGIN_URL,
    'GooglePluggyAuth',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // Fallback: open in new tab if popup is blocked
    window.open('https://meu.pluggy.ai/', '_blank');
  }

  return popup;
}
