import { useEffect } from 'react';
import { blogMetadata } from './metadata';

export function useBlogHead({ post, missing, image }) {
  useEffect(() => {
    // Restore the original shell metadata before managing a prebuilt page.
    const originalHead = document.getElementById('cafeo-original-head');
    if (originalHead) {
      document.head.querySelectorAll('[data-cafeo-blog]').forEach(element => element.remove());
      const restored = document.createElement('template');
      restored.innerHTML = JSON.parse(originalHead.textContent);
      document.head.append(restored.content);
      originalHead.remove();
    }
    const data = blogMetadata(post, image, missing);
    const changes = [];
    document.title = data.title;
    function tag(selector, type, attrs) {
      const existing = document.head.querySelector(selector);
      const element = existing || document.createElement(type);
      const previous = Object.fromEntries(Object.keys(attrs).map(key => [key, element.getAttribute(key)]));
      Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
      if (!existing) document.head.append(element);
      changes.push(() => {
        if (!existing) element.remove();
        else Object.entries(previous).forEach(([key, value]) =>
          value === null ? element.removeAttribute(key) : element.setAttribute(key, value));
      });
    }
    for (const [attribute, key, content] of data.meta) {
      tag('meta[' + attribute + '="' + key + '"]', 'meta', { [attribute]: key, content });
    }
    if (data.canonical) tag('link[rel=canonical]', 'link', { rel: 'canonical', href: data.canonical });
    if (data.schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data.schema);
      document.head.append(script);
      changes.push(() => script.remove());
    }
    return () => changes.reverse().forEach(undo => undo());
  }, [post, missing, image?.url, image?.alt]);
}
