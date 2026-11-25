import { ReservationCartProvider } from '../components/ReservationCart';
import { renderToString } from 'react-dom/server';
import { Routes, Route, StaticRouter } from 'react-router-dom';
import BlogPage from './BlogPage';
import { imagesFor } from './images';
import { blogMetadata, siteOrigin } from './metadata';
import { posts, postPath } from './posts';

export { siteOrigin };
export const blogPaths = ['/blog', ...posts.map(postPath)];

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
