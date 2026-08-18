import { motion, useReducedMotion } from 'framer-motion';

const PIECES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  x: (i % 2 ? 1 : -1) * (12 + (i * 9) % 110),
  y: -(40 + (i * 17) % 90),
  rot: (i * 47) % 360,
  cls: i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-accent' : 'bg-foreground/60',
}));

/** Lightweight transform-only confetti burst. */
export function ConfettiBurst({ show }: { show: boolean }) {
  const reduced = useReducedMotion();
  if (!show || reduced) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
      {PIECES.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute h-1.5 w-1.5 rounded-[1px] ${p.cls}`}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot, scale: 0.6 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
