export const colors = {
  background: '#E8F5FE',
  backgroundDeep: '#C7E9F7',
  surface: '#FFFFFF',
  surfaceAlt: 'rgba(255,255,255,0.88)',
  primary: '#0891B2',
  primaryLight: '#67E8F9',
  primaryDark: '#0E7490',
  water: '#38BDF8',
  waterDeep: '#0284C7',
  waterGlass: '#F0FAFF',
  accent: '#06B6D4',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  behind: '#EF4444',
  behindLight: '#FEE2E2',
  text: '#0F172A',
  textMed: '#334155',
  textSoft: '#64748B',
  textInverse: '#FFFFFF',
  border: 'rgba(8,145,178,0.2)',
  borderStrong: '#0891B2',
  glassBorder: '#7DD3FC',
  paceLineAhead: 'rgba(255,255,255,0.9)',
  paceLineBehind: 'rgba(252,165,3,0.9)',
  shadow: 'rgba(8,145,178,0.15)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const typography = {
  hero: { fontSize: 52, fontWeight: '700' as const, letterSpacing: -1 },
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyMed: { fontSize: 16, fontWeight: '500' as const },
  small: { fontSize: 13, fontWeight: '400' as const },
  smallMed: { fontSize: 13, fontWeight: '500' as const },
  tiny: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.8 },
};
