import DemoForm, { DemoSubmit } from '../components/DemoForm';
import { useCafeo } from '../hooks/useCafeo';

export default function Page401() {
  useCafeo('681855587f56307cdbf02452', 'Password Protected - Cafeo', 'body');

  return <div className="utility-page-wrap">
    <div className="utility-page-content password-page-content w-password-page demo-form-block">
      <DemoForm className="utility-page-form w-password-page" aria-label="Demo password form"
        loadingLabel="Checking demo…"
        successMessage="Your access form was submitted successfully.">
        <img alt="" src="/assets/images/utility-lock.ae54711958_0f3080.svg" className="utility-lock-image" />
        <h1 className="password-title">Protected Page</h1>
        <label htmlFor="demo-password" className="field-label w-password-page">Demo Password</label>
        <input id="demo-password" className="text-field-dark w-password-page w-input"
          maxLength={256} placeholder="Use a test password" type="password" autoComplete="new-password" required />
        <div className="btn-submit-block">
          <div className="btn-block btn-submit-padding">
            <DemoSubmit value="Submit" className="submit-button width-100 w-password-page w-button" />
            <div className="btn-border-block" aria-hidden="true">
              {['top', 'right', 'bottom', 'left'].map(side =>
                <div key={side} className={`border-${side} btn-border-line-white`} />)}
            </div>
          </div>
        </div>
      </DemoForm>
    </div>
  </div>;
}
