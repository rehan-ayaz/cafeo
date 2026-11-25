import { useState } from 'react';
import { menuItems } from '../menuCatalog';
import { useMenuMotion } from '../hooks/useMenuMotion';
import MenuItemGrid from './MenuItemGrid';

const categories = [...new Set(menuItems.map(item => item.category))];
const featuredItems = categories.map(category => menuItems.find(item => item.category === category));

export function MenuCategories() {
  return <section className="category-section section-bottom-padding-100">
    <div className="container w-container">
      <div className="menu-1-tabs-menu center-menu cafeo-menu-tabs" aria-label="Browse menu categories">
        {categories.map(category => <a key={category} className="menu-1-tab-link w-inline-block w-tab-link"
          href={'/menu?category=' + encodeURIComponent(category)}>{category}</a>)}
      </div>
    </div>
  </section>;
}

export default function MenuShowcase({ featured = false, heading, selection }) {
  const [active, setActive] = useState(0);
  const { grid, selectTab } = useMenuMotion(active, setActive);
  const items = selection ?? (featured ? featuredItems : menuItems.filter(item => item.category === categories[active]));

  return <section className="menu-section section-padding-100">
    <div className="container w-container">
      <div className="section-title center-text">
        <div className="section-pretitle">Cafeo Selection</div>
        <h2 className="section-heading">{heading ?? (featured ? 'Cafeo Favorites' : 'Explore the Cafeo Menu')}</h2>
      </div>
      {!featured && !selection && <div className="menu-1-tabs-menu center-menu cafeo-menu-tabs" aria-label="Filter menu items">
        {categories.map((category, index) => <button type="button" key={category}
          className={'menu-1-tab-link w-tab-link' + (active === index ? ' w--current' : '')}
          aria-pressed={active === index} onClick={() => selectTab(index)}>{category}</button>)}
      </div>}
      <MenuItemGrid items={items} grid={grid} />
      <div className="reservation-btn-block cafeo-section-action">
        <a className="btn-block w-inline-block" href="/menu">View Full Menu</a>
      </div>
    </div>
  </section>;
}
