// Google OAuth 2.0 & Auth0 1-Click Login Service for meu.pluggy.ai

const AUTH0_DOMAIN = 'my-pluggy.us.auth0.com';
const AUTH0_CLIENT_ID = 'WzVU7JBRUVdrGbJ5I0z2JqN5IzgwZ33N';
const AUDIENCE = 'https://my-api.pluggy.ai';

// Launch Google OAuth 2.0 Auth0 Login Window / Popup
export function loginWithGooglePluggy() {
  const currentOrigin = window.location.origin + window.location.pathname;
  const state = Math.random().toString(36).substring(2, 15);
  const nonce = Math.random().toString(36).substring(2, 15);

  sessionStorage.setItem('pluggy_oauth_state', state);

  const authUrl = `https://${AUTH0_DOMAIN}/authorize?` + new URLSearchParams({
    client_id: AUTH0_CLIENT_ID,
    response_type: 'token id_token',
    redirect_uri: currentOrigin,
    scope: 'openid profile email',
    audience: AUDIENCE,
    connection: 'google-oauth2',
    state: state,
    nonce: nonce,
    prompt: 'select_account'
  }).toString();

  // Redirect to Google Login
  window.location.href = authUrl;
}

// Check URL Hash for OAuth Response Token on Page Load
export function checkOAuthRedirectToken() {
  if (!window.location.hash) return null;

  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const error = hashParams.get('error_description') || hashParams.get('error');

  if (error) {
    console.warn('OAuth Error:', error);
    // Clear hash
    window.history.replaceState(null, '', window.location.pathname);
    return { error };
  }

  if (accessToken) {
    // Clear hash cleanly from URL bar
    window.history.replaceState(null, '', window.location.pathname);
    return { accessToken };
  }

  return null;
}
