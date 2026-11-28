import { build, transformWithEsbuild } from 'vite';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, mkdtemp, rm, readdir } from 'node:fs/promises';
import { join, resolve, dirname, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { brotliCompress, constants, gzip } from 'node:zlib';
import { promisify } from 'node:util';

const workspace = process.cwd();
const output = resolve(workspace, 'dist');
await build({ build: { manifest: true }, logLevel: 'warn' });
const serverOutput = await mkdtemp(join(workspace, '.cafeo-build-'));
let prerender;
try {
  await build({
    publicDir: false,
    logLevel: 'warn',
    build: {
      ssr: 'src/blog/prerender.jsx',
      outDir: serverOutput,
      rollupOptions: { output: { entryFileNames: 'prerender.mjs' } },
    },
  });
  prerender = await import(pathToFileURL(join(serverOutput, 'prerender.mjs')));
} finally {
  if (dirname(resolve(serverOutput)) === workspace) {
    await rm(serverOutput, { recursive: true, force: true });
  }
}
const { blogPaths, renderBlog, sitePages, siteOrigin } = prerender;
const manifest = JSON.parse(await readFile(resolve(output, '.vite/manifest.json'), 'utf8'));
const blogCss = manifest['src/pages/Blog.jsx'].css || [];
const indexPath = join(output, 'index.html');
let shell = await readFile(indexPath, 'utf8');
const sharedStyles = ['fonts.css', 'cafeo.css', 'site-consistency.css'];
const cssDirectory = join(output, 'assets', 'css');
const sharedCss = await Promise.all(sharedStyles.map(file => readFile(join(cssDirectory, file), 'utf8')));
const { code: bundledCss } = await transformWithEsbuild(sharedCss.join('\n'), 'shared.css', {
  loader: 'css', minifyWhitespace: true, minifyIdentifiers: false, minifySyntax: false,
});
const cssHash = createHash('sha256').update(bundledCss).digest('hex').slice(0, 12);
const cssFile = `site-${cssHash}.css`;
await writeFile(join(cssDirectory, cssFile), bundledCss);
let styleCount = 0;
shell = shell.replace(/<link\b[^>]*href="\/assets\/css\/(?:fonts|cafeo|site-consistency)\.css"[^>]*>/g, () =>
  styleCount++ === 0 ? `<link rel="stylesheet" href="/assets/css/${cssFile}"/>` : '');
if (styleCount !== sharedStyles.length) throw new Error('Expected three shared stylesheets in the site shell');

const escape = text => text.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

for (const page of sitePages) {
  const html = page.render();
  let document = shell.replace(/<title>[^<]*<\/title>/, '<title>' + escape(page.title) + '</title>');
  document = document.replace('<!-- PAGE_PRELOAD -->', page.preload || '');
  document = document.replace('<div id="root"></div>', '<div id="root">' + html + '</div>');
  if (page.path === '/') {
    await writeFile(indexPath, document);
  } else {
    const pageDir = resolve(output, page.path.slice(1));
    await mkdir(pageDir, { recursive: true });
    await writeFile(resolve(pageDir, 'index.html'), document);
    await writeFile(resolve(output, page.path.slice(1) + '.html'), document);
  }
}

for (const path of blogPaths) {
  const { html, metadata } = renderBlog(path);
  let document = shell.replace(/<title>[^<]*<\/title>/, '<title>' + escape(metadata.title) + '</title>')
    .replace('<!-- PAGE_PRELOAD -->', '');
  const originals = [];
  for (const [attribute, key] of metadata.meta) {
    const pattern = new RegExp('<meta(?=[^>]*\\b' + attribute + '="' + key + '")[^>]*>', 'g');
    document = document.replace(pattern, original => {
      originals.push(original);
      return '';
    });
  }
  const head = [
    ...metadata.meta.map(([attribute, key, content]) =>
      '<meta data-cafeo-blog ' + attribute + '="' + key + '" content="' + escape(content) + '">'),
    '<link data-cafeo-blog rel="canonical" href="' + escape(metadata.canonical) + '">',
    ...blogCss.map(file => '<link rel="stylesheet" href="/' + file + '">'),
    ...(metadata.schema ? ['<script data-cafeo-blog type="application/ld+json">' +
      JSON.stringify(metadata.schema).replace(/</g, '\\u003c') + '</script>'] : []),
    '<script id="cafeo-original-head" type="application/json">' +
    JSON.stringify(originals.join('')).replace(/</g, '\\u003c') + '</script>',
  ].join('\n');
  document = document.replace('</head>', head + '\n</head>');
  document = document.replace('<div id="root"></div>', '<div id="root">' + html + '</div>');
  const directory = resolve(output, path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), document);
  if (path === '/blog') await writeFile(resolve(output, 'blog.html'), document);
}
const urls = blogPaths.map(path => '<url><loc>' + escape(siteOrigin + path) + '</loc></url>');
await writeFile(resolve(output, 'blog-sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join('') + '</urlset>\n');
try {
  await readFile(resolve(output, 'robots.txt'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  await writeFile(resolve(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + siteOrigin + '/blog-sitemap.xml\n');
}
console.log('Built and prerendered ' + blogPaths.length + ' blog pages.');

const compressible = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml']);
const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);
const entries = await readdir(output, { recursive: true, withFileTypes: true });
const textFiles = entries.filter(entry => entry.isFile() && compressible.has(extname(entry.name)));
// Limit concurrent compression jobs so production builds keep memory bounded.
for (let start = 0; start < textFiles.length; start += 4) {
  await Promise.all(textFiles.slice(start, start + 4).map(async entry => {
    const file = join(entry.parentPath ?? entry.path, entry.name);
    const raw = await readFile(file);
    if (raw.length < 1024) return;
    const [br, gz] = await Promise.all([
      brotliAsync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }), gzipAsync(raw),
    ]);
    if (br.length < raw.length) await writeFile(file + '.br', br);
    if (gz.length < raw.length) await writeFile(file + '.gz', gz);
  }));
}
