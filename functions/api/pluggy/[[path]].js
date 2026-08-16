// Cloudflare Pages Function: CORS Proxy for my-api.pluggy.ai

export async function onRequest(context) {
  const { request, params } = context;

  // Handle CORS Preflight OPTIONS Request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, Origin, X-Requested-With',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  try {
    // Extract path and query parameters
    const url = new URL(request.url);
    const targetPath = params.path ? params.path.join('/') : '';
    const targetUrl = `https://my-api.pluggy.ai/${targetPath}${url.search}`;

    // Extract authorization header
    const authHeader = request.headers.get('Authorization') || '';

    // Forward request to Pluggy API
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': authHeader,
        'Origin': 'https://meu.pluggy.ai',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0'
      }
    });

    const body = await response.text();

    // Return response with permissive CORS headers
    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, Origin'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Erro no proxy Open Finance' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
