/**
 * Kaşık — Pantry Store Tests
 */

import { usePantryStore, PantryEntry } from '../pantryStore';

// Reset store before each test
beforeEach(() => {
  usePantryStore.setState({ items: [], isLoaded: false });
});

// Helper: add test items to store
function seedItems(items: PantryEntry[]) {
  usePantryStore.setState({ items, isLoaded: true });
}

function makeEntry(overrides: Partial<PantryEntry> = {}): PantryEntry {
  return {
    id: `test-${Math.random().toString(36).slice(2, 6)}`,
    name: 'Test Malzeme',
    emoji: '🥕',
    category: 'sebze',
    amount: 3,
    unit: 'adet',
    daysLeft: 7,
    addedDate: new Date(),
    ...overrides,
  };
}

describe('PantryStore', () => {
  it('initializes with empty items', () => {
    const { items, isLoaded } = usePantryStore.getState();
    expect(items).toEqual([]);
    expect(isLoaded).toBe(false);
  });

  it('addItem generates unique id and prepends', () => {
    const existing = makeEntry({ id: 'existing-1', name: 'Eski' });
    seedItems([existing]);

    usePantryStore.getState().addItem({
      name: 'Havuç',
      emoji: '🥕',
      category: 'sebze',
      amount: 5,
      unit: 'adet',
    });

    const { items } = usePantryStore.getState();
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Havuç');
    expect(items[0].id).toMatch(/^pantry-/);
    expect(items[1].id).toBe('existing-1');
  });

  it('removeItem filters by id', () => {
    const item1 = makeEntry({ id: 'remove-1', name: 'Elma' });
    const item2 = makeEntry({ id: 'remove-2', name: 'Armut' });
    seedItems([item1, item2]);

    usePantryStore.getState().removeItem('remove-1');

    const { items } = usePantryStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Armut');
  });

  it('updateAmount changes amount for correct item', () => {
    const item = makeEntry({ id: 'amt-1', amount: 3 });
    seedItems([item]);

    usePantryStore.getState().updateAmount('amt-1', 10);

    const { items } = usePantryStore.getState();
    expect(items[0].amount).toBe(10);
  });

  it('updateDaysLeft changes expiry for correct item', () => {
    const item = makeEntry({ id: 'days-1', daysLeft: 7 });
    seedItems([item]);

    usePantryStore.getState().updateDaysLeft('days-1', 2);

    const { items } = usePantryStore.getState();
    expect(items[0].daysLeft).toBe(2);
  });

  it('updateItem applies partial updates', () => {
    const item = makeEntry({ id: 'upd-1', name: 'Eski', amount: 1 });
    seedItems([item]);

    usePantryStore.getState().updateItem('upd-1', { name: 'Yeni', amount: 5 });

    const { items } = usePantryStore.getState();
    expect(items[0].name).toBe('Yeni');
    expect(items[0].amount).toBe(5);
  });

  it('getItemByName exact match (case-insensitive)', () => {
    seedItems([makeEntry({ name: 'Havuç' })]);

    const found = usePantryStore.getState().getItemByName('havuç');
    expect(found).toBeDefined();
    expect(found!.name).toBe('Havuç');
  });

  it('getItemByName partial/fuzzy match', () => {
    seedItems([makeEntry({ name: 'Tavuk Göğsü' })]);

    const found = usePantryStore.getState().getItemByName('tavuk');
    expect(found).toBeDefined();
    expect(found!.name).toBe('Tavuk Göğsü');
  });

  it('getItemByName returns undefined for no match', () => {
    seedItems([makeEntry({ name: 'Havuç' })]);

    const found = usePantryStore.getState().getItemByName('bilinmeyen xyz');
    expect(found).toBeUndefined();
  });

  it('getExpiringItems returns items within threshold', () => {
    seedItems([
      makeEntry({ id: 'e1', daysLeft: 1 }),
      makeEntry({ id: 'e2', daysLeft: 3 }),
      makeEntry({ id: 'e3', daysLeft: 10 }),
    ]);

    const expiring = usePantryStore.getState().getExpiringItems(3);
    expect(expiring).toHaveLength(2);
    expect(expiring.map((i) => i.id)).toContain('e1');
    expect(expiring.map((i) => i.id)).toContain('e2');
  });

  it('getExpiringItems excludes dry goods (daysLeft=-1)', () => {
    seedItems([
      makeEntry({ id: 'dry', daysLeft: -1 }),
      makeEntry({ id: 'exp', daysLeft: 2 }),
    ]);

    const expiring = usePantryStore.getState().getExpiringItems(5);
    expect(expiring).toHaveLength(1);
    expect(expiring[0].id).toBe('exp');
  });

  it('getItemsByCategory groups correctly', () => {
    seedItems([
      makeEntry({ category: 'sebze', name: 'Havuç' }),
      makeEntry({ category: 'meyve', name: 'Elma' }),
      makeEntry({ category: 'sebze', name: 'Patates' }),
    ]);

    const groups = usePantryStore.getState().getItemsByCategory();
    expect(Object.keys(groups)).toContain('sebze');
    expect(Object.keys(groups)).toContain('meyve');
    expect(groups['sebze']).toHaveLength(2);
    expect(groups['meyve']).toHaveLength(1);
  });
});
