export type HabitId =
  | 'devotional'
  | 'bible'
  | 'pray'
  | 'walk'
  | 'think'
  | 'journal'
  | 'read';

export type HabitItem = {
  id: HabitId;
  label: string;
};

export type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  habits: HabitItem[];
};

export const HABITS: Category[] = [
  {
    id: 'spiritual',
    label: 'Spiritual',
    icon: '✦',
    color: '#A07830',
    bg: '#FDF6E8',
    habits: [
      { id: 'devotional', label: 'Daily Devotional' },
      { id: 'bible', label: 'Read a Chapter' },
      { id: 'pray', label: 'Pray' },
    ],
  },
  {
    id: 'body',
    label: 'Body',
    icon: '◈',
    color: '#3A7D5E',
    bg: '#EDF7F2',
    habits: [
      { id: 'walk', label: 'Walk the Dog' },
    ],
  },
  {
    id: 'mind',
    label: 'Mind',
    icon: '◎',
    color: '#4A6096',
    bg: '#EEF1F9',
    habits: [
      { id: 'think', label: 'Think & Reflect' },
      { id: 'journal', label: 'Journal' },
      { id: 'read', label: 'Read a Book' },
    ],
  },
];

export const ALL_HABIT_IDS: HabitId[] = HABITS.flatMap((c) => c.habits.map((h) => h.id));
