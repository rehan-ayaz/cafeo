import { memo, useId, useLayoutEffect, useRef, useState } from 'react';
import { Quantity, useReservationCart } from './ReservationCart';
import '../pages/menu-preview.css';

function MenuItemActions({ item, quantity, onChange }) {
  return <div className="menu-item-actions">
    <Quantity item={item} quantity={quantity} onChange={onChange} />
    {quantity > 0 && <a href="/cart" className="menu-cart-link reservation-add-button menu-view-cart">View Cart</a>}
  </div>;
}

const MenuItemCard = memo(function MenuItemCard({ item, index = 0, quantity, onChange, onPreview }) {
  return (
    <div data-menu-item={item.image} role="listitem" className="w-dyn-item">
      <div
        style={{ backgroundColor: 'rgb(255,247,239)', borderColor: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        className="menu-item-block"
      >
        <div className="menu-content-block">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#c32929', fontWeight: 600, marginBottom: '6px' }}>
            {item.subcategory}
          </div>
          <a href={item.link} className="menu-item-link menu-short-title" title={item.title}>{item.menuTitle}</a>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '6px', marginBottom: '14px', lineHeight: '1.45' }}>
            {item.desc}
          </div>
          <div className="menu-price-box">
            <MenuItemActions item={item} quantity={quantity} onChange={onChange} />
            <div>
              <div className="menu-price-text">{item.price}</div>
            </div>
          </div>
        </div>
        <div className="menu-thumbnail">
          <button type="button" className="menu-preview-trigger" aria-haspopup="dialog"
            aria-label={`View ${item.menuTitle}`} onClick={() => onPreview(item)}>
            <img
              loading={index < 2 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              width="417"
              height="413"
              alt={item.title}
              src={item.image}
              className="menu-image"
              style={{ objectFit: 'cover' }}
            />
            <span className="gallery-lightbox-link menu-preview-badge" aria-hidden="true">
              <span className="round-btn-text">View</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default function MenuItemGrid({ items, grid }) {
  const cart = useReservationCart();
  const [preview, setPreview] = useState(null);
  const previewDialog = useRef(null);
  const titleId = useId();

  useLayoutEffect(() => {
    if (preview && !previewDialog.current.open) previewDialog.current.showModal();
  }, [preview]);

  return <>
    <div className="menu-section-inner">
      <div className="w-dyn-list">
        <div ref={grid} role="list" className="menu-item-grid w-dyn-items">
          {items.map((item, index) => <MenuItemCard key={item.image} item={item} index={index} quantity={cart.quantityOf(item)}
            onChange={cart.change} onPreview={setPreview} />)}
        </div>
      </div>
    </div>
    <dialog ref={previewDialog} className="menu-preview-dialog" aria-labelledby={titleId}
      onClose={() => setPreview(null)}
      onClick={event => { if (event.target === event.currentTarget) previewDialog.current.close(); }}>
      {preview && <article className="menu-preview-content">
        <img src={preview.image} alt={preview.title} />
        <div className="menu-preview-details">
          <p className="section-pretitle">{preview.subcategory}</p>
          <h2 id={titleId}>{preview.menuTitle}</h2>
          <p>{preview.desc}</p>
          <div className="menu-preview-actions">
            <strong>{preview.price}</strong>
            <MenuItemActions item={preview} quantity={cart.quantityOf(preview)} onChange={cart.change} />
          </div>
        </div>
        <button type="button" className="menu-preview-close" autoFocus aria-label="Close product details"
          onClick={() => previewDialog.current.close()}>×</button>
      </article>}
    </dialog>
  </>;
}
