import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const directory = resolve('dist');
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm',
};
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(directory, '.' + path);
    if (file !== directory && !file.startsWith(directory + sep)) {
      response.writeHead(400).end();
      return;
    }
    let code = 200;
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      await stat(file);
    } catch {
      if (extname(path) && !path.endsWith('.html')) {
        response.writeHead(404).end('File not found');
        return;
      }
      code = path.startsWith('/blog/') ? 404 : 200;
      file = resolve(directory, 'index.html');
    }
    const data = await readFile(file);
    response.writeHead(code, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Content-Length': data.length,
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    response.writeHead(400).end('Invalid request');
  }
});
server.listen(port, '127.0.0.1', () => console.log('Cafeo is available at http://localhost:' + port));
