import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const workspace = process.cwd();
const output = resolve(workspace, 'dist');
const serverOutput = resolve(workspace, '.cafeo-blog-work/ssr');

await build({ build: { manifest: true }, logLevel: 'warn' });
await build({
  publicDir: false,
  logLevel: 'warn',
  build: {
    ssr: 'src/blog/prerender.jsx',
    outDir: serverOutput,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'prerender.mjs' } },
  },
});
const { blogPaths, renderBlog, siteOrigin } = await import(pathToFileURL(resolve(serverOutput, 'prerender.mjs')));
const manifest = JSON.parse(await readFile(resolve(output, '.vite/manifest.json'), 'utf8'));
const blogCss = manifest['src/pages/Blog.jsx'].css || [];
const shell = await readFile(resolve(output, 'index.html'), 'utf8');
const escape = text => text.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

for (const path of blogPaths) {
  const { html, metadata } = renderBlog(path);
  let document = shell.replace(/<title>[^<]*<\/title>/, '<title>' + escape(metadata.title) + '</title>');
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
