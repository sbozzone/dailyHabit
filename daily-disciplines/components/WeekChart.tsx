import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { HabitData } from '../hooks/useHabitData';
import { ALL_HABIT_IDS, HABITS } from '../constants/habits';
import { getDateKey, getTodayKey } from '../utils/dates';
import { Colors } from '../constants/colors';

type Props = { data: HabitData };

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BAR_MAX_H = 80;

function barColor(pct: number): string {
  if (pct === 1) return Colors.spiritual;
  if (pct > 0.5) return Colors.body;
  if (pct > 0) return Colors.mind;
  return '#D8D4CC';
}

type DayInfo = {
  key: string;
  done: number;
  total: number;
  dayName: string;
  isToday: boolean;
};

function buildWeekDays(data: HabitData): DayInfo[] {
  const todayKey = getTodayKey();
  const total = ALL_HABIT_IDS.length;
  return Array.from({ length: 7 }, (_, i) => {
    const key = getDateKey(6 - i);
    const dayData = data[key] ?? {};
    const done = ALL_HABIT_IDS.filter((id) => dayData[id]).length;
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key, done, total, dayName: DAY_NAMES[d.getDay()], isToday: key === todayKey };
  });
}

function AnimatedBar({ day }: { day: DayInfo }) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const pct = day.total > 0 ? day.done / day.total : 0;
  const targetH = Math.round(pct * BAR_MAX_H);
  const color = barColor(pct);

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: targetH,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [targetH]);

  return (
    <View style={styles.barCol}>
      <Text style={[styles.barCount, day.isToday && styles.barCountToday]}>
        {day.done}/{day.total}
      </Text>
      <View style={styles.barWrap}>
        <Animated.View style={[styles.barFill, { height: heightAnim, backgroundColor: color }]} />
      </View>
      <Text style={[styles.dayName, day.isToday && styles.dayNameToday]}>
        {day.dayName}
      </Text>
    </View>
  );
}

export function WeekChart({ data }: Props) {
  const weekDays = buildWeekDays(data);

  return (
    <View>
      <View style={styles.barsRow}>
        {weekDays.map((day) => (
          <AnimatedBar key={day.key} day={day} />
        ))}
      </View>

      <View style={styles.summary}>
        {HABITS.map((cat, idx) => {
          const weekDone = weekDays.reduce((acc, day) => {
            const dayData = data[day.key] ?? {};
            return acc + cat.habits.filter((h) => dayData[h.id]).length;
          }, 0);
          const weekTotal = cat.habits.length * 7;
          const pct = Math.round((weekDone / weekTotal) * 100);
          const isLast = idx === HABITS.length - 1;
          return (
            <View key={cat.id} style={[styles.summaryRow, isLast && { borderBottomWidth: 0 }]}>
              <View style={styles.summaryName}>
                <Text style={{ color: cat.color, fontSize: 13 }}>{cat.icon}</Text>
                <Text style={styles.summaryLabel}>{cat.label}</Text>
              </View>
              <Text style={[styles.summaryPct, { color: cat.color }]}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barCount: {
    fontFamily: 'CourierPrime_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
  },
  barCountToday: {
    color: Colors.spiritual,
  },
  barWrap: {
    width: 28,
    height: BAR_MAX_H,
    backgroundColor: Colors.barEmpty,
    borderRadius: 14,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 14,
  },
  dayName: {
    fontFamily: 'CourierPrime_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  dayNameToday: {
    fontFamily: 'CourierPrime_700Bold',
    color: Colors.textPrimary,
  },
  summary: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  summaryPct: {
    fontFamily: 'CourierPrime_400Regular',
    fontSize: 12,
  },
});
