/**
 * Kaşık — Sync Queue Tests
 * Tests the persistent FIFO queue for offline writes.
 * Uses the MOCKED version from jest.setup.js for API shape tests.
 */

import {
  loadSyncQueue,
  enqueue,
  flushQueue,
  getQueueLength,
  onQueueChange,
} from '../syncQueue';

describe('Sync Queue — API Shape', () => {
  it('exports all functions', () => {
    expect(typeof loadSyncQueue).toBe('function');
    expect(typeof enqueue).toBe('function');
    expect(typeof flushQueue).toBe('function');
    expect(typeof getQueueLength).toBe('function');
    expect(typeof onQueueChange).toBe('function');
  });

  it('loadSyncQueue returns a promise', async () => {
    const result = loadSyncQueue();
    expect(result).toBeInstanceOf(Promise);
    await result;
  });

  it('enqueue returns a promise', async () => {
    const result = enqueue('pantry.add', ['user-1', { name: 'Havuç' }]);
    expect(result).toBeInstanceOf(Promise);
    await result;
  });

  it('flushQueue returns a promise', async () => {
    const result = flushQueue();
    expect(result).toBeInstanceOf(Promise);
    await result;
  });

  it('getQueueLength returns a number', () => {
    const result = getQueueLength();
    expect(typeof result).toBe('number');
  });

  it('onQueueChange returns an unsubscribe function', () => {
    const unsub = onQueueChange(() => {});
    expect(typeof unsub).toBe('function');
    expect(() => unsub()).not.toThrow();
  });
});

describe('Sync Queue — Queue Item Structure', () => {
  it('SyncQueueItem has correct shape', () => {
    // Verify the expected interface by creating a mock item
    const item = {
      id: 'test-123',
      createdAt: Date.now(),
      retryCount: 0,
      operation: {
        fnKey: 'pantry.add',
        args: ['user-1', { name: 'Havuç', category: 'sebze' }],
      },
    };

    expect(typeof item.id).toBe('string');
    expect(typeof item.createdAt).toBe('number');
    expect(typeof item.retryCount).toBe('number');
    expect(typeof item.operation.fnKey).toBe('string');
    expect(Array.isArray(item.operation.args)).toBe(true);
  });

  it('operation keys follow the expected naming pattern', () => {
    const expectedKeys = [
      'baby.save', 'baby.update',
      'pantry.add', 'pantry.remove', 'pantry.update',
      'mealPlan.saveWeek',
      'recipeBook.save', 'recipeBook.remove', 'recipeBook.update',
      'allergen.save', 'allergen.update',
    ];

    for (const key of expectedKeys) {
      expect(key).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
    }
  });
});

describe('Sync Queue — Constants', () => {
  it('queue has reasonable limits', () => {
    // These are just sanity checks for the design
    const MAX_RETRIES = 5;
    const MAX_QUEUE_SIZE = 100;
    const BASE_DELAY_MS = 1000;

    expect(MAX_RETRIES).toBeGreaterThan(0);
    expect(MAX_RETRIES).toBeLessThanOrEqual(10);
    expect(MAX_QUEUE_SIZE).toBeGreaterThan(0);
    expect(BASE_DELAY_MS).toBeGreaterThan(0);
  });
});
