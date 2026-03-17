/**
 * Kaşık — Baby Store Tests
 */

import { useBabyStore } from '../babyStore';
import { Baby, AllergenType, TriedFood } from '../../types';

const TEST_BABY: Baby = {
  id: 'test-baby-1',
  name: 'Test Bebek',
  birthDate: new Date(2025, 6, 1), // 1 Temmuz 2025
  gender: 'female',
  currentStage: '8m',
  weight: [],
  height: [],
  knownAllergens: [],
  triedFoods: [],
};

// Reset store before each test
beforeEach(() => {
  useBabyStore.setState({ baby: null, customAllergens: [], isLoaded: false });
});

describe('BabyStore', () => {
  it('initializes with null baby', () => {
    const { baby, isLoaded } = useBabyStore.getState();
    expect(baby).toBeNull();
    expect(isLoaded).toBe(false);
  });

  it('setBaby sets baby profile', () => {
    useBabyStore.getState().setBaby(TEST_BABY);

    const { baby } = useBabyStore.getState();
    expect(baby).not.toBeNull();
    expect(baby!.name).toBe('Test Bebek');
    expect(baby!.id).toBe('test-baby-1');
  });

  it('updateBaby merges partial updates', () => {
    useBabyStore.getState().setBaby(TEST_BABY);
    useBabyStore.getState().updateBaby({ name: 'Yeni İsim', currentStage: '12m+' });

    const { baby } = useBabyStore.getState();
    expect(baby!.name).toBe('Yeni İsim');
    expect(baby!.currentStage).toBe('12m+');
    // Other fields preserved
    expect(baby!.id).toBe('test-baby-1');
  });

  it('updateBaby does nothing if baby is null', () => {
    useBabyStore.getState().updateBaby({ name: 'Ghost' });

    const { baby } = useBabyStore.getState();
    expect(baby).toBeNull();
  });

  it('addKnownAllergen adds to list', () => {
    useBabyStore.getState().setBaby(TEST_BABY);
    useBabyStore.getState().addKnownAllergen('milk' as AllergenType);

    const { baby } = useBabyStore.getState();
    expect(baby!.knownAllergens).toContain('milk');
    expect(baby!.knownAllergens).toHaveLength(1);
  });

  it('addKnownAllergen prevents duplicates', () => {
    useBabyStore.getState().setBaby(TEST_BABY);
    useBabyStore.getState().addKnownAllergen('egg' as AllergenType);
    useBabyStore.getState().addKnownAllergen('egg' as AllergenType);

    const { baby } = useBabyStore.getState();
    expect(baby!.knownAllergens).toHaveLength(1);
  });

  it('removeKnownAllergen removes from list', () => {
    useBabyStore.getState().setBaby({
      ...TEST_BABY,
      knownAllergens: ['milk', 'egg'] as AllergenType[],
    });
    useBabyStore.getState().removeKnownAllergen('milk' as AllergenType);

    const { baby } = useBabyStore.getState();
    expect(baby!.knownAllergens).toEqual(['egg']);
  });

  it('addCustomAllergen adds and prevents duplicates', () => {
    useBabyStore.getState().setBaby(TEST_BABY);
    useBabyStore.getState().addCustomAllergen('Kivi');
    useBabyStore.getState().addCustomAllergen('Kivi');
    useBabyStore.getState().addCustomAllergen('Çilek');

    const { customAllergens } = useBabyStore.getState();
    expect(customAllergens).toEqual(['Kivi', 'Çilek']);
  });

  it('removeCustomAllergen removes', () => {
    useBabyStore.setState({ customAllergens: ['Kivi', 'Çilek'] });
    useBabyStore.getState().setBaby(TEST_BABY);
    useBabyStore.getState().removeCustomAllergen('Kivi');

    const { customAllergens } = useBabyStore.getState();
    expect(customAllergens).toEqual(['Çilek']);
  });

  it('addTriedFood appends food entry', () => {
    useBabyStore.getState().setBaby(TEST_BABY);

    const food: TriedFood = {
      foodId: 'food-havuc',
      foodName: 'Havuç',
      date: new Date(),
      reaction: 'none',
      liked: null,
    };
    useBabyStore.getState().addTriedFood(food);

    const { baby } = useBabyStore.getState();
    expect(baby!.triedFoods).toHaveLength(1);
    expect(baby!.triedFoods[0].foodName).toBe('Havuç');
  });
});
