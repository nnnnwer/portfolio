import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '../constants/site';

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

/** Sets the page title, description, Open Graph tags and canonical URL. */
export function useDocumentMeta({ title, description = DEFAULT_DESCRIPTION, noIndex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Computer Engineering Graduate`;
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('name', 'robots', noIndex ? 'noindex' : 'index, follow');

    if (SITE_URL) {
      const url = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
      setMeta('property', 'og:url', url);
      setCanonical(url);
    }
  }, [title, description, noIndex, pathname]);
}
