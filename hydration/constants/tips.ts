export interface HydrationTip {
  id: string;
  text: string;
  category: 'fact' | 'habit' | 'benefit' | 'motivation';
}

export const HYDRATION_TIPS: HydrationTip[] = [
  {
    id: 't1',
    text: 'Drinking water first thing in the morning jumpstarts your metabolism and flushes out overnight toxins.',
    category: 'habit',
  },
  {
    id: 't2',
    text: 'Even mild dehydration of 1–2% body weight can impair concentration, mood, and short-term memory.',
    category: 'fact',
  },
  {
    id: 't3',
    text: 'Front-loading your hydration before 8 PM gives your kidneys time to process fluids before sleep — fewer nighttime trips.',
    category: 'benefit',
  },
  {
    id: 't4',
    text: 'Your kidneys can process about 1 liter of water per hour. Steady sipping beats big gulps.',
    category: 'fact',
  },
  {
    id: 't5',
    text: 'Thirst is a late signal. By the time you feel thirsty, you may already be slightly dehydrated.',
    category: 'fact',
  },
  {
    id: 't6',
    text: 'Drinking water before meals supports healthy digestion and can help you feel satisfied with smaller portions.',
    category: 'benefit',
  },
  {
    id: 't7',
    text: 'Proper hydration helps maintain healthy skin elasticity and a natural glow — better than any cream.',
    category: 'benefit',
  },
  {
    id: 't8',
    text: 'Water carries oxygen and nutrients to every cell in your body. It is literally life-giving.',
    category: 'fact',
  },
  {
    id: 't9',
    text: 'Consistent daily hydration is more effective than occasional large amounts. Small steps, big results.',
    category: 'motivation',
  },
  {
    id: 't10',
    text: 'Your muscles are about 75% water. Staying hydrated helps you feel stronger and recover faster.',
    category: 'benefit',
  },
  {
    id: 't11',
    text: 'A glass of water can help reduce the intensity of a headache — dehydration is a common trigger.',
    category: 'benefit',
  },
  {
    id: 't12',
    text: 'Cold water is absorbed slightly faster by the body than warm water, which can be helpful post-workout.',
    category: 'fact',
  },
  {
    id: 't13',
    text: 'Drinking water with each meal is an easy way to build a consistent hydration habit over time.',
    category: 'habit',
  },
  {
    id: 't14',
    text: 'Staying well-hydrated supports your immune system, helping your body fight off illness more effectively.',
    category: 'benefit',
  },
  {
    id: 't15',
    text: 'Water is involved in nearly every metabolic process in your body — from energy production to waste removal.',
    category: 'fact',
  },
  {
    id: 't16',
    text: 'Pairing a glass of water with an existing habit — morning coffee, brushing teeth — makes it automatic.',
    category: 'habit',
  },
  {
    id: 't17',
    text: 'Your brain is about 85% water. Well-hydrated thinking is sharper, faster, and more creative.',
    category: 'fact',
  },
  {
    id: 't18',
    text: 'Finishing your daily water goal before evening means better rest and waking up feeling refreshed.',
    category: 'benefit',
  },
  {
    id: 't19',
    text: 'Every small sip counts. You do not need to drink a full glass at once to make progress.',
    category: 'motivation',
  },
  {
    id: 't20',
    text: 'Hydration also comes from foods! Fruits and vegetables contain significant water content.',
    category: 'fact',
  },
  {
    id: 't21',
    text: 'Consistent hydration supports healthy blood pressure by keeping blood volume at optimal levels.',
    category: 'benefit',
  },
  {
    id: 't22',
    text: 'The best time to drink water is any time — but the earlier in the day, the better for sleep quality.',
    category: 'motivation',
  },
  {
    id: 't23',
    text: 'Drinking water during physical activity helps regulate your body temperature and maintain performance.',
    category: 'fact',
  },
  {
    id: 't24',
    text: 'A well-hydrated body detoxifies more efficiently, helping your liver and kidneys do their job.',
    category: 'benefit',
  },
  {
    id: 't25',
    text: 'You are already doing great just by tracking. Awareness is the first step to lasting change.',
    category: 'motivation',
  },
  {
    id: 't26',
    text: 'Morning hydration can boost your metabolism by up to 30% for 30–40 minutes. Start your engine.',
    category: 'fact',
  },
  {
    id: 't27',
    text: 'Hydration and mood are linked. Reaching your daily goal is a proven way to feel better throughout the day.',
    category: 'benefit',
  },
  {
    id: 't28',
    text: 'Each drink logged is a small win. Celebrate the habit, not just the goal.',
    category: 'motivation',
  },
];

export function getTodaysTip(date: Date = new Date()): HydrationTip {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return HYDRATION_TIPS[dayOfYear % HYDRATION_TIPS.length];
}

export const ENCOURAGEMENTS = [
  'Great sip! Keep it up! 💧',
  'Hydration hero! 🌊',
  'That is the way! 💪',
  'Your body thanks you! ✨',
  'One sip closer to your goal! 🎯',
  'Crushing it! 🌟',
  'You are on a roll! 🔥',
  'Healthy habit in action! 🌿',
];

export function getRandomEncouragement(): string {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

export const REMINDER_MESSAGES = [
  { title: 'Time to hydrate! 💧', body: 'A quick sip keeps you on pace for a great day.' },
  { title: 'Drink up! 🌊', body: 'Your body is counting on you. Grab some water.' },
  { title: 'Hydration check! ⚡', body: 'Staying hydrated keeps your mind sharp and energy high.' },
  { title: 'Quick water break! 🌿', body: 'Even a small sip moves you toward your goal.' },
  { title: 'Stay on pace! 🎯', body: 'A glass now means better sleep tonight.' },
  { title: 'Water time! 💦', body: 'Consistent sips throughout the day are the secret.' },
  { title: 'Friendly reminder 🌟', body: 'You are doing great. Keep that hydration going!' },
  { title: 'Almost there! 🏁', body: 'You are so close to your daily goal. Drink up!' },
];
