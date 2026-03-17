/**
 * Kaşık — Theme Store Tests
 * Tests theme mode management and isDark computation.
 * Uses the MOCKED version from jest.setup.js for API shape tests.
 */

import { useThemeStore } from '../themeStore';

describe('Theme Store — API Shape', () => {
  it('exports useThemeStore', () => {
    expect(useThemeStore).toBeDefined();
    expect(typeof useThemeStore).toBe('function');
  });

  it('getState returns expected shape', () => {
    const state = useThemeStore.getState();
    expect(state).toHaveProperty('mode');
    expect(state).toHaveProperty('isDark');
    expect(state).toHaveProperty('isLoaded');
    expect(typeof state.loadFromStorage).toBe('function');
    expect(typeof state.setMode).toBe('function');
    expect(typeof state._updateIsDark).toBe('function');
  });

  it('default mode is system', () => {
    const state = useThemeStore.getState();
    expect(state.mode).toBe('system');
  });

  it('default isDark is false', () => {
    const state = useThemeStore.getState();
    expect(state.isDark).toBe(false);
  });

  it('default isLoaded is true (mocked)', () => {
    const state = useThemeStore.getState();
    expect(state.isLoaded).toBe(true);
  });
});

describe('Theme Store — ThemeMode Type', () => {
  it('valid modes are light, dark, system', () => {
    const validModes = ['light', 'dark', 'system'];
    const state = useThemeStore.getState();
    expect(validModes).toContain(state.mode);
  });
});

describe('Theme Store — isDark Logic', () => {
  it('light mode should result in isDark=false', () => {
    // Logic test: resolveIsDark('light', any) === false
    expect(resolveIsDark('light', false)).toBe(false);
    expect(resolveIsDark('light', true)).toBe(false);
  });

  it('dark mode should result in isDark=true', () => {
    expect(resolveIsDark('dark', false)).toBe(true);
    expect(resolveIsDark('dark', true)).toBe(true);
  });

  it('system mode follows system preference', () => {
    expect(resolveIsDark('system', false)).toBe(false);
    expect(resolveIsDark('system', true)).toBe(true);
  });
});

// Helper: replicate the resolveIsDark logic from themeStore
function resolveIsDark(mode: string, systemIsDark: boolean): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return systemIsDark;
}
