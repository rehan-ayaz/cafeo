import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle page title, route animations, and client-side navigation.
 * Designed for Cafeo website.
 */
export function useCafeo(pageId, title, bodyClass = 'body') {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (pageId) {
      document.documentElement.setAttribute('data-wf-page', pageId);
    }
    document.body.className = bodyClass || 'body';
    window.scrollTo(0, 0);

    // Remove any third-party badge elements from DOM
    document.querySelectorAll('.w-webflow-badge, .w-cafeo-badge, a[href*="webflow.com"]').forEach(el => el.remove());

    const refreshEngine = () => {
      document.querySelectorAll('.w-webflow-badge, .w-cafeo-badge, a[href*="webflow.com"]').forEach(el => el.remove());

      const engine = window.Cafeo || window.Webflow;
      if (engine) {
        try {
          engine.destroy();
          engine.ready();
          const ix2 = engine.require('ix2');
          if (ix2 && ix2.init) {
            ix2.init();
          }

          // Trigger animation lifecycle events on route change
          document.dispatchEvent(new CustomEvent('IX2_PAGE_UPDATE'));
          document.dispatchEvent(new Event('readystatechange'));
          window.dispatchEvent(new Event('load'));
          window.dispatchEvent(new Event('resize'));
          window.dispatchEvent(new Event('scroll'));
        } catch {
          // Suppressed for clean console output
        }
      }
    };

    const timer = setTimeout(refreshEngine, 100);
    window.addEventListener('cafeo:ready', refreshEngine, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('cafeo:ready', refreshEngine);
    };
  }, [location.pathname, pageId, title, bodyClass]);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        a.getAttribute('target') === '_blank'
      ) {
        return;
      }

      e.preventDefault();
      let to = href;
      if (to.endsWith('.html')) to = '/' + to.replace(/\.html$/, '');
      if (to === '/index') to = '/';
      if (!to.startsWith('/')) to = '/' + to;
      navigate(to);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [navigate]);
}

// Backward-compatibility alias
export const useWebflow = useCafeo;
export default useCafeo;
