import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// SPA fallback completion: 404.html forwards deep links as /?p=<path> — restore the real route
// before React Router reads location, so shared URLs like /play render the Play page.
(function restoreSpaPath() {
  const l = window.location;
  const m = l.search.match(/[?&]p=([^&]+)/);
  if (!m) return;
  const path = m[1].replace(/~and~/g, '&');
  let rest = l.search.replace(/[?&]p=[^&]+/, '');
  if (rest.startsWith('&')) rest = '?' + rest.slice(1); // "?p=x&y=1" → "?y=1"
  window.history.replaceState(null, '', (path.startsWith('/') ? path : '/' + path) + rest + l.hash);
})();

// PWA service worker (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);