# 💧 Daily Hydration

A calm, encouraging mobile app that helps you **front-load your water intake** — drinking more earlier in the day so you can taper off before bed, sleep better, and reduce nighttime bathroom trips.

Built with **Expo (React Native)** + **expo-router**.

---

## Why front-loading?

Most hydration apps only track a daily total. This one introduces a **pace line**: a live marker showing where you *should* be right now, based on a linear ramp from your wake time to your hydration cutoff. Being **above the line** means you're winning the day early — which is exactly the behavior we want to reward.

---

## Features

### Setup (under a minute)
- **3-step onboarding** — daily goal, schedule (wake + cutoff), and default vessel.
- Sensible defaults so you can tap through quickly.

### Fast logging (seconds)
- One big **Log a Drink** button adds your default vessel size with a single tap + haptic feedback.
- **Undo** the last entry anytime.

### Clear progress at a glance
- Animated **water-glass** fill that rises as you drink.
- A **pace line** inside the glass marks where you should be right now.
- Stats row: consumed / remaining / cutoff.
- A **pace status card** tells you plainly whether you're *ahead*, *on pace*, or *behind* — always encouraging, never guilt-inducing.

### Intelligent, adaptive reminders
Reminders only **begin after your first logged drink** of the day, then dynamically recompute based on:
- Daily goal
- Amount already consumed
- Remaining volume
- Time left until cutoff
- Default vessel size

The interval tightens when you're behind and relaxes when you're ahead. **All reminders stop at your cutoff time.**

### Celebration
- Hitting your goal triggers a **confetti burst**, a trophy card, and **success haptics**.

### Education
- A rotating **tip of the day** (28 positive, varied hydration facts, habits, benefits, and motivation) keeps things fresh.

---

## Architecture

```
hydration/
├── app/
│   ├── _layout.tsx            # Root stack + splash control
│   ├── index.tsx              # Animated splash → routes to onboarding or app
│   ├── onboarding.tsx         # 3-step setup flow
│   └── (tabs)/
│       ├── _layout.tsx        # Today / Settings tabs
│       ├── index.tsx          # Main hydration screen
│       └── settings.tsx       # Goal, schedule, vessel, reminders
├── components/
│   ├── WaterGlass.tsx         # Animated fill + pace line
│   ├── PaceStatus.tsx         # Ahead / on / behind card
│   ├── HydrationTip.tsx       # Tip-of-the-day card
│   └── CelebrationOverlay.tsx # Confetti + trophy on goal completion
├── hooks/
│   ├── useHydration.ts        # Core state: settings, log, pace, persistence
│   └── useNotifications.ts    # Adaptive reminder scheduling
├── utils/
│   ├── hydrationUtils.ts      # Pace math + reminder schedule
│   └── storage.ts             # AsyncStorage persistence
└── constants/
    ├── theme.ts               # Calm blue palette, spacing, type
    ├── vessels.ts             # Vessel presets
    └── tips.ts                # Tips, encouragements, reminder copy
```

### Key logic

**Pace target** (`calculatePaceTarget`) — linear interpolation of the goal from wake time to cutoff. At wake = 0 oz expected; at cutoff = full goal.

**Reminder schedule** (`buildReminderSchedule`) — divides remaining volume by vessel size to get servings needed, then spreads them evenly across the time left until cutoff, clamped to 15–120 min between nudges.

Daily logs reset automatically on a new calendar day.

---

## Running locally

```bash
cd hydration
npm install
npm start          # then press i / a, or scan the QR with Expo Go
```

> Notifications and haptics require a physical device or simulator (no-op on web).

---

## Design principles

- **Encouraging, never guilt-inducing** — copy celebrates progress and frames "behind" as a gentle catch-up.
- **Low-friction** — log in one tap, set up in under a minute.
- **Calm & modern** — soft blue gradients, rounded glass, gentle motion.
- **Habit-forming** — pace line and daily tips reward showing up early.
