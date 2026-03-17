/**
 * Kaşık — useColors Hook
 * Returns the current theme's color palette based on dark/light mode.
 */

import { useThemeStore } from '../stores/themeStore';
import { LightColors, DarkColors, ThemeColors } from '../constants/colors';

export function useColors(): ThemeColors {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? DarkColors : LightColors;
}
