import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { pipeline } from 'node:stream/promises';

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
const textTypes = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.svg']);

function cacheControl(path, extension, status) {
  if (status >= 400) return 'no-store';
  if (extension === '.html') return 'no-cache';
  if (/^\/assets\/[^/]+-[\w-]{8,}\.[a-z0-9]+$/.test(path) ||
    /^\/assets\/css\/site-[a-f0-9]{12}\.css$/.test(path)) return 'public, max-age=31536000, immutable';
  return 'public, max-age=0, must-revalidate';
}

function supportedEncodings(header = '') {
  const preference = new Map(header.toLowerCase().split(',').map(token => {
    const [name, ...params] = token.trim().split(';');
    const quality = params.map(param => param.trim()).find(param => param.startsWith('q='));
    return [name, quality ? Number(quality.slice(2)) : 1];
  }));
  return ['br', 'gzip'].map(name => ({ name, quality: preference.get(name) ?? preference.get('*') ?? 0 }))
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality);
}

function byteRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header ?? '');
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  return start <= end && start < size ? { start, end } : false;
}

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
    let status = 200;
    let info;
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      info = await stat(file);
    } catch {
      if (extname(path) && !path.endsWith('.html')) {
        response.writeHead(404).end('File not found');
        return;
      }
      status = 404;
      file = resolve(directory, '404.html');
      info = await stat(file);
    }

    const extension = extname(file);
    const isVideo = extension === '.mp4' || extension === '.webm';
    const headers = {
      'Content-Type': types[extension] || 'application/octet-stream',
      'Cache-Control': cacheControl(path, extension, status),
      'Last-Modified': info.mtime.toUTCString(),
    };
    const identityTag = `"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`;
    if (textTypes.has(extension)) {
      headers.Vary = 'Accept-Encoding';
      for (const { name } of supportedEncodings(request.headers['accept-encoding'])) {
        const candidate = file + (name === 'br' ? '.br' : '.gz');
        try {
          info = await stat(candidate);
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          continue;
        }
        file = candidate;
        headers['Content-Encoding'] = name;
        break;
      }
    }

    headers.ETag = headers['Content-Encoding']
      ? identityTag.slice(0, -1) + '-' + headers['Content-Encoding'] + '"'
      : identityTag;
    const noneMatch = request.headers['if-none-match'];
    const notModified = noneMatch
      ? noneMatch.split(',').some(tag => ['*', headers.ETag].includes(tag.trim().replace(/^W\//, '')))
      : Date.parse(request.headers['if-modified-since'] || '') >= Date.parse(headers['Last-Modified']);
    if (status === 200 && notModified) {
      response.writeHead(304, headers).end();
      return;
    }

    let range = null;
    if (isVideo) {
      headers['Accept-Ranges'] = 'bytes';
      const ifRange = request.headers['if-range'];
      if (!ifRange || ifRange === headers.ETag || ifRange === headers['Last-Modified']) {
        range = byteRange(request.headers.range, info.size);
      }
      if (range === false) {
        response.writeHead(416, { ...headers, 'Content-Range': `bytes */${info.size}` }).end();
        return;
      }
      if (range) {
        status = 206;
        headers['Content-Range'] = `bytes ${range.start}-${range.end}/${info.size}`;
      }
    }
    headers['Content-Length'] = range ? range.end - range.start + 1 : info.size;
    response.writeHead(status, headers);
    if (request.method === 'HEAD') response.end();
    else await pipeline(createReadStream(file, range || undefined), response);
  } catch {
    if (!response.headersSent) response.writeHead(400).end('Invalid request');
    else response.destroy();
  }
});
server.listen(port, '127.0.0.1', () => console.log('Cafeo is available at http://localhost:' + port));
