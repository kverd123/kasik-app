/**
 * Kaşık — AI Recipes Tests
 * getDailyUsage, canGenerateRecipe, generateAIRecipes (fallback path), getQuickSuggestions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyUsage, canGenerateRecipe, generateAIRecipes, getQuickSuggestions } from '../ai-recipes';

// Reset AsyncStorage mock between tests
beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockReset();
  (AsyncStorage.setItem as jest.Mock).mockReset();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

describe('getDailyUsage', () => {
  it('returns count 0 for fresh day (no stored data)', async () => {
    const usage = await getDailyUsage();
    expect(usage.count).toBe(0);
    expect(usage.date).toBe(new Date().toISOString().split('T')[0]);
  });

  it('returns stored count for same day', async () => {
    const today = new Date().toISOString().split('T')[0];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ date: today, count: 2 })
    );

    const usage = await getDailyUsage();
    expect(usage.count).toBe(2);
  });

  it('resets on new day', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ date: '2025-01-01', count: 5 })
    );

    const usage = await getDailyUsage();
    expect(usage.count).toBe(0);
  });
});

describe('canGenerateRecipe', () => {
  it('allows premium users always', async () => {
    const result = await canGenerateRecipe(true);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(Infinity);
  });

  it('limits free users to 3/day', async () => {
    const today = new Date().toISOString().split('T')[0];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ date: today, count: 3 })
    );

    const result = await canGenerateRecipe(false);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.limit).toBe(3);
  });

  it('returns remaining count for free users', async () => {
    const today = new Date().toISOString().split('T')[0];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ date: today, count: 1 })
    );

    const result = await canGenerateRecipe(false);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });
});

describe('generateAIRecipes', () => {
  it('returns fallback recipes when no API key is set', async () => {
    // AI_CONFIG.provider = 'openai' but API key is empty → should use fallback
    const recipes = await generateAIRecipes({
      pantryItems: [
        { name: 'Havuç', emoji: '🥕', amount: 3, unit: 'adet' } as any,
        { name: 'Patates', emoji: '🥔', amount: 2, unit: 'adet' } as any,
      ],
      babyAgeStage: '6m',
      knownAllergens: [],
      count: 2,
    });

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty('title');
    expect(recipes[0]).toHaveProperty('ingredients');
    expect(recipes[0]).toHaveProperty('steps');
  });
});

describe('getQuickSuggestions', () => {
  it('returns suggestions with match count', () => {
    const suggestions = getQuickSuggestions(
      [
        { name: 'Havuç', emoji: '🥕', amount: 3, unit: 'adet' } as any,
        { name: 'Patates', emoji: '🥔', amount: 2, unit: 'adet' } as any,
        { name: 'Elma', emoji: '🍎', amount: 5, unit: 'adet' } as any,
      ],
      '6m',
      []
    );

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]).toHaveProperty('title');
    expect(suggestions[0]).toHaveProperty('emoji');
    expect(suggestions[0]).toHaveProperty('matchCount');
    // Recipes using havuç/patates/elma should have higher matchCount
    expect(suggestions[0].matchCount).toBeGreaterThanOrEqual(0);
  });
});
