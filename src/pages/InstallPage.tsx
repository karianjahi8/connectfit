import { motion } from 'framer-motion';
import { Smartphone, Download, Wifi, Globe } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    title: 'Open on your phone',
    description: 'Visit FitConnect in Safari on iPhone or Chrome on Android.',
    icon: Smartphone,
  },
  {
    title: 'Install the app',
    description: 'Use “Add to Home Screen” on iPhone or “Install App” on Android.',
    icon: Download,
  },
  {
    title: 'Use it like a native app',
    description: 'Launch from your home screen with a fast, full-screen experience.',
    icon: Globe,
  },
  {
    title: 'Stay productive on the go',
    description: 'Core pages load quickly and stay accessible even on weaker connections.',
    icon: Wifi,
  },
];

export default function InstallPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Install <span className="gradient-text">FitConnect</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Add FitConnect to your iPhone or Android home screen for a fast, app-like global fitness experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full gradient-card border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-3">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-display text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
