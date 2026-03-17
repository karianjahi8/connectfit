import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Shield, Zap, Globe, Star, ArrowRight, Wallet, CheckCircle, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const features = [
  {
    icon: Shield,
    title: 'Escrow Protection',
    description: 'Smart contracts hold funds until sessions are delivered. Automatic refunds on no-shows.',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Avalanche C-Chain: sub-second finality, $0.01 fees. No 3-day bank holds.',
  },
  {
    icon: Star,
    title: 'On-Chain Verified',
    description: 'Trainer credentials immutably stored. Ratings backed by real completed sessions.',
  },
  {
    icon: Globe,
    title: 'Borderless Payments',
    description: 'Pay trainers in any country with USDC. Local currency display for 19+ regions.',
  },
];

const stats = [
  { value: '10K+', label: 'Trainers' },
  { value: '$2M+', label: 'Paid in USDC' },
  { value: '95%', label: 'Success Rate' },
  { value: '40+', label: 'Countries' },
];

export default function LandingPage() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-float-delayed" />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">
                Powered by Avalanche
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              <span className="text-foreground">Train Anywhere.</span>
              <br />
              <span className="gradient-text">Pay with Crypto.</span>
              <br />
              <span className="text-foreground">Own Your Fitness.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              The world's first blockchain-powered fitness marketplace. Connect with verified trainers globally, pay with USDC, settle instantly on Avalanche.
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isConnected ? (
                <>
                  <Link to="/trainers">
                    <Button variant="hero" size="xl" className="gap-2">
                      Find Your Trainer
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/install">
                    <Button variant="glass" size="xl" className="gap-2">
                      <Play className="w-4 h-4" />
                      Watch Demo
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button onClick={openConnectModal} variant="hero" size="xl" className="gap-2 animate-pulse-glow">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </Button>
                  <Link to="/trainers">
                    <Button variant="glass" size="xl" className="gap-2">
                      Explore Platform
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
            >
              {stats.map((stat) => (
                <GlassCard key={stat.label} className="p-5 text-center hover:border-primary/50">
                  <div className="font-display text-3xl md:text-4xl font-extrabold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </GlassCard>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── WHY FITCONNECT ─── */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why <span className="gradient-text">FitConnect</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Blockchain-powered trust, instant payments, and verified credentials for the global fitness economy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From wallet to workout in under 5 minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Connect Wallet', description: 'One tap with Core, MetaMask, or Trust Wallet on Avalanche C-Chain.' },
              { step: '02', title: 'Pick Your Country', description: 'Localize discovery and see prices in your currency instantly.' },
              { step: '03', title: 'Pay in USDC', description: 'Stable pricing, instant settlement, escrow-protected sessions.' },
              { step: '04', title: 'Train Anywhere', description: 'Physical or virtual — book globally, train locally.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard variant="gradient" className="h-full">
                  <div className="font-mono text-sm text-primary font-semibold mb-3">
                    STEP {item.step}
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <GlassCard variant="elevated" className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to own your fitness?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join the decentralized fitness economy. Verified trainers, escrow-protected payments, borderless access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="xl">Create Account</Button>
              </Link>
              <Link to="/install">
                <Button variant="glass" size="xl">Install on Mobile</Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
