import { useEffect } from 'react';
import { site } from '@/content/site';

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(path: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = `${site.url}${path}`;
}

function upsertLd(json: object) {
  let el = document.head.querySelector<HTMLScriptElement>('script[data-ld]');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.dataset.ld = '1';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

/** Per-route document head. Called from every page component. */
export function useSeo(title: string, description: string, path: string) {
  useEffect(() => {
    const full = path === '/' ? `${site.title} — ${site.tagline}` : `${title} — ${site.title}`;
    document.title = full;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', full);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', `${site.url}${path}`);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', site.title);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', full);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', `${site.url}/og-image.jpg`);

    upsertCanonical(path);

    upsertLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.title,
      url: site.url,
      description: site.description,
    });
  }, [title, description, path]);
}