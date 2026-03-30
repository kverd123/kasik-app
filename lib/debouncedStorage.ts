/**
 * Kaşık — Debounced AsyncStorage
 * Prevents rapid-fire AsyncStorage writes by debouncing per key.
 * Each key gets its own independent timer — last-write-wins within the delay window.
 * Pending values are tracked so flushKey can write them before app backgrounds.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const timers: Record<string, ReturnType<typeof setTimeout>> = {};
const pending: Record<string, string> = {};

/**
 * Debounced AsyncStorage.setItem — waits `delay` ms before writing.
 * If called again for the same key within the window, the previous write is cancelled.
 */
export function debouncedSetItem(key: string, value: string, delay = 500): void {
  pending[key] = value;
  if (timers[key]) clearTimeout(timers[key]);
  timers[key] = setTimeout(() => {
    AsyncStorage.setItem(key, pending[key]).catch(console.error);
    delete timers[key];
    delete pending[key];
  }, delay);
}

/**
 * Flush a specific key immediately (e.g., before app backgrounding).
 * Writes the pending value to AsyncStorage synchronously.
 */
export function flushKey(key: string): void {
  if (timers[key]) {
    clearTimeout(timers[key]);
    delete timers[key];
  }
  if (pending[key] !== undefined) {
    AsyncStorage.setItem(key, pending[key]).catch(console.error);
    delete pending[key];
  }
}

/**
 * Flush ALL pending debounced writes immediately.
 * Call this before app backgrounds to prevent data loss.
 */
export function flushAll(): void {
  for (const key of Object.keys(timers)) {
    clearTimeout(timers[key]);
    delete timers[key];
  }
  for (const key of Object.keys(pending)) {
    AsyncStorage.setItem(key, pending[key]).catch(console.error);
    delete pending[key];
  }
}

/**
 * Cancel all pending debounced writes. Useful for testing.
 */
export function cancelAll(): void {
  for (const key of Object.keys(timers)) {
    clearTimeout(timers[key]);
    delete timers[key];
  }
  for (const key of Object.keys(pending)) {
    delete pending[key];
  }
}

/**
 * Get count of pending debounced writes. Useful for testing.
 */
export function getPendingCount(): number {
  return Object.keys(pending).length;
}
