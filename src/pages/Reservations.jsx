import React, { useEffect, useRef, useState } from 'react';
import { useCafeo } from '../hooks/useCafeo';
import SiteShell from '../components/SiteShell';
import './reservations.css';
import { CartSummary, money, readStored, useReservationCart, writeStored } from '../components/ReservationCart';

const draftKey = 'cafeo.reservation.draft';
const draftFields = ['fullName', 'email', 'phone', 'date', 'time', 'location', 'guests', 'requests', 'orderType'];

const emailAddress = 'info@cafeo.com';
const orderTypes = ['Dine-In', 'Pickup / Takeaway'];
const locations = ['New York', 'Washington'];

// Both existing locations use Eastern Time, including daylight saving changes.
function restaurantNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map(({ type, value }) => [type, value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

function closingTime(date) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 || day === 6 ? '23:00' : '21:00';
}

function displayDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function displayTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'} (Eastern Time)`;
}

function Picker({ name, label, value, display, placeholder, error, children, onSelect }) {
  const panel = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    function dismiss(event) {
      if (panel.current?.open && !panel.current.contains(event.target)) {
        panel.current.open = false;
      }
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  function close() {
    panel.current.open = false;
    trigger.current.focus();
  }
  return <div className="reservation-field">
    <label id={`picker-${name}-label`}>{label} <span aria-hidden="true">*</span></label>
    <input type="hidden" name={name} value={value} />
    <details ref={panel} className="reservation-picker"
      onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          panel.current.open = false;
        }
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && panel.current.open) {
          event.preventDefault();
          close();
        }
      }}>
      <summary ref={trigger} id={`picker-${name}`} className="text-field-dark"
        aria-labelledby={`picker-${name}-label picker-${name}-value`}
        aria-describedby={error ? `picker-${name}-error` : undefined}>
        <span id={`picker-${name}-value`}>{value ? display : placeholder}</span>
        <span className="reservation-chevron" aria-hidden="true" />
      </summary>
      <div className="reservation-picker-panel">
        {children(next => { onSelect(next); close(); })}
      </div>
    </details>
    {error && <p className="reservation-picker-error" id={`picker-${name}-error`} role="alert">{error}</p>}
  </div>;
}

function Calendar({ today, value, choose }) {
  const [month, setMonth] = useState(() => (value || today).slice(0, 7));
  const [year, number] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, number - 1, 1));
  const count = new Date(Date.UTC(year, number, 0)).getUTCDate();
  const title = first.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  function move(delta) {
    setMonth(new Date(Date.UTC(year, number - 1 + delta, 1)).toISOString().slice(0, 7));
  }
  return <>
    <div className="reservation-calendar-heading">
      <button type="button" aria-label="Previous month" aria-disabled={month <= today.slice(0, 7)}
        onClick={() => { if (month > today.slice(0, 7)) move(-1); }}>‹</button>
      <span aria-live="polite">{title}</span>
      <button type="button" aria-label="Next month" onClick={() => move(1)}>›</button>
    </div>
    <div className="reservation-calendar-days">
      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day}>{day}</span>)}
      {Array.from({ length: first.getUTCDay() }, (_, i) => <span key={`blank-${i}`} />)}
      {Array.from({ length: count }, (_, i) => {
        const day = `${month}-${String(i + 1).padStart(2, '0')}`;
        return <button key={day} type="button" disabled={day < today}
          aria-label={displayDate(day)} aria-pressed={value === day}
          aria-current={day === today ? 'date' : undefined}
          onClick={() => choose(day)}>{i + 1}</button>;
      })}
    </div>
  </>;
}

function reservationTimes(date, now) {
  if (!date) return [];
  const slots = Array.from({ length: 60 }, (_, i) =>
    `${String(8 + Math.floor(i / 4)).padStart(2, '0')}:${String(i % 4 * 15).padStart(2, '0')}`);
  return slots.filter(time => time < closingTime(date) && (date !== now.date || time > now.time));
}

function timeLabel(time) {
  return displayTime(time).replace(' (Eastern Time)', '');
}

function ButtonBorder() {
  return <div className="btn-border-block" aria-hidden="true">
    {['top', 'right', 'bottom', 'left'].map(side =>
      <div key={side} className={`border-${side} btn-border-line-white`} />)}
  </div>;
}

