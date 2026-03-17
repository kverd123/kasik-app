/**
 * Kaşık — Allergen Database
 * 9 major allergens with Turkish labels
 */

import { AllergenInfo, AllergenType } from '../types';

export const ALLERGENS: AllergenInfo[] = [
  {
    type: 'milk',
    label: 'Süt',
    emoji: '🥛',
    description: 'İnek sütü ve süt ürünleri (peynir, yoğurt, tereyağı)',
  },
  {
    type: 'egg',
    label: 'Yumurta',
    emoji: '🥚',
    description: 'Yumurta beyazı ve sarısı',
  },
  {
    type: 'wheat',
    label: 'Buğday',
    emoji: '🌾',
    description: 'Buğday, gluten içeren tahıllar',
  },
  {
    type: 'soy',
    label: 'Soya',
    emoji: '🫘',
    description: 'Soya fasulyesi ve soya ürünleri',
  },
  {
    type: 'peanut',
    label: 'Yer Fıstığı',
    emoji: '🥜',
    description: 'Yer fıstığı ve yer fıstığı ürünleri',
  },
  {
    type: 'tree_nut',
    label: 'Ağaç Kabukluları',
    emoji: '🌰',
    description: 'Ceviz, fındık, badem, antep fıstığı',
  },
  {
    type: 'fish',
    label: 'Balık',
    emoji: '🐟',
    description: 'Tüm balık türleri',
  },
  {
    type: 'shellfish',
    label: 'Kabuklu Deniz Ürünleri',
    emoji: '🦐',
    description: 'Karides, istakoz, yengeç, midye',
  },
  {
    type: 'sesame',
    label: 'Susam',
    emoji: '🫓',
    description: 'Susam tohumu ve susam yağı',
  },
];

export const getAllergenByType = (type: AllergenType): AllergenInfo | undefined =>
  ALLERGENS.find((a) => a.type === type);

export const getAllergenLabel = (type: AllergenType): string =>
  type === 'other' ? 'Diğer' : (getAllergenByType(type)?.label ?? type);

export const getAllergenEmoji = (type: AllergenType): string =>
  type === 'other' ? '⚠️' : (getAllergenByType(type)?.emoji ?? '⚠️');
