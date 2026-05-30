import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitData } from '../hooks/useHabitData';
import { useStreak } from '../hooks/useStreak';
import { ProgressCard } from '../components/ProgressCard';
import { CategoryCard } from '../components/CategoryCard';
import { HABITS, ALL_HABIT_IDS } from '../constants/habits';
import { Colors } from '../constants/colors';

export default function TodayScreen() {
  const { data, todayData, toggle } = useHabitData();
  const streak = useStreak(data);
  const total = ALL_HABIT_IDS.length;
  const done = ALL_HABIT_IDS.filter((id) => todayData[id]).length;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const subtitle =
    done === 0
      ? "Let's get started."
      : done < total
      ? 'Keep going, you\'re doing great.'
      : 'Every habit complete today. 🎉';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateLabel}>{dateStr}</Text>
        <Text style={styles.title}>Daily Disciplines</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <ProgressCard done={done} total={total} streak={streak} />

        {HABITS.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            checkedIds={todayData}
            onToggle={toggle}
          />
        ))}

        <Text style={styles.footer}>Small disciplines, compounded daily.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 32,
  },
  dateLabel: {
    fontFamily: 'CourierPrime_400Regular',
    fontSize: 10,
    letterSpacing: 3,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: 40,
    lineHeight: 44,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  footer: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 13,
    color: '#C0B8A8',
    textAlign: 'center',
    marginTop: 40,
  },
});
