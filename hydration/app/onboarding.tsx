import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VESSEL_PRESETS } from '../constants/vessels';
import { colors, radius, spacing } from '../constants/theme';
import { DEFAULT_SETTINGS, HydrationSettings, saveSettings } from '../utils/storage';
import { formatTime } from '../utils/hydrationUtils';

const GOAL_OPTIONS = [48, 56, 64, 72, 80, 96, 128];
const WAKE_HOURS = [5, 6, 7, 8, 9];
const CUTOFF_HOURS = [18, 19, 20, 21, 22];

const STEPS = ['goal', 'timing', 'vessel'] as const;
type Step = (typeof STEPS)[number];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  const [goalOz, setGoalOz] = useState(64);
  const [wakeHour, setWakeHour] = useState(7);
  const [cutoffHour, setCutoffHour] = useState(20);
  const [vesselIdx, setVesselIdx] = useState(2);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const stepIdx = STEPS.indexOf(step);

  function animateNext(nextStep: Step) {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -40, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }).start();
    });
  }

  async function finish() {
    const vessel = VESSEL_PRESETS[vesselIdx];
    const settings: HydrationSettings = {
      ...DEFAULT_SETTINGS,
      goalOz,
      wakeHour,
      wakeMinute: 0,
      cutoffHour,
      cutoffMinute: 0,
      vesselOz: vessel.oz,
      vesselName: vessel.name,
      vesselEmoji: vessel.emoji,
      onboardingComplete: true,
    };
    await saveSettings(settings);
    router.replace('/(tabs)');
  }

  return (
    <LinearGradient colors={[colors.backgroundDeep, colors.background]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((s, i) => (
            <View
              key={s}
              style={[styles.dot, i <= stepIdx && styles.dotActive]}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            {step === 'goal' && (
              <GoalStep goalOz={goalOz} onSelect={setGoalOz} />
            )}
            {step === 'timing' && (
              <TimingStep
                wakeHour={wakeHour}
                cutoffHour={cutoffHour}
                onWake={setWakeHour}
                onCutoff={setCutoffHour}
              />
            )}
            {step === 'vessel' && (
              <VesselStep selected={vesselIdx} onSelect={setVesselIdx} />
            )}
          </Animated.View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navRow}>
          {stepIdx > 0 && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => animateNext(STEPS[stepIdx - 1])}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, stepIdx === 0 && styles.nextBtnFull]}
            onPress={() => {
              if (stepIdx < STEPS.length - 1) {
                animateNext(STEPS[stepIdx + 1]);
              } else {
                finish();
              }
            }}
          >
            <Text style={styles.nextText}>
              {stepIdx < STEPS.length - 1 ? 'Continue →' : 'Get Started! 💧'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function GoalStep({ goalOz, onSelect }: { goalOz: number; onSelect: (v: number) => void }) {
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepEmoji}>🎯</Text>
      <Text style={styles.stepTitle}>Set your daily goal</Text>
      <Text style={styles.stepSub}>
        Most adults thrive on 64–80 oz. Start conservative — you can always adjust.
      </Text>

      <View style={styles.optionGrid}>
        {GOAL_OPTIONS.map((oz) => (
          <TouchableOpacity
            key={oz}
            style={[styles.goalChip, goalOz === oz && styles.goalChipActive]}
            onPress={() => onSelect(oz)}
          >
            <Text style={[styles.goalChipNum, goalOz === oz && styles.goalChipNumActive]}>
              {oz}
            </Text>
            <Text style={[styles.goalChipUnit, goalOz === oz && styles.goalChipUnitActive]}>
              oz
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>
        Selected: <Text style={styles.hintBold}>{goalOz} oz</Text> per day
      </Text>
    </View>
  );
}

function TimingStep({
  wakeHour,
  cutoffHour,
  onWake,
  onCutoff,
}: {
  wakeHour: number;
  cutoffHour: number;
  onWake: (h: number) => void;
  onCutoff: (h: number) => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepEmoji}>⏰</Text>
      <Text style={styles.stepTitle}>Set your schedule</Text>
      <Text style={styles.stepSub}>
        Reminders run between your wake time and cutoff. Front-load your water to sleep better.
      </Text>

      <View style={styles.timingSection}>
        <Text style={styles.timingLabel}>I wake up around</Text>
        <View style={styles.timeRow}>
          {WAKE_HOURS.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.timeChip, wakeHour === h && styles.timeChipActive]}
              onPress={() => onWake(h)}
            >
              <Text style={[styles.timeChipText, wakeHour === h && styles.timeChipTextActive]}>
                {formatTime(h, 0)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.timingSection}>
        <Text style={styles.timingLabel}>Stop reminders at</Text>
        <View style={styles.timeRow}>
          {CUTOFF_HOURS.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.timeChip, cutoffHour === h && styles.timeChipActive]}
              onPress={() => onCutoff(h)}
            >
              <Text style={[styles.timeChipText, cutoffHour === h && styles.timeChipTextActive]}>
                {formatTime(h, 0)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Drink <Text style={styles.summaryBold}>{Math.round(64 / ((cutoffHour - wakeHour) / 1))} oz/hr</Text> from{' '}
          <Text style={styles.summaryBold}>{formatTime(wakeHour, 0)}</Text> to{' '}
          <Text style={styles.summaryBold}>{formatTime(cutoffHour, 0)}</Text>
        </Text>
      </View>
    </View>
  );
}

function VesselStep({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const vessel = VESSEL_PRESETS[selected];
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepEmoji}>🥤</Text>
      <Text style={styles.stepTitle}>Your go-to container</Text>
      <Text style={styles.stepSub}>
        We'll use this as your default serving size. Logging takes one tap.
      </Text>

      <View style={styles.vesselGrid}>
        {VESSEL_PRESETS.map((v, i) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.vesselCard, selected === i && styles.vesselCardActive]}
            onPress={() => onSelect(i)}
          >
            <Text style={styles.vesselEmoji}>{v.emoji}</Text>
            <Text style={[styles.vesselName, selected === i && styles.vesselNameActive]}>
              {v.name}
            </Text>
            <Text style={[styles.vesselOz, selected === i && styles.vesselOzActive]}>
              {v.oz} oz
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>
        Logging one <Text style={styles.hintBold}>{vessel.name}</Text> adds{' '}
        <Text style={styles.hintBold}>{vessel.oz} oz</Text> to your daily total.
      </Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.md },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(8,145,178,0.25)',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  content: { flexGrow: 1, paddingBottom: spacing.xl },
  stepWrap: { gap: spacing.lg },
  stepEmoji: { fontSize: 52, textAlign: 'center' },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  stepSub: {
    fontSize: 15,
    color: colors.textSoft,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  goalChip: {
    width: 76,
    paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  goalChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#E0F7FA',
  },
  goalChipNum: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textSoft,
  },
  goalChipNumActive: { color: colors.primary },
  goalChipUnit: {
    fontSize: 11,
    color: colors.textSoft,
    fontWeight: '500',
  },
  goalChipUnitActive: { color: colors.primaryDark },
  hint: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: 'center',
  },
  hintBold: { color: colors.primary, fontWeight: '600' },
  timingSection: { gap: spacing.sm },
  timingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMed,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMed,
  },
  timeChipTextActive: { color: '#fff' },
  summaryBox: {
    backgroundColor: '#E0F7FA',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textMed,
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryBold: { fontWeight: '700', color: colors.primaryDark },
  vesselGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  vesselCard: {
    width: 100,
    paddingVertical: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: colors.border,
  },
  vesselCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#E0F7FA',
  },
  vesselEmoji: { fontSize: 28 },
  vesselName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSoft,
    textAlign: 'center',
  },
  vesselNameActive: { color: colors.primaryDark },
  vesselOz: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSoft,
  },
  vesselOzActive: { color: colors.primary },
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMed,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  nextBtnFull: { flex: 1 },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
