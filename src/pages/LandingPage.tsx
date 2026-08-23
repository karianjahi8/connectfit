import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Dumbbell, User, Building2, Store, Check, Bot, Flame, Trophy,
  Apple, Users, Heart, MessageSquare, CalendarDays, TrendingUp, Zap, Medal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { PhoneMockup, SCREENS, type ScreenId } from '@/components/motion/PhoneMockup';
import { BrandLoader } from '@/components/motion/BrandLoader';
import { ConfettiBurst } from '@/components/motion/Confetti';
import {
  EASE, Reveal, Stagger, StaggerItem, LiftCard, Magnetic, CountUp,
  AmbientGlow, Particles, GradientDivider, Parallax, CursorGlow, LightSweep,
} from '@/components/motion/primitives';

const stats = [
  { value: 500, suffix: '+', label: 'Verified trainers' },
  { value: 10, suffix: 'K+', label: 'Sessions booked' },
  { value: 40, suffix: '+', label: 'Countries live' },
  { value: 0, suffix: '%', label: 'FX fees' },
];

const personas = [
  {
    icon: Dumbbell,
    label: 'For Trainers',
    title: 'Build a global coaching business',
    benefits: [
      'Get paid in USDC instantly across borders',
      'Set your own rates, schedule, and session types',
      'Earn verifiable on-chain reputation',
      'Reach clients in 40+ countries from one profile',
    ],
    cta: { label: 'Become a trainer', to: '/auth' },
  },
  {
    icon: User,
    label: 'For Clients',
    title: 'Book fitness anywhere with confidence',
    benefits: [
      'Discover verified trainers and clubs worldwide',
      'See local prices, pay in stable USDC',
      'Escrow-backed bookings protect every session',
      'One wallet, one currency, no banking friction',
    ],
    cta: { label: 'Find a trainer', to: '/trainers' },
  },
  {
    icon: Building2,
    label: 'For Clubs',
    title: 'Fill classes and simplify operations',
    benefits: [
      'List your gym to a global, fitness-first audience',
      'Accept USDC payments with instant settlement',
      'Reduce no-shows with escrow-backed bookings',
      'Transparent cancellation and attendance tracking',
    ],
    cta: { label: 'List your club', to: '/auth' },
  },
  {
    icon: Store,
    label: 'For Merchants',
    title: 'Sell fitness gear without borders',
    benefits: [
      'Reach international fitness customers',
      'Receive USDC settlement, lower cross-border fees',
      'Integrated marketplace cart and order tracking',
      'Built for fitness commerce, not generic retail',
    ],
    cta: { label: 'Start selling', to: '/auth' },
  },
];

/* ---------------- Hero ---------------- */

const FLOATING = [
  { icon: Bot, label: 'AI Coach', sub: 'Plan adapted', pos: 'left-[-2%] top-[4%]', delay: 0.6 },
  { icon: Check, label: 'Workout complete', sub: '42:18 · 312 kcal', pos: 'right-[-1%] top-[16%]', delay: 0.75 },
  { icon: Zap, label: '+250 XP', sub: 'Level 7', pos: 'left-[-4%] top-[46%]', delay: 0.9 },
  { icon: Apple, label: 'Nutrition', sub: '1,840 / 2,400', pos: 'right-[-3%] top-[56%]', delay: 1.05 },
  { icon: Trophy, label: 'Challenge done', sub: '5K · 24:12', pos: 'left-[0%] bottom-[8%]', delay: 1.2 },
  { icon: Users, label: 'Community', sub: '3 friends joined', pos: 'right-[0%] bottom-[2%]', delay: 1.35 },
];

