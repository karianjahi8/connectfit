import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Activity, Flame, Footprints, RefreshCw, Plus, Bike, Dumbbell, Heart, Loader2, AlertCircle, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { format, startOfDay, subDays } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useActivities, type ActivityRow } from '@/hooks/useActivities';
import { isNativeHealthAvailable } from '@/lib/health';

const STEP_GOAL = 10000;

const TYPES = ['run', 'cycle', 'workout', 'strength', 'hiit', 'yoga', 'swim', 'hike', 'other'] as const;

function typeIcon(t: ActivityRow['type']) {
  if (t === 'cycle') return Bike;
  if (t === 'steps') return Footprints;
  return Dumbbell;
}

function sourceLabel(s: ActivityRow['source']) {
  switch (s) {
    case 'healthkit': return 'Apple Health';
    case 'health_connect': return 'Health Connect';
    case 'geofence': return 'Gym Check-in';
    case 'sensor': return 'Phone Sensor';
    default: return 'Manual';
  }
}

export default function ActivityPage() {
  const { isAuthenticated, login } = useAuth();
  const { activities, streak, checkins, loading, syncing, syncFromDevice, logManual } = useActivities(30);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'workout' as ActivityRow['type'],
    duration_minutes: 30,
    distance_km: '',
    calories: '',
    notes: '',
  });

  const today = startOfDay(new Date());
  const todaySteps = useMemo(
    () => activities
      .filter((a) => a.type === 'steps' && new Date(a.started_at) >= today)
      .reduce((sum, a) => sum + (a.steps ?? 0), 0),
    [activities, today]
  );
  const todayMinutes = useMemo(
    () => activities
      .filter((a) => a.type !== 'steps' && new Date(a.started_at) >= today)
      .reduce((sum, a) => sum + (a.duration_minutes ?? 0), 0),
    [activities, today]
  );
  const todayCalories = useMemo(
    () => activities
      .filter((a) => new Date(a.started_at) >= today)
      .reduce((sum, a) => sum + (a.calories ?? 0), 0),
    [activities, today]
  );

  const weekChart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    return days.map((d) => {
      const next = new Date(d.getTime() + 86400000);
      const mins = activities
        .filter((a) => a.type !== 'steps' && new Date(a.started_at) >= d && new Date(a.started_at) < next)
        .reduce((sum, a) => sum + (a.duration_minutes ?? 0), 0);
      return { day: format(d, 'EEE'), minutes: mins };
    });
  }, [activities, today]);

  const stepPct = Math.min(100, Math.round((todaySteps / STEP_GOAL) * 100));

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Sign in to track your activity and streak.</p>
          <Button variant="hero" onClick={login}>Get Started</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              My <span className="gradient-text">Activity</span>
            </h1>
            <p className="text-muted-foreground">Steps, workouts, and your gym streak</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={syncFromDevice} disabled={syncing} className="gap-2">
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
              Sync from Health
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2"><Plus className="w-4 h-4" /> Log activity</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Log activity</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as ActivityRow['type'] }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Duration (min)</Label>
                      <Input type="number" min={1} max={1440} value={form.duration_minutes}
                        onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Calories</Label>
                      <Input type="number" min={0} value={form.calories}
                        onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Distance (km)</Label>
                    <Input type="number" step="0.1" min={0} value={form.distance_km}
                      onChange={(e) => setForm((f) => ({ ...f, distance_km: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input value={form.notes} maxLength={300}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Manual entries don't count toward your streak. Sync from Health or check in at a club for verified sessions.
                  </p>
                  <Button variant="hero" className="w-full" onClick={async () => {
                    await logManual({
                      type: form.type,
                      started_at: new Date().toISOString(),
                      ended_at: null,
                      duration_minutes: form.duration_minutes,
                      distance_km: form.distance_km ? Number(form.distance_km) : null,
                      steps: null,
                      calories: form.calories ? Number(form.calories) : null,
                      avg_heart_rate: null,
                      notes: form.notes || null,
                    });
                    setOpen(false);
                  }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {!isNativeHealthAvailable() && (
          <Card className="border-warning/30 bg-warning/5 mb-6">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You're on the web. Install the ConnectFit mobile app to auto-sync steps & workouts from Apple Health or Health Connect.
                For now, log activities manually or check in at a club.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Footprints className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">Today's steps</span></div>
                <span className="text-xs text-muted-foreground">{stepPct}%</span>
              </div>
              <div className="font-display text-3xl font-bold mb-2">{todaySteps.toLocaleString()}</div>
              <Progress value={stepPct} />
              <p className="text-xs text-muted-foreground mt-2">Goal {STEP_GOAL.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3"><Flame className="w-5 h-5 text-warning" /><span className="text-sm text-muted-foreground">Current streak</span></div>
              <div className="font-display text-3xl font-bold mb-1">{streak?.current_streak ?? 0} <span className="text-base font-normal text-muted-foreground">days</span></div>
              <p className="text-xs text-muted-foreground">Longest: {streak?.longest_streak ?? 0} · Total sessions: {streak?.total_sessions ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3"><Heart className="w-5 h-5 text-destructive" /><span className="text-sm text-muted-foreground">Today's effort</span></div>
              <div className="font-display text-3xl font-bold mb-1">{todayMinutes} <span className="text-base font-normal text-muted-foreground">min</span></div>
              <p className="text-xs text-muted-foreground">{todayCalories.toLocaleString()} kcal burned</p>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-card border-border/50 mb-6">
          <CardHeader><CardTitle className="font-display flex items-center gap-2"><Activity className="w-5 h-5" /> This week</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekChart}>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recent sessions</CardTitle>
            {loading && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No activity yet. Sync from Health or log your first workout.
              </p>
            ) : (
              <div className="space-y-2">
                {activities.slice(0, 20).map((a) => {
                  const Icon = typeIcon(a.type);
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium capitalize">{a.type}</span>
                          {a.verified && <Badge variant="outline" className="text-[10px] bg-success/10 border-success/30 text-success">Verified</Badge>}
                          <Badge variant="outline" className="text-[10px]">{sourceLabel(a.source)}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(a.started_at), 'MMM d, h:mm a')} · {a.duration_minutes} min
                          {a.distance_km ? ` · ${a.distance_km.toFixed(1)} km` : ''}
                          {a.steps ? ` · ${a.steps.toLocaleString()} steps` : ''}
                          {a.calories ? ` · ${a.calories} kcal` : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 mt-6">
          <CardHeader><CardTitle className="font-display">Recent gym check-ins</CardTitle></CardHeader>
          <CardContent>
            {checkins.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No check-ins yet. Visit a club's page and tap Check In.</p>
            ) : (
              <div className="space-y-2">
                {checkins.slice(0, 10).map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <div>
                      <p className="text-sm font-medium">{format(new Date(c.checked_in_at), 'MMM d, h:mm a')}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.distance_meters != null ? `${c.distance_meters} m from club` : 'Location not measured'}
                      </p>
                    </div>
                    <Badge variant="outline" className={c.verified_location ? 'bg-success/10 border-success/30 text-success' : ''}>
                      {c.verified_location ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
