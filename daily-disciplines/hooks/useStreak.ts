import { useMemo } from 'react';
import { getDateKey } from '../utils/dates';
import { ALL_HABIT_IDS } from '../constants/habits';
import { HabitData } from './useHabitData';

export function useStreak(data: HabitData): number {
  return useMemo(() => {
    const total = ALL_HABIT_IDS.length;
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const key = getDateKey(i);
      const dayData = data[key] ?? {};
      const done = ALL_HABIT_IDS.filter((id) => dayData[id]).length;
      if (done === total) {
        streak++;
      } else if (i > 0) {
        // Don't break on today (i=0) being partial — only break on past days
        break;
      }
    }
    return streak;
  }, [data]);
}
