import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Page401 = lazy(() => import('./pages/Page401'));
const Page404 = lazy(() => import('./pages/Page404'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Blog = lazy(() => import('./pages/Blog'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Cart = lazy(() => import('./pages/Cart'));
const Reservations = lazy(() => import('./pages/Reservations'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Home2 = lazy(() => import('./pages/Home2'));
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const TeamProfile = lazy(() => import('./components/TeamRoster').then(module => ({ default: module.TeamProfile })));
const Team = lazy(() => import('./pages/Team'));
const InfoPagesChangelog = lazy(() => import('./pages/InfoPagesChangelog'));
const InfoPagesLicenses = lazy(() => import('./pages/InfoPagesLicenses'));
const InfoPagesStyleGuide = lazy(() => import('./pages/InfoPagesStyleGuide'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#0c0b0b' }} />}>
      <Routes>
          <Route path="/401" element={<Page401 />} />
          <Route path="/401.html" element={<Page401 />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/404.html" element={<Page404 />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/about-us.html" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog.html" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout.html" element={<Checkout />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/contact-us.html" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations.html" element={<Reservations />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery.html" element={<Gallery />} />
          <Route path="/home-2" element={<Home2 />} />
          <Route path="/home-2.html" element={<Home2 />} />
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu.html" element={<Menu />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team.html" element={<Team />} />
          <Route path="/team/:slug" element={<TeamProfile />} />
          <Route path="/blog/a-complete-guide-to-the-craft-rolling-sushi" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/a-complete-guide-to-the-craft-rolling-sushi.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/a-comprehensive-guide-to-traditional-ingredients" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/a-comprehensive-guide-to-traditional-ingredients.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/an-inspired-to-techniques-and-spirit-of-sushi" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/an-inspired-to-techniques-and-spirit-of-sushi.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/creative-sushi-fusion-recipes-that-redefine-roll" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/creative-sushi-fusion-recipes-that-redefine-roll.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/discovering-perfect-wine-pairings-for-every-types" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/discovering-perfect-wine-pairings-for-every-types.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/exploring-most-delicious-options-for-every-taste" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/exploring-most-delicious-options-for-every-taste.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/exploring-the-cultural-historical-journey-of-sushi" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/exploring-the-cultural-historical-journey-of-sushi.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/how-to-create-tasty-sushi-at-home-with-ease" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/how-to-create-tasty-sushi-at-home-with-ease.html" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/how-to-this-dish-supports-a-healthy-lifestyle" element={<Navigate to="/blog" replace />} />
          <Route path="/blog/how-to-this-dish-supports-a-healthy-lifestyle.html" element={<Navigate to="/blog" replace />} />
          <Route path="/category/maki-rolls" element={<Menu />} />
          <Route path="/category/maki-rolls.html" element={<Menu />} />
          <Route path="/category/nigiri-sushi" element={<Menu />} />
          <Route path="/category/nigiri-sushi.html" element={<Menu />} />
          <Route path="/category/salmon" element={<Menu />} />
          <Route path="/category/salmon.html" element={<Menu />} />
          <Route path="/category/specialty-rolls" element={<Menu />} />
          <Route path="/category/specialty-rolls.html" element={<Menu />} />
          <Route path="/category/sushi-burritos" element={<Menu />} />
          <Route path="/category/sushi-burritos.html" element={<Menu />} />
          <Route path="/category/sushi-tacos" element={<Menu />} />
          <Route path="/category/sushi-tacos.html" element={<Menu />} />
          <Route path="/category/tuna" element={<Menu />} />
          <Route path="/category/tuna.html" element={<Menu />} />
          <Route path="/info-pages/changelog" element={<InfoPagesChangelog />} />
          <Route path="/info-pages/changelog.html" element={<InfoPagesChangelog />} />
          <Route path="/info-pages/licenses" element={<InfoPagesLicenses />} />
          <Route path="/info-pages/licenses.html" element={<InfoPagesLicenses />} />
          <Route path="/info-pages/style-guide" element={<InfoPagesStyleGuide />} />
          <Route path="/info-pages/style-guide.html" element={<InfoPagesStyleGuide />} />
          <Route path="/product/california-roll" element={<Menu />} />
          <Route path="/product/california-roll.html" element={<Menu />} />
          <Route path="/product/cucumber-roll" element={<Menu />} />
          <Route path="/product/cucumber-roll.html" element={<Menu />} />
          <Route path="/product/lobster-tempura-roll" element={<Menu />} />
          <Route path="/product/lobster-tempura-roll.html" element={<Menu />} />
          <Route path="/product/maki-sushi" element={<Menu />} />
          <Route path="/product/maki-sushi.html" element={<Menu />} />
          <Route path="/product/rainbow-roll" element={<Menu />} />
          <Route path="/product/rainbow-roll.html" element={<Menu />} />
          <Route path="/product/salmon-sushi" element={<Menu />} />
          <Route path="/product/salmon-sushi.html" element={<Menu />} />
          <Route path="/product/samurai-roll" element={<Menu />} />
          <Route path="/product/samurai-roll.html" element={<Menu />} />
          <Route path="/product/shrimp-nigiri" element={<Menu />} />
          <Route path="/product/shrimp-nigiri.html" element={<Menu />} />
          <Route path="/product/spicy-tuna-roll" element={<Menu />} />
          <Route path="/product/spicy-tuna-roll.html" element={<Menu />} />
          <Route path="/product/tuna-maguro" element={<Menu />} />
          <Route path="/product/tuna-maguro.html" element={<Menu />} />
          <Route path="/product/unagi" element={<Menu />} />
          <Route path="/product/unagi.html" element={<Menu />} />
          <Route path="/product/yellowtail-sashimi" element={<Menu />} />
          <Route path="/product/yellowtail-sashimi.html" element={<Menu />} />
          <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
}
