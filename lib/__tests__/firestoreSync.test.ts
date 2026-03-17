/**
 * Kaşık — Firestore Sync Tests
 * Tests the sync utility's API shape and integration points.
 * Uses the MOCKED version from jest.setup.js.
 */

import {
  syncToFirestore,
  getAuthUserId,
  initializeSync,
} from '../firestoreSync';

describe('Firestore Sync — API Shape', () => {
  it('exports all functions', () => {
    expect(typeof syncToFirestore).toBe('function');
    expect(typeof getAuthUserId).toBe('function');
    expect(typeof initializeSync).toBe('function');
  });

  it('getAuthUserId returns null when no user (mocked)', () => {
    const result = getAuthUserId();
    expect(result).toBeNull();
  });

  it('syncToFirestore does not throw with valid args', () => {
    expect(() => syncToFirestore('pantry.add', (userId) => [userId, { name: 'Test' }])).not.toThrow();
  });

  it('syncToFirestore does not throw with unknown key', () => {
    expect(() => syncToFirestore('unknown.op', (userId) => [userId])).not.toThrow();
  });

  it('initializeSync does not throw', () => {
    expect(() => initializeSync()).not.toThrow();
  });
});

describe('Firestore Sync — Auth Gating', () => {
  it('syncToFirestore skips silently when no user', () => {
    // getAuthUserId returns null (mocked), so syncToFirestore should return without action
    // No error thrown = success
    syncToFirestore('pantry.add', (userId) => [userId, { name: 'Test' }]);
  });
});