export default function Reservations() {
  useCafeo('6814aa146b09e54e2652f700', 'Table Reservations - Cafeo', 'body');
  const cart = useReservationCart();
  const [initialDetails] = useState(() => readStored('sessionStorage', draftKey));
  const [orderType, setOrderType] = useState(() =>
    orderTypes.includes(initialDetails.orderType) ? initialDetails.orderType : orderTypes[0]);
  const isDineIn = orderType === 'Dine-In';
  const [date, setDate] = useState(initialDetails.date || '');
  const [time, setTime] = useState(initialDetails.time || '');
  const [location, setLocation] = useState(initialDetails.location || '');
  const [pickerErrors, setPickerErrors] = useState({});
  const [draft, setDraft] = useState(null);
  const feedback = useRef(null);
  const feedbackForm = useRef(null);
  const now = restaurantNow();

  useEffect(() => {
    if (draft) feedback.current?.focus();
  }, [draft]);

  useEffect(() => { setDraft(null); }, [cart.quantities]);

  function saveDetails(values) {
    const details = Object.fromEntries(draftFields.map(key => [key, values[key] ?? '']));
    writeStored('sessionStorage', draftKey, details);
  }

  function updateRequest(event) {
    saveDetails(Object.fromEntries(new FormData(event.currentTarget)));
    event.target.setCustomValidity?.('');
    setDraft(null);
  }

  function choosePicker(name, value) {
    if (name === 'orderType') setOrderType(value);
    if (name === 'location') setLocation(value);
    if (name === 'time') setTime(value);
    const nextDate = name === 'date' ? value : date;
    const nextTime = name === 'time' ? value : time;
    const validTime = reservationTimes(nextDate, restaurantNow()).includes(nextTime) ? nextTime : '';
    if (name === 'date') {
      setDate(value);
      setTime(validTime);
    }
    const form = feedbackForm.current;
    saveDetails({
      ...Object.fromEntries(new FormData(form)),
      [name]: value, date: nextDate, time: validTime,
    });
    setPickerErrors(errors => ({ ...errors, [name]: '', ...(name === 'date' ? { time: '' } : {}) }));
    setDraft(null);
  }

  function submitRequest(event) {
    event.preventDefault();
    // Keep this React form separate from the template's Webflow form handler.
    event.stopPropagation();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const current = restaurantNow();
    const validate = (name, message) => form.elements.namedItem(name).setCustomValidity(message);

    validate('fullName', values.fullName.trim().length < 2 ? 'Please enter your full name.' : '');
    validate('phone', !/^[+\d\s().-]+$/.test(values.phone) ||
      values.phone.replace(/\D/g, '').length < 7 || values.phone.replace(/\D/g, '').length > 15
      ? 'Enter a valid phone number with 7 to 15 digits, including your country code if needed.' : '');
    if (isDineIn) validate('guests', !Number.isSafeInteger(Number(values.guests)) || Number(values.guests) < 1
      ? 'Please enter a whole number of guests, at least 1.' : '');

    if (!form.reportValidity()) return;

    const errors = {
      location: !locations.includes(values.location) ? 'Choose a Cafeo location.' : '',
      date: !values.date || values.date < current.date ? 'Choose today or a future date.' : '',
      time: !reservationTimes(values.date, current).includes(values.time) ? 'Choose a reservation time within opening hours.' : '',
    };
    setPickerErrors(errors);
    const firstError = Object.keys(errors).find(name => errors[name]);
    if (firstError) {
      form.querySelector(`#picker-${firstError}`).focus();
      return;
    }

    const request = {
      ...values, fullName: values.fullName.trim(), email: values.email.trim(),
      phone: values.phone.trim(), requests: values.requests.trim(),
    };
    const menuDetails = cart.lines.length ? [
      '', 'Menu selections:',
      ...cart.lines.map(({ item, quantity, total }) =>
        `${item.title} × ${quantity} (${item.price} each) = ${money(total)}`),
      `Total items: ${cart.count}`,
      `Menu subtotal: ${money(cart.subtotal)}`,
      `Menu total: ${money(cart.subtotal)}`,
    ] : [];
    const details = [
      `Order type: ${request.orderType}`, `Location: ${request.location}`, `Full name: ${request.fullName}`,
      `Email: ${request.email}`, `Phone: ${request.phone}`,
      `Date: ${displayDate(request.date)}`, `Time: ${displayTime(request.time)}`,
      ...(isDineIn ? [`Number of guests: ${request.guests}`] : []),
      `Special requests: ${request.requests || 'None'}`,
      ...menuDetails,
    ].join('\r\n');
    const body = `Hello Cafeo,\r\n\r\nI would like to make a ${request.orderType} request:\r\n\r\n${details}\r\n\r\nPlease confirm availability for this request. I understand this request is subject to confirmation.\r\n\r\nThank you,\r\n${request.fullName}`;
    setDraft({ request, details, href: `mailto:${emailAddress}?subject=${encodeURIComponent(`${request.orderType} request - ${request.location} - ${request.date}`)}&body=${encodeURIComponent(body)}` });
  }

  return <SiteShell>
    <main className="reservations-page">
      <section className="pagetitle-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="page-pretitle-text">Reservations</div>
          <div className="pagetitle-grid">
            <div className="page-title-block"><h1 className="pagetitle-heading">A table for every occasion</h1></div>
            <p className="pagetitle-desc">Make time for good food, specialty coffee, and great company. Plan your next Cafeo visit, from a relaxed catch-up to a special celebration.</p>
          </div>
        </div>
      </section>

      <section className="contact-section section-padding-100" aria-labelledby="reservation-heading">
        <div className="w-layout-blockcontainer container w-container">
          <div className="reservation-booking-grid">
            {cart.count > 0 && <CartSummary cart={cart} readOnly />}
            <div className="contact-grid">
            <div className="contact-block">
              <div className="contact-center">
                <div className="section-title center-text">
                  <div className="section-pretitle">Join us at Cafeo</div>
                  <h2 className="section-heading" id="reservation-heading">Reserve a table</h2>
                  <p className="section-desc" id="reservation-intro">Complete the form to prepare your reservation email. Send it from your email app; our team will need to confirm availability.</p>
                </div>
                {cart.count === 0 && <div className="reservation-browse"><a href="/menu" className="btn-block w-inline-block">Browse Menu</a></div>}
                <div className="contact-info-1-from-block contact-mtop">
                  <form ref={feedbackForm} className="contact-info-1-form reservation-request-form" aria-label="Table reservation request" aria-describedby="reservation-intro reservation-note" onSubmit={submitRequest} onInput={updateRequest} onChange={updateRequest}>
                    <div className="contact-info-1-form-grid">
                      <div className="reservation-field"><label htmlFor="reservation-name">Full Name <span aria-hidden="true">*</span></label><input id="reservation-name" name="fullName" defaultValue={initialDetails.fullName || ''} type="text" autoComplete="name" placeholder="Your full name" className="text-field-dark w-input" minLength={2} maxLength={100} required /></div>
                      <div className="reservation-field"><label htmlFor="reservation-email">Email Address <span aria-hidden="true">*</span></label><input id="reservation-email" name="email" defaultValue={initialDetails.email || ''} type="email" autoComplete="email" placeholder="you@example.com" className="text-field-dark w-input" maxLength={254} required /></div>
                      <div className="reservation-field"><label htmlFor="reservation-phone">Phone Number <span aria-hidden="true">*</span></label><input id="reservation-phone" name="phone" defaultValue={initialDetails.phone || ''} type="tel" autoComplete="tel" placeholder="Include your country code" className="text-field-dark w-input" maxLength={30} required /></div>
                      <Picker name="location" label="Cafeo Location" value={location} display={location}
                        placeholder="Select a location" error={pickerErrors.location} onSelect={value => choosePicker('location', value)}>
                        {choose => <div className="reservation-picker-options">
                          {locations.map(option => <button type="button" key={option} aria-pressed={location === option}
                            onClick={() => choose(option)}>{option}</button>)}
                        </div>}
                      </Picker>
                      <Picker name="date" label="Reservation Date" value={date} display={date && displayDate(date)}
                        placeholder="Select a date" error={pickerErrors.date} onSelect={value => choosePicker('date', value)}>
                        {choose => <Calendar today={now.date} value={date} choose={choose} />}
                      </Picker>
                      <Picker name="time" label="Reservation Time" value={time} display={time && timeLabel(time)}
                        placeholder="Select a time" error={pickerErrors.time} onSelect={value => choosePicker('time', value)}>
                        {choose => {
                          const options = reservationTimes(date, now);
                          return options.length ? <div className="reservation-picker-options reservation-time-options">
                            {options.map(option => <button type="button" key={option} aria-pressed={time === option}
                              onClick={() => choose(option)}>{timeLabel(option)}</button>)}
                          </div> : <p className="reservation-picker-hint">{date ? 'No times remain for this date. Choose another date.' : 'Choose a reservation date first.'}</p>;
                        }}
                      </Picker>
                    </div>
                    <p id="reservation-time-help" className="reservation-help">All times are local to the restaurant (Eastern Time). Mon–Fri: 8 AM–9 PM · Sat–Sun: 8 AM–11 PM.</p>
                    <Picker name="orderType" label="Order Type" value={orderType} display={orderType}
                      onSelect={value => choosePicker('orderType', value)}>
                      {choose => <div className="reservation-picker-options">
                        {orderTypes.map(option => <button type="button" key={option} aria-pressed={orderType === option}
                          onClick={() => choose(option)}>{option}</button>)}
                      </div>}
                    </Picker>
                    <div hidden={!isDineIn} className="reservation-order-fields">
                      <div className="reservation-field"><label htmlFor="reservation-guests">Number of Guests <span aria-hidden="true">*</span></label><input id="reservation-guests" name="guests" defaultValue={initialDetails.guests || ''} type="number" inputMode="numeric" min="1" step="1" placeholder="How many people are joining?" className="text-field-dark w-input" required={isDineIn} disabled={!isDineIn} /></div>
                    </div>
                    {orderType === 'Pickup / Takeaway' && <p className="reservation-help reservation-order-fields">
                      Collect your order from the selected Cafeo location at your chosen date and time.
                    </p>}
                    <div className="reservation-field"><label htmlFor="reservation-requests">Special Requests (Optional)</label><textarea id="reservation-requests" name="requests" defaultValue={initialDetails.requests || ''} placeholder="Dietary needs, accessibility requirements, a celebration, or preferred seating" maxLength={1000} className="text-field-dark textarea w-input" /></div>
                    <p className="reservation-help" id="reservation-note">Required fields are marked *. {isDineIn ? 'Seating preferences are subject to availability.' : 'Pickup is subject to availability.'} Your request is confirmed after our team replies.</p>
                    <div className="contact-info-form-btn-block">
                      <div className="btn-submit-block">
                        <button type="submit" className="btn-block reservation-action">
                          <span className="btn-text">Submit Reservation</span>
                          <ButtonBorder />
                        </button>
                      </div>
                    </div>
                  </form>
                  {draft && <div className="reservation-feedback" role="status" aria-live="polite" tabIndex={-1} ref={feedback}>
                    <h3>Your reservation email is ready</h3>
                    <p>Your request has not been sent. Open the email below and send it to our team to check availability.</p>
                    <a className="btn-block reservation-action w-inline-block" href={draft.href}><span className="btn-text">Open reservation email</span><ButtonBorder /></a>
                    <p className="reservation-help">If your email app does not open, send these details to <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</p>
                    <pre className="reservation-summary">{draft.details}</pre>
                    <p className="reservation-help">This is a request, not a confirmed booking. Please wait for a reply from Cafeo.</p>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="location-section section-padding-100" aria-labelledby="visit-heading">
        <div className="w-layout-blockcontainer container w-container">
          <div className="section-title"><div className="section-pretitle">Plan your visit</div><h2 className="section-heading" id="visit-heading">Good moments start here</h2><p className="section-desc">Explore our <a href="/menu">food and drinks menu</a> before your visit. For larger gatherings, changes to your request, or dietary questions, <a href={`mailto:${emailAddress}`}>email our team</a> with your preferred location and date.</p></div>
          <div className="location-section-inner">
            <div className="location-block"><div className="location-title-block"><h3 className="location-title">Opening hours</h3><div className="location-address-text">Monday–Friday: 8 AM–9 PM<br />Saturday–Sunday: 8 AM–11 PM</div></div><div className="location-desc-block"><p>Please choose a time within our opening hours. For same-day plans, contact our team to check availability before travelling.</p></div></div>
            {[
              ['New York', '20 Cooper Square, New York, NY 10003, USA'],
              ['Washington', '70 Washington Square South, Washington DC, 20001, USA'],
            ].map(([location, address], index) => <div className={`location-block${index === 1 ? ' last-child' : ''}`} key={location}><div className="location-title-block"><h3 className="location-title">{location}</h3><div className="location-address-text">{address}</div></div><div className="location-desc-block"><div className="location-contact-block"><a href={`mailto:${emailAddress}`} className="location-contact-link">{emailAddress}</a></div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="location-link">Get directions</a></div></div>)}
          </div>
        </div>
      </section>
    </main>
  </SiteShell>;
}
