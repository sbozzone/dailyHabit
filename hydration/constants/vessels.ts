export interface Vessel {
  id: string;
  name: string;
  oz: number;
  emoji: string;
}

export const VESSEL_PRESETS: Vessel[] = [
  { id: 'cup-sm', name: 'Small Cup', oz: 8, emoji: '☕' },
  { id: 'cup-md', name: 'Medium Cup', oz: 12, emoji: '🥤' },
  { id: 'cup-lg', name: 'Large Cup', oz: 16, emoji: '🥛' },
  { id: 'bottle-sm', name: 'Small Bottle', oz: 20, emoji: '💧' },
  { id: 'bottle-md', name: 'Bottle', oz: 24, emoji: '🍶' },
  { id: 'bottle-lg', name: 'Large Bottle', oz: 32, emoji: '🫙' },
];

export const DEFAULT_VESSEL = VESSEL_PRESETS[2]; // 16 oz cup
