import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SETTINGS: 'hydration:settings',
  TODAY_LOG: 'hydration:today_log',
} as const;

export interface HydrationSettings {
  goalOz: number;
  cutoffHour: number;
  cutoffMinute: number;
  wakeHour: number;
  wakeMinute: number;
  vesselOz: number;
  vesselName: string;
  vesselEmoji: string;
  onboardingComplete: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  oz: number;
}

export interface TodayLog {
  date: string;
  entries: LogEntry[];
}

export const DEFAULT_SETTINGS: HydrationSettings = {
  goalOz: 64,
  cutoffHour: 20,
  cutoffMinute: 0,
  wakeHour: 7,
  wakeMinute: 0,
  vesselOz: 16,
  vesselName: 'Tumbler',
  vesselEmoji: '🥛',
  onboardingComplete: false,
};

export async function loadSettings(): Promise<HydrationSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: HydrationSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function loadTodayLog(todayDate: string): Promise<LogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TODAY_LOG);
    if (!raw) return [];
    const log: TodayLog = JSON.parse(raw);
    if (log.date !== todayDate) {
      // New day — clear yesterday's log
      await AsyncStorage.removeItem(KEYS.TODAY_LOG);
      return [];
    }
    return log.entries;
  } catch {
    return [];
  }
}

export async function saveTodayLog(date: string, entries: LogEntry[]): Promise<void> {
  const log: TodayLog = { date, entries };
  await AsyncStorage.setItem(KEYS.TODAY_LOG, JSON.stringify(log));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
