/**
 * Kaşık — Network Monitor
 * Thin wrapper around NetInfo for connectivity state tracking.
 * Optimistic default: assumes online until proven otherwise.
 */

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type NetworkListener = (isOnline: boolean) => void;

let _isOnline = true; // optimistic default
let _unsubscribe: (() => void) | null = null;
const _listeners: Set<NetworkListener> = new Set();

/** Current connectivity state */
export function isOnline(): boolean {
  return _isOnline;
}

/** Start listening to network changes */
export function startNetworkMonitor(): void {
  if (_unsubscribe) return; // already started

  _unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    // isInternetReachable can be null (unknown) — treat as online
    const online = !!(state.isConnected && state.isInternetReachable !== false);
    if (online !== _isOnline) {
      _isOnline = online;
      _listeners.forEach((fn) => fn(online));
    }
  });
}

/** Stop listening to network changes */
export function stopNetworkMonitor(): void {
  _unsubscribe?.();
  _unsubscribe = null;
}

/** Subscribe to connectivity changes. Returns unsubscribe function. */
export function onNetworkChange(fn: NetworkListener): () => void {
  _listeners.add(fn);
  return () => {
    _listeners.delete(fn);
  };
}

/** Reset internal state (for testing) */
export function _resetForTesting(): void {
  _isOnline = true;
  _unsubscribe?.();
  _unsubscribe = null;
  _listeners.clear();
}
