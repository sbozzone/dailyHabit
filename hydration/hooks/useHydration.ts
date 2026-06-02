import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_SETTINGS,
  HydrationSettings,
  LogEntry,
  generateId,
  loadSettings,
  loadTodayLog,
  saveSettings,
  saveTodayLog,
} from '../utils/storage';
import { calculatePaceTarget, getPaceStatus, todayDateString } from '../utils/hydrationUtils';

export interface HydrationState {
  settings: HydrationSettings;
  entries: LogEntry[];
  consumedOz: number;
  paceTargetOz: number;
  fillPercent: number;
  pacePercent: number;
  paceStatus: ReturnType<typeof getPaceStatus>;
  isLoading: boolean;
  goalReachedAt: number | null; // timestamp when goal was first reached
  celebrationPending: boolean;
}

export interface HydrationActions {
  logDrink: (oz?: number) => Promise<void>;
  undoLastEntry: () => Promise<void>;
  updateSettings: (partial: Partial<HydrationSettings>) => Promise<void>;
  dismissCelebration: () => void;
  refresh: () => void;
}

export function useHydration(): HydrationState & HydrationActions {
  const [settings, setSettings] = useState<HydrationSettings>(DEFAULT_SETTINGS);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [goalReachedAt, setGoalReachedAt] = useState<number | null>(null);
  const [celebrationPending, setCelebrationPending] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const wasGoalReached = useRef(false);

  const todayDate = todayDateString(now);

  // Refresh "now" every minute so pace updates live
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      const [s, e] = await Promise.all([
        loadSettings(),
        loadTodayLog(todayDate),
      ]);
      setSettings(s);
      setEntries(e);
      setIsLoading(false);
    })();
  }, []);

  const consumedOz = entries.reduce((sum, e) => sum + e.oz, 0);

  const paceTargetOz = calculatePaceTarget(
    settings.goalOz,
    settings.wakeHour,
    settings.wakeMinute,
    settings.cutoffHour,
    settings.cutoffMinute,
    now
  );

  const fillPercent = Math.min(100, (consumedOz / settings.goalOz) * 100);
  const pacePercent = Math.min(100, (paceTargetOz / settings.goalOz) * 100);
  const paceStatus = consumedOz >= settings.goalOz
    ? 'complete'
    : getPaceStatus(consumedOz, paceTargetOz);

  // Detect goal completion for celebration
  useEffect(() => {
    if (!isLoading && consumedOz >= settings.goalOz && !wasGoalReached.current) {
      wasGoalReached.current = true;
      setGoalReachedAt(Date.now());
      setCelebrationPending(true);
    }
    if (consumedOz < settings.goalOz) {
      wasGoalReached.current = false;
    }
  }, [consumedOz, settings.goalOz, isLoading]);

  const logDrink = useCallback(async (oz?: number) => {
    const drinkOz = oz ?? settings.vesselOz;
    const entry: LogEntry = {
      id: generateId(),
      timestamp: Date.now(),
      oz: drinkOz,
    };
    const next = [...entries, entry];
    setEntries(next);
    await saveTodayLog(todayDate, next);
  }, [entries, settings.vesselOz, todayDate]);

  const undoLastEntry = useCallback(async () => {
    if (entries.length === 0) return;
    const next = entries.slice(0, -1);
    // If undoing below goal threshold, allow re-celebration
    if (next.reduce((s, e) => s + e.oz, 0) < settings.goalOz) {
      wasGoalReached.current = false;
    }
    setEntries(next);
    await saveTodayLog(todayDate, next);
  }, [entries, settings.goalOz, todayDate]);

  const updateSettings = useCallback(async (partial: Partial<HydrationSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    await saveSettings(next);
  }, [settings]);

  const dismissCelebration = useCallback(() => {
    setCelebrationPending(false);
  }, []);

  const refresh = useCallback(() => {
    setNow(new Date());
  }, []);

  return {
    settings,
    entries,
    consumedOz,
    paceTargetOz,
    fillPercent,
    pacePercent,
    paceStatus,
    isLoading,
    goalReachedAt,
    celebrationPending,
    logDrink,
    undoLastEntry,
    updateSettings,
    dismissCelebration,
    refresh,
  };
}