function FloatingCards() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {FLOATING.map((c, i) => (
        <motion.div
          key={c.label}
          className={`absolute ${c.pos} rounded-sm border border-border bg-card/85 px-3 py-2 backdrop-blur-sm`}
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: c.delay, ease: EASE }}
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, i % 2 ? 7 : -7, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2"
          >
            <c.icon className="h-4 w-4 text-primary" />
            <div className="leading-tight">
              <div className="text-[11px] font-semibold">{c.label}</div>
              <div className="text-[10px] text-muted-foreground">{c.sub}</div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function Hero() {
  const { isAuthenticated, login } = useAuth();
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] items-center overflow-hidden border-b border-border xl:min-h-[calc(100vh-5rem)]">
      <AmbientGlow />
      <Particles count={18} />

      <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <img src="/fitconnect-icon.png" alt="" className="h-11 w-11 rounded-sm" />
            <span className="eyebrow">FITCONNECT · BORDERLESS FITNESS</span>
          </motion.div>

          <motion.h1
            className="mb-6 font-display text-5xl font-bold leading-[0.95] text-balance sm:text-6xl md:text-7xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            Train smarter.
            <br />
            <span className="gradient-text">Get paid anywhere.</span>
          </motion.h1>

          <motion.p
            className="mb-9 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            A borderless marketplace for trainers, clients, clubs, and fitness merchants — one stable
            currency, verified reputation, ready on any phone.
          </motion.p>

          <motion.div
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
          >
            {isAuthenticated ? (
              <>
                <Magnetic>
                  <Link to="/trainers"><Button variant="hero" size="xl">Explore trainers<ArrowRight className="h-5 w-5" /></Button></Link>
                </Magnetic>
                <Magnetic strength={8}>
                  <Link to="/marketplace"><Button variant="outline" size="xl">Browse marketplace</Button></Link>
                </Magnetic>
              </>
            ) : (
              <>
                <Magnetic>
                  <Button onClick={login} variant="hero" size="xl">Get started</Button>
                </Magnetic>
                <Magnetic strength={8}>
                  <Link to="/trainers"><Button variant="outline" size="xl">Explore platform<ArrowRight className="h-5 w-5" /></Button></Link>
                </Magnetic>
              </>
            )}
          </motion.div>

          <Stagger className="mt-8 flex flex-wrap items-center gap-3" delay={0.4}>
            {['USDC settlement', 'No exchange rates', 'On-chain reputation', 'Installable PWA'].map((tag) => (
              <StaggerItem key={tag} y={10}>
                <span className="pill border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  {tag}
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="mb-1 font-display text-3xl font-bold md:text-4xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="relative"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, rotateX: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          style={{ perspective: 1200 }}
        >
          <FloatingCards />
          <Parallax distance={20}>
            <PhoneMockup screen="dashboard" />
          </Parallax>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Scroll storytelling ---------------- */

function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const i = Math.min(SCREENS.length - 1, Math.max(0, Math.floor(v * SCREENS.length)));
      setIndex(i);
    });
  }, [scrollYProgress]);

  const active = SCREENS[index];

  return (
    <section
      ref={ref}
      className="relative border-b border-border"
      style={{ height: `${SCREENS.length * 70}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <AmbientGlow />
        <div className="container relative mx-auto grid items-center gap-10 px-4 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <span className="eyebrow">THE APP</span>
            <AnimatePresence mode="sync">
              <motion.div
                key={active.id}
                className="absolute-none"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, position: 'absolute' }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <p className="mt-3 font-mono text-xs text-primary">{active.label}</p>
                <h2 className="mt-2 font-display text-3xl leading-tight text-balance sm:text-4xl">{active.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{active.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex gap-1.5">
              {SCREENS.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= index ? 'bg-primary' : 'bg-border'}`}
                />
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <PhoneMockup screen={active.id as ScreenId} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Gamification ---------------- */

function Gamification() {
  const ref = useRef<HTMLDivElement>(null);
  const [levelUp, setLevelUp] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-border py-24">
      <AmbientGlow />
      <div ref={ref} className="container relative mx-auto px-4">
        <Reveal className="mb-12 max-w-2xl">
          <span className="eyebrow">EVERY SESSION COUNTS</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-balance md:text-5xl">
            Training that <span className="gradient-text">rewards you back.</span>
          </h2>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div
            onViewportEnter={() => setTimeout(() => setLevelUp(true), 900)}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <LiftCard className="relative h-full overflow-hidden p-8">
              <LightSweep />
              <span className="eyebrow">WORKOUT COMPLETE</span>
              <div className="mt-4 flex flex-wrap items-end gap-8">
                <div>
                  <div className="font-display text-6xl font-bold">
                    +<CountUp to={250} /> <span className="text-2xl">XP</span>
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Session reward</div>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-7 w-7 text-accent" />
                  <span className="font-display text-4xl font-bold"><CountUp to={12} /></span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">day streak</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-2 flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                  <span>Level 6</span><span>Level 7</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: '82%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: EASE }}
                  />
                </div>
              </div>

              <div className="relative mt-8">
                <ConfettiBurst show={levelUp} />
                <AnimatePresence>
                  {levelUp && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="inline-flex items-center gap-2 rounded-sm border border-primary px-4 py-2"
                    >
                      <Medal className="h-4 w-4 text-primary" />
                      <span className="font-display text-lg font-bold">LEVEL UP</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </LiftCard>
          </motion.div>

          <Stagger className="grid gap-5">
            {[
              { icon: Trophy, title: 'Challenge badges', body: 'Weekly city challenges with verified results.' },
              { icon: Medal, title: 'Leaderboards', body: 'Club, city and country boards updating live.' },
              { icon: Zap, title: 'Streak multipliers', body: 'Consistency compounds into bigger rewards.' },
            ].map((b) => (
              <StaggerItem key={b.title}>
                <LiftCard className="p-6">
                  <motion.div
                    initial={{ y: -6 }}
                    whileInView={{ y: [0, -6, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <b.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="mt-3 font-display text-lg font-bold">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                </LiftCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Community ---------------- */

const FEED = [
  { icon: Heart, name: 'Amina K.', text: 'liked your 10K morning run', dir: -1 },
  { icon: MessageSquare, name: 'Tunde A.', text: 'commented: “That pace is unreal 🔥”', dir: 1 },
  { icon: Users, name: 'Grace M.', text: 'joined the City Ride 100km challenge', dir: -1 },
  { icon: Check, name: 'David O.', text: 'completed Push Day · 312 kcal', dir: 1 },
  { icon: TrendingUp, name: 'Nairobi board', text: 'you moved up to #2 this week', dir: -1 },
];

function Community() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[hsl(var(--background-secondary))] py-24">
      <div className="container relative mx-auto px-4">
        <Reveal className="mb-12 max-w-2xl">
          <span className="eyebrow">COMMUNITY</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-balance md:text-5xl">
            Training is better <span className="gradient-text">with your people.</span>
          </h2>
        </Reveal>

        <div className="mx-auto grid max-w-3xl gap-3">
          {FEED.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: f.dir * 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            >
              <LiftCard className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">
                  <span className="font-semibold">{f.name}</span>{' '}
                  <span className="text-muted-foreground">{f.text}</span>
                </p>
              </LiftCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trainer dashboard ---------------- */

function TrainerDashboard() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24">
      <AmbientGlow />
      <div className="container relative mx-auto px-4">
        <Reveal className="mb-12 max-w-2xl">
          <span className="eyebrow">FOR TRAINERS</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-balance md:text-5xl">
            Run the business, <span className="gradient-text">not the admin.</span>
          </h2>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <LiftCard className="h-full p-6">
              <span className="eyebrow">CLIENTS</span>
              <div className="mt-4 space-y-2">
                {['Sam N. · 3× / week', 'Ada I. · 2× / week', 'Joel K. · 1× / week'].map((c) => (
                  <div key={c} className="rounded-sm border border-border p-2.5 text-xs">{c}</div>
                ))}
              </div>
            </LiftCard>
          </StaggerItem>

          <StaggerItem>
            <LiftCard className="h-full p-6">
              <span className="eyebrow">EARNINGS</span>
              <div className="mt-3 font-display text-3xl font-bold">
                $<CountUp to={4820} decimals={0} />
              </div>
              <div className="mt-4 flex h-24 items-end gap-1.5">
                {[38, 52, 44, 66, 58, 80, 92].map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/80"
                    style={{ height: `${v}%`, originY: 1 }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                  />
                ))}
              </div>
            </LiftCard>
          </StaggerItem>

          <StaggerItem>
            <LiftCard className="h-full p-6">
              <span className="eyebrow">CALENDAR</span>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className={`aspect-square rounded-[2px] ${[3, 7, 11, 15, 18, 22, 26].includes(i) ? 'bg-primary' : 'bg-border'}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.012, ease: EASE }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> 7 sessions booked
              </div>
            </LiftCard>
          </StaggerItem>

          <StaggerItem>
            <LiftCard className="h-full p-6">
              <span className="eyebrow">MESSAGES</span>
              <div className="mt-4 space-y-2">
                {['“Can we move to 7am?”', '“Plan received, thanks!”', '“Booked next week ✅”'].map((m, i) => (
                  <motion.div
                    key={m}
                    className="rounded-sm border border-border p-2.5 text-xs text-muted-foreground"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.15 * i, ease: EASE }}
                  >
                    {m}
                  </motion.div>
                ))}
              </div>
            </LiftCard>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Progress analytics ---------------- */

function Ring({ pct, label }: { pct: number; label: string }) {
  const c = 2 * Math.PI * 44;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg viewBox="0 0 104 104" className="h-28 w-28 -rotate-90">
          <circle cx="52" cy="52" r="44" fill="none" strokeWidth="7" className="stroke-border" />
          <motion.circle
            cx="52" cy="52" r="44" fill="none" strokeWidth="7" strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - pct / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: EASE }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold">
          <CountUp to={pct} suffix="%" />
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function Analytics() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[hsl(var(--background-secondary))] py-24">
      <div className="container relative mx-auto px-4">
        <Reveal className="mb-12 max-w-2xl">
          <span className="eyebrow">PROGRESS</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-balance md:text-5xl">
            Proof you are <span className="gradient-text">getting better.</span>
          </h2>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <LiftCard className="flex h-full flex-wrap items-center justify-around gap-6 p-8">
              <Ring pct={82} label="Move" />
              <Ring pct={64} label="Load" />
              <Ring pct={91} label="Recover" />
            </LiftCard>
          </Reveal>

          <Reveal delay={0.1}>
            <LiftCard className="h-full p-8">
              <span className="eyebrow">WEEKLY VOLUME</span>
              <svg viewBox="0 0 320 120" className="mt-5 w-full">
                <motion.polyline
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-primary"
                  points="4,104 56,88 108,92 160,62 212,66 264,34 316,16"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: EASE }}
                />
              </svg>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { v: 18, s: '%', l: 'Volume up' },
                  { v: 4, s: ' min', l: 'Faster 5K' },
                  { v: 32, s: '', l: 'Sessions' },
                ].map((m) => (
                  <div key={m.l}>
                    <div className="font-display text-2xl font-bold"><CountUp to={m.v} suffix={m.s} /></div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
            </LiftCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

export default function LandingPage() {
  return (
    <Layout>
      <BrandLoader />
      <CursorGlow />
      <div className="min-h-screen">
        <Hero />
        <GradientDivider />
        <ScrollStory />
        <Gamification />
        <Community />
        <TrainerDashboard />
        <Analytics />

        {/* WHAT IS IN IT FOR YOU */}
        <section className="relative border-b border-border py-24 lg:py-32">
          <AmbientGlow />
          <div className="relative container mx-auto px-4">
            <Reveal className="mb-16 max-w-2xl">
              <div className="eyebrow mb-3">WHAT IS IN IT FOR YOU</div>
              <h2 className="font-display text-4xl font-bold leading-tight text-balance md:text-5xl">
                One platform.
                <br />
                <span className="gradient-text">Four ways to win.</span>
              </h2>
            </Reveal>

            <Stagger className="grid gap-5 md:grid-cols-2">
              {personas.map((persona) => (
                <StaggerItem key={persona.label}>
                  <LiftCard className="h-full">
                    <Card className="h-full border-0 bg-transparent shadow-none">
                      <CardContent className="p-6">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-border">
                            <persona.icon className="h-6 w-6 text-primary" />
                          </div>
                          <span className="eyebrow text-xs">{persona.label}</span>
                        </div>
                        <h3 className="mb-4 font-display text-xl font-bold">{persona.title}</h3>
                        <ul className="mb-6 space-y-3">
                          {persona.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <Link to={persona.cta.to}>
                          <Button variant="outline" size="sm" className="w-full">
                            {persona.cta.label}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </LiftCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-24">
          <AmbientGlow />
          <div className="relative container mx-auto max-w-4xl px-4">
            <Reveal>
              <LiftCard className="relative overflow-hidden">
                <LightSweep />
                <CardContent className="relative p-10 text-center md:p-16">
                  <div className="eyebrow mb-4">READY WHEN YOU ARE</div>
                  <h2 className="mb-4 font-display text-3xl font-bold leading-tight text-balance md:text-5xl">
                    Grow your fitness network.
                    <br />
                    <span className="gradient-text">Get paid anywhere.</span>
                  </h2>
                  <p className="mx-auto mb-10 max-w-2xl text-muted-foreground">
                    Join trainers, clients, clubs, and merchants building the borderless fitness economy on USDC.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Magnetic>
                      <Link to="/auth"><Button variant="hero" size="xl">Create account</Button></Link>
                    </Magnetic>
                    <Magnetic strength={8}>
                      <Link to="/install"><Button variant="outline" size="xl">Install on mobile</Button></Link>
                    </Magnetic>
                  </div>
                </CardContent>
              </LiftCard>
            </Reveal>
          </div>
        </section>
      </div>
    </Layout>
  );
}
