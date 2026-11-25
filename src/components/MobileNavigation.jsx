import { useEffect, useId, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './mobile-navigation.css';

const links = [
  ['/', 'Home'],
  ['/about-us', 'About'],
  ['/menu', 'Menu'],
  ['/gallery', 'Gallery'],
  ['/blog', 'Blog'],
  ['/contact-us', 'Contact'],
];

export default function MobileNavigation() {
  const dialog = useRef(null);
  const dialogId = useId();
  const { pathname } = useLocation();

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 991px)');
    const closeOnDesktop = () => {
      if (!mobile.matches && dialog.current.open) dialog.current.close();
    };
    mobile.addEventListener('change', closeOnDesktop);
    return () => mobile.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (dialog.current.open) dialog.current.close();
  }, [pathname]);

  const close = () => dialog.current.close();

  return <>
    <button type="button" className="cafeo-mobile-nav-trigger" aria-label="Open navigation"
      aria-haspopup="dialog" aria-controls={dialogId} onClick={() => dialog.current.showModal()}>
      <span /><span /><span />
    </button>
    <dialog ref={dialog} id={dialogId} className="cafeo-mobile-nav" aria-label="Site navigation">
      <div className="cafeo-mobile-nav-content">
        <button type="button" className="cafeo-mobile-nav-close" aria-label="Close navigation"
          autoFocus onClick={close}><span /></button>
        <nav aria-label="Main navigation">
          <ul>
            {links.map(([to, label], index) => <li key={to} style={{ '--nav-index': index }}>
              <NavLink to={to} end={to === '/'} onClick={close}><span className="cafeo-nav-label">{label}</span></NavLink>
            </li>)}
          </ul>
        </nav>
        <NavLink to="/reservations" className="btn-block white-fill-btn cafeo-mobile-nav-book" onClick={close}>Book now</NavLink>
      </div>
    </dialog>
  </>;
}
