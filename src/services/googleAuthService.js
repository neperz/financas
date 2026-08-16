// Google OAuth 2.0 & Auth0 Service for meu.pluggy.ai

const AUTH0_DOMAIN = 'my-pluggy.us.auth0.com';
const AUTH0_CLIENT_ID = 'WzVU7JBRUVdrGbJ5I0z2JqN5IzgwZ33N';
const AUDIENCE = 'https://my-api.pluggy.ai';
const PLUGGY_OFFICIAL_CALLBACK = 'https://meu.pluggy.ai/';

// Open Google Login Popup or Tab for meu.pluggy.ai
export function loginWithGooglePluggy() {
  const state = Math.random().toString(36).substring(2, 15);
  const nonce = Math.random().toString(36).substring(2, 15);

  const authUrl = `https://${AUTH0_DOMAIN}/authorize?` + new URLSearchParams({
    client_id: AUTH0_CLIENT_ID,
    response_type: 'token id_token',
    redirect_uri: PLUGGY_OFFICIAL_CALLBACK,
    scope: 'openid profile email',
    audience: AUDIENCE,
    connection: 'google-oauth2',
    state: state,
    nonce: nonce,
    prompt: 'select_account'
  }).toString();

  // Open popup window or open in new tab
  const width = 500;
  const height = 650;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    authUrl,
    'GooglePluggyAuth',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // If popup blocked, open in new tab
    window.open(authUrl, '_blank');
  }

  return popup;
}
