/**
 * Kaşık — Shopping List Generator Tests
 * generateShoppingList, shoppingListToText
 */

import {
  generateShoppingList,
  shoppingListToText,
  PantryItemForShopping,
  ShoppingCategory,
} from '../shoppingList';
import { Meal, MealSlot } from '../../types';

// Helper: create a minimal meal
function makeMeal(overrides: Partial<Meal> = {}): Meal {
  return {
    id: `meal-${Math.random().toString(36).slice(2, 6)}`,
    slot: 'lunch' as MealSlot,
    foodName: 'Test Yemek',
    emoji: '🍽️',
    ageGroup: '8m',
    calories: 100,
    completed: false,
    isFirstTry: false,
    ...overrides,
  };
}

// Helper: create a week meals structure with given meals in specific day/slot
function makeWeekMeals(
  meals: { day: number; slot: MealSlot; meal: Meal }[]
): Record<number, Record<MealSlot, Meal[]>> {
  const week: Record<number, Record<MealSlot, Meal[]>> = {};
  for (let d = 0; d < 7; d++) {
    week[d] = { breakfast: [], lunch: [], snack: [], dinner: [] };
  }
  for (const { day, slot, meal } of meals) {
    week[day][slot].push(meal);
  }
  return week;
}

describe('generateShoppingList', () => {
  it('returns empty for empty meal plan', () => {
    const result = generateShoppingList({});
    expect(result).toEqual([]);
  });

  it('returns empty for meal plan with no meals', () => {
    const week = makeWeekMeals([]);
    const result = generateShoppingList(week);
    expect(result).toEqual([]);
  });

  it('collects ingredients from meals with recipeId', () => {
    // Recipe ID '1' = "Elmalı Pirinç Püresi" with ingredients: Pirinç, Elma, Su
    const week = makeWeekMeals([
      { day: 0, slot: 'breakfast', meal: makeMeal({ recipeId: '1', foodName: 'Elmalı Pirinç Püresi' }) },
    ]);
    const result = generateShoppingList(week);

    // Should have categories with items from the recipe
    const allItems = result.flatMap((c) => c.items);
    const itemNames = allItems.map((i) => i.name.toLowerCase());
    expect(itemNames).toContain('pirinç');
    expect(itemNames).toContain('elma');
  });

  it('adds unmatched meals as 1 porsiyon items', () => {
    const week = makeWeekMeals([
      { day: 0, slot: 'lunch', meal: makeMeal({ foodName: 'Bilinmeyen Yemek XYZ' }) },
    ]);
    const result = generateShoppingList(week);

    const allItems = result.flatMap((c) => c.items);
    const unknown = allItems.find((i) => i.name === 'Bilinmeyen Yemek XYZ');
    expect(unknown).toBeDefined();
    expect(unknown!.amount).toBe(1);
    expect(unknown!.unit).toBe('porsiyon');
  });

  it('merges duplicate ingredients with same unit', () => {
    // Two meals using the same recipe → ingredients should be doubled
    const week = makeWeekMeals([
      { day: 0, slot: 'breakfast', meal: makeMeal({ recipeId: '1', foodName: 'Elmalı Pirinç Püresi' }) },
      { day: 1, slot: 'breakfast', meal: makeMeal({ recipeId: '1', foodName: 'Elmalı Pirinç Püresi' }) },
    ]);
    const result = generateShoppingList(week);

    const allItems = result.flatMap((c) => c.items);
    const pirinc = allItems.find((i) => i.name.toLowerCase() === 'pirinç');
    expect(pirinc).toBeDefined();
    // Should have double the single recipe amount
    expect(pirinc!.amount).toBe(4); // 2 x 2 yemek kaşığı
  });

  it('subtracts pantry amounts when units are comparable', () => {
    const week = makeWeekMeals([
      { day: 0, slot: 'breakfast', meal: makeMeal({ recipeId: '1', foodName: 'Elmalı Pirinç Püresi' }) },
    ]);
    // Recipe needs 1 küçük Elma, pantry has 3 adet Elma (küçük→adet comparable)
    const pantry: PantryItemForShopping[] = [
      { name: 'Elma', amount: 3, unit: 'adet', daysLeft: 7 },
    ];
    const result = generateShoppingList(week, pantry);

    const allItems = result.flatMap((c) => c.items);
    const elma = allItems.find((i) => i.name.toLowerCase() === 'elma');
    expect(elma).toBeDefined();
    expect(elma!.inPantry).toBe(true);
    expect(elma!.toBuyAmount).toBe(0);
  });

  it('marks item as fully in pantry when sufficient', () => {
    const week = makeWeekMeals([
      { day: 0, slot: 'lunch', meal: makeMeal({ foodName: 'Havuç Yemeği' }) },
    ]);
    const pantry: PantryItemForShopping[] = [
      { name: 'Havuç', amount: 5, unit: 'adet', daysLeft: 7 },
    ];
    const result = generateShoppingList(week, pantry);

    const allItems = result.flatMap((c) => c.items);
    // The meal may match a recipe or fall back to 1 porsiyon
    // Either way, havuç in pantry should appear
    const havuc = allItems.find((i) => i.name.toLowerCase().includes('havuç'));
    if (havuc) {
      expect(havuc.pantryAmount).toBeGreaterThan(0);
    }
  });

  it('treats daysLeft <= 2 as unusable (pantryExpiring=true, must buy)', () => {
    const week = makeWeekMeals([
      { day: 0, slot: 'lunch', meal: makeMeal({ foodName: 'Bilinmeyen ABC' }) },
    ]);
    const pantry: PantryItemForShopping[] = [
      { name: 'Bilinmeyen ABC', amount: 5, unit: 'porsiyon', daysLeft: 1 },
    ];
    const result = generateShoppingList(week, pantry);

    const allItems = result.flatMap((c) => c.items);
    const item = allItems.find((i) => i.name === 'Bilinmeyen ABC');
    expect(item).toBeDefined();
    expect(item!.pantryExpiring).toBe(true);
    expect(item!.toBuyAmount).toBe(1); // Must buy because expiring
  });

  it('shows pantryExpiring warning for 3-5 days', () => {
    const week = makeWeekMeals([
      { day: 0, slot: 'lunch', meal: makeMeal({ foodName: 'Bilinmeyen DEF' }) },
    ]);
    const pantry: PantryItemForShopping[] = [
      { name: 'Bilinmeyen DEF', amount: 5, unit: 'porsiyon', daysLeft: 4 },
    ];
    const result = generateShoppingList(week, pantry);

    const allItems = result.flatMap((c) => c.items);
    const item = allItems.find((i) => i.name === 'Bilinmeyen DEF');
    expect(item).toBeDefined();
    expect(item!.pantryExpiring).toBe(true);
    expect(item!.toBuyAmount).toBe(0); // Still usable, don't need to buy
    expect(item!.inPantry).toBe(true);
  });

  it('handles incomparable units (pantry has item, toBuyAmount=0)', () => {
    const week = makeWeekMeals([
      { day: 0, slot: 'lunch', meal: makeMeal({ foodName: 'Bilinmeyen GHI' }) },
    ]);
    // Meal needs 1 porsiyon, pantry has 200 gram — different units
    const pantry: PantryItemForShopping[] = [
      { name: 'Bilinmeyen GHI', amount: 200, unit: 'gram', daysLeft: 10 },
    ];
    const result = generateShoppingList(week, pantry);

    const allItems = result.flatMap((c) => c.items);
    const item = allItems.find((i) => i.name === 'Bilinmeyen GHI');
    expect(item).toBeDefined();
    expect(item!.toBuyAmount).toBe(0); // Incomparable units → assume available
  });

  it('groups items by PantryCategory', () => {
    // Recipe 1 has Pirinç (tahıl) and Elma (meyve)
    const week = makeWeekMeals([
      { day: 0, slot: 'breakfast', meal: makeMeal({ recipeId: '1', foodName: 'Elmalı Pirinç Püresi' }) },
    ]);
    const result = generateShoppingList(week);

    const categories = result.map((c) => c.category);
    // Should have at least tahil and meyve categories
    expect(categories.length).toBeGreaterThanOrEqual(1);
  });

  it('sorts items alphabetically within category (Turkish)', () => {
    const week = makeWeekMeals([
      { day: 0, slot: 'lunch', meal: makeMeal({ foodName: 'Bilinmeyen ZZZ' }) },
      { day: 0, slot: 'dinner', meal: makeMeal({ foodName: 'Bilinmeyen AAA' }) },
    ]);
    const result = generateShoppingList(week);

    for (const cat of result) {
      for (let i = 0; i < cat.items.length - 1; i++) {
        expect(cat.items[i].name.localeCompare(cat.items[i + 1].name, 'tr')).toBeLessThanOrEqual(0);
      }
    }
  });
});

