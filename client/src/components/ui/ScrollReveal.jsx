import React, { useEffect, useRef } from 'react';

// Single shared IntersectionObserver instance to conserve resources
let sharedObserver = null;
const observerCallbacks = new Map();

function getSharedObserver() {
  if (typeof window === 'undefined') return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              observerCallbacks.delete(entry.target);
            }
            // Immediately unobserve once revealed to save CPU/memory
            sharedObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );
  }
  return sharedObserver;
}

/**
 * Viewport Scroll Reveal Component
 * - Reveals element smoothly only when scrolled into view
 * - Auto-unobserves immediately to prevent memory & scroll thrashing
 * - Respects prefers-reduced-motion
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      el.classList.add('is-revealed');
      return;
    }

    observerCallbacks.set(el, () => {
      if (delay > 0) {
        setTimeout(() => {
          if (el) el.classList.add('is-revealed');
        }, delay);
      } else {
        el.classList.add('is-revealed');
      }
    });

    observer.observe(el);

    return () => {
      if (observer && el) {
        observer.unobserve(el);
        observerCallbacks.delete(el);
      }
    };
  }, [delay]);

  return (
    <Component ref={ref} className={`reveal-item ${className}`} {...props}>
      {children}
    </Component>
  );
}
