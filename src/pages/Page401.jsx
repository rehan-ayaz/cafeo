import React from 'react';
import { useCafeo } from '../hooks/useCafeo';

export default function Page401() {
  useCafeo('681855587f56307cdbf02452', 'Password Protected - Cafeo', 'body');

  return (
    <>
      <div className="utility-page-wrap"><div className="utility-page-content password-page-content w-password-page w-form"><form action="/.wf_auth" method="post" id="email-form" name="email-form" data-name="Email Form" className="utility-page-form w-password-page" data-wf-page-id="681855587f56307cdbf02452" data-wf-element-id="681855587f56307cdbf0245c00000000000c"><img alt="" src="/assets/images/utility-lock.ae54711958_0f3080.svg" className="utility-lock-image"/><h1 className="password-title">Protected Page</h1><label htmlFor="pass" className="field-label w-password-page">Password</label><input className="text-field-dark w-password-page w-input" autoFocus="true" maxLength="256" name="pass" data-name="field" placeholder="Enter your password" type="password" id="pass"/><div className="btn-submit-block"><div className="btn-block btn-submit-padding"><input type="submit" data-wait="Please wait..." className="submit-button width-100 w-password-page w-button" value="Submit"/><div className="btn-border-block"><div className="border-top btn-border-line-white"></div><div className="border-right btn-border-line-white"></div><div className="border-bottom btn-border-line-white"></div><div className="border-left btn-border-line-white"></div></div></div></div><div className="error-message w-password-page w-form-fail"><div>Incorrect password. Please try again.</div></div><div style={{ display: 'none' }} className="w-password-page w-embed w-script"><input type="hidden" name="path" value="<%WF_FORM_VALUE_PATH% />" /><input type="hidden" name="page" value="<%WF_FORM_VALUE_PAGE% />" /></div><div style={{ display: 'none' }} className="w-password-page w-embed w-script"><script  type="application/javascript" dangerouslySetInnerHTML={{ __html: "(function _handlePasswordPageOnload() {\n\t  if (/[?&]e=1(&|$)/.test(document.location.search)) {\n\t    document.querySelector('.w-password-page.w-form-fail').style.display = 'block';\n\t  }\n\t})()" }} /></div></form></div></div>
    </>
  );
}
