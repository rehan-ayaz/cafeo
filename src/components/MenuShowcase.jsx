import MenuItemGrid from './MenuItemGrid';

export default function MenuShowcase({ heading = 'Explore the Cafeo Menu', selection }) {
  return <section className="menu-section section-padding-100">
    <div className="container w-container">
      <div className="section-title center-text">
        <div className="section-pretitle">Cafeo Selection</div>
        <h2 className="section-heading">{heading}</h2>
      </div>
      <MenuItemGrid items={selection} />
      <div className="reservation-btn-block cafeo-section-action">
        <a className="btn-block w-inline-block" href="/menu">View Full Menu</a>
      </div>
    </div>
  </section>;
}
