import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useEffect } from 'react';
import { CountrySelect } from '@/components/ui/country-select';
import { supabase } from '@/integrations/supabase/client';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/marketplace');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (!country) {
          toast({ title: 'Please select your country', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }
        const { error, data } = await signUp(email, password, fullName);
        if (error) throw error;
        // Update profile with country & city after signup
        if (data?.user) {
          await supabase.from('profiles').update({ country, city }).eq('id', data.user.id);
        }
        toast({ title: 'Check your email', description: 'We sent you a verification link.' });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/marketplace');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
        </motion.div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <Label>Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1" required />
                  </div>
                  <CountrySelect value={country} onChange={setCountry} />
                  <div>
                    <Label>City</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. New York" className="mt-1" />
                  </div>
                </>
              )}
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" required minLength={6} />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
