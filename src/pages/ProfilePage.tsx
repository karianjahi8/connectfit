import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User, Shield, MapPin, Dumbbell, Upload, AlertCircle, Copy, Check, Loader2, Flame, Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { useActivities } from '@/hooks/useActivities';

const fitnessGoals = [
  'Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility',
  'Sports Performance', 'General Fitness', 'Stress Relief', 'Rehabilitation',
];

const trainerSpecialties = [
  'Strength Training', 'HIIT', 'Yoga', 'Pilates', 'CrossFit', 'Boxing',
  'Swimming', 'Nutrition', 'Sports Performance', 'Weight Loss', 'Bodybuilding', 'Cardio',
];

export default function ProfilePage() {
  const { isAuthenticated, login, displayIdentity } = useAuth();
  const { address, shortAddress, hasEmbeddedWallet } = useWallet();
  const { profile, loading, saving, save } = useProfile();
  const { streak } = useActivities(7);

  const [copied, setCopied] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [isTrainer, setIsTrainer] = useState(false);
  const [rate, setRate] = useState<string>('');
  const [experience, setExperience] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    setEmail(profile.email ?? '');
    setBio(profile.bio ?? '');
    setLocation([profile.city, profile.country].filter(Boolean).join(', '));
    setIsTrainer(profile.is_trainer ?? false);
    setRate(profile.trainer_rate_usdc != null ? String(profile.trainer_rate_usdc) : '');
    setExperience(profile.trainer_experience ?? '');
    setSelectedGoals(profile.fitness_goals ?? []);
    setSelectedSpecialties(profile.trainer_specialties ?? []);
  }, [profile]);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const parseLocation = () => {
    const [city, country] = location.split(',').map((s) => s.trim());
    return { city: city || null, country: country || null };
  };

  const saveBasic = async () => {
    const { city, country } = parseLocation();
    await save({
      full_name: fullName || null,
      email: email || null,
      bio: bio || null,
      city, country,
      is_trainer: isTrainer,
      fitness_goals: selectedGoals,
    });
  };

  const saveTrainer = async () => {
    await save({
      is_trainer: true,
      trainer_rate_usdc: rate ? Number(rate) : null,
      trainer_specialties: selectedSpecialties,
      trainer_experience: experience || null,
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">Sign in to manage your profile.</p>
            <Button variant="hero" onClick={login}>Get Started</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            My <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-muted-foreground">Manage your profile and account settings</p>
        </motion.div>

        <Card className="gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                  <User className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Signed in as</p>
                  <p className="font-medium">{displayIdentity}</p>
                  {!hasEmbeddedWallet && shortAddress && (
                    <p className="text-xs text-muted-foreground font-mono">{shortAddress}</p>
                  )}
                </div>
              </div>
              {address && !hasEmbeddedWallet && (
                <Button variant="outline" size="sm" onClick={copyAddress} className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <Dumbbell className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">I'm a Trainer</h3>
                  <p className="text-sm text-muted-foreground">Enable this to offer training services</p>
                </div>
              </div>
              <Switch checked={isTrainer} onCheckedChange={setIsTrainer} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            {isTrainer && (
              <>
                <TabsTrigger value="trainer">Trainer Profile</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="basic">
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <User className="w-5 h-5" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" maxLength={100}
                      value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" placeholder="john@example.com" maxLength={255}
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." className="min-h-[100px]" maxLength={500}
                    value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Location (city, country)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="e.g., London, United Kingdom" className="pl-10" maxLength={100}
                      value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                </div>

                {!isTrainer && (
                  <div className="space-y-3">
                    <Label>Fitness Goals</Label>
                    <div className="flex flex-wrap gap-2">
                      {fitnessGoals.map((goal) => {
                        const isSelected = selectedGoals.includes(goal);
                        return (
                          <Badge key={goal} variant={isSelected ? 'default' : 'outline'}
                            className={`cursor-pointer transition-all ${isSelected ? 'gradient-primary text-primary-foreground' : 'hover:border-primary/50'}`}
                            onClick={() => setSelectedGoals((p) => toggle(p, goal))}>
                            {goal}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button variant="hero" className="w-full md:w-auto" onClick={saveBasic} disabled={saving || loading}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {isTrainer && (
            <>
              <TabsContent value="trainer">
                <Card className="gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <Dumbbell className="w-5 h-5" /> Trainer Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="rate">Hourly Rate (USDC)</Label>
                      <Input id="rate" type="number" step="0.01" placeholder="25.00"
                        value={rate} onChange={(e) => setRate(e.target.value)} />
                      <p className="text-xs text-muted-foreground">
                        Platform takes 15% commission on completed sessions
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Specialties</Label>
                      <div className="flex flex-wrap gap-2">
                        {trainerSpecialties.map((s) => {
                          const isSelected = selectedSpecialties.includes(s);
                          return (
                            <Badge key={s} variant={isSelected ? 'default' : 'outline'}
                              className={`cursor-pointer transition-all ${isSelected ? 'gradient-primary text-primary-foreground' : 'hover:border-primary/50'}`}
                              onClick={() => setSelectedSpecialties((p) => toggle(p, s))}>
                              {s}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea id="experience" placeholder="Describe your training experience, certifications, and approach..."
                        className="min-h-[120px]" maxLength={2000}
                        value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>

                    <Button variant="hero" className="w-full md:w-auto" onClick={saveTrainer} disabled={saving}>
                      {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Trainer Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification">
                <Card className="gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <Shield className="w-5 h-5" /> Trainer Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                      <p className="text-sm text-warning flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        Verification requires uploading your certification documents. These will be reviewed by our team.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Certification Documents</Label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-medium mb-1">Drop files here or click to upload</p>
                        <p className="text-sm text-muted-foreground">PDF, JPG, or PNG (max 10MB)</p>
                      </div>
                    </div>
                    <Button variant="hero" className="w-full md:w-auto">Submit for Verification</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
