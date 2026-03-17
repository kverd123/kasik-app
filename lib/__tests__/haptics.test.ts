/**
 * Kaşık — Haptics Utility Tests
 */

import { haptics } from '../haptics';
import * as Haptics from 'expo-haptics';

describe('haptics', () => {
  it('all haptic functions exist and are callable', () => {
    expect(typeof haptics.light).toBe('function');
    expect(typeof haptics.medium).toBe('function');
    expect(typeof haptics.selection).toBe('function');
    expect(typeof haptics.success).toBe('function');
    expect(typeof haptics.warning).toBe('function');
  });

  it('does not throw when called', () => {
    expect(() => haptics.light()).not.toThrow();
    expect(() => haptics.medium()).not.toThrow();
    expect(() => haptics.selection()).not.toThrow();
    expect(() => haptics.success()).not.toThrow();
    expect(() => haptics.warning()).not.toThrow();
  });

  it('has all 5 semantic haptic types', () => {
    const keys = Object.keys(haptics);
    expect(keys).toContain('light');
    expect(keys).toContain('medium');
    expect(keys).toContain('selection');
    expect(keys).toContain('success');
    expect(keys).toContain('warning');
    expect(keys).toHaveLength(5);
  });
});
