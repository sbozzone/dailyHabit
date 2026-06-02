import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { REMINDER_MESSAGES } from '../constants/tips';
import { buildReminderSchedule } from '../utils/hydrationUtils';
import { HydrationSettings } from '../utils/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function clearAllReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function scheduleReminders(
  settings: HydrationSettings,
  consumedOz: number,
  firstDrinkLogged: boolean
): Promise<void> {
  if (Platform.OS === 'web') return;
  if (!firstDrinkLogged) return;

  await clearAllReminders();

  const schedule = buildReminderSchedule(
    settings.goalOz,
    consumedOz,
    settings.vesselOz,
    settings.cutoffHour,
    settings.cutoffMinute
  );

  for (let i = 0; i < schedule.length; i++) {
    const seconds = schedule[i];
    const msg = REMINDER_MESSAGES[i % REMINDER_MESSAGES.length];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: msg.title,
        body: msg.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
      },
    });
  }
}

export function useNotifications(
  settings: HydrationSettings,
  consumedOz: number,
  hasLogged: boolean,
  isLoading: boolean
): void {
  const permissionGranted = useRef(false);
  const lastConsumed = useRef<number>(-1);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    requestNotificationPermission().then((granted) => {
      permissionGranted.current = granted;
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!permissionGranted.current) return;
    // Reschedule whenever consumed changes or after first log
    if (consumedOz === lastConsumed.current) return;
    lastConsumed.current = consumedOz;
    scheduleReminders(settings, consumedOz, hasLogged);
  }, [consumedOz, settings, hasLogged, isLoading]);
}
