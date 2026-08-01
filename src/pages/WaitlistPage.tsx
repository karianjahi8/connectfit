import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  {
    q: 'What does it cost to join?',
    a: 'The waitlist is free. Founding members get reduced platform fees for their first year.',
  },
  {
    q: 'Do I need a wallet or any web3 experience?',
    a: 'No. A secure wallet is created for you in the background — you just see an available balance, like any banking app.',
  },
  {
    q: 'When does access open?',
    a: 'We open access in country batches. Early signups from a country move that market up the queue.',
  },
  {
    q: 'Which countries are supported?',
    a: 'We are launching across Africa, Latin America, Europe, and North America first, with more added monthly.',
  },
];

function WaitlistForm({ id, compact = false }: { id: string; compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [persona, setPersona] = useState<Persona>('client');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const valid = useMemo(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()), [email]);

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
      <div className="rounded-sm border border-primary/30 bg-card p-5 text-left">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="font-display text-lg">You're on the list.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We'll email you the moment access opens in your country. Watch for a note from the FitConnect team.
            </p>
          </div>
        </div>
      </div>
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
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersona(p.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-sm border px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:bg-secondary'
                  }`}
                >
                  <p.icon className="h-4 w-4 shrink-0" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
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
        <Button type="submit" size="xl" disabled={loading} className="h-12 w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Join the waitlist <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Free to join · No spam · Founding members get reduced fees for year one.
      </p>
    </form>
  );
}

export default function WaitlistPage() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 640);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Slim top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/fitconnect-icon.png" alt="" className="h-7 w-7 rounded-sm" />
            <span className="font-display text-base">FitConnect</span>
          </Link>
          <a href="#join" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            Join
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-14 sm:py-20 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <span className="eyebrow">EARLY ACCESS · 40+ COUNTRIES</span>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl text-balance">
                Train anywhere.
                <br />
                Get paid anywhere.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                FitConnect is the borderless fitness marketplace for trainers, clients, clubs, and gear
                merchants — one stable currency, verified reputation, instant settlement.
              </p>

              <div id="join" className="mt-8 max-w-2xl scroll-mt-20">
                <WaitlistForm id="hero" />
              </div>

              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
                {[
                  ['500+', 'Trainers waitlisted'],
                  ['40+', 'Countries'],
                  ['0%', 'FX fees'],
                  ['<60s', 'Payout time'],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-2xl sm:text-3xl">{v}</dt>
                    <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="border-b border-border bg-[hsl(var(--background-secondary))]">
          <div className="container mx-auto grid gap-0 px-4 py-14 sm:py-20 md:grid-cols-3">
            {valueProps.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08 }}
                className="border-t border-border pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0 md:first:border-l-0 md:first:pl-0"
              >
                <v.icon className="h-5 w-5 text-primary" />
                <h2 className="mt-4 font-display text-xl">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PERSONAS */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <span className="eyebrow">WHO IT&apos;S FOR</span>
            <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl text-balance">
              Four sides of the fitness economy, one network.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {personas.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-sm border border-border bg-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-border">
                      <p.icon className="h-4 w-4 text-primary" />
                    </span>
                    <span className="eyebrow">{p.label}</span>
                  </div>
                  <p className="mt-4 font-display text-lg">{p.line}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-b border-border bg-[hsl(var(--background-secondary))]">
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <span className="eyebrow">HOW EARLY ACCESS WORKS</span>
            <ol className="mt-8 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="border-t border-border pt-5">
                  <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  <h3 className="mt-2 font-display text-xl">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <span className="eyebrow">QUESTIONS</span>
            <div className="mt-6 max-w-2xl divide-y divide-border border-y border-border">
              {faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg">
                    {f.q}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
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
    </div>
  );
}
