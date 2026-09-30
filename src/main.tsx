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

/* On a static host with no SPA rewrites, a request for /games/dragon-city is
 * served 404.html, which bounces to "/" and stashes the original path. This runs
 * BEFORE React Router mounts so the router reads the real path. */
(function restoreSpaPath() {
  try {
    const key = 'jj-spa-path';
    const real = window.sessionStorage.getItem(key);
    if (!real) return;
    window.sessionStorage.removeItem(key);
    if (real === window.location.pathname) return;
    window.history.replaceState(null, '', real);
  } catch (e) {
    /* private mode / storage disabled — the site still works, just at "/" */
  }
})();

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* offline support is optional; never break the page over it */
    });
  });
}