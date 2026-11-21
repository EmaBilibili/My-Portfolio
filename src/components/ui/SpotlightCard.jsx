import { useRef } from 'react';

/**
 * Container card with a subtle cursor-tracking radial spotlight driven by CSS variables
 * to avoid React re-renders during pointer movement.
 */
export default function SpotlightCard({
  as = 'div',
  className = '',
  children,
  ...props
}) {
  const cardRef = useRef(null);
  const Tag = as;

  const handleMouseMove = (event) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    el.style.setProperty('--spot-opacity', '1');
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--spot-opacity', '0');
  };

  return (
    <Tag
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#111114] transition-colors duration-200 hover:border-white/[0.16] ${className}`}
      {...props}
    >
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
