import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from './primitives';

/** Brand loading experience — under 1.5s, then fades into the page. */
export function BrandLoader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduced ? 200 : 1300);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          aria-hidden
        >
          <div className="relative">
            <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
              <motion.circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                strokeWidth="2"
                className="stroke-primary"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: EASE }}
              />
            </svg>
            <motion.img
              src="/fitconnect-icon.png"
              alt=""
              className="absolute inset-0 m-auto h-10 w-10 rounded-sm"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
          <div className="mt-6 h-0.5 w-32 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 1.15, ease: 'easeInOut' }}
            />
          </div>
          <span className="mt-4 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">ConnectFit</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
