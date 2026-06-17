'use client';

import { useEffect, useRef } from 'react';

/**
 * Reveal — fades + slides child into view when it enters the viewport.
 * Pure CSS for the animation; this component only toggles `.is-visible`.
 *
 * Usage:
 *   <Reveal>            <div>...</div> </Reveal>
 *   <Reveal delay={150}> <div>...</div> </Reveal>   // staggered
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { '--delay': `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
