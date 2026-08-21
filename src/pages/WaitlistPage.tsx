import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Dumbbell,
  User,
  Building2,
  Store,
  Globe2,
  ShieldCheck,
  Zap,
  Loader2,
  Flame,
  Trophy,
  Heart,
  MessageCircle,
  UserPlus,
  Activity,
  CalendarDays,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AmbientGlow,
  CountUp,
  CursorGlow,
  EASE,
  GradientDivider,
  LiftCard,
  Magnetic,
  Parallax,
  Particles,
  Reveal,
  Stagger,
  StaggerItem,
} from '@/components/motion/primitives';
import { PhoneMockup, SCREENS, type ScreenId } from '@/components/motion/PhoneMockup';
import { ConfettiBurst } from '@/components/motion/Confetti';

type Persona = 'trainer' | 'client' | 'club' | 'merchant';

const personas: { id: Persona; label: string; icon: typeof User; line: string }[] = [
  { id: 'trainer', label: 'Trainer', icon: Dumbbell, line: 'Coach globally, get paid instantly.' },
  { id: 'client', label: 'Client', icon: User, line: 'Book verified coaching anywhere.' },
  { id: 'club', label: 'Club', icon: Building2, line: 'Fill classes, settle same-day.' },
  { id: 'merchant', label: 'Merchant', icon: Store, line: 'Sell gear across borders.' },
];

const valueProps = [
  {
    icon: Globe2,
    title: 'Borderless by default',
    body: 'One profile reaches clients in 40+ countries. Prices display in local currency, settlement stays stable.',
  },
  {
    icon: Zap,
    title: 'Money that moves at session speed',
    body: 'USDC settlement means payouts land in seconds, not banking days — no FX spread eating your rate.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust you can verify',
    body: 'Escrow-backed bookings and verifiable session history replace screenshots and word of mouth.',
  },
];

const steps = [
  { n: '01', t: 'Join the waitlist', d: 'Tell us how you move — trainer, client, club, or merchant.' },
  { n: '02', t: 'Get early access', d: 'We onboard in country batches so your first matches are real.' },
  { n: '03', t: 'Train and get paid', d: 'Book, deliver, settle. Reputation builds with every session.' },
];

const faqs = [
  { q: 'What does it cost to join?', a: 'The waitlist is free. Founding members get reduced platform fees for their first year.' },
  { q: 'Do I need a wallet or any web3 experience?', a: 'No. A secure wallet is created for you in the background — you just see an available balance, like any banking app.' },
  { q: 'When does access open?', a: 'We open access in country batches. Early signups from a country move that market up the queue.' },
  { q: 'Which countries are supported?', a: 'We are launching across Africa, Latin America, Europe, and North America first, with more added monthly.' },
];

const floatingCards = [
  { label: 'AI Coach', icon: Zap, pos: 'left-0 top-10', drift: -10 },
  { label: 'Workout Complete', icon: Check, pos: 'right-0 top-24', drift: 12 },
  { label: '+250 XP', icon: Trophy, pos: 'left-2 top-1/2', drift: 8 },
  { label: 'Nutrition', icon: Activity, pos: 'right-2 top-1/2', drift: -8 },
  { label: 'Challenge Complete', icon: Flame, pos: 'left-0 bottom-16', drift: 10 },
  { label: 'Community', icon: Heart, pos: 'right-0 bottom-8', drift: -12 },
];

const milestones = [
  { n: 1, t: '1 referral', d: 'Skip 250 places in the queue' },
  { n: 3, t: '3 referrals', d: 'Founding member badge on your profile' },
  { n: 5, t: '5 referrals', d: 'Zero platform fees for 3 months' },
  { n: 10, t: '10 referrals', d: 'Priority verification + featured listing' },
];

const feed = [
  { icon: Heart, text: 'Amina liked your 5K time', side: -1 },
  { icon: MessageCircle, text: '“Same session tomorrow?” — Coach Tunde', side: 1 },
  { icon: UserPlus, text: 'Grace joined the 12-day streak challenge', side: -1 },
  { icon: Check, text: 'Workout completed · Push day · 42:18', side: 1 },
  { icon: Trophy, text: 'You moved to #2 on the Nairobi board', side: -1 },
];

