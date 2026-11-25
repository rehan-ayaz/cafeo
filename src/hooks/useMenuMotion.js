import { useLayoutEffect, useRef } from 'react';

let gsapRequested = false;

export function useMenuMotion(activeTab, setActiveTab) {
  const grid = useRef(null);
  const before = useRef(null);
  const cleanup = useRef([]);

  function stopAnimations() {
    cleanup.current.splice(0).forEach(stop => stop());
  }

  useLayoutEffect(() => {
    if (window.gsap || gsapRequested || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsapRequested = true;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
    script.async = true;
    document.head.append(script);
  }, []);

  function selectTab(index) {
    if (index === activeTab) return;
    const cards = [...grid.current.children];
    before.current = matchMedia('(prefers-reduced-motion: reduce)').matches ? null
      : new Map(cards.map(card => [card.dataset.menuItem, {
          card,
          rect: card.getBoundingClientRect(),
          opacity: getComputedStyle(card).opacity,
        }]));
    stopAnimations();
    setActiveTab(index);
  }

  useLayoutEffect(() => {
    const previous = before.current;
    before.current = null;
    if (!previous) return;

    function animate(element, from, to, duration, done) {
      if (window.gsap) {
        const tween = window.gsap.fromTo(element, from, {
          ...to, duration, ease: 'power2.out', clearProps: 'transform,opacity', onComplete: done,
        });
        cleanup.current.push(() => {
          tween.kill();
          element.style.removeProperty('transform');
          element.style.removeProperty('opacity');
          done?.();
        });
      } else {
        const motion = element.animate([from, to], {
          duration: duration * 1000, easing: 'cubic-bezier(.2,.7,.3,1)',
        });
        motion.onfinish = done ?? null;
        cleanup.current.push(() => { motion.cancel(); done?.(); });
      }
    }

    for (const card of grid.current.children) {
      const id = card.dataset.menuItem;
      const old = previous.get(id);
      const next = card.getBoundingClientRect();
      const transform = old
        ? `translate(${old.rect.left - next.left}px, ${old.rect.top - next.top}px)`
        : 'translateY(12px)';
      animate(card, { transform, opacity: old?.opacity ?? 0 },
        { transform: 'translate(0px, 0px)', opacity: 1 }, .42);
      previous.delete(id);
    }

    for (const { card, rect, opacity } of previous.values()) {
      const ghost = card.cloneNode(true);
      ghost.inert = true;
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, {
        position: 'absolute', pointerEvents: 'none', zIndex: 2,
        left: `${rect.left + window.scrollX}px`,
        top: `${rect.top + window.scrollY}px`,
        width: `${rect.width}px`, height: `${rect.height}px`,
      });
      document.body.append(ghost);
      animate(ghost, { transform: 'translateY(0px)', opacity },
        { transform: 'translateY(8px)', opacity: 0 }, .24, () => ghost.remove());
    }
  }, [activeTab]);

  useLayoutEffect(() => stopAnimations, []);
  return { grid, selectTab };
}
