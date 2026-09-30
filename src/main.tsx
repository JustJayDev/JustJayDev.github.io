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
 * so /games arrives as /games/. React Router's <Route path="/games"> does not
 * match "/games/", which would hand a valid URL to the NotFound view -- so
 * normalise the path before the router reads it. Never from the root.
 *
 * Repeated slashes are collapsed in the same pass. A URL like //devlog/ used
 * to make history.replaceState throw a SecurityError, and because this IIFE
 * runs before createRoot, that throw aborted main.tsx and left the visitor
 * with nothing but the <noscript> fallback -- a blank site on what is really a
 * valid route. A crawler, a hand-typed link or a bad redirect can all produce
 * one. The rewrite must also stay same-origin, so a leading '//' is left
 * untouched rather than being read as a protocol-relative URL. */
(function normalizePath() {
  const raw = window.location.pathname;
  if (raw.length <= 1 || !/\/{2,}|\/$/.test(raw)) return;
  const clean =
    ('/' + raw.replace(/\/{2,}/g, '/').replace(/\/+$/, '')).replace(/\/$/, '') || '/';
  const next = clean + window.location.search + window.location.hash;
  if (next.startsWith('//')) return;
  try {
    window.history.replaceState(null, '', next);
  } catch {
    /* Never let a history write take the whole app down; the router reads the
     * current path either way. */
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