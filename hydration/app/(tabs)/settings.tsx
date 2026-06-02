import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VESSEL_PRESETS } from '../../constants/vessels';
import { colors, radius, spacing } from '../../constants/theme';
import { useHydration } from '../../hooks/useHydration';
import { requestNotificationPermission } from '../../hooks/useNotifications';
import { formatTime } from '../../utils/hydrationUtils';

const GOAL_OPTIONS = [48, 56, 64, 72, 80, 96, 128];
const WAKE_HOURS = [5, 6, 7, 8, 9];
const CUTOFF_HOURS = [18, 19, 20, 21, 22];

export default function SettingsScreen() {
  const { settings, updateSettings, entries, undoLastEntry } = useHydration();
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => {
    requestNotificationPermission().then(setNotifEnabled);
  }, []);

  async function resetToday() {
    Alert.alert(
      'Reset today?',
      'This will clear all of today\'s logged drinks.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            for (let i = entries.length; i > 0; i--) {
              await undoLastEntry();
            }
          },
        },
      ]
    );
  }

  return (
    <LinearGradient colors={[colors.backgroundDeep, colors.background, '#F0FAFF']} style={styles.bg}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Settings ⚙️</Text>

          {/* Daily goal */}
          <Section title="Daily Goal" icon="🎯">
            <Text style={styles.settingDesc}>How much water to drink each day.</Text>
            <View style={styles.chipRow}>
              {GOAL_OPTIONS.map((oz) => (
                <TouchableOpacity
                  key={oz}
                  style={[styles.chip, settings.goalOz === oz && styles.chipActive]}
                  onPress={() => updateSettings({ goalOz: oz })}
                >
                  <Text style={[styles.chipText, settings.goalOz === oz && styles.chipTextActive]}>
                    {oz} oz
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          {/* Wake time */}
          <Section title="Wake Time" icon="☀️">
            <Text style={styles.settingDesc}>Pace calculation starts from this time.</Text>
            <View style={styles.chipRow}>
              {WAKE_HOURS.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.chip, settings.wakeHour === h && styles.chipActive]}
                  onPress={() => updateSettings({ wakeHour: h, wakeMinute: 0 })}
                >
                  <Text style={[styles.chipText, settings.wakeHour === h && styles.chipTextActive]}>
                    {formatTime(h, 0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          {/* Cutoff time */}
          <Section title="Cutoff Time" icon="🌙">
            <Text style={styles.settingDesc}>Reminders stop after this time.</Text>
            <View style={styles.chipRow}>
              {CUTOFF_HOURS.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.chip, settings.cutoffHour === h && styles.chipActive]}
                  onPress={() => updateSettings({ cutoffHour: h, cutoffMinute: 0 })}
                >
                  <Text style={[styles.chipText, settings.cutoffHour === h && styles.chipTextActive]}>
                    {formatTime(h, 0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          {/* Vessel size */}
          <Section title="Default Vessel" icon="🥤">
            <Text style={styles.settingDesc}>
              Your go-to drinking container. One tap logs this amount.
            </Text>
            <View style={styles.vesselGrid}>
              {VESSEL_PRESETS.map((v) => {
                const isActive = settings.vesselOz === v.oz;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.vesselCard, isActive && styles.vesselCardActive]}
                    onPress={() =>
                      updateSettings({
                        vesselOz: v.oz,
                        vesselName: v.name,
                        vesselEmoji: v.emoji,
                      })
                    }
                  >
                    <Text style={styles.vesselEmoji}>{v.emoji}</Text>
                    <Text style={[styles.vesselName, isActive && styles.vesselNameActive]}>
                      {v.name}
                    </Text>
                    <Text style={[styles.vesselOz, isActive && styles.vesselOzActive]}>
                      {v.oz} oz
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          {/* Notifications */}
          <Section title="Reminders" icon="🔔">
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingDesc}>
                  Get nudged to drink between your wake and cutoff times.
                </Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={async (v) => {
                  if (v) {
                    const granted = await requestNotificationPermission();
                    setNotifEnabled(granted);
                  } else {
                    setNotifEnabled(false);
                  }
                }}
                trackColor={{ false: '#CBD5E1', true: colors.primaryLight }}
                thumbColor={notifEnabled ? colors.primary : '#94A3B8'}
              />
            </View>
          </Section>

          {/* Danger zone */}
          <Section title="Today's Log" icon="📋">
            <Text style={styles.settingDesc}>
              {entries.length} drink{entries.length !== 1 ? 's' : ''} logged today.
            </Text>
            <TouchableOpacity style={styles.resetBtn} onPress={resetToday}>
              <Text style={styles.resetText}>Reset Today's Progress</Text>
            </TouchableOpacity>
          </Section>

          {/* App info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>💧 Daily Hydration</Text>
            <Text style={styles.footerSub}>Drink earlier. Sleep better. Feel great.</Text>
          </View>

          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: -0.3,
    paddingTop: spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.1,
  },
  sectionBody: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  settingDesc: {
    fontSize: 13,
    color: colors.textSoft,
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMed,
  },
  chipTextActive: { color: '#fff' },
  vesselGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vesselCard: {
    width: 90,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    gap: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  vesselCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#E0F7FA',
  },
  vesselEmoji: { fontSize: 22 },
  vesselName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSoft,
    textAlign: 'center',
  },
  vesselNameActive: { color: colors.primaryDark },
  vesselOz: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSoft,
  },
  vesselOzActive: { color: colors.primary },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resetBtn: {
    paddingVertical: 11,
    borderRadius: radius.md,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    gap: 4,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  footerSub: {
    fontSize: 13,
    color: colors.textSoft,
  },
});
