/**
 * Kaşık — Sync Status Store (Zustand)
 * Exposes sync state to UI: synced / pending / offline
 */

import { create } from 'zustand';

export type SyncStatus = 'synced' | 'pending' | 'offline';

interface SyncState {
  status: SyncStatus;
  pendingCount: number;
  setStatus: (status: SyncStatus) => void;
  setPendingCount: (count: number) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'synced',
  pendingCount: 0,
  setStatus: (status) => set({ status }),
  setPendingCount: (count) => set({ pendingCount: count }),
}));
