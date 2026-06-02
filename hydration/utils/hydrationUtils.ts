export function minutesSinceMidnight(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

export function formatOz(oz: number): string {
  return `${Math.round(oz * 10) / 10} oz`;
}

export function todayDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Returns how many oz the user should have consumed by now
 * based on a linear ramp from wakeTime to cutoffTime.
 */
export function calculatePaceTarget(
  goalOz: number,
  wakeHour: number,
  wakeMinute: number,
  cutoffHour: number,
  cutoffMinute: number,
  now: Date = new Date()
): number {
  const wakeMinutes = wakeHour * 60 + wakeMinute;
  const cutoffMinutes = cutoffHour * 60 + cutoffMinute;
  const currentMinutes = minutesSinceMidnight(now);

  if (currentMinutes <= wakeMinutes) return 0;
  if (currentMinutes >= cutoffMinutes) return goalOz;

  const elapsed = currentMinutes - wakeMinutes;
  const total = cutoffMinutes - wakeMinutes;
  return goalOz * (elapsed / total);
}

/**
 * Returns how many minutes until the next reminder should fire.
 * Returns null if no more reminders needed (goal reached or past cutoff).
 */
export function calculateNextReminderMinutes(
  goalOz: number,
  consumedOz: number,
  vesselOz: number,
  cutoffHour: number,
  cutoffMinute: number,
  now: Date = new Date()
): number | null {
  const remaining = goalOz - consumedOz;
  const cutoffMinutes = cutoffHour * 60 + cutoffMinute;
  const currentMinutes = minutesSinceMidnight(now);
  const timeRemainingMinutes = cutoffMinutes - currentMinutes;

  if (remaining <= 0) return null;
  if (timeRemainingMinutes <= 0) return null;

  const servingsNeeded = Math.ceil(remaining / vesselOz);
  const intervalMinutes = timeRemainingMinutes / servingsNeeded;

  // Clamp: at least 15 min apart, no more than 2 hours apart
  return Math.max(15, Math.min(120, intervalMinutes));
}

/**
 * Builds an array of scheduled reminder times (in seconds from now).
 */
export function buildReminderSchedule(
  goalOz: number,
  consumedOz: number,
  vesselOz: number,
  cutoffHour: number,
  cutoffMinute: number,
  now: Date = new Date()
): number[] {
  const remaining = goalOz - consumedOz;
  const cutoffMinutes = cutoffHour * 60 + cutoffMinute;
  const currentMinutes = minutesSinceMidnight(now);
  const timeRemainingMinutes = cutoffMinutes - currentMinutes;

  if (remaining <= 0 || timeRemainingMinutes <= 15) return [];

  const servingsNeeded = Math.ceil(remaining / vesselOz);
  const intervalMinutes = Math.max(15, Math.min(120, timeRemainingMinutes / servingsNeeded));

  const schedule: number[] = [];
  for (let i = 1; i <= servingsNeeded; i++) {
    const offsetMinutes = i * intervalMinutes;
    if (currentMinutes + offsetMinutes >= cutoffMinutes) break;
    schedule.push(Math.round(offsetMinutes * 60)); // seconds from now
  }

  return schedule;
}

export function getPaceStatus(
  consumedOz: number,
  paceTargetOz: number
): 'ahead' | 'on' | 'behind' | 'complete' | 'idle' {
  if (consumedOz === 0 && paceTargetOz === 0) return 'idle';
  const diff = consumedOz - paceTargetOz;
  if (diff >= 8) return 'ahead';
  if (diff >= -4) return 'on';
  return 'behind';
}

export function getPaceMessage(
  status: ReturnType<typeof getPaceStatus>,
  consumedOz: number,
  paceTargetOz: number,
  goalOz: number
): string {
  const diff = Math.abs(consumedOz - paceTargetOz);
  switch (status) {
    case 'idle':
      return 'Log your first drink to start the day!';
    case 'ahead':
      return `${Math.round(diff)} oz ahead of pace — you're winning the day!`;
    case 'on':
      return 'Right on pace — keep it up!';
    case 'behind':
      return `${Math.round(diff)} oz behind pace — time to catch up.`;
    case 'complete':
      return 'Daily goal complete! Amazing work!';
  }
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
