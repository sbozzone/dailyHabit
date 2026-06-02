import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { HydrationTip } from '../../components/HydrationTip';
import { PaceStatus } from '../../components/PaceStatus';
import { WaterGlass } from '../../components/WaterGlass';
import { colors, radius, spacing } from '../../constants/theme';
import { getTodaysTip } from '../../constants/tips';
import { useHydration } from '../../hooks/useHydration';
import { useNotifications } from '../../hooks/useNotifications';
import { formatOz, formatTime, greetingForHour } from '../../utils/hydrationUtils';

export default function HomeScreen() {
  const hydration = useHydration();
  const {
    settings,
    entries,
    consumedOz,
    paceTargetOz,
    fillPercent,
    pacePercent,
    paceStatus,
    celebrationPending,
    isLoading,
    logDrink,
    undoLastEntry,
    dismissCelebration,
  } = hydration;

  useNotifications(settings, consumedOz, entries.length > 0, isLoading);

  const logBtnScale = useRef(new Animated.Value(1)).current;
  const tip = getTodaysTip();
  const now = new Date();
  const greeting = greetingForHour(now.getHours());
  const dayLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  async function handleLog() {
    Animated.sequence([
      Animated.timing(logBtnScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(logBtnScale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
    ]).start();

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logDrink();
  }

  async function handleUndo() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await undoLastEntry();
  }

  if (isLoading) {
    return (
      <LinearGradient colors={[colors.backgroundDeep, colors.background]} style={styles.loading}>
        <Text style={{ fontSize: 32 }}>💧</Text>
      </LinearGradient>
    );
  }

  const isPastCutoff =
    now.getHours() * 60 + now.getMinutes() >= settings.cutoffHour * 60 + settings.cutoffMinute;

  return (
    <LinearGradient colors={[colors.backgroundDeep, colors.background, '#F0FAFF']} style={styles.bg}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>{greeting} 🌊</Text>
            <View style={styles.headerRight}>
              <Text style={styles.dayLabel}>{dayLabel}</Text>
              <Text style={styles.sips}>
                {entries.length} {entries.length === 1 ? 'sip' : 'sips'} today
              </Text>
            </View>
          </View>

          {/* Water glass hero */}
          <View style={styles.glassRow}>
            <WaterGlass
              fillPercent={fillPercent}
              pacePercent={pacePercent}
              goalOz={settings.goalOz}
              consumedOz={consumedOz}
            />
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{Math.round(consumedOz)}</Text>
              <Text style={styles.statLabel}>oz consumed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{Math.max(0, Math.round(settings.goalOz - consumedOz))}</Text>
              <Text style={styles.statLabel}>oz to go</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{formatTime(settings.cutoffHour, settings.cutoffMinute)}</Text>
              <Text style={styles.statLabel}>cutoff</Text>
            </View>
          </View>

          {/* Pace status */}
          <PaceStatus
            consumedOz={consumedOz}
            paceTargetOz={paceTargetOz}
            goalOz={settings.goalOz}
            paceStatus={paceStatus}
          />

          {/* Log button */}
          {!isPastCutoff && consumedOz < settings.goalOz && (
            <Animated.View style={{ transform: [{ scale: logBtnScale }] }}>
              <TouchableOpacity
                style={styles.logBtn}
                onPress={handleLog}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.accent, colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logBtnGradient}
                >
                  <Text style={styles.logBtnEmoji}>{settings.vesselEmoji}</Text>
                  <View>
                    <Text style={styles.logBtnText}>Log a Drink</Text>
                    <Text style={styles.logBtnSub}>+{settings.vesselOz} oz · {settings.vesselName}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Goal complete state */}
          {consumedOz >= settings.goalOz && (
            <View style={styles.completeCard}>
              <Text style={styles.completeEmoji}>🏆</Text>
              <Text style={styles.completeText}>Goal complete — amazing work!</Text>
            </View>
          )}

          {/* Past cutoff state */}
          {isPastCutoff && consumedOz < settings.goalOz && (
            <View style={styles.cutoffCard}>
              <Text style={styles.cutoffEmoji}>🌙</Text>
              <Text style={styles.cutoffText}>
                Cutoff time reached. Hydration complete for today!
              </Text>
            </View>
          )}

          {/* Undo */}
          {entries.length > 0 && (
            <TouchableOpacity style={styles.undoBtn} onPress={handleUndo}>
              <Text style={styles.undoText}>↩ Undo last entry ({formatOz(entries[entries.length - 1].oz)})</Text>
            </TouchableOpacity>
          )}

          {/* Tip of the day */}
          <HydrationTip tip={tip} />

          {/* Bottom padding */}
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </SafeAreaView>

      <CelebrationOverlay
        visible={celebrationPending}
        onDismiss={() => {
          dismissCelebration();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: -0.2,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  dayLabel: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: '500',
  },
  sips: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  glassRow: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSoft,
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  logBtn: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  logBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 18,
    paddingHorizontal: spacing.xl,
  },
  logBtnEmoji: {
    fontSize: 32,
  },
  logBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  logBtnSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: 1,
  },
  completeCard: {
    backgroundColor: colors.successLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  completeEmoji: { fontSize: 28 },
  completeText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#065F46',
  },
  cutoffCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  cutoffEmoji: { fontSize: 28 },
  cutoffText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMed,
  },
  undoBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  undoText: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: '500',
  },
});
