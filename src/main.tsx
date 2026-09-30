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

/* Every real route ships its own index.html (scripts/gen-static.mjs), so Pages
 * serves /games/dragon-city directly with HTTP 200 and no redirect is involved.
 * The old sessionStorage hand-off from 404.html is gone because 404.html is now
 * reached only by paths that genuinely do not exist. */

/* GitHub Pages 301-redirects a directory request to its trailing-slash form,
 * so /games arrives as /games/ . React Router's <Route path="/games"> does not
 * match "/games/", which would hand a valid URL to the NotFound view. Strip the
 * trailing slash before the router reads the URL. Only one slash, never root. */
(function normalizeTrailingSlash() {
  const p = window.location.pathname;
  if (p.length > 1 && p.endsWith('/')) {
    const clean = p.replace(/\/+$/, '') || '/';
    window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
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
    /* An absolute path, not './sw.js'. A relative URL resolves against the
     * CURRENT document, so on /games/dragon-city it requested
     * /games/dragon-city/sw.js, got a 404, and the catch below swallowed it --
     * meaning any visitor whose FIRST page was a deep link never got a service
     * worker at all. '/' also pins the scope to the whole site root, which a
     * deeper script path could never do. */
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline support is optional; never break the page over it */
    });
  });
}