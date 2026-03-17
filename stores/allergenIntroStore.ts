/**
 * Kaşık — Allergen Introduction Store (Zustand)
 * Alerjen açma programları, reaksiyonlar — AsyncStorage ile persist
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllergenType } from '../types';
import {
  AllergenIntroProgramConfig,
  AllergenReactionResult,
  AllergenProgramReport,
} from '../constants/allergenIntro';
import { syncToFirestore } from '../lib/firestoreSync';
import { getAllergenPrograms } from '../lib/firestore';

interface AllergenIntroState {
  programs: AllergenIntroProgramConfig[];
  isLoaded: boolean;

  loadFromStorage: () => Promise<void>;
  syncFromFirestore: (userId: string) => Promise<void>;
  startProgram: (program: AllergenIntroProgramConfig) => void;
  recordReaction: (
    programId: string,
    day: number,
    mealId: string,
    reaction: AllergenReactionResult
  ) => void;
  completeProgram: (programId: string) => void;
  cancelProgram: (programId: string) => void;
  pauseProgram: (programId: string) => void;
  resumeProgram: (programId: string) => void;
  getActiveProgram: (allergenType?: AllergenType) => AllergenIntroProgramConfig | undefined;
  getActivePrograms: () => AllergenIntroProgramConfig[];
  getCompletedPrograms: () => AllergenIntroProgramConfig[];
  getPausedPrograms: () => AllergenIntroProgramConfig[];
  getAllPrograms: () => AllergenIntroProgramConfig[];
  getProgramReport: (programId: string) => AllergenProgramReport | undefined;
  getProgramDayStatus: (programId: string) => { currentDay: number; todayMeals: number; todayCompleted: number; lastReaction?: AllergenReactionResult } | undefined;
}

const STORAGE_KEY = '@kasik_allergen_intro';

const persistToStorage = async (programs: AllergenIntroProgramConfig[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  } catch (e) {
    console.error('Alerjen programı kaydedilemedi:', e);
  }
};

export const useAllergenIntroStore = create<AllergenIntroState>((set, get) => ({
  programs: [],
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data).map((p: any) => ({
          ...p,
          startDate: new Date(p.startDate),
          dailyPlan: p.dailyPlan.map((d: any) => ({
            ...d,
            meals: d.meals.map((m: any) => ({
              ...m,
              reaction: m.reaction
                ? { ...m.reaction, timestamp: new Date(m.reaction.timestamp) }
                : undefined,
            })),
          })),
        }));
        set({ programs: parsed, isLoaded: true });
      } else {
        set({ programs: [], isLoaded: true });
      }
    } catch (e) {
      console.error('Alerjen programı yüklenemedi:', e);
      set({ programs: [], isLoaded: true });
    }
  },

  syncFromFirestore: async (userId: string) => {
    try {
      const remotePrograms = await getAllergenPrograms(userId);
      if (remotePrograms.length > 0) {
        const parsed = remotePrograms.map((p: any) => ({
          ...p,
          startDate: p.startDate?.toDate ? p.startDate.toDate() : new Date(p.startDate),
          dailyPlan: (p.dailyPlan || []).map((d: any) => ({
            ...d,
            meals: (d.meals || []).map((m: any) => ({
              ...m,
              reaction: m.reaction
                ? {
                    ...m.reaction,
                    timestamp: m.reaction.timestamp?.toDate
                      ? m.reaction.timestamp.toDate()
                      : new Date(m.reaction.timestamp),
                  }
                : undefined,
            })),
          })),
        }));
        set({ programs: parsed });
        persistToStorage(parsed);
      }
    } catch (e) {
      console.warn('[AllergenIntroStore] Firestore sync failed:', e);
    }
  },

  startProgram: (program) => {
    const updated = [...get().programs, program];
    set({ programs: updated });
    persistToStorage(updated);
    syncToFirestore('allergen.save', (userId) => [userId, program]);
  },

  recordReaction: (programId, day, mealId, reaction) => {
    const updated = get().programs.map((p) => {
      if (p.id !== programId) return p;
      return {
        ...p,
        status: reaction.severity === 'severe' ? 'paused' as const : p.status,
        dailyPlan: p.dailyPlan.map((d) => {
          if (d.day !== day) return d;
          return {
            ...d,
            meals: d.meals.map((m) =>
              m.id === mealId ? { ...m, completed: true, reaction } : m
            ),
          };
        }),
      };
    });
    set({ programs: updated });
    persistToStorage(updated);
    const updatedProgram = updated.find((p) => p.id === programId);
    if (updatedProgram) {
      syncToFirestore('allergen.update', (userId) => [userId, programId, updatedProgram]);
    }
  },

  completeProgram: (programId) => {
    const updated = get().programs.map((p) =>
      p.id === programId ? { ...p, status: 'completed' as const } : p
    );
    set({ programs: updated });
    persistToStorage(updated);
    syncToFirestore('allergen.update', (userId) => [userId, programId, { status: 'completed' }]);
  },

  cancelProgram: (programId) => {
    const updated = get().programs.map((p) =>
      p.id === programId ? { ...p, status: 'cancelled' as const } : p
    );
    set({ programs: updated });
    persistToStorage(updated);
    syncToFirestore('allergen.update', (userId) => [userId, programId, { status: 'cancelled' }]);
  },

  pauseProgram: (programId) => {
    const updated = get().programs.map((p) =>
      p.id === programId ? { ...p, status: 'paused' as const } : p
    );
    set({ programs: updated });
    persistToStorage(updated);
    syncToFirestore('allergen.update', (userId) => [userId, programId, { status: 'paused' }]);
  },

  resumeProgram: (programId) => {
    const updated = get().programs.map((p) =>
      p.id === programId ? { ...p, status: 'active' as const } : p
    );
    set({ programs: updated });
    persistToStorage(updated);
    syncToFirestore('allergen.update', (userId) => [userId, programId, { status: 'active' }]);
  },

  getActiveProgram: (allergenType) => {
    const active = get().programs.filter((p) => p.status === 'active');
    if (allergenType) return active.find((p) => p.allergenType === allergenType);
    return active[0];
  },

  getActivePrograms: () => {
    return get().programs.filter((p) => p.status === 'active');
  },

  getCompletedPrograms: () => {
    return get().programs.filter((p) => p.status === 'completed');
  },

  getPausedPrograms: () => {
    return get().programs.filter((p) => p.status === 'paused');
  },

  getAllPrograms: () => {
    return get().programs;
  },

  getProgramReport: (programId) => {
    const program = get().programs.find((p) => p.id === programId);
    if (!program) return undefined;

    const allMeals = program.dailyPlan.flatMap((d) => d.meals);
    const completedMeals = allMeals.filter((m) => m.completed);
    const reactions = completedMeals
      .filter((m) => m.reaction)
      .map((m) => m.reaction!);

    const hasSevere = reactions.some((r) => r.severity === 'severe');
    const hasModerate = reactions.some((r) => r.severity === 'moderate');
    const hasMild = reactions.some((r) => r.severity === 'mild');

    let overallResult: 'safe' | 'caution' | 'allergic' | 'in_progress';
    if (program.status === 'active') {
      overallResult = 'in_progress';
    } else if (hasSevere) {
      overallResult = 'allergic';
    } else if (hasModerate || hasMild) {
      overallResult = 'caution';
    } else {
      overallResult = 'safe';
    }

    return {
      programId: program.id,
      allergenType: program.allergenType,
      startDate: program.startDate,
      endDate: program.status !== 'active' ? new Date() : undefined,
      status: program.status,
      totalMeals: allMeals.length,
      completedMeals: completedMeals.length,
      reactions,
      overallResult,
    };
  },

  getProgramDayStatus: (programId) => {
    const program = get().programs.find((p) => p.id === programId);
    if (!program) return undefined;

    const startDate = new Date(program.startDate);
    const now = new Date();
    const diffMs = now.getTime() - startDate.getTime();
    const currentDay = Math.min(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, program.totalDays);

    const todayPlan = program.dailyPlan.find((d) => d.day === currentDay);
    const todayMeals = todayPlan?.meals.length ?? 0;
    const todayCompleted = todayPlan?.meals.filter((m) => m.completed).length ?? 0;

    // Son reaksiyon
    const allReactions = program.dailyPlan
      .flatMap((d) => d.meals)
      .filter((m) => m.reaction)
      .map((m) => m.reaction!);
    const lastReaction = allReactions.length > 0 ? allReactions[allReactions.length - 1] : undefined;

    return { currentDay, todayMeals, todayCompleted, lastReaction };
  },
}));
