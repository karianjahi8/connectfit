import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export default function AuthPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/marketplace');
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">Welcome to FitConnect</h1>
          <p className="text-muted-foreground mt-2">Sign in with email, Google, Apple, or phone number</p>
        </motion.div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              No crypto knowledge needed. Your account is automatically set up for secure payments.
            </p>
            <Button variant="hero" className="w-full" size="lg" onClick={login}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
