import { ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Activity, Bot, Dumbbell, Apple, Trophy, Medal, LineChart, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE, LightSweep } from './primitives';

export type ScreenId =
  | 'dashboard'
  | 'coach'
  | 'workout'
  | 'nutrition'
  | 'challenges'
  | 'leaderboard'
  | 'analytics';

export const SCREENS: { id: ScreenId; label: string; title: string; body: string }[] = [
  { id: 'dashboard', label: 'DASHBOARD', title: 'Your whole training life, one view.', body: 'Sessions, streaks, balance and next bookings the second you open the app.' },
  { id: 'coach', label: 'AI COACH', title: 'A coach that answers at 5am.', body: 'Adaptive plans and instant form guidance between sessions with your trainer.' },
  { id: 'workout', label: 'WORKOUT TRACKER', title: 'Every rep counted, every set logged.', body: 'Live tracking for gym, runs, rides and swims — auto-synced to your profile.' },
  { id: 'nutrition', label: 'NUTRITION', title: 'Fuel that matches the plan.', body: 'Macro targets that shift with your training load, not a generic calorie app.' },
  { id: 'challenges', label: 'CHALLENGES', title: 'Compete with your city.', body: 'Weekly challenges with real stakes, real rewards and verified results.' },
  { id: 'leaderboard', label: 'LEADERBOARD', title: 'Earn your place.', body: 'Community boards by club, city and country update as sessions complete.' },
  { id: 'analytics', label: 'PROGRESS ANALYTICS', title: 'Proof you are getting better.', body: 'Rings, trends and weekly deltas that turn effort into a visible curve.' },
];

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-sm border border-border bg-background p-3', className)}>{children}</div>;
}

function Bars({ values }: { values: number[] }) {
  return (
    <div className="flex h-20 items-end gap-1.5">
      {values.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm bg-primary/80"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ height: `${v}%`, originY: 1 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
        />
      ))}
    </div>
  );
}

function Ring({ pct, label }: { pct: number; label: string }) {
  const c = 2 * Math.PI * 26;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" className="stroke-border" />
        <motion.circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct / 100) }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </svg>
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function ScreenBody({ id }: { id: ScreenId }) {
  switch (id) {
    case 'coach':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold"><Bot className="h-4 w-4 text-primary" /> AI Coach</div>
          <Row className="text-[11px] text-muted-foreground">Legs felt heavy yesterday. What now?</Row>
          <Row className="bg-primary text-[11px] text-primary-foreground">Swap to a 30 min tempo ride + mobility. Squats move to Thursday.</Row>
          <Row className="text-[11px] text-muted-foreground">Add it to my plan</Row>
        </div>
      );
    case 'workout':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold"><Dumbbell className="h-4 w-4 text-primary" /> Push Day</div>
          {['Bench press · 4 × 8', 'Incline DB · 3 × 10', 'Cable fly · 3 × 12'].map((s) => (
            <Row key={s} className="flex items-center justify-between text-[11px]">
              <span>{s}</span><span className="text-primary">✓</span>
            </Row>
          ))}
          <Row className="text-[11px] font-semibold">42:18 elapsed · 312 kcal</Row>
        </div>
      );
    case 'nutrition':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold"><Apple className="h-4 w-4 text-primary" /> Today&apos;s fuel</div>
          <div className="grid grid-cols-3 gap-2">
            {[['Protein', 78], ['Carbs', 62], ['Fat', 45]].map(([l, v]) => (
              <Row key={l as string} className="p-2 text-center">
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{l}</div>
                <div className="mt-1 h-1 w-full rounded-full bg-border">
                  <motion.div className="h-1 rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9, ease: EASE }} />
                </div>
              </Row>
            ))}
          </div>
          <Row className="text-[11px] text-muted-foreground">1,840 / 2,400 kcal</Row>
        </div>
      );
    case 'challenges':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold"><Trophy className="h-4 w-4 text-primary" /> Live challenges</div>
          {['5K under 25:00', '12-day gym streak', 'City ride 100km'].map((c, i) => (
            <Row key={c} className="text-[11px]">
              <div className="flex justify-between"><span>{c}</span><span className="text-muted-foreground">{60 + i * 12}%</span></div>
              <div className="mt-1.5 h-1 w-full rounded-full bg-border">
                <motion.div className="h-1 rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${60 + i * 12}%` }} transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }} />
              </div>
            </Row>
          ))}
        </div>
      );
    case 'leaderboard':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold"><Medal className="h-4 w-4 text-primary" /> Nairobi · this week</div>
          {[['1', 'Amina K.', '4,820'], ['2', 'You', '4,510'], ['3', 'Tunde A.', '4,180'], ['4', 'Grace M.', '3,960']].map(([n, name, xp], i) => (
            <Row key={n} className={cn('flex items-center justify-between text-[11px]', name === 'You' && 'border-primary')}>
              <span className="text-muted-foreground">{n}. {name}</span><span className="font-semibold">{xp} XP</span>
            </Row>
          ))}
        </div>
      );
    case 'analytics':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold"><LineChart className="h-4 w-4 text-primary" /> Progress</div>
          <div className="flex justify-around"><Ring pct={82} label="Move" /><Ring pct={64} label="Load" /><Ring pct={91} label="Recover" /></div>
          <Row><Bars values={[35, 48, 40, 62, 55, 78, 88]} /></Row>
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold"><Activity className="h-4 w-4 text-primary" /> Good morning, Sam</div>
          <Row className="flex items-center justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Available balance</div>
              <div className="font-display text-lg">$1,284.50</div>
            </div>
            <Flame className="h-5 w-5 text-accent" />
          </Row>
          <Row><Bars values={[30, 55, 42, 70, 48, 82, 66]} /></Row>
          <Row className="flex items-center justify-between text-[11px]">
            <span>Next: HIIT with Amina</span><span className="text-muted-foreground">18:00</span>
          </Row>
        </div>
      );
  }
}

export function PhoneMockup({ screen, className }: { screen: ScreenId; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn('relative mx-auto w-[248px] sm:w-[276px]', className)}>
      {/* pulsing ring */}
      <motion.div
        aria-hidden
        className="absolute -inset-8 rounded-[3rem] bg-primary/10 blur-2xl"
        animate={reduced ? undefined : { opacity: [0.4, 0.75, 0.4], scale: [0.98, 1.03, 0.98] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-[0_40px_80px_-40px_hsl(var(--foreground)/0.45)]">
          <LightSweep />
          <div className="mx-auto mb-2 h-1 w-16 rounded-full bg-border" />
          <div className="relative h-[400px] overflow-hidden rounded-[1.35rem] border border-border bg-[hsl(var(--background-secondary))] p-3">
            <AnimatePresence mode="sync">
              <motion.div
                key={screen}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <ScreenBody id={screen} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
