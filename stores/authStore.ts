/**
 * Kaşık — Auth Store (Zustand)
 * Manages authentication state and user profile
 */

import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const GUEST_MODE_KEY = '@kasik_guest_mode';

interface AuthState {
  // State
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  error: string | null;

  // Actions
  initialize: () => () => void;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithApple: (identityToken: string, nonce: string, fullName?: { givenName?: string | null; familyName?: string | null }) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  exitGuestMode: () => Promise<void>;
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
  isGuest: false,
  error: null,

  initialize: () => {
    // Restore guest mode from AsyncStorage on init
    AsyncStorage.getItem(GUEST_MODE_KEY).then((value) => {
      if (value === 'true') {
        set({ isGuest: true, isLoading: false });
      }
    });

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
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
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
        isGuest: false,
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
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
      await signInWithEmail(email, password);
      set({ isGuest: false, isLoading: false });
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

  continueAsGuest: async () => {
    await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
    set({ isGuest: true, isLoading: false });
  },

  exitGuestMode: async () => {
    await AsyncStorage.removeItem(GUEST_MODE_KEY);
    set({ isGuest: false });
  },

  logout: async () => {
    try {
      // Tüm kullanıcı verilerini AsyncStorage'dan temizle (farklı hesapla giriş yapılabilir)
      await AsyncStorage.multiRemove([
        GUEST_MODE_KEY,
        '@kasik_baby',
        '@kasik_meal_plan',
        '@kasik_pantry',
        '@kasik_recipe_book',
        '@kasik_community',
        '@kasik_blocked_users',
        '@kasik_hidden_posts',
        '@kasik_community_terms',
        '@kasik_allergen_intro',
        '@kasik_sync_queue',
        '@kasik_community_recipes',
        '@kasik_pantry_onboarding_done',
      ]);
      await authSignOut();
      set({ firebaseUser: null, user: null, isAuthenticated: false, isGuest: false, isLoading: false });
    } catch (error: any) {
      console.error('Çıkış hatası:', error);
      // Hata olsa bile state'i temizle
      set({ firebaseUser: null, user: null, isAuthenticated: false, isGuest: false, isLoading: false, error: 'Çıkış yapılırken hata oluştu.' });
    }
  },

  deleteAccount: async () => {
    try {
      set({ isLoading: true, error: null });
      await authDeleteAccount();
      // Tüm kullanıcı verilerini AsyncStorage'dan temizle
      await AsyncStorage.multiRemove([
        GUEST_MODE_KEY,
        '@kasik_baby',
        '@kasik_meal_plan',
        '@kasik_pantry',
        '@kasik_recipe_book',
        '@kasik_community',
        '@kasik_blocked_users',
        '@kasik_hidden_posts',
        '@kasik_community_terms',
        '@kasik_allergen_intro',
        '@kasik_sync_queue',
        '@kasik_community_recipes',
        '@kasik_pantry_onboarding_done',
      ]);
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
