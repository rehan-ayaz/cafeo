import React, { useEffect, useRef, useState } from 'react';
import { useCafeo } from '../hooks/useCafeo';
import SiteShell from '../components/SiteShell';
import DemoForm, { DemoSubmit } from '../components/DemoForm';
import { restaurantNow } from '../reservationTime';
import './reservations.css';
import { CartSummary, useReservationCart } from '../components/ReservationCart';

const emailAddress = 'info@cafeo.com';
const orderTypes = ['Dine-In', 'Pickup / Takeaway'];
const locations = ['New York', 'Washington'];

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
  const [orderType, setOrderType] = useState(orderTypes[0]);
  const isDineIn = orderType === 'Dine-In';
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [pickerErrors, setPickerErrors] = useState({});
  const now = restaurantNow();

  function choosePicker(name, value) {
    if (name === 'orderType') setOrderType(value);
    if (name === 'location') setLocation(value);
    if (name === 'time') setTime(value);
    if (name === 'date') {
      setDate(value);
      if (!reservationTimes(value, restaurantNow()).includes(time)) setTime('');
    }
    setPickerErrors(errors => ({ ...errors, [name]: '', ...(name === 'date' ? { time: '' } : {}) }));
  }

  function validateBooking(form) {
    const name = form.elements.namedItem('fullName');
    if (name.value.trim().length < 2) {
      name.setCustomValidity('Please enter your full name.');
      name.reportValidity();
      return false;
    }
    const current = restaurantNow();
    const errors = {
      location: !locations.includes(location) ? 'Choose a Cafeo location.' : '',
      date: !date || date < current.date ? 'Choose today or a future date.' : '',
      time: !reservationTimes(date, current).includes(time) ? 'Choose a reservation time within opening hours.' : '',
    };
    setPickerErrors(errors);
    const firstError = Object.keys(errors).find(name => errors[name]);
    if (firstError) form.querySelector(`#picker-${firstError}`).focus();
    return !firstError;
  }

  function resetBooking() {
    setOrderType(orderTypes[0]);
    setDate('');
    setTime('');
    setLocation('');
    setPickerErrors({});
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
                  <p className="section-desc" id="reservation-intro">Choose a location, date and time to try the Cafeo booking experience.</p>
                </div>
                {cart.count === 0 && <div className="reservation-browse"><a href="/menu" className="btn-block w-inline-block">Browse Menu</a></div>}
                <div className="contact-info-1-from-block contact-mtop">
                  <DemoForm className="contact-info-1-form reservation-request-form" aria-label="Table reservation request"
                    aria-describedby="reservation-intro reservation-note" validate={validateBooking} onComplete={resetBooking}
                    loadingLabel="Submitting reservation…" feedbackClassName="reservation-feedback"
                    successMessage={<><h3>Request submitted successfully</h3><p>Thank you for choosing Cafeo!</p></>}>
                    <div className="contact-info-1-form-grid">
                      <div className="reservation-field"><label htmlFor="reservation-name">Full Name <span aria-hidden="true">*</span></label><input id="reservation-name" name="fullName" type="text" placeholder="Your full name" className="text-field-dark w-input" minLength={2} maxLength={100} required /></div>
                      <div className="reservation-field"><label htmlFor="reservation-email">Email Address <span aria-hidden="true">*</span></label><input id="reservation-email" name="email" type="email" placeholder="you@example.com" className="text-field-dark w-input" maxLength={254} required /></div>
                      <div className="reservation-field"><label htmlFor="reservation-phone">Phone Number <span aria-hidden="true">*</span></label><input id="reservation-phone" name="phone" type="tel" placeholder="Include your country code" className="text-field-dark w-input" maxLength={30} required /></div>
                      <Picker name="location" label="Cafeo Location" value={location} display={location}
                        placeholder="Select a location" error={pickerErrors.location} onSelect={value => choosePicker('location', value)}>
                        {choose => <div className="reservation-picker-options">
                          {locations.map(option => <button type="button" key={option} aria-pressed={location === option}
                            onClick={() => choose(option)}>{option}</button>)}
                        </div>}
                      </Picker>
                      <Picker name="date" label="Reservation Date" value={date} display={date && displayDate(date)}
                        placeholder="Select a date" error={pickerErrors.date} onSelect={value => choosePicker('date', value)}>
                        {choose => <Calendar key={date || now.date} today={now.date} value={date} choose={choose} />}
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
                      <div className="reservation-field"><label htmlFor="reservation-guests">Number of Guests <span aria-hidden="true">*</span></label><input id="reservation-guests" name="guests" type="number" inputMode="numeric" min="1" step="1" placeholder="How many people are joining?" className="text-field-dark w-input" required={isDineIn} disabled={!isDineIn} /></div>
                    </div>
                    {orderType === 'Pickup / Takeaway' && <p className="reservation-help reservation-order-fields">
                      Select this option to preview a pickup order at your chosen location and time.
                    </p>}
                    <div className="reservation-field"><label htmlFor="reservation-requests">Special Requests (Optional)</label><textarea id="reservation-requests" name="requests" placeholder="Dietary needs, accessibility requirements, a celebration, or preferred seating" maxLength={1000} className="text-field-dark textarea w-input" /></div>
                    <p className="reservation-help" id="reservation-note">Required fields are marked *. Demo submissions do not create reservations or orders.</p>
                    <div className="contact-info-form-btn-block">
                      <div className="btn-submit-block">
                        <DemoSubmit value="Submit Reservation" className="btn-block reservation-action"><ButtonBorder /></DemoSubmit>
                      </div>
                    </div>
                  </DemoForm>
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
