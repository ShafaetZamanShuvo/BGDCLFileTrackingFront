const https = require('https');
const http = require('http');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  const { httpMethod, body, headers } = event;
  
  // Extract the API path from the function path
  const apiPath = event.path.replace('/.netlify/functions/api-proxy', '') || '/';
  const targetUrl = `http://202.5.37.238:50004/api${apiPath}`;

  console.log('Proxying request to:', targetUrl);

  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: httpMethod,
      headers: {
        'Content-Type': headers['content-type'] || 'application/json',
        'User-Agent': 'Netlify-Proxy'
      },
      timeout: 25000
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: {
            'Content-Type': res.headers['content-type'] || 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
          },
          body: responseBody
        });
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      resolve({
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Proxy request failed', 
          details: error.message,
          targetUrl: targetUrl 
        })
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        statusCode: 504,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Request timeout', targetUrl: targetUrl })
      });
    });

    if (body && httpMethod !== 'GET') {
      req.write(body);
    }
    
    req.end();
  });
};