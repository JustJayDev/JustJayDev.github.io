import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { ThemeProvider } from './lib/theme';

// Token layer first, then base, then components. No versioned identity files.
import './styles/tokens.css';
import './styles/keyframes.css';
import './styles/base.css';
import './styles/components.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);

// Restore the real path before React Router reads location, so deep links work
// on a static host that serves index.html for every path.
(function restoreSpaPath() {
  const key = 'jj-spa-path';
  if (window.location.pathname === '/' || window.location.pathname.endsWith('.html')) return;
  const real = window.sessionStorage.getItem(key);
  if (real && real !== window.location.pathname) {
    window.history.replaceState(null, '', real + window.location.search + window.location.hash);
    window.sessionStorage.removeItem(key);
  }
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* offline support is optional; never break the page over it */
    });
  });
}