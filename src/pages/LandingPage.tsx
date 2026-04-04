import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Shield,
    title: 'Trusted Payments',
    description: 'USDC-first checkout keeps pricing stable across trainers, clubs, and merchants worldwide.',
  },
  {
    icon: Zap,
    title: 'Fast Discovery',
    description: 'Find trainers, products, and events quickly with region-aware browsing and streamlined booking.',
  },
  {
    icon: Star,
    title: 'Verified Quality',
    description: 'Surface trusted professionals and merchants with transparent verification and strong social proof.',
  },
  {
    icon: Globe,
    title: 'Built for Global Fitness',
    description: 'Country-based discovery and localized currency views make FitConnect feel local anywhere.',
  },
];

const stats = [
  { value: '500+', label: 'Verified Trainers' },
  { value: '10K+', label: 'Sessions Booked' },
  { value: '40+', label: 'Countries Ready' },
  { value: '24/7', label: 'Mobile Access' },
];

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground/80">Global trainers • clubs • merchants</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Your Global
              <br />
              <span className="gradient-text">Fitness Platform</span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover trainers, clubs, and fitness merchants by country, pay with USDC, and view prices in your local currency on any device.
            </p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/trainers"><Button variant="hero" size="xl">Browse Trainers<ArrowRight className="w-5 h-5" /></Button></Link>
                  <Link to="/install"><Button variant="glass" size="xl">Install App</Button></Link>
                </>
              ) : (
                <>
                  <Button onClick={login} variant="hero" size="xl">Get Started</Button>
                  <Link to="/trainers"><Button variant="glass" size="xl">Explore Platform<ArrowRight className="w-5 h-5" /></Button></Link>
                </>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-primary-foreground/10">
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

      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why <span className="gradient-text">FitConnect</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A global fitness marketplace built for trusted discovery, flexible payments, and seamless mobile access.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full gradient-card border-border/50 hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow"><feature.icon className="w-6 h-6 text-primary-foreground" /></div>
                    <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Simple, secure, and mobile-ready fitness discovery in four steps.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your account with email, Google, Apple, or phone number — no crypto knowledge needed.' },
              { step: '02', title: 'Pick Your Country', description: 'Set your region to localize discovery and currency display instantly.' },
              { step: '03', title: 'Confirm Payment', description: 'Use stable USDC pricing while still seeing totals in your local currency.' },
              { step: '04', title: 'Train Anywhere', description: 'Book, shop, and check in from desktop, Android, or iPhone.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full gradient-card border-border/50">
                  <CardContent className="p-6">
                    <div className="font-display text-sm text-primary mb-3">STEP {item.step}</div>
                    <h3 className="font-display font-semibold text-xl mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="gradient-card border-border/50 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to grow your fitness network?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Join the global platform for coaching, club discovery, and merchant commerce with country-aware browsing and installable mobile access.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth"><Button variant="hero" size="xl">Create Account</Button></Link>
                <Link to="/install"><Button variant="outline" size="xl">Install on Mobile</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
