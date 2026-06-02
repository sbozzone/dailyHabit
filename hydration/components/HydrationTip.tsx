import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import type { HydrationTip as TipType } from '../constants/tips';

const CATEGORY_CONFIG = {
  fact: { label: 'Did you know?', color: '#7C3AED', bg: '#EDE9FE' },
  habit: { label: 'Habit tip', color: '#0891B2', bg: '#E0F2FE' },
  benefit: { label: 'Why it matters', color: '#059669', bg: '#D1FAE5' },
  motivation: { label: 'Keep going', color: '#D97706', bg: '#FEF3C7' },
} as const;

interface Props {
  tip: TipType;
}

export function HydrationTip({ tip }: Props) {
  const config = CATEGORY_CONFIG[tip.category];

  return (
    <View style={styles.container}>
      <View style={[styles.labelRow]}>
        <View style={[styles.labelPill, { backgroundColor: config.bg }]}>
          <Text style={[styles.label, { color: config.color }]}>💡 {config.label}</Text>
        </View>
      </View>
      <Text style={styles.text}>{tip.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
  },
  labelPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  text: {
    fontSize: 14,
    color: colors.textMed,
    lineHeight: 21,
    fontWeight: '400',
  },
});
