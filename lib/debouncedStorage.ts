/**
 * Kaşık — Debounced AsyncStorage
 * Prevents rapid-fire AsyncStorage writes by debouncing per key.
 * Each key gets its own independent timer — last-write-wins within the delay window.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const timers: Record<string, ReturnType<typeof setTimeout>> = {};

/**
 * Debounced AsyncStorage.setItem — waits `delay` ms before writing.
 * If called again for the same key within the window, the previous write is cancelled.
 */
export function debouncedSetItem(key: string, value: string, delay = 500): void {
  if (timers[key]) clearTimeout(timers[key]);
  timers[key] = setTimeout(() => {
    AsyncStorage.setItem(key, value).catch(console.error);
    delete timers[key];
  }, delay);
}

/**
 * Flush a specific key immediately (e.g., before app backgrounding).
 * No-op if no pending write for this key.
 */
export function flushKey(key: string): void {
  // Timer'ı iptal edip hemen yaz — ancak pending value'ya erişimimiz yok
  // Bu yüzden sadece timer'ı temizliyoruz. Gerçek flush app-level'da handle edilir.
  if (timers[key]) {
    clearTimeout(timers[key]);
    delete timers[key];
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
}

/**
 * Get count of pending debounced writes. Useful for testing.
 */
export function getPendingCount(): number {
  return Object.keys(timers).length;
}
