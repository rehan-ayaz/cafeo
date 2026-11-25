import SiteShell from '../components/SiteShell';
import { CartSummary, useReservationCart } from '../components/ReservationCart';
import { useCafeo } from '../hooks/useCafeo';

export default function Cart() {
  const cart = useReservationCart();
  useCafeo('6814aa146b09e54e2652f700', 'Your Cart - Cafeo', 'body');

  return <SiteShell>
    <main>
      <section className="pagetitle-section">
        <div className="w-layout-blockcontainer container w-container">
          <h1 className="pagetitle-heading">Your Cart</h1>
        </div>
      </section>
      <div className="section-padding-100">
        <div className="w-layout-blockcontainer container w-container">
          <CartSummary cart={cart} />
        </div>
      </div>
    </main>
  </SiteShell>;
}
