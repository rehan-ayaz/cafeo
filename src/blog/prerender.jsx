import { ReservationCartProvider } from '../components/ReservationCart';
import { renderToString } from 'react-dom/server';
import { Routes, Route, StaticRouter } from 'react-router-dom';
import BlogPage from './BlogPage';
import { imagesFor } from './images';
import { blogMetadata, siteOrigin } from './metadata';
import { posts, postPath } from './posts';
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import Menu from '../pages/Menu';
import Gallery from '../pages/Gallery';
import ContactUs from '../pages/ContactUs';
import Reservations from '../pages/Reservations';
import Team from '../pages/Team';
import Checkout from '../pages/Checkout';

export { siteOrigin };
export const blogPaths = ['/blog', ...posts.map(postPath)];

export function renderPage(path, Component) {
  return renderToString(
    <StaticRouter location={path}>
      <ReservationCartProvider>
        <Component />
      </ReservationCartProvider>
    </StaticRouter>
  );
}

export function renderHome() {
  return renderPage('/', Home);
}

export const sitePages = [
  {
    path: '/',
    title: 'Cafeo - Restaurant & Café',
    render: () => renderPage('/', Home),
    preload: '<link rel="preload" href="/assets/images/hero_cafeo_regenerated-night.webp" as="image" type="image/webp" imagesrcset="/assets/images/hero_cafeo_regenerated-night-p-500.webp 500w, /assets/images/hero_cafeo_regenerated-night-p-800.webp 800w, /assets/images/hero_cafeo_regenerated-night.webp 1881w" imagesizes="(max-width: 1919px) 100vw, 1920px" fetchpriority="high"/>',
  },
  {
    path: '/about-us',
    title: 'About Us - Cafeo',
    render: () => renderPage('/about-us', AboutUs),
    preload: '<link rel="preload" href="/assets/images/about_title_coffee_leaf_background.webp" as="image" type="image/webp" fetchpriority="high"/>',
  },
  {
    path: '/menu',
    title: 'Menu - Cafeo',
    render: () => renderPage('/menu', Menu),
    preload: '<link rel="preload" href="/assets/images/menu_title_rosemary_background.webp" as="image" type="image/webp" fetchpriority="high"/>',
  },
  {
    path: '/gallery',
    title: 'Gallery - Cafeo',
    render: () => renderPage('/gallery', Gallery),
    preload: '<link rel="preload" href="/assets/images/gallery-restaurant-interior.webp" as="image" type="image/webp" fetchpriority="high"/>',
  },
  {
    path: '/contact-us',
    title: 'Contact Us - Cafeo',
    render: () => renderPage('/contact-us', ContactUs),
    preload: '<link rel="preload" href="/assets/images/6814ab7c116be14a9b9f6e80_5e203041ac405c8fe66abe099ac1f5b1_single-img-13_002f7f.avif" as="image" type="image/avif" fetchpriority="high"/>',
  },
  {
    path: '/reservations',
    title: 'Table Reservations - Cafeo',
    render: () => renderPage('/reservations', Reservations),
    preload: '',
  },
  {
    path: '/team',
    title: 'Our Team - Cafeo',
    render: () => renderPage('/team', Team),
    preload: '<link rel="preload" href="/assets/images/team-olivia-bennett.webp" as="image" type="image/webp" fetchpriority="high"/>',
  },
  {
    path: '/checkout',
    title: 'Checkout - Cafeo',
    render: () => renderPage('/checkout', Checkout),
    preload: '',
  },
];

export function renderBlog(path) {
  const post = posts.find(item => postPath(item) === path);
  const image = imagesFor(post || posts[0])[0];
  const html = renderToString(
    <StaticRouter location={path}>
      <ReservationCartProvider>
        <Routes>
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
        </Routes>
      </ReservationCartProvider>
    </StaticRouter>
  );
  return { html, metadata: blogMetadata(post, image) };
}
