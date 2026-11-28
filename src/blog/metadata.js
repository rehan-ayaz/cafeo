import { categoryPath, postPath } from './posts';

export const siteOrigin = (import.meta.env.VITE_CAFEO_SITE_ORIGIN || 'https://cafeo-site.vercel.app').replace(/\/$/, '');
const absolute = path => new URL(path, siteOrigin).href;

export function blogMetadata(post, image, missing = false) {
  const title = post ? post.seo + ' | Cafeo' : missing ? 'Article not found | Cafeo' : 'Café Food, Coffee & Dining Guides | Cafeo Blog';
  const description = post?.description || 'Explore the Cafeo blog for practical guides to café food, desserts, coffee, cold drinks and dining with friends.';
  const canonical = missing ? null : absolute(post ? postPath(post) : '/blog');
  const meta = [
    ['name', 'description', description],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:type', post ? 'article' : 'website'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:card', 'summary_large_image'],
  ];
  if (canonical) meta.push(['property', 'og:url', canonical]);
  if (missing) meta.push(['name', 'robots', 'noindex, follow']);
  if (image?.url) meta.push(
    ['property', 'og:image', absolute(image.url)],
    ['property', 'og:image:alt', image.alt],
    ['property', 'og:image:width', String(image.width)],
    ['property', 'og:image:height', String(image.height)],
    ['name', 'twitter:image', absolute(image.url)],
    ['name', 'twitter:image:alt', image.alt],
  );
  let schema = null;
  if (post) {
    meta.push(['property', 'article:published_time', post.published]);
    if (post.updated) meta.push(['property', 'article:modified_time', post.updated]);
    schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting', headline: post.title, description, url: canonical,
          mainEntityOfPage: canonical, datePublished: post.published,
          dateModified: post.updated || post.published, articleSection: post.category,
          author: { '@type': 'Organization', name: 'Cafeo Team' },
          publisher: { '@type': 'Organization', name: 'Cafeo', url: siteOrigin },
          ...(image?.url ? { image: absolute(image.url) } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            ['Home', '/'], ['Blog', '/blog'], [post.category, categoryPath(post)], [post.title, postPath(post)],
          ].map(([name, path], index) => ({
            '@type': 'ListItem', position: index + 1, name, item: absolute(path),
          })),
        },
      ],
    };
  }
  return { title, canonical, meta, schema };
}
