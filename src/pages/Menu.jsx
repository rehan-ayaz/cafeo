import DeferredBackgroundVideo from '../components/DeferredBackgroundVideo';
import NewsletterForm from '../components/NewsletterForm';
import { useSearchParams } from 'react-router-dom';
import FooterCredits from '../components/FooterCredits';
import MobileNavigation from '../components/MobileNavigation';
import { useMenuMotion } from '../hooks/useMenuMotion';
import React, { useState } from 'react';
import { menuItems } from '../menuCatalog';
import { CartLink, useReservationCart } from '../components/ReservationCart';
import MenuItemGrid from '../components/MenuItemGrid';
import { useCafeo } from '../hooks/useCafeo';

const menuTabs = ['All Menu', ...new Set(menuItems.map(item => item.category))];

export default function Menu() {
  const [params] = useSearchParams();
  const cart = useReservationCart();
  const [activeMenuTab, setActiveMenuTab] = useState(() => Math.max(0, menuTabs.indexOf(params.get('category'))));
  const { grid, selectTab } = useMenuMotion(activeMenuTab, setActiveMenuTab);

  useCafeo('680cbd7720425b7f0d7b1084', 'Menu - Cafeo', 'body');

  return (
    <>
      <div className="pages"><section data-wf--header--variant="base" className="header"><div className="header-content-wrapper"><div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav"><div className="container w-container"><div className="site-navigation"><a href="/" className="nav-brand w-nav-brand"><img src="/assets/images/logo.png" loading="lazy" alt="Cafeo" className="brand-logo-image"/></a><div className="menu-main-block"><nav role="navigation" className="nav-menu w-nav-menu"><div className="nav-link-item"><a href="/" className="nav-link w-nav-link"><span className="cafeo-nav-label">Home</span></a></div><div className="nav-link-item"><a href="/about-us" className="nav-link w-nav-link"><span className="cafeo-nav-label">About</span></a></div><div className="nav-link-item"><a href="/menu" aria-current="page" className="nav-link w-nav-link w--current"><span className="cafeo-nav-label">Menu</span></a></div><div className="nav-link-item"><a href="/gallery" className="nav-link w-nav-link"><span className="cafeo-nav-label">Gallery</span></a></div><div className="nav-link-item"><a href="/blog" className="nav-link w-nav-link"><span className="cafeo-nav-label">Blog</span></a></div><div className="nav-link-item"><a href="/contact-us" className="nav-link w-nav-link"><span className="cafeo-nav-label">Contact</span></a></div></nav><div className="header-extra"><CartLink /><div className="header-btn-block"><a href="/reservations" className="btn-block btn-small white-fill-btn w-inline-block"><div className="btn-text">Book now</div><div className="btn-border-block"><div className="border-top btn-border-line-dark"></div><div className="border-right btn-border-line-dark"></div><div className="border-bottom btn-border-line-dark"></div><div className="border-left btn-border-line-dark"></div></div></a></div><MobileNavigation /></div></div></div></div></div></div></section><section className="pagetitle-section" style={{ backgroundImage: 'url(/assets/images/menu_title_rosemary_background.webp)' }}><div className="w-layout-blockcontainer container w-container"><div><div className="page-pretitle-text">Food &amp; Coffee</div><div className="pagetitle-grid"><div className="page-title-block"><h1 className="pagetitle-heading">Explore Our Menu</h1></div><p className="pagetitle-desc">Discover artisan coffee, all-day breakfast, handcrafted mains, and freshly baked desserts prepared with prime ingredients.</p></div></div></div></section>
{/* DATA ARRAYS */}
{(() => {
  const filteredItems = activeMenuTab === 0
    ? menuItems
    : menuItems.filter(item => item.category === menuTabs[activeMenuTab]);

  return (
    <section className="menu-3-section section-padding-100">
      <div className="w-layout-blockcontainer container w-container">
        <div className="menu-heading-wrapper">
          <div className="section-title center-text">
            <div className="section-pretitle">Cafeo Selection</div>
            <h2 className="section-heading">Handcrafted Food &amp; Beverages</h2>
          </div>

          {/* TAB NAVIGATION */}
          <div className="menu-1-tabs w-tabs" style={{ marginTop: '30px', marginBottom: '45px' }}>
            <div className="menu-1-tabs-menu w-tab-menu center-menu cafeo-menu-tabs" role="tablist" aria-label="Website Menu Navigation">
              {menuTabs.map((label, index) => {
                const active = index === activeMenuTab;
                return (
                  <a
                    key={label}
                    id={'cafeo-menu-tab-' + index}
                    href={'#cafeo-menu-panel-' + index}
                    role="tab"
                    aria-controls={'cafeo-menu-panel-' + index}
                    aria-selected={active}
                    tabIndex={active ? 0 : -1}
                    className={active ? 'menu-1-tab-link w-inline-block w-tab-link w--current' : 'menu-1-tab-link w-inline-block w-tab-link'}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={(e) => {
                      e.preventDefault();
                      selectTab(index);
                    }}
                  >
                    <div>{label}</div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="reservation-cart-bar">
            <span role="status">{cart.count} {cart.count === 1 ? 'item' : 'items'} selected</span>
            <a href="/cart" className="btn-block w-inline-block">
              View Cart
            </a>
          </div>

          <MenuItemGrid items={filteredItems} grid={grid} />
        </div>
      </div>
    </section>
  );
})()}

<section className="cta-section section-padding-100"><div data-poster-url="/assets/images/menu-reservation-crostini-poster.webp" data-video-urls="/assets/videos/video_5.mp4,/assets/videos/video_5.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" className="cta-background-video w-background-video w-background-video-atom"><DeferredBackgroundVideo style={{ backgroundImage: 'url(\'/assets/images/menu-reservation-crostini-poster.webp\')' }} id="f5d6235a-81cb-fb6c-2f44-fe45d36cf5f2-video" autoPlay="" loop=""  muted="" playsInline="" data-wf-ignore="true" data-object-fit="cover"><source src="/assets/videos/video_5.mp4" data-wf-ignore="true"/><source src="/assets/videos/video_5.webm" data-wf-ignore="true"/></DeferredBackgroundVideo></div><div className="cta-bg-overlay"></div><div className="cta-section-inner"><div className="w-layout-blockcontainer container w-container"><div data-w-id="486faf7c-b2f3-c6b3-9eb2-18367e297f66" className="cta-content-block"><h2 className="cta-section-heading">A table for your next occasion</h2><div className="cta-btn-block"><a href="/contact-us" className="btn-block btn-large w-inline-block"><div className="btn-text">make a reservation</div><div className="btn-border-block"><div className="border-top btn-border-line-white"></div><div className="border-right btn-border-line-white"></div><div className="border-bottom btn-border-line-white"></div><div className="border-left btn-border-line-white"></div></div></a></div></div></div></div></section><section data-w-id="422c9cb4-a8ce-2882-88f7-efa2c00e4742" className="contact-info-section section-padding-100"><div className="w-layout-blockcontainer container w-container"><div className="reservation-grid center-block"><div className="reservation-1-single-image-block"><img src="/assets/images/menu-contact-artisan-crostini.webp" loading="lazy" sizes="(max-width: 767px) 100vw, (max-width: 991px) 728px, 940px" srcSet="/assets/images/menu-contact-artisan-crostini.webp 961w" alt="Single Image" className="reservation-single-image"/></div><div className="reservation-info-block"><div className="reservation-info-content mtop"><div className="reservation-info-title">Find us</div><div className="reservation-text">20 Cooper Square, New York, NY 10003, USA</div><div><a href="tel:1234567890" className="reservation-info-link">+1 (212) 555-0198</a>, <a href="mailto:info@cafeo.com" className="reservation-info-link">info@cafeo.com</a></div><div className="reservation-info-mtop"><div className="reservation-info-title">Service hours</div><div className="reservation-text">Mon - Fri : 8AM - 9PM</div><div className="reservation-text">Sat - Sun : 8AM - 11PM</div></div><ul role="list" className="social-block w-list-unstyled"><li><a href="https://www.facebook.com/" className="social-link">Fb</a></li><li><a href="https://twitter.com/" target="_blank" className="social-link">Tw</a></li><li><a href="https://in.linkedin.com/" target="_blank" className="social-link">In</a></li><li><a href="https://www.instagram.com/" target="_blank" className="social-link">ig</a></li></ul></div></div></div></div></section><section className="footer"><div className="w-layout-blockcontainer container w-container"><div className="first-footer"><div className="first-footer-flex-box"><a href="/" className="footer-logo-link w-inline-block"><img src="/assets/images/logo.png" loading="lazy" alt="Cafeo" className="footer-logo"/></a><p className="footer-desc">Cafeo is a premier artisan café and restaurant dedicated to exceptional specialty coffee, handcrafted all-day dining, and freshly baked desserts in a warm, welcoming ambiance.</p></div><h2 className="footer-title">Crafting exceptional dining, one cup and dish at a time</h2></div><div className="second-footer"><div className="footer-widget"><h3 className="footer-subtitle">From our kitchen to your inbox</h3><NewsletterForm /></div><div className="footer-info-grid"><div className="footer-widget"><h3 className="footer-info-title">Navigation</h3><ul role="list" className="footer-nav-menu w-list-unstyled"><li><a href="/about-us" className="footer-nav-link">About us</a></li><li><a href="/menu" className="footer-nav-link">Menu</a></li><li><a href="/gallery" className="footer-nav-link">Gallery</a></li><li><a href="/team" className="footer-nav-link">Our team</a></li><li><a href="/contact-us" className="footer-nav-link">Contact us</a></li></ul></div><div className="footer-widget"><h3 className="footer-info-title">Contact us</h3><div><div className="footer-info-text">New York: 20 Cooper Square, New York, NY 10003, USA</div><div className="footer-info-text" style={{ marginTop: '6px' }}>Washington: 70 Washington Square South, Washington DC, 20001, USA</div><div className="footer-contact-link-block"><div><a href="mailto:info@cafeo.com" className="footer-contact-link">info@cafeo.com</a></div></div></div></div><div className="footer-widget"><h3 className="footer-info-title">Opening hours</h3><div className="footer-info-text">Mon - Fri : 8AM - 9PM</div><div className="footer-info-text">Sat - Sun : 8AM - 11PM</div><ul role="list" className="footer-social-list w-list-unstyled"><li><a href="https://www.facebook.com/" target="_blank" className="footer-social-link w-inline-block"><img src="/assets/images/680b662f2073eff5303059eb_fb_2c1d7b.svg" loading="lazy" alt="Image"/></a></li><li><a href="https://twitter.com/" target="_blank" className="footer-social-link w-inline-block"><img src="/assets/images/680b662f62589e2376c164eb_tw_4a1445.svg" loading="lazy" alt="Image"/></a></li><li><a href="https://in.linkedin.com/" target="_blank" className="footer-social-link w-inline-block"><img src="/assets/images/680b663468ad433ffcace482_in_9178f0.svg" loading="lazy" alt="Image"/></a></li><li><a href="https://www.behance.net/" target="_blank" className="footer-social-link w-inline-block"><img src="/assets/images/680b66330b6be243597cfa15_be_37fb15.svg" loading="lazy" alt="Image"/></a></li></ul></div></div></div><FooterCredits /></div><div className="w-embed"><style dangerouslySetInnerHTML={{ __html: "\n.reservation-form input:-webkit-autofill,\n.reservation-form input:-webkit-autofill:hover, \n.reservation-form input:-webkit-autofill:focus, \n.reservation-form input:-webkit-autofill:active,\n.reservation-form input:-internal-autofill-selected {\n  transition: background-color 5000s;\n  background-color: rgba(255, 255, 255, 0.08) !important;\n  -webkit-text-fill-color: #fff !important;\n}\n" }} />

<style dangerouslySetInnerHTML={{ __html: "\n.reservation-1-form input:-webkit-autofill,\n.reservation-1-form input:-webkit-autofill:hover, \n.reservation-1-form input:-webkit-autofill:focus, \n.reservation-1-form input:-webkit-autofill:active,\n.reservation-1-form input:-internal-autofill-selected {\n  transition: background-color 5000s;\n  background-color: transparent !important;\n  -webkit-text-fill-color: #000 !important;\n}\n" }} />

<style dangerouslySetInnerHTML={{ __html: "\n.contact-info-1-form input:-webkit-autofill,\n.contact-info-1-form input:-webkit-autofill:hover, \n.contact-info-1-form input:-webkit-autofill:focus, \n.contact-info-1-form input:-webkit-autofill:active,\n.contact-info-1-form input:-internal-autofill-selected {\n  transition: background-color 5000s;\n  background-color: transparent !important;\n  -webkit-text-fill-color: #000 !important;\n}\n" }} />

<style dangerouslySetInnerHTML={{ __html: "\n.sidebar-form input:-webkit-autofill,\n.sidebar-form input:-webkit-autofill:hover, \n.sidebar-form input:-webkit-autofill:focus, \n.sidebar-form input:-webkit-autofill:active,\n.sidebar-form input:-internal-autofill-selected {\n  transition: background-color 5000s;\n  background-color: transparent !important;\n  -webkit-text-fill-color: #000 !important;\n}\n" }} /></div></section></div>
    </>
  );
}
