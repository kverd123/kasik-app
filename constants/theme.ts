/**
 * Kaşık — Design System: Theme
 * Typography, spacing, border radius, shadows
 */

import { Colors } from './colors';

export const FontFamily = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 15,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 42,
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 16,
  xxl: 20,
  round: 9999,
} as const;

export const Shadow = {
  card: {
    shadowColor: Colors.sage,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: Colors.sage,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const Typography = {
  h1: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xxxl,
    color: Colors.textDark,
    lineHeight: 36,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textDark,
    lineHeight: 30,
  },
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textDark,
    lineHeight: 24,
  },
  body: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textDark,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textMid,
    lineHeight: 20,
  },
  caption: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    lineHeight: 16,
  },
  label: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  badge: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    lineHeight: 14,
  },
  button: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textOnPrimary,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
} as const;
