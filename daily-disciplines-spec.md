# Daily Disciplines — App Specification
> For use with Claude Code to build a production React Native (Expo) mobile app

---

## Overview

**App Name:** Daily Disciplines  
**Platform:** iOS (primary), Android (secondary)  
**Stack:** React Native + Expo + TypeScript  
**Storage:** AsyncStorage (local, on-device)  
**Goal:** A minimal, elegant daily habit tracker for personal spiritual, physical, and mental disciplines.

---

## Habits (Hardcoded v1)

Three categories, seven total habits:

### Spiritual `#A07830` (warm gold)
- Daily Devotional
- Read a Chapter *(Bible)*
- Pray

### Body `#3A7D5E` (sage green)
- Walk the Dog

### Mind `#4A6096` (muted blue)
- Think & Reflect
- Journal
- Read a Book

> These are fixed in v1. Do not build habit editing/creation — keep it simple.

---

## Screens

### 1. Today Screen (default)
- Header showing current day/date (e.g. "Thursday, May 28")
- App title: **"Daily Disciplines"**
- Italic subtitle that updates contextually:
  - `0` complete → *"Let's get started."*
  - `1–6` complete → *"Keep going, you're doing great."*
  - `7/7` complete → *"Every habit complete today. 🎉"*
- **Progress card** (white card, subtle shadow):
  - Label: "Today's Progress"
  - Count: `4/7` styled large
  - Animated progress bar (gradient gold → blue)
  - Streak indicator: `◆ 3-day streak` (only shown if streak ≥ 1)
- **Habit list** grouped by category:
  - Each category has a colored background card (soft tint of category color)
  - Category label in monospace uppercase with icon (✦ ◈ ◎)
  - Each habit item: circular checkbox + label
  - Tap to toggle: checkbox fills with category color, label gets strikethrough, row fades to 45% opacity
  - Smooth 200ms transition on check/uncheck

### 2. This Week Screen
- Tab-based navigation (Today / This Week) — tabs sit below the header
- 7-column bar chart (Sun–Sat), current day highlighted
  - Bar height = proportion of habits completed that day
  - Color: gold = 100%, green = >50%, blue = >0%, gray = 0%
  - Each bar shows `done/total` count above and day name below
- Weekly summary card below the bars:
  - One row per category showing name + weekly completion %

---

## Navigation

- Bottom tab bar with two tabs: **Today** and **This Week**
- Use Expo Router or React Navigation (bottom tabs)
- No other screens in v1

---

## Data Model

```typescript
// Stored in AsyncStorage under key "habitData"
type HabitData = {
  [dateKey: string]: {   // date key format: "YYYY-MM-DD"
    [habitId: string]: boolean;
  };
};

// Habit IDs
type HabitId =
  | "devotional"
  | "bible"
  | "pray"
  | "walk"
  | "think"
  | "journal"
  | "read";
```

- Data persists indefinitely (no expiry)
- Load on app start, save immediately on each toggle
- Date keys use local device time (not UTC)

---

## Streak Logic

A "streak" is the number of consecutive days (ending today) where **all 7 habits** were completed.

```
streak = 0
for i in 0..365:
  if all habits completed on day (today - i):
    streak++
  else if i > 0:
    break
```

- Today counts toward streak even if not yet complete (do not break streak on partial today)
- Display only if streak ≥ 1

---

## Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| `background` | `#FAF8F5` | App background |
| `surface` | `#FFFFFF` | Cards |
| `border` | `#EAE6DF` | Card borders |
| `text.primary` | `#1C1A17` | Main text |
| `text.secondary` | `#8C8270` | Subtitles |
| `text.muted` | `#A09880` | Labels, monospace |
| `spiritual` | `#A07830` | Spiritual category |
| `body` | `#3A7D5E` | Body category |
| `mind` | `#4A6096` | Mind category |

Category background tints:
- Spiritual: `#FDF6E8`
- Body: `#EDF7F2`
- Mind: `#EEF1F9`

### Typography
- **Serif:** Cormorant Garamond (Google Fonts or expo-google-fonts)
  - App title: 40px, weight 300
  - Habit labels: 18px, weight 400
  - Checked habit labels: 18px, weight 300, strikethrough
- **Monospace:** Courier Prime (Google Fonts or expo-google-fonts)
  - Date label, category labels, tab labels, counts: 10–12px, uppercase, tracked

### Spacing & Shape
- Category cards: `border-radius: 12`
- Progress card: `border-radius: 12`, `shadow: 0 1px 4px rgba(0,0,0,0.05)`
- Checkboxes: circular, 22px diameter
- Tab active indicator: 1.5px bottom border in gold (`#A07830`)

### Progress Bar
- Height: 4px
- Background: `#E8E4DE`
- Fill: linear gradient `#A07830 → #4A6096`
- Animated width change: 500ms ease

---

## iOS-Specific Requirements

- Safe area handling (notch, home indicator) via `SafeAreaView`
- Status bar style: dark content on light background
- No rubber-band scroll beyond content
- Tap feedback: subtle opacity on press (no ugly highlight)
- App icon: generate a simple icon — warm cream background, the "✦" symbol in gold

---

## Project Structure

```
/app
  _layout.tsx          # Root layout, tab navigator
  index.tsx            # Today screen
  week.tsx             # This Week screen
/components
  HabitItem.tsx        # Single habit row (checkbox + label)
  CategoryCard.tsx     # Category section wrapper
  ProgressCard.tsx     # Progress bar card
  WeekChart.tsx        # 7-bar chart component
/constants
  habits.ts            # HABITS array definition
  colors.ts            # Design tokens
/hooks
  useHabitData.ts      # AsyncStorage load/save + toggle logic
  useStreak.ts         # Streak calculation
/utils
  dates.ts             # getTodayKey(), getDateKey(daysAgo)
```

---

## Implementation Notes for Claude Code

1. **Start with `npx create-expo-app daily-disciplines --template blank-typescript`**
2. Install dependencies:
   ```
   expo install @react-native-async-storage/async-storage
   npx expo install expo-router
   npx expo install @expo-google-fonts/cormorant-garamond @expo-google-fonts/courier-prime expo-font
   ```
3. Build `useHabitData` hook first — all screens depend on it
4. The `daily-disciplines.html` reference file shows the exact visual design — match it closely
5. Use `Animated.timing` for progress bar width and checkbox transitions
6. Test streak logic with mock data before wiring to UI
7. Run on iOS Simulator to verify safe area, fonts, and tap behavior

---

## Out of Scope (v1)

- Push notifications / reminders
- Editing or adding habits
- Cloud sync or accounts
- Dark mode
- Onboarding flow
- Sharing or export

---

## Reference

The working HTML prototype (`daily-disciplines.html`) contains the complete visual design and all interaction logic translated into vanilla JS. Use it as the source of truth for layout, colors, and behavior.
