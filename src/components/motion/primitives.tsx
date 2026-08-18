import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion';
import { cn } from '@/lib/utils';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Section / element reveal on scroll. Transform + opacity only. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children reveal 80ms apart. */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduced ? { opacity: 0 } : { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Card that lifts 8px with a soft shadow + border glow on hover. */
export function LiftCard({
  children,
  className,
  ...rest
}: HTMLMotionProps<'div'> & { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={cn(
        'rounded-sm border border-border bg-card transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_hsl(var(--foreground)/0.35)]',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Magnetic wrapper for CTAs — desktop only, disabled for reduced motion. */
export function Magnetic({ children, className, strength = 12 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
        y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up when it enters the viewport. */
export function CountUp({
  to,
  duration = 1.4,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const start = useRef<number | null>(null);
  const running = useRef(false);

  useEffect(() => {
    if (inView) {
      if (reduced) setValue(to);
      else running.current = true;
    }
  }, [inView, reduced, to]);

  useAnimationFrame((t) => {
    if (!running.current) return;
    if (start.current === null) start.current = t;
    const p = Math.min((t - start.current) / (duration * 1000), 1);
    const eased = 1 - Math.pow(1 - p, 3);
    setValue(to * eased);
    if (p === 1) running.current = false;
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Ambient drifting glow mesh. Purely decorative. */
export function AmbientGlow({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <motion.div
        className="absolute -left-24 top-0 h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-3xl"
        animate={reduced ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-accent/10 blur-3xl"
        animate={reduced ? undefined : { x: [0, -35, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/** Tiny floating particles — hero only, count reduced on mobile. */
export function Particles({ count = 18 }: { count?: number }) {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
  }, []);
  if (reduced) return null;
  const n = isMobile ? Math.round(count / 3) : count;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: n }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/30"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
          animate={{ y: [0, -22, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

/** Animated gradient hairline divider. */
export function GradientDivider() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="relative h-px w-full overflow-hidden bg-border">
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={reduced ? undefined : { x: ['-100%', '300%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/** Subtle parallax: shifts content by `distance` px across its scroll range. */
export function Parallax({ children, distance = 16, className }: { children: ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Cursor glow — desktop pointers only. */
export function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(-500), { stiffness: 120, damping: 20 });
  const y = useSpring(useMotionValue(-500), { stiffness: 120, damping: 20 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[60] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-3xl"
      style={{ left: x, top: y }}
    />
  );
}

/** Light sweep across mockups. */
export function LightSweep() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-background/50 to-transparent"
      style={{ width: '60%' }}
      animate={{ x: ['-80%', '250%'] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
    />
  );
}
