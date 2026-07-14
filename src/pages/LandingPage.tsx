import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Dumbbell, User, Building2, Store, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';

const stats = [
  { value: '500+', label: 'Verified trainers' },
  { value: '10K+', label: 'Sessions booked' },
  { value: '40+', label: 'Countries live' },
  { value: '0%', label: 'FX fees' },
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

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen">
        {/* HERO */}
        <section className="relative min-h-[calc(100vh-7rem)] xl:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden gradient-hero">
          <div className="absolute inset-0 circuit-bg opacity-40 pointer-events-none" />
          <div className="absolute top-1/4 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-24 w-[26rem] h-[26rem] rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

          <div className="relative z-10 container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <img src="/fitconnect-icon.png" alt="FitConnect" className="w-12 h-12 rounded-xl" />
                  <div className="absolute inset-0 rounded-xl shadow-glow animate-pulse-glow pointer-events-none" />
                </div>
                <span className="eyebrow">FITCONNECT · WEB3 FITNESS</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] mb-6 text-balance">
                Train smarter.
                <br />
                <span className="gradient-text">Get paid anywhere.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                A borderless marketplace for trainers, clients, clubs, and fitness merchants — one stable currency, verified reputation, ready on any phone.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {isAuthenticated ? (
                  <>
                    <Link to="/trainers"><Button variant="hero" size="xl">Explore trainers<ArrowRight className="w-5 h-5" /></Button></Link>
                    <Link to="/marketplace"><Button variant="outline" size="xl">Browse marketplace</Button></Link>
                  </>
                ) : (
                  <>
                    <Button onClick={login} variant="hero" size="xl">Get started</Button>
                    <Link to="/trainers"><Button variant="outline" size="xl">Explore platform<ArrowRight className="w-5 h-5" /></Button></Link>
                  </>
                )}
              </motion.div>

              <div className="flex flex-wrap items-center gap-3 mt-8">
                {['USDC settlement', 'No exchange rates', 'On-chain reputation', 'Installable PWA'].map((tag) => (
                  <span key={tag} className="pill border border-accent/30 text-xs font-semibold text-muted-foreground px-3 py-1.5 bg-background-secondary/60 backdrop-blur-sm">
                    <span className="gradient-text">◆</span> <span className="ml-1">{tag}</span>
                  </span>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-accent/15"
              >
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* WHAT IS IN IT FOR YOU */}
        <section className="relative py-24 lg:py-32 bg-[hsl(var(--background-secondary))]">
          <div className="absolute inset-0 circuit-bg opacity-30 pointer-events-none" />
          <div className="relative container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-16">
              <div className="eyebrow mb-3">WHAT IS IN IT FOR YOU</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight text-balance">
                One platform.
                <br />
                <span className="gradient-text">Four ways to win.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {personas.map((persona, i) => (
                <motion.div key={persona.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Card className="h-full bg-background/60 border border-accent/15 hover:border-accent/40 rounded-2xl transition-all hover:shadow-accent-glow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-background-secondary border border-accent/25 flex items-center justify-center shadow-glow">
                          <persona.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="eyebrow text-xs">{persona.label}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl mb-4">{persona.title}</h3>
                      <ul className="space-y-3 mb-6">
                        {persona.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <Link to={persona.cta.to}>
                        <Button variant="outline" size="sm" className="w-full">
                          {persona.cta.label}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 bg-[hsl(var(--background-secondary))]">
          <div className="absolute inset-0 circuit-bg opacity-40 pointer-events-none" />
          <div className="relative container mx-auto px-4 max-w-4xl">
            <Card className="relative overflow-hidden border border-accent/25 rounded-3xl bg-background">
              <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 20%, hsl(80 74% 52% / 0.25), transparent 60%), radial-gradient(circle at 80% 80%, hsl(182 71% 52% / 0.25), transparent 60%)' }} />
              <CardContent className="relative p-10 md:p-16 text-center">
                <div className="eyebrow mb-4">READY WHEN YOU ARE</div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight text-balance">
                  Grow your fitness network.
                  <br />
                  <span className="gradient-text">Get paid anywhere.</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                  Join trainers, clients, clubs, and merchants building the borderless fitness economy on USDC.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth"><Button variant="hero" size="xl">Create account</Button></Link>
                  <Link to="/install"><Button variant="outline" size="xl">Install on mobile</Button></Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
