import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Page404 = lazy(() => import('./pages/Page404'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Blog = lazy(() => import('./pages/Blog'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Cart = lazy(() => import('./pages/Cart'));
const Reservations = lazy(() => import('./pages/Reservations'));
const Gallery = lazy(() => import('./pages/Gallery'));
import Home from './pages/Home';
const Menu = lazy(() => import('./pages/Menu'));
const TeamProfile = lazy(() => import('./components/TeamRoster').then(module => ({ default: module.TeamProfile })));
const Team = lazy(() => import('./pages/Team'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#0c0b0b' }} />}>
      <Routes>
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
          <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
}
