import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { getPaceMessage, getPaceStatus } from '../utils/hydrationUtils';

interface Props {
  consumedOz: number;
  paceTargetOz: number;
  goalOz: number;
  paceStatus: ReturnType<typeof getPaceStatus>;
}

const STATUS_CONFIG = {
  idle: { bg: colors.surface, border: colors.border, icon: '💧', iconBg: '#E0F7FA' },
  ahead: { bg: colors.successLight, border: colors.success, icon: '🏆', iconBg: '#A7F3D0' },
  on: { bg: '#EFF6FF', border: '#93C5FD', icon: '🎯', iconBg: '#DBEAFE' },
  behind: { bg: colors.warningLight, border: colors.warning, icon: '⏰', iconBg: '#FDE68A' },
  complete: { bg: '#D1FAE5', border: colors.success, icon: '🎉', iconBg: '#6EE7B7' },
} as const;

export function PaceStatus({ consumedOz, paceTargetOz, goalOz, paceStatus }: Props) {
  const config = STATUS_CONFIG[paceStatus];
  const message = getPaceMessage(paceStatus, consumedOz, paceTargetOz, goalOz);

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
  },
});
