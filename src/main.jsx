import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ReservationCartProvider } from './components/ReservationCart';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReservationCartProvider>
        <App />
      </ReservationCartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
