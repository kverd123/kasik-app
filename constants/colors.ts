/**
 * Kaşık — Ek Gıda Rehberi
 * Design System: Color Palette (Light + Dark)
 * Sage green, cream, peach, light blue — warm clinical style
 */

export const LightColors = {
  // Primary - Sage Green (biraz daha canlı ve sıcak)
  sage: '#8FB87A',
  sageDark: '#7AA065',
  sageLight: '#C8DDB8',
  sagePale: '#EEF6E8',

  // Neutrals - Cream
  cream: '#F7F3ED',
  creamDark: '#E8E2D8',
  creamMid: '#F0EBE3',

  // Accents
  peach: '#F5C0A0',
  peachLight: '#FFF3E0',
  blueLight: '#E8F0FA',
  blueMid: '#5B7BA8',

  // Text (güçlendirilmiş kontrast)
  textDark: '#2E2E1E',
  textMid: '#5A5A4A',
  textLight: '#9A937A',
  textXLight: '#C8C1A8',
  textOnPrimary: '#FFFFFF',

  // Semantic
  warning: '#F5D590',
  warningDark: '#E8A030',
  warningBg: '#FEF5E7',
  heart: '#F5A0A0',
  heartDark: '#C06070',
  success: '#6B8F55',
  successBg: '#EEF6E8',
  info: '#5B7BA8',
  infoDark: '#3D5A80',
  infoBg: '#E8F0FA',
  danger: '#D95555',
  dangerDark: '#B33A3A',
  dangerBg: '#FDECEC',
  star: '#E8A030',

  // UI
  white: '#FFFFFF',
  black: '#000000',
  border: '#D4CFC5',
  cardShadow: 'rgba(143, 170, 123, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Background gradients
  bgStart: '#F7F3ED',
  bgEnd: '#F0EBE3',
  headerStart: '#8FB87A',
  headerEnd: '#7AA065',
} as const;

export const DarkColors: ThemeColors = {
  // Primary - Sage Green (daha koyu & doygun)
  sage: '#7A9A68',
  sageDark: '#6B8B59',
  sageLight: '#3A4F32',
  sagePale: '#2A3A24',

  // Neutrals - Koyu arkaplan
  cream: '#1A1A1A',
  creamDark: '#2A2A2A',
  creamMid: '#222222',

  // Accents (koyu modda biraz daha soft)
  peach: '#C49070',
  peachLight: '#3A2E20',
  blueLight: '#1E2A3A',
  blueMid: '#7B9BC8',

  // Text (ters çevrilmiş, okunabilir kontrast)
  textDark: '#E8E8E0',
  textMid: '#B0B0A0',
  textLight: '#808070',
  textXLight: '#5A5A50',
  textOnPrimary: '#FFFFFF',

  // Semantic (koyu bg'ye uyumlu)
  warning: '#D4B060',
  warningDark: '#E0A030',
  warningBg: '#3A3020',
  heart: '#D08080',
  heartDark: '#E06070',
  success: '#7AAF65',
  successBg: '#1E2E1A',
  info: '#7B9BC8',
  infoDark: '#90B0D0',
  infoBg: '#1E2A3A',
  danger: '#E06060',
  dangerDark: '#F07070',
  dangerBg: '#3A1E1E',
  star: '#E0A030',

  // UI
  white: '#1E1E1E',
  black: '#F0F0F0',
  border: '#3A3A3A',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Background gradients
  bgStart: '#1A1A1A',
  bgEnd: '#222222',
  headerStart: '#3A4F32',
  headerEnd: '#2A3A24',
};

/** Tema renk tipi — LightColors ve DarkColors aynı shape'e sahip */
export type ThemeColors = { [K in keyof typeof LightColors]: string };

export type ColorKey = keyof ThemeColors;

/** Geriye uyumlu export — mevcut kodda `Colors.xxx` kullanan dosyalar çalışmaya devam eder */
export const Colors = LightColors;
