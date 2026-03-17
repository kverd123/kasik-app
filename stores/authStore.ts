/**
 * Kaşık — Auth Store (Zustand)
 * Manages authentication state and user profile
 */

import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';
import {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut as authSignOut,
  resetPassword,
  getUserProfile,
  onAuthChange,
} from '../lib/auth';

interface AuthState {
  // State
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => () => void;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: () => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          set({
            firebaseUser,
            user: profile || {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || null,
              onboardingCompleted: false,
              isPremium: false,
            } as any,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Profil yüklenemedi:', error);
          set({
            firebaseUser,
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || null,
              onboardingCompleted: false,
              isPremium: false,
            } as any,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        set({
          firebaseUser: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
    return unsubscribe;
  },

  register: async (email, password, displayName) => {
    try {
      set({ isLoading: true, error: null });
      await registerWithEmail(email, password, displayName);
      // Auth state listener will handle the rest
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      await signInWithEmail(email, password);
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async (idToken) => {
    try {
      set({ isLoading: true, error: null });
      await signInWithGoogle(idToken);
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authSignOut();
      set({ firebaseUser: null, user: null, isAuthenticated: false });
    } catch (error: any) {
      set({ error: 'Çıkış yapılırken hata oluştu.' });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ error: null });
      await resetPassword(email);
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      set({ error: message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  refreshProfile: async () => {
    const { firebaseUser } = get();
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      set({ user: profile });
    }
  },
}));

/**
 * Turkish error messages for Firebase Auth errors
 */
function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi zaten kullanılıyor.';
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi.';
    case 'auth/user-not-found':
      return 'Bu e-posta ile kayıtlı hesap bulunamadı.';
    case 'auth/wrong-password':
      return 'Şifre hatalı. Tekrar deneyin.';
    case 'auth/weak-password':
      return 'Şifre en az 6 karakter olmalıdır.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yaptınız. Lütfen biraz bekleyin.';
    case 'auth/network-request-failed':
      return 'İnternet bağlantınızı kontrol edin.';
    case 'auth/invalid-credential':
      return 'E-posta veya şifre hatalı.';
    default:
      return 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }
}
