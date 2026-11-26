import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SubmissionContext = createContext(null);

export function DemoSubmit({ value, className, children }) {
  const { pending, loadingLabel } = useContext(SubmissionContext);
  if (children) {
    return <button type="submit" className={className} disabled={pending}>
      <span className="btn-text">{pending ? loadingLabel : value}</span>{children}
    </button>;
  }
  return <input type="submit" className={className} disabled={pending}
    value={pending ? loadingLabel : value} />;
}

export default function DemoForm({ children, successMessage, loadingLabel = 'Submitting…',
  validate, onComplete, feedbackClassName = 'success-message w-form-done', ...formProps }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);
  const feedback = useRef(null);
  const pending = status === 'pending';

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (status === 'success') feedback.current?.focus();
  }, [status]);

  function submit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (timer.current !== null) return;

    const form = event.currentTarget;
    for (const field of form.querySelectorAll('input[required], textarea[required]')) {
      if (field.disabled || field.readOnly) continue;
      if ((field.type === 'text' || field.type === 'textarea') && !field.value.trim()) {
        field.setCustomValidity('Please fill out this field.');
      }
      if (field.type === 'tel' && (!/^[+\d\s().-]+$/.test(field.value) ||
        !/^\d{7,15}$/.test(field.value.replace(/\D/g, '')))) {
        field.setCustomValidity('Enter a valid phone number with 7 to 15 digits.');
      }
    }
    if (!form.reportValidity() || validate?.(form) === false) return;

    setStatus('pending');
    timer.current = setTimeout(() => {
      setStatus('success');
      form.reset();
      onComplete?.();
      timer.current = null;
    }, 650);
  }

  return <SubmissionContext.Provider value={{ pending, loadingLabel }}>
    <form {...formProps} autoComplete="off" onSubmit={submit} aria-busy={pending || undefined}
      onInvalid={() => { if (status === 'success') setStatus('idle'); }}
      inert={pending || undefined} onInput={event => {
        event.target.setCustomValidity?.('');
        if (status === 'success') setStatus('idle');
      }}>
      {children}
    </form>
    <div ref={feedback} role="status" aria-atomic="true"
      className={status === 'success' ? `${feedbackClassName} demo-form-success` : 'demo-form-status'}
      tabIndex={status === 'success' ? -1 : undefined}>
      {pending ? loadingLabel : status === 'success' ? successMessage : null}
    </div>
  </SubmissionContext.Provider>;
}
