/**
 * Kaşık — Theme Store (Zustand)
 * Manages dark/light/system theme preference — AsyncStorage ile persist
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  isLoaded: boolean;

  loadFromStorage: () => Promise<void>;
  setMode: (mode: ThemeMode) => void;
  _updateIsDark: (systemIsDark: boolean) => void;
}

const STORAGE_KEY = '@kasik_theme';

function resolveIsDark(mode: ThemeMode, systemIsDark: boolean): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return systemIsDark; // 'system'
}

function getSystemIsDark(): boolean {
  return Appearance.getColorScheme() === 'dark';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: false,
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const mode = JSON.parse(raw) as ThemeMode;
        const isDark = resolveIsDark(mode, getSystemIsDark());
        set({ mode, isDark, isLoaded: true });
      } else {
        const isDark = resolveIsDark('system', getSystemIsDark());
        set({ mode: 'system', isDark, isLoaded: true });
      }
    } catch (e) {
      console.warn('[ThemeStore] Failed to load theme:', e);
      set({ mode: 'system', isDark: false, isLoaded: true });
    }
  },

  setMode: (mode) => {
    const isDark = resolveIsDark(mode, getSystemIsDark());
    set({ mode, isDark });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mode)).catch((e) =>
      console.warn('[ThemeStore] Failed to save theme:', e)
    );
  },

  _updateIsDark: (systemIsDark) => {
    const { mode } = get();
    if (mode === 'system') {
      set({ isDark: systemIsDark });
    }
  },
}));
