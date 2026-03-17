/**
 * Kaşık — Meal Plan Store Tests
 * Tests exported helper functions + store actions
 */

import {
  getWeekKey,
  getWeekMonday,
  getWeekDates,
  getWeekKeyOffset,
  getWeekLabel,
  isSameDay,
  useMealPlanStore,
} from '../mealPlanStore';
import { Meal, MealSlot } from '../../types';

// Helper
function makeMeal(overrides: Partial<Meal> = {}): Meal {
  return {
    id: `test-${Math.random().toString(36).slice(2, 6)}`,
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

const emptyDay = () => ({ breakfast: [], lunch: [], snack: [], dinner: [] });
const emptyWeek = () => ({
  0: emptyDay(), 1: emptyDay(), 2: emptyDay(), 3: emptyDay(),
  4: emptyDay(), 5: emptyDay(), 6: emptyDay(),
});

describe('Week Helper Functions', () => {
  it('getWeekKey formats as YYYY-WW', () => {
    // March 17, 2026 — ISO week 12
    const date = new Date(2026, 2, 17);
    const key = getWeekKey(date);
    expect(key).toMatch(/^\d{4}-\d{2}$/);
    expect(key).toBe('2026-12');
  });

  it('getWeekKey handles year boundary (Dec 31 2025 → week 01 of 2026)', () => {
    // Dec 31, 2025 is a Wednesday — ISO week 1 of 2026
    const date = new Date(2025, 11, 31);
    const key = getWeekKey(date);
    expect(key).toBe('2026-01');
  });

  it('getWeekMonday returns correct Monday', () => {
    const monday = getWeekMonday('2026-12');
    expect(monday.getDay()).toBe(1); // Monday
    // Week 12 of 2026 starts March 16
    expect(monday.getDate()).toBe(16);
    expect(monday.getMonth()).toBe(2); // March
  });

  it('getWeekDates returns 7 dates Mon-Sun', () => {
    const dates = getWeekDates('2026-12');
    expect(dates).toHaveLength(7);
    // Monday
    expect(dates[0].getDay()).toBe(1);
    // Sunday
    expect(dates[6].getDay()).toBe(0);
    // Consecutive days
    for (let i = 1; i < 7; i++) {
      const diff = dates[i].getTime() - dates[i - 1].getTime();
      expect(diff).toBe(24 * 60 * 60 * 1000);
    }
  });

  it('getWeekKeyOffset +1 goes to next week', () => {
    const next = getWeekKeyOffset('2026-12', 1);
    expect(next).toBe('2026-13');
  });

  it('getWeekKeyOffset -1 goes to previous week', () => {
    const prev = getWeekKeyOffset('2026-12', -1);
    expect(prev).toBe('2026-11');
  });

  it('getWeekLabel formats same-month correctly', () => {
    // Week 12 of 2026: March 16-22
    const label = getWeekLabel('2026-12');
    expect(label).toBe('16 - 22 Mart 2026');
  });

  it('getWeekLabel formats cross-month correctly', () => {
    // Week 14 of 2026: March 30 - April 5
    const label = getWeekLabel('2026-14');
    expect(label).toContain('Mart');
    expect(label).toContain('Nisan');
  });

  it('isSameDay returns true for same day', () => {
    const a = new Date(2026, 2, 17, 10, 30);
    const b = new Date(2026, 2, 17, 22, 0);
    expect(isSameDay(a, b)).toBe(true);
  });

  it('isSameDay returns false for different days', () => {
    const a = new Date(2026, 2, 17);
    const b = new Date(2026, 2, 18);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe('MealPlanStore Actions', () => {
  beforeEach(() => {
    const weekKey = getWeekKey(new Date());
    useMealPlanStore.setState({
      allWeekMeals: { [weekKey]: emptyWeek() },
      currentWeekKey: weekKey,
      weekMeals: emptyWeek(),
      isLoaded: true,
    });
  });

  it('addMealToSlot adds to correct day and slot', () => {
    const meal = makeMeal({ id: 'add-test', slot: 'breakfast' });
    useMealPlanStore.getState().addMealToSlot(0, 'breakfast', meal);

    const dayMeals = useMealPlanStore.getState().getDayMeals(0);
    expect(dayMeals.breakfast).toHaveLength(1);
    expect(dayMeals.breakfast[0].id).toBe('add-test');
    // Other slots unchanged
    expect(dayMeals.lunch).toHaveLength(0);
  });

  it('removeMeal removes by id', () => {
    const meal = makeMeal({ id: 'remove-test', slot: 'lunch' });
    useMealPlanStore.getState().addMealToSlot(2, 'lunch', meal);

    useMealPlanStore.getState().removeMeal(2, 'remove-test');

    const dayMeals = useMealPlanStore.getState().getDayMeals(2);
    expect(dayMeals.lunch).toHaveLength(0);
  });

  it('toggleMealCompleted flips completed flag', () => {
    const meal = makeMeal({ id: 'toggle-test', completed: false });
    useMealPlanStore.getState().addMealToSlot(1, 'lunch', meal);

    useMealPlanStore.getState().toggleMealCompleted(1, 'toggle-test');

    const dayMeals = useMealPlanStore.getState().getDayMeals(1);
    expect(dayMeals.lunch[0].completed).toBe(true);
  });

  it('getCompletedMealsThisWeek counts correctly', () => {
    useMealPlanStore.getState().addMealToSlot(0, 'breakfast', makeMeal({ completed: true }));
    useMealPlanStore.getState().addMealToSlot(0, 'lunch', makeMeal({ completed: false }));
    useMealPlanStore.getState().addMealToSlot(1, 'dinner', makeMeal({ completed: true }));

    // Need to manually set completed since addMealToSlot uses the meal as-is
    const count = useMealPlanStore.getState().getCompletedMealsThisWeek();
    expect(count).toBe(2);
  });
});