function GlassCard({ label, icon: Icon }: { label: string; icon: typeof Zap }) {
  return (
    <div className="flex items-center gap-2 rounded-sm border border-border bg-card/70 px-3 py-2 text-[11px] font-semibold shadow-[0_10px_30px_-20px_hsl(var(--foreground)/0.4)] backdrop-blur-md">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {label}
    </div>
  );
}

function WaitlistForm({ id, compact = false }: { id: string; compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [persona, setPersona] = useState<Persona>('client');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  const valid = useMemo(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()), [email]);
  const referral = useMemo(() => {
    const code = Math.abs(email.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7)).toString(36).slice(0, 6).toUpperCase();
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/waitlist?ref=${code || 'EARLY'}`;
  }, [email]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    const { error } = await supabase.from('waitlist_signups').insert({
      email: email.trim().toLowerCase(),
      persona,
      referral_source: typeof document !== 'undefined' ? document.referrer || null : null,
    });
    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        setDone(true);
        toast.success("You're already on the list — we'll be in touch.");
        return;
      }
      toast.error('Something went wrong. Please try again.');
      return;
    }
    setDone(true);
    toast.success("You're on the list.");
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative overflow-hidden rounded-sm border border-primary/40 bg-card p-5 text-left"
      >
        <div className="relative">
          <ConfettiBurst show />
        </div>
        <span className="eyebrow">WELCOME TO CONNECTFIT</span>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <span className="font-display text-3xl">
            +<CountUp to={500} duration={1.2} /> XP
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
            className="rounded-sm border border-primary bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Founding member
          </motion.span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Queue position</span>
            <span>#<CountUp to={1284} duration={1.4} /></span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 0.38 }}
              style={{ originX: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            />
          </div>
        </div>

        <div className="mt-4">
          <span className="eyebrow">Your referral link</span>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded-sm border border-border bg-background px-3 py-2 font-mono text-[11px]">{referral}</code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 shrink-0"
              onClick={() => {
                navigator.clipboard?.writeText(referral);
                setCopied(true);
                toast.success('Referral link copied');
                setTimeout(() => setCopied(false), 1800);
              }}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {milestones.map((m, i) => (
            <motion.li
              key={m.n}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.45, ease: EASE }}
              className="flex items-center justify-between gap-3 border-t border-border pt-2 text-xs"
            >
              <span className="font-semibold">{m.t}</span>
              <span className="text-muted-foreground">{m.d}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full text-left" aria-labelledby={`${id}-label`}>
      {!compact && (
        <>
          <span id={`${id}-label`} className="eyebrow mb-2 block">
            I&apos;m joining as
          </span>
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {personas.map((p) => {
              const active = persona === p.id;
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => setPersona(p.id)}
                  aria-pressed={active}
                  whileHover={reduced ? undefined : { scale: 1.03 }}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className={`relative flex items-center gap-2 rounded-sm border px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:bg-secondary'
                  }`}
                >
                  <p.icon className="h-4 w-4 shrink-0" />
                  {p.label}
                </motion.button>
              );
            })}
          </div>
        </>
      )}

      <div className="relative flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          aria-label="Email address"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 bg-card text-base"
        />
        <div className="relative sm:w-auto">
          {!reduced && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-sm bg-primary/20 blur-lg"
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <Magnetic className="relative block w-full">
            <Button type="submit" size="xl" disabled={loading} className="h-12 w-full sm:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Join the waitlist <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </Magnetic>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Free to join · No spam · Founding members get reduced fees for year one.
      </p>
    </form>
  );
}

/** Scroll-driven storytelling: phone stays pinned while screens change. */
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
    <section ref={ref} className="relative border-b border-border" style={{ height: `${SCREENS.length * 70}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <AmbientGlow />
        <div className="container relative mx-auto grid items-center gap-10 px-4 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <span className="eyebrow">THE APP</span>
            <AnimatePresence mode="sync">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <p className="mt-3 font-mono text-xs text-primary">{active.label}</p>
                <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl text-balance">{active.title}</h2>
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

function GamificationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setLevelUp(true), 1200);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-border bg-[hsl(var(--background-secondary))]">
      <AmbientGlow />
      <div className="container relative mx-auto px-4 py-16 sm:py-24">
        <Reveal>
          <span className="eyebrow">PROGRESS THAT PAYS</span>
          <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl text-balance">
            Every session earns you something real.
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          <StaggerItem>
            <LiftCard className="relative overflow-hidden p-6">
              <span className="eyebrow">WORKOUT COMPLETE</span>
              <div className="mt-2 font-display text-4xl">
                +<CountUp to={250} /> XP
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 0.72 }}
                  viewport={{ once: true }}
                  style={{ originX: 0 }}
                  transition={{ duration: 1.2, ease: EASE }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">720 / 1000 to Level 8</p>
              <AnimatePresence>
                {levelUp && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="relative mt-4 inline-flex items-center gap-2 rounded-sm border border-primary bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground"
                  >
                    Level up
                    <ConfettiBurst show={levelUp} />
                  </motion.div>
                )}
              </AnimatePresence>
            </LiftCard>
          </StaggerItem>

          <StaggerItem>
            <LiftCard className="p-6">
              <span className="eyebrow">GYM STREAK</span>
              <div className="mt-2 flex items-center gap-2 font-display text-4xl">
                <Flame className="h-7 w-7 text-accent" />
                <CountUp to={12} /> days
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: EASE }}
                    className={`h-5 rounded-sm ${i < 12 ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Checked in at your club, verified on arrival.</p>
            </LiftCard>
          </StaggerItem>

          <StaggerItem>
            <LiftCard className="p-6">
              <span className="eyebrow">LEADERBOARD</span>
              <ul className="mt-3 space-y-2">
                {[['Amina K.', 4820], ['You', 4510], ['Tunde A.', 4180]].map(([n, v], i) => (
                  <motion.li
                    key={n as string}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                    className={`flex items-center justify-between rounded-sm border px-3 py-2 text-sm ${n === 'You' ? 'border-primary' : 'border-border'}`}
                  >
                    <span>{i + 1}. {n as string}</span>
                    <span className="font-semibold"><CountUp to={v as number} /> XP</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                {['🥇', '🔥', '💪'].map((b, i) => (
                  <motion.span
                    key={b}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 300, damping: 14 }}
                    className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-background text-base"
                  >
                    {b}
                  </motion.span>
                ))}
              </div>
            </LiftCard>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <Reveal>
          <span className="eyebrow">LIVE COMMUNITY</span>
          <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl text-balance">
            Training is better when someone is watching.
          </h2>
        </Reveal>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {feed.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: f.side * 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
            >
              <LiftCard className="flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border">
                  <f.icon className="h-4 w-4 text-primary" />
                </span>
                <p className="text-sm">{f.text}</p>
              </LiftCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrainerSection() {
  const bars = [42, 58, 51, 74, 66, 88, 95];
  return (
    <section className="border-b border-border bg-[hsl(var(--background-secondary))]">
      <div className="container mx-auto grid items-center gap-10 px-4 py-16 sm:py-24 md:grid-cols-2">
        <Reveal>
          <span className="eyebrow">FOR TRAINERS</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-balance">A business dashboard, not a chat thread.</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Clients, plans, progress, calendar and messages in one place — with settlement that clears the same day.
          </p>
          <Stagger className="mt-6 space-y-2" gap={0.08}>
            {['12 active clients', '38 plans delivered this month', '4.9 average session rating'].map((t) => (
              <StaggerItem key={t}>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" /> {t}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>

        <Parallax distance={14}>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            <StaggerItem className="sm:col-span-2">
              <LiftCard className="p-5">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">MONTHLY EARNINGS</span>
                  <span className="font-display text-lg">$<CountUp to={4820} /></span>
                </div>
                <div className="mt-4 flex h-24 items-end gap-2">
                  {bars.map((b, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-sm bg-primary/80"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      style={{ height: `${b}%`, originY: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
                    />
                  ))}
                </div>
              </LiftCard>
            </StaggerItem>
            <StaggerItem>
              <LiftCard className="p-5">
                <CalendarDays className="h-4 w-4 text-primary" />
                <p className="mt-3 text-sm font-semibold">Today · 5 sessions</p>
                <p className="mt-1 text-xs text-muted-foreground">06:00 · 09:30 · 12:00 · 17:00 · 19:30</p>
              </LiftCard>
            </StaggerItem>
            <StaggerItem>
              <LiftCard className="p-5">
                <MessageCircle className="h-4 w-4 text-primary" />
                <p className="mt-3 text-sm font-semibold">3 new messages</p>
                <p className="mt-1 text-xs text-muted-foreground">Grace, Sam and Tunde are waiting on plans.</p>
              </LiftCard>
            </StaggerItem>
          </Stagger>
        </Parallax>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  const rings = [
    { pct: 82, label: 'Consistency' },
    { pct: 64, label: 'Strength' },
    { pct: 91, label: 'Recovery' },
  ];
  const c = 2 * Math.PI * 40;
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <Reveal>
          <span className="eyebrow">PROGRESS ANALYTICS</span>
          <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl text-balance">Proof, not vibes.</h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Stagger className="grid grid-cols-3 gap-4">
            {rings.map((r) => (
              <StaggerItem key={r.label}>
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" strokeWidth="8" className="stroke-border" />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="stroke-primary"
                      strokeDasharray={c}
                      initial={{ strokeDashoffset: c }}
                      whileInView={{ strokeDashoffset: c * (1 - r.pct / 100) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.3, ease: EASE }}
                    />
                  </svg>
                  <span className="mt-2 font-display text-lg"><CountUp to={r.pct} suffix="%" /></span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.label}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <LiftCard className="p-5">
              <span className="eyebrow">12-WEEK TREND</span>
              <svg viewBox="0 0 300 110" className="mt-4 w-full">
                <motion.polyline
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-primary"
                  points="0,95 30,88 60,74 90,78 120,60 150,52 180,55 210,38 240,30 270,22 300,10"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: EASE }}
                />
              </svg>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
                {[['Sessions', 46], ['Streak best', 21], ['PRs', 9]].map(([l, v]) => (
                  <div key={l as string}>
                    <div className="font-display text-xl"><CountUp to={v as number} /></div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
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

export default function WaitlistPage() {
  const [showSticky, setShowSticky] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const phoneY = useTransform(scrollY, [0, 600], [0, -60]);

  useEffect(() => {
    const onScroll = () => {
      setShowSticky(window.scrollY > 640);
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = reduced ? 'auto' : 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <CursorGlow />

      {/* Slim glass top bar */}
      <header
        className={`sticky top-0 z-40 border-b border-border backdrop-blur transition-colors duration-300 ${
          scrolled ? 'bg-background/95' : 'bg-background/60'
        }`}
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/fitconnect-icon.png" alt="" className="h-7 w-7 rounded-sm" />
            <span className="font-display text-base">FitConnect</span>
          </Link>
          <Magnetic>
            <a href="#join" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Join
            </a>
          </Magnetic>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section ref={heroRef} className="relative overflow-hidden border-b border-border">
          <AmbientGlow />
          <Particles count={18} />
          <div className="container relative mx-auto grid items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div>
              <motion.span
                className="eyebrow block"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              >
                EARLY ACCESS · 40+ COUNTRIES
              </motion.span>
              <motion.h1
                className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl text-balance"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              >
                Train anywhere.
                <br />
                Get paid anywhere.
              </motion.h1>
              <motion.p
                className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
              >
                FitConnect is the borderless fitness marketplace for trainers, clients, clubs, and gear
                merchants — one stable currency, verified reputation, instant settlement.
              </motion.p>

              <motion.div
                id="join"
                className="mt-8 max-w-2xl scroll-mt-20"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
              >
                <WaitlistForm id="hero" />
              </motion.div>

              <Stagger className="mt-10 grid max-w-2xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4" delay={0.2}>
                {[
                  ['500+', 'Trainers waitlisted'],
                  ['40+', 'Countries'],
                  ['0%', 'FX fees'],
                  ['<60s', 'Payout time'],
                ].map(([v, l]) => (
                  <StaggerItem key={l}>
                    <div className="font-display text-2xl sm:text-3xl">{v}</div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* Phone + orbiting glass cards */}
            <motion.div
              className="relative hidden lg:block"
              style={reduced ? undefined : { y: phoneY }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 80, rotateX: 12, rotateZ: -3 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            >
              <div className="relative mx-auto max-w-[420px]">
                <PhoneMockup screen="dashboard" />
                {floatingCards.map((c, i) => (
                  <motion.div
                    key={c.label}
                    className={`absolute ${c.pos}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      reduced
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, scale: 1, y: [0, c.drift, 0], x: [0, c.drift / 2, 0] }
                    }
                    transition={{
                      opacity: { duration: 0.5, delay: 0.45 + i * 0.08 },
                      scale: { duration: 0.5, delay: 0.45 + i * 0.08 },
                      y: { duration: 7 + i, repeat: Infinity, ease: 'easeInOut' },
                      x: { duration: 9 + i, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  >
                    <GlassCard label={c.label} icon={c.icon} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mobile phone (no parallax, lighter) */}
            <div className="lg:hidden">
              <PhoneMockup screen="dashboard" />
            </div>
          </div>
          <GradientDivider />
        </section>

        {/* SCROLL STORYTELLING */}
        <ScrollStory />

        {/* VALUE PROPS */}
        <section className="border-b border-border bg-[hsl(var(--background-secondary))]">
          <Stagger className="container mx-auto grid gap-0 px-4 py-14 sm:py-20 md:grid-cols-3">
            {valueProps.map((v) => (
              <StaggerItem
                key={v.title}
                className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0 md:first:border-l-0 md:first:pl-0"
              >
                <motion.div
                  initial={{ y: 0 }}
                  whileInView={{ y: [0, -6, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <v.icon className="h-5 w-5 text-primary" />
                </motion.div>
                <h2 className="mt-4 font-display text-xl">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* GAMIFICATION */}
        <GamificationSection />

        {/* COMMUNITY */}
        <CommunitySection />

        {/* TRAINERS */}
        <TrainerSection />

        {/* ANALYTICS */}
        <AnalyticsSection />

        {/* PERSONAS */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <Reveal>
              <span className="eyebrow">WHO IT&apos;S FOR</span>
              <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl text-balance">
                Four sides of the fitness economy, one network.
              </h2>
            </Reveal>
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {personas.map((p) => (
                <StaggerItem key={p.id}>
                  <LiftCard className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-border">
                        <p.icon className="h-4 w-4 text-primary" />
                      </span>
                      <span className="eyebrow">{p.label}</span>
                    </div>
                    <p className="mt-4 font-display text-lg">{p.line}</p>
                  </LiftCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-b border-border bg-[hsl(var(--background-secondary))]">
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <Reveal>
              <span className="eyebrow">HOW EARLY ACCESS WORKS</span>
            </Reveal>
            <Stagger className="mt-8 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <StaggerItem key={s.n} className="border-t border-border pt-5">
                  <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  <h3 className="mt-2 font-display text-xl">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <Reveal>
              <span className="eyebrow">QUESTIONS</span>
              <div className="mt-6 max-w-2xl divide-y divide-border border-y border-border">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg">
                      {f.q}
                      <span className="text-muted-foreground transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden">
          <AmbientGlow />
          <div className="container relative mx-auto px-4 py-16 sm:py-24">
            <Reveal>
              <div className="mx-auto max-w-2xl rounded-sm border border-border bg-card p-6 text-center sm:p-10">
                <span className="eyebrow">READY WHEN YOU ARE</span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl text-balance">
                  Claim your spot before your country opens.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Early signups decide which markets we launch first.
                </p>
                <div className="mt-6">
                  <WaitlistForm id="footer-cta" compact />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} FitConnect</span>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/" className="hover:text-foreground">Explore the app</Link>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a href="#join">
          <Button size="xl" className="h-12 w-full">
            Join the waitlist <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </motion.div>
  );
}
