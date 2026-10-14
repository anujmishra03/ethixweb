import React, { useRef, useEffect } from 'react';

/**
 * Accessible Magnetic Button Wrapper
 * - Applies subtle, restrained magnetic pull on desktop
 * - Zero JS execution on touch devices or reduced motion
 * - Full keyboard focus & accessibility compliance
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.22,
  maxOffset = 6,
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    let animId = null;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = Math.max(-maxOffset, Math.min(maxOffset, (e.clientX - centerX) * strength));
      const dy = Math.max(-maxOffset, Math.min(maxOffset, (e.clientY - centerY) * strength));

      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    };

    const handleMouseLeave = () => {
      if (animId) cancelAnimationFrame(animId);
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [strength, maxOffset]);

  return (
    <Component ref={ref} className={`magnetic-wrap ${className}`} {...props}>
      {children}
    </Component>
  );
}
