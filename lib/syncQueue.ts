/**
 * Kaşık — Sync Queue
 * Persistent FIFO queue for failed Firestore writes.
 * Stores pending operations in AsyncStorage, replays with exponential backoff.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { isOnline } from './networkMonitor';
import * as firestore from './firestore';

// ===== Types =====

export interface SyncQueueItem {
  id: string;
  createdAt: number;
  retryCount: number;
  operation: {
    fnKey: string;
    args: any[];
  };
}

// ===== Constants =====

const STORAGE_KEY = '@kasik_sync_queue';
const MAX_RETRIES = 5;
const MAX_QUEUE_SIZE = 100;
const BASE_DELAY_MS = 1000; // 1s, 2s, 4s, 8s, 16s

// ===== Operation Registry =====
// Maps serializable string keys to actual Firestore functions.
// This allows queue items to be persisted and replayed after app restart.

type FirestoreOperation = (...args: any[]) => Promise<any>;

const OPERATION_REGISTRY: Record<string, FirestoreOperation> = {
  'baby.save': firestore.saveBabyProfile,
  'baby.update': firestore.updateBabyProfile,
  'pantry.add': firestore.addPantryItem,
  'pantry.remove': firestore.removePantryItem,
  'pantry.update': firestore.updatePantryItem,
  'mealPlan.saveWeek': firestore.saveWeekMealPlan,
  'recipeBook.save': firestore.saveRecipeBookEntry,
  'recipeBook.remove': firestore.removeRecipeBookEntry,
  'recipeBook.update': firestore.updateRecipeBookEntry,
  'allergen.save': firestore.saveAllergenProgram,
  'allergen.update': firestore.updateAllergenProgram,
  'analytics.batch': firestore.logAnalyticsBatch,
};

/** Check if an operation key is registered */
export function isRegisteredOperation(fnKey: string): boolean {
  return fnKey in OPERATION_REGISTRY;
}

/** Get operation function by key (for testing) */
export function getOperation(fnKey: string): FirestoreOperation | undefined {
  return OPERATION_REGISTRY[fnKey];
}

// ===== Internal State =====

let _queue: SyncQueueItem[] = [];
let _isFlushing = false;

type QueueListener = (length: number) => void;
const _listeners: Set<QueueListener> = new Set();

function notifyListeners(): void {
  const len = _queue.length;
  _listeners.forEach((fn) => fn(len));
}

// ===== Persistence =====

async function persistQueue(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(_queue));
  } catch (e) {
    console.warn('[SyncQueue] Failed to persist queue:', e);
  }
}

// ===== Public API =====

/** Load queue from AsyncStorage (call on app boot) */
export async function loadSyncQueue(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      _queue = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[SyncQueue] Failed to load queue:', e);
    _queue = [];
  }
}

/** Add a failed operation to the queue */
export async function enqueue(fnKey: string, args: any[]): Promise<void> {
  const item: SyncQueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    retryCount: 0,
    operation: { fnKey, args },
  };

  _queue.push(item);

  // Prevent unbounded growth
  if (_queue.length > MAX_QUEUE_SIZE) {
    _queue.shift(); // drop oldest
  }

  await persistQueue();
  notifyListeners();
}

/** Process all queued items in FIFO order */
export async function flushQueue(): Promise<void> {
  if (_isFlushing || !isOnline() || _queue.length === 0) return;
  _isFlushing = true;

  try {
    while (_queue.length > 0 && isOnline()) {
      const item = _queue[0];
      const fn = OPERATION_REGISTRY[item.operation.fnKey];

      if (!fn) {
        // Unknown operation — discard
        console.warn('[SyncQueue] Unknown operation, discarding:', item.operation.fnKey);
        _queue.shift();
        await persistQueue();
        notifyListeners();
        continue;
      }

      try {
        await fn(...item.operation.args);
        _queue.shift(); // success — remove
        await persistQueue();
        notifyListeners();
      } catch (error: any) {
        item.retryCount++;
        if (item.retryCount >= MAX_RETRIES) {
          console.warn('[SyncQueue] Max retries reached, discarding:', item.operation.fnKey, error?.message);
          _queue.shift();
          await persistQueue();
          notifyListeners();
        } else {
          // Exponential backoff
          const delay = BASE_DELAY_MS * Math.pow(2, item.retryCount - 1);
          await new Promise((r) => setTimeout(r, delay));
          await persistQueue();
          // Don't shift — will retry on next iteration
        }
      }
    }
  } finally {
    _isFlushing = false;
  }
}

/** Current number of pending items */
export function getQueueLength(): number {
  return _queue.length;
}

/** Subscribe to queue length changes */
export function onQueueChange(fn: QueueListener): () => void {
  _listeners.add(fn);
  return () => {
    _listeners.delete(fn);
  };
}

/** Reset internal state (for testing) */
export function _resetForTesting(): void {
  _queue = [];
  _isFlushing = false;
  _listeners.clear();
}

/** Get current queue items (for testing/debugging) */
export function _getQueue(): SyncQueueItem[] {
  return [..._queue];
}
