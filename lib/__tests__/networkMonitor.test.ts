/**
 * Kaşık — Network Monitor Tests
 * Tests connectivity state tracking and listener management.
 */

import NetInfo from '@react-native-community/netinfo';

// We test the MOCKED version (from jest.setup.js) to verify API shape
import {
  isOnline,
  startNetworkMonitor,
  stopNetworkMonitor,
  onNetworkChange,
} from '../networkMonitor';

describe('Network Monitor — API Shape', () => {
  it('exports all functions', () => {
    expect(typeof isOnline).toBe('function');
    expect(typeof startNetworkMonitor).toBe('function');
    expect(typeof stopNetworkMonitor).toBe('function');
    expect(typeof onNetworkChange).toBe('function');
  });

  it('isOnline returns a boolean', () => {
    const result = isOnline();
    expect(typeof result).toBe('boolean');
  });

  it('startNetworkMonitor does not throw', () => {
    expect(() => startNetworkMonitor()).not.toThrow();
  });

  it('stopNetworkMonitor does not throw', () => {
    expect(() => stopNetworkMonitor()).not.toThrow();
  });

  it('onNetworkChange returns an unsubscribe function', () => {
    const unsub = onNetworkChange(() => {});
    expect(typeof unsub).toBe('function');
    expect(() => unsub()).not.toThrow();
  });

  it('isOnline defaults to true (optimistic)', () => {
    // The mocked version should return true
    expect(isOnline()).toBe(true);
  });
});

describe('Network Monitor — NetInfo Integration', () => {
  it('NetInfo.addEventListener is available in mock', () => {
    expect(typeof NetInfo.addEventListener).toBe('function');
  });

  it('NetInfo.fetch resolves with connected state', async () => {
    const state = await NetInfo.fetch();
    expect(state.isConnected).toBe(true);
    expect(state.isInternetReachable).toBe(true);
  });
});
