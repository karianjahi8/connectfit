
# Activity Tracking, Step Counter & Gym Streak

Goal: bring real device-level fitness data (steps, cycling, running, workouts, calories, distance) into ConnectFit and award a streak only when the user **completes a confirmed training session**.

Because you picked HealthKit (iOS) / Health Connect (Android), we need to wrap the app with **Capacitor**. The browser PWA will still work and will fall back to manual logging when sensor APIs are unavailable.

---

## 1. Capacitor wrap

Add Capacitor + native health plugin to the existing Vite project.

```text
@capacitor/core, @capacitor/cli, @capacitor/ios, @capacitor/android
@capacitor/geolocation
capacitor-health-connect   (Android — Health Connect)
@perfood/capacitor-healthkit (iOS — HealthKit)
```

`capacitor.config.ts`
- `appId: app.lovable.a6d7339433a343ed91295b77db5224a0`
- `appName: connectfit`
- `server.url` → Lovable preview URL for hot reload during dev

iOS Info.plist additions: `NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription`, `NSMotionUsageDescription`, `NSLocationWhenInUseUsageDescription`.
Android manifest: Health Connect permissions (`android.permission.health.READ_STEPS`, `READ_EXERCISE`, `READ_DISTANCE`, `READ_TOTAL_CALORIES_BURNED`, `READ_HEART_RATE`) + foreground service for live tracking.

User will run `npx cap add ios|android` and `npx cap sync` after pulling — we'll print the exact steps.

---

## 2. Database (Lovable Cloud)

Three tables, all RLS-scoped to `auth.uid()::text = user_id` (same Privy pattern you already use). Writes go through a new `activity-rpc` edge function that verifies the Privy JWT and uses the service role.

**`activities`**
- `user_id text`, `type` enum: `steps | run | cycle | workout | yoga | swim | hike | strength | hiit | other`
- `started_at`, `ended_at`, `duration_minutes`
- `distance_km`, `steps`, `calories`, `avg_heart_rate`
- `source` enum: `healthkit | health_connect | manual | sensor | geofence`
- `external_id` (HealthKit/HC UUID — dedupe key, unique per user)
- `verified boolean` — true if it meets the "completed session" rule
- `metadata jsonb`

**`gym_checkins`**
- `user_id`, `club_id` nullable, `checked_in_at`, `checked_out_at` nullable
- `distance_meters`, `verified_location boolean`

**`streak_stats`** (one row per user, updated by trigger)
- `current_streak`, `longest_streak`, `last_qualifying_date`, `total_sessions`

---

## 3. "Confirmed complete training session" rule

A session qualifies (and counts toward the streak) when **all** are true:

1. `source` is `healthkit` or `health_connect` (real device data) **OR** a verified geofenced gym check-in paired with a logged activity.
2. `duration_minutes >= 20`.
3. One of: `distance_km >= 1.0`, `steps >= 2000`, `calories >= 100`, or `avg_heart_rate >= 110`.
4. `type` is not `steps` (passive step totals don't qualify on their own — they show in the dashboard but don't trip the streak).

A daily Postgres trigger + pg_cron job updates `streak_stats`:
- Same calendar day as `last_qualifying_date` → no change.
- Next day → `current_streak += 1`.
- Gap → reset to 1.
- Cron at 02:00 UTC resets to 0 if yesterday was missed.

---

## 4. Edge function: `activity-rpc`

Actions (Privy JWT verified, Zod validated):
- `sync` — receives a batch of HealthKit/HC samples; dedupes by `(user_id, external_id)`; evaluates the qualifying rule; upserts; returns updated streak.
- `log` — manual activity entry (always `verified=false`, never qualifies alone).
- `checkin` — gym check-in with `{ club_id, lat, lng }`; computes haversine vs club coords; inserts; if paired within ±2h with a qualifying activity, marks both `verified=true`.
- `stats` — returns today/week/month rollups + streak.

---

## 5. Frontend

New hook layer:
- `useHealthSync()` — requests permissions on mount; pulls last 7 days on first run, then a delta every time the app foregrounds; calls `activity-rpc.sync`.
- `useActivities(range)` — react-query over `stats`.
- `useStreak()` — react-query over `streak_stats`.
- `useGymCheckin(clubId)` — wraps Geolocation + `checkin`.

New page **`/activity`**:
- Hero: animated step ring (today vs goal), streak flame with current count, calories.
- Weekly bar chart (recharts) of minutes by activity type.
- "Log activity" modal (manual fallback for browser users).
- Recent sessions list with source badge (Apple Health / Health Connect / Manual).

Updates:
- **Header / bottom nav**: add Activity tab with `Activity` icon.
- **Club detail page**: large "Check In" button + "You've checked in N times" + last visit.
- **Profile page**: streak badge + total sessions card.
- **Landing dashboard** (signed in): streak hero stat.

---

## 6. Build order (one PR, shipped together)

1. Migration: `activities`, `gym_checkins`, `streak_stats`, qualifying trigger, pg_cron reset job, RLS + GRANTs.
2. Edge function `activity-rpc` with all four actions.
3. Install Capacitor + health plugins; add `capacitor.config.ts`; document the user's `cap add / sync / run` steps.
4. Hooks: `useHealthSync`, `useActivities`, `useStreak`, `useGymCheckin`.
5. `/activity` page + route + nav entry.
6. Club page check-in button.
7. Profile + landing streak widgets.
8. Update security memory with new tables/rules.

---

## Technical notes

- HealthKit only allows reads; we never write back to Apple Health.
- Health Connect requires Android 14+ for full feature set; on older devices we degrade to Google Fit-style manual.
- Native plugins are no-ops in the browser — `useHealthSync` detects `Capacitor.isNativePlatform()` and hides the "Sync from Health" button on web, exposing manual logging instead.
- Streak fairness: the cron job runs in **the user's stored timezone** (add `timezone text` to `profiles` if missing; default to `UTC`).
- Privacy: health data stays in Lovable Cloud, RLS-locked to the owner. Privacy policy page will get a new "Health & Fitness Data" section.

---

## Two quick confirmations before I build

1. The qualifying rule above (≥20 min + meaningful intensity, from device or geofenced gym) — good as-is, or do you want a different threshold (e.g. 30 min, or require gym check-in always)?
2. Capacitor wrap is required for native Health APIs. I'll set everything up in-repo, but you'll need to run `npx cap add ios && npx cap sync` locally after pulling. OK to proceed?
