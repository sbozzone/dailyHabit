import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '../utils/dates';

export type HabitData = {
  [dateKey: string]: { [habitId: string]: boolean };
};

type HabitContextValue = {
  data: HabitData;
  toggle: (habitId: string) => void;
  loaded: boolean;
};

const HabitContext = createContext<HabitContextValue | null>(null);

const STORAGE_KEY = 'habitData';

export function HabitProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HabitData>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setData(JSON.parse(raw));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const toggle = useCallback((habitId: string) => {
    const key = getTodayKey();
    setData((prev) => {
      const next: HabitData = {
        ...prev,
        [key]: {
          ...(prev[key] ?? {}),
          [habitId]: !(prev[key]?.[habitId] ?? false),
        },
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return React.createElement(
    HabitContext.Provider,
    { value: { data, toggle, loaded } },
    children
  );
}

export function useHabitData() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabitData must be inside HabitProvider');
  return {
    data: ctx.data,
    todayData: ctx.data[getTodayKey()] ?? {},
    toggle: ctx.toggle,
    loaded: ctx.loaded,
  };
}
