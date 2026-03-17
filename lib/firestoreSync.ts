/**
 * Kaşık — Firestore Sync Utility
 * Write-through pattern: AsyncStorage primary + Firestore backup
 * Auth-gated, network-aware, with persistent retry queue
 */

import { getAuth } from 'firebase/auth';
import { AppState, AppStateStatus } from 'react-native';
import { isOnline, startNetworkMonitor, onNetworkChange } from './networkMonitor';
import { loadSyncQueue, enqueue, flushQueue, getOperation } from './syncQueue';

/**
 * Returns current authenticated user's UID, or null if not logged in.
 */
export function getAuthUserId(): string | null {
  try {
    const currentUser = getAuth().currentUser;
    return currentUser?.uid ?? null;
  } catch {
    return null;
  }
}

/**
 * Fire-and-forget Firestore sync wrapper.
 * - Checks auth; skips silently if no user
 * - If offline: queues the operation immediately
 * - If online: attempts immediately, queues on failure
 *
 * @param fnKey - Registry key identifying the Firestore function (e.g. 'pantry.add')
 * @param argsFn - Function that receives userId and returns the args array for the operation
 */
export function syncToFirestore(fnKey: string, argsFn: (userId: string) => any[]): void {
  const userId = getAuthUserId();
  if (!userId) return;

  const args = argsFn(userId);
  const fn = getOperation(fnKey);

  if (!fn) {
    console.warn('[FirestoreSync] Unknown operation:', fnKey);
    return;
  }

  if (!isOnline()) {
    // Offline: queue immediately, don't attempt
    enqueue(fnKey, args).catch((e) =>
      console.warn('[FirestoreSync] Failed to enqueue:', e)
    );
    return;
  }

  // Online: attempt immediately, queue on failure
  fn(...args).catch((error) => {
    console.warn('[FirestoreSync] Sync failed, queuing for retry:', error?.message || error);
    enqueue(fnKey, args).catch((e) =>
      console.warn('[FirestoreSync] Failed to enqueue after error:', e)
    );
  });
}

/**
 * Initialize the sync system:
 * - Start network monitor
 * - Load persisted queue
 * - Flush on network restore
 * - Flush on app foreground
 */
export function initializeSync(): void {
  startNetworkMonitor();

  // Load and flush persisted queue
  loadSyncQueue()
    .then(() => flushQueue())
    .catch((e) => console.warn('[FirestoreSync] Init flush failed:', e));

  // Flush when network comes back
  onNetworkChange((online) => {
    if (online) {
      flushQueue().catch((e) =>
        console.warn('[FirestoreSync] Network restore flush failed:', e)
      );
    }
  });

  // Flush when app comes to foreground
  AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') {
      flushQueue().catch((e) =>
        console.warn('[FirestoreSync] Foreground flush failed:', e)
      );
    }
  });
}
