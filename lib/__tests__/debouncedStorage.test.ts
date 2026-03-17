/**
 * Kaşık — Debounced Storage Tests
 * Tests debounced AsyncStorage write behavior.
 */

// Use real debouncedStorage (not the jest.setup mock)
jest.unmock('../debouncedStorage');

import { debouncedSetItem, cancelAll, getPendingCount } from '../debouncedStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Jest fake timers
beforeEach(() => {
  jest.useFakeTimers();
  cancelAll();
  (AsyncStorage.setItem as jest.Mock).mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('debouncedStorage', () => {
  it('does not write immediately', () => {
    debouncedSetItem('@test', 'value1');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('writes after delay', () => {
    debouncedSetItem('@test', 'value1', 500);
    jest.advanceTimersByTime(500);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@test', 'value1');
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('debounces multiple writes to same key', () => {
    debouncedSetItem('@test', 'value1', 500);
    debouncedSetItem('@test', 'value2', 500);
    debouncedSetItem('@test', 'value3', 500);
    jest.advanceTimersByTime(500);
    // Only last value should be written
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@test', 'value3');
  });

  it('handles different keys independently', () => {
    debouncedSetItem('@key1', 'a', 500);
    debouncedSetItem('@key2', 'b', 500);
    jest.advanceTimersByTime(500);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@key1', 'a');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@key2', 'b');
  });

  it('getPendingCount returns correct count', () => {
    expect(getPendingCount()).toBe(0);
    debouncedSetItem('@a', '1');
    debouncedSetItem('@b', '2');
    expect(getPendingCount()).toBe(2);
    jest.advanceTimersByTime(500);
    expect(getPendingCount()).toBe(0);
  });

  it('cancelAll clears all pending writes', () => {
    debouncedSetItem('@a', '1');
    debouncedSetItem('@b', '2');
    cancelAll();
    jest.advanceTimersByTime(1000);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(getPendingCount()).toBe(0);
  });

  it('uses default 500ms delay', () => {
    debouncedSetItem('@test', 'value');
    jest.advanceTimersByTime(499);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('supports custom delay', () => {
    debouncedSetItem('@test', 'value', 1000);
    jest.advanceTimersByTime(500);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