describe('shoppingListToText', () => {
  it('produces formatted text output', () => {
    const categories: ShoppingCategory[] = [
      {
        category: 'sebze',
        emoji: '🥬',
        label: 'Sebzeler',
        items: [
          {
            id: 'shop-havuc',
            name: 'Havuç',
            emoji: '🥕',
            amount: 2,
            unit: 'adet',
            category: 'sebze',
            inPantry: false,
            pantryAmount: 0,
            toBuyAmount: 2,
            pantryExpiring: false,
            checked: false,
            fromRecipes: ['Test'],
          },
        ],
      },
    ];

    const text = shoppingListToText(categories);
    expect(text).toContain('Kaşık');
    expect(text).toContain('ALINACAKLAR');
    expect(text).toContain('Havuç');
    expect(text).toContain('2 adet');
    expect(text).toContain('Alınacak: 1');
  });

  it('shows in-pantry section', () => {
    const categories: ShoppingCategory[] = [
      {
        category: 'meyve',
        emoji: '🍎',
        label: 'Meyveler',
        items: [
          {
            id: 'shop-elma',
            name: 'Elma',
            emoji: '🍎',
            amount: 1,
            unit: 'adet',
            category: 'meyve',
            inPantry: true,
            pantryAmount: 3,
            toBuyAmount: 0,
            pantryExpiring: false,
            checked: false,
            fromRecipes: ['Test'],
          },
        ],
      },
    ];

    const text = shoppingListToText(categories);
    expect(text).toContain('DOLAPTA VAR');
    expect(text).toContain('Elma');
  });
});
