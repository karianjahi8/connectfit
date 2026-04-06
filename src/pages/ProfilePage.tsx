import { useState } from 'react';
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
  User,
  Shield,
  MapPin,
  Dumbbell,
  Upload,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';

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
  const [isTrainer, setIsTrainer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">
              Sign In Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign in to manage your profile.
            </p>
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

        {/* Account Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
        </motion.div>

        {/* Role Toggle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
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
        </motion.div>

        {/* Profile Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input id="email" type="email" placeholder="john@example.com" maxLength={255} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." className="min-h-[100px]" maxLength={500} />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="e.g., London, United Kingdom" className="pl-10" maxLength={100} />
                    </div>
                  </div>

                  {!isTrainer && (
                    <div className="space-y-3">
                      <Label>Fitness Goals</Label>
                      <div className="flex flex-wrap gap-2">
                        {fitnessGoals.map((goal) => {
                          const isSelected = selectedGoals.includes(goal);
                          return (
                            <Badge
                              key={goal}
                              variant={isSelected ? 'default' : 'outline'}
                              className={`cursor-pointer transition-all ${isSelected ? 'gradient-primary text-primary-foreground' : 'hover:border-primary/50'}`}
                              onClick={() => toggleGoal(goal)}
                            >
                              {goal}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Button variant="hero" className="w-full md:w-auto">Save Profile</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {isTrainer && (
              <>
                <TabsContent value="trainer">
                  <Card className="gradient-card border-border/50">
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <Dumbbell className="w-5 h-5" />
                        Trainer Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="rate">Hourly Rate (USDC)</Label>
                        <Input id="rate" type="number" step="0.01" placeholder="25.00" />
                        <p className="text-xs text-muted-foreground">
                          Platform takes 15% commission on completed sessions
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label>Specialties</Label>
                        <div className="flex flex-wrap gap-2">
                          {trainerSpecialties.map((specialty) => {
                            const isSelected = selectedSpecialties.includes(specialty);
                            return (
                              <Badge
                                key={specialty}
                                variant={isSelected ? 'default' : 'outline'}
                                className={`cursor-pointer transition-all ${isSelected ? 'gradient-primary text-primary-foreground' : 'hover:border-primary/50'}`}
                                onClick={() => toggleSpecialty(specialty)}
                              >
                                {specialty}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Textarea id="experience" placeholder="Describe your training experience, certifications, and approach..." className="min-h-[120px]" maxLength={1000} />
                      </div>

                      <Button variant="hero" className="w-full md:w-auto">Save Trainer Profile</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="verification">
                  <Card className="gradient-card border-border/50">
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Trainer Verification
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
        </motion.div>
      </div>
    </Layout>
  );
}
