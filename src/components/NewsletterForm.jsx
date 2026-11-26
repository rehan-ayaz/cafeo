import DemoForm, { DemoSubmit } from './DemoForm';

export default function NewsletterForm() {
  return <div className="footer-form-block demo-form-block">
    <DemoForm className="footer-form" aria-label="Newsletter signup" loadingLabel="Subscribing…"
      successMessage="Thank you for signing up for the Cafeo newsletter! Your signup form was submitted successfully.">
      <input className="footer-text-field w-input" maxLength={254} name="email"
        placeholder="Enter your email address" aria-label="Email address" type="email" required />
      <label className="w-checkbox checkbox-field demo-consent">
        <input type="checkbox" name="consent" required />
        <span aria-hidden="true" className="w-checkbox-input w-checkbox-input--inputType-custom checkbox" />
        <span className="checkbox-label w-form-label">Yes, subscribe me to your newsletter.</span>
      </label>
      <div className="btn-submit-block">
        <div className="btn-block btn-submit-padding">
          <DemoSubmit value="Subscribe now" className="submit-button w-button" />
          <div className="btn-border-block" aria-hidden="true">
            <div className="border-top btn-border-line-white" />
            <div className="border-right btn-border-line-white" />
            <div className="border-bottom btn-border-line-white" />
            <div className="border-left btn-border-line-white" />
          </div>
        </div>
      </div>
    </DemoForm>
  </div>;
}
