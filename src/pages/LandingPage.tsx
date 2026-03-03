import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Dumbbell, Shield, Zap, Globe, Star, ArrowRight, Wallet, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Shield, title: 'Trustless Payments',
    description: 'Smart contract escrow ensures trainers get paid and clients get refunds if sessions are cancelled.',
  },
  {
    icon: Zap, title: 'Instant Settlement',
    description: 'Built on Avalanche for sub-second transaction finality and minimal fees.',
  },
  {
    icon: Star, title: 'Verified Reviews',
    description: 'On-chain ratings that cannot be faked or manipulated. Real feedback from real sessions.',
  },
  {
    icon: Globe, title: 'Global Reach',
    description: 'Connect with trainers and vendors worldwide. Filter by country and region for local results.',
  },
];

const stats = [
  { value: '500+', label: 'Verified Trainers' },
  { value: '50+', label: 'Countries' },
  { value: '15%', label: 'Platform Fee' },
  { value: '<1s', label: 'Transaction Speed' },
];

export default function LandingPage() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground/80">Built on Avalanche • Global Fitness Platform</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Book Fitness Trainers
              <br />
              <span className="gradient-text">On-Chain</span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              The global decentralized marketplace connecting you with certified fitness professionals.
              Transparent payments, verified reviews, and trustless bookings powered by blockchain.
            </p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isConnected ? (
                <>
                  <Link to="/trainers"><Button variant="hero" size="xl">Browse Trainers<ArrowRight className="w-5 h-5" /></Button></Link>
                  <Link to="/marketplace"><Button variant="glass" size="xl">Shop Marketplace</Button></Link>
                </>
              ) : (
                <>
                  <Button onClick={openConnectModal} variant="hero" size="xl"><Wallet className="w-5 h-5" />Connect Wallet</Button>
                  <Link to="/trainers"><Button variant="glass" size="xl">Explore Platform<ArrowRight className="w-5 h-5" /></Button></Link>
                </>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-primary-foreground/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why <span className="gradient-text">FitConnect</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Combining the power of blockchain with fitness to create a transparent, trustworthy global marketplace.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full gradient-card border-border/50 hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Simple, secure, and transparent fitness booking in 4 steps.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Connect Wallet', description: 'Link your MetaMask or Core Wallet to get started.' },
              { step: '02', title: 'Find a Trainer', description: 'Browse verified trainers by specialty, country, and ratings.' },
              { step: '03', title: 'Book & Pay', description: 'Select a time slot and pay with AVAX. Funds held in escrow.' },
              { step: '04', title: 'Train & Review', description: 'Complete your session and leave an on-chain review.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="text-6xl font-display font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {i < 3 && <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-primary/30" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative rounded-3xl gradient-secondary p-8 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Dumbbell className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">Ready to Transform Your Fitness Journey?</h2>
              <p className="text-secondary-foreground/70 max-w-xl mx-auto mb-8">Join the global decentralized fitness revolution. Connect your wallet and book your first session today.</p>
              {isConnected ? (
                <Link to="/trainers"><Button variant="hero" size="xl">Find Your Trainer<ArrowRight className="w-5 h-5" /></Button></Link>
              ) : (
                <Button onClick={openConnectModal} variant="hero" size="xl"><Wallet className="w-5 h-5" />Get Started</Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">FitConnect</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Built on Avalanche</span><span>•</span><span>Global Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 FitConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
