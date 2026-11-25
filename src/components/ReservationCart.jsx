import { createContext, useContext, useState } from 'react';
import { menuItems } from '../menuCatalog';
import './reservation-cart.css';

const cartKey = 'cafeo.reservation.cart';

export function readStored(storage, key) {
  try {
    const data = JSON.parse(window[storage].getItem(key));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

export function writeStored(storage, key, value) {
  try {
    window[storage].setItem(key, JSON.stringify(value));
  } catch {
    // The current page can still operate if browser storage is unavailable.
  }
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const priceInCents = item => Math.round(Number(item.price.slice(1)) * 100);
export const money = cents => usd.format(cents / 100);

const CartContext = createContext(null);

export function useReservationCart() {
  return useContext(CartContext);
}

export function ReservationCartProvider({ children }) {
  const [quantities, setQuantities] = useState(() => readStored('localStorage', cartKey));
  const quantityOf = item => {
    const quantity = quantities[item.image];
    return Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 999 ? quantity : 0;
  };
  const lines = menuItems.filter(quantityOf).map(item => {
    const quantity = quantityOf(item);
    return { item, quantity, total: priceInCents(item) * quantity };
  });
  function change(item, delta) {
    const next = { ...quantities };
    const quantity = delta === null ? 0 : Math.min(999, quantityOf(item) + delta);
    if (quantity > 0) next[item.image] = quantity;
    else delete next[item.image];
    writeStored('localStorage', cartKey, next);
    setQuantities(next);
  }
  const cart = {
    quantities, lines, quantityOf, change,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + line.total, 0),
  };

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function CartLink() {
  const cart = useReservationCart();
  const count = cart?.count ?? 0;
  return <a href="/cart" className="w-commerce-commercecartopenlink cart-button shared-cart-trigger"
    aria-label={`View cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
    <img src="/assets/images/6808d5f740cfe8aeadf901ab_cart_3edf83.svg" alt="" className="cart-icon-image" />
    <span className="w-commerce-commercecartopenlinkcount cart-quantity">{count}</span>
  </a>;
}

export function Quantity({ item, cart }) {
  const quantity = cart.quantityOf(item);
  function change(delta) {
    cart.change(item, delta);
  }
  if (!quantity) {
    return <button type="button" className="w-commerce-commerceaddtocartbutton menu-cart-link reservation-add-button"
      aria-label={`Add to cart: ${item.title}`} onClick={() => change(1)}>Add to Cart</button>;
  }
  return <div className="reservation-quantity" role="group" aria-label={`Quantity for ${item.title}`}>
    <button type="button" aria-label={`Decrease ${item.title}`} onClick={() => change(-1)}>−</button>
    <output aria-label="Selected quantity">{quantity}</output>
    <button type="button" aria-label={`Increase ${item.title}`} disabled={quantity >= 999}
      onClick={() => change(1)}>+</button>
  </div>;
}

export function CartSummary({ cart, readOnly = false }) {
  const { lines, count, subtotal } = cart;
  return <section className={`reservation-cart${readOnly ? ' reservation-order-summary' : ''}`}
    aria-labelledby="order-summary-title">
    {readOnly && <h2 id="order-summary-title">Order Summary</h2>}
    {!readOnly && <h2 id="order-summary-title">{count ? 'Selected Items' : 'Your Cart Is Empty'}</h2>}
    {count > 0 ? <>
      <ul className="reservation-cart-lines">
        {lines.map(({ item, quantity, total }) => <li key={item.image}>
          {!readOnly && <img src={item.image} alt={item.title} width="72" height="72" loading="lazy" />}
          <div>
            <h3>{item.title}</h3>
            <div>{readOnly && <>Quantity: {quantity} · </>}{item.price} each</div>
            {!readOnly && <div className="reservation-cart-line-actions">
              <Quantity item={item} cart={cart} />
              <button type="button" className="reservation-remove" aria-label={`Remove ${item.title}`}
                onClick={() => cart.change(item, null)}>Remove</button>
            </div>}
          </div>
          <strong>Item total: {money(total)}</strong>
        </li>)}
      </ul>
      <dl className="reservation-totals" aria-live="polite">
        <div><dt>Total items</dt><dd>{count}</dd></div>
        <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
        <div><dt>Total</dt><dd>{money(subtotal)}</dd></div>
      </dl>
    </> : <p>Browse the menu to add items to your reservation.</p>}
    {!readOnly && <div className="reservation-cart-actions">
      <a href="/menu" className="btn-block w-inline-block">{count ? 'Continue Shopping' : 'Browse Menu'}</a>
      <a href="/reservations" className="btn-block w-inline-block">Proceed to Reservation</a>
    </div>}
  </section>;
}
