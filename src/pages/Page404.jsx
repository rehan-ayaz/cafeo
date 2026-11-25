import React from 'react';
import { useCafeo } from '../hooks/useCafeo';

export default function Page404() {
  useCafeo('68184bed2f13168e1b06de38', '404 Not Found - Cafeo', 'body');

  return (
    <>
      <div className="utility-page-wrap error-page-wrap"><div className="utility-page-content error-page-content"><div className="page-pretitle-text">Page Not Found</div><h1 data-w-id="5d44351c-a648-0223-abe9-9189625a3ef9" className="error-page-title">4<span data-w-id="14d66e58-4378-0f10-9dfa-a8533af26de6" className="error-page-title-span">0</span>4</h1><h2 className="error-page-subtitle">Oops! Page not found</h2><div className="error-btn-block"><a href="/" className="btn-block w-inline-block"><div className="btn-text">Go home</div><div className="btn-border-block"><div className="border-top btn-border-line-white"></div><div className="border-right btn-border-line-white"></div><div className="border-bottom btn-border-line-white"></div><div className="border-left btn-border-line-white"></div></div></a></div></div></div>
    </>
  );
}
