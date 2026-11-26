import { useState } from 'react';
import DemoForm, { DemoSubmit } from '../components/DemoForm';
import { money, useReservationCart } from '../components/ReservationCart';
import SiteShell from '../components/SiteShell';
import { checkoutCountries } from '../checkoutCountries';
import { useCafeo } from '../hooks/useCafeo';

function CheckoutBlock({ title, className, children, required = false }) {
  return <section className={className}>
    <div className="w-commerce-commercecheckoutblockheader block-header">
      <h2 className="checkout-heading">{title}</h2>
      {required && <span>* Required</span>}
    </div>
    <fieldset className="w-commerce-commercecheckoutblockcontent block-content">
      {children}
    </fieldset>
  </section>;
}

function CheckoutInput({ id, label, field, type = 'text', required = false, ...props }) {
  return <>
    <label htmlFor={id} className="w-commerce-commercecheckoutlabel field-label">
      {label}{required && ' *'}
    </label>
    <input id={id} className={`w-commerce-commercecheckout${field} text-field-white`}
      type={type} required={required} {...props} />
  </>;
}

function CheckoutAddress({ kind }) {
  const prefix = `demo-${kind}`;
  const title = kind === 'shipping' ? 'Shipping' : 'Billing';
  return <CheckoutBlock title={title + ' Address'} required
    className={`w-commerce-commercecheckout${kind}addresswrapper`}>
    <CheckoutInput id={prefix+'-name'} label="Full Name" field={kind+'fullname'} required />
    <CheckoutInput id={prefix+'-address'} label="Street Address" field={kind+'streetaddress'} required />
    <input aria-label={title + ' address line 2 (optional)'}
      className={`w-commerce-commercecheckout${kind}streetaddressoptional text-field-white`} type="text" />
    <div className="w-commerce-commercecheckoutrow">
      <div className="w-commerce-commercecheckoutcolumn">
        <CheckoutInput id={prefix+'-city'} label="City" field={kind+'city'} required />
      </div>
      <div className="w-commerce-commercecheckoutcolumn">
        <CheckoutInput id={prefix+'-state'} label="State/Province" field={kind+'stateprovince'} />
      </div>
      <div className="w-commerce-commercecheckoutcolumn">
        <CheckoutInput id={prefix+'-zip'} label="Zip/Postal Code" field={kind+'zippostalcode'} required />
      </div>
    </div>
    <label htmlFor={prefix+'-country'} className="w-commerce-commercecheckoutlabel field-label">Country *</label>
    <select id={prefix+'-country'} required defaultValue=""
      className={`w-commerce-commercecheckout${kind}countryselector text-field-white`}>
      <option value="">Select a country</option>
      {checkoutCountries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
    </select>
  </CheckoutBlock>;
}

export default function Checkout() {
  useCafeo('6808c4f23c47235de108f480', 'Checkout - Cafeo', 'body');
  const cart = useReservationCart();
  const [sameAddress, setSameAddress] = useState(true);

  return <SiteShell relativeHeader>
    <main className="checkout-section section-padding-100">
      <DemoForm className="w-commerce-commercecheckoutformcontainer checkout-form"
        aria-label="Demo checkout" loadingLabel="Placing demo order…"
        successMessage="Your checkout form was submitted successfully. Thank you for choosing Cafeo!"
        feedbackClassName="container success-message w-form-done"
        onComplete={() => setSameAddress(true)}>
        <div className="w-commerce-commercelayoutcontainer container checkout-container w-container">
          <div className="w-commerce-commercelayoutmain checkout-block">
            <CheckoutBlock title="Customer Info" required className="w-commerce-commercecheckoutcustomerinfowrapper">
              <CheckoutInput id="demo-checkout-email" type="email" label="Email" field="emailinput" required />
            </CheckoutBlock>
            <CheckoutAddress kind="shipping" />
            <CheckoutBlock title="Shipping Method" className="w-commerce-commercecheckoutshippingmethodswrapper">
              <label className="w-commerce-commercecheckoutshippingmethoditem shipping-method">
                <span className="shipping-method-flex-box">
                  <input required defaultChecked className="shipping-radio-button" type="radio" name="demo-shipping" />
                  <span className="shipping-method-title">Standard demo shipping</span>
                </span>
                <span>{money(0)}</span>
              </label>
            </CheckoutBlock>
            <CheckoutBlock title="Payment Info" className="w-commerce-commercecheckoutpaymentinfowrapper">
              <p>Sample payment details are provided for this demo.</p>
              <CheckoutInput id="demo-card-number" label="Card Number" field="cardnumber"
                readOnly value="4242 4242 4242 4242" />
              <div className="w-commerce-commercecheckoutrow">
                <div className="w-commerce-commercecheckoutcolumn">
                  <CheckoutInput id="demo-card-expiry" label="Expiration Date" field="cardexpirationdate"
                    readOnly value="12 / 39" />
                </div>
                <div className="w-commerce-commercecheckoutcolumn">
                  <CheckoutInput id="demo-card-code" label="Security Code" field="cardsecuritycode"
                    readOnly value="123" />
                </div>
              </div>
              <div className="w-commerce-commercecheckoutbillingaddresstogglewrapper billing-address-toggle">
                <input id="billing-address-toggle" type="checkbox" checked={sameAddress}
                  className="w-commerce-commercecheckoutbillingaddresstogglecheckbox billing-checkbox"
                  onChange={event => setSameAddress(event.target.checked)} />
                <label htmlFor="billing-address-toggle" className="w-commerce-commercecheckoutbillingaddresstogglelabel">
                  Billing address same as shipping
                </label>
              </div>
            </CheckoutBlock>
            {!sameAddress && <CheckoutAddress kind="billing" />}
            <CheckoutBlock title="Items in Order" className="w-commerce-commercecheckoutorderitemswrapper order-items">
              {cart.lines.length ? <div role="list" className="w-commerce-commercecheckoutorderitemslist">
                {cart.lines.map(({ item, quantity, total }) => <div key={item.image} role="listitem"
                  className="w-commerce-commercecheckoutorderitem order-item">
                  <img src={item.image} alt="" className="w-commerce-commercecartitemimage order-item-image" />
                  <div className="w-commerce-commercecheckoutorderitemdescriptionwrapper order-item-content-box">
                    <div className="w-commerce-commerceboldtextblock order-item-title">{item.title}</div>
                    <div>Quantity: {quantity}</div>
                  </div>
                  <div>{money(total)}</div>
                </div>)}
              </div> : <p>Your cart is empty. You can still try the demo checkout.</p>}
            </CheckoutBlock>
          </div>
          <aside className="w-commerce-commercelayoutsidebar">
            <CheckoutBlock title="Order Summary" className="w-commerce-commercecheckoutordersummarywrapper order-summary">
              <div className="w-commerce-commercecheckoutsummarylineitem"><span>Subtotal</span><span>{money(cart.subtotal)}</span></div>
              <div className="w-commerce-commercecheckoutsummarylineitem">
                <span>Total</span><span className="w-commerce-commercecheckoutsummarytotal order-summary-total-text">{money(cart.subtotal)}</span>
              </div>
            </CheckoutBlock>
            <div className="btn-submit-block width-100">
              <div className="btn-block btn-submit-padding">
                <DemoSubmit value="Place Order" className="w-commerce-commercecheckoutplaceorderbutton submit-button width-100" />
                <div className="btn-border-block" aria-hidden="true">
                  {['top', 'right', 'bottom', 'left'].map(side =>
                    <div key={side} className={`border-${side} btn-border-line-white`} />)}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </DemoForm>
    </main>
  </SiteShell>;
}
