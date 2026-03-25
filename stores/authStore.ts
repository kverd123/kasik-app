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
  signInWithApple,
  signOut as authSignOut,
  resetPassword,
  getUserProfile,
  onAuthChange,
  deleteAccount as authDeleteAccount,
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
  loginWithApple: (identityToken: string, nonce: string, fullName?: { givenName?: string | null; familyName?: string | null }) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
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
      const user = await registerWithEmail(email, password, displayName);
      // Profili hemen set et, auth listener'ı bekleme
      set({
        firebaseUser: user,
        user: {
          uid: user.uid,
          email: user.email || email,
          displayName: user.displayName || displayName,
          photoURL: user.photoURL || null,
          onboardingCompleted: false,
          isPremium: false,
        } as any,
        isAuthenticated: true,
        isLoading: false,
      });
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
      set({ isLoading: false });
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async (idToken) => {
    try {
      set({ isLoading: true, error: null });
      const { user: firebaseUser, isNewUser } = await signInWithGoogle(idToken);
      // Yeni kullanıcıysa onboardingCompleted: false olarak set et
      if (isNewUser) {
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
      } else {
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
      }
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loginWithApple: async (identityToken, nonce, fullName) => {
    try {
      set({ isLoading: true, error: null });
      const { user: firebaseUser, isNewUser } = await signInWithApple(identityToken, nonce, fullName);
      // Yeni kullanıcıysa onboardingCompleted: false olarak set et
      if (isNewUser) {
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
      } else {
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
      }
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authSignOut();
      set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      console.error('Çıkış hatası:', error);
      // Hata olsa bile state'i temizle
      set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false, error: 'Çıkış yapılırken hata oluştu.' });
    }
  },

  deleteAccount: async () => {
    try {
      set({ isLoading: true, error: null });
      await authDeleteAccount();
      set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      const message = error.code === 'auth/requires-recent-login'
        ? 'Bu işlem için tekrar giriş yapmanız gerekiyor. Lütfen çıkış yapıp tekrar giriş yapın.'
        : 'Hesap silinirken hata oluştu.';
      set({ error: message, isLoading: false });
      throw error;
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
